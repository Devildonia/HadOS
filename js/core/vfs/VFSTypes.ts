export interface IVFSNode {
    name: string;
    type: 'dir' | 'file' | 'shortcut';
    children?: Record<string, IVFSNode>;
    content?: string;
    blobRef?: string;
    size?: number;
    mime?: string;
    icon?: string;
    actionType?: string;
    actionTarget?: string;
    hidden?: boolean;
    i18nKey?: string;
    trashOrigin?: string;
    trashedAt?: number;
}

export interface ITrashEntry {
    id: string;
    name: string;
    origin: string;
    type: 'dir' | 'file' | 'shortcut';
    deletedAt: number;
}

export interface IVFS {
    init(): Promise<void>;
    resolve(path: string): IVFSNode | null;
    mkdir(path: string, name: string): boolean;
    writeFile(path: string, name: string, content: string): boolean;
    readFile(path: string): string | null;
    readFileAsync(path: string): Promise<string | Blob | null>;
    writeFileAsync(path: string, name: string, data: string | Blob): Promise<boolean>;
    deleteNode(parentPath: string, name: string): boolean;
    trashNode(parentPath: string, name: string): boolean;
    listTrash(): ITrashEntry[];
    trashCount(): number;
    restoreFromTrash(id: string): boolean;
    emptyTrash(): void;
    rename(parentPath: string, oldName: string, newName: string): boolean;
    listDir(path: string): string[] | null;
    flush(): Promise<void>;
    flushSync(): void;
    getRoot(): IVFSNode | null;
    __reset(): void;
}
