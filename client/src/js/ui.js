/**
 * NEXUS ASSESS — UI Module
 * DOM update functions: stat bars, topic progress, score panel,
 * XP popups, left sidebar, right revision sidebar.
 */

import { DIFFICULTIES, LANG_META, REVISION_TIPS } from './constants.js';
import { getScore100, getStreakMult, getRank, rankProgress, xpToNextRank } from './state.js';

// ──────────────────────────────────────────────────────────────
//  MAIN UI UPDATER (center column stats)
// ──────────────────────────────────────────────────────────────

export function updateUI(state) {
    if (!state) return;

    // XP card
    const el = (id) => document.getElementById(id);
    el('xpDisplay').textContent = state.xp + ' XP';
    el('xpBar').style.width = Math.min(100, (state.xp % 200) / 2) + '%';
    el('xpToNext').textContent = 'Next: ' + xpToNextRank(state.xp) + ' XP';
    el('qCount').textContent = 'Q: ' + state.questionsAnswered;

    // Focus card
    const focus = Math.max(0, Math.round(state.focus));
    el('focusDisplay').textContent = focus + '%';
    el('focusBar').style.width = focus + '%';
    el('streakDisplay').textContent = 'Streak: ' + state.streak;
    const fb = el('focusBar');
    fb.style.background = focus > 50
        ? 'linear-gradient(90deg, var(--green), var(--accent))'
        : focus > 25
            ? 'linear-gradient(90deg, var(--gold), var(--accent2))'
            : 'linear-gradient(90deg, var(--red), var(--accent2))';

    // Rank card
    const rank = getRank(state.xp);
    el('rankDisplay').textContent = rank.name;
    el('rankBar').style.width = Math.round(rankProgress(state.xp) * 100) + '%';
    el('abilityDisplay').textContent = 'Ability: ' + state.ability.toFixed(2);
    el('mistakeDisplay').textContent = 'Mistakes: ' + state.totalMistakes;

    // Score panel
    const score = getScore100();
    el('scoreDisplay').textContent = score;
    el('scorePanelStreak').textContent = state.streak + '🔥';
    el('scorePanelMult').textContent = '×' + getStreakMult(state.streak).toFixed(1);
    el('scorePanelAcc').textContent = state.questionsAnswered > 0
        ? Math.round((state.correctTotal / state.questionsAnswered) * 100) + '%' : '—';

    const fireEl = el('streakFire');
    if (fireEl) fireEl.textContent = state.streak >= 3
        ? `🔥 ×${getStreakMult(state.streak).toFixed(1)} streak` : '';

    // Update left sidebar
    updateLeftSidebar(state);
}

// ──────────────────────────────────────────────────────────────
//  LEFT SIDEBAR — Live Profile
// ──────────────────────────────────────────────────────────────

export function initLeftSidebar(profile) {
    const el = (id) => document.getElementById(id);
    if (!profile) return;
    if (el('lsAvatar')) el('lsAvatar').textContent = profile.avatar;
    if (el('lsName')) el('lsName').textContent = profile.name;
    if (el('lsTitle')) el('lsTitle').textContent = profile.title;
}

export function updateLeftSidebar(state) {
    if (!state) return;
    const el = (id) => document.getElementById(id);
    const score = getScore100();
    const rank = getRank(state.xp);
    const focus = Math.max(0, Math.round(state.focus));

    if (el('lsRank')) el('lsRank').textContent = rank.name;
    if (el('lsScore')) el('lsScore').textContent = score + '/100';
    if (el('lsXpVal')) el('lsXpVal').textContent = state.xp + ' XP';
    if (el('lsFocusVal')) el('lsFocusVal').textContent = focus + '%';
    if (el('lsMistakes')) el('lsMistakes').textContent = state.totalMistakes;
    if (el('lsStreak')) {
        el('lsStreak').textContent = state.streak >= 3
            ? `🔥 ${state.streak} streak  ×${getStreakMult(state.streak).toFixed(1)}`
            : state.streak > 0 ? `🔥 ${state.streak}` : '';
    }

    // XP bar inside sidebar
    const lsXpBar = el('lsXpBar');
    if (lsXpBar) lsXpBar.style.width = Math.min(100, (state.xp % 200) / 2) + '%';

    // Focus bar inside sidebar
    const lsFocusBar = el('lsFocusBar');
    if (lsFocusBar) {
        lsFocusBar.style.width = focus + '%';
        lsFocusBar.style.background = focus > 50
            ? 'linear-gradient(90deg, var(--green), var(--accent))'
            : focus > 25
                ? 'linear-gradient(90deg, var(--gold), var(--accent2))'
                : 'linear-gradient(90deg, var(--red), var(--accent2))';
    }

    // Rank bar inside sidebar
    const lsRankBar = el('lsRankBar');
    if (lsRankBar) lsRankBar.style.width = Math.round(rankProgress(state.xp) * 100) + '%';

    // Level badge inside sidebar
    const { getLevel } = window._stateHelpers || {};
    if (getLevel && el('lsLevel')) {
        const lv = getLevel(state.xp);
        el('lsLevel').textContent = lv.label;
        el('lsLevel').className = 'level-badge ' + lv.cls;
    }
}

// ──────────────────────────────────────────────────────────────
//  RIGHT SIDEBAR — Live Revision Panel
// ──────────────────────────────────────────────────────────────

const revisionTopicsAdded = new Set();

export function resetRevisionPanel() {
    revisionTopicsAdded.clear();
    const el = document.getElementById('revisionList');
    if (el) el.innerHTML = '<div class="rs-empty">Performing well! 🎯<br>Weak topics will appear here if accuracy drops below 50%.</div>';
}

export function updateRevisionPanel(topicStats) {
    const list = document.getElementById('revisionList');
    if (!list) return;

    Object.entries(topicStats).forEach(([topic, s]) => {
        if (s.total < 2) return; // need at least 2 attempts
        const acc = s.correct / s.total;
        if (acc >= 0.5 || revisionTopicsAdded.has(topic)) return;

        // Remove empty state
        const empty = list.querySelector('.rs-empty');
        if (empty) empty.remove();

        revisionTopicsAdded.add(topic);
        const tip = REVISION_TIPS[topic] || 'Review core concepts for this topic.';
        const urgency = acc === 0 ? 'crit' : acc < 0.33 ? 'high' : 'medium';
        const pct = Math.round(acc * 100);

        const card = document.createElement('div');
        card.className = `rs-card ${urgency}`;
        card.innerHTML = `
      <div class="rs-card-topic">📖 ${topic} <span>${pct}% accuracy</span></div>
      <div class="rs-card-tip">${tip}</div>
      <div class="rs-card-accuracy">${s.correct}/${s.total} correct — needs revision</div>
    `;
        list.insertBefore(card, list.firstChild);
    });
}

// ──────────────────────────────────────────────────────────────
//  TOPIC PROGRESS BAR
// ──────────────────────────────────────────────────────────────

export function updateTopicProgressUI(topicQueue, currentTopicIdx, currentDiffIdx, topicLevelResults) {
    if (!topicQueue || !topicQueue.length) return;

    const topic = topicQueue[currentTopicIdx] || '—';
    document.getElementById('tpTopic').textContent = topic;

    DIFFICULTIES.forEach((_, i) => {
        const dot = document.getElementById('dot' + i);
        if (!dot) return;
        const results = topicLevelResults?.[topic] || [];
        if (i < currentDiffIdx) {
            const res = results[i];
            dot.className = 'tp-dot ' + (res === 'pass' ? 'done' : 'fail');
        } else if (i === currentDiffIdx) {
            dot.className = 'tp-dot current';
        } else {
            dot.className = 'tp-dot';
        }
    });

    ['easy', 'medium', 'hard', 'expert'].forEach((diff, i) => {
        const badge = document.getElementById('badge' + diff.charAt(0).toUpperCase() + diff.slice(1));
        if (badge) badge.classList.toggle('active', i === currentDiffIdx);
    });
}

// ──────────────────────────────────────────────────────────────
//  XP POPUP
// ──────────────────────────────────────────────────────────────

export function showPop(text, type) {
    const el = document.createElement('div');
    el.className = 'xp-popup ' + type;
    el.textContent = text;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1300);
}
