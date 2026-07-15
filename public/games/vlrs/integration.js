// ===== VIRTUAL LIFE SIMULATOR v6.0.5 - INTEGRATION LAYER =====
// Wrapped in IIFE to prevent global scope pollution
(function () {
    'use strict';

    // ===== NEW UI INTEGRATION LAYER =====
    // This section adapts the existing game logic to work with the new Playful Geometric UI

    // ===== NEW GAME+ PERSISTENCE SYSTEM v5.0 =====

    /**
     * Permanent Upgrades Storage
     * Saved in localStorage for New Game+ progression
     */
    const PERMANENT_UPGRADES_KEY = 'lifesim_permanent_upgrades';
    const LIFE_HISTORY_KEY = 'lifesim_life_history';

    // ===== FAMILY TREE SYSTEM v6.0 =====

    /**
     * Professions for family members
     * Each profession provides unique bonuses/penalties
     */
    const PROFESSIONS = [
        {
            name: 'Scientist',
            icon: '🔬',
            bonuses: { intelligence: 15, happiness: -5 },
            description: 'Values knowledge above all'
        },
        {
            name: 'Athlete',
            icon: '🏃‍♀️',
            bonuses: { health: 10, happiness: 5 },
            description: 'Takes care of physical health'
        },
        {
            name: 'Business Owner',
            icon: '💼',
            bonuses: { money: 1000, happiness: -10 },
            description: 'Rich but high family pressure'
        },
        {
            name: 'Artist',
            icon: '🎨',
            bonuses: { happiness: 15, appearance: 10, money: -200 },
            description: 'Creative but financially struggling'
        },
        {
            name: 'Doctor',
            icon: '⚕️',
            bonuses: { intelligence: 10, money: 500, health: 5 },
            description: 'Stable and educated'
        },
        {
            name: 'Teacher',
            icon: '📚',
            bonuses: { intelligence: 12, happiness: 8 },
            description: 'Patient and educational'
        },
        {
            name: 'Engineer',
            icon: '⚙️',
            bonuses: { intelligence: 13, money: 400 },
            description: 'Practical and methodical'
        },
        {
            name: 'Chef',
            icon: '👨‍🍳',
            bonuses: { health: 8, happiness: 10 },
            description: 'Passionate about food'
        },
        {
            name: 'Police Officer',
            icon: '👮',
            bonuses: { health: 8, money: 300, happiness: -3 },
            description: 'Disciplined but strict'
        },
        {
            name: 'Musician',
            icon: '🎵',
            bonuses: { happiness: 12, appearance: 8, money: -150 },
            description: 'Artistic with unstable income'
        }
    ];

    /**
     * Personality types that modify profession bonuses
     */
    const PERSONALITIES = [
        {
            type: 'Demanding',
            modifier: { intelligence: 5, happiness: -8 },
            description: 'Demanding, expects a lot from you'
        },
        {
            type: 'Caring',
            modifier: { happiness: 10, health: 5 },
            description: 'Loving and protective'
        },
        {
            type: 'Absent',
            modifier: { happiness: -12, money: 200 },
            description: 'Absent but leaves you money'
        },
        {
            type: 'Supportive',
            modifier: { happiness: 8, intelligence: 3 },
            description: 'Always supports you'
        },
        {
            type: 'Workaholic',
            modifier: { money: 500, happiness: -10 },
            description: 'Obsessed with work'
        },
        {
            type: 'Adventurous',
            modifier: { appearance: 8, happiness: 5, money: -100 },
            description: 'Adventurous and inspiring'
        }
    ];

    /**
     * Name pools for generating family members
     */
    const FIRST_NAMES = {
        male: ['James', 'Michael', 'Robert', 'John', 'David', 'William', 'Richard', 'Thomas', 'Daniel', 'Matthew'],
        female: ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Nancy']
    };

    const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

    /**
     * Spouse types with different bonuses and costs
     */
    const SPOUSE_TYPES = [
        {
            name: 'Artist',
            icon: '🎨',
            bonus: { happiness: 15 },
            cost: { money: -200 },
            description: 'Constant emotional support, but material expenses'
        },
        {
            name: 'Engineer',
            icon: '⚙️',
            bonus: { money: 300 },
            cost: { happiness: -2 },
            description: 'Good income, but somewhat workaholic'
        },
        {
            name: 'Teacher',
            icon: '📚',
            bonus: { happiness: 10, intelligence: 5 },
            cost: {},
            description: 'Balanced and educational'
        },
        {
            name: 'Doctor',
            icon: '⚕️',
            bonus: { health: 8, money: 400 },
            cost: { happiness: -3 },
            description: 'Good salary but long shifts'
        },
        {
            name: 'Entrepreneur',
            icon: '💼',
            bonus: { money: 500 },
            cost: { money: -300, happiness: -5 },
            description: 'High risk, high reward'
        },
        {
            name: 'Stay-at-Home Partner',
            icon: '🏠',
            bonus: { happiness: 20, health: 5 },
            cost: { money: -100 },
            description: 'Full support at home'
        }
    ];

    // Load permanent upgrades from localStorage
    function loadPermanentUpgrades() {
        const saved = localStorage.getItem(PERMANENT_UPGRADES_KEY);
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            inheritance: 0,      // Money boost (100 per level)
            geneticPatch: 0,     // Health boost (5 per level)
            brainOverclock: 0,   // Intelligence boost (5 per level)
            totalKarmaEarned: 0, // Total karma from all lives
            totalLives: 0        // Number of lives lived
        };
    }

    // Save permanent upgrades to localStorage
    function savePermanentUpgrades(upgrades) {
        localStorage.setItem(PERMANENT_UPGRADES_KEY, JSON.stringify(upgrades));
    }

    // Get current permanent upgrades
    function getPermanentUpgrades() {
        if (!window.permanentUpgrades) {
            window.permanentUpgrades = loadPermanentUpgrades();
        }
        return window.permanentUpgrades;
    }

    // Calculate Karma earned this life
    // Calculate Karma earned this life
    function calculateKarmaEarned() {
        const age = window.state.age || 0;
        const money = window.state.money || 50;
        const maxStat = Math.max(
            window.state.health || 50,
            window.state.intelligence || 50,
            window.state.happiness || 50,
            window.state.appearance || 50,
            window.state.money || 50
        );

        // Formula: (Age * 10) + (Money / 10) + (MaxStat * 2)
        // Fixed money divisor from 100 to 10 for better balance
        let karmaPoints = Math.floor((age * 10) + (money / 10) + (maxStat * 2));

        // Logic V7.1: Apply Great Donation Multiplier
        if (window.state.activeKarmaMultiplier > 1) {
            console.log(`[KARMA] Applying Multiplier x${window.state.activeKarmaMultiplier}`);
            karmaPoints *= window.state.activeKarmaMultiplier;
        }

        return Math.max(0, karmaPoints);
    }

    // Save current life to history
    function saveLifeToHistory() {
        const history = JSON.parse(localStorage.getItem(LIFE_HISTORY_KEY) || '[]');

        const lifeData = {
            id: Date.now(),
            age: window.state.age,
            finalStats: {
                health: window.state.health || 50,
                intelligence: window.state.intelligence || 50,
                happiness: window.state.happiness || 50,
                appearance: window.state.appearance || 50,
                money: window.state.money || 50
            },
            karma: window.state.karma || 0,
            karmaEarned: calculateKarmaEarned(),
            soulScore: calculateSoulScore(),
            timestamp: new Date().toISOString()
        };

        history.push(lifeData);

        // Keep only last 10 lives
        if (history.length > 10) {
            history.shift();
        }

        localStorage.setItem(LIFE_HISTORY_KEY, JSON.stringify(history));
        return lifeData;
    }

    // ===== FAMILY GENERATION SYSTEM =====

    /**
     * Generate a single parent with random profession and personality
     */
    function generateParent(gender, relation) {
        const firstName = FIRST_NAMES[gender][Math.floor(Math.random() * FIRST_NAMES[gender].length)];
        const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
        const profession = PROFESSIONS[Math.floor(Math.random() * PROFESSIONS.length)];
        const personality = PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)];
        const age = 35 + Math.floor(Math.random() * 20); // 35-54 años

        // Combinar bonos de profesión + personalidad
        const bonuses = {};

        // Aplicar bonos de profesión
        Object.keys(profession.bonuses).forEach(stat => {
            bonuses[stat] = (bonuses[stat] || 0) + profession.bonuses[stat];
        });

        // Aplicar modificadores de personalidad
        Object.keys(personality.modifier).forEach(stat => {
            bonuses[stat] = (bonuses[stat] || 0) + personality.modifier[stat];
        });

        return {
            id: relation.toLowerCase(),
            relation: relation,
            name: `${firstName} ${lastName}`,
            age: age,
            profession: profession.name,
            professionIcon: profession.icon,
            personality: personality.type,
            bonuses: bonuses,
            bonus: bonuses, // Alias for compatibility
            cost: {},
            description: `${profession.icon} ${profession.description} | ${personality.description}`,
            isAlive: true // Logic V2: Parents start alive
        };
    }

    /**
     * Generate both parents
     */
    function generateParents() {
        const father = generateParent('male', 'Father');
        const mother = generateParent('female', 'Mother');
        return [father, mother];
    }

    /**
     * Roll for godparents from past lives (10% chance per child)
     */
    function rollForGodparents() {
        const legacyData = getPermanentUpgrades();

        if (!legacyData.childrenLegacy || legacyData.childrenLegacy.length === 0) {
            return [];
        }

        const godparents = [];

        legacyData.childrenLegacy.forEach(child => {
            // 10% probabilidad por hijo
            if (Math.random() < 0.10) {
                godparents.push({
                    id: `godparent_${Date.now()}_${Math.random()}`,
                    relation: 'Godparent',
                    name: child.name,
                    age: 40 + Math.floor(Math.random() * 20),
                    professionIcon: '⭐',
                    profession: 'Guardian Spirit',
                    karmaBonus: child.isGifted ? 200 : 100,
                    description: `⭐ Your child from Life #${child.parentLife} watches over you`,
                    bonus: { karma: child.isGifted ? 200 : 100 },
                    cost: {}
                });
            }
        });

        return godparents;
    }

    /**
     * Apply parent bonuses to initial stats
     */
    function applyParentBonuses() {
        if (!window.state.family || !window.state.family.parents) return;

        window.state.family.parents.forEach(parent => {
            // Check if parent alive? No, initial bonuses apply regardless or only if alive at start? 
            // Usually genetic/upbringing applies once.
            Object.keys(parent.bonuses).forEach(stat => {
                const bonus = parent.bonuses[stat];
                if (window.state.hasOwnProperty(stat)) {
                    state[stat] = (state[stat] || 50) + bonus;
                }
            });
        });

        // Aplicar bonos de padrinos (si existen de vidas pasadas)
        if (window.state.family.godparents && window.state.family.godparents.length > 0) {
            window.state.family.godparents.forEach(godparent => {
                // Bono masivo de Karma
                if (!window.state.karma) window.state.karma = 0;
                window.state.karma += godparent.karmaBonus;
            });
        }
    }

    /**
     * Add spouse/partner to family
     * Logic V2: Support for Partner (unmarried) with 50% impact
     */
    function addSpouse(spouseType = null, isMarried = true) {
        // Si no se especifica, elegir aleatoriamente
        if (!spouseType) {
            spouseType = SPOUSE_TYPES[Math.floor(Math.random() * SPOUSE_TYPES.length)];
        }

        const gender = Math.random() > 0.5 ? 'male' : 'female';
        const firstName = FIRST_NAMES[gender][Math.floor(Math.random() * FIRST_NAMES[gender].length)];
        const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
        const age = window.state.age + Math.floor(Math.random() * 7) - 3; // ±3 años de diferencia
        const relation = isMarried ? 'Spouse' : 'Partner';

        window.state.family.spouse = {
            id: 'spouse',
            relation: relation,
            name: `${firstName} ${lastName}`,
            age: age,
            profession: spouseType.name,
            professionIcon: spouseType.icon,
            bonus: spouseType.bonus,
            cost: spouseType.cost,
            description: spouseType.description,
            marriageAge: window.state.age,
            isAlive: true,      // Logic V2
            isMarried: isMarried // Logic V2
        };

        // Aplicar bono inicial (Logic V2: 50% if partner)
        const multiplier = isMarried ? 1.0 : 0.5;
        Object.keys(spouseType.bonus).forEach(stat => {
            updateAttribute(stat, Math.round(spouseType.bonus[stat] * multiplier), 0);
        });

        return window.state.family.spouse;
    }

    /**
     * Add child to family
     * Logic V3: English text, Independence flag
     * Logic V4.5: Unique Names
     */
    function addChild() {
        // Logic V2: Allow children without spouse? For now require at least a partner
        // In "Drama" case (Abandonment), we might call addChild force-ably, but spouse flag exists.
        if (!window.state.family.spouse) {
            console.warn('Need spouse/partner to have children');
            return null;
        }

        const gender = Math.random() > 0.5 ? 'male' : 'female';

        // Logic V4.5: Unique Name Generation
        const usedNames = window.state.family.children.map(c => c.name);
        const namePool = FIRST_NAMES[gender].filter(name => !usedNames.includes(name));

        // If all names used, fallback to random + Suffix, or just random
        let firstName;
        if (namePool.length > 0) {
            firstName = namePool[Math.floor(Math.random() * namePool.length)];
        } else {
            firstName = FIRST_NAMES[gender][Math.floor(Math.random() * FIRST_NAMES[gender].length)] + ' Jr.';
        }

        // Heredar stats (promedio de padres con variación)
        const inheritedStats = {
            health: Math.floor((window.state.health + 50) / 2) + Math.floor(Math.random() * 21) - 10,
            intelligence: Math.floor((window.state.intelligence + 50) / 2) + Math.floor(Math.random() * 21) - 10,
            appearance: Math.floor((window.state.appearance + 50) / 2) + Math.floor(Math.random() * 21) - 10
        };

        // Determinar si es superdotado (5% probabilidad)
        const isGifted = Math.random() < 0.05;
        // Logic V2: Wedlock status
        const isWedlock = window.state.family.spouse && window.state.family.spouse.isMarried;

        // Logic V3: Translate text
        const relationText = 'Child';
        const childDesc = isGifted ? '⭐ Gifted Child (Family Pride)' : (gender === 'male' ? '👶 Your Son' : '👶 Your Daughter');

        const child = {
            id: `child_${Date.now()}`,
            relation: relationText,
            name: firstName,
            age: 0,
            birthYear: window.state.age,
            gender: gender,
            inheritedStats: inheritedStats,
            isGifted: isGifted,
            bonus: isGifted ? { karma: 50 } : { happiness: 5 },
            // Logic V4.5: Fixed Cost 4. Player pays 2 (Spouse pays other 2).
            // We set it to 2 because this object represents the cost applied to PLAYER.
            cost: { money: -2 },
            description: childDesc,
            professionIcon: isGifted ? '⭐' : '👶',
            isAlive: true,    // Logic V2
            isWedlock: isWedlock, // Logic V2
            isIndependent: false // Logic V3: Track independence
        };

        window.state.family.children.push(child);

        // Aplicar costes/bonos iniciales
        if (isGifted) {
            updateAttribute('karma', 50, 0);
        } else {
            // Logic V4.5: Happiness bonus logic remains
            updateAttribute('happiness', 5, 0);
        }

        return child;
    }

    /**
     * Apply annual family costs (spouse + children)
     * Logic V3: Independence check, Separation/Divorce impacts
     * Logic V4.5: Fixed Child Cost (4 total, 2 player)
     */
    function applyFamilyCosts() {
        if (!window.state.family) return;

        let totalMoneyCost = 0;
        let totalHappinessChange = 0;

        // Logic V7.8: Apply Inflation to Family Costs
        const inflationMultiplier = window.state.economy?.inflation || 1.0;

        // Costes de cónyuge
        const spouse = window.state.family.spouse;
        if (spouse && spouse.isAlive) {
            // Logic V3: Status based multiplier
            // Default 1.0 (Married). Partner = 0.5. Separated = 0.5. Divorced = 0.
            let multiplier = spouse.isMarried ? 1.0 : 0.5;

            // Check explicit status if set (Logic V3)
            if (spouse.status === 'Separated') multiplier = 0.5;
            if (spouse.status === 'Divorced') multiplier = 0;

            // Logic V7.8: Inflation Impact on Spouse Costs
            multiplier *= inflationMultiplier;

            if (spouse.cost) {
                Object.keys(spouse.cost).forEach(stat => {
                    if (stat === 'money') {
                        totalMoneyCost += spouse.cost[stat] * multiplier;
                    } else if (stat === 'happiness') {
                        // Inflation doesn't directly multiply happiness cost, usually money.
                        // But let's keep logic simple: multiplier affects all "costs".
                        totalHappinessChange += spouse.cost[stat] * multiplier;
                    }
                });
            }

            // Aplicar bonos anuales del cónyuge
            if (spouse.bonus) {
                Object.keys(spouse.bonus).forEach(stat => {
                    if (stat === 'happiness') {
                        totalHappinessChange += spouse.bonus[stat] * multiplier;
                    } else if (stat === 'money') {
                        totalMoneyCost += spouse.bonus[stat] * multiplier;
                    }
                });
            }
        }

        // Costes de hijos
        window.state.family.children.forEach(child => {
            if (!child.isAlive) return; // Logic V2: Skip dead

            // Logic V3: Independence Check (15% chance if >= 18)
            const childAge = window.state.age - child.birthYear;
            if (childAge >= 18 && !child.isIndependent) {
                if (Math.random() < 0.15) {
                    child.isIndependent = true;
                    // Logic V3: Add independence note to description if not there
                    if (!child.description.includes('Independent')) {
                        child.description += ' (Independent)';
                    }
                    addToTimeline(window.state.age, `${child.name} has moved out and is now independent.`);
                }
            }

            // If independent, no stats/costs apply
            if (child.isIndependent) {
                child.age = childAge; // Just update age
                return; // Skip cost/bonus application
            }

            // Logic V4.5: Cost Calculation
            // Base Cost: 2 (inherited from child object: { money: -2 })
            // Logic: "total is 4, spouse pays 2".
            // If Separated/Divorced, does spouse still pay?
            // User says: "seguirá siendo del esposo/a... Esa cantidad deberá ser restada."
            // Implicitly: Player ALWAYS pays 2 (half). 
            // So we don't multiply by 0.5 for divorce anymore?
            // "La mitad... la pagará nuestro conyugue" -> implies standard arrangement.
            // If divorced, usually child support means paying anyway.
            // Let's stick to SIMPLE logic: Player pays 2 ALWAYS if child dependent. 
            // Previous V3 logic had multiplier 0.5 for wedlock/divorce.
            // User requirement V4.5: "Hijos cuestan siempre 4 money... se nos restará 2 money"
            // So we hardcode 2.

            // Only apply cost if not independent and < 18 (or always if dependent?)
            // Usually valid until 18.

            if (childAge < 18 && childAge >= 0) {
                // Logic V6: Cost Balance - User requested increase
                // Player pays full share or significant amount. 
                // Setting to 25 per year per child.
                // Logic V7.8: Apply Inflation Multiplier
                totalMoneyCost += -25 * inflationMultiplier;
            }

            // Actualizar edad del hijo
            child.age = childAge;

            // Logic V7.7: Excellence Scholarship (NPC Proactivity)
            // Gifted children (age 6-22) can win scholarships (5% chance)
            if (child.isGifted && childAge >= 6 && childAge <= 22) {
                if (Math.random() < 0.05) {
                    const scholarshipAmount = 500;
                    updateAttribute('money', scholarshipAmount, 5); // +5 Karma for raising a genius
                    addToTimeline(window.state.age, `${child.name} won an Excellence Scholarship!`, `Your gifted child earned $${scholarscholarshipAmount} for the family.`);
                    // Reduce cost for this year? Or just add money? The prompt says "aporte dinero... en lugar de restarlo".
                    // Adding money effectively offsets.
                }
            }
        });

        // Aplicar costes (rounded)
        if (totalMoneyCost !== 0) {
            updateAttribute('money', Math.round(totalMoneyCost), 0);
        }
        if (totalHappinessChange !== 0) {
            updateAttribute('happiness', Math.round(totalHappinessChange), 0);
        }

        // Logic V7.7: Family Happiness & NPC Proactivity (Marital Crisis)
        // Track consecutive bad years (Health + Happiness avg < 40)
        const avgStats = ((window.state.health || 50) + (window.state.happiness || 50)) / 2;

        if (typeof window.state.consecutiveBadYears === 'undefined') {
            window.state.consecutiveBadYears = 0;
        }

        if (avgStats < 40) {
            window.state.consecutiveBadYears++;
            // console.log(`[FAMILY] Bad Year #${window.state.consecutiveBadYears} (Avg: ${avgStats})`);
        } else {
            window.state.consecutiveBadYears = 0;
        }

        // Marital Crisis Check (10% chance if 3+ bad years)
        if (spouse && spouse.isAlive && window.state.consecutiveBadYears >= 3) {
            if (Math.random() < 0.10) {
                console.log('[FAMILY] NPC Proactivity: Marital Crisis triggered.');
                updateAttribute('happiness', -20, 0);
                updateAttribute('money', -500, 0); // Counseling / Stress spending
                addToTimeline(window.state.age, '💔 Marital Crisis', 'Your spouse confronts you about the family\'s unhappiness. "We can\'t go on like this."');
            }
        }
    }

    // ===== EMPLOYMENT TIER SYSTEM v7.0 =====
    const EMPLOYMENT_TIERS = [
        { tier: 0, name: 'Desempleado', minInt: 0, maxInt: 29, salary: 0, stressBase: 5 },
        { tier: 1, name: 'Trabajo Manual', minInt: 30, maxInt: 49, salary: 20, stressBase: 10 },
        { tier: 2, name: 'Administrativo', minInt: 50, maxInt: 69, salary: 50, stressBase: 18 },
        { tier: 3, name: 'Profesional', minInt: 70, maxInt: 89, salary: 120, stressBase: 28 },
        { tier: 4, name: 'Ejecutivo/Experto', minInt: 90, maxInt: 999, salary: 300, stressBase: 40 }
    ];

    /**
     * Get current employment tier based on intelligence
     */
    function getEmploymentTier() {
        const intelligence = window.state.intelligence || 50;
        for (let i = EMPLOYMENT_TIERS.length - 1; i >= 0; i--) {
            if (intelligence >= EMPLOYMENT_TIERS[i].minInt) {
                return EMPLOYMENT_TIERS[i];
            }
        }
        return EMPLOYMENT_TIERS[0];
    }

    /**
     * Apply Annual Economy - v7.0 with Stress System
     * - 5 Employment Tiers based on Intelligence
     * - Annual Stress calculation: WorkLoad + (Children × 2) - (Happiness / 20)
     * - 5% Economic Collapse chance (-30% money)
     * - Burnout penalties: 60+ blocks benevolent options, 80+ doubles health decay
     */
    function applyAnnualEconomy() {
        // Only apply from age 18+ (working age)
        if (window.state.age < 18) return;

        // Initialize stress if not present
        if (typeof window.state.stress === 'undefined') {
            window.state.stress = 0;
        }

        // Logic V7.8: Economic Cycles & Inflation
        if (!window.state.economy) {
            window.state.economy = { inflation: 1.0 };
        }

        // Fluctuate Inflation: -0.02 to +0.05
        const currentInflation = window.state.economy.inflation;
        const fluctuation = (Math.random() * 0.07) - 0.02;
        window.state.economy.inflation = Math.max(0.5, currentInflation + fluctuation); // Cap minimum 0.5 (Deflation limit)

        console.log(`[ECONOMY] Inflation: ${(window.state.economy.inflation * 100).toFixed(1)}% (Change: ${(fluctuation * 100).toFixed(1)}%)`);

        // Check for Inflation Crisis (> 1.2)
        if (window.state.economy.inflation > 1.2) {
            console.log('[ECONOMY] Inflation Crisis Triggered!');
            // Only trigger notification once per crisis period? Or annually?
            // Let's rely on timeline logs
            // addToTimeline(window.state.age, '💸 Inflation Crisis', `The cost of living is skyrocketing (Inflation: ${(window.state.economy.inflation * 100).toFixed(0)}%)`);
            // Maybe too spammy if every year. Let's trigger small happiness hit.
            updateAttribute('happiness', -2, 0);
        }

        // Get current employment tier
        let tier = getEmploymentTier();

        // Logic V7.2: Student Mode (Under 23)
        // Prevent young geniuses from getting high-stress Executive jobs immediately.
        // Cap at Tier 1 (Manual/Intern) levels for Salary/Stress, but rename for immersion.
        if (window.state.age < 23 && tier.tier > 1) {
            console.log('[ECONOMY] Age < 23: Applying Student/Intern cap.');
            // Clone Tier 1 stats but rename
            tier = {
                ...EMPLOYMENT_TIERS[1],
                name: 'Estudiante / Becario',
                salary: 15, // Slightly lower than manual labor (living on allowance/scholarship)
                stressBase: 8 // Lower stress than work
            };
        }

        window.state.currentTier = tier; // Store for UI display

        // Apply salary
        if (tier.salary > 0) {
            updateAttribute('money', tier.salary, 0);
            console.log(`[ECONOMY] Tier ${tier.tier} (${tier.name}): +${tier.salary} salary`);
        }

        // Logic V7.9: Apply Voice of Wisdom (Stress Reduction Upgrade)
        // Check for upgrade level stored in active state (transferred from upgrades in startNewLife)
        // Or check window.state.voiceOfWisdomLevel if we save it there.
        // We probably need to save the level to window.state during startNewLife so we can access it during the game.

        const stressReductionLevel = window.state.voiceOfWisdomLevel || 0;
        const reductionMultiplier = Math.max(0, 1.0 - (stressReductionLevel * 0.10)); // 10% per level

        // Calculate annual stress change
        // ΔS = WorkLoad + (Children × 2) - (Happiness / 20)
        const livingChildren = window.state.family?.children?.filter(c => c.isAlive && !c.isIndependent).length || 0;
        // Logic V7.2: Children Cost is handled in applyFamilyCosts, but stress impact is here.
        // Logic V7.2: happiness divisor 20.

        const happiness = window.state.happiness || 50;
        let stressBase = tier.stressBase;

        // Apply reduction to WORK STRESS specifically (as per prompt "estrés generado por el trabajo")
        stressBase *= reductionMultiplier;

        const stressChange = stressBase + (livingChildren * 2) - Math.floor(happiness / 20);

        // Apply stress change (clamped 0-100)
        window.state.stress = Math.max(0, Math.min(100, window.state.stress + stressChange));
        console.log(`[STRESS] ΔS=${stressChange} (WorkLoad:${tier.stressBase} + Children:${livingChildren * 2} - Happy:${Math.floor(happiness / 20)}) → Total: ${window.state.stress}`);

        // Burnout Penalty: 80+ stress = double health decay
        if (window.state.stress >= 80) {
            updateAttribute('health', -3, 0); // Extra 3 health decay (on top of normal aging)
            console.log('[BURNOUT] Stress 80+: Double health decay applied');
        }

        // 5% Economic Collapse chance
        if (Math.random() < 0.05 && window.state.money > 100) {
            const collapse = Math.floor(window.state.money * 0.3);
            updateAttribute('money', -collapse, 0);
            updateAttribute('happiness', -15, 0);
            addToTimeline(window.state.age, `💸 Economic Collapse! Lost $${collapse} in market crash.`);
            console.log(`[ECONOMY] Economic Collapse! Lost $${collapse}`);
        }

        // Natural health decay from age (increases with age)
        if (window.state.age >= 40) {
            const ageDecay = Math.floor((window.state.age - 40) / 10) + 1;
            updateAttribute('health', -ageDecay, 0);
        }
    }

    /**
     * Save children as legacy for future lives
     */
    function saveChildrenAsLegacy() {
        if (!window.state.family || !window.state.family.children || window.state.family.children.length === 0) return;

        const legacyData = getPermanentUpgrades();

        // Guardar hijos como posibles padrinos
        if (!legacyData.childrenLegacy) {
            legacyData.childrenLegacy = [];
        }

        window.state.family.children.forEach(child => {
            // Solo guardar hijos que llegaron a adultos (>18 años)
            if (child.age >= 18) {
                legacyData.childrenLegacy.push({
                    name: child.name,
                    inheritedStats: child.inheritedStats,
                    isGifted: child.isGifted,
                    parentLife: legacyData.totalLives + 1
                });
            }
        });

        // Limitar a 20 hijos en total (para no llenar localStorage)
        if (legacyData.childrenLegacy.length > 20) {
            legacyData.childrenLegacy = legacyData.childrenLegacy.slice(-20);
        }

        savePermanentUpgrades(legacyData);
    }

    // ===== KARMA & UNCAPPED STATS SYSTEM v4.0 =====

    /**
     * Updates an attribute and karma simultaneously
     * @param {string} attr - Attribute name ('health', 'intelligence', etc.)
     * @param {number} amount - Amount to add/subtract
     * @param {number} karmaChange - Karma change (positive or negative)
     * @returns {object} Updated attribute state
     */
    function updateAttribute(attr, amount, karmaChange = 0) {
        // 0. Ensure state has required properties
        if (!window.state.karma) window.state.karma = 0;
        if (!window.state.eliteFlags) {
            window.state.eliteFlags = {
                health: false,
                intelligence: false,
                happiness: false,
                appearance: false,
                money: false
            };
        }
        if (!window.state.karmaHistory) window.state.karmaHistory = [];

        // 1. Update attribute (minimum 0, no maximum)
        // 1. Update attribute (minimum 0, no maximum)
        const oldValue = state[attr] || 50;
        let finalAmount = amount;

        // Logic V7.5: Logarithmic Diminishing Returns for stats > 100
        // Formula: RealGain = BaseGain / (1 + log10(CurrentValue / 100))
        // applied only to positive gains (increments)
        if (oldValue > 100 && amount > 0) {
            const factor = 1 + Math.log10(oldValue / 100);
            finalAmount = amount / factor;
            // Optional: console.log(`[DIMINISHING RETURNS] ${attr}: Base +${amount} -> Real +${finalAmount.toFixed(2)} (Factor: ${factor.toFixed(2)})`);
        }

        // Apply change (rounded for clean numbers, or float? Let's keep it float internally but UI rounds)
        // User requested formula implementation, usually implying clearer floats or rounded final.
        // JS often works better with clean integers for display, but for diminishing returns, floats are necessary to track progress.
        // Let's store as float.
        state[attr] = Math.max(0, oldValue + finalAmount);

        // 2. Update karma
        window.state.karma += karmaChange;

        // 3. Check if attribute exceeds 100 (Elite Status)
        if (state[attr] > 100 && !window.state.eliteFlags[attr]) {
            window.state.eliteFlags[attr] = true;
            triggerEliteNotification(attr, state[attr]);
        }

        // 4. If attribute drops below 100, remove elite flag
        if (state[attr] <= 100 && window.state.eliteFlags[attr]) {
            window.state.eliteFlags[attr] = false;
        }

        // 5. Log karma change
        if (karmaChange !== 0) {
            window.state.karmaHistory.push({
                age: window.state.age || 0,
                karmaChange: karmaChange,
                totalKarma: window.state.karma,
                reason: attr + ' ' + (amount > 0 ? '+' : '') + amount
            });
        }

        return {
            newValue: state[attr],
            isElite: window.state.eliteFlags[attr],
            karma: window.state.karma
        };
    }

    /**
     * Calculates Soul Score at end of life
     * @returns {object} Soul Score result with category
     */
    function calculateSoulScore() {
        // Ensure karma exists
        const karma = window.state.karma || 0;

        // Sum of all stats
        const totalStats = (window.state.health || 50) + (window.state.intelligence || 50) +
            (window.state.happiness || 50) + (window.state.appearance || 50) + (window.state.money || 50);

        // Formula: (Stats / 10) + (Karma × 2)
        const soulScore = (totalStats / 10) + (karma * 2);

        // Categorization
        let category, title, description;

        if (karma >= 100) {
            category = 'Ascended';
            title = '✨ Ascended Soul';
            description = 'Your kindness and virtue transcended mortal limitations. You achieved enlightenment.';
        } else if (totalStats > 500 && karma < 0) {
            category = 'Corporate Overlord';
            title = '👔 Corporate Overlord';
            description = 'Peak performance at any cost. You conquered the system but lost your soul.';
        } else if (karma <= -100) {
            category = 'System Glitch';
            title = '⚠️ System Glitch';
            description = 'Your choices corrupted the simulation. Reality.exe has stopped responding.';
        } else if (karma >= 50) {
            category = 'Saint';
            title = '😇 Saint';
            description = 'A life of service and compassion. You made the world better.';
        } else if (totalStats > 400) {
            category = 'Prodigy';
            title = '🌟 Prodigy';
            description = 'Exceptional in every way. A life of achievement and success.';
        } else if (karma <= -50) {
            category = 'Villain';
            title = '😈 Villain';
            description = 'Power through ruthlessness. Your legacy is feared, not loved.';
        } else {
            category = 'Balanced';
            title = '⚖️ Balanced Soul';
            description = 'You walked the middle path, experiencing both light and shadow.';
        }

        return {
            soulScore: Math.round(soulScore),
            category,
            title,
            description,
            totalStats: Math.round(totalStats),
            karma: karma
        };
    }

    /**
     * Triggers visual notification when achieving Elite status
     * @param {string} stat - Stat name
     * @param {number} value - Current value
     */
    function triggerEliteNotification(stat, value) {
        // Fix for Elite Status appearing on startup: check if game screen is active
        const gameScreen = document.getElementById('simulation-screen');
        if (!gameScreen || !gameScreen.classList.contains('active-screen')) {
            return;
        }

        const notification = document.createElement('div');
        notification.className = 'elite-notification';
        notification.innerHTML = '<div class="elite-notif-content"><div class="elite-notif-icon">⚡</div><div class="elite-notif-text"><strong>ELITE STATUS ACHIEVED!</strong><p>' + capitalize(stat) + ' surpassed 100!</p></div></div>';

        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    // Screen Management
    function showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen, .hero-section').forEach(screen => {
            screen.classList.remove('active-screen');
        });

        // Show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active-screen');
        }
    }

    // Show Talent Selection (replaces showDesktop/openInstallation)
    // Logic V6: Added persistState check for New Game+
    function showTalentSelection(persistState = false) {
        // Reset selected talents to prevent accumulation when restarting
        // If New Game+ (persistState), we keep the bonuses and initialized family in window.state
        if (!persistState) {
            if (!window.state) {
                window.state = {};
            }
            window.state.selectedTalents = [];
        } else {
            // For New Game+, we only clear talents, but keep the rest (bonuses, family)
            if (window.state) {
                window.state.selectedTalents = [];
            }
        }

        showScreen('talent-selection');
        renderTalentsNew();
    }

    // Show Demo/Instructions Modal
    function showDemo() {
        const modal = document.getElementById('demo-modal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    // Render Talents in new UI
    function renderTalentsNew() {
        const grid = document.getElementById('talents-grid');
        if (!grid) return;

        const talentsHTML = DATA.talents.map(talent => {
            return `
        <div class="talent-card" data-talent-id="${talent.id}" onclick="selectTalentNew('${talent.id}')">
            <img src="${talent.icon}" alt="${talent.name}" class="talent-icon">
            <h3 class="talent-name">${talent.name}</h3>
            <p class="talent-description">${talent.desc}</p>
            <span class="talent-rarity rare">Rare</span>
        </div>
    `;
        }).join('');

        grid.innerHTML = talentsHTML;
        updateTalentSelectionUI();
    }

    // Select Talent (new version)
    function selectTalentNew(id) {
        const card = document.querySelector('[data-talent-id="' + id + '"]');
        if (!card) return;

        if (card.classList.contains('selected')) {
            // Deselect
            card.classList.remove('selected');
            window.state.selectedTalents = window.state.selectedTalents.filter(t => t !== id);
        } else {
            // Select if under limit
            if (window.state.selectedTalents.length < 3) {
                card.classList.add('selected');
                window.state.selectedTalents.push(id);
            }
        }

        updateTalentSelectionUI();
    }

    // Update Talent Selection UI
    function updateTalentSelectionUI() {
        const countEl = document.getElementById('talent-count');
        const confirmBtn = document.getElementById('confirm-talents-btn');

        if (countEl) {
            countEl.textContent = window.state.selectedTalents.length;
        }

        if (confirmBtn) {
            confirmBtn.disabled = window.state.selectedTalents.length === 0;
        }
    }

    // Confirm Talents and Start Game
    function confirmTalents() {
        if (window.state.selectedTalents.length === 0) return;

        // Calculate base stats (permanent upgrades + parent bonuses already applied during init)
        // We need to store these base values if not already stored
        if (!window.state.baseStats) {
            window.state.baseStats = {
                health: window.state.health || 50,
                intelligence: window.state.intelligence || 50,
                happiness: window.state.happiness || 50,
                appearance: window.state.appearance || 50,
                money: window.state.money || 50
            };
        }

        // Reset stats to base values (removing any previous talent bonuses)
        window.state.health = window.state.baseStats.health;
        window.state.intelligence = window.state.baseStats.intelligence;
        window.state.happiness = window.state.baseStats.happiness;
        window.state.appearance = window.state.baseStats.appearance;
        window.state.money = window.state.baseStats.money;

        // Now apply talent effects (NO CAP - Karma System v4.0)
        window.state.selectedTalents.forEach(talentId => {
            const talent = DATA.talents.find(t => t.id === talentId);
            if (talent && talent.effect) {
                Object.keys(talent.effect).forEach(stat => {
                    // Use updateAttribute to handle uncapped stats
                    updateAttribute(stat, talent.effect[stat], 0);
                });
            }
        });

        // Logic V4: Redirect to Character Creation instead of immediate start
        showCharacterCreation();
    }

    // Update Stats UI
    function updateStatsUI() {
        const stats = ['health', 'intelligence', 'happiness', 'appearance', 'money'];

        stats.forEach(stat => {
            const value = Math.max(0, state[stat] || 50);  // NO MAX CAP
            const valueEl = document.getElementById(stat + '-value');
            const barEl = document.getElementById(stat + '-bar');

            if (valueEl) {
                valueEl.textContent = Math.round(value);

                // Add elite class for values >100
                if (value > 100) {
                    valueEl.classList.add('elite-value');
                } else {
                    valueEl.classList.remove('elite-value');
                }
            }

            if (barEl) {
                // Bar width: 100% at value=100, then stays full but changes color
                const widthPercent = Math.min(100, value);
                barEl.style.width = widthPercent + '%';

                // Add elite class for visual effects
                if (value > 100) {
                    barEl.classList.add('elite');
                    barEl.setAttribute('data-overclock', Math.round(value));
                } else {
                    barEl.classList.remove('elite');
                    barEl.removeAttribute('data-overclock');
                }
            }
        });

        // Stress bar update (v7.0)
        const stress = window.state.stress || 0;
        const stressValueEl = document.getElementById('stress-value');
        const stressBarEl = document.getElementById('stress-bar');

        if (stressValueEl) {
            stressValueEl.textContent = Math.round(stress);

            // Visual warning for burnout levels
            if (stress >= 80) {
                stressValueEl.classList.add('burnout-critical');
                stressValueEl.classList.remove('burnout-warning');
            } else if (stress >= 60) {
                stressValueEl.classList.add('burnout-warning');
                stressValueEl.classList.remove('burnout-critical');
            } else {
                stressValueEl.classList.remove('burnout-warning', 'burnout-critical');
            }
        }

        if (stressBarEl) {
            stressBarEl.style.width = Math.min(100, stress) + '%';

            // Color based on level
            if (stress >= 80) {
                stressBarEl.style.background = 'linear-gradient(90deg, #dc2626, #7f1d1d)';
            } else if (stress >= 60) {
                stressBarEl.style.background = 'linear-gradient(90deg, #f59e0b, #dc2626)';
            } else if (stress >= 40) {
                stressBarEl.style.background = 'linear-gradient(90deg, #eab308, #f59e0b)';
            } else {
                stressBarEl.style.background = 'linear-gradient(90deg, #22c55e, #f59e0b)';
            }
        }

        // Update age
        const ageEl = document.getElementById('player-age');
        if (ageEl) ageEl.textContent = window.state.age;

        // Update emoji based on age AND gender (Logic V6)
        const emojiEl = document.getElementById('player-emoji');
        if (emojiEl) {
            const gender = window.state.gender || 'male';
            if (window.state.age <= 5) {
                emojiEl.textContent = '👶'; // Baby (neutral)
            } else if (window.state.age <= 12) {
                emojiEl.textContent = gender === 'female' ? '👧' : '👦'; // Child
            } else if (window.state.age <= 18) {
                emojiEl.textContent = gender === 'female' ? '👩' : '👨'; // Teen
            } else if (window.state.age <= 60) {
                emojiEl.textContent = gender === 'female' ? '👩' : '👨'; // Adult
            } else {
                emojiEl.textContent = gender === 'female' ? '👵' : '👴'; // Elder
            }
        }
    }

    // Normalize Event Data (Handle both legacy and new formats)
    function normalizeEvent(event) {
        if (!event) return null;

        // Logic V2: Replace underscores with spaces in titles
        let title = event.title || 'Event';
        if (title && title.includes('_')) {
            title = title.replace(/_/g, ' ');
        }

        return {
            ...event,
            title: title,
            description: event.text || event.description, // Map 'text' to 'description'
            isSpecial: event.isSpecial || false,          // Preserve special flag
            options: (event.options || []).map(opt => ({
                ...opt,
                text: opt.t || opt.text,       // Map 't' to 'text'
                effects: opt.e || opt.effects, // Map 'e' to 'effects'
                req: opt.r || opt.req || {},   // Map 'r' to 'req'
                result: opt.result || `You chose to ${opt.t || opt.text || 'act'}.` // Logic V7.3: Dynamic default result
            }))
        };
    }

    // Render Year (new version)
    function renderYearNew() {
        // Apply family costs every year (Family Tree System v6.0)
        applyFamilyCosts();

        // Logic V5: Apply Annual Economy (Salary + Decay)
        applyAnnualEconomy();

        // Check if dead
        if (window.state.health <= 0 || window.state.happiness <= 0) {
            showSummaryScreen();
            return;
        }

        // Get event for current age using new Engine from main.js
        const rawEvent = getNextEvent(window.state.age);

        // Normalize event data
        const event = normalizeEvent(rawEvent);

        // Update event UI
        const yearEl = document.getElementById('event-year');
        const titleEl = document.getElementById('event-title');
        const descEl = document.getElementById('event-description');
        const optionsEl = document.getElementById('event-options');
        const resultEl = document.getElementById('event-result');

        const eventCard = document.querySelector('.event-card'); // Logic V2: Select card for styling

        if (yearEl) yearEl.textContent = 'Year ' + window.state.age;

        if (titleEl) {
            // Logic V2: Special Event Badge
            if (event.isSpecial) {
                // Use innerHTML to allow badge
                // Check if it's positive or negative special to adjust color?
                // For now, use generic ALERT style, maybe user wants red vs green/gold
                // User said: "Red/Orange for negative, Gold/Green for positive"
                // differentiating them might require checking event tags/ID or effects
                // Let's assume most special events from main.js (critical) are negative for now
                // But ELITE events could be special too? 
                // Logic V2 implementation in main.js sets isSpecial=true for Special Events (Critical/Low Prob).

                const badgeColor = '#ff4444'; // Red for alert by default
                titleEl.innerHTML = `<span style="background-color: ${badgeColor}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.8em; vertical-align: middle; margin-right: 5px;">⚠️ SPECIAL</span><br>` + event.title;
                if (eventCard) {
                    eventCard.style.border = `2px solid ${badgeColor}`;
                    eventCard.style.boxShadow = `0 0 15px ${badgeColor}40`;
                }
            } else {
                titleEl.textContent = event.title;
                if (eventCard) {
                    eventCard.style.border = 'none';
                    eventCard.style.boxShadow = 'none';
                }
            }
        }

        if (descEl) descEl.textContent = event.description;
        if (resultEl) resultEl.style.display = 'none';

        // Render options
        if (optionsEl && event.options) {
            const optionsHTML = event.options.map((option, index) => {
                const isLocked = option.req && !checkRequirements(option.req);

                // Burnout v7.0: Block positive karma options when stress >= 60
                // Logic V7.4: Exempt SPECIAL events (like Transcendent Choice) from burnout to prevent softlock
                const isBurnoutLocked = (window.state.stress >= 60) && (option.karma > 0) && !event.isSpecial;

                const lockedClass = (isLocked || isBurnoutLocked) ? 'locked' : '';
                const disabledAttr = (isLocked || isBurnoutLocked) ? 'disabled' : '';

                // Format requirements for locked options
                let reqText = '';
                if (isLocked && option.req) {
                    const reqParts = [];
                    for (let stat in option.req) {
                        const required = option.req[stat];
                        const current = state[stat] || 0;
                        reqParts.push(`${capitalize(stat)}: ${Math.round(current)}/${required}`);
                    }
                    reqText = `<span class="option-requirement">🔒 Requires: ${reqParts.join(', ')}</span>`;
                }

                // Burnout lockout message
                if (isBurnoutLocked) {
                    reqText = `<span class="option-requirement burnout-lock">😵 Too stressed to choose this (${window.state.stress}%)</span>`;
                }

                // Format effects preview (optional - can be hidden for mystery)
                // const effectsText = formatEffects(option.effects);

                return `
                <button class="option-btn ${lockedClass}"
                        onclick="makeChoiceNew(${index})"
                        ${disabledAttr}>
                    <span class="option-text">${option.text}</span>
                    ${reqText}
                </button>
            `;
            }).join('');

            optionsEl.innerHTML = optionsHTML;
        }

        // Store current event (normalized)
        window.state.currentEvent = event;
    }

    // Check Requirements
    function checkRequirements(req) {
        if (!req) return true;
        for (let stat in req) {
            if (state[stat] < req[stat]) return false;
        }
        return true;
    }

    // Format Effects for display
    function formatEffects(effects) {
        if (!effects) return '';
        const parts = [];
        for (let stat in effects) {
            const value = effects[stat];
            if (value > 0) parts.push('+' + value + ' ' + capitalize(stat));
            else if (value < 0) parts.push(value + ' ' + capitalize(stat));
        }
        return parts.join(', ');
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Make Choice (new version)
    function makeChoiceNew(optionIndex) {
        const event = window.state.currentEvent;
        if (!event || !event.options) return;

        const option = event.options[optionIndex];
        if (!option) return;

        // Apply effects using updateAttribute (NO CAP - Karma System v4.0)
        if (option.effects) {
            Object.keys(option.effects).forEach(stat => {
                // Get karma change if exists (default 0)
                const karmaChange = option.karma || 0;
                updateAttribute(stat, option.effects[stat], karmaChange);
            });
        }

        // Execute callback if exists (Family Tree System v6.0)
        if (option.callback) {
            if (option.callback === 'addSpouse' && typeof window.addSpouse === 'function') {
                const spouse = window.addSpouse();
                if (spouse) {
                    console.log('[FAMILY TREE] Spouse added:', spouse);
                }
            } else if (option.callback === 'addChild' && typeof window.addChild === 'function') {
                const child = window.addChild();
                if (child) {
                    console.log('[FAMILY TREE] Child added:', child);
                }
            } else if (option.callback === 'mentorChild') {
                // Twilight v7.0: Mentor Successor for New Game+ bonus
                const children = window.state.family?.children?.filter(c => c.isAlive);
                if (children && children.length > 0) {
                    const mentorTarget = children[option.mentorIndex || 0];
                    if (mentorTarget) {
                        // Determine child's main stat (random or based on inherited)
                        const stats = ['health', 'intelligence', 'happiness', 'appearance', 'money'];
                        const mainStat = stats[Math.floor(Math.random() * stats.length)];

                        // Store mentor bonus in localStorage for next life
                        const upgradesData = JSON.parse(localStorage.getItem('lifesim_permanent_upgrades') || '{}');
                        if (!upgradesData.mentorBonus) {
                            upgradesData.mentorBonus = {};
                        }
                        upgradesData.mentorBonus[mainStat] = (upgradesData.mentorBonus[mainStat] || 0) + 10;
                        localStorage.setItem('lifesim_permanent_upgrades', JSON.stringify(upgradesData));

                        console.log(`[MENTOR] ${mentorTarget.name} mentored! +10 ${mainStat} for next life.`);
                        addToTimeline(window.state.age, `🎓 You mentored ${mentorTarget.name}. +10 ${mainStat} awaits in your next life!`);
                    }
                }
            } else if (option.callback === 'greatDonation') {
                // Twilight v7.0: The Great Donation - 5x Karma multiplier
                const currentKarma = window.state.karma || 0;
                const upgradesData = JSON.parse(localStorage.getItem('lifesim_permanent_upgrades') || '{}');

                // Store 5x karma bonus for next life
                upgradesData.karmaMultiplier = 5;
                upgradesData.lastDonation = currentKarma;
                localStorage.setItem('lifesim_permanent_upgrades', JSON.stringify(upgradesData));

                // Reset money (donation effect)
                window.state.money = 0;

                console.log('[GREAT DONATION] All wealth donated! 5x Karma multiplier stored for next life.');
                addToTimeline(window.state.age, `🏛️ THE GREAT DONATION: You gave everything away. Your karma will be 5x more powerful in your next life!`);
            }
        }

        // State Machine v7.0: Handle persistent flags
        if (option.setFlag) {
            if (!window.state.flags) {
                window.state.flags = {};
            }
            window.state.flags[option.setFlag] = true;
            console.log('[STATE MACHINE] Flag set:', option.setFlag);
        }

        // Logic V4.5: Child Drama & Abandonment Check
        // If user refused child (ID check or text analysis?), spouse might force it.
        // We need a way to identify the "refuse child" choice. 
        // Best way: check if current event is "Family Planning" or "Another Child?" AND option index was the rejection (usually index 1).

        const currentEventInfo = window.state.currentEvent;
        // Check for specific events by Title (safer than IDs if IDs vary)
        const familyEvents = ['👶 Family Planning', '👶 Another Child?', '👶 Late Parenthood'];

        if (currentEventInfo && familyEvents.includes(currentEventInfo.title)) {
            // Rejection is usually index 1 ("No", "Not now")
            if (optionIndex === 1) {
                // Probability of forced child + abandonment
                // "En caso de no querer un hijo, hay una probabilidad de que nuestra esposa pueda decidir tenerlo igualmente y abandonarnos"
                // "Si somos mujer... marido podrá abandonarnos"

                // Chance: 20%?
                if (Math.random() < 0.20) {
                    console.log('[FAMILY DRAMA] Spouse insists on child and leaves!');

                    const isPlayerFemale = window.state.gender === 'female';
                    let forcedChild = false;
                    let abandonmentMsg = '';

                    if (isPlayerFemale) {
                        // Spouse (Male) leaves. Player decides on child? 
                        // "podremos decidir si tenerlo o no y nuestro marido podrá abandonarnos"
                        // Since this is a post-choice reaction, we can't present a NEW choice properly without chaining events.
                        // For simplicity in V4.5: Spouse leaves. Player keeps pregnancy? Or spouse takes child?
                        // "nuestro marido podrá abandonarnos" implies he leaves. Pregnancy is usually on the female. 
                        // Let's assume the "Rejection" was "I don't want a child". 
                        // Spouse gets angry and leaves.
                        abandonmentMsg = "Your partner is furious about your decision! He decides to end the relationship.";

                        // Handle Separation/Divorce
                        if (window.state.family.spouse) {
                            window.state.family.spouse.status = 'Divorced';
                            window.state.family.spouse.description += ' (Reason: Disagreement on children)';
                        }

                    } else {
                        // Player is Male. Spouse (Female) decides to have it.
                        // "esposa pueda decidir tenerlo igualmente y abandonarnos" -> She takes the child and leaves.
                        abandonmentMsg = "Your partner refuses to accept your decision! She decides to have the baby on her own and leaves you.";

                        // 1. Force add child (that she takes)
                        const child = window.addChild();
                        if (child) {
                            child.isIndependent = true; // Effectively gone/with her
                            child.description += ' (Living with Ex)';
                        }

                        // 2. Divorce
                        if (window.state.family.spouse) {
                            window.state.family.spouse.status = 'Divorced';
                            window.state.family.spouse.description += ' (Left with child)';
                        }
                    }

                    // Override the "result" text to show this drama
                    const resultEl = document.getElementById('event-result');
                    if (resultEl) {
                        resultEl.innerHTML += `<br><br><strong style="color: #EF4444;">💔 RELATIONSHIP CRISIS:</strong> ${abandonmentMsg}`;
                        resultEl.style.display = 'block';
                    }

                    // Update Timeline
                    addToTimeline(window.state.age, "Spouse left due to disagreement over children.");
                }
            }
        }

        // Update stats UI
        updateStatsUI();

        // Show result
        const resultEl = document.getElementById('event-result');
        if (resultEl && option.result) {
            resultEl.textContent = option.result;
            resultEl.style.display = 'block';
        }

        // Add to timeline
        // Logic V7.3: Pass result text for detailed history
        addToTimeline(window.state.age, event.title, option.result);

        // Disable all options
        document.querySelectorAll('.option-btn').forEach(btn => btn.disabled = true);

        // Advance to next year after delay
        setTimeout(() => {
            window.state.age++;

            // Apply Aging Mechanics (Logic V2)
            applyAgingEffects();

            // Check if max age or dead
            if (window.state.age > 100 || window.state.health <= 0 || window.state.happiness <= 0) {
                // Logic V3: Cause of Death
                let cause = 'Unknown';
                if (window.state.age > 100) cause = 'Old Age';
                else if (window.state.health <= 0) cause = 'Critical Health Failure';
                else if (window.state.happiness <= 0) cause = 'Complete Despair';

                showSummaryScreen(cause);
            } else {
                renderYearNew();
            }
        }, 2000);
    }

    // Add to Timeline (Milestones)
    function addToTimeline(age, title, description = '') {
        // Add to state history for persistence
        if (!window.state.history) {
            window.state.history = [];
        }

        window.state.history.push({
            age: age,
            event: title,
            description: description,
            timestamp: Date.now()
        });

        // Render in DOM
        const timelineItems = document.getElementById('timeline-items');
        if (!timelineItems) return;

        const item = document.createElement('div');
        item.className = 'timeline-item';

        let contentHTML = `<span class="timeline-age">Age ${age}</span>`;
        contentHTML += `<div class="timeline-content">`;
        contentHTML += `<div class="timeline-title">${title}</div>`;
        if (description) {
            contentHTML += `<div class="timeline-description">${description}</div>`;
        }
        contentHTML += `</div>`;

        item.innerHTML = contentHTML;

        timelineItems.insertBefore(item, timelineItems.firstChild);

        // Limit to last 10 items in UI
        while (timelineItems.children.length > 10) {
            timelineItems.removeChild(timelineItems.lastChild);
        }

        console.log('[TIMELINE] Added milestone:', { age, description });
    }

    // Show Summary Screen
    function showSummaryScreen(cause = 'End of Life') {
        showScreen('summary-screen');

        console.log('[GAME OVER] Cause:', cause);

        // Save children as legacy (Family Tree System v6.0)
        saveChildrenAsLegacy();

        // Save this life to history
        const currentLife = saveLifeToHistory();
        const karmaEarned = currentLife.karmaEarned;

        // Update permanent upgrades with earned karma
        const upgrades = getPermanentUpgrades();
        upgrades.totalKarmaEarned += karmaEarned;
        upgrades.totalLives += 1;
        savePermanentUpgrades(upgrades);

        // Calculate Soul Score (Karma System v4.0)
        const soulScoreData = calculateSoulScore();

        // Update final age
        const finalAgeEl = document.getElementById('final-age');
        if (finalAgeEl) finalAgeEl.textContent = window.state.age;

        // Render Rebirth Dashboard (New Game+ v5.0)
        renderRebirthDashboard(currentLife, karmaEarned, upgrades);

        // Logic V3: Pass cause to renderFinalStats
        renderFinalStats(soulScoreData, cause);
    }

    // Render Rebirth Dashboard
    function renderRebirthDashboard(currentLife, karmaEarned, upgrades) {
        // Inject Rebirth content before final stats
        const container = document.querySelector('#summary-screen .container');
        if (!container) return;

        // Remove old rebirth content if exists
        const oldRebirth = container.querySelector('.rebirth-dashboard');
        if (oldRebirth) oldRebirth.remove();

        const rebirthHTML = `
        <div class="rebirth-dashboard">
            <div class="karma-earned-card">
                <div class="karma-earned-icon">✨</div>
                <h3>Karma Points Earned This Life</h3>
                <div class="karma-earned-value">${karmaEarned}</div>
                <p class="karma-formula">Formula: (Age × 10) + (Money ÷ 100) + (MaxStat × 2)</p>
            </div>

            <div class="rebirth-content">
                <h2 style="color: #6a1b9a; margin-bottom: 20px;">⚡ The Karma Shop - Upgrades for Next Life</h2>
                <p style="color: #666; margin-bottom: 30px;">Invest Karma in bonuses for your next life (Resets on death)</p>
                
                <div class="available-karma">Available Karma: <span class="karma-balance-value">${upgrades.totalKarmaEarned}</span></div>
                </div>

                <div class="karma-shop-grid">
                    <div class="upgrade-card">
                        <div class="upgrade-icon">💰</div>
                        <h4>Inheritance</h4>
                        <p>Start with extra capital</p>
                        <div class="upgrade-level">Level ${upgrades.inheritance}</div>
                        <div class="upgrade-bonus">+${upgrades.inheritance * 100} Money</div>
                        <div class="upgrade-cost">Cost: ${(upgrades.inheritance + 1) * 100} Karma</div>
                        <button class="upgrade-btn" onclick="purchaseUpgrade('inheritance')">Upgrade</button>
                    </div>

                    <div class="upgrade-card">
                        <div class="upgrade-icon">❤️</div>
                        <h4>Genetic Patch</h4>
                        <p>Improve base resistance</p>
                        <div class="upgrade-level">Level ${upgrades.geneticPatch}</div>
                        <div class="upgrade-bonus">+${upgrades.geneticPatch * 5} Health</div>
                        <div class="upgrade-cost">Cost: ${(upgrades.geneticPatch + 1) * 150} Karma</div>
                        <button class="upgrade-btn" onclick="purchaseUpgrade('geneticPatch')">Upgrade</button>
                    </div>

                    <div class="upgrade-card">
                        <div class="upgrade-icon">🧠</div>
                        <h4>Brain Overclock</h4>
                        <p>Boost cognitive capacity</p>
                        <div class="upgrade-level">Level ${upgrades.brainOverclock}</div>
                        <div class="upgrade-bonus">+${upgrades.brainOverclock * 5} Intelligence</div>
                        <div class="upgrade-cost">Cost: ${(upgrades.brainOverclock + 1) * 150} Karma</div>
                        <button class="upgrade-btn" onclick="purchaseUpgrade('brainOverclock')">Upgrade</button>
                    </div>

                    <!-- Voice of Wisdom (Stress Reduction) -->
                    <div class="upgrade-card">
                        <div class="upgrade-icon">🧘</div>
                        <h4>Voice of Wisdom</h4>
                        <p>Reduce job stress (-10%/lvl)</p>
                        <div class="upgrade-level">Level ${upgrades.voiceOfWisdom || 0}</div>
                        <div class="upgrade-bonus">-${(upgrades.voiceOfWisdom || 0) * 10}% Stress</div>
                        <div class="upgrade-cost">Cost: ${((upgrades.voiceOfWisdom || 0) + 1) * 200} Karma</div>
                        <button class="upgrade-btn" onclick="purchaseUpgrade('voiceOfWisdom')">Upgrade</button>
                    </div>

                     <!-- Ancestral Charisma (App/Happy Bonus) -->
                    <div class="upgrade-card">
                        <div class="upgrade-icon">✨</div>
                        <h4>Ancestral Charisma</h4>
                        <p>Start with higher stats</p>
                        <div class="upgrade-level">Level ${upgrades.ancestralCharisma || 0}</div>
                        <div class="upgrade-bonus">+${(upgrades.ancestralCharisma || 0) * 5} App/Happy</div>
                        <div class="upgrade-cost">Cost: ${((upgrades.ancestralCharisma || 0) + 1) * 150} Karma</div>
                        <button class="upgrade-btn" onclick="purchaseUpgrade('ancestralCharisma')">Upgrade</button>
                    </div>
                </div>

                <div class="new-game-plus-stats">
                    <div class="stat-item">
                        <span class="stat-label">Total Lives Lived:</span>
                        <span class="stat-value">${upgrades.totalLives}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Total Karma Earned:</span>
                        <span class="stat-value">${upgrades.totalKarmaEarned}</span>
                    </div>
                </div>

                <!-- Logic V3: Explicit New Life+ Button to keep perks -->
                <div class="new-life-actions" style="margin-top: 20px; text-align: center;">
                    <button class="upgrade-btn" style="background: linear-gradient(135deg, #9C27B0, #E040FB); padding: 15px 30px; font-size: 1.2em; width: 100%; border-radius: 12px; box-shadow: 0 4px 15px rgba(156, 39, 176, 0.4);" onclick="startNewLife()">✨ Start New Life + (Keep Perks)</button>
                    <p style="font-size: 0.9em; color: #888; margin-top: 10px;">(Uses current Upgrades for next life)</p>
                </div>
            </div>
        </div>
    `;

        container.insertAdjacentHTML('afterbegin', rebirthHTML);
    }

    // Render Final Stats
    function renderFinalStats(soulScoreData, causeOfDeath = null) {
        const finalStatsEl = document.getElementById('final-stats');
        if (!finalStatsEl) return;

        const stats = [
            { icon: '❤️', label: 'Health', value: window.state.health, stat: 'health' },
            { icon: '🧠', label: 'Intelligence', value: window.state.intelligence, stat: 'intelligence' },
            { icon: '😊', label: 'Happiness', value: window.state.happiness, stat: 'happiness' },
            { icon: '✨', label: 'Appearance', value: window.state.appearance, stat: 'appearance' },
            { icon: '💰', label: 'Money', value: window.state.money, stat: 'money' }
        ];

        const finalStatsHTML = stats.map(s => {
            const isElite = s.value > 100;
            const eliteClass = isElite ? 'elite-stat' : '';
            return `
        <div class="final-stat-card ${eliteClass}">
            <div class="final-stat-icon">${s.icon}</div>
            <div class="final-stat-label">${s.label}</div>
            <div class="final-stat-value">${Math.round(s.value)}</div>
            ${isElite ? '<div class="elite-badge">⚡ ELITE</div>' : ''}
        </div>
    `;
        }).join('');

        // Add Soul Score card & Cause of Death (Logic V3)
        let causeHTML = '';
        if (causeOfDeath) {
            causeHTML = `
            <div class="final-stat-card cause-of-death-card" style="border: 2px solid #888; background: #eee;">
                <div class="final-stat-icon">💀</div>
                <div class="final-stat-label">Cause of Death</div>
                <div class="final-stat-value" style="font-size: 1.2em;">${causeOfDeath}</div>
            </div>`;
        }

        const karma = typeof window.state.karma === 'number' ? window.state.karma : 0;
        const soulScoreHTML = `
        ${causeHTML}
        <div class="final-stat-card soul-score-card">
            <div class="final-stat-icon">✨</div>
            <div class="final-stat-label">${soulScoreData.title}</div>
            <div class="final-stat-value">${Math.round(soulScoreData.soulScore)}</div>
            <div class="soul-score-description">${soulScoreData.description}</div>
        </div>
        <div class="karma-summary-card">
            <div class="karma-label">Total Karma</div>
            <div class="karma-value ${karma >= 0 ? 'positive' : 'negative'}">${karma >= 0 ? '+' : ''}${karma}</div>
        </div>
    `;

        finalStatsEl.innerHTML = soulScoreHTML + finalStatsHTML;

        // Render milestones
        const milestonesEl = document.getElementById('milestones-list');
        if (milestonesEl) {
            const timelineItems = document.getElementById('timeline-items');
            if (timelineItems) {
                const items = Array.from(timelineItems.querySelectorAll('.timeline-item'));
                const milestonesHTML = items.map(item => {
                    const age = item.querySelector('.timeline-age') ? item.querySelector('.timeline-age').textContent : '';
                    const text = item.querySelector('.timeline-text') ? item.querySelector('.timeline-text').textContent : '';
                    return `
                    <div class="milestone-item">
                        <span class="milestone-age">${age}:</span>
                        <span class="milestone-text">${text}</span>
                    </div>
                `;
                }).join('');

                milestonesEl.innerHTML = milestonesHTML;
            }
        }
    }

    // Hard Reset - Clear ALL localStorage and start fresh
    function restartGame() {
        console.log('[HARD RESET] Clearing all localStorage...');

        // Clear ALL localStorage (including karma, upgrades, history)
        localStorage.clear();

        console.log('[HARD RESET] Forcing page reload...');

        // Force complete page reload
        window.location.reload(true);
    }

    // Start New Life (with New Game+ bonuses)
    function startNewLife() {
        // Load permanent upgrades (which are now Temporary/Next Life upgrades)
        const upgrades = getPermanentUpgrades();

        // Calculate Store Bonuses
        let moneyBonus = (upgrades.inheritance || 0) * 100;
        let healthBonus = (upgrades.geneticPatch || 0) * 5;
        let intelligenceBonus = (upgrades.brainOverclock || 0) * 5;

        // Logic V7.1: Apply Endgame Bonuses (Mentor + Great Donation)
        // Mentor Bonus
        if (upgrades.mentorBonus) {
            Object.keys(upgrades.mentorBonus).forEach(stat => {
                if (stat === 'intelligence') intelligenceBonus += upgrades.mentorBonus[stat];
                else if (stat === 'health') healthBonus += upgrades.mentorBonus[stat];
                else if (stat === 'money') moneyBonus += upgrades.mentorBonus[stat];
                // Other stats handled in applyParentBonuses or initial state? 
                // Let's add them to window.state directly if needed, but for now focus on main 3.
                // Or better: store them to be applied in confirmTalents/applyParentBonuses
            });
        }

        // Great Donation Multiplier (Already stored in upgrades, handled in calculateKarmaEarned)

        // Logic V6: Generate Family for New Life
        const parents = generateParents();
        const godparents = rollForGodparents();

        // 1. Initialize State (Clean Slate + Bonuses)
        window.state = {
            age: 0,
            health: 50 + healthBonus,
            happiness: 50 + ((upgrades.ancestralCharisma || 0) * 5), // Logic V7.9: Ancestral Charisma
            intelligence: 50 + intelligenceBonus,
            money: 50 + moneyBonus,
            appearance: 50 + ((upgrades.ancestralCharisma || 0) * 5), // Logic V7.9: Ancestral Charisma
            voiceOfWisdomLevel: upgrades.voiceOfWisdom || 0, // Store for gameplay logic
            karma: 0,
            eliteFlags: { health: false, intelligence: false, happiness: false, appearance: false, money: false },
            karmaHistory: [],
            history: [],
            selectedTalents: [],
            currentEvent: null,
            family: {
                parents: parents,
                godparents: godparents,
                spouse: null,
                children: []
            },
            creation: { name: '', gender: '' }
        };

        // 2. Apply complex bonuses (Mentor stats other than main 3)
        if (upgrades.mentorBonus) {
            Object.keys(upgrades.mentorBonus).forEach(stat => {
                if (!['intelligence', 'health', 'money'].includes(stat) && window.state[stat] !== undefined) {
                    window.state[stat] += upgrades.mentorBonus[stat];
                }
            });
        }

        // 3. Apply Parent Bonuses
        applyParentBonuses();

        // 4. RESET "PERMANENT" UPGRADES (Make them Temporary/Per-Life)
        // We keep totalLives and totalKarmaEarned, and karmaMultiplier (for *this* life's earning)
        // We reset the Store Levels and Mentor Bonus (consumed)

        // Store current multiplier for this life
        window.state.activeKarmaMultiplier = upgrades.karmaMultiplier || 1;

        // Reset consumable upgrades
        upgrades.inheritance = 0;
        upgrades.geneticPatch = 0;
        upgrades.geneticPatch = 0;
        upgrades.brainOverclock = 0;
        upgrades.voiceOfWisdom = 0; // Reset
        upgrades.ancestralCharisma = 0; // Reset
        upgrades.mentorBonus = null; // Consumed
        upgrades.karmaMultiplier = 1; // Consumed (reset to default)

        savePermanentUpgrades(upgrades); // Save the reset state to localStorage

        // Clear timeline UI
        const timelineItems = document.getElementById('timeline-items');
        if (timelineItems) timelineItems.innerHTML = '';

        console.log('[NEW LIFE] Bonuses applied & Store Levels Reset (Temporary Mode).');

        // Logic V7.1: Go directly to Character Creation or Talent Selection?
        // showTalentSelection(true) handles state initialization, which we just did manually.
        // We want to skip showTalentSelection's state wipe.

        // Let's go to Talent Selection but pass a flag to SKIP state init
        showTalentSelection(true);
    }

    // Purchase Upgrade from Karma Shop
    // Purchase Upgrade from Karma Shop
    function purchaseUpgrade(upgradeType) {
        const upgrades = getPermanentUpgrades();
        const currentLevel = upgrades[upgradeType] || 0;

        // Calculate cost
        let cost;
        if (upgradeType === 'inheritance') {
            cost = (currentLevel + 1) * 100;
        } else {
            cost = (currentLevel + 1) * 150;
        }

        // Check if enough karma
        if (upgrades.totalKarmaEarned < cost) {
            // Logic V3: Instant visual feedback instead of alert
            const btn = event.target; // Get button element
            const originalText = btn.textContent;
            btn.textContent = `Need ${cost} Karma`;
            btn.style.backgroundColor = '#ff4444';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = '';
            }, 1000);
            return;
        }

        // Deduct karma and upgrade
        upgrades.totalKarmaEarned -= cost;
        upgrades[upgradeType] = currentLevel + 1;

        // Save to localStorage
        savePermanentUpgrades(upgrades);

        // Logic V3: Update UI without full re-render if possible, or re-render cleanly
        // Using renderRebirthDashboard causes a flicker but ensures consistency.
        // Let's optimize: Update the specific card and balance value directly if possible?
        // Actually, renderRebirthDashboard is fast enough. 
        // But the user complained about "alert" and "popup". Removing alert is key.
        // We need to keep the dashboard open.

        // Re-render dashboard
        const currentLife = {
            karmaEarned: 0,
            age: window.state.age,
            finalStats: {
                health: window.state.health || 50,
                intelligence: window.state.intelligence || 50,
                happiness: window.state.happiness || 50,
                appearance: window.state.appearance || 50,
                money: window.state.money || 50
            }
        };
        renderRebirthDashboard(currentLife, 0, upgrades);
    }

    // View Family
    // ===== FAMILY TREE VISUALIZATION =====

    /**
     * Get stat icon
     */
    function getStatIcon(stat) {
        const icons = {
            health: '❤️',
            intelligence: '🧠',
            happiness: '😊',
            appearance: '✨',
            money: '💰',
            karma: '⚡'
        };
        return icons[stat] || '📊';
    }

    // Logic V5: Dynamic Player Profession based on Intelligence & Age
    function determinePlayerJob() {
        const age = window.state.age;
        const intel = window.state.intelligence;

        if (age < 18) return { title: 'Student', icon: '🎓', tier: 0 };
        if (age >= 18 && age < 22 && intel > 50) return { title: 'University Student', icon: '📚', tier: 1 };
        if (age >= 65) return { title: 'Retired', icon: '👴', tier: 0 };

        // Job Tiers based on Intelligence
        if (intel < 30) return { title: 'Unemployed', icon: '🏠', tier: 0 };
        if (intel < 50) return { title: 'Manual Laborer', icon: '🛠️', tier: 1 };
        if (intel < 70) return { title: 'Office Clerk', icon: '💼', tier: 2 };
        if (intel < 90) return { title: 'Professional', icon: '👔', tier: 3 };
        return { title: 'Executive / Expert', icon: '🚀', tier: 4 };
    }

    /**
     * Render player card for family tree
     */
    function renderPlayerCard() {
        // Logic V4.5: Use chosen name instead of "Player"
        const finalName = window.state.name || 'Player';
        // Logic V5: Add Profession
        const job = determinePlayerJob();

        return `
        <div class="family-card player-card">
            <div class="family-card-header">
                <span class="family-relation">You</span>
            </div>
            <div class="family-card-body">
                <div class="family-name">${finalName}</div>
                <div class="family-details" style="font-size: 0.9em; margin-bottom: 5px;">
                    ${job.icon} ${job.title}
                </div>
                <div class="family-age">Age: ${window.state.age}</div>
                <div class="player-stats-mini">
                    <span>❤️ ${Math.round(window.state.health)}</span>
                    <span>🧠 ${Math.round(window.state.intelligence)}</span>
                    <span>😊 ${Math.round(window.state.happiness)}</span>
                </div>
            </div>
        </div>
    `;
    }

    // Logic V5: Apply Annual Economy (Salary + Decay) - MOVED TO v7.0 SECTION ABOVE
    // Old function removed to prevent conflict with Stress System

    /**
     * Kill a family member (Logic V2)
     * @param {string} relation - Relation to kill ('spouse', 'parent', 'child')
     * @param {string} id - Specific ID (optional, for children/parents)
     */
    function killFamilyMember(relation, id = null) {
        if (!window.state.family) return;

        let member = null;

        if (relation === 'spouse' && window.state.family.spouse) {
            member = window.state.family.spouse;
        } else if (relation === 'parent') {
            // Kill a random parent if no ID
            const aliveParents = window.state.family.parents.filter(p => p.isAlive);
            if (aliveParents.length > 0) {
                member = id ? window.state.family.parents.find(p => p.id === id) : aliveParents[0];
            }
        } else if (relation === 'child') {
            const aliveChildren = window.state.family.children.filter(c => c.isAlive);
            if (aliveChildren.length > 0) {
                member = id ? window.state.family.children.find(c => c.id === id) : aliveChildren[0];
            }
        }

        if (member && member.isAlive) {
            member.isAlive = false;
            console.log(`[FAMILY TREE] ${member.name} (${member.relation}) died.`);

            // Impact stats (massive blow)
            updateAttribute('happiness', -30, 0);
            updateAttribute('health', -10, 0); // Grief affects health

            addToTimeline(window.state.age, `Death of ${member.relation}: ${member.name}`);
        }
    }

    /**
     * Render family member card
     * Logic V2: Support for Deceased status and Styles
     */
    function renderFamilyCard(member) {
        // Logic V3: Status & Independence
        const isDead = member.isAlive === false;
        const checkDead = member.hasOwnProperty('isAlive') ? !member.isAlive : false;

        const cardClass = checkDead ? 'family-card deceased' : 'family-card';
        // Inline style for badges
        let statusBadge = '';

        if (checkDead) {
            statusBadge += '<span style="background-color: #333; color: #aaa; padding: 2px 6px; border-radius: 4px; font-size: 0.8em; margin-left: 5px; border: 1px solid #555;">💀 Deceased</span>';
        }

        if (member.isIndependent) {
            statusBadge += '<span style="background-color: #4CAF50; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.8em; margin-left: 5px;">🦅 Independent</span>';
        }

        if (member.status === 'Separated') {
            statusBadge += '<span style="background-color: #FF9800; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.8em; margin-left: 5px;">💔 Separated</span>';
        } else if (member.status === 'Divorced') {
            statusBadge += '<span style="background-color: #F44336; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.8em; margin-left: 5px;">📄 Divorced</span>';
        }

        // Logic V3: Formatting relation text
        let relationText = member.relation;
        if (member.relation === 'Spouse' || member.relation === 'Partner') {
            if (member.isAlive) {
                if (member.status === 'Separated') relationText += ' (Separated)';
                else if (member.status === 'Divorced') relationText += ' (Ex)';
                else if (member.isMarried) relationText += ' (Married)';
                else relationText += ' (Partner)';
            }
        }

        // Hide stats if independent (Logic V3: "ya no aplicarán sus stats")
        const hideStats = checkDead || member.isIndependent || member.status === 'Divorced';

        const bonusHTML = !hideStats && Object.keys(member.bonus || {}).map(stat => {
            const value = member.bonus[stat];
            // Separation = 50% logic handled in applyFamilyCosts, check if we show full or half here?
            // Usually UI shows potential. But let's show actual effect? 
            // "Stats of spouse will be 50%".
            // Let's just show the base bonus and the status badge implies the reduction, or calculate it?
            // To keep it simple and consistent with `applyFamilyCosts`, we display the *base* bonus, 
            // but the user might be confused. Let's stick to base + Badge explanation.

            const icon = getStatIcon(stat);
            const sign = value >= 0 ? '+' : '';
            return `<span class="bonus-chip ${value >= 0 ? 'positive' : 'negative'}">${icon} ${sign}${value}</span>`;
        }).join('') || '';

        const costHTML = !hideStats && Object.keys(member.cost || {}).map(stat => {
            const value = member.cost[stat];
            const icon = getStatIcon(stat);
            return `<span class="bonus-chip negative">${icon} ${value}/year</span>`;
        }).join('') || '';

        // Add inline grayscale for dead/divorced cards
        const cardStyle = checkDead ? 'filter: grayscale(100%); opacity: 0.7;' : (member.status === 'Divorced' ? 'opacity: 0.6; border: 1px dashed #ccc;' : '');

        return `
        <div class="${cardClass} ${member.isGifted ? 'gifted' : ''}" style="${cardStyle}">
            <div class="family-card-header">
                <span class="family-relation">${relationText}</span>
                ${member.isGifted ? '<span class="gifted-badge">⭐ Gifted</span>' : ''}
                ${statusBadge}
            </div>
            <div class="family-card-body">
                <div class="family-name">${member.name}</div>
                <div class="family-age">Age: ${member.age}</div>
                ${member.professionIcon ? `<div class="family-profession">${member.professionIcon} ${member.profession}</div>` : ''}
                ${member.personality ? `<div class="family-personality">${member.personality}</div>` : ''}
                ${member.description ? `<div class="family-description">${member.description}</div>` : ''}
                ${bonusHTML ? `<div class="family-bonuses">${bonusHTML}</div>` : ''}
                ${costHTML ? `<div class="family-costs">${costHTML}</div>` : ''}
            </div>
        </div>
    `;
    }

    /**
     * Render complete family tree
     */
    function renderFamilyTree() {
        const container = document.getElementById('family-tree-container');
        if (!container || !window.state.family) return;

        let html = '';

        // Padrinos (si existen)
        if (window.state.family.godparents && window.state.family.godparents.length > 0) {
            html += '<div class="family-tier godparents-tier">';
            html += '<h3 class="tier-title">⭐ Godparents (from past lives)</h3>';
            html += '<div class="family-row">';
            window.state.family.godparents.forEach(godparent => {
                html += renderFamilyCard(godparent);
            });
            html += '</div></div>';
        }

        // Padres
        html += '<div class="family-tier parents-tier">';
        html += '<h3 class="tier-title">Parents</h3>';
        html += '<div class="family-row">';
        window.state.family.parents.forEach(parent => {
            html += renderFamilyCard(parent);
        });
        html += '</div></div>';

        // Conector visual
        html += '<div class="family-connector"></div>';

        // Jugador + Cónyuge
        html += '<div class="family-tier player-tier">';
        html += '<h3 class="tier-title">You & Spouse</h3>';
        html += '<div class="family-row">';
        html += renderPlayerCard();
        if (window.state.family.spouse) {
            html += renderFamilyCard(window.state.family.spouse);
        }
        html += '</div></div>';

        // Hijos
        if (window.state.family.children.length > 0) {
            html += '<div class="family-connector"></div>';
            html += '<div class="family-tier children-tier">';
            html += '<h3 class="tier-title">Children</h3>';
            html += '<div class="family-row">';
            window.state.family.children.forEach(child => {
                html += renderFamilyCard(child);
            });
            html += '</div></div>';
        }

        container.innerHTML = html;
    }

    /**
     * Open family tree modal
     */
    function viewFamily() {
        renderFamilyTree();
        const modal = document.getElementById('family-modal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    // Close Modal
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    }

    // Share Results
    function shareResults() {
        const text = 'I lived ' + window.state.age + ' years in Virtual Life Restart Simulator!';
        if (navigator.share) {
            navigator.share({
                title: 'My Virtual Life',
                text: text
            });
        } else {
            alert(text + '\n\n(Share functionality not supported on this device)');
        }
    }

    // Initialize new UI
    function initNewUI() {
        console.log('[NEW UI] Initializing Playful Geometric interface...');

        // Load permanent upgrades from localStorage (New Game+ v5.0)
        const upgrades = getPermanentUpgrades();

        // Calculate bonuses from upgrades
        const moneyBonus = upgrades.inheritance * 100;
        const healthBonus = upgrades.geneticPatch * 5;
        const intelligenceBonus = upgrades.brainOverclock * 5;

        console.log('[NEW GAME+] Bonuses applied:', { moneyBonus, healthBonus, intelligenceBonus });

        // Generate family (Family Tree System v6.0)
        const parents = generateParents();
        const godparents = rollForGodparents();

        console.log('[FAMILY TREE] Generated parents:', parents);
        if (godparents.length > 0) {
            console.log('[FAMILY TREE] Godparents from past lives:', godparents);
        }

        // Initialize state if not exists
        if (typeof state === 'undefined') {
            window.state = {
                age: 0,
                health: 50 + healthBonus,        // Apply genetic patch bonus
                happiness: 50,
                intelligence: 50 + intelligenceBonus,  // Apply brain overclock bonus
                money: 50 + moneyBonus,          // Apply inheritance bonus
                appearance: 50,
                karma: 0,  // Karma system v4.0
                eliteFlags: {  // Track when stats exceed 100
                    health: false,
                    intelligence: false,
                    happiness: false,
                    appearance: false,
                    money: false
                },
                karmaHistory: [],  // Log of all karma changes
                history: [],  // Life milestones/events history
                selectedTalents: [],
                currentEvent: null,
                family: {  // Family Tree System v6.0
                    parents: parents,
                    godparents: godparents,
                    spouse: null,
                    children: []
                }
            };
        }

        // Apply parent bonuses to initial stats
        applyParentBonuses();

        console.log('[FAMILY TREE] Final initial stats after parent bonuses:', {
            health: window.state.health,
            intelligence: window.state.intelligence,
            money: window.state.money,
            happiness: window.state.happiness,
            karma: window.state.karma
        });

        // Show home screen by default
        showScreen('home-screen');

        console.log('[NEW UI] Initialization complete');
    }

    // Override old window.onload
    const oldInit = window.onload;
    window.onload = function () {
        // Init new UI
        initNewUI();
    };

    // ===== V4 CHARACTER CREATION LOGIC =====

    function showCharacterCreation() {
        showScreen('character-creation-screen');
        // Initialize creation state
        window.state.creation = { name: '', gender: '' };
    }

    function selectGender(gender) {
        window.state.creation.gender = gender;

        // Update UI
        document.querySelectorAll('.gender-btn').forEach(btn => {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-secondary');
        });

        const selectedBtn = document.getElementById('btn-' + gender);
        if (selectedBtn) {
            selectedBtn.classList.remove('btn-secondary');
            selectedBtn.classList.add('btn-primary');
        }
    }

    function confirmCharacterCreation() {
        const nameInput = document.getElementById('char-name');
        const name = nameInput ? nameInput.value.trim() : '';
        const gender = window.state.creation.gender;

        if (!name) {
            alert('Please enter your name.'); // Cleaner validation later?
            return;
        }
        if (!gender) {
            alert('Please select a gender.');
            return;
        }

        window.state.creation.name = name;

        // Generate Story
        generateIntroStory();
        showScreen('intro-story-screen');
    }

    function generateIntroStory() {
        const father = window.state.family.parents.find(p => p.relation === 'Father');
        const mother = window.state.family.parents.find(p => p.relation === 'Mother');
        const name = window.state.creation.name;
        const gender = window.state.creation.gender;
        const currentYear = new Date().getFullYear(); // Or hypothetical game year

        const storyTextIn = document.getElementById('intro-story-text');
        if (storyTextIn) {
            storyTextIn.innerHTML = `
                <p>In the year ${currentYear - 20}, fate brought together <strong>${father.name}</strong>, a ${father.personality.toLowerCase()} ${father.profession.toLowerCase()}, and <strong>${mother.name}</strong>, a ${mother.personality.toLowerCase()} ${mother.profession.toLowerCase()}.</p>
                <br>
                <p>Their love story was one for the ages. After building a life together, they welcomed a new miracle into the world...</p>
                <br>
                <p>A beautiful baby <strong>${gender === 'male' ? 'boy' : 'girl'}</strong> named <strong>${name}</strong>.</p>
                <br>
                <p style="font-weight:bold; font-size: 1.5em; color: #8B5CF6;">Your journey begins now.</p>
            `;
        }
    }

    function beginLife() {
        // Finalize Character Data
        window.state.name = window.state.creation.name;
        window.state.gender = window.state.creation.gender;

        // Update Sidebar
        const nameEl = document.getElementById('player-name');
        if (nameEl) nameEl.textContent = window.state.name;

        // Start simulation
        showScreen('simulation-screen');
        updateStatsUI();
        renderYearNew();
    }

    // ===== EXPOSE FUNCTIONS GLOBALLY FOR HTML ONCLICK HANDLERS =====
    window.showTalentSelection = showTalentSelection;
    window.showDemo = showDemo;
    window.confirmTalents = confirmTalents;
    window.selectTalentNew = selectTalentNew;
    window.makeChoiceNew = makeChoiceNew;
    window.restartGame = restartGame;
    window.startNewLife = startNewLife;
    window.viewFamily = viewFamily;
    window.closeModal = closeModal;
    window.shareResults = shareResults;
    window.purchaseUpgrade = purchaseUpgrade;
    window.addSpouse = addSpouse;  // Family Tree System v6.0
    window.addChild = addChild;    // Family Tree System v6.0

    // V4 Exports
    window.showCharacterCreation = showCharacterCreation;
    window.selectGender = selectGender;
    window.confirmCharacterCreation = confirmCharacterCreation;
    window.beginLife = beginLife;

    console.log("[NEW UI] Integration layer loaded successfully");
    console.log("[NEW UI] Global functions exposed for HTML onclick handlers");



    /**
     * Apply Aging Mechanics (Logic V2)
     * Age 60+: Int -1, App -1, Health -1/2yrs
     */
    function applyAgingEffects() {
        const age = window.state.age;
        if (age < 60) return;

        console.log('[aging] Applying aging effects for age:', age);

        // Intelligence & Appearance decay every year
        updateAttribute('intelligence', -1, 0);
        updateAttribute('appearance', -1, 0);

        // Health decay every 2 years
        if (age % 2 === 0) {
            updateAttribute('health', -1, 0);
        }
    }

})();
