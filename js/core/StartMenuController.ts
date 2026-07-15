import { Services } from './ServiceContainer';
import { EventBus } from './EventBus';

let globalClickListenersAttached = false;
let globalClickHandler: ((e: MouseEvent) => void) | null = null;
let ragdollStateUnsubscribe: (() => void) | null = null;
let ragdoll3dStateUnsubscribe: (() => void) | null = null;

export function setupStartMenu(): void {
    const startBtn = document.getElementById('start-button');
    if (startBtn) {
        startBtn.onclick = (): void => {
            const tm: any = Services.get('ThemeManager');
            const isModern = tm?.currentTheme === 'modern';
            if (isModern) {
                const audio: any = Services.get('AudioManager');
                if (audio) audio.play('menu_modern', { volume: 0.8 });
            } else {
                if (window.playBlip) window.playBlip(600);
            }
            const menu = document.getElementById('start-menu');
            if (menu) {
                menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
            }
        };
    }

    // Ragdoll Toggle Button & Menu Setup
    const ragdollToggle = document.getElementById('ragdollToggle');
    const ragdollMenu = document.getElementById('ragdoll-popup-menu');
    if (ragdollToggle && ragdollMenu) {
        ragdollToggle.onclick = (e: MouseEvent): void => {
            const tm: any = Services.get('ThemeManager');
            const isModern = tm?.currentTheme === 'modern';
            if (isModern) {
                const audio: any = Services.get('AudioManager');
                if (audio) audio.play('menu_modern', { volume: 0.8 });
            } else {
                if (window.playBlip) window.playBlip(600);
            }
            ragdollMenu.style.display = ragdollMenu.style.display === 'flex' ? 'none' : 'flex';
            e.stopPropagation(); // Prevent global click from immediately closing it
        };

        const spawn2d = document.getElementById('spawn-ragdoll-2d');
        if (spawn2d) {
            spawn2d.onclick = (): void => {
                if (window.playBlip) window.playBlip(600);
                ragdollMenu.style.display = 'none';
                EventBus.emit('ragdoll:toggle');
            };
        }

        const spawn3d = document.getElementById('spawn-ragdoll-3d');
        if (spawn3d) {
            spawn3d.onclick = (): void => {
                if (window.playBlip) window.playBlip(600);
                ragdollMenu.style.display = 'none';
                EventBus.emit('ragdoll3d:toggle');
            };
        }

        if (ragdollStateUnsubscribe) ragdollStateUnsubscribe();
        ragdollStateUnsubscribe = EventBus.on('ragdoll:state', (isActive: boolean) => {
            ragdollToggle.classList.toggle('active', !!isActive);
        });
        
        if (ragdoll3dStateUnsubscribe) ragdoll3dStateUnsubscribe();
        ragdoll3dStateUnsubscribe = EventBus.on('ragdoll3d:state', (isActive: boolean) => {
            ragdollToggle.classList.toggle('active', !!isActive);
        });
    }

    if (!globalClickListenersAttached) {
        // Global Click Sound & Start Menu Close Logic
        globalClickHandler = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // 1. Play button sound & trigger haptics
            const isClickableIcon = target.closest('.icon') || target.closest('.icon-box');
            const isButton = target.tagName === 'BUTTON' && !target.classList.contains('close-btn');

            if (isButton || isClickableIcon) {
                Services.get('HapticService')?.light();
                const tm: any = Services.get('ThemeManager');
                const isModern = tm?.currentTheme === 'modern';
                if (isModern) {
                    const audio: any = Services.get('AudioManager');
                    if (audio) audio.play('click_modern', { volume: 0.8 });
                } else {
                    if (window.playBlip) window.playBlip(800);
                }
            }

            // 2. Close Start Menu if clicking outside
            const menu = document.getElementById('start-menu');
            const startBtn = document.getElementById('start-button');
            if (menu && menu.style.display === 'block' && startBtn) {
                if (!menu.contains(target) && !startBtn.contains(target)) {
                    menu.style.display = 'none';
                }
            }

            // 3. Close Ragdoll Menu if clicking outside
            const ragMenu = document.getElementById('ragdoll-popup-menu');
            const ragBtn = document.getElementById('ragdollToggle');
            if (ragMenu && ragMenu.style.display === 'flex' && ragBtn) {
                if (!ragMenu.contains(target) && !ragBtn.contains(target)) {
                    ragMenu.style.display = 'none';
                }
            }
        };
        document.addEventListener('click', globalClickHandler);
        globalClickListenersAttached = true;
    }
}

export function resetStartMenuState(): void {
    if (globalClickHandler) {
        document.removeEventListener('click', globalClickHandler);
        globalClickHandler = null;
    }
    if (ragdollStateUnsubscribe) {
        ragdollStateUnsubscribe();
        ragdollStateUnsubscribe = null;
    }
    if (ragdoll3dStateUnsubscribe) {
        ragdoll3dStateUnsubscribe();
        ragdoll3dStateUnsubscribe = null;
    }
    globalClickListenersAttached = false;
}
