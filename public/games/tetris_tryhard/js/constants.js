export const COLS = 9;
export const ROWS = 21;
export const BLOCK_SIZE = 48;
export const LOCK_DELAY_MS = 500;

// ── Level System ─────────────────────────────────────────────
export const FLIP_DURATION_LINES = 25;   // lines to survive per gravity event
export const PERFECT_CLEAR_BONUS = 3500; // multiplied by level

export const LINE_SCORES = { 1: 100, 2: 300, 3: 500, 4: 800 };
export const TSPIN_SCORES = { mini: 100, single: 800, double: 1200, triple: 1600 };

// Level names are now in i18n.js

export const PIECE_TYPES = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

export const COLORS = {
  I: '#00f0ff',
  O: '#ffff00',
  T: '#ff00ff',
  S: '#00ff00',
  Z: '#ff0066',
  J: '#0066ff',
  L: '#ff6600'
};

export const SHAPES = {
  I: [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]],
  O: [[1, 1], [1, 1]],
  T: [[1, 1, 1], [0, 1, 0], [0, 0, 0]],
  S: [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
  Z: [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
  J: [[0, 1, 0], [0, 1, 0], [1, 1, 0]],
  L: [[1, 0, 0], [1, 0, 0], [1, 1, 0]]
};

export const WALL_KICK_DATA = {
  "3x3": {
    "0-1": [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]], "1-0": [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
    "1-2": [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]], "2-1": [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
    "2-3": [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]], "3-2": [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
    "3-0": [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]], "0-3": [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]]
  },
  "4x4": {
    "0-1": [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]], "1-0": [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
    "1-2": [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]], "2-1": [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
    "2-3": [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]], "3-2": [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
    "3-0": [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]], "0-3": [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]]
  }
};

export const VAULT_COLORS = {
  vaultBlue: '#3d5a80', vaultYellow: '#f4d03f', pipBoyGreen: '#00ff41',
  rust: '#8b4513', concrete: '#808080', radiation: '#39ff14',
  nukaCola: '#ff0000', skin: '#d4a574', vaultSuit: '#2c4c7e',
  darkBlue: '#1a2332', orange: '#ff6b35', black: '#000000', white: '#ffffff'
};

export const CHEER_WORDS = [
  'AWESOME', 'RADICAL', 'STELLAR', 'FANTASTIC',
  'LEGENDARY', 'EPIC', 'AMAZING', 'BRILLIANT',
  'PERFECT', 'INCREDIBLE', 'OUTSTANDING', 'SPECTACULAR',
  'GODLIKE', 'INSANE', 'BONKERS', 'NUCLEAR',
  'UNSTOPPABLE', 'BEASTMODE', 'MEGA', 'ULTRA',
  'RIDICULOUS', 'ABSURD', 'BONANZA', 'JACKPOT',
  'CRAZY', 'WILD', 'SICK', 'NASTY',
  'UNREAL', 'BEAST', 'SAVAGE', 'DOMINATING'
];

export const CHEER_MESSAGES = [
  'OUTSTANDING!', 'RADICAL!', 'FANTASTIC!',
  'STELLAR!', 'ATOMIC!', 'LEGENDARY!', 'SPECTACULAR!'
];

export const SPRITES = {
  vaultBoy1: [
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 7, 7, 7, 7, 7, 7, 1, 1, 0, 0, 0],
    [0, 0, 1, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 1, 0, 0],
    [0, 1, 7, 7, 7, 2, 2, 2, 2, 2, 7, 7, 7, 7, 1, 0],
    [0, 1, 7, 7, 2, 2, 2, 2, 2, 2, 2, 7, 7, 7, 1, 0],
    [0, 1, 7, 2, 2, 2, 2, 2, 2, 2, 2, 2, 7, 7, 1, 0],
    [1, 7, 7, 2, 3, 3, 2, 2, 2, 3, 3, 2, 7, 7, 7, 1],
    [1, 7, 7, 2, 3, 10, 2, 2, 2, 10, 3, 2, 7, 7, 7, 1],
    [1, 7, 7, 2, 2, 2, 2, 2, 2, 2, 2, 2, 7, 7, 7, 1],
    [1, 7, 7, 2, 2, 2, 4, 4, 4, 2, 2, 2, 7, 7, 7, 1],
    [0, 1, 7, 7, 2, 2, 2, 2, 2, 2, 2, 7, 7, 7, 1, 0],
    [0, 0, 1, 7, 7, 2, 2, 2, 2, 2, 7, 7, 7, 1, 0, 0],
    [0, 0, 0, 1, 1, 7, 7, 7, 7, 7, 7, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0]
  ],
  vaultBoy2: [
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 7, 7, 7, 7, 7, 7, 1, 1, 0, 0, 0],
    [0, 0, 1, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 1, 0, 0],
    [0, 1, 7, 7, 7, 2, 2, 2, 2, 2, 7, 7, 7, 7, 1, 0],
    [0, 1, 7, 7, 2, 2, 2, 2, 2, 2, 2, 7, 7, 7, 1, 0],
    [0, 1, 7, 2, 2, 2, 2, 2, 2, 2, 2, 2, 7, 7, 1, 0],
    [1, 7, 7, 2, 3, 3, 2, 2, 2, 3, 3, 2, 7, 7, 7, 1],
    [1, 7, 7, 2, 11, 4, 2, 2, 2, 11, 4, 2, 7, 7, 7, 1],
    [1, 7, 7, 2, 2, 2, 2, 2, 2, 2, 2, 2, 7, 7, 7, 1],
    [1, 7, 7, 2, 2, 4, 4, 4, 4, 4, 2, 2, 7, 7, 7, 1],
    [0, 1, 7, 7, 2, 2, 2, 2, 2, 2, 2, 7, 7, 7, 1, 0],
    [0, 0, 1, 7, 7, 2, 2, 2, 2, 2, 7, 7, 7, 1, 0, 0],
    [0, 0, 0, 1, 1, 7, 7, 7, 7, 7, 7, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0]
  ]
};

export const SPRITE_COLORS = [
  null, VAULT_COLORS.darkBlue, VAULT_COLORS.skin, VAULT_COLORS.white,
  VAULT_COLORS.black, VAULT_COLORS.orange, VAULT_COLORS.vaultSuit,
  VAULT_COLORS.vaultYellow, VAULT_COLORS.rust, VAULT_COLORS.concrete,
  VAULT_COLORS.white, VAULT_COLORS.black
];
