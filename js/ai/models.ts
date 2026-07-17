/**
 * MODEL REGISTRY
 * The allowlist of models HadOS is willing to fetch and run.
 *
 * This exists as a SECURITY boundary, not for convenience. `ai.loadModel` is a
 * syscall reachable by isolated apps, and an app that could pass its own URL would
 * be handed a download primitive running under the OS's origin — it could pull
 * arbitrary bytes into the user's storage, fill the disk, or use the request itself
 * as a signal to a third-party host. Apps therefore name a model by **id**; only ids
 * listed here resolve to a URL, and the URL never crosses the syscall boundary.
 *
 * Adding an entry means committing to its host in the CSP `connect-src`. Keep both
 * in step — see `docs/ai/phase-0-substrate-and-paint.md`.
 */

import type { IModelSpec } from './AiModelCache';

/** What a model is for. Lets a caller ask for a task without knowing an id. */
export type ModelTask = 'segmentation';

export interface IRegisteredModel extends IModelSpec {
    task: ModelTask;
    /** Human-readable, for consent prompts and a future "manage models" screen. */
    label: string;
    /** Square input resolution the model was trained at. Verified against the
     *  runtime's own `getInputDetails()` at load — this is a hint, not the truth. */
    inputSize: number;
    /** Number of output classes. DeepLab v3 emits PASCAL VOC's 21. */
    classes: number;
    /** Index of the "background" class in the output. Everything else is subject. */
    backgroundClass: number;
}

/**
 * DeepLab v3 over PASCAL VOC's 21 classes, chosen over MediaPipe's Selfie Segmenter
 * (which is 10x smaller) because Pinta opens arbitrary images: the selfie model only
 * knows people, and would return an empty mask for a photo of a dog or a car.
 *
 * The URL is deliberately the versioned `/1/` path rather than `/latest/`: both serve
 * these exact bytes today, but `latest` may be republished, which would break the
 * hash below and hard-fail every load. Pinned bytes need a pinned URL.
 *
 * bytes + sha256 verified against the live object on 2026-07-17.
 */
const DEEPLAB_V3: IRegisteredModel = {
    id: 'deeplab-v3-float32',
    url: 'https://storage.googleapis.com/mediapipe-models/image_segmenter/deeplab_v3/float32/1/deeplab_v3.tflite',
    bytes: 2780176,
    sha256: 'ff36e24d40547fe9e645e2f4e8745d1876d6e38b332d39a82f0bf0f5d1d561b3',
    task: 'segmentation',
    label: 'DeepLab v3 (image segmentation)',
    inputSize: 257,
    classes: 21,
    backgroundClass: 0,
};

const REGISTRY: readonly IRegisteredModel[] = Object.freeze([DEEPLAB_V3]);

/** The host every registered model is served from; mirrored in the CSP connect-src. */
export const MODEL_HOSTS: readonly string[] = Object.freeze(['https://storage.googleapis.com']);

/** Resolves an id to its spec, or null if it is not on the allowlist. */
export function getModel(id: string): IRegisteredModel | null {
    return REGISTRY.find(m => m.id === id) ?? null;
}

/** The default model for a task — what `AI.segment()` reaches for. */
export function getModelForTask(task: ModelTask): IRegisteredModel | null {
    return REGISTRY.find(m => m.task === task) ?? null;
}

export function listModels(): readonly IRegisteredModel[] {
    return REGISTRY;
}

export { DEEPLAB_V3 };
