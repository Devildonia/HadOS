export const Utils = {
    clamp: (v, min, max) => Math.max(min, Math.min(max, v)),
    lerp: (a, b, t) => a + (b - a) * t,
    rand: (min, max) => Math.random() * (max - min) + min,
    rectIntersect: (r1, r2) => {
        return !(r2.left > r1.right ||
            r2.right < r1.left ||
            r2.top > r1.bottom ||
            r2.bottom < r1.top);
    },
    circleRectCollide: (cx, cy, r, rx, ry, rw, rh) => {
        const testX = Math.max(rx, Math.min(cx, rx + rw));
        const testY = Math.max(ry, Math.min(cy, ry + rh));
        const distX = cx - testX;
        const distY = cy - testY;
        return (distX * distX + distY * distY) <= (r * r);
    }
};
