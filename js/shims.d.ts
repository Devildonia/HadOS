interface Window {
    // Project services/singletons
    CONFIG: any;
    Services: any;
    Utils: any;
    themeManager: any;
    ragdollPet: any;

    // OS global bridging
    state: any;
    familyData: any;
    playBlip: any;
    openWindow: any;
    closeWindow: any;
    openDialog: any;
    closeDialog: any;
    navigateIE: any;
    handleShutdown: any;
    initOS: any;
    setupEventListeners: any;
    initializeWindowControls: any;
    initializeDraggableIcons: any;
    setWallpaper: any;
    setTaskbarColor: any;
    handleWallpaperUpload: any;
    _createStateBridge: any;

    // Third-party
    Webamp: any;
    Matter: any;
    webkitAudioContext: any;

    // Legacy ragdoll globals (registered for standalone/game compatibility)
    BloodParticle: any;
    ZzzParticle: any;
    TearParticle: any;
    RagdollPet: any;
}
