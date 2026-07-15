/**
 * WINDOWS 95 APP CENTER - CONFIGURATION
 * Centralized configuration and constants
 * Version: 1.0
 */

// Single source of truth: version read directly from package.json
import pkg from '../package.json';

const CONFIG = {
    // Application metadata
    APP: {
        NAME: 'Windows App Center',
        VERSION: pkg.version,  // ← única fuente de verdad (antes hardcodeado '1.3.0')
        LANGUAGE: 'en'
    } as const,

    // Taskbar configuration
    TASKBAR: {
        HEIGHT: 28,
        Z_INDEX: 1000
    } as const,

    // Window system
    WINDOWS: {
        Z_INDEX_BASE: 100,
        Z_INDEX_INCREMENT: 10,
        MAX_Z_INDEX: 950,
        DEFAULT_WIDTH: 600,
        DEFAULT_HEIGHT: 400
    } as const,

    // Ragdoll Pet
    RAGDOLL: {
        CANVAS_Z_INDEX: 5,
        GROUND_OFFSET: 13,          // Distance from center to foot bottom
        GROUND_HEIGHT: 20,          // Ground collision box height
        SCALE: 0.83,                // Body scale factor

        // Behavior
        FEAR_RADIUS: 120,           // Distance to start fleeing (pixels)
        ANGER_RADIUS: 80,           // Distance to get angry (pixels)
        PROXIMITY_CHECK_RADIUS: 50, // v0.7.5: Increased from 25 to 50 for easier grabbing

        // Physics
        GRAVITY: 0.5,
        FRICTION: 1.0,
        RESTITUTION: 0.6,           // Increased from 0.4 for more "pop"
        WALL_RESTITUTION: 1.2,      // Increased from 1.0 for hyper-bounce
        WINDOW_RESTITUTION: 0.9,    // Increased from 0.8
        ICON_RESTITUTION: 0.7,      // New: for desktop icons
        STICKY_NOTE_RESTITUTION: 0.5,// New: for post-its
        WINDOW_DEBOUNCE_MS: 100,

        // Animation timings (milliseconds)
        WAVE_DURATION: 3000,
        SIT_DURATION: 4000,
        JUMP_DURATION: 2000,
        JUMP_HEIGHT: 80, // v1.0.9: Added missing constant
        DANCE_DURATION: 5000,
        IDLE_MIN: 2000,
        IDLE_MAX: 6000,
        WAVE_CHECK_MIN: 20000,
        WAVE_CHECK_MAX: 25000,

        // v0.7 - New features
        FALL_DAMAGE_THRESHOLD: 10,    // Velocity threshold for hurt animation
        HURT_DURATION: 2000,           // Time showing hurt face (ms)
        GETTING_UP_DURATION: 1500,     // Time to get up animation (ms)
        BLOOD_PARTICLE_COUNT: 20,      // Blood particles per impact
        BLOOD_FADE_SPEED: 0.015,       // Blood fade out speed
        BLOOD_GRAVITY: 0.5,            // Blood particle gravity
        WATCH_DURATION: 3000,          // Time watching cursor (ms)
        TIRED_BUBBLE_DURATION: 4000,   // Time showing tired bubble (ms)
        SPAWN_SOUND_ENABLED: true,     // Play sound on spawn
        SPAWN_SOUND_FREQ_START: 800,   // Starting frequency (Hz)
        SPAWN_SOUND_FREQ_END: 200,     // Ending frequency (Hz)
        SPAWN_SOUND_DURATION: 0.15,    // Sound duration (seconds)

        // v0.9 Task 3 - New animations
        SLEEPING_DURATION: 10000,      // Time sleeping before waking up (ms)
        SLEEPING_ZZZ_INTERVAL: 800,    // Time between ZZZ particles (ms)
        LAUGHING_DURATION: 3000,       // Time laughing (ms)
        LAUGHING_INTENSITY: 5,         // Shake intensity when laughing
        EATING_DURATION: 5000,         // Time eating (ms)
        EATING_BITE_INTERVAL: 800,     // Time between bites (ms)

        // v0.9 Task 5 - More Tier 1 animations
        YAWNING_DURATION: 3000,        // Time yawning (ms)
        CRYING_DURATION: 4000,         // Time crying (ms)
        CRYING_TEAR_INTERVAL: 600,     // Time between tears (ms)
        STRETCHING_DURATION: 4000,     // Time stretching (ms)

        // v0.9 Task 6 - Final Tier 1 animations
        DRINKING_DURATION: 4000,       // Time drinking (ms)
        DRINKING_SIP_INTERVAL: 700,    // Time between sips (ms)
        THINKING_DURATION: 3500,       // Time thinking (ms)
        CLAPPING_DURATION: 3000,       // Time clapping (ms)
        CLAPPING_CLAP_INTERVAL: 400,   // Time between claps (ms)

        // v0.9 FASE B - Tier 2 animations (complex)
        BACKFLIP_DURATION: 2500,       // Time for complete backflip (ms) - Slower for visibility
        BACKFLIP_HEIGHT: 80,           // Jump height for backflip (pixels)
        MOONWALK_DURATION: 4000,       // Time moonwalking (ms)
        MOONWALK_SPEED: 150,           // Moonwalk speed (pixels total)
        CONFUSED_SPIN_DURATION: 3000,  // Time spinning confused (ms)
        CONFUSED_STAR_INTERVAL: 400,   // Time between stars (ms)

        // v0.9 FASE B - Tier 3 animations (advanced)
        HANDSTAND_DURATION: 5000,      // Time in handstand (ms)
        SPLIT_DURATION: 4000           // Time in split pose (ms)
    } as const,

    // Z-Index layers
    Z_INDEX: {
        DESKTOP: 1,
        RAGDOLL_CANVAS: 5,
        STICKY_NOTE: 50,
        WINDOWS: 100,
        DIALOGS: 500,
        TASKBAR: 1000,
        START_MENU: 10000,
        BIOS: 100000,
        BSOD: 200000
    } as const,

    // Colors (Windows 95 palette)
    COLORS: {
        TEAL: '#008080',
        WIN_GRAY: '#c0c0c0',
        WIN_BLUE: '#000080',
        WIN_LIGHTBLUE: '#1084d0',
        BORDER_LIGHT: '#ffffff',
        BORDER_DARK: '#808080',
        BORDER_DARKEST: '#000000',

        // Ragdoll colors
        RAGDOLL_HEAD: '#FFFFFF',
        RAGDOLL_BODY: '#000000',
        RAGDOLL_SPEECH_BG: '#FFFFFF',
        RAGDOLL_ANGRY_RED: '#FF0000'
    } as const,

    // Animation timings
    ANIMATIONS: {
        BIOS_DURATION: 2000,
        SPLASH_DURATION: 3000,
        SPLASH_PROGRESS_DURATION: 2500,
        BOOT_DELAY: 500
    } as const,

    // Audio
    AUDIO: {
        ENABLED: true,
        MASTER_VOLUME: 0.3,          // v0.9: Master volume control (0.0 - 1.0)
        BLIP_DURATION: 0.05,
        BLIP_FREQUENCY_MIN: 400,
        BLIP_FREQUENCY_MAX: 1200
    } as const,



    // Performance
    PERFORMANCE: {
        RESIZE_DEBOUNCE_MS: 250,
        SCROLL_DEBOUNCE_MS: 100
    } as const,

    // Development
    DEBUG: {
        ENABLED: false,              // Production: disabled
        SKIP_INTRO: false,           // Skip boot sequence
        LOG_EVENTS: false,           // Log game events
        LOG_RAGDOLL: false,          // Ragdoll debug logging
        LOG_AUDIO: false,            // Audio system logging
        SHOW_PHYSICS_DEBUG: false    // Show Matter.js debug rendering
    } as const
};

export type AppConfig = typeof CONFIG;

// Make CONFIG read-only (prevent accidental modifications)
Object.freeze(CONFIG);
Object.freeze(CONFIG.APP);
Object.freeze(CONFIG.TASKBAR);
Object.freeze(CONFIG.WINDOWS);
Object.freeze(CONFIG.RAGDOLL);
Object.freeze(CONFIG.Z_INDEX);
Object.freeze(CONFIG.COLORS);
Object.freeze(CONFIG.ANIMATIONS);
Object.freeze(CONFIG.AUDIO);

Object.freeze(CONFIG.PERFORMANCE);
Object.freeze(CONFIG.DEBUG);

// Export for ES Modules
export { CONFIG };

// Legacy global (for HTML onclick handlers)
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
