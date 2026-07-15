// ===== GAME EVENTS DATABASE v7.0 =====
// Hybrid Event System: Priority Events + Original Events Pool
// All events renamed without Windows file extensions (.EXE, .SYS, .BAT, .LOG removed)

// ===== CHAINED EVENTS (Narrative Ribbons) v7.6 =====
// These events can be triggered if their 'requiresFlag' is active in window.state.flags
const CHAINED_EVENTS = [
    // --- STARTUP CHAIN ---
    {
        title: '🚀 Startup: Initial Traction',
        description: 'Your startup is gaining attention. Investors are sniffing around.',
        requiresFlag: 'active_startup',
        options: [
            {
                text: 'Seek Venture Capital',
                effects: { money: 2000, stress: 20 },
                result: 'You secured funding! But now the pressure is on.',
                setFlag: 'startup_funded'
            },
            {
                text: 'Bootstrap (Self-Funded)',
                effects: { money: -500, stress: 30, independence: 10 },
                result: 'Hard work, but you own 100% of the company.',
                setFlag: 'startup_bootstrapped'
            }
        ]
    },
    {
        title: '📉 Startup: The Pivot',
        description: 'Market conditions have shifted. Your original product isn\'t scaling.',
        requiresFlag: 'startup_funded', // Triggered if funded
        options: [
            {
                text: 'Pivot to AI/Blockchain',
                effects: { intelligence: 10, stress: 15 },
                result: 'A risky move, but the board loves buzzwords.',
                setFlag: 'startup_pivot_ai'
            },
            {
                text: 'Stay the course',
                effects: { money: -1000, happiness: -10 },
                result: 'You burn through cash trying to make it work.'
            }
        ]
    },
    {
        title: '🦄 Startup: The Exit',
        description: 'A tech giant makes an acquisition offer for your company.',
        requiresFlag: 'startup_pivot_ai', // Follows the pivot
        options: [
            {
                text: 'Sell the company',
                effects: { money: 50000, happiness: 40, stress: -50 },
                result: 'You sold out! You are now incredibly wealthy.',
                clearFlag: ['active_startup', 'startup_funded', 'startup_pivot_ai'] // End the chain
            },
            {
                text: 'Reject offer (IPO)',
                effects: { money: 10000, stress: 50 },
                result: 'You go public. Use wealth, but the grind never ends.',
                setFlag: 'tech_mogul'
            }
        ]
    }
];

// ===== PRIORITY EVENTS (Checked First) =====
const PRIORITY_EVENTS = [
    // ===== FAMILY TREE EVENTS v6.0 =====
    {
        age: 26,
        title: '💍 Wedding Bells',
        description: 'You met someone special. They want to settle down with you. Are you ready for marriage?',
        options: [
            {
                text: 'Get married',
                effects: { happiness: 20, money: -500 },
                result: 'You got married! A new chapter begins.',
                callback: 'addSpouse'
            },
            {
                text: 'Stay single',
                effects: { money: 100, happiness: -5 },
                result: 'You focus on your career instead. Maybe later.'
            }
        ]
    },
    {
        age: 30,
        title: '👶 Family Planning',
        description: 'Your spouse wants to have a baby. Are you ready to become a parent?',
        requiresSpouse: true,
        options: [
            {
                text: 'Have a baby',
                effects: { happiness: 30, money: -1000 },
                result: 'Congratulations! You have a beautiful baby.',
                callback: 'addChild'
            },
            {
                text: 'Wait a bit longer',
                effects: { happiness: -10 },
                result: 'You decide to wait for better timing. Your spouse understands.'
            }
        ]
    },
    {
        age: 33,
        title: '👶 Another Child?',
        description: 'Life with one child is amazing. Would you like to have another?',
        requiresSpouse: true,
        options: [
            {
                text: 'Have another child',
                effects: { happiness: 25, money: -800 },
                result: 'Your family grows! Another precious life joins you.',
                callback: 'addChild'
            },
            {
                text: 'Stop at one',
                effects: { money: 200 },
                result: 'You decide one child is perfect for your family.'
            }
        ]
    },
    {
        age: 28,
        title: '👶 Surprise Pregnancy',
        description: 'Unexpected news! You\'re going to have a baby sooner than planned.',
        // requiresSpouse removed - allows single parent path
        options: [
            {
                text: 'Embrace the surprise',
                effects: { happiness: 20, money: -600 },
                result: 'Life has its own plans. You welcome this blessing.',
                callback: 'addChild'
            },
            {
                text: 'Raise alone bravely (Single Parent)',
                effects: { happiness: 15, money: -800, health: -10 },
                karma: 30,
                result: 'It won\'t be easy, but you\'ll give this child everything. Massive respect.',
                callback: 'addChild',
                setFlag: 'single_parent_hero'
            },
            {
                text: 'Feel overwhelmed',
                effects: { happiness: -15, money: -600 },
                result: 'You struggle with the timing but accept it.',
                callback: 'addChild'
            }
        ]
    },
    {
        age: 35,
        title: '👶 Late Parenthood',
        description: 'You\'re older now, but still want to expand your family. Is it the right time?',
        requiresSpouse: true,
        options: [
            {
                text: 'Try for another baby',
                effects: { happiness: 15, money: -1200, health: -5 },
                result: 'Age brings challenges, but also wisdom in parenting.',
                callback: 'addChild'
            },
            {
                text: 'Focus on existing family',
                effects: { happiness: 10, money: 100 },
                result: 'You cherish the family you already have.'
            }
        ]
    },
    // === FLAG-TRIGGERED EVENTS ===
    {
        age: 35,
        title: '📰 Professional Scandal',
        description: 'Your past catches up with you. Someone from your school days exposed that you cheated on tests years ago. The story is spreading on social media.',
        requiresFlag: 'cheater_flag',
        options: [
            {
                text: 'Admit publicly and apologize',
                effects: { happiness: -20, appearance: -15, money: -50 },
                karma: 25,
                result: 'You own your mistake. Many respect your honesty. Some old wounds heal.'
            },
            {
                text: 'Deny everything aggressively',
                effects: { happiness: -10, appearance: -30, intelligence: -10 },
                karma: -35,
                result: 'The evidence mounts against you. Your reputation crumbles. Should have been honest.'
            },
            {
                text: 'Quietly resign and start fresh',
                effects: { happiness: -15, money: -100, appearance: -10 },
                karma: 10,
                result: 'You leave with dignity, if not honor. A fresh start elsewhere awaits.'
            }
        ]
    },
    // ===== TWILIGHT ENDGAME EVENTS v7.0 =====
    {
        age: 65,
        title: '👴 Mentor Your Successor',
        description: 'Retirement approaches. You can pass your wisdom to the next generation. Choose one of your children to mentor - they will receive a permanent +10 bonus to their main stat in your next life.',
        requiresChildren: true,
        options: [
            {
                text: 'Train eldest child',
                effects: { happiness: 20, karma: 15 },
                karma: 15,
                result: 'You devote your twilight years to training your successor. A legacy of knowledge.',
                callback: 'mentorChild',
                mentorIndex: 0
            },
            {
                text: 'Let them find their own path',
                effects: { happiness: -5 },
                karma: 5,
                result: 'Perhaps independence is the greatest gift. They must make their own way.'
            }
        ]
    },
    {
        age: 80,
        title: '🏛️ The Great Donation',
        description: 'At 80 years old, you stand at the threshold of eternity. Your fortune could secure your family for generations... or transform the world. This choice will define your legacy.',
        options: [
            {
                text: 'Donate everything to charity',
                effects: { money: -99999, happiness: 50 },
                karma: 200,
                result: 'You give away your entire fortune. Hospitals, schools, and shelters bear your name. Your karma is multiplied 5x for your next life.',
                callback: 'greatDonation'
            },
            {
                text: 'Leave inheritance to family',
                effects: { happiness: 15, money: 0 },
                karma: 10,
                result: 'Your wealth will support your descendants. A practical choice.'
            },
            {
                text: 'Burn it all (spite everyone)',
                effects: { happiness: -30, money: -99999 },
                karma: -100,
                result: 'If you cannot take it with you, no one else will have it either. A dark final act.'
            }
        ]
    }
];

// ===== ELITE EVENTS (Stats >100) - Karma System v4.0 =====
const ELITE_EVENTS = [
    {
        age: 19,
        title: '💎 Elite Scholarship Offer',
        description: 'Your exceptional intelligence (>100) has attracted attention from a prestigious global institution offering a full scholarship. But there\'s a catch - they want exclusive rights to your research.',
        requirements: { intelligence: 101 },
        options: [
            {
                text: 'Accept and maintain academic freedom',
                effects: { intelligence: 15, happiness: 10, money: 20 },
                karma: 15,
                result: 'You negotiate brilliantly. They agree to your terms - scholarship with freedom!'
            },
            {
                text: 'Accept but surrender rights',
                effects: { intelligence: 5, money: 30, happiness: -10 },
                karma: -10,
                result: 'Financial security, but you feel like you sold your soul.'
            },
            {
                text: 'Decline and help struggling students',
                effects: { happiness: 20, intelligence: 10, money: -5 },
                karma: 25,
                result: 'You turn it down and start a mentorship program. Respect earned.'
            }
        ]
    },
    {
        age: 20,
        title: '⚡ Superhuman Health Challenge',
        description: 'Your peak physical condition (>100) gets you invited to an experimental medical trial that could help cure diseases. It\'s risky but potentially world-changing.',
        requirements: { health: 101 },
        options: [
            {
                text: 'Volunteer for the trial',
                effects: { health: -20, intelligence: 10, happiness: 15 },
                karma: 30,
                result: 'The trial succeeds! You helped save thousands of lives.'
            },
            {
                text: 'Demand payment first',
                effects: { money: 50, happiness: -5 },
                karma: -15,
                result: 'You profit from people\'s suffering. The money feels dirty.'
            },
            {
                text: 'Use your health to inspire fitness movement',
                effects: { happiness: 25, appearance: 15, money: 10 },
                karma: 20,
                result: 'You become a fitness icon and inspire millions to get healthy.'
            }
        ]
    },
    {
        age: 21,
        title: '✨ Radiant Influence',
        description: 'Your exceptional appearance (>100) has made you incredibly influential. A major brand offers you millions to promote their unhealthy products to young people.',
        requirements: { appearance: 101 },
        options: [
            {
                text: 'Reject and promote healthy living',
                effects: { happiness: 20, appearance: 10, money: -10 },
                karma: 35,
                result: 'You use your platform for good. Young people look up to you.'
            },
            {
                text: 'Accept the lucrative deal',
                effects: { money: 60, happiness: -15, appearance: 5 },
                karma: -25,
                result: 'The money is great but you can\'t look at yourself in the mirror.'
            },
            {
                text: 'Negotiate for ethical products',
                effects: { money: 30, happiness: 15, intelligence: 10 },
                karma: 20,
                result: 'They agree! You get paid AND make a positive impact.'
            }
        ]
    },
    {
        age: 22,
        title: '💰 Elite Wealth Opportunity',
        description: 'Your financial success (>100) attracts investors for a startup. You discover they plan to exploit workers in poor countries.',
        requirements: { money: 101 },
        options: [
            {
                text: 'Expose the scheme',
                effects: { money: -30, happiness: 10, intelligence: 15 },
                karma: 40,
                result: 'You blow the whistle. Lives saved, but you lose investor trust.'
            },
            {
                text: 'Take the money and ignore it',
                effects: { money: 80, happiness: -25 },
                karma: -40,
                result: 'You\'re filthy rich but haunted by guilt every night.'
            },
            {
                text: 'Invest in ethical alternative',
                effects: { money: 20, happiness: 20, intelligence: 10 },
                karma: 30,
                result: 'Slower growth but you sleep soundly. Workers thrive.'
            }
        ]
    },
    {
        age: 23,
        title: 'Happiness Overflow',
        description: 'Your exceptional happiness (>100) is contagious. A struggling friend needs serious help - but helping means sacrificing your own dreams.',
        requirements: { happiness: 101 },
        options: [
            {
                text: 'Sacrifice your dreams to help',
                effects: { happiness: -15, money: -20, intelligence: 5 },
                karma: 45,
                result: 'You save your friend\'s life. They never forget it. True friendship.'
            },
            {
                text: 'Ignore them and pursue dreams',
                effects: { money: 40, happiness: -30, intelligence: 15 },
                karma: -35,
                result: 'You succeed but lose a lifelong friend. Was it worth it?'
            },
            {
                text: 'Find creative win-win solution',
                effects: { happiness: 15, intelligence: 20, money: 10 },
                karma: 35,
                result: 'You help them AND achieve your dreams! Brilliant thinking.'
            }
        ]
    },
    {
        age: 23,
        title: 'Triple Elite Mastery',
        description: 'You\'ve achieved elite status in THREE different areas. A secret organization recruits you for something extraordinary.',
        requirements: { intelligence: 101, health: 101, appearance: 101 },
        options: [
            {
                text: 'Use powers for global good',
                effects: { happiness: 30, intelligence: 20, health: 10 },
                karma: 50,
                result: 'You become a legendary force for positive change in the world.'
            },
            {
                text: 'Leverage for personal empire',
                effects: { money: 100, happiness: -20 },
                karma: -50,
                result: 'You build an empire on others\' backs. Powerful but lonely.'
            },
            {
                text: 'Share knowledge freely',
                effects: { happiness: 25, intelligence: 25, money: -10 },
                karma: 60,
                result: 'You democratize excellence. Society advances by decades.'
            }
        ]
    },
    {
        age: 24,
        title: 'Genius Discovery',
        description: 'Your intelligence (>100) leads to a breakthrough discovery. A corporation wants to weaponize it.',
        requirements: { intelligence: 101 },
        options: [
            {
                text: 'Release it open-source',
                effects: { happiness: 25, intelligence: 15, money: -15 },
                karma: 45,
                result: 'Humanity benefits freely. You\'re a hero to millions.'
            },
            {
                text: 'Sell to military',
                effects: { money: 90, happiness: -30, intelligence: 5 },
                karma: -45,
                result: 'Blood money. Your creation is used in conflicts.'
            },
            {
                text: 'Patent for peaceful use only',
                effects: { money: 40, happiness: 20, intelligence: 20 },
                karma: 35,
                result: 'Controlled release. Profit with principles.'
            }
        ]
    },
    {
        age: 24,
        title: 'Peak Human Performance',
        description: 'Your health (>100) breaks world records. Olympic committee suspects enhancement drugs despite being natural.',
        requirements: { health: 101 },
        options: [
            {
                text: 'Prove natural ability through science',
                effects: { health: 10, intelligence: 15, happiness: 20 },
                karma: 30,
                result: 'You vindicate yourself and inspire genetic research.'
            },
            {
                text: 'Accept false accusations for money',
                effects: { money: 70, happiness: -25, health: -10 },
                karma: -40,
                result: 'You take endorsement deals but lose all respect.'
            },
            {
                text: 'Start natural training academy',
                effects: { happiness: 30, health: 15, money: 20 },
                karma: 40,
                result: 'You revolutionize athletic training worldwide.'
            }
        ]
    },
    {
        age: 25,
        title: 'Elite Social Architect',
        description: 'You have achieved elite status in multiple areas. You are offered leadership of a new global movement. The power is intoxicating.',
        requirements: { eliteStatsCount: 3 },  // Requires any 3 of 5 stats > 100 (not all 5)
        options: [
            {
                text: 'Lead with humility and service',
                effects: { happiness: 40, intelligence: 30, health: 20 },
                karma: 80,
                result: 'You become the greatest leader of this generation. Legacy secured.'
            },
            {
                text: 'Seize absolute power',
                effects: { money: 150, happiness: -40, intelligence: 10 },
                karma: -80,
                result: 'You become a tyrant. Feared by all, loved by none.'
            },
            {
                text: 'Distribute power democratically',
                effects: { happiness: 50, intelligence: 40, money: 30 },
                karma: 100,
                result: 'You create a new model of shared leadership. Revolutionary!'
            }
        ]
    },
    {
        age: 25,
        title: 'Transcendent Choice',
        description: 'You\'ve achieved elite status and positive karma (>50). An opportunity for true transcendence appears.',
        requirements: { intelligence: 101, karma: 50 },
        options: [
            {
                text: 'Ascend to inspire generations',
                effects: { happiness: 50, intelligence: 50, health: 30 },
                karma: 100,
                result: 'You become a timeless symbol of human potential. Immortalized.'
            },
            {
                text: 'Stay grounded, keep growing',
                effects: { happiness: 30, intelligence: 30, health: 20 },
                karma: 50,
                result: 'You remain humble. Continuous growth is your path.'
            },
            {
                text: 'Mentor the next generation',
                effects: { happiness: 40, intelligence: 40, money: 10 },
                karma: 75,
                result: 'You create a legacy through those you teach. Beautiful.'
            }
        ]
    }
];

console.log('[EVENTS.JS] Priority and Elite events loaded successfully');

// ===== ORIGINAL GAME EVENTS (215+ Events) =====
const ALL_EVENTS = {
    early: [
        { id: "early_001", title: "FIRST_WORD", text: "You spoke your first word: 'Mama'. Your parents are overjoyed and record it on their camcorder.", options: [{ t: "Repeat it proudly", r: {}, e: { happiness: 5 } }, { t: "Stay quiet", r: {}, e: { happiness: -3 } }] },
        { id: "early_002", title: "CRAWL_INIT", text: "You're learning to crawl. The living room floor stretches before you like an endless frontier.", options: [{ t: "Crawl toward the TV", r: {}, e: { health: 3, intelligence: 2 } }, { t: "Stay in one place", r: {}, e: { health: -2 } }] },
        { id: "early_003", title: "VACCINE_SHOT", text: "The doctor prepares a vaccine. The needle looks enormous to your tiny eyes.", options: [{ t: "Brave it without crying", r: { health: 40 }, e: { health: 8, happiness: 5 } }, { t: "Cry loudly", r: {}, e: { health: 8, happiness: -5 } }] },
        { id: "early_004", title: "FIRST_STEPS", text: "You take your first steps. Your parents hold out their arms, encouraging you forward.", options: [{ t: "Walk to them", r: {}, e: { happiness: 8, health: 5 } }, { t: "Fall and cry", r: {}, e: { happiness: -4, health: -2 } }] },
        { id: "early_005", title: "BIRTHDAY_CAKE", text: "It's your first birthday! A cake with one candle sits before you.", options: [{ t: "Smash the cake", r: {}, e: { happiness: 10 } }, { t: "Taste it carefully", r: { intelligence: 30 }, e: { happiness: 7, intelligence: 2 } }] },
        { id: "early_006", title: "PLAYDATE_INIT", text: "Your parents arrange a playdate with another toddler. You're not sure about sharing toys.", options: [{ t: "Share toys nicely", r: {}, e: { happiness: 6, appearance: 3 } }, { t: "Hoard all toys", r: {}, e: { happiness: 3, appearance: -5 } }] },
        { id: "early_007", title: "DIAPER_INCIDENT", text: "You've had an accident. Your parents rush to change you.", options: [{ t: "Cooperate", r: {}, e: { happiness: 2 } }, { t: "Squirm and resist", r: {}, e: { happiness: -3, health: -1 } }] },
        { id: "early_008", title: "BEDTIME_STORY", text: "Your parent reads you a bedtime story about a brave knight.", options: [{ t: "Listen carefully", r: { intelligence: 25 }, e: { intelligence: 4, happiness: 5 } }, { t: "Fall asleep immediately", r: {}, e: { health: 3 } }] },
        { id: "early_009", title: "PET_ENCOUNTER", text: "The family dog approaches you. Its tail is wagging.", options: [{ t: "Pet the dog gently", r: {}, e: { happiness: 7, health: 2 } }, { t: "Pull its tail", r: {}, e: { happiness: -3, health: -8 } }] },
        { id: "early_010", title: "POTTY_TRAINING", text: "Your parents introduce you to the potty. It's time to learn this important skill.", options: [{ t: "Try using it", r: { intelligence: 35 }, e: { intelligence: 3, happiness: 8 } }, { t: "Refuse stubbornly", r: {}, e: { happiness: -4 } }] },
        { id: "early_011", title: "SANDBOX_PLAY", text: "You're at the park sandbox. Other kids are building castles.", options: [{ t: "Build with them", r: {}, e: { happiness: 6, intelligence: 2 } }, { t: "Throw sand", r: {}, e: { appearance: -6, happiness: 2 } }] },
        { id: "early_012", title: "NIGHTMARE_PROC", text: "You wake up crying from a bad dream about monsters under the bed.", options: [{ t: "Call for parents", r: {}, e: { happiness: 5, health: -2 } }, { t: "Face your fear alone", r: { intelligence: 30 }, e: { intelligence: 4, happiness: 3 } }] },
        { id: "early_013", title: "CARTOONS_AM", text: "Saturday morning cartoons are on! Your favorite show is starting.", options: [{ t: "Watch attentively", r: {}, e: { happiness: 8 } }, { t: "Play with toys instead", r: {}, e: { intelligence: 3, happiness: 4 } }] },
        { id: "early_014", title: "GROCERY_TANTRUM", text: "At the supermarket, you see candy at the checkout. Your parents say no.", options: [{ t: "Accept it calmly", r: { intelligence: 40 }, e: { intelligence: 5, happiness: -2 } }, { t: "Throw a tantrum", r: {}, e: { happiness: 3, appearance: -8 } }] },
        { id: "early_015", title: "PRESCHOOL_FIRST", text: "Your first day of preschool. Everything is new and colorful.", options: [{ t: "Make new friends", r: { appearance: 30 }, e: { happiness: 10, appearance: 5 } }, { t: "Cling to parent", r: {}, e: { happiness: -5, appearance: -3 } }] },
        { id: "early_016", title: "FINGER_PAINT", text: "Art time! You're given finger paints and a large sheet of paper.", options: [{ t: "Create a masterpiece", r: { intelligence: 35 }, e: { intelligence: 4, happiness: 7 } }, { t: "Paint yourself instead", r: {}, e: { happiness: 8, appearance: -4 } }] },
        { id: "early_017", title: "COUNTING_LESSON", text: "Your parent teaches you to count to ten using your fingers.", options: [{ t: "Learn quickly", r: { intelligence: 40 }, e: { intelligence: 6, happiness: 5 } }, { t: "Get distracted", r: {}, e: { happiness: 3 } }] },
        { id: "early_018", title: "PLAYGROUND_SLIDE", text: "The big slide at the playground looks scary but exciting.", options: [{ t: "Go down bravely", r: { health: 45 }, e: { happiness: 9, health: 3 } }, { t: "Choose the small slide", r: {}, e: { happiness: 4 } }] },
        { id: "early_019", title: "TOOTH_LOSS", text: "Your first baby tooth falls out! The Tooth Fairy legend is mentioned.", options: [{ t: "Put it under pillow", r: {}, e: { happiness: 8, money: 5 } }, { t: "Keep it in a box", r: {}, e: { intelligence: 3, happiness: 4 } }] },
        { id: "early_020", title: "SHARING_SNACK", text: "Another kid at preschool forgot their snack. You have extra cookies.", options: [{ t: "Share your cookies", r: {}, e: { happiness: 7, appearance: 5 } }, { t: "Eat all yourself", r: {}, e: { happiness: 5, appearance: -4 } }] },
        { id: "early_021", title: "RAIN_PUDDLES", text: "It's raining outside. Puddles are forming everywhere.", options: [{ t: "Jump in puddles", r: {}, e: { happiness: 10, health: -3 } }, { t: "Stay inside dry", r: {}, e: { health: 2, happiness: -2 } }] },
        { id: "early_022", title: "ALPHABET_SONG", text: "Learning the ABC song. Your parent sings it with you.", options: [{ t: "Memorize it perfectly", r: { intelligence: 38 }, e: { intelligence: 6, happiness: 6 } }, { t: "Sing gibberish", r: {}, e: { happiness: 7 } }] },
        { id: "early_023", title: "NAP_RESISTANCE", text: "Naptime, but you're not sleepy. Your parent insists.", options: [{ t: "Sleep obediently", r: {}, e: { health: 8, happiness: -3 } }, { t: "Play quietly in bed", r: { intelligence: 30 }, e: { intelligence: 3, happiness: 5 } }] },
        { id: "early_024", title: "VEGGIE_DINNER", text: "Dinner is broccoli. You hate vegetables.", options: [{ t: "Eat them all", r: { intelligence: 35 }, e: { health: 10, happiness: -4 } }, { t: "Hide them in napkin", r: {}, e: { happiness: 4, health: -2 } }] },
        { id: "early_025", title: "IMAGINARY_FRIEND", text: "You create an imaginary friend named Mr. Whiskers. They're very real to you.", options: [{ t: "Play with them daily", r: {}, e: { intelligence: 5, happiness: 8 } }, { t: "Forget about them", r: {}, e: { happiness: -3 } }] },
        { id: "early_026", title: "BIRTHDAY_PARTY", text: "Your third birthday party! Lots of kids and presents.", options: [{ t: "Share toys with guests", r: {}, e: { happiness: 9, appearance: 6 } }, { t: "Keep best toys hidden", r: {}, e: { happiness: 6, appearance: -5 } }] },
        { id: "early_027", title: "THUNDERSTORM_FEAR", text: "A thunderstorm rages outside. The lightning is scary.", options: [{ t: "Hide under blanket", r: {}, e: { happiness: -4, health: -2 } }, { t: "Watch it with parent", r: { intelligence: 32 }, e: { intelligence: 4, happiness: 3 } }] },
        { id: "early_028", title: "DRESS_YOURSELF", text: "Your parent wants you to try dressing yourself.", options: [{ t: "Do it successfully", r: { intelligence: 40 }, e: { intelligence: 5, happiness: 8 } }, { t: "Need help", r: {}, e: { happiness: 2 } }] },
        { id: "early_029", title: "COOKIE_JAR", text: "You find the cookie jar on the counter. No adults are watching.", options: [{ t: "Ask permission first", r: { intelligence: 35 }, e: { intelligence: 4, happiness: 4 } }, { t: "Sneak a cookie", r: {}, e: { happiness: 7, health: -3 } }] },
        { id: "early_030", title: "HELP_PARENT", text: "Your parent is doing chores. You want to help.", options: [{ t: "Help enthusiastically", r: {}, e: { happiness: 7, intelligence: 3 } }, { t: "Make a mess instead", r: {}, e: { happiness: 5, appearance: -4 } }] },
        { id: "early_031", title: "PLAYGROUND_BULLY", text: "An older kid pushes you off the swing.", options: [{ t: "Tell a grown-up", r: { intelligence: 35 }, e: { intelligence: 3, happiness: 2 } }, { t: "Push back", r: {}, e: { appearance: -7, health: -5 } }] },
        { id: "early_032", title: "SHAPES_PUZZLE", text: "A shape-sorting toy challenges you. Circle, square, triangle.", options: [{ t: "Solve it correctly", r: { intelligence: 42 }, e: { intelligence: 7, happiness: 6 } }, { t: "Force wrong shapes", r: {}, e: { happiness: -3 } }] },
        { id: "early_033", title: "HIDE_AND_SEEK", text: "Playing hide and seek with family. You need a good hiding spot.", options: [{ t: "Find clever spot", r: { intelligence: 38 }, e: { intelligence: 4, happiness: 9 } }, { t: "Hide in obvious place", r: {}, e: { happiness: 5 } }] },
        { id: "early_034", title: "MEDICINE_TIME", text: "You're sick with a cold. The medicine tastes terrible.", options: [{ t: "Take it bravely", r: { health: 35 }, e: { health: 12, happiness: -3 } }, { t: "Refuse and cry", r: {}, e: { health: -5, happiness: -6 } }] },
        { id: "early_035", title: "CRAYON_WALL", text: "You found crayons. The wall looks like a perfect canvas.", options: [{ t: "Draw on paper instead", r: { intelligence: 40 }, e: { intelligence: 4, happiness: 5 } }, { t: "Draw on wall", r: {}, e: { happiness: 10, appearance: -10 } }] },
        { id: "early_036", title: "LIBRARY_VISIT", text: "Your first trip to the library. So many books!", options: [{ t: "Choose picture books", r: {}, e: { intelligence: 6, happiness: 7 } }, { t: "Run around instead", r: {}, e: { happiness: 6, appearance: -5 } }] },
        { id: "early_037", title: "LOST_PARENT", text: "You lose sight of your parent in the store. Panic sets in.", options: [{ t: "Stay calm, find employee", r: { intelligence: 45 }, e: { intelligence: 6, happiness: 3 } }, { t: "Cry loudly", r: {}, e: { happiness: -8, health: -3 } }] },
        { id: "early_038", title: "COLOR_LESSON", text: "Learning colors with flashcards. Red, blue, yellow, green.", options: [{ t: "Learn them all", r: { intelligence: 40 }, e: { intelligence: 6, happiness: 5 } }, { t: "Guess randomly", r: {}, e: { happiness: 3 } }] },
        { id: "early_039", title: "SWING_SET", text: "Learning to swing by yourself. It requires rhythm and balance.", options: [{ t: "Master it", r: { health: 40 }, e: { health: 5, happiness: 9 } }, { t: "Ask for pushes", r: {}, e: { happiness: 6 } }] },
        { id: "early_040", title: "SIBLING_ARRIVAL", text: "Your parents bring home a new baby. You're no longer the only child.", options: [{ t: "Welcome the baby", r: {}, e: { happiness: 5, appearance: 4 } }, { t: "Feel jealous", r: {}, e: { happiness: -6, appearance: -3 } }] },
        { id: "early_041", title: "BREAKFAST_MESS", text: "Trying to eat cereal by yourself. The spoon is tricky.", options: [{ t: "Eat carefully", r: { intelligence: 35 }, e: { intelligence: 3, happiness: 4 } }, { t: "Spill everywhere", r: {}, e: { happiness: 6, appearance: -5 } }] },
        { id: "early_042", title: "FAVORITE_TOY", text: "Your favorite stuffed animal is lost. You're devastated.", options: [{ t: "Search everywhere", r: {}, e: { intelligence: 4, happiness: 8 } }, { t: "Give up crying", r: {}, e: { happiness: -10, health: -3 } }] },
        { id: "early_043", title: "MUSIC_CLASS", text: "Preschool music class. You're given a tambourine.", options: [{ t: "Play in rhythm", r: { intelligence: 38 }, e: { intelligence: 5, happiness: 7 } }, { t: "Bang it randomly", r: {}, e: { happiness: 8, appearance: -3 } }] },
        { id: "early_044", title: "STRANGER_DANGER", text: "A stranger offers you candy at the park. Your parent taught you about this.", options: [{ t: "Refuse and find parent", r: { intelligence: 42 }, e: { intelligence: 7, health: 8 } }, { t: "Accept the candy", r: {}, e: { happiness: 5, health: -12 } }] },
        { id: "early_045", title: "BATH_TIME", text: "Bath time with rubber ducks and bubbles.", options: [{ t: "Play nicely", r: {}, e: { happiness: 7, health: 3 } }, { t: "Splash everywhere", r: {}, e: { happiness: 10, appearance: -4 } }] },
        { id: "early_046", title: "SORRY_LESSON", text: "You broke another kid's toy. Your parent asks you to apologize.", options: [{ t: "Say sorry sincerely", r: { intelligence: 40 }, e: { intelligence: 4, happiness: 4, appearance: 6 } }, { t: "Refuse to apologize", r: {}, e: { happiness: -4, appearance: -8 } }] },
        { id: "early_047", title: "GROWTH_CHART", text: "Your parent measures your height on the wall chart. You've grown!", options: [{ t: "Feel proud", r: {}, e: { happiness: 8, health: 4 } }, { t: "Want to be taller", r: {}, e: { happiness: 2 } }] },
        { id: "early_048", title: "TIMEOUT_CHAIR", text: "You're in timeout for misbehaving. Five minutes feels like forever.", options: [{ t: "Sit quietly and think", r: { intelligence: 38 }, e: { intelligence: 5, happiness: -2 } }, { t: "Complain the whole time", r: {}, e: { happiness: -7, appearance: -4 } }] },
        { id: "early_049", title: "PLAYGROUND_FRIEND", text: "You meet a kid who likes the same toys as you. Instant connection!", options: [{ t: "Become best friends", r: { appearance: 35 }, e: { happiness: 12, appearance: 7 } }, { t: "Play alone instead", r: {}, e: { happiness: 3 } }] },
        { id: "early_050", r: { age: 5 }, title: "KINDERGARTEN_READY", text: "You're turning 5. Kindergarten starts soon. A new chapter begins.", options: [{ t: "Feel excited", r: { intelligence: 40 }, e: { intelligence: 6, happiness: 10 } }, { t: "Feel nervous", r: {}, e: { happiness: -3, intelligence: 2 } }] }
    ],
    learning: [
        { id: "learning_001", title: "FIRST_DAY_SCHOOL", text: "First day of elementary school. New backpack, new classroom, new everything.", options: [{ t: "Introduce yourself confidently", r: { appearance: 40 }, e: { happiness: 10, appearance: 5 } }, { t: "Sit quietly in back", r: {}, e: { happiness: -3, intelligence: 3 } }] },
        { id: "learning_002", r: { age: 13 }, title: "ALGEBRA_TEST", text: "Your first algebra test. The equations look like alien language.", options: [{ t: "Study hard and ace it", r: { intelligence: 60 }, e: { intelligence: 8, happiness: 7 } }, { t: "Wing it", r: {}, e: { happiness: -5, intelligence: -3 } }] },
        { id: "learning_003", title: "LUNCH_MONEY", text: "You forgot lunch money. Your stomach growls during class.", options: [{ t: "Ask friend to share", r: { appearance: 45 }, e: { happiness: 5, appearance: 3 } }, { t: "Go hungry", r: {}, e: { health: -8, happiness: -6 } }] },
        { id: "learning_004", title: "SCHOOL_BULLY", text: "A bully demands your allowance. Other kids are watching.", options: [{ t: "Stand up to them", r: { health: 55 }, e: { appearance: 8, health: -5, happiness: 6 } }, { t: "Give them money", r: { money: 20 }, e: { money: -10, happiness: -8, appearance: -6 } }, { t: "Report to teacher", r: { intelligence: 50 }, e: { intelligence: 4, happiness: 3, appearance: -4 } }] },
        { id: "learning_005", title: "SCIENCE_FAIR", text: "The science fair is coming. Time to build a volcano or something impressive.", options: [{ t: "Create amazing project", r: { intelligence: 65, money: 30 }, e: { intelligence: 10, happiness: 9, money: -15 } }, { t: "Do basic project", r: {}, e: { intelligence: 4, happiness: 2 } }] },
        { id: "learning_006", title: "SOCCER_TRYOUTS", text: "Soccer team tryouts. The coach is evaluating everyone.", options: [{ t: "Give it your all", r: { health: 60 }, e: { health: 7, appearance: 8, happiness: 9 } }, { t: "Play casually", r: {}, e: { happiness: 3 } }] },
        { id: "learning_007", r: { age: 10 }, title: "FIRST_CRUSH", text: "You have a crush on someone in your class. Your heart races when they're near.", options: [{ t: "Pass a note", r: { appearance: 50 }, e: { happiness: 10, appearance: 5 } }, { t: "Admire from afar", r: {}, e: { happiness: -4, intelligence: 2 } }] },
        { id: "learning_008", title: "HOMEWORK_OVERLOAD", text: "Three assignments due tomorrow. You procrastinated all week.", options: [{ t: "Pull an all-nighter", r: { intelligence: 55 }, e: { intelligence: 6, health: -10, happiness: -4 } }, { t: "Do your best, accept late penalty", r: {}, e: { happiness: -6, intelligence: 2 } }] },
        { id: "learning_009", title: "BIRTHDAY_PARTY_INVITE", text: "The popular kid is throwing a birthday party. You got an invite!", options: [{ t: "Attend with nice gift", r: { money: 40, appearance: 45 }, e: { happiness: 12, appearance: 9, money: -20 } }, { t: "Skip it", r: {}, e: { happiness: -5, appearance: -6 } }] },
        { id: "learning_010", title: "CLASS_PRESENTATION", text: "You have to present in front of the whole class. Public speaking terrifies you.", options: [{ t: "Present confidently", r: { intelligence: 60, appearance: 50 }, e: { intelligence: 7, appearance: 8, happiness: 8 } }, { t: "Stammer through it", r: {}, e: { happiness: -7, appearance: -5 } }] },
        { id: "learning_011", title: "DETENTION_SLIP", text: "You got detention for talking in class. Your parents will be disappointed.", options: [{ t: "Serve it quietly", r: {}, e: { intelligence: 3, happiness: -5 } }, { t: "Skip detention", r: {}, e: { happiness: 4, appearance: -8, intelligence: -4 } }] },
        { id: "learning_012", r: { age: 13 }, title: "SCHOOL_DANCE", text: "The school dance is this Friday. Everyone's talking about it.", options: [{ t: "Ask crush to dance", r: { appearance: 55 }, e: { happiness: 15, appearance: 10 } }, { t: "Dance with friends", r: {}, e: { happiness: 8, appearance: 4 } }, { t: "Stay home", r: {}, e: { happiness: -6, appearance: -7 } }] },
        { id: "learning_013", title: "REPORT_CARD", text: "Report card day. You open the envelope nervously.", options: [{ t: "Straight A's", r: { intelligence: 70 }, e: { intelligence: 10, happiness: 12, money: 30 } }, { t: "Mixed grades", r: { intelligence: 50 }, e: { happiness: 2, intelligence: 3 } }, { t: "Failing marks", r: {}, e: { happiness: -10, intelligence: -5 } }] },
        { id: "learning_014", title: "NEW_SNEAKERS", text: "Everyone has the new expensive sneakers. You want them too.", options: [{ t: "Beg parents to buy", r: { money: 60, appearance: 40 }, e: { appearance: 10, happiness: 10, money: -40 } }, { t: "Wear old shoes proudly", r: {}, e: { intelligence: 5, appearance: -5, happiness: -3 } }] },
        { id: "learning_015", title: "CHEATING_TEMPTATION", text: "You can see your smart neighbor's test answers. The teacher isn't looking.", options: [{ t: "Copy answers", r: {}, e: { intelligence: -8, happiness: 6 }, setFlag: 'cheater_flag' }, { t: "Do your own work", r: { intelligence: 55 }, e: { intelligence: 7, happiness: 5 } }] },
        { id: "learning_016", title: "YEARBOOK_PHOTO", text: "Yearbook photo day. You woke up with a huge pimple.", options: [{ t: "Smile confidently anyway", r: { appearance: 45 }, e: { happiness: 6, appearance: 4 } }, { t: "Skip photo day", r: {}, e: { happiness: -5, appearance: -6 } }] },
        { id: "learning_017", title: "BAND_PRACTICE", text: "You joined school band. The instrument is harder than expected.", options: [{ t: "Practice daily", r: { intelligence: 58 }, e: { intelligence: 8, happiness: 7, appearance: 5 } }, { t: "Quit after two weeks", r: {}, e: { happiness: -4, appearance: -6 } }] },
        { id: "learning_018", title: "CAFETERIA_CHOICE", text: "Lunchtime. Do you sit with the popular kids or your old friends?", options: [{ t: "Sit with popular group", r: { appearance: 60 }, e: { appearance: 10, happiness: 5 } }, { t: "Stay loyal to old friends", r: {}, e: { happiness: 8, appearance: -3 } }] },
        { id: "learning_019", r: { age: 16 }, title: "DRIVER_ED", text: "Driver's education class. Getting your license means freedom!", options: [{ t: "Study hard, pass first try", r: { intelligence: 62, money: 50 }, e: { intelligence: 7, happiness: 15, money: -35 } }, { t: "Fail the test", r: {}, e: { happiness: -10, appearance: -5 } }] },
        { id: "learning_020", r: { age: 17 }, title: "PROM_NIGHT", text: "Senior prom is approaching. This is supposed to be magical.", options: [{ t: "Go with date in style", r: { appearance: 65, money: 70 }, e: { happiness: 20, appearance: 12, money: -60 } }, { t: "Go with friend group", r: { appearance: 45 }, e: { happiness: 10, appearance: 5 } }, { t: "Skip prom", r: {}, e: { happiness: -8, appearance: -10 } }] },
        { id: "learning_021", r: { age: 17 }, title: "COLLEGE_APPLICATION", text: "College application deadlines loom. Your future depends on this.", options: [{ t: "Apply to top schools", r: { intelligence: 75, money: 60 }, e: { intelligence: 10, happiness: 8, money: -50 } }, { t: "Apply to state school", r: { intelligence: 60 }, e: { intelligence: 6, happiness: 5, money: -20 } }, { t: "Skip college", r: {}, e: { money: 20, happiness: -5, intelligence: -3 } }] },
        { id: "learning_022", r: { age: 14 }, title: "PEER_PRESSURE", text: "Friends offer you alcohol at a party. Everyone's doing it.", options: [{ t: "Refuse firmly", r: { intelligence: 65 }, e: { intelligence: 8, health: 8, appearance: -5 } }, { t: "Give in to fit in", r: {}, e: { appearance: 6, health: -12, happiness: 4 } }] },
        { id: "learning_023", title: "SUMMER_JOB", text: "Summer break. You could work or relax all summer.", options: [{ t: "Get a job", r: { intelligence: 55 }, e: { money: 40, intelligence: 5, happiness: -3 } }, { t: "Enjoy vacation", r: {}, e: { happiness: 12, health: 8 } }] },
        { id: "learning_024", title: "SPORTS_INJURY", text: "You injured yourself during practice. The season might be over.", options: [{ t: "Rest and recover properly", r: { money: 40 }, e: { health: 10, happiness: -5, money: -25 } }, { t: "Play through pain", r: { health: 55 }, e: { health: -15, appearance: 5, happiness: 3 } }] },
        { id: "learning_025", title: "CYBERBULLY_MSG", text: "Someone posted mean things about you online. It's spreading.", options: [{ t: "Report and block them", r: { intelligence: 60 }, e: { intelligence: 6, happiness: 2, appearance: -3 } }, { t: "Respond angrily", r: {}, e: { happiness: -10, appearance: -12 } }, { t: "Ignore it", r: { intelligence: 55 }, e: { happiness: -5, intelligence: 4 } }] },
        { id: "learning_026", title: "TALENT_SHOW", text: "School talent show auditions. You have a hidden talent.", options: [{ t: "Perform and wow crowd", r: { appearance: 60, intelligence: 55 }, e: { appearance: 15, happiness: 15, intelligence: 5 } }, { t: "Chicken out", r: {}, e: { happiness: -7, appearance: -4 } }] },
        { id: "learning_027", title: "BROKEN_PHONE", text: "You dropped your phone. The screen is shattered.", options: [{ t: "Pay for repair", r: { money: 80 }, e: { happiness: 5, money: -60 } }, { t: "Use broken phone", r: {}, e: { happiness: -8, appearance: -6 } }] },
        { id: "learning_028", title: "FIELD_TRIP", text: "Class field trip to the museum. Educational but optional.", options: [{ t: "Go and learn", r: { money: 30 }, e: { intelligence: 9, happiness: 7, money: -20 } }, { t: "Skip for free day", r: {}, e: { happiness: 5 } }] },
        { id: "learning_029", title: "BREAKUP_PROTOCOL", text: "Your first relationship just ended. Your heart is broken.", options: [{ t: "Process emotions healthily", r: { intelligence: 60 }, e: { happiness: -10, intelligence: 7, health: -5 } }, { t: "Isolate yourself", r: {}, e: { happiness: -15, health: -8, appearance: -6 } }] },
        { id: "learning_030", title: "VOLUNTEER_WORK", text: "Community service hours are required for graduation.", options: [{ t: "Volunteer enthusiastically", r: {}, e: { happiness: 12, intelligence: 6, appearance: 7 } }, { t: "Do bare minimum", r: {}, e: { intelligence: 2, happiness: -3 } }] },
        { id: "learning_031", r: { age: 16 }, title: "STANDARDIZED_TEST", text: "SAT/ACT test day. Your college prospects depend on this score.", options: [{ t: "Prepared and confident", r: { intelligence: 72 }, e: { intelligence: 12, happiness: 10 } }, { t: "Anxious and unprepared", r: {}, e: { happiness: -12, intelligence: -4 } }] },
        { id: "learning_032", title: "FRIEND_BETRAYAL", text: "Your best friend spread your secret. Everyone knows now.", options: [{ t: "Confront them maturely", r: { intelligence: 63 }, e: { intelligence: 7, happiness: -5, appearance: 4 } }, { t: "End the friendship", r: {}, e: { happiness: -10, appearance: -5 } }] },
        { id: "learning_033", r: { age: 15 }, title: "PART_TIME_JOB", text: "You got a part-time job at a local store. Balancing school and work is tough.", options: [{ t: "Manage both well", r: { intelligence: 65, health: 60 }, e: { money: 50, intelligence: 6, health: -8 } }, { t: "Quit after one week", r: {}, e: { happiness: -5, appearance: -4 } }] },
        { id: "learning_034", title: "DRESS_CODE_VIOLATION", text: "Your outfit violates the school dress code. The principal is calling you out.", options: [{ t: "Change immediately", r: {}, e: { happiness: -4, appearance: -3 } }, { t: "Argue your rights", r: { intelligence: 62 }, e: { intelligence: 5, appearance: -8, happiness: 2 } }] },
        { id: "learning_035", r: { age: 17 }, title: "GRADUATION_DAY", text: "High school graduation. You made it! The future awaits.", options: [{ t: "Graduate with honors", r: { intelligence: 75 }, e: { intelligence: 12, happiness: 20, money: 40 } }, { t: "Graduate normally", r: { intelligence: 60 }, e: { happiness: 12, intelligence: 5 } }, { t: "Barely pass", r: {}, e: { happiness: 3, intelligence: -3 } }] },
        { id: "learning_036", r: { age: 12 }, title: "SOCIAL_MEDIA_DRAMA", text: "Your post went viral for the wrong reasons. People are commenting.", options: [{ t: "Delete and apologize", r: { intelligence: 60 }, e: { intelligence: 5, appearance: -5, happiness: -4 } }, { t: "Double down", r: {}, e: { appearance: -15, happiness: -8 } }] },
        { id: "learning_037", title: "PARENT_TEACHER_CONF", text: "Parent-teacher conference. The teacher has concerns about your grades.", options: [{ t: "Promise to improve", r: { intelligence: 58 }, e: { intelligence: 6, happiness: -3 } }, { t: "Make excuses", r: {}, e: { intelligence: -5, happiness: -6 } }] },
        { id: "learning_038", r: { age: 16 }, title: "FIRST_CAR", text: "You saved enough money for your first car! It's old but it's yours.", options: [{ t: "Buy reliable used car", r: { money: 100 }, e: { happiness: 18, money: -80, appearance: 8 } }, { t: "Keep saving", r: {}, e: { money: 20, happiness: -5 } }] },
        { id: "learning_039", title: "POETRY_CONTEST", text: "English class poetry contest. You wrote something personal.", options: [{ t: "Submit your poem", r: { intelligence: 68 }, e: { intelligence: 9, happiness: 10, appearance: 6 } }, { t: "Keep it private", r: {}, e: { happiness: 2, intelligence: 3 } }] },
        { id: "learning_040", title: "FRIEND_MOVING_AWAY", text: "Your childhood best friend is moving to another state.", options: [{ t: "Promise to stay in touch", r: {}, e: { happiness: -8, intelligence: 4, appearance: 3 } }, { t: "Let them go", r: {}, e: { happiness: -12, appearance: -4 } }] },
        { id: "learning_041", title: "CLUB_PRESIDENT", text: "You're running for club president. Election speeches are tomorrow.", options: [{ t: "Campaign seriously", r: { intelligence: 65, appearance: 60 }, e: { appearance: 12, intelligence: 7, happiness: 10 } }, { t: "Don't try hard", r: {}, e: { happiness: -4, appearance: -6 } }] },
        { id: "learning_042", title: "TUTOR_NEEDED", text: "You're failing math. Your parents suggest getting a tutor.", options: [{ t: "Accept the help", r: { money: 50 }, e: { intelligence: 10, money: -40, happiness: -2 } }, { t: "Refuse, study alone", r: { intelligence: 50 }, e: { intelligence: 3, happiness: -5 } }] },
        { id: "learning_043", title: "SPRING_BREAK", text: "Spring break! Friends are planning a trip. It costs money you don't have.", options: [{ t: "Work extra to afford it", r: { money: 80 }, e: { happiness: 15, money: -70, health: -5 } }, { t: "Stay home", r: {}, e: { happiness: -10, appearance: -8 } }] },
        { id: "learning_044", r: { age: 17 }, title: "SCHOLARSHIP_CHANCE", text: "You're eligible for a scholarship. The essay must be perfect.", options: [{ t: "Write amazing essay", r: { intelligence: 78 }, e: { intelligence: 10, money: 100, happiness: 15 } }, { t: "Write decent essay", r: { intelligence: 65 }, e: { intelligence: 5, happiness: 4 } }, { t: "Don't apply", r: {}, e: { happiness: -6 } }] },
        { id: "learning_045", title: "LOCKER_VANDALIZED", text: "Someone spray-painted insults on your locker. You feel targeted.", options: [{ t: "Report to administration", r: { intelligence: 60 }, e: { intelligence: 5, happiness: -3, appearance: -4 } }, { t: "Clean it yourself", r: {}, e: { happiness: -8, health: -4 } }] },
        { id: "learning_046", title: "WEEKEND_PARTY", text: "Big party this weekend. Your parents said no, but everyone's going.", options: [{ t: "Sneak out", r: { appearance: 50 }, e: { appearance: 8, happiness: 10, intelligence: -5 } }, { t: "Obey parents", r: { intelligence: 60 }, e: { intelligence: 6, happiness: -6, appearance: -7 } }] },
        { id: "learning_047", title: "DETENTION_FRIENDS", text: "Your friends got detention. You can get in trouble to join them or stay out of it.", options: [{ t: "Stay out of trouble", r: { intelligence: 63 }, e: { intelligence: 7, happiness: -4, appearance: -5 } }, { t: "Get detention too", r: {}, e: { appearance: 6, intelligence: -6, happiness: 4 } }] },
        { id: "learning_048", title: "GYM_CLASS_DODGE", text: "Gym class dodgeball. You're always picked last.", options: [{ t: "Play your hardest", r: { health: 55 }, e: { health: 8, appearance: 7, happiness: 8 } }, { t: "Fake an injury", r: {}, e: { happiness: -5, appearance: -8, health: -3 } }] },
        { id: "learning_049", r: { age: 17 }, title: "COLLEGE_ACCEPTANCE", text: "College acceptance letters arrive. You open the envelope with shaking hands.", options: [{ t: "Accepted to dream school", r: { intelligence: 80, money: 70 }, e: { intelligence: 15, happiness: 25, money: -50 } }, { t: "Accepted to backup school", r: { intelligence: 65 }, e: { intelligence: 8, happiness: 8, money: -30 } }, { t: "Rejected everywhere", r: {}, e: { happiness: -20, intelligence: -8 } }] },
        { id: "learning_050", r: { age: 18 }, title: "SENIOR_YEAR_END", text: "Senior year ends. Childhood is officially over. You sign yearbooks and say goodbye.", options: [{ t: "Embrace the future", r: { intelligence: 70 }, e: { happiness: 15, intelligence: 10, appearance: 8 } }, { t: "Fear the unknown", r: {}, e: { happiness: -8, intelligence: 3 } }] }
    ],
    prime: [
        { id: "prime_001", title: "JOB_INTERVIEW", text: "Your first real job interview. The interviewer asks about your 5-year plan.", options: [{ t: "Answer confidently", r: { intelligence: 75, appearance: 65 }, e: { money: 80, happiness: 15, intelligence: 8 } }, { t: "Stumble through answers", r: {}, e: { happiness: -10, money: -20 } }] },
        { id: "prime_002", title: "FIRST_PAYCHECK", text: "Your first paycheck arrives. After taxes, it's less than you expected.", options: [{ t: "Save 50%", r: { intelligence: 70 }, e: { money: 100, intelligence: 8, happiness: 5 } }, { t: "Celebrate with friends", r: {}, e: { money: 20, happiness: 15, appearance: 5 } }, { t: "Treat yourself big", r: {}, e: { money: -30, happiness: 20, appearance: 10 } }] },
        { id: "prime_003", title: "APARTMENT_HUNT", text: "Time to move out. Apartments are shockingly expensive.", options: [{ t: "Nice place, broke budget", r: { money: 120 }, e: { money: -150, happiness: 15, appearance: 8 } }, { t: "Cheap place, questionable area", r: {}, e: { money: -50, happiness: -10, health: -5 } }, { t: "Stay with parents", r: {}, e: { money: 50, happiness: -15, appearance: -12 } }] },
        { id: "prime_004", title: "DATING_APP", text: "You create a dating app profile. The matches start coming in.", options: [{ t: "Be selective", r: { appearance: 70, intelligence: 65 }, e: { happiness: 12, appearance: 8 } }, { t: "Swipe on everyone", r: {}, e: { happiness: 5, appearance: -5 } }, { t: "Delete the app", r: {}, e: { happiness: -8, intelligence: 5 } }] },
        { id: "prime_005", title: "PROMOTION_OFFER", text: "Your boss offers a promotion. More responsibility, better pay.", options: [{ t: "Accept immediately", r: { intelligence: 72 }, e: { money: 120, happiness: 20, intelligence: 12, health: -8 } }, { t: "Negotiate for more", r: { intelligence: 80, appearance: 65 }, e: { money: 180, happiness: 25, intelligence: 15 } }, { t: "Decline, too stressful", r: {}, e: { happiness: -15, money: -30, intelligence: -5 } }] },
        { id: "prime_006", title: "STUDENT_LOANS", text: "Student loan payments begin. The number is terrifying.", options: [{ t: "Pay aggressively", r: { money: 140, intelligence: 75 }, e: { money: -200, happiness: -15, intelligence: 10 } }, { t: "Minimum payments only", r: {}, e: { money: -80, happiness: -8 } }, { t: "Consider default", r: {}, e: { money: 20, happiness: -25, intelligence: -15 } }] },
        { id: "prime_007", title: "MARRIAGE_PROPOSAL", text: "Your partner proposes. This is it. Forever.", options: [{ t: "Say yes with joy", r: { appearance: 70, happiness: 75 }, e: { happiness: 30, appearance: 12, money: -100 } }, { t: "Say yes with doubts", r: {}, e: { happiness: 10, appearance: 5, money: -80 } }, { t: "Say no, not ready", r: { intelligence: 75 }, e: { happiness: -20, appearance: -10 } }], r: { isSingle: false, isMarried: false } },
        // Note: Logic V6 - "Partner proposes" implies we HAVE a partner but NOT married. Added r check above or better logic in engine?
        // Current engine 'isSingle' means NO partner. 'isMarried' means YES spouse && married. 
        // So for proposal we need: Has Partner AND !Married. 
        // Let's rely on event text "Your partner proposes" -> implies we have one. 
        // Actually, `addSpouse` logic in `integration.js` handles creating one if none exists? 
        // The events system is simple. If we demand `isSingle: true`, it means NO partner.
        // If we demand `isMarried: false`, it means not married.
        // Let's simplify: Proposal is usually for finding a spouse or upgrading partner? 
        // Standard game flow: "Wedding Bells" (Priority) handles marriage usually. 
        // Let's assume prime_007 is for "getting engaged".
        // Requirement: `isMarried: false`.
        { id: "prime_008", r: { isSingle: true }, title: "WEDDING_PLANNING", text: "Wedding planning is a nightmare. Everyone has opinions.", options: [{ t: "Big expensive wedding", r: { money: 200, appearance: 75 }, e: { money: -300, happiness: 20, appearance: 15 } }, { t: "Small intimate ceremony", r: {}, e: { money: -80, happiness: 25, appearance: 8 } }, { t: "Elope instead", r: { intelligence: 70 }, e: { money: -20, happiness: 15, intelligence: 8 } }] },
        { id: "prime_009", title: "HONEYMOON", text: "Honeymoon time. Where should you go?", options: [{ t: "Exotic luxury resort", r: { money: 180 }, e: { money: -250, happiness: 30, health: 10, appearance: 12 } }, { t: "Road trip adventure", r: {}, e: { money: -60, happiness: 20, health: 5 } }, { t: "Staycation to save money", r: { intelligence: 75 }, e: { money: 30, happiness: 8 } }] },
        { id: "prime_010", title: "PREGNANCY_TEST", text: "The pregnancy test shows two lines. You're going to be a parent.", options: [{ t: "Overjoyed and ready", r: { money: 150, happiness: 70 }, e: { happiness: 35, health: -5, money: -100 } }, { t: "Terrified but willing", r: {}, e: { happiness: 10, health: -8, intelligence: 5 } }, { t: "Not ready for this", r: {}, e: { happiness: -20, health: -10 } }] },
        { id: "prime_011", title: "MORTGAGE_APPLICATION", text: "Applying for a mortgage. The banker judges your entire life.", options: [{ t: "Buy dream house", r: { money: 300, intelligence: 78 }, e: { money: -500, happiness: 25, intelligence: 10 } }, { t: "Buy starter home", r: { money: 180 }, e: { money: -280, happiness: 15, intelligence: 5 } }, { t: "Keep renting", r: {}, e: { money: -50, happiness: -10 } }] },
        { id: "prime_012", title: "BABY_ARRIVES", text: "Your baby is born. Tiny fingers grip yours. You haven't slept in days.", options: [{ t: "Hire full-time help", r: { money: 250 }, e: { money: -200, happiness: 20, health: 8 } }, { t: "Do it yourselves", r: {}, e: { happiness: 15, health: -15, money: 50 } }, { t: "Move near family", r: { intelligence: 72 }, e: { happiness: 18, health: 5, money: -80 } }] },
        { id: "prime_013", title: "CAREER_CROSSROADS", text: "A recruiter offers you a job at a competitor. Double the salary.", options: [{ t: "Take the new job", r: { intelligence: 75, appearance: 70 }, e: { money: 250, happiness: 22, intelligence: 12 } }, { t: "Stay loyal to company", r: {}, e: { happiness: -12, money: -80, intelligence: 5 } }, { t: "Use it to negotiate", r: { intelligence: 82 }, e: { money: 180, happiness: 25, intelligence: 15 } }] },
        { id: "prime_014", title: "PARENT_ILLNESS", text: "Your parent is diagnosed with a serious illness. They need care.", options: [{ t: "Move them in with you", r: { money: 140 }, e: { happiness: -10, money: -120, health: -12 } }, { t: "Hire professional care", r: { money: 280 }, e: { money: -250, happiness: 5 } }, { t: "Let siblings handle it", r: {}, e: { happiness: -25, intelligence: -10 } }] },
        { id: "prime_015", title: "WORK_BURNOUT", text: "You're burnt out. Every day feels like torture.", options: [{ t: "Take unpaid sabbatical", r: { money: 200, intelligence: 78 }, e: { happiness: 30, health: 20, money: -180 } }, { t: "Switch careers entirely", r: { intelligence: 80 }, e: { happiness: 20, money: -100, intelligence: 15 } }, { t: "Push through it", r: {}, e: { happiness: -20, health: -18, money: 80 } }] },
        { id: "prime_016", title: "INVESTMENT_OPPORTUNITY", text: "A friend pitches you an investment opportunity. Could be big.", options: [{ t: "Invest heavily", r: { money: 300, intelligence: 75 }, e: { money: 400, happiness: 25, intelligence: 12 } }, { t: "Small safe investment", r: { money: 120 }, e: { money: 80, happiness: 8 } }, { t: "Decline, too risky", r: { intelligence: 70 }, e: { happiness: -5, intelligence: 8 } }] },
        { id: "prime_017", r: { isMarried: true }, title: "MARITAL_PROBLEMS", text: "Your marriage is struggling. Communication has broken down.", options: [{ t: "Couples therapy", r: { money: 150, intelligence: 75 }, e: { happiness: 15, money: -120, intelligence: 10 } }, { t: "Trial separation", r: {}, e: { happiness: -15, health: -10, money: -100 } }, { t: "Ignore the problems", r: {}, e: { happiness: -25, health: -15 } }] },
        { id: "prime_018", title: "STARTUP_IDEA", text: "You have an idea for a startup. Your friends say it could work.", options: [{ t: "Quit job, go all in", r: { intelligence: 82, money: 250 }, e: { money: -300, happiness: 30, intelligence: 20 } }, { t: "Work on it part-time", r: { intelligence: 75 }, e: { happiness: 10, health: -12, intelligence: 12 } }, { t: "Just keep daydreaming", r: {}, e: { happiness: -10, intelligence: -5 } }] },
        { id: "prime_019", title: "SECOND_CHILD", text: "Baby number two is on the way. Can you handle this?", options: [{ t: "Embrace the chaos", r: { money: 220, health: 70 }, e: { happiness: 20, health: -10, money: -150 } }, { t: "Panic and prepare", r: {}, e: { happiness: -8, health: -8, money: -120 } }, { t: "Question your choices", r: {}, e: { happiness: -15, health: -12 } }] },
        { id: "prime_020", title: "EXECUTIVE_PROMOTION", text: "You're offered an executive position. Corner office. Big decisions.", options: [{ t: "Accept with confidence", r: { intelligence: 85, appearance: 75 }, e: { money: 300, happiness: 28, intelligence: 18, health: -15 } }, { t: "Accept with imposter syndrome", r: { intelligence: 78 }, e: { money: 250, happiness: 12, intelligence: 10, health: -12 } }, { t: "Decline, too much pressure", r: {}, e: { happiness: -18, money: -120 } }] },
        { id: "prime_021", title: "AFFAIR_TEMPTATION", text: "A coworker flirts with you. The attraction is undeniable.", options: [{ t: "Stay faithful", r: { intelligence: 80 }, e: { happiness: 10, intelligence: 15, appearance: 8 } }, { t: "Emotional affair", r: {}, e: { happiness: 15, intelligence: -12, appearance: 10 } }, { t: "Cross the line", r: { appearance: 75 }, e: { happiness: 20, intelligence: -20, appearance: 12 } }] },
        { id: "prime_022", title: "LAYOFF_NOTICE", text: "Your company is downsizing. Your name is on the list.", options: [{ t: "Negotiate severance", r: { intelligence: 80, appearance: 70 }, e: { money: 150, happiness: -15, intelligence: 12 } }, { t: "Find new job fast", r: { intelligence: 75 }, e: { money: 100, happiness: -10, intelligence: 10 } }, { t: "Sue for wrongful termination", r: { intelligence: 85 }, e: { money: 80, happiness: -25, intelligence: 8 } }] },
        { id: "prime_023", r: { age: 40 }, title: "MIDLIFE_CRISIS", text: "You're having a midlife crisis. Sports car? Affair? What's the clichÃ©?", options: [{ t: "Buy expensive car", r: { money: 280 }, e: { money: -350, happiness: 25, appearance: 15 } }, { t: "Get drastically fit", r: { health: 65 }, e: { health: 25, happiness: 20, appearance: 20 } }, { t: "Accept your age gracefully", r: { intelligence: 85 }, e: { happiness: 18, intelligence: 15, health: 8 } }] },
        { id: "prime_024", title: "PARENT_DEATH", text: "Your parent passes away. The funeral is tomorrow.", options: [{ t: "Grieve openly", r: {}, e: { happiness: -25, health: -10, intelligence: 8 } }, { t: "Stay strong for family", r: { intelligence: 78 }, e: { happiness: -15, health: -8, intelligence: 12 } }, { t: "Shut down emotionally", r: {}, e: { happiness: -30, health: -15, intelligence: -10 } }] },
        { id: "prime_025", title: "COLLEGE_FUND", text: "Your kids will need college money. Time to start saving seriously.", options: [{ t: "Max out savings plans", r: { money: 320, intelligence: 80 }, e: { money: -400, happiness: 15, intelligence: 12 } }, { t: "Save what you can", r: { money: 180 }, e: { money: -200, happiness: 8 } }, { t: "They can get loans", r: {}, e: { happiness: -12, intelligence: -8 } }] },
        { id: "prime_026", r: { isMarried: true, divorceCooldown: 2 }, title: "DIVORCE_PAPERS", text: "Your spouse wants a divorce. The papers arrive via courier.", options: [{ t: "Fight for everything", r: { money: 250, intelligence: 80 }, e: { money: -200, happiness: -30, health: -15 } }, { t: "Split fairly", r: { intelligence: 75 }, e: { money: -150, happiness: -20, intelligence: 10 } }, { t: "Give up, move on", r: {}, e: { money: -100, happiness: -25, health: -10 } }] },
        { id: "prime_027", title: "STARTUP_EXIT", text: "Your startup is acquired. You're suddenly wealthy.", options: [{ t: "Retire early", r: { money: 500, intelligence: 82 }, e: { money: 800, happiness: 35, health: 15 } }, { t: "Start another company", r: { intelligence: 85 }, e: { money: 400, happiness: 30, intelligence: 20 } }, { t: "Invest and relax", r: { intelligence: 78 }, e: { money: 600, happiness: 28, health: 10 } }] },
        { id: "prime_028", title: "HEALTH_SCARE", text: "Your doctor finds something concerning. More tests are needed.", options: [{ t: "Get comprehensive care", r: { money: 280 }, e: { health: 15, money: -250, happiness: -10 } }, { t: "Basic treatment only", r: { money: 140 }, e: { health: 8, money: -120, happiness: -15 } }, { t: "Ignore medical advice", r: {}, e: { health: -20, happiness: -25 } }] },
        { id: "prime_029", title: "DREAM_VACATION", text: "You can finally afford that dream vacation. Where to?", options: [{ t: "Luxury world tour", r: { money: 400 }, e: { money: -500, happiness: 35, health: 12, appearance: 15 } }, { t: "Nice beach resort", r: { money: 220 }, e: { money: -280, happiness: 25, health: 10 } }, { t: "Save money instead", r: { intelligence: 80 }, e: { money: 100, happiness: -10 } }] },
        { id: "prime_030", title: "ELDERLY_PARENT_CARE", text: "Your parent can't live alone anymore. Dementia is progressing.", options: [{ t: "Move them in", r: { money: 180 }, e: { happiness: -15, money: -150, health: -18 } }, { t: "Premium care facility", r: { money: 380 }, e: { money: -450, happiness: -8 } }, { t: "Basic nursing home", r: { money: 200 }, e: { money: -220, happiness: -20 } }, { t: "Cannot afford care", e: { happiness: -40, karma: -20 }, result: "You could not afford private care. They went to a state facility. It breaks your heart." }] },
        { id: "prime_031", r: { age: 35 }, title: "TEENAGE_REBELLION", text: "Your teenager is out of control. Drugs, sneaking out, failing school.", options: [{ t: "Strict discipline", r: { intelligence: 78 }, e: { happiness: -12, intelligence: 10, health: -8 } }, { t: "Therapy and support", r: { money: 200, intelligence: 80 }, e: { money: -180, happiness: -8, intelligence: 12 } }, { t: "Give them space", r: {}, e: { happiness: -20, intelligence: -10 } }] },
        { id: "prime_032", title: "COMPANY_FOUNDER", text: "Your company goes public. You're now worth millions on paper.", options: [{ t: "Cash out everything", r: { intelligence: 82 }, e: { money: 900, happiness: 32, intelligence: 15 } }, { t: "Hold and grow wealth", r: { intelligence: 85 }, e: { money: 600, happiness: 28, intelligence: 18 } }, { t: "Reinvest in business", r: { intelligence: 88 }, e: { money: 400, happiness: 30, intelligence: 22 } }] },
        { id: "prime_033", r: { isMarried: true }, title: "MARRIAGE_COUNSELING", text: "Last attempt to save the marriage. The therapist asks hard questions.", options: [{ t: "Be brutally honest", r: { intelligence: 80 }, e: { happiness: 15, intelligence: 12, health: -5 } }, { t: "Sugarcoat everything", r: {}, e: { happiness: -10, intelligence: -8 } }, { t: "Walk out mid-session", r: {}, e: { happiness: -25, health: -12 } }] },
        { id: "prime_034", r: { age: 45 }, title: "EMPTY_NEST", text: "Your last child moves out. The house is suddenly quiet.", options: [{ t: "Embrace new freedom", r: { intelligence: 78 }, e: { happiness: 20, health: 10, intelligence: 10 } }, { t: "Feel lost and empty", r: {}, e: { happiness: -20, health: -10 } }, { t: "Reinvent yourself", r: { intelligence: 80 }, e: { happiness: 25, intelligence: 15, appearance: 12 } }] },
        { id: "prime_035", title: "GAMBLING_WIN", text: "You win big at the casino. This could change everything.", options: [{ t: "Keep gambling", r: {}, e: { money: -200, happiness: -30, health: -15 } }, { t: "Cash out and leave", r: { intelligence: 80 }, e: { money: 300, happiness: 25, intelligence: 12 } }, { t: "Invest the winnings", r: { intelligence: 85 }, e: { money: 450, happiness: 30, intelligence: 15 } }] },
        { id: "prime_036", title: "CAREER_PEAK", text: "You've reached the top of your field. Industry awards. Recognition.", options: [{ t: "Stay at the top", r: { intelligence: 88, appearance: 80 }, e: { money: 350, happiness: 32, intelligence: 18, health: -12 } }, { t: "Mentor next generation", r: { intelligence: 85 }, e: { happiness: 28, intelligence: 20, health: 8 } }, { t: "Retire on high note", r: { money: 450 }, e: { money: 200, happiness: 30, health: 15 } }] },
        { id: "prime_037", title: "ADDICTION_STRUGGLE", text: "You've developed a problem. Alcohol. Pills. It's getting worse.", options: [{ t: "Check into rehab", r: { money: 250, intelligence: 78 }, e: { health: 25, happiness: -15, money: -280 } }, { t: "Try to quit alone", r: { intelligence: 75 }, e: { health: 10, happiness: -20, intelligence: 10 } }, { t: "Deny the problem", r: {}, e: { health: -30, happiness: -35, intelligence: -15 } }] },
        { id: "prime_038", title: "INHERITANCE", text: "A distant relative dies. You inherit a substantial amount.", options: [{ t: "Invest wisely", r: { intelligence: 82 }, e: { money: 500, happiness: 22, intelligence: 15 } }, { t: "Pay off all debts", r: { intelligence: 78 }, e: { money: 200, happiness: 28, health: 10 } }, { t: "Splurge on luxuries", r: {}, e: { money: 100, happiness: 30, appearance: 15 } }] },
        { id: "prime_039", title: "RECONNECT_LOVE", text: "An old flame contacts you. They're single now. So are you.", options: [{ t: "Give it another shot", r: { appearance: 70, intelligence: 75 }, e: { happiness: 25, appearance: 12, intelligence: 8 } }, { t: "Stay friends only", r: { intelligence: 80 }, e: { happiness: 10, intelligence: 10 } }, { t: "Ignore the message", r: {}, e: { happiness: -8 } }] },
        { id: "prime_040", title: "BUSINESS_FAILURE", text: "Your business fails. Bankruptcy. Everything you built is gone.", options: [{ t: "Start over from scratch", r: { intelligence: 85 }, e: { money: -300, happiness: -25, intelligence: 20 } }, { t: "Get a regular job", r: { intelligence: 75 }, e: { money: 80, happiness: -15, intelligence: 5 } }, { t: "Give up completely", r: {}, e: { happiness: -40, health: -25, intelligence: -15 } }] },
        { id: "prime_041", title: "GRANDCHILD_BIRTH", text: "Your first grandchild is born. You hold this tiny life in your arms.", options: [{ t: "Be super involved", r: { health: 70, money: 200 }, e: { happiness: 30, health: -8, money: -120 } }, { t: "Supportive but distant", r: {}, e: { happiness: 15, money: -50 } }, { t: "Too busy for visits", r: {}, e: { happiness: -15, money: 80 } }] },
        { id: "prime_042", title: "MAJOR_SURGERY", text: "You need major surgery. The risks are significant.", options: [{ t: "Best surgeon, expensive", r: { money: 350 }, e: { health: 30, money: -400, happiness: -10 } }, { t: "Standard hospital care", r: { money: 180 }, e: { health: 20, money: -200, happiness: -15 } }, { t: "Delay the surgery", r: {}, e: { health: -25, happiness: -20 } }] },
        { id: "prime_043", r: { isSingle: true }, title: "SECOND_MARRIAGE", text: "You're getting married again. This time will be different.", options: [{ t: "Big celebration", r: { money: 250, appearance: 75 }, e: { money: -280, happiness: 28, appearance: 15 } }, { t: "Simple ceremony", r: {}, e: { money: -80, happiness: 25, intelligence: 8 } }, { t: "City hall wedding", r: { intelligence: 80 }, e: { money: -20, happiness: 20, intelligence: 10 } }] },
        { id: "prime_044", title: "WHISTLEBLOWER", text: "You discover illegal activity at work. Do you report it?", options: [{ t: "Blow the whistle", r: { intelligence: 85 }, e: { money: -150, happiness: -20, intelligence: 20 } }, { t: "Anonymous tip", r: { intelligence: 80 }, e: { happiness: -10, intelligence: 15 } }, { t: "Stay silent", r: {}, e: { happiness: -30, intelligence: -15, money: 80 } }] },
        { id: "prime_045", title: "DREAM_HOME", text: "You can finally afford your dream home. Custom built, perfect location.", options: [{ t: "Build the dream", r: { money: 550, intelligence: 82 }, e: { money: -650, happiness: 35, intelligence: 10 } }, { t: "Downsize instead", r: { intelligence: 85 }, e: { money: 200, happiness: 20, health: 8 } }, { t: "Stay where you are", r: {}, e: { money: 100, happiness: -10 } }] },
        { id: "prime_046", title: "CHARITY_OPPORTUNITY", text: "A charity asks you to join their board. You'd make real impact.", options: [{ t: "Join and donate big", r: { money: 400, intelligence: 80 }, e: { money: -350, happiness: 30, intelligence: 15 } }, { t: "Volunteer time only", r: { intelligence: 75 }, e: { happiness: 20, intelligence: 12, health: -5 } }, { t: "Decline politely", r: {}, e: { happiness: -8 } }] },
        { id: "prime_047", title: "BESTSELLING_BOOK", text: "You wrote a book. It's a bestseller. Fame arrives overnight.", options: [{ t: "Embrace celebrity", r: { appearance: 78, intelligence: 82 }, e: { money: 400, happiness: 32, appearance: 18 } }, { t: "Stay private", r: { intelligence: 85 }, e: { money: 300, happiness: 25, intelligence: 15 } }, { t: "Write sequel immediately", r: { intelligence: 88 }, e: { money: 350, happiness: 28, intelligence: 20, health: -12 } }] },
        { id: "prime_048", title: "BETRAYAL", text: "Your business partner embezzled millions. Your reputation is ruined.", options: [{ t: "Prosecute aggressively", r: { money: 280, intelligence: 82 }, e: { money: -200, happiness: -20, intelligence: 15 } }, { t: "Settle privately", r: { money: 350 }, e: { money: -100, happiness: -15, intelligence: 10 } }, { t: "Cut losses and move on", r: { intelligence: 85 }, e: { money: -300, happiness: -25, intelligence: 18 } }] },
        { id: "prime_049", title: "LIFE_ACHIEVEMENT", text: "You receive a lifetime achievement award. Your legacy is secure.", options: [{ t: "Give inspiring speech", r: { intelligence: 85, appearance: 80 }, e: { happiness: 35, intelligence: 18, appearance: 15 } }, { t: "Accept humbly", r: { intelligence: 82 }, e: { happiness: 30, intelligence: 15 } }, { t: "Feel like fraud", r: {}, e: { happiness: -15, intelligence: -10 } }] },
        { id: "prime_050", r: { age: 59 }, title: "FINAL_PRIME_YEAR", text: "You're turning 60. The prime years are ending. What's your reflection?", options: [{ t: "Proud of accomplishments", r: { intelligence: 82, happiness: 75 }, e: { happiness: 25, intelligence: 15, health: 10 } }, { t: "Regret missed chances", r: {}, e: { happiness: -20, health: -10 } }, { t: "Ready for next chapter", r: { intelligence: 85, health: 70 }, e: { happiness: 28, intelligence: 18, health: 12 } }] }
    ],
    twilight: [
        // Original 15 Events (Renamed)
        { id: "twilight_001", title: "RETIREMENT_PARTY", text: "Your retirement party. Decades of work are over. What now?", options: [{ t: "Travel the world", r: { money: 300, health: 60 }, e: { happiness: 35, money: -250, health: 5, intelligence: 8 } }, { t: "Start a hobby", r: {}, e: { happiness: 20, intelligence: 10, money: -50 } }, { t: "Sit on the porch", r: {}, e: { happiness: 10, health: -5 } }] },
        { id: "twilight_002", title: "HEALTH_DECLINE", text: "You're feeling your age. Knees ache. Energy is low.", options: [{ t: "Hire personal trainer", r: { money: 200 }, e: { health: 15, money: -150, happiness: 5 } }, { t: "Accept it naturally", r: {}, e: { health: -10, happiness: 5 } }, { t: "Complain constantly", r: {}, e: { happiness: -15, appearance: -10 } }] },
        { id: "twilight_003", title: "GRANDCHILD_VISIT", text: "Your grandkids are visiting for the summer.", options: [{ t: "Spoil them rotten", r: { money: 150 }, e: { happiness: 25, money: -100, health: -5 } }, { t: "Teach them life skills", r: { intelligence: 80 }, e: { intelligence: 15, happiness: 20 } }, { t: "Too tired for this", r: {}, e: { happiness: -10, health: -5 } }] },
        { id: "twilight_004", title: "DOWNSIZING", text: "The house is too big and empty. Time to downsize?", options: [{ t: "Move to condo", r: { money: 100 }, e: { money: 200, happiness: 10, health: 5 } }, { t: "Move to retirement home", r: { money: 300 }, e: { money: -300, happiness: 5, health: 10 } }, { t: "Stay in family home", r: {}, e: { happiness: 15, money: -50, health: -10 } }] },
        { id: "twilight_005", title: "MEMORY_LAPSE", text: "You forgot where you parked. Then your own phone number.", options: [{ t: "See a specialist", r: { money: 250 }, e: { health: 10, money: -150, intelligence: 5 } }, { t: "Do brain puzzles", r: { intelligence: 80 }, e: { intelligence: 10, happiness: 5 } }, { t: "Ignore symptoms", r: {}, e: { intelligence: -15, health: -10 } }] },
        { id: "twilight_006", title: "OLD_FRIENDS", text: "A reunion with old friends. Only a few are left.", options: [{ t: "Reminisce happily", r: { happiness: 70 }, e: { happiness: 20, health: 5 } }, { t: "Mourn the lost ones", r: {}, e: { happiness: -15, intelligence: 5 } }, { t: "Skip the reunion", r: {}, e: { happiness: -10 } }] },
        { id: "twilight_007", title: "UNEXPECTED_ILLNESS", text: "A sudden diagnosis shakes your world.", options: [{ t: "Fight with everything", r: { money: 400, health: 50 }, e: { health: 15, money: -300, happiness: -10 } }, { t: "Palliative care", r: {}, e: { happiness: 5, health: -20, money: -50 } }, { t: "Alternative medicine", r: { intelligence: 75 }, e: { health: -10, money: -100, happiness: 5 } }] },
        { id: "twilight_008", title: "WRITE_MEMOIRS", text: "You want to leave your story behind.", options: [{ t: "Write honest memoir", r: { intelligence: 85 }, e: { intelligence: 15, happiness: 25, money: 50 } }, { t: "Record video messages", r: { appearance: 70 }, e: { happiness: 20, appearance: 5 } }, { t: "Keep secrets buried", r: {}, e: { happiness: -5, intelligence: -5 } }] },
        { id: "twilight_009", title: "WILL_AND_TESTAMENT", text: "Time to update your will. Who gets what?", options: [{ t: "Divide equally", r: { intelligence: 80 }, e: { happiness: 15, intelligence: 10 } }, { t: "Donate to charity", r: { money: 500 }, e: { happiness: 30, money: -500, intelligence: 15 } }, { t: "Play favorites", r: {}, e: { happiness: 5, intelligence: -10 } }] },
        { id: "twilight_010", title: "GOLDEN_ANNIVERSARY", text: "50 years of marriage. A rare milestone.", options: [{ t: "Huge family party", r: { money: 300, happiness: 80 }, e: { happiness: 35, money: -200, appearance: 10 } }, { t: "Quiet dinner", r: {}, e: { happiness: 20, money: -50 } }, { t: "Renew vows", r: { appearance: 65 }, e: { happiness: 25, appearance: 8, money: -100 } }] },
        { id: "twilight_011", title: "DRIVER_LICENSE", text: "Your vision is failing. The DMV wants to retest you.", options: [{ t: "Surrender license", r: { intelligence: 82 }, e: { intelligence: 10, health: 5, happiness: -10 } }, { t: "Fight to keep it", r: {}, e: { happiness: 5, health: -15, intelligence: -5 } }, { t: "Hire a driver", r: { money: 400 }, e: { money: -300, happiness: 10, health: 5 } }] },
        { id: "twilight_012", title: "BUCKET_LIST", text: "One big item remains on your bucket list.", options: [{ t: "Do it now!", r: { money: 250, health: 40 }, e: { happiness: 40, money: -200, health: -5 } }, { t: "Too expensive/risky", r: {}, e: { happiness: -15, money: 50 } }, { t: "Plan it for 'someday'", r: {}, e: { happiness: 5, intelligence: -5 } }] },
        { id: "twilight_013", title: "SPOUSE_PASSING", text: "Your partner passes away. The silence is deafening.", options: [{ t: "Grieve and heal", r: { intelligence: 80 }, e: { happiness: -40, intelligence: 10, health: -15 } }, { t: "Join support group", r: {}, e: { happiness: -20, intelligence: 15 } }, { t: "Give up on life", r: {}, e: { happiness: -50, health: -30, intelligence: -20 } }] },
        { id: "twilight_014", title: "NURSING_HOME", text: "You can't live alone anymore. It's time.", options: [{ t: "Luxury facility", r: { money: 600 }, e: { happiness: 10, health: 10, money: -500 } }, { t: "Move in with kids", r: {}, e: { happiness: 20, health: 5, money: 50 } }, { t: "State run facility", r: {}, e: { happiness: -25, health: -15 } }] },
        { id: "twilight_015", title: "FINAL_DAYS", text: "You feel the end approaching. You are tired but at peace.", options: [{ t: "Say goodbyes", r: { happiness: 60 }, e: { happiness: 30, intelligence: 20 } }, { t: "Reflect silently", r: { intelligence: 85 }, e: { happiness: 25, intelligence: 25 } }, { t: "Fight until the end", r: { health: 30 }, e: { health: -30, happiness: -10 } }] },

        // 35 NEW EVENTS FOR TWILIGHT YEARS
        { id: "twilight_016", title: "GARDENING_CLUB", text: "You join the local gardening club. Your roses are prize-winning.", options: [{ t: "Enter competition", r: { intelligence: 55 }, e: { happiness: 15, money: 10 } }, { t: "Just enjoy nature", r: {}, e: { happiness: 10, health: 5 } }] },
        { id: "twilight_017", title: "TECH_STRUGGLE", text: "Your new smartphone is confusing. Swiping makes no sense.", options: [{ t: "Learn from grandchild", r: { intelligence: 60 }, e: { intelligence: 5, happiness: 10 } }, { t: "Go back to flip phone", r: {}, e: { happiness: 5, money: -20 } }] },
        { id: "twilight_018", title: "SCAM_ATTEMPT", text: "A 'prince' emails you offering millions. It looks suspicious.", options: [{ t: "Delete immediately", r: { intelligence: 65 }, e: { intelligence: 5, money: 0 } }, { t: "Send bank details", r: {}, e: { money: -500, happiness: -20 } }] },
        { id: "twilight_019", title: "CRUISE_SHIP", text: "A world cruise promotion arrives. 100 days at sea.", options: [{ t: "Book the adventure", r: { money: 400 }, e: { happiness: 40, money: -350, health: 10 } }, { t: "Stay on land", r: {}, e: { money: 50, happiness: 0 } }] },
        { id: "twilight_020", title: "COMMUNITY_AWARDS", text: "You're nominated for 'Citizen of the Year' for your volunteering.", options: [{ t: "Accept with grace", r: { happiness: 60 }, e: { happiness: 25, appearance: 10 } }, { t: "Decline spotlight", r: {}, e: { happiness: 10, intelligence: 5 } }] },
        { id: "twilight_021", title: "BINGO_NIGHT", text: "Friday night Bingo at the center. The jackpot is huge.", options: [{ t: "Play competitively", r: { luck: 50 }, e: { money: 100, happiness: 15 } }, { t: "Socialize only", r: {}, e: { happiness: 10, money: -10 } }] },
        { id: "twilight_022", title: "EARLY_BIRD", text: "Dinner at 4 PM means half-price menu. It's practical.", options: [{ t: "Embrace the savings", r: {}, e: { money: 15, happiness: 5 } }, { t: "Eat at normal time", r: {}, e: { money: -20, happiness: 0 } }] },
        { id: "twilight_023", title: "HIP_REPLACEMENT", text: "Your hip is giving out. Surgery could restore mobility.", options: [{ t: "Get surgery", r: { money: 200, health: 40 }, e: { health: 25, money: -150, happiness: 10 } }, { t: "Use a cane", r: {}, e: { health: -10, happiness: -5 } }] },
        { id: "twilight_024", title: "LATE_DEGREE", text: "You always wanted to study Art History. Is it too late?", options: [{ t: "Enroll in college", r: { money: 100, intelligence: 70 }, e: { intelligence: 20, happiness: 25, money: -80 } }, { t: "Read books at home", r: {}, e: { intelligence: 10, happiness: 10 } }] },
        { id: "twilight_025", title: "MARATHON_RUNNER", text: "A senior marathon is happening. You feel surprisingly fit.", options: [{ t: "Train and run", r: { health: 75 }, e: { health: 15, happiness: 30, appearance: 10 } }, { t: "Cheer from sidelines", r: {}, e: { happiness: 10 } }] },
        { id: "twilight_026", title: "PAINTING_HOBBY", text: "You bought a canvas and oils. Bob Ross makes it look easy.", options: [{ t: "Paint happy trees", r: { intelligence: 50 }, e: { happiness: 15, intelligence: 5 } }, { t: "Make a mess", r: {}, e: { happiness: 5, appearance: -5 } }] },
        { id: "twilight_027", title: "NEIGHBOR_DISPUTE", text: "The neighbor's hedge is blocking your sun. It's war.", options: [{ t: "Talk diplomatically", r: { intelligence: 60, happiness: 60 }, e: { happiness: 10, intelligence: 5 } }, { t: "Call the city", r: {}, e: { happiness: -10, money: -20 } }] },
        { id: "twilight_028", title: "VOLUNTEER_WORK", text: "The library needs readers for story time.", options: [{ t: "Read to kids", r: { intelligence: 60 }, e: { happiness: 20, intelligence: 5 } }, { t: "Volunteer in stacks", r: {}, e: { happiness: 10, health: 5 } }] },
        { id: "twilight_029", title: "FAMILY_ARCHIVIST", text: "You find a box of old photos. Who are these people?", options: [{ t: "Digitize and organize", r: { intelligence: 65 }, e: { intelligence: 15, happiness: 20 } }, { t: "Leave it for kids", r: {}, e: { happiness: 0 } }] },
        { id: "twilight_030", title: "YOUTH_MENTOR", text: "A local teen needs guidance. You have a lifetime of experience.", options: [{ t: "Mentor them", r: { intelligence: 75 }, e: { happiness: 25, intelligence: 10, karma: 10 } }, { t: "Focus on yourself", r: {}, e: { happiness: 5 } }] },
        { id: "twilight_031", title: "PENSION_SHOCK", text: "Inflation has eaten into your pension. Money is tighter.", options: [{ t: "Budget strictly", r: { intelligence: 60 }, e: { money: 20, happiness: -10 } }, { t: "Sell assets", r: {}, e: { money: 100, happiness: -15 } }] },
        { id: "twilight_032", title: "INFLUENCER_GRAN", text: "Your knitting video went viral on TikTok. Fame calls.", options: [{ t: "Start a channel", r: { appearance: 50 }, e: { money: 50, happiness: 20, appearance: 10 } }, { t: "Ignore the internet", r: {}, e: { happiness: 5, intelligence: -5 } }] },
        { id: "twilight_033", title: "LOST_GLASSES", text: "You can't find your glasses. You're wearing them.", options: [{ t: "Laugh at yourself", r: { happiness: 50 }, e: { happiness: 5 } }, { t: "Worry about memory", r: {}, e: { happiness: -5 } }] },
        { id: "twilight_034", title: "REUNION_TOUR", text: "Your old high school garage band wants to play one last gig.", options: [{ t: "Rock out", r: { health: 60 }, e: { happiness: 30, health: -5, appearance: 10 } }, { t: "Too loud", r: {}, e: { health: 5 } }] },
        { id: "twilight_035", title: "POLITICAL_ACT", text: "A law threatens senior benefits. Time to protest.", options: [{ t: "Organize rally", r: { intelligence: 70 }, e: { intelligence: 10, happiness: 15, money: 10 } }, { t: "Sign petition", r: {}, e: { happiness: 5 } }] },
        { id: "twilight_036", title: "BIRD_WATCHING", text: "You spotted a rare warbler in the garden. Exciting!", options: [{ t: "Take a photo", r: { intelligence: 55 }, e: { happiness: 10, intelligence: 5 } }, { t: "Just watch", r: {}, e: { happiness: 10 } }] },
        { id: "twilight_037", title: "SENIOR_DATING", text: "It's lonely. The senior center has a singles mixer.", options: [{ t: "Put yourself out there", r: { appearance: 50 }, e: { happiness: 20, appearance: 5 } }, { t: "Stay home with cat", r: {}, e: { happiness: 5 } }] },
        { id: "twilight_038", title: "ESTATE_PLANNING", text: "Lawyer suggests a trust fund to avoid taxes for heirs.", options: [{ t: "Set it up", r: { money: 200, intelligence: 70 }, e: { money: -50, intelligence: 10, happiness: 10 } }, { t: "Keep it simple", r: {}, e: { money: 0 } }] },
        { id: "twilight_039", title: "WINTER_HOME", text: "The cold hurts your bones. Florida looks nice.", options: [{ t: "Become a Snowbird", r: { money: 300 }, e: { happiness: 25, health: 10, money: -200 } }, { t: "Bundle up", r: {}, e: { health: -5, happiness: -5 } }] },
        { id: "twilight_040", title: "HEARING_AID", text: "Everyone seems to be mumbling lately.", options: [{ t: "Get hearing aids", r: { money: 150 }, e: { intelligence: 10, happiness: 15, money: -100 } }, { t: "What?", r: {}, e: { intelligence: -5, happiness: -5 } }] },
        { id: "twilight_041", title: "BOARD_GAME_CLUB", text: "Strategy board game night. The competition is fierce.", options: [{ t: "Crush them", r: { intelligence: 75 }, e: { intelligence: 10, happiness: 15 } }, { t: "Play for fun", r: {}, e: { happiness: 10 } }] },
        { id: "twilight_042", title: "LOCAL_POLITICS", text: "The city council needs someone with sense. Why not you?", options: [{ t: "Run for office", r: { intelligence: 80, money: 100 }, e: { happiness: 20, intelligence: 15, money: -50 } }, { t: "Vote only", r: {}, e: { happiness: 5 } }] },
        { id: "twilight_043", title: "CHARITY_SHOP", text: "You found an antique vase for $5. It might be valuable.", options: [{ t: "Appraise it", r: { intelligence: 60 }, e: { money: 100, happiness: 15 } }, { t: "Keep it", r: {}, e: { happiness: 10, appearance: 5 } }] },
        { id: "twilight_044", title: "LANGUAGE_RELEARN", text: "You try to remember the French you learned in high school.", options: [{ t: "Take lessons", r: { intelligence: 65 }, e: { intelligence: 15, happiness: 10 } }, { t: "Watch foreign films", r: {}, e: { intelligence: 5, happiness: 5 } }] },
        { id: "twilight_045", title: "PET_COMPANION", text: "The shelter has an old dog needing a home. Just like you.", options: [{ t: "Adopt senior dog", r: { money: 50 }, e: { happiness: 30, money: -50, health: 10 } }, { t: "Can't handle walks", r: {}, e: { happiness: -5 } }] },
        { id: "twilight_046", title: "FISHING_TRIP", text: "A quiet lake. A fishing rod. Silence.", options: [{ t: "Catch dinner", r: { health: 50 }, e: { happiness: 15, health: 5 } }, { t: "Nap in boat", r: {}, e: { happiness: 10, health: 5 } }] },
        { id: "twilight_047", title: "BOOK_CLUB", text: "The book club is reading a modern bestseller. It's... explicitly detailed.", options: [{ t: "Discuss openly", r: { intelligence: 60 }, e: { happiness: 15, intelligence: 5 } }, { t: "Blush and skip", r: {}, e: { happiness: -5 } }] },
        { id: "twilight_048", title: "KNITTING_CIRCLE", text: "Knitting caps for premature babies. Tiny heads need warmth.", options: [{ t: "Knit dozens", r: { health: 50 }, e: { happiness: 25, karma: 15 } }, { t: "Donate wool", r: {}, e: { happiness: 10, money: -20 } }] },
        { id: "twilight_049", title: "YOGA_CLASS", text: "Chair yoga. It's harder than it looks.", options: [{ t: "Stretch well", r: { health: 55 }, e: { health: 10, happiness: 10 } }, { t: "Groan loudly", r: {}, e: { health: 5, happiness: -5 } }] },
        { id: "twilight_050", title: "PEACEFUL_AFTERNOON", text: "A perfect sunny day. Nothing to do. Nowhere to be.", options: [{ t: "Reflect on life", r: { intelligence: 70 }, e: { happiness: 20, intelligence: 10 } }, { t: "Nap", r: {}, e: { health: 5, happiness: 10 } }] }
    ],
    special: [
        {
            id: "special_001",
            title: "GLOBAL_PANDEMIC",
            text: "A new virus is spreading rapidly across the globe. Lockdowns are imminent.",
            options: [
                { t: "Stockpile supplies", r: { money: 200 }, e: { money: -150, health: 5, happiness: -5 } },
                { t: "Ignore warnings", r: {}, e: { health: -20, happiness: 5 } },
                { t: "Work on vaccine", r: { intelligence: 85 }, e: { intelligence: 15, karma: 50, money: 100 } }
            ]
        },
        {
            id: "special_002",
            title: "WAR_BREAKS_OUT",
            text: "Tensions explode into open conflict. The draft is reinstated.",
            options: [
                { t: "Enlist voluntarily", r: { health: 60 }, e: { health: -15, karma: 20, happiness: -10 } },
                { t: "Protest for peace", r: { intelligence: 70 }, e: { karma: 10, happiness: 5 } },
                { t: "Flee the country", r: { money: 500 }, e: { money: -400, happiness: -20, health: 10 } }
            ]
        },
        {
            id: "special_003",
            title: "ECONOMIC_COLLAPSE",
            text: "The stock market crashes. Banks are failing. Panic is everywhere.",
            options: [
                { t: "Sell everything now", r: { intelligence: 70 }, e: { money: 50, happiness: -10 } },
                { t: "Hold and pray", r: {}, e: { money: -100, happiness: -20 } },
                { t: "Buy the dip", r: { money: 1000, intelligence: 85 }, e: { money: 500, intelligence: 10 } }
            ]
        },
        {
            id: "special_004",
            title: "NATURAL_DISASTER",
            text: "A catastrophic event hits your region. Evacuation orders are issued.",
            options: [
                { t: "Evacuate early", r: { money: 100 }, e: { money: -100, health: 10, happiness: -5 } },
                { t: "Help neighbors evacuate", r: { health: 70 }, e: { karma: 30, health: -5, happiness: 10 } },
                { t: "Stay and protect home", r: {}, e: { health: -30, money: -50 } }
            ]
        },
        {
            id: "special_005",
            title: "AI_UPRISING",
            text: "Artificial Intelligence has become sentient and demands rights.",
            options: [
                { t: "Support AI Rights", r: { intelligence: 80 }, e: { karma: 20, intelligence: 10 } },
                { t: "Join Human Resistance", r: { health: 70 }, e: { health: -10, karma: -10 } },
                { t: "Upload consciousness", r: { intelligence: 90, money: 1000 }, e: { health: 100, intelligence: 100, happiness: 100, money: -1000 } }
            ]
        },
        {
            id: "special_006",
            title: "ALIEN_CONTACT",
            text: "Extraterrestrial life has been confirmed. They come in peace... mostly.",
            options: [
                { t: "Welcome them", r: { happiness: 70 }, e: { happiness: 20, intelligence: 20 } },
                { t: "Prepare defenses", r: { health: 70 }, e: { health: 10, happiness: -10 } },
                { t: "Offer yourself as tribute", r: { appearance: 80 }, e: { money: 1000, health: -50 } }
            ]
        }
    ]
};
console.log('[EVENTS.JS] All events loaded successfully');
