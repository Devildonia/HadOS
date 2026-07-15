import { WindowFactory } from './WindowFactory';

export interface IIconDef {
    id: string;
    name: string;
    emoji?: string;
    img?: string;
}

export interface IFolderDef {
    id: string;
    title: string;
    address: string;
    backBtnId?: string;
    icons: IIconDef[];
}

export interface IGameDef {
    id: string;
    title: string;
    src: string;
    width: number;
    height: number;
    className?: string;
}

const FOLDER_DEFS: IFolderDef[] = [
    {
        id: 'win-games-folder',
        title: 'C:\\WINDOWS\\DESKTOP\\GAMES',
        address: 'C:\\WINDOWS\\DESKTOP\\GAMES',
        icons: [
            { id: 'icon-vlrs-folder', name: 'Virtual Life Restart Simulator', emoji: '📂' },
            { id: 'icon-flappy-folder', name: 'Flappy Neon', emoji: '📂' },
            { id: 'icon-football-folder', name: 'Football Rush', emoji: '📂' },
            { id: 'icon-doom-folder', name: 'Ultimate DOOM', emoji: '📂' },
            { id: 'icon-tetris-folder', name: 'Tetris Tryhard', emoji: '📂' },
            { id: 'icon-chapas-folder', name: 'Chapas Prime', emoji: '📂' },
            { id: 'icon-nocturna-folder', name: 'Nocturna', emoji: '📂' },
            { id: 'icon-gameboy-folder', name: 'H.I.P. Game Boy', emoji: '📂' }
        ]
    },
    {
        id: 'win-flappy-folder',
        title: 'C:\\GAMES\\FLAPPY_NEON',
        address: 'C:\\GAMES\\FLAPPY_NEON',
        backBtnId: 'back-to-games-from-flappy',
        icons: [
            { id: 'icon-flappy-neon-exe', name: 'Flappy_Neon.exe', img: 'assets/icons/neon.webp' },
            { id: 'icon-flappy-readme', name: 'README.TXT', emoji: '📄' }
        ]
    },
    {
        id: 'win-football-folder',
        title: 'C:\\GAMES\\FOOTBALL_RUSH',
        address: 'C:\\GAMES\\FOOTBALL_RUSH',
        backBtnId: 'back-to-games-from-football',
        icons: [
            { id: 'icon-football-rush-exe', name: 'Football_Rush.exe', img: 'assets/icons/rush.webp' },
            { id: 'icon-football-readme', name: 'README.TXT', emoji: '📄' }
        ]
    },
    {
        id: 'win-vlrs-folder',
        title: 'C:\\GAMES\\VLRS',
        address: 'C:\\GAMES\\VLRS',
        backBtnId: 'back-to-games',
        icons: [
            { id: 'icon-game-inside', name: 'Virtual Life Restart Simulator', img: 'assets/icons/vlrs_icon.webp' },
            { id: 'icon-readme-inside', name: 'Readme.txt', emoji: '📄' }
        ]
    },
    {
        id: 'win-doom-folder',
        title: 'C:\\GAMES\\DOOM',
        address: 'C:\\GAMES\\DOOM',
        backBtnId: 'back-to-games-from-doom',
        icons: [
            { id: 'icon-doom-exe', name: 'Doom.exe', img: 'assets/icons/doom.webp' },
            { id: 'icon-doom-readme', name: 'README.TXT', emoji: '📄' }
        ]
    },
    {
        id: 'win-tetris-folder',
        title: 'C:\\GAMES\\TETRIS_TRYHARD',
        address: 'C:\\GAMES\\TETRIS_TRYHARD',
        backBtnId: 'back-to-games-from-tetris',
        icons: [
            { id: 'icon-tetris-exe', name: 'Tetris_Tryhard.exe', img: 'assets/icons/tetris.webp' },
            { id: 'icon-tetris-readme', name: 'README.TXT', emoji: '📄' }
        ]
    },
    {
        id: 'win-chapas-folder',
        title: 'C:\\GAMES\\CHAPAS_PRIME',
        address: 'C:\\GAMES\\CHAPAS_PRIME',
        backBtnId: 'back-to-games-from-chapas',
        icons: [
            { id: 'icon-chapas-exe', name: 'Chapas_Prime.exe', img: 'assets/icons/chapas.webp' },
            { id: 'icon-chapas-readme', name: 'README.TXT', emoji: '📄' }
        ]
    },
    {
        id: 'win-nocturna-folder',
        title: 'C:\\GAMES\\NOCTURNA',
        address: 'C:\\GAMES\\NOCTURNA',
        backBtnId: 'back-to-games-from-nocturna',
        icons: [
            { id: 'icon-nocturna-exe', name: 'Nocturna.exe', emoji: '🌙' },
            { id: 'icon-nocturna-readme', name: 'README.TXT', emoji: '📄' }
        ]
    },
    {
        id: 'win-gameboy-folder',
        title: 'C:\\GAMES\\GAME_BOY',
        address: 'C:\\GAMES\\GAME_BOY',
        backBtnId: 'back-to-games-from-gameboy',
        icons: [
            { id: 'icon-gameboy-exe', name: 'HIP_Game_Boy.exe', img: 'assets/icons/gameboy.png' },
            { id: 'icon-gameboy-readme', name: 'README.TXT', emoji: '📄' }
        ]
    }
];

const GAME_DEFS: IGameDef[] = [
    {
        id: 'win-vlrs-game',
        title: 'Virtual Life Restart Simulator',
        src: 'games/vlrs/index.html',
        width: 1500,
        height: 800
    },
    {
        id: 'win-flappy-neon',
        title: 'Flappy Neon',
        src: 'games/flappy-neon/index.html',
        width: 960,
        height: 540
    },
    {
        id: 'win-football-rush',
        title: 'Football Rush',
        src: 'games/rush_v3/index.html',
        width: 600,
        height: 1020
    },
    {
        id: 'win-doom',
        title: 'Ultimate DOOM',
        src: 'games/doom/ultimate_doom.html',
        width: 800,
        height: 600,
        className: 'doom-game-window'
    },
    {
        id: 'win-tetris-tryhard',
        title: 'Tetris Tryhard',
        src: 'games/tetris_tryhard/index.html',
        width: 960,
        height: 860
    },
    {
        id: 'win-chapas-game',
        title: 'Chapas Prime',
        src: 'games/chapas-prime/index.html',
        width: 1024,
        height: 600
    },
    {
        id: 'win-nocturna-game',
        title: 'Nocturna',
        src: 'games/nocturna/index.html',
        width: 900,
        height: 700
    },
    {
        id: 'win-gameboy-game',
        title: 'H.I.P. Game Boy',
        src: 'games/hip-gb/index.html',
        width: 800,
        height: 600
    }
];

export function buildDynamicFolderWindows(): void {
    FOLDER_DEFS.forEach(def => {
        const backBtnHtml = def.backBtnId 
            ? `<button class="win95-btn" id="${def.backBtnId}" style="padding: 2px 8px; font-size: 11px;" data-i18n="folder.back">⬅ Back</button>`
            : `<button class="win95-btn" disabled style="padding: 2px 8px; font-size: 11px; opacity: 0.5;" data-i18n="folder.back">⬅ Back</button>`;

        let iconsHtml = '';
        def.icons.forEach(icon => {
            if (icon.img) {
                iconsHtml += `
                    <div class="explorer-icon" id="${icon.id}">
                        <div class="icon-box" style="display: flex; align-items: center; justify-content: center;">
                            <img src="${icon.img}" alt="${icon.name}" style="width: 48px; height: 48px; object-fit: contain;">
                        </div>
                        <span>${icon.name}</span>
                    </div>
                `;
            } else {
                iconsHtml += `
                    <div class="explorer-icon" id="${icon.id}">
                        <div class="icon-img">${icon.emoji || '📂'}</div>
                        <span>${icon.name}</span>
                    </div>
                `;
            }
        });

        const bodyHtml = `
            <div class="explorer-window" style="height: 100%; display: flex; flex-direction: column;">
                <div class="explorer-toolbar" style="display: flex; align-items: center; background: #c0c0c0; padding: 4px; border-bottom: 1px solid #808080;">
                    ${backBtnHtml}
                    <span style="padding: 2px 5px; font-size: 11px; margin-left: 10px;" data-i18n="folder.menu">📁 File 📝 Edit 👁️ View ❓ Help</span>
                </div>
                <div class="explorer-address" style="display: flex; align-items: center; padding: 4px; background: #c0c0c0; border-bottom: 1px solid #808080;">
                    <span style="font-weight: bold; margin-right: 5px; font-size: 11px;" data-i18n="folder.address">Address:</span>
                    <input type="text" value="${def.address}" readonly style="flex: 1; border: 1px solid #808080; padding: 2px 4px; font-family: 'MS Sans Serif', Arial; font-size: 11px;">
                </div>
                <div class="explorer-content" style="flex: 1; background: white; padding: 10px; display: flex; flex-wrap: wrap; gap: 20px; overflow-y: auto; align-content: flex-start;">
                    ${iconsHtml}
                </div>
            </div>
        `;

        WindowFactory.create({
            id: def.id,
            title: def.title,
            body: bodyHtml,
            resizable: true
        });
    });
}

export function buildDynamicGameWindows(): void {
    GAME_DEFS.forEach(def => {
        WindowFactory.createGameWindow({
            id: def.id,
            title: def.title,
            src: def.src,
            width: def.width,
            height: def.height,
            resizable: true,
            className: def.className || ''
        });
    });
}
