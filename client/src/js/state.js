/**
 * NEXUS ASSESS — Game State Module
 * Centralized mutable game state + pure helper functions.
 */

import { RANKS, STREAK_BONUSES } from './constants.js';

// ──────────────────────────────────────────────────────────────
//  GAME STATE (mutable singleton)
// ──────────────────────────────────────────────────────────────

/**
 * Creates a fresh, initialized game state object.
 * The state is re-created for every new game session via initState().
 */
export function createGameState() {
    return {
        xp: 0,
        ability: 0.5,   // 0..1 — adaptive difficulty modifier
        focus: 100,   // 0..100
        streak: 0,
        highestStreak: 0,
        mistakeStreak: 0,
        questionsAnswered: 0,
        correctTotal: 0,
        totalMistakes: 0,
    };
}

// Singleton reference — replaced by initState()
export let state = createGameState();

/** Replace the current state with a fresh one. */
export function initState() {
    state = createGameState();
}

// ──────────────────────────────────────────────────────────────
//  PURE HELPERS
// ──────────────────────────────────────────────────────────────

/**
 * Returns the streak bonus multiplier for a given streak count.
 */
export function getStreakMult(streak) {
    for (const { at, mult } of STREAK_BONUSES) {
        if (streak >= at) return mult;
    }
    return 1.0;
}

/**
 * Returns the current rank object for a given total XP.
 */
export function getRank(xp) {
    for (let i = RANKS.length - 1; i >= 0; i--) {
        if (xp >= RANKS[i].min) return RANKS[i];
    }
    return RANKS[0];
}

/**
 * Return level info (label, class, XP thresholds) for a given total XP.
 */
export function getLevel(totalXP) {
    if (totalXP >= 5000) return { label: 'MASTER', cls: 'master' };
    if (totalXP >= 2000) return { label: 'EXPERT', cls: 'expert' };
    if (totalXP >= 800) return { label: 'ADVANCED', cls: 'advanced' };
    if (totalXP >= 200) return { label: 'INTERMEDIATE', cls: 'intermediate' };
    return { label: 'BEGINNER', cls: 'beginner' };
}

/**
 * Calculates the current score capped at 100.
 * Based on XP, correct rate, and streak bonuses.
 */
export function getScore100() {
    const xpScore = Math.min(100, Math.round(state.xp / 10));
    const accScore = state.questionsAnswered > 0
        ? Math.round((state.correctTotal / state.questionsAnswered) * 40)
        : 0;
    const raw = Math.round((xpScore * 0.6) + (accScore * 0.4));
    return Math.min(100, raw);
}

/**
 * Computes XP needed for next rank threshold relative to current XP.
 */
export function xpToNextRank(currentXP) {
    const rank = getRank(currentXP);
    if (rank.max === Infinity) return 0;
    return rank.max - currentXP;
}

/**
 * Returns XP progress inside the current rank (0..1).
 */
export function rankProgress(currentXP) {
    const rank = getRank(currentXP);
    if (rank.max === Infinity) return 1;
    const range = rank.max - rank.min;
    return range > 0 ? (currentXP - rank.min) / range : 0;
}
