interface Window {
    // Project services/singletons
    CONFIG: unknown;
    Services: unknown;
    Utils: unknown;
    themeManager: unknown;
    ragdollPet: unknown;

    // OS global bridging
    state?: Record<string, unknown>;
    familyData: unknown;
    playBlip?: (freq?: number) => void;
    openWindow?: (id: string) => void;
    closeWindow?: (id: string) => void;
    openDialog?: (id: string) => void;
    closeDialog?: (id: string) => void;
    navigateIE: unknown;
    handleShutdown: unknown;
    initOS: unknown;
    setupEventListeners: unknown;
    initializeWindowControls: unknown;
    initializeDraggableIcons: unknown;
    setWallpaper: unknown;
    setTaskbarColor: unknown;
    handleWallpaperUpload: unknown;
    _createStateBridge: unknown;

    // Third-party
    Webamp: unknown;
    Matter: unknown;
    webkitAudioContext: unknown;

    // Legacy ragdoll globals (registered for standalone/game compatibility)
    BloodParticle: unknown;
    ZzzParticle: unknown;
    TearParticle: unknown;
    RagdollPet: unknown;
}
