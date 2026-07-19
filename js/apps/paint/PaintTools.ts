/**
 * PAINT TOOLS
 * Individual drawing and image manipulation operations.
 */

export function floodFill(
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    fillColorHex: string
): void {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    if (startX < 0 || startX >= width || startY < 0 || startY >= height) return;

    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    const targetColor = hexToRgba(fillColorHex);
    const startIdx = (startY * width + startX) * 4;
    const startR = data[startIdx]!;
    const startG = data[startIdx + 1]!;
    const startB = data[startIdx + 2]!;
    const startA = data[startIdx + 3]!;

    // If target color is same as start color, do nothing
    if (
        startR === targetColor[0] &&
        startG === targetColor[1] &&
        startB === targetColor[2] &&
        startA === targetColor[3]
    ) {
        return;
    }

    const queue: [number, number][] = [[startX, startY]];
    const visited = new Uint8Array(width * height);
    const startIdxVal = startY * width + startX;
    visited[startIdxVal] = 1;

    // Standard BFS flood fill
    let head = 0;
    while (head < queue.length) {
        const current = queue[head];
        if (!current) break;
        const cx = current[0];
        const cy = current[1];
        head++;

        const idx = (cy * width + cx) * 4;
        data[idx] = targetColor[0];
        data[idx + 1] = targetColor[1];
        data[idx + 2] = targetColor[2];
        data[idx + 3] = targetColor[3];

        const neighbors: [number, number][] = [
            [cx + 1, cy],
            [cx - 1, cy],
            [cx, cy + 1],
            [cx, cy - 1]
        ];

        for (const neighbor of neighbors) {
            const nx = neighbor[0];
            const ny = neighbor[1];
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                const nIdx = ny * width + nx;
                if (!visited[nIdx]) {
                    visited[nIdx] = 1;
                    const pIdx = nIdx * 4;
                    if (
                        colorMatch(
                            data[pIdx]!, data[pIdx + 1]!, data[pIdx + 2]!, data[pIdx + 3]!,
                            startR, startG, startB, startA
                        )
                    ) {
                        queue.push([nx, ny]);
                    }
                }
            }
        }
    }

    ctx.putImageData(imgData, 0, 0);
}

export function getPixelColor(ctx: CanvasRenderingContext2D, x: number, y: number): string {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    if (x < 0 || x >= width || y < 0 || y >= height) return '#000000';

    try {
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        return rgbToHex(pixel[0] ?? 0, pixel[1] ?? 0, pixel[2] ?? 0);
    } catch {
        return '#000000';
    }
}

export function drawText(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    text: string,
    color: string,
    fontSize: number = 14
): void {
    ctx.font = `${fontSize}px "Outfit", sans-serif`;
    ctx.fillStyle = color;
    ctx.textBaseline = 'top';
    ctx.fillText(text, x, y);
}

function hexToRgba(hex: string): [number, number, number, number] {
    let c = hex.substring(1);
    if (c.length === 3) {
        const c0 = c[0] ?? '';
        const c1 = c[1] ?? '';
        const c2 = c[2] ?? '';
        c = c0 + c0 + c1 + c1 + c2 + c2;
    }
    const num = parseInt(c, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255, 255];
}

function rgbToHex(r: number, g: number, b: number): string {
    const toHex = (c: number) => {
        const hex = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return '#' + toHex(r) + toHex(g) + toHex(b);
}

function colorMatch(
    r1: number, g1: number, b1: number, a1: number,
    r2: number, g2: number, b2: number, a2: number
): boolean {
    const threshold = 15;
    return (
        Math.abs(r1 - r2) <= threshold &&
        Math.abs(g1 - g2) <= threshold &&
        Math.abs(b1 - b2) <= threshold &&
        Math.abs(a1 - a2) <= threshold
    );
}

export function invertColors(ctx: CanvasRenderingContext2D): void {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i]!;     // R
        data[i + 1] = 255 - data[i + 1]!; // G
        data[i + 2] = 255 - data[i + 2]!; // B
    }

    ctx.putImageData(imgData, 0, 0);
}

export function convertToGrayscale(ctx: CanvasRenderingContext2D): void {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i]!;
        const g = data[i + 1]!;
        const b = data[i + 2]!;
        // Standard NTSC grayscale weights
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
    }

    ctx.putImageData(imgData, 0, 0);
}
