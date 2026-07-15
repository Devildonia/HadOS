// ===== GAME DATA AND LOGIC v6.0.5 =====
// This file contains only the essential game data and event generation logic
// Event Engine: getNextEvent() + generateEvent() added v6.0.5

const DATA = {
    talents: [
        { id: 'rich', name: 'Born Rich', icon: './assets/talents/born_rich.webp', desc: '+500 Money (Trust Fund)', effect: { money: 500 } },
        { id: 'genius', name: 'Genius Mind', icon: './assets/talents/genius.webp', desc: '+30 Intelligence', effect: { intelligence: 30 } },
        { id: 'athlete', name: 'Athletic', icon: './assets/talents/athletic.webp', desc: '+30 Health', effect: { health: 30 } },
        { id: 'beautiful', name: 'Beautiful', icon: './assets/talents/beautiful.webp', desc: '+30 Appearance', effect: { appearance: 30 } },
        { id: 'optimist', name: 'Optimist', icon: './assets/talents/optimist.webp', desc: '+30 Happiness', effect: { happiness: 30 } },
        { id: 'lucky', name: 'Lucky', icon: './assets/talents/lucky.webp', desc: '+10 All Stats', effect: { happiness: 10, health: 10, intelligence: 10, money: 10, appearance: 10 } },
        { id: 'charismatic', name: 'Charismatic', icon: './assets/talents/charismatic.webp', desc: '+20 Appearance', effect: { appearance: 20, happiness: 10 } },
        { id: 'hardworker', name: 'Hard Worker', icon: './assets/talents/hard-worker.webp', desc: '+100 Money', effect: { money: 100, intelligence: 10 } },
        { id: 'healthy', name: 'Healthy Body', icon: './assets/talents/healthy.webp', desc: '+25 Health', effect: { health: 25, happiness: 5 } },
        { id: 'studious', name: 'Studious', icon: './assets/talents/studious.webp', desc: '+25 Intelligence', effect: { intelligence: 25, money: 5 } },
        { id: 'socialite', name: 'Socialite', icon: './assets/talents/socialite.webp', desc: '+15 Happiness', effect: { happiness: 15, appearance: 15 } },
        { id: 'ambitious', name: 'Ambitious', icon: './assets/talents/ambitious.webp', desc: '+15 Money', effect: { money: 50, intelligence: 15 } }
    ],
    events: typeof PRIORITY_EVENTS !== 'undefined' ? PRIORITY_EVENTS : [],
    readme: "Check manual for details."
};

// ===== EVENT GENERATION SYSTEM v6.0.5 =====

/**
 * Get next event for current age
 * Uses intelligent event selection with age ranges and fallbacks
 */
/**
 * Get next event for current age
 * Uses intelligent event selection with age ranges and fallbacks
 * Logic V2: Strict frequency control, seen events tracking, and special event priority
 */
function getNextEvent(age) {
    console.log('[EVENT ENGINE] Getting event for age:', age);

    // Initialize seenEvents if not present
    if (!window.state.seenEvents) {
        window.state.seenEvents = [];
    }

    // 1. PRIORITY EVENTS (Family, Wedding, Flag-triggered - Age specific)
    if (typeof PRIORITY_EVENTS !== 'undefined') {
        const priorityEvent = PRIORITY_EVENTS.find(e => e.age === age);
        if (priorityEvent) {
            if (priorityEvent.requiresSpouse && (!window.state.family || !window.state.family.spouse)) {
                console.log('[EVENT ENGINE] Skipping priority event (missing spouse):', priorityEvent.title);
            } else if (priorityEvent.requiresFlag && (!window.state.flags || !window.state.flags[priorityEvent.requiresFlag])) {
                console.log('[EVENT ENGINE] Skipping priority event (missing flag):', priorityEvent.title, priorityEvent.requiresFlag);
            } else if (priorityEvent.requiresChildren && (!window.state.family || !window.state.family.children || window.state.family.children.filter(c => c.isAlive).length === 0)) {
                console.log('[EVENT ENGINE] Skipping priority event (no children):', priorityEvent.title);
            } else {
                console.log('[EVENT ENGINE] Triggering Priority Event:', priorityEvent.title);
                return priorityEvent;
            }
        }
    }

    // 2. ELITE EVENTS (Stats > 100)
    // Logic V3: Strict Age >= 18 check for Elite Events
    if (typeof ELITE_EVENTS !== 'undefined' && age >= 18) {
        const possibleElite = ELITE_EVENTS.filter(e => {
            // Check requirements
            if (e.requirements) {
                for (const [stat, val] of Object.entries(e.requirements)) {
                    if (stat === 'karma') {
                        if ((window.state.karma || 0) < val) return false;
                    } else if (stat === 'eliteStatsCount') {
                        // Count how many stats are > 100
                        const eliteStats = ['health', 'intelligence', 'happiness', 'appearance', 'money'];
                        const eliteCount = eliteStats.filter(s => (window.state[s] || 0) > 100).length;
                        if (eliteCount < val) return false;
                    } else {
                        if ((window.state[stat] || 0) < val) return false;
                    }
                }
            }
            // Don't repeat elite events
            if (window.state.seenEvents.includes(e.title)) return false;

            return true;
        });

        if (possibleElite.length > 0 && Math.random() < 0.3) {
            const eliteEvent = possibleElite[Math.floor(Math.random() * possibleElite.length)];
            console.log('[EVENT ENGINE] Triggering Elite Event:', eliteEvent.title);
            eliteEvent.isSpecial = true; // Logic V4: Tag Elite as Special for UI
            window.state.seenEvents.push(eliteEvent.title);
            return eliteEvent;
        }
    }

    // 2.5. CHAINED EVENTS (Narrative Ribbons) v7.6
    // Check if any active flags trigger a follow-up event
    // 40% chance to continue a narrative chain if available
    if (typeof CHAINED_EVENTS !== 'undefined' && window.state.flags) {
        const possibleChained = CHAINED_EVENTS.filter(e => {
            // Check if required flag is active
            if (e.requiresFlag && window.state.flags[e.requiresFlag]) {
                // Don't repeat unique chained events
                if (window.state.seenEvents.includes(e.title)) return false;
                return true;
            }
            return false;
        });

        if (possibleChained.length > 0 && Math.random() < 0.4) {
            const chainedEvent = possibleChained[Math.floor(Math.random() * possibleChained.length)];
            console.log('[EVENT ENGINE] Triggering Chained Event (Narrative Ribbon):', chainedEvent.title);
            chainedEvent.isSpecial = true; // Mark as special to avoid burnout lock
            window.state.seenEvents.push(chainedEvent.title);
            return chainedEvent;
        }
    }

    // 3. SPECIAL EVENTS (Replacing Critical/Corrupted)
    // Logic V2: Guaranteed every 20 years OR 1% chance random
    // Logic V3: Age >= 18 restriction for Special Events
    let triggerSpecial = false;

    // Frequency Control: Every 20 years (20, 40, 60, 80...)
    if (age >= 18 && age % 20 === 0) {
        triggerSpecial = true;
        console.log('[EVENT ENGINE] Guaranteed Special Event Year!');
    }
    // Random 1% chance (Only Adults)
    if (!triggerSpecial && age >= 18 && Math.random() < 0.01) {
        triggerSpecial = true;
        console.log('[EVENT ENGINE] Random Special Event Trigger!');
    }
    // Critical Stats Override (if health/happiness < 15, high chance)
    // Logic V3: Also enforce adult age for these intense events? Maybe 18+ is safer.
    if (!triggerSpecial && age >= 18 && (window.state.health <= 15 || window.state.happiness <= 15 || window.state.money <= -500)) {
        if (Math.random() < 0.3) {
            triggerSpecial = true;
            console.log('[EVENT ENGINE] Critical Stat Special Event Trigger!');
        }
    }

    if (triggerSpecial && typeof ALL_EVENTS !== 'undefined' && ALL_EVENTS.special) {
        const specialEvents = ALL_EVENTS.special;
        const unseenSpecial = specialEvents.filter(e => !window.state.seenEvents.includes(e.id));

        // Logic V3: Filter for clean text (no special chars like underscores if possible, though normalize handles it)
        // But user said "well written without special characters".
        // Let's rely on normalizeEvent to clean underscores, but maybe skip events with weird symbols if any.

        // If we have unseen special events, pick one
        const pool = unseenSpecial.length > 0 ? unseenSpecial : specialEvents;
        const specialEvent = pool[Math.floor(Math.random() * pool.length)];

        if (specialEvent) {
            // Mark as special for UI
            specialEvent.isSpecial = true;
            window.state.seenEvents.push(specialEvent.id);
            return specialEvent;
        }
    }

    // 4. ORIGINAL EVENTS POOL (Standard Age-Based)
    if (typeof ALL_EVENTS !== 'undefined') {
        let category;
        if (age <= 5) category = ALL_EVENTS.early;
        else if (age <= 18) category = ALL_EVENTS.learning;
        else if (age <= 60) category = ALL_EVENTS.prime;
        else category = ALL_EVENTS.twilight;

        const pool = category || [];

        // Filter by requirements and SEEN status
        const eligibleEvents = pool.filter(e => {
            // Check requirements (r)
            if (e.r) {
                for (const [stat, val] of Object.entries(e.r)) {
                    // Logic V6: Marriage Status Checks
                    if (stat === 'isMarried') {
                        const isMarried = window.state.family && window.state.family.spouse && window.state.family.spouse.isMarried;
                        if (val === true && !isMarried) return false;
                        if (val === false && isMarried) return false;
                        continue;
                    }
                    if (stat === 'isSingle') {
                        const hasPartner = window.state.family && window.state.family.spouse;
                        if (val === true && hasPartner) return false;
                        if (val === false && !hasPartner) return false;
                        continue;
                    }
                    if (stat === 'divorceCooldown') {
                        // Check valid years since last divorce
                        const lastDivorce = window.state.lastDivorceAge || -10;
                        if (window.state.age - lastDivorce < val) return false;
                        continue;
                    }

                    if (stat === 'age') { // Handle explicit age checks for safety
                        if (window.state.age < val) return false;
                        continue;
                    }

                    if ((window.state[stat] || 0) < val) return false;
                }
            }
            // Check if already seen (Logic V2: No Repetition)
            if (window.state.seenEvents.includes(e.id)) return false;

            return true;
        });

        if (eligibleEvents.length > 0) {
            const event = eligibleEvents[Math.floor(Math.random() * eligibleEvents.length)];
            window.state.seenEvents.push(event.id);
            return event;
        } else {
            console.log('[EVENT ENGINE] No new events found for age ' + age + ', reusing pool.');
            // Fallback to pool if all seen (unlikely but possible)
            // Or better: generic fallback
            // But let's try to find an unseen event from ANY category? No, stick to age proper.
            // We will fall through to generic fallback below.
        }
    }

    // 5. GENERIC FALLBACK
    return {
        title: 'Life Continues',
        description: 'Another year passes peacefully. You take a moment to reflect on your journey.',
        options: [
            { text: 'Reflect', effects: { happiness: 2 }, result: 'You feel centered.' },
            { text: 'Plan ahead', effects: { intelligence: 2 }, result: 'You make plans for the future.' }
        ]
    };
}



/**
 * Generate event in format compatible with UI
 * Already in correct format from DATA.events, just return it
 */
function generateEvent(age) {
    return getNextEvent(age);
}

console.log("[MAIN.JS] Event generation system loaded (v6.0.5)");
