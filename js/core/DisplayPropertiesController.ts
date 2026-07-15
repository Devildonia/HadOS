import { Services } from './ServiceContainer';

export function setupDisplayProperties(): void {
    // Theme Switcher Button
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.onclick = (): void => {
            if (window.playBlip) window.playBlip(600);
            const tm: any = Services.get('ThemeManager');
            if (tm) {
                const nextTheme = tm.currentTheme === 'win95' ? 'modern' : 'win95';
                tm.applyTheme(nextTheme);
            }
        };
    }

    // Display properties dialog tabs switcher
    document.querySelectorAll('.display-tab-btn').forEach(btn => {
        (btn as HTMLElement).onclick = (e: MouseEvent) => {
            const targetBtn = e.target as HTMLElement;
            const targetId = targetBtn.dataset.target;
            if (!targetId) return;

            if (window.playBlip) window.playBlip(900);

            // Deactivate all tab buttons & hide content
            document.querySelectorAll('.display-tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.display-tab-content').forEach(c => (c as HTMLElement).style.display = 'none');

            // Activate chosen one
            targetBtn.classList.add('active');
            const targetContent = document.getElementById(targetId);
            if (targetContent) targetContent.style.display = 'block';
        };
    });
}
