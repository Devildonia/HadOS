import { describe, it, expect } from 'vitest';
import {
    imageDataToTensor,
    subjectMask,
    maskCoverage,
    applySubjectMask,
    inputSizeFor,
    INPUT_MEAN,
    INPUT_STD,
    CANVAS_BACKDROP,
} from '../js/ai/segmentation';
import { DEEPLAB_V3 } from '../js/ai/models';

/** jsdom has no ImageData constructor in every version — build the shape by hand. */
function imageData(width: number, height: number, fill?: (x: number, y: number) => [number, number, number, number]): ImageData {
    const data = new Uint8ClampedArray(width * height * 4);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const [r, g, b, a] = fill ? fill(x, y) : [0, 0, 0, 255];
            const i = (y * width + x) * 4;
            data[i] = r; data[i + 1] = g; data[i + 2] = b; data[i + 3] = a;
        }
    }
    return { width, height, data, colorSpace: 'srgb' } as ImageData;
}

describe('imageDataToTensor', () => {
    it('emits exactly the NHWC element count the model wants', () => {
        const t = imageDataToTensor(imageData(4, 4), 257);
        expect(t.length).toBe(257 * 257 * 3); // [1,257,257,3] flattened
    });

    it('maps 0..255 onto [-1, 1] using the metadata mean and std', () => {
        // Read from the model's own TFLITE_METADATA NormalizationOptions, not prose.
        expect(INPUT_MEAN).toBe(127.5);
        expect(INPUT_STD).toBe(127.5);

        const black = imageDataToTensor(imageData(2, 2, () => [0, 0, 0, 255]), 2);
        const white = imageDataToTensor(imageData(2, 2, () => [255, 255, 255, 255]), 2);
        const mid = imageDataToTensor(imageData(2, 2, () => [128, 128, 128, 255]), 2);

        expect(black[0]).toBeCloseTo(-1, 5);
        expect(white[0]).toBeCloseTo(1, 5);
        expect(mid[0]).toBeCloseTo((128 - 127.5) / 127.5, 5);
        // A wrong range does not throw — it returns a confident, wrong mask. Pin it.
        for (const v of white) expect(v).toBeLessThanOrEqual(1);
        for (const v of black) expect(v).toBeGreaterThanOrEqual(-1);
    });

    it('composites transparent pixels over white, not over black', () => {
        // Pinta's bitmap is transparent where nothing was drawn; the white is CSS.
        // Read raw, an untouched pixel is RGB(0,0,0) and the model would segment a
        // black frame while the user looks at a white one.
        const t = imageDataToTensor(imageData(2, 2, () => [0, 0, 0, 0]), 2);
        expect(t[0]).toBeCloseTo(1, 5); // white, i.e. +1 — not -1
        expect(CANVAS_BACKDROP).toEqual([255, 255, 255]);
    });

    it('composites semi-transparent pixels proportionally', () => {
        // 50% black over white -> ~127.5 -> ~0
        const t = imageDataToTensor(imageData(2, 2, () => [0, 0, 0, 128]), 2);
        expect(t[0]!).toBeCloseTo((255 * (1 - 128 / 255) - 127.5) / 127.5, 2);
    });

    it('honours an explicit backdrop', () => {
        const t = imageDataToTensor(imageData(2, 2, () => [0, 0, 0, 0]), 2, [0, 0, 0]);
        expect(t[0]).toBeCloseTo(-1, 5);
    });

    it('keeps channels distinct rather than smearing them', () => {
        const t = imageDataToTensor(imageData(2, 2, () => [255, 0, 0, 255]), 1);
        expect(t[0]).toBeCloseTo(1, 5);   // R
        expect(t[1]).toBeCloseTo(-1, 5);  // G
        expect(t[2]).toBeCloseTo(-1, 5);  // B
    });

    it('averages when shrinking instead of dropping pixels', () => {
        // A 2x1 image, one black pixel and one white, sampled down to 1x1: bilinear
        // lands between them. Nearest would pick a side and lose half the picture.
        const src = imageData(2, 1, (x) => (x === 0 ? [0, 0, 0, 255] : [255, 255, 255, 255]));
        const t = imageDataToTensor(src, 1);
        expect(t[0]!).toBeGreaterThan(-1);
        expect(t[0]!).toBeLessThan(1);
    });

    it('upscales without reading out of bounds', () => {
        const t = imageDataToTensor(imageData(1, 1, () => [255, 255, 255, 255]), 8);
        expect(t.length).toBe(8 * 8 * 3);
        for (const v of t) expect(v).toBeCloseTo(1, 5); // uniform source stays uniform
    });

    it('survives an empty image rather than throwing', () => {
        const t = imageDataToTensor(imageData(0, 0), 4);
        expect(t.length).toBe(4 * 4 * 3);
        expect(t.every(v => v === 0)).toBe(true);
    });
});

describe('subjectMask', () => {
    /** Builds logits where every pixel's winner is `cls`. */
    const logitsAll = (size: number, classes: number, cls: number) => {
        const out = new Float32Array(size * size * classes);
        for (let p = 0; p < size * size; p++) out[p * classes + cls] = 10;
        return out;
    };

    it('marks background as 0 and anything else as 1', () => {
        const size = 4, classes = 21;
        expect([...subjectMask(logitsAll(size, classes, 0), size, classes, 0)].every(v => v === 0)).toBe(true);
        expect([...subjectMask(logitsAll(size, classes, 15), size, classes, 0)].every(v => v === 1)).toBe(true);
    });

    it('takes the argmax per pixel, not a threshold', () => {
        const classes = 3;
        // One pixel: class 2 wins on score even though class 0 is positive.
        const logits = Float32Array.from([0.4, 0.1, 0.5]);
        expect(subjectMask(logits, 1, classes, 0)[0]).toBe(1);
        // Now class 0 (background) wins.
        expect(subjectMask(Float32Array.from([0.9, 0.1, 0.5]), 1, classes, 0)[0]).toBe(0);
    });

    it('handles negative scores (logits are not probabilities)', () => {
        // No softmax is applied — argmax is invariant under it, so raw scores must
        // work, including all-negative ones.
        expect(subjectMask(Float32Array.from([-9, -1, -5]), 1, 3, 0)[0]).toBe(1);
        expect(subjectMask(Float32Array.from([-1, -9, -5]), 1, 3, 0)[0]).toBe(0);
    });

    it('respects a background class that is not zero', () => {
        expect(subjectMask(Float32Array.from([0.1, 0.9]), 1, 2, 1)[0]).toBe(0);
        expect(subjectMask(Float32Array.from([0.9, 0.1]), 1, 2, 1)[0]).toBe(1);
    });

    it('produces one byte per pixel', () => {
        expect(subjectMask(logitsAll(8, 21, 0), 8, 21, 0).length).toBe(64);
    });
});

describe('maskCoverage', () => {
    it('reports the subject fraction', () => {
        expect(maskCoverage(Uint8Array.from([1, 1, 0, 0]))).toBe(0.5);
        expect(maskCoverage(Uint8Array.from([0, 0, 0, 0]))).toBe(0);
        expect(maskCoverage(Uint8Array.from([1, 1, 1, 1]))).toBe(1);
    });

    it('does not divide by zero on an empty mask', () => {
        expect(maskCoverage(new Uint8Array(0))).toBe(0);
    });
});

describe('applySubjectMask', () => {
    it('clears background alpha and leaves the subject alone', () => {
        // A `size` of 2 means a 2x2 mask — four cells, not two.
        const img = imageData(2, 2, () => [10, 20, 30, 255]);
        applySubjectMask(img, Uint8Array.from([1, 0, 1, 0]), 2);

        const alphaAt = (x: number, y: number) => img.data[(y * 2 + x) * 4 + 3];
        expect(alphaAt(0, 0)).toBe(255); // subject kept, fully opaque
        expect(alphaAt(1, 0)).toBe(0);   // background cleared
    });

    it('leaves colour channels untouched, so undo restores exactly', () => {
        const img = imageData(1, 1, () => [10, 20, 30, 255]);
        applySubjectMask(img, Uint8Array.from([0]), 1);
        expect([img.data[0], img.data[1], img.data[2]]).toEqual([10, 20, 30]);
    });

    it('upscales the mask nearest-neighbour, never blending class ids', () => {
        // A 2x2 mask over a 4x4 image: each mask cell covers a 2x2 block, and the
        // boundary must stay hard. Interpolating between "person" and "background"
        // would invent a value meaning neither.
        const img = imageData(4, 4, () => [0, 0, 0, 255]);
        applySubjectMask(img, Uint8Array.from([1, 0, 0, 1]), 2);

        const alphaAt = (x: number, y: number) => img.data[(y * 4 + x) * 4 + 3];
        expect([alphaAt(0, 0), alphaAt(1, 0), alphaAt(2, 0), alphaAt(3, 0)]).toEqual([255, 255, 0, 0]);
        expect([alphaAt(0, 3), alphaAt(1, 3), alphaAt(2, 3), alphaAt(3, 3)]).toEqual([0, 0, 255, 255]);
        // Only 0 or 255 anywhere — no interpolated in-between alpha.
        for (let i = 3; i < img.data.length; i += 4) expect([0, 255]).toContain(img.data[i]);
    });

    it('maps a non-square image onto the square mask', () => {
        const img = imageData(8, 2, () => [0, 0, 0, 255]);
        applySubjectMask(img, Uint8Array.from([1, 0, 1, 0]), 2);
        const alphaAt = (x: number, y: number) => img.data[(y * 8 + x) * 4 + 3];
        expect(alphaAt(0, 0)).toBe(255); // left half -> mask column 0 -> subject
        expect(alphaAt(7, 0)).toBe(0);   // right half -> mask column 1 -> background
    });

    it('returns the same buffer it was given (mutates in place)', () => {
        const img = imageData(1, 1);
        expect(applySubjectMask(img, Uint8Array.from([1]), 1)).toBe(img);
    });
});

describe('inputSizeFor', () => {
    it('trusts the compiled graph over the registry hint', () => {
        // The registry records what we believe we pinned; if they disagree the bytes
        // are right and the note is stale.
        expect(inputSizeFor(DEEPLAB_V3, [1, 129, 129, 3])).toBe(129);
    });

    it('falls back to the registry when the shape is unusable', () => {
        expect(inputSizeFor(DEEPLAB_V3, undefined)).toBe(DEEPLAB_V3.inputSize);
        expect(inputSizeFor(DEEPLAB_V3, [])).toBe(DEEPLAB_V3.inputSize);
        expect(inputSizeFor(DEEPLAB_V3, [1, 0, 0, 3])).toBe(DEEPLAB_V3.inputSize);
    });

    it('agrees with the pinned model in the normal case', () => {
        expect(inputSizeFor(DEEPLAB_V3, [1, 257, 257, 3])).toBe(257);
        expect(DEEPLAB_V3.inputSize).toBe(257);
    });
});
