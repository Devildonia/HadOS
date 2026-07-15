// fake-indexeddb/auto MUST be imported before VFSStore: VFSStore captures whether
// IndexedDB is available at module-load time. This file is the only place that pulls
// in fake-indexeddb, so the rest of the suite keeps using the localStorage fallback.
import 'fake-indexeddb/auto';
import { describe, it, expect } from 'vitest';
import { VFSStore } from '../js/core/VFSStore.js';

const LEGACY_KEY = 'win95_vfs_root';

describe('VFSStore — IndexedDB backend (Phase 0.1)', () => {
    it('selects IndexedDB when available', () => {
        expect(VFSStore.usingIndexedDB()).toBe(true);
    });

    it('round-trips save/load through IndexedDB', async () => {
        await VFSStore.save('{"hello":"idb"}');
        expect(await VFSStore.load()).toBe('{"hello":"idb"}');
    });

    it('clears the stored tree', async () => {
        await VFSStore.save('{"x":1}');
        await VFSStore.clear();
        expect(await VFSStore.load()).toBeNull();
    });

    it('migrates a legacy localStorage tree into IndexedDB on first load', async () => {
        await VFSStore.clear();
        localStorage.setItem(LEGACY_KEY, '{"legacy":true}');

        const loaded = await VFSStore.load();
        expect(loaded).toBe('{"legacy":true}');

        // Legacy entry is consumed and the data now lives in IndexedDB.
        expect(localStorage.getItem(LEGACY_KEY)).toBeNull();
        expect(await VFSStore.load()).toBe('{"legacy":true}');
    });
});
