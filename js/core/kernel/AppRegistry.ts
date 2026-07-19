import { Utils } from '../../utils.js';
import type { IKernelRegistry } from './KernelTypes.js';
import type { IWindowsAppConstructor, IAppMetadata } from '../Types.js';

export class AppRegistry {
    private registry: IKernelRegistry;

    constructor(registry: IKernelRegistry) {
        this.registry = registry;
    }

    public registerApp(id: string, appClass: IWindowsAppConstructor, metadata: IAppMetadata): void {
        this.registry.apps[id] = { appClass, metadata };
        Utils.Logger.log(`Kernel: App registered [${id}]`);
    }

    public unregisterApp(id: string): boolean {
        if (this.registry.apps[id]) {
            delete this.registry.apps[id];
            Utils.Logger.log(`Kernel: App unregistered [${id}]`);
            return true;
        }
        return false;
    }
}
