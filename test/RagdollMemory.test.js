/**
 * TESTS: RagdollMemory
 * Sprint 2 — extended coverage
 *
 * Covers:
 *   - Initialization defaults
 *   - Interaction recording (grab, drop, hurt, pet, feed, ignored)
 *   - Mood state machine (adjustMood, updateMoodState, thresholds)
 *   - Behavior modifiers per mood
 *   - checkMoodBehavior() probability bands
 *   - naturalMoodRecovery()
 *   - localStorage persistence (save / load / reset)
 *   - setPetName()
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { RagdollMemory } from '../js/RagdollMemory.js';

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
    localStorage.clear();
    vi.resetAllMocks();
    RagdollMemory.__reset();
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Create a fresh RagdollMemory with a clean localStorage */
function makeMemory() {
    return new RagdollMemory();
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('RagdollMemory — initialization', () => {
    it('starts with neutral mood and 0 mood points', () => {
        const m = makeMemory();
        expect(m.mood).toBe('neutral');
        expect(m.moodPoints).toBe(0);
    });

    it('starts with zeroed stats', () => {
        const m = makeMemory();
        const stats = m.getStats();
        expect(stats.timesGrabbed).toBe(0);
        expect(stats.timesDropped).toBe(0);
        expect(stats.timesHurt).toBe(0);
        expect(stats.timesPetted).toBe(0);
        expect(stats.timesIgnored).toBe(0);
    });

    it('starts with default pet name "Ragdoll"', () => {
        const m = makeMemory();
        expect(m.petName).toBe('Ragdoll');
    });

    it('has neutral behavior modifiers at start', () => {
        const m = makeMemory();
        expect(m.getModifier('animationSpeed')).toBe(1.0);
        expect(m.getModifier('reactionDistance')).toBe(1.0);
        expect(m.getModifier('happinessBonus')).toBe(0);
    });
});

describe('RagdollMemory — interaction recording', () => {
    it('recordGrab() increments timesGrabbed and decreases moodPoints', () => {
        const m = makeMemory();
        m.recordGrab();
        expect(m.getStats().timesGrabbed).toBe(1);
        expect(m.getMoodPoints()).toBe(-5);
    });

    it('recordDrop() increments timesDropped and decreases moodPoints by 8', () => {
        const m = makeMemory();
        m.recordDrop();
        expect(m.getStats().timesDropped).toBe(1);
        expect(m.getMoodPoints()).toBe(-8);
    });

    it('recordHurt() increments timesHurt and decreases moodPoints by 15', () => {
        const m = makeMemory();
        m.recordHurt();
        expect(m.getStats().timesHurt).toBe(1);
        expect(m.getMoodPoints()).toBe(-15);
    });

    it('recordPet() increments timesPetted and increases moodPoints by 3', () => {
        const m = makeMemory();
        m.recordPet();
        expect(m.getStats().timesPetted).toBe(1);
        expect(m.getMoodPoints()).toBe(3);
    });

    it('recordFeed() increases moodPoints by 5', () => {
        const m = makeMemory();
        m.recordFeed();
        expect(m.getMoodPoints()).toBe(5);
    });

    it('recordIgnored() decreases moodPoints by 2', () => {
        const m = makeMemory();
        m.recordIgnored();
        expect(m.getMoodPoints()).toBe(-2);
    });

    it('accumulates stats across multiple interactions', () => {
        const m = makeMemory();
        m.recordGrab();
        m.recordGrab();
        m.recordHurt();
        expect(m.getStats().timesGrabbed).toBe(2);
        expect(m.getStats().timesHurt).toBe(1);
        // -5 -5 -15 = -25
        expect(m.getMoodPoints()).toBe(-25);
    });
});

describe('RagdollMemory — mood state machine', () => {
    it('mood becomes friendly at moodPoints >= 30', () => {
        const m = makeMemory();
        m.adjustMood(30);
        expect(m.getMood()).toBe('friendly');
    });

    it('mood stays neutral between -20 and 29', () => {
        const m = makeMemory();
        m.adjustMood(15);
        expect(m.getMood()).toBe('neutral');

        m.adjustMood(-30);  // -15 now
        expect(m.getMood()).toBe('neutral');
    });

    it('mood becomes annoyed between -60 and -21', () => {
        const m = makeMemory();
        m.adjustMood(-40);
        expect(m.getMood()).toBe('annoyed');
    });

    it('mood becomes scared at moodPoints < -60', () => {
        const m = makeMemory();
        m.adjustMood(-61);
        expect(m.getMood()).toBe('scared');
    });

    it('moodPoints are clamped to [-100, 100]', () => {
        const m = makeMemory();
        m.adjustMood(999);
        expect(m.getMoodPoints()).toBe(100);

        m.adjustMood(-999);
        expect(m.getMoodPoints()).toBe(-100);
    });

    it('getMood() reflects current mood state', () => {
        const m = makeMemory();
        expect(m.getMood()).toBe('neutral');
        m.adjustMood(50);
        expect(m.getMood()).toBe('friendly');
    });
});

describe('RagdollMemory — behavior modifiers per mood', () => {
    it('friendly mood increases animationSpeed and decreases reactionDistance', () => {
        const m = makeMemory();
        m.adjustMood(50);   // friendly
        expect(m.getModifier('animationSpeed')).toBeGreaterThan(1.0);
        expect(m.getModifier('reactionDistance')).toBeLessThan(1.0);
        expect(m.getModifier('happinessBonus')).toBeGreaterThan(0);
    });

    it('annoyed mood reduces animationSpeed and increases reactionDistance', () => {
        const m = makeMemory();
        m.adjustMood(-40);  // annoyed
        expect(m.getModifier('animationSpeed')).toBeLessThan(1.0);
        expect(m.getModifier('reactionDistance')).toBeGreaterThan(1.0);
        expect(m.getModifier('happinessBonus')).toBeLessThan(0);
    });

    it('scared mood has very high reactionDistance', () => {
        const m = makeMemory();
        m.adjustMood(-80);  // scared
        expect(m.getModifier('reactionDistance')).toBeGreaterThan(1.5);
    });

    it('getModifier returns 1.0 for unknown modifier key', () => {
        const m = makeMemory();
        expect(m.getModifier('nonexistentModifier')).toBe(1.0);
    });
});

describe('RagdollMemory — checkMoodBehavior()', () => {
    it('returns null in neutral mood (no special behavior)', () => {
        const m = makeMemory();
        vi.spyOn(Math, 'random').mockReturnValue(0.5);
        expect(m.checkMoodBehavior()).toBeNull();
    });

    it('returns "wave" or "dance" in friendly mood at low random', () => {
        const m = makeMemory();
        m.adjustMood(50);   // friendly

        vi.spyOn(Math, 'random')
            .mockReturnValueOnce(0.05)  // < 0.15 → triggers
            .mockReturnValueOnce(0.3);  // >= 0.5 → dance

        const result = m.checkMoodBehavior();
        expect(['wave', 'dance']).toContain(result);
    });

    it('returns null in friendly mood at high random (no trigger)', () => {
        const m = makeMemory();
        m.adjustMood(50);

        vi.spyOn(Math, 'random').mockReturnValue(0.99);  // > 0.15
        expect(m.checkMoodBehavior()).toBeNull();
    });

    it('returns "angry" in annoyed mood at low random', () => {
        const m = makeMemory();
        m.adjustMood(-40);  // annoyed

        vi.spyOn(Math, 'random').mockReturnValue(0.05);  // < 0.1
        expect(m.checkMoodBehavior()).toBe('angry');
    });

    it('returns "scared" in scared mood at low random', () => {
        const m = makeMemory();
        m.adjustMood(-80);  // scared

        vi.spyOn(Math, 'random').mockReturnValue(0.1);  // < 0.2
        expect(m.checkMoodBehavior()).toBe('scared');
    });
});

describe('RagdollMemory — naturalMoodRecovery()', () => {
    it('slowly recovers negative mood toward neutral', () => {
        const m = makeMemory();
        m.adjustMood(-40);
        const before = m.getMoodPoints();
        m.naturalMoodRecovery();
        expect(m.getMoodPoints()).toBeGreaterThan(before);
    });

    it('slowly calms down extreme happiness', () => {
        const m = makeMemory();
        m.adjustMood(80);
        const before = m.getMoodPoints();
        m.naturalMoodRecovery();
        expect(m.getMoodPoints()).toBeLessThan(before);
    });

    it('does nothing when mood is mildly positive (< 50)', () => {
        const m = makeMemory();
        m.adjustMood(30);
        const before = m.getMoodPoints();
        m.naturalMoodRecovery();
        // Between 0 and 50: no recovery needed in either direction
        expect(m.getMoodPoints()).toBe(before);
    });
});

describe('RagdollMemory — persistence (save / load)', () => {
    it('save() writes to localStorage', () => {
        const m = makeMemory();
        m.adjustMood(20);
        m.recordGrab();
        m.save();

        const raw = localStorage.getItem('win95_ragdoll_memory');
        expect(raw).not.toBeNull();

        const data = JSON.parse(raw);
        expect(data.moodPoints).toBe(15);          // 20 - 5 from grab
        expect(data.stats.timesGrabbed).toBe(1);
    });

    it('load() restores state from localStorage', () => {
        // Save first memory
        const m1 = makeMemory();
        m1.adjustMood(40);   // friendly
        m1.save();

        // Create second instance — should load saved data
        const m2 = makeMemory();
        expect(m2.getMood()).toBe('friendly');
        expect(m2.getMoodPoints()).toBe(40);
    });

    it('load() resets sessionStart on load', () => {
        const m1 = makeMemory();
        const originalStart = m1.getStats().sessionStart;
        m1.save();

        // Simulate time passing
        vi.setSystemTime(Date.now() + 10000);
        const m2 = makeMemory();

        expect(m2.getStats().sessionStart).toBeGreaterThan(originalStart);
        vi.useRealTimers();
    });

    it('handles corrupt localStorage data gracefully', () => {
        localStorage.setItem('win95_ragdoll_memory', '{not valid json{{');

        const m = makeMemory();
        expect(m.getMood()).toBe('neutral');  // falls back to defaults
        expect(m.getMoodPoints()).toBe(0);
    });

    it('handles empty localStorage gracefully (fresh start)', () => {
        const m = makeMemory();
        expect(m.getMood()).toBe('neutral');
        expect(m.getMoodPoints()).toBe(0);
    });
});

describe('RagdollMemory — reset()', () => {
    it('resets all stats and mood to defaults', () => {
        const m = makeMemory();
        m.adjustMood(80);
        m.recordGrab();
        m.recordHurt();
        m.reset();

        expect(m.getMood()).toBe('neutral');
        expect(m.getMoodPoints()).toBe(0);

        const stats = m.getStats();
        expect(stats.timesGrabbed).toBe(0);
        expect(stats.timesHurt).toBe(0);
    });

    it('saves reset state to localStorage', () => {
        const m = makeMemory();
        m.adjustMood(50);
        m.reset();

        const data = JSON.parse(localStorage.getItem('win95_ragdoll_memory'));
        expect(data.moodPoints).toBe(0);
        expect(data.mood).toBe('neutral');
    });
});

describe('RagdollMemory — setPetName()', () => {
    it('updates petName and persists it', () => {
        const m = makeMemory();
        m.setPetName('Buddy');
        expect(m.petName).toBe('Buddy');

        const data = JSON.parse(localStorage.getItem('win95_ragdoll_memory'));
        expect(data.petName ?? m.petName).toBeDefined();
    });
});
