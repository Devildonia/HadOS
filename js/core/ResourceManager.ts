import { Utils } from '../utils.js';
import { Services } from './ServiceContainer.js';

export interface Disposable {
    dispose(): void;
}

export type ResourceKind = 'webgl' | 'audio' | 'listener' | 'timer' | 'other';

export interface IResourceManager {
    /**
     * Registers a resource with the manager under a specific owner.
     * @param owner The identifier of the owner (typically the app/module name)
     * @param kind The category/kind of resource
     * @param resource An object implementing Disposable
     * @returns An unregister function that removes the resource from the tracker without invoking dispose().
     */
    register(owner: string, kind: ResourceKind, resource: Disposable): () => void;
    disposeOwner(owner: string): void;
    disposeAll(): void;
    stats(): Record<ResourceKind, number> & { total: number; owners: number };
}

class ResourceManager implements IResourceManager {
    private registry: Map<string, Array<{ kind: ResourceKind; resource: Disposable }>> = new Map();

    /**
     * Registers a resource with the manager under a specific owner.
     * @returns An unregister function that removes the resource from the tracker without invoking dispose().
     */
    public register(owner: string, kind: ResourceKind, resource: Disposable): () => void {
        let ownerResources = this.registry.get(owner);
        if (!ownerResources) {
            ownerResources = [];
            this.registry.set(owner, ownerResources);
        }

        const entry = { kind, resource };
        ownerResources.push(entry);

        Utils.Logger.log(`[ResourceManager] Registered ${kind} resource for owner: ${owner}`);

        // Return a cleanup function
        return () => {
            const list = this.registry.get(owner);
            if (list) {
                const idx = list.indexOf(entry);
                if (idx !== -1) {
                    list.splice(idx, 1);
                }
                if (list.length === 0) {
                    this.registry.delete(owner);
                }
            }
        };
    }

    public disposeOwner(owner: string): void {
        const ownerResources = this.registry.get(owner);
        if (!ownerResources) return;

        Utils.Logger.log(`[ResourceManager] Disposing owner: ${owner} (LIFO order, count: ${ownerResources.length})`);

        // LIFO: last in, first out
        for (let i = ownerResources.length - 1; i >= 0; i--) {
            const entry = ownerResources[i];
            if (entry) {
                try {
                    entry.resource.dispose();
                } catch (err) {
                    console.error(`[ResourceManager] Error disposing resource of kind ${entry.kind} for owner ${owner}:`, err);
                }
            }
        }

        this.registry.delete(owner);
    }

    public disposeAll(): void {
        Utils.Logger.log(`[ResourceManager] Disposing all owners (count: ${this.registry.size})`);
        const owners = Array.from(this.registry.keys());
        for (const owner of owners) {
            this.disposeOwner(owner);
        }
    }

    public stats(): Record<ResourceKind, number> & { total: number; owners: number } {
        const counts: Record<ResourceKind, number> = {
            webgl: 0,
            audio: 0,
            listener: 0,
            timer: 0,
            other: 0
        };
        let total = 0;

        for (const list of this.registry.values()) {
            for (const entry of list) {
                counts[entry.kind]++;
                total++;
            }
        }

        return {
            ...counts,
            total,
            owners: this.registry.size
        };
    }
}

// Export class & interfaces
export { ResourceManager };

if (typeof window !== 'undefined') {
    Services.register('ResourceManager', new ResourceManager());
}
