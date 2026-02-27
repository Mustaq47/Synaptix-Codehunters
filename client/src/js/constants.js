/**
 * NEXUS ASSESS — Constants
 * All static configuration values used across the application.
 */

export const AVATARS = [
    '🧠', '🤖', '⚡', '🎯', '🔥', '🐉',
    '🦁', '🦊', '🐺', '💀', '👾', '🛸',
    '🌀', '💎', '🏆', '⚔️', '🧬', '🔬',
];

export const TITLES = [
    'The Seeker', 'The Analyst', 'The Strategist', 'The Challenger',
    'The Scholar', 'The Overcomer', 'The Architect', 'The Phantom',
];

export const RANKS = [
    { name: '🥉 BRONZE', emoji: '🥉', min: 0, max: 200 },
    { name: '🥈 SILVER', emoji: '🥈', min: 200, max: 500 },
    { name: '🥇 GOLD', emoji: '🥇', min: 500, max: 800 },
    { name: '💎 PLATINUM', emoji: '💎', min: 800, max: 1200 },
    { name: '👑 MASTER', emoji: '👑', min: 1200, max: Infinity },
];

/** XP gained per correct answer by difficulty */
export const XP_T = { easy: 10, medium: 20, hard: 40, expert: 60 };

/** XP penalty per wrong answer by difficulty */
export const PEN_T = { easy: 5, medium: 10, hard: 20, expert: 30 };

/** Ordered difficulty levels */
export const DIFFICULTIES = ['easy', 'medium', 'hard', 'expert'];

/** Questions per difficulty level before advancing */
export const QUESTIONS_PER_LEVEL = 3;

/** Pass threshold (correct ratio) to advance difficulty */
export const PASS_THRESHOLD = 0.6;

/** Subject metadata */
export const LANG_META = {
    java: { icon: '☕', label: 'JAVA', cls: 'java', color: 'var(--java)' },
    c: { icon: '🔷', label: 'C', cls: 'c', color: 'var(--c)' },
    python: { icon: '🐍', label: 'PYTHON', cls: 'python', color: 'var(--python)' },
    grammar: { icon: '📝', label: 'GRAMMAR', cls: 'grammar', color: 'var(--grammar)' },
    maths: { icon: '🔢', label: 'MATHS', cls: 'maths', color: 'var(--maths)' },
    reasoning: { icon: '🧩', label: 'REASONING', cls: 'reasoning', color: 'var(--reasoning)' },
    aptitude: { icon: '📈', label: 'APTITUDE', cls: 'aptitude', color: 'var(--aptitude)' },
    gk: { icon: '🌍', label: 'GEN. KNOWLEDGE', cls: 'gk', color: 'var(--gk)' },
    verbal: { icon: '🗣️', label: 'VERBAL', cls: 'verbal', color: 'var(--verbal)' },
    science: { icon: '🔬', label: 'SCIENCE', cls: 'science', color: 'var(--science)' },
};

/** Revision tips per topic shown in assignments after failure */
export const REVISION_TIPS = {
    'Syntax': 'Review language syntax rules, keywords, and code structure fundamentals.',
    'Data Types': 'Study primitive vs reference types, type conversions, and wrapper classes.',
    'OOP': 'Revisit classes, objects, inheritance, polymorphism, encapsulation, and abstraction.',
    'Collections': 'Practice with List, Set, Map implementations and time complexities.',
    'Exceptions': 'Review checked vs unchecked exceptions and try-catch-finally blocks.',
    'Concurrency': 'Study threading models, synchronization, locks, and race conditions.',
    'JVM': 'Explore JVM memory model: heap, stack, metaspace, and GC.',
    'Design Patterns': 'Revisit Singleton, Factory, Observer, Decorator patterns.',
    'Keywords': 'Review special language keywords and their precise semantics.',
    'I/O': 'Practice input/output streams, formatting, and file operations.',
    'Pointers': 'Study pointer arithmetic, dereferencing, and pointer pitfalls.',
    'Memory': 'Review memory allocation, deallocation, leaks, and alignment.',
    'Structs': 'Practice struct vs union differences and memory layout.',
    'Preprocessor': 'Revise macros, #include, #define, and conditional compilation.',
    'Storage': 'Review storage classes: auto, static, extern, register.',
    'Functions': 'Study function signatures, decorators, generators, and closures.',
    'Operators': 'Revisit operator precedence, identity vs equality, bitwise ops.',
    'Data Structures': 'Practice with lists, dicts, sets, stacks, queues and complexity.',
    'Memory (Python)': 'Review deepcopy vs copy, garbage collection, and __slots__.',

    // General Topics
    'Arithmetic': 'Review fundamental operations, fractions, percentages, and ratios.',
    'Algebra': 'Study equations, inequalities, variables, and polynomials.',
    'Geometry': 'Review shapes, areas, volumes, and coordinate geometry.',
    'Syntax & Rules': 'Brush up on tenses, subject-verb agreement, and sentence structure.',
    'Spelling': 'Focus on commonly misspelled words and orthography rules.',
    'Vocabulary': 'Review synonyms, antonyms, and contextual word meanings.',
    'Logic Puzzles': 'Practice identifying patterns, sequences, and logical deductions.',
    'Data Interpretation': 'Study reading charts, graphs, tables, and drawing conclusions.',
    'History': 'Review major historical events, dates, and historical figures.',
    'Geography': 'Study world maps, capitals, natural landmarks, and borders.',
    'Physics': 'Review forces, motion, energy, and thermodynamics fundamentals.',
    'Chemistry': 'Study the periodic table, chemical bonds, and basic reactions.',
    'Biology': 'Review cellular biology, genetics, and human anatomy basics.',
    'Comprehension': 'Practice reading passages carefully and extracting the main idea.',
};

/** Streak multiplier thresholds */
export const STREAK_BONUSES = [
    { at: 10, mult: 2.5 },
    { at: 7, mult: 2.0 },
    { at: 5, mult: 1.75 },
    { at: 3, mult: 1.5 },
    { at: 0, mult: 1.0 },
];
