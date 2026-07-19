import type { IWindowsAppConstructor, IAppMetadata, IProcess } from '../Types';

export interface IAppRegistryEntry {
    appClass: IWindowsAppConstructor;
    metadata: IAppMetadata;
}

export interface IKernelRegistry {
    apps: Record<string, IAppRegistryEntry>;
    processes: Map<number, IProcess>;
}
