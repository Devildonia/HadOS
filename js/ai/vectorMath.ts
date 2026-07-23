/**
 * VECTOR MATH (pure)
 * The retrieval and projection math over real MiniLM embeddings: cosine top-K
 * for the Doc Explorer's semantic search, and a small PCA so the vector-space
 * canvas can finally show REAL structure instead of decorative random points.
 *
 * Everything operates on row-major Float32Array matrices [n × dim] whose rows
 * are L2-normalised (the engine guarantees it), so cosine similarity is a dot
 * product. Pure and allocation-conscious; pinned by tests.
 */

export interface IScoredIndex {
    index: number;
    /** Cosine similarity, -1..1 (rows are unit vectors). */
    score: number;
}

/** Dot product of row `row` of `matrix` with `query` (both length `dim`). */
function rowDot(query: Float32Array, matrix: Float32Array, row: number, dim: number): number {
    let dot = 0;
    const off = row * dim;
    for (let i = 0; i < dim; i++) dot += query[i]! * matrix[off + i]!;
    return dot;
}

/**
 * Top-K rows of `matrix` by cosine similarity to `query`, highest first,
 * ties broken by row order. K is clamped to n.
 */
export function semanticTopK(query: Float32Array, matrix: Float32Array, dim: number, k: number): IScoredIndex[] {
    const n = Math.floor(matrix.length / dim);
    const scored: IScoredIndex[] = [];
    for (let r = 0; r < n; r++) scored.push({ index: r, score: rowDot(query, matrix, r, dim) });
    scored.sort((a, b) => b.score - a.score || a.index - b.index);
    return scored.slice(0, Math.max(0, Math.min(k, n)));
}

/**
 * Projects [n × dim] onto its top-3 principal components → [n × 3], each output
 * axis scaled to [-1, 1]. Classic power iteration with deflation over the
 * centered data — deterministic (fixed pseudo-random init), no dependencies,
 * and plenty for a visualisation: the canvas needs honest structure, not SVD
 * to machine precision.
 */
export function pca3(matrix: Float32Array, n: number, dim: number): Float32Array {
    const out = new Float32Array(n * 3);
    if (n === 0 || dim === 0) return out;

    // Center a working copy.
    const centered = Float32Array.from(matrix);
    const mean = new Float32Array(dim);
    for (let r = 0; r < n; r++) {
        const off = r * dim;
        for (let i = 0; i < dim; i++) mean[i]! += centered[off + i]!;
    }
    for (let i = 0; i < dim; i++) mean[i]! /= n;
    for (let r = 0; r < n; r++) {
        const off = r * dim;
        for (let i = 0; i < dim; i++) centered[off + i]! -= mean[i]!;
    }

    // A single point (or all-identical rows) has no directions — leave zeros.
    const POWER_ITERS = 30;
    const component = new Float32Array(dim);

    for (let c = 0; c < 3; c++) {
        // Deterministic init: varied enough to not be orthogonal to the data.
        for (let i = 0; i < dim; i++) component[i] = Math.sin(1 + i * 0.7 + c * 2.3);

        for (let it = 0; it < POWER_ITERS; it++) {
            // v ← Xᵀ (X v), normalised — power iteration on the covariance.
            const proj = new Float32Array(n);
            for (let r = 0; r < n; r++) proj[r] = rowDot(component, centered, r, dim);
            const next = new Float32Array(dim);
            for (let r = 0; r < n; r++) {
                const off = r * dim;
                const p = proj[r]!;
                for (let i = 0; i < dim; i++) next[i]! += p * centered[off + i]!;
            }
            let norm = 0;
            for (let i = 0; i < dim; i++) norm += next[i]! * next[i]!;
            norm = Math.sqrt(norm);
            if (norm < 1e-12) { next.fill(0); component.set(next); break; }
            for (let i = 0; i < dim; i++) component[i] = next[i]! / norm;
        }

        // Project every row onto the component, track the scale.
        let maxAbs = 0;
        for (let r = 0; r < n; r++) {
            const p = rowDot(component, centered, r, dim);
            out[r * 3 + c] = p;
            if (Math.abs(p) > maxAbs) maxAbs = Math.abs(p);
        }
        if (maxAbs > 1e-12) {
            for (let r = 0; r < n; r++) out[r * 3 + c]! /= maxAbs;
        }

        // Deflate: remove the found direction from the data.
        for (let r = 0; r < n; r++) {
            const off = r * dim;
            const p = rowDot(component, centered, r, dim);
            for (let i = 0; i < dim; i++) centered[off + i]! -= p * component[i]!;
        }
    }

    return out;
}
