/**
 * SEGMENTATION — the pixel work around the model
 * Turns an ImageData into the tensor DeepLab wants, turns its per-pixel class
 * scores back into a subject mask, and applies that mask as alpha.
 *
 * Deliberately free of canvas and of the runtime: it is plain arithmetic over typed
 * arrays, so jsdom can test it (jsdom implements no `getContext`) and so the same
 * code could run in a worker later. Nothing here knows LiteRT exists.
 */

import type { IRegisteredModel } from './models';

/**
 * DeepLab v3's normalisation, read from the model file's own TFLITE_METADATA
 * (`NormalizationOptions`: mean [127.5], std [127.5]) rather than from prose:
 * `(px - 127.5) / 127.5` maps 0..255 onto **[-1, 1]**.
 *
 * Getting this wrong does not throw — it produces a confident, plausible, wrong
 * mask, which is far worse than a crash.
 */
export const INPUT_MEAN = 127.5;
export const INPUT_STD = 127.5;

/**
 * What a transparent pixel is composited over before the model sees it.
 *
 * Pinta's canvas bitmap is transparent where nothing was drawn — the white the user
 * sees is the CSS `background` under it. Feed the raw buffer to the model and every
 * untouched pixel arrives as RGB(0,0,0): the model would segment a **black** frame
 * while the user looks at a white one. Compositing over white is what makes the
 * model's input the image the user actually sees.
 */
export const CANVAS_BACKDROP: readonly [number, number, number] = [255, 255, 255];

/**
 * Resamples an ImageData to `size`×`size` and normalises it into the model's input
 * tensor, laid out NHWC as `[1, size, size, 3]` — the shape the compiled graph
 * reports.
 *
 * Bilinear rather than nearest: the source is a photo being shrunk (usually by a
 * lot), and dropping 99% of the pixels instead of averaging them costs real mask
 * quality along edges. Each of the four taps is composited over the backdrop
 * *before* blending — compositing after would let a transparent neighbour drag a
 * solid pixel's colour toward the backdrop.
 */
export function imageDataToTensor(
    img: ImageData,
    size: number,
    backdrop: readonly [number, number, number] = CANVAS_BACKDROP,
): Float32Array {
    const out = new Float32Array(size * size * 3);
    const { width: sw, height: sh, data } = img;
    if (sw === 0 || sh === 0) return out;

    /** One channel of a source pixel, composited over the backdrop. */
    const tap = (i: number, c: number): number => {
        const a = (data[i + 3] ?? 255) / 255;
        return (data[i + c] ?? 0) * a + (backdrop[c] ?? 255) * (1 - a);
    };

    // Map each destination pixel to the centre of its source footprint, so the
    // sampling grid stays centred instead of drifting half a pixel to the corner.
    const scaleX = sw / size;
    const scaleY = sh / size;

    for (let y = 0; y < size; y++) {
        const sy = Math.min(sh - 1, Math.max(0, (y + 0.5) * scaleY - 0.5));
        const y0 = Math.floor(sy);
        const y1 = Math.min(sh - 1, y0 + 1);
        const fy = sy - y0;

        for (let x = 0; x < size; x++) {
            const sx = Math.min(sw - 1, Math.max(0, (x + 0.5) * scaleX - 0.5));
            const x0 = Math.floor(sx);
            const x1 = Math.min(sw - 1, x0 + 1);
            const fx = sx - x0;

            const i00 = (y0 * sw + x0) * 4;
            const i01 = (y0 * sw + x1) * 4;
            const i10 = (y1 * sw + x0) * 4;
            const i11 = (y1 * sw + x1) * 4;
            const o = (y * size + x) * 3;

            for (let c = 0; c < 3; c++) {
                const top = tap(i00, c) * (1 - fx) + tap(i01, c) * fx;
                const bottom = tap(i10, c) * (1 - fx) + tap(i11, c) * fx;
                out[o + c] = (top * (1 - fy) + bottom * fy - INPUT_MEAN) / INPUT_STD;
            }
        }
    }
    return out;
}

/**
 * Collapses the model's `[1, size, size, classes]` scores into one byte per pixel:
 * 1 where the winning class is anything but background, 0 where it is background.
 *
 * No softmax: argmax is invariant under it (softmax is monotonic), so normalising
 * the scores first would only cost a pass over 1.4M floats to reach the same answer.
 */
export function subjectMask(
    logits: Float32Array,
    size: number,
    classes: number,
    backgroundClass: number,
): Uint8Array {
    const mask = new Uint8Array(size * size);
    for (let p = 0; p < size * size; p++) {
        const base = p * classes;
        let best = 0;
        let bestScore = -Infinity;
        for (let c = 0; c < classes; c++) {
            const v = logits[base + c] ?? -Infinity;
            if (v > bestScore) { bestScore = v; best = c; }
        }
        mask[p] = best === backgroundClass ? 0 : 1;
    }
    return mask;
}

/** How much of the frame the subject covers, 0..1. */
export function maskCoverage(mask: Uint8Array): number {
    if (mask.length === 0) return 0;
    let n = 0;
    for (let i = 0; i < mask.length; i++) if (mask[i]) n++;
    return n / mask.length;
}

/**
 * Clears the background by zeroing its alpha, in place.
 *
 * The mask is upscaled **nearest-neighbour**, never bilinear: these are class
 * decisions, not colours. Interpolating between "person" and "background" invents a
 * value that means neither.
 */
export function applySubjectMask(img: ImageData, mask: Uint8Array, maskSize: number): ImageData {
    const { width, height, data } = img;
    for (let y = 0; y < height; y++) {
        const my = Math.min(maskSize - 1, Math.floor((y + 0.5) * maskSize / height));
        for (let x = 0; x < width; x++) {
            const mx = Math.min(maskSize - 1, Math.floor((x + 0.5) * maskSize / width));
            if (!mask[my * maskSize + mx]) data[(y * width + x) * 4 + 3] = 0;
        }
    }
    return img;
}

/**
 * Reads the model's true input side length off the compiled graph's shape, falling
 * back to the registry's hint.
 *
 * The graph is the authority: the registry records what we believe we pinned, and if
 * the two ever disagree the bytes are right and the note is stale.
 */
export function inputSizeFor(model: IRegisteredModel, inputShape: number[] | undefined): number {
    // NHWC: [batch, height, width, channels].
    const h = inputShape?.[1];
    return typeof h === 'number' && h > 0 ? h : model.inputSize;
}
