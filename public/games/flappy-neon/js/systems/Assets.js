export class AssetManager {
    constructor() {
        this.images = {};
        this.audio = {};
        this.total = 0;
        this.loaded = 0;
    }

    async loadAll() {
        const imageList = [
            { key: 'neon', src: 'assets/neon.webp' },
            { key: 'neon_wings', src: 'assets/neon_wings.webp' },
            { key: 'neon_wings_1', src: 'assets/neon_wings_1.webp' },
            { key: 'neon_wings_2', src: 'assets/neon_wings_2.webp' },
            { key: 'neon_wings_3', src: 'assets/neon_wings_3.webp' },
            { key: 'neon_wings_4', src: 'assets/neon_wings_4.webp' },
            { key: 'neon_wings_5', src: 'assets/neon_wings_5.webp' }
        ];

        // Audio is handled by AudioManager, but we could preload here if we wanted consistent "loading bar".
        // For now, let's just ensure the main sprite is loaded.

        this.total = imageList.length;

        const promises = imageList.map(img => this.loadImage(img.key, img.src));
        await Promise.all(promises);
    }

    loadImage(key, src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.images[key] = img;
                this.loaded++;
                resolve(img);
            };
            img.onerror = (e) => {
                console.error(`Failed to load image: ${src}`, e);
                // Resolve anyway to not block game, maybe use a placeholder
                resolve(null);
            };
            img.src = src;
        });
    }

    getImage(key) {
        return this.images[key];
    }
}

export const Assets = new AssetManager();
