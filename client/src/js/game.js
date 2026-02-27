/**
 * NEXUS ASSESS — Game Engine Module
 * Core gameplay with AI question generation, adaptive difficulty,
 * topic tracking, completion, and Strengths & Weaknesses analysis.
 */

import { QB } from './data.js';
import {
    DIFFICULTIES, XP_T, PEN_T, QUESTIONS_PER_LEVEL, PASS_THRESHOLD, REVISION_TIPS,
} from './constants.js';
import { state, initState, getStreakMult, getScore100 } from './state.js';
import { LANG_META } from './constants.js';
import {
    updateUI, updateTopicProgressUI, showPop,
    updateRevisionPanel, resetRevisionPanel, initLeftSidebar, updateLeftSidebar,
} from './ui.js';
import { refreshProfilePanel } from './profile.js';
import { generateQuestion, AI_ENABLED } from './ai.js';

// ── Module-level state ────────────────────────────────────────
let currentLang = 'java';
let topicQueue = [];
let currentTopicIdx = 0;
let currentDiffIdx = 0;
let topicStats = {};
let topicLevelResults = {};
let levelQCount = 0;
let levelCorrect = 0;
let qNum = 0;
let curQ = null;
let answered = false;
let selectedOptIdx = -1;
let timerInterval = null;
let timerSec = 30;
let timerMax = 30;

export function stopTimer() { clearInterval(timerInterval); }
export function getTopicStats() { return topicStats; }

// ──────────────────────────────────────────────────────────────
//  INIT
// ──────────────────────────────────────────────────────────────

export async function initGame(lang, selectedTopics) {
    currentLang = lang;
    initState();

    // Set language pill
    const meta = LANG_META[lang];
    const pill = document.getElementById('langPill');
    if (pill) { pill.textContent = meta.icon + ' ' + meta.label; pill.className = 'lang-pill ' + meta.cls; }

    // Topic queue
    const langBank = QB[lang] || {};
    const allTopics = selectedTopics?.length
        ? selectedTopics
        : [...new Set(Object.values(langBank).flat().map(q => q.topic))];

    topicQueue = shuffle([...allTopics]);
    currentTopicIdx = 0;
    currentDiffIdx = 0;
    topicStats = {};
    topicLevelResults = {};
    topicQueue.forEach(t => { topicLevelResults[t] = []; });
    levelQCount = 0; levelCorrect = 0; qNum = 0;

    document.getElementById('gameArea').style.display = 'block';
    document.getElementById('completionArea').classList.remove('show');
    document.getElementById('restartOverlay').classList.remove('show');

    resetRevisionPanel();
    updateUI(state);
    loadQuestion();
}

// ──────────────────────────────────────────────────────────────
//  QUESTION PICKING (AI first, local fallback)
// ──────────────────────────────────────────────────────────────

async function pickQ() {
    const diff = DIFFICULTIES[currentDiffIdx] || 'easy';
    const topic = topicQueue[currentTopicIdx];

    // Try AI question
    if (AI_ENABLED) {
        const loadingAI = document.getElementById('aiLoadingBadge');
        if (loadingAI) loadingAI.style.display = 'inline';
        const aiQ = await generateQuestion(currentLang, topic, diff);
        if (loadingAI) loadingAI.style.display = 'none';
        if (aiQ) return aiQ;
    }

    // Fallback: local bank
    const langBank = QB[currentLang] || {};
    const pool = (langBank[diff] || []).filter(q => q.topic === topic);
    const all = pool.length ? pool : (langBank[diff] || []);
    return all[Math.floor(Math.random() * all.length)]
        || { q: '(No question found)', options: ['—', '—', '—', '—'], ans: 0, topic };
}

// ──────────────────────────────────────────────────────────────
//  QUESTION RENDERING
// ──────────────────────────────────────────────────────────────

export async function loadQuestion() {
    answered = false;
    selectedOptIdx = -1;
    qNum++;

    document.getElementById('questionCard').className = 'question-card';
    document.getElementById('questionText').textContent = '⚙ Loading question…';
    document.getElementById('optionsContainer').innerHTML = '';
    document.getElementById('submitBtn').className = 'submit-btn';
    document.getElementById('nextBtn').className = 'next-btn';
    document.getElementById('feedback').className = 'feedback';
    document.getElementById('weakTopicAlert').className = 'weak-topic-alert';

    curQ = await pickQ();

    const diff = DIFFICULTIES[currentDiffIdx] || 'easy';
    const isBoss = !!curQ.boss && diff === 'expert';
    const isAI = !!curQ.ai;

    document.getElementById('qNum').textContent = 'QUESTION ' + String(qNum).padStart(2, '0');
    document.getElementById('bossBadge').style.display = isBoss ? 'inline' : 'none';
    document.getElementById('aiBadge').style.display = isAI ? 'inline' : 'none';

    const mult = getStreakMult(state.streak);
    const xpAmt = XP_T[diff] * mult * (isBoss ? 2 : 1);
    document.getElementById('xpReward').textContent = '+' + Math.round(xpAmt) + ' XP';
    document.getElementById('questionText').textContent = curQ.q;

    const opts = document.getElementById('optionsContainer');
    opts.innerHTML = '';
    ['A', 'B', 'C', 'D'].forEach((key, i) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `<span class="opt-key">${key}</span>${curQ.options[i] ?? '—'}`;
        btn.dataset.idx = i;
        btn.onclick = () => selectOption(i, btn);
        opts.appendChild(btn);
    });

    startTimer(diff);
    updateUI(state);
    updateTopicProgressUI(topicQueue, currentTopicIdx, currentDiffIdx, topicLevelResults);
}

// ──────────────────────────────────────────────────────────────
//  OPTION SELECTION
// ──────────────────────────────────────────────────────────────

export function selectOption(idx, btn) {
    if (answered) return;
    const btns = document.querySelectorAll('.option-btn');
    if (selectedOptIdx === idx) {
        btn.classList.remove('selected-opt');
        selectedOptIdx = -1;
        document.getElementById('submitBtn').className = 'submit-btn';
    } else {
        btns.forEach(b => b.classList.remove('selected-opt'));
        btn.classList.add('selected-opt');
        selectedOptIdx = idx;
        document.getElementById('submitBtn').className = 'submit-btn show';
    }
}

export function submitAnswer() {
    if (answered || selectedOptIdx === -1) return;
    document.getElementById('submitBtn').className = 'submit-btn';
    const btn = document.querySelector(`.option-btn[data-idx="${selectedOptIdx}"]`);
    handleAnswer(selectedOptIdx, btn, false);
}

// ──────────────────────────────────────────────────────────────
//  ANSWER HANDLING
// ──────────────────────────────────────────────────────────────

export function handleAnswer(chosen, btn, timedOut = false) {
    if (answered) return;
    answered = true;
    clearInterval(timerInterval);

    const diff = DIFFICULTIES[currentDiffIdx] || 'easy';
    const correct = !timedOut && chosen === curQ.ans;
    const isBoss = !!curQ.boss && diff === 'expert';
    const mult = getStreakMult(state.streak);
    const bb = isBoss ? 2 : 1;

    // Reveal all options
    document.querySelectorAll('.option-btn').forEach((b, i) => {
        b.disabled = true;
        b.classList.remove('selected-opt');
        if (i === curQ.ans) b.classList.add('correct');
        if (!correct && b === btn) b.classList.add('wrong');
    });

    // Init topic stats
    if (!topicStats[curQ.topic]) topicStats[curQ.topic] = { correct: 0, total: 0 };
    topicStats[curQ.topic].total++;

    let msg = '';
    if (correct) {
        const xpGained = Math.round(XP_T[diff] * mult * bb);
        state.xp += xpGained;
        state.correctTotal++;
        state.focus = Math.min(100, state.focus + 5);
        state.streak++;
        state.highestStreak = Math.max(state.highestStreak, state.streak);
        state.mistakeStreak = 0;
        topicStats[curQ.topic].correct++;
        state.ability = Math.min(1, state.ability + .05);
        levelCorrect++;

        showPop('+' + xpGained + ' XP', 'gain');
        document.getElementById('questionCard').classList.add('flash-correct');
        msg = `✓ Correct! +${xpGained} XP`;
        if (state.streak >= 3) msg += `  🔥 ×${getStreakMult(state.streak).toFixed(1)}`;
        document.getElementById('feedback').className = 'feedback correct show';
    } else {
        state.mistakeStreak++;
        state.totalMistakes++;
        state.streak = 0;
        state.ability = Math.max(0, state.ability - .07);
        const pen = Math.round(PEN_T[diff] * state.mistakeStreak);
        state.xp = Math.max(0, state.xp - pen);
        state.focus -= (diff === 'hard' || diff === 'expert') ? 25 : 15;

        showPop('-' + pen + ' XP', 'loss');
        const qc = document.getElementById('questionCard');
        qc.classList.add('flash-wrong', 'shake');
        setTimeout(() => qc.classList.remove('shake'), 500);
        msg = timedOut
            ? `⏱ Time's Up! -${pen} XP — correct was highlighted`
            : `✗ Wrong! -${pen} XP (${state.mistakeStreak}× penalty)`;
        document.getElementById('feedback').className = 'feedback wrong show';
    }
    document.getElementById('feedback').textContent = msg;

    // Weak topic detection → inline alert + right sidebar
    const ts = topicStats[curQ.topic];
    if (!correct && ts.total >= 2 && (ts.correct / ts.total) < 0.5) {
        const wa = document.getElementById('weakTopicAlert');
        wa.textContent = `⚠ Weak Topic: "${curQ.topic}" — below 50% accuracy. Needs revision!`;
        wa.className = 'weak-topic-alert show';
    }
    updateRevisionPanel(topicStats);

    document.getElementById('nextBtn').className = 'next-btn show';
    state.questionsAnswered++;
    levelQCount++;
    updateUI(state);
    refreshProfilePanel();

    // Critical failure
    if (state.focus <= 0 || (state.mistakeStreak >= 3 && (diff === 'hard' || diff === 'expert'))) {
        setTimeout(triggerRestart, 1200);
        return;
    }

    // Level advance check
    if (levelQCount >= QUESTIONS_PER_LEVEL) {
        const passed = (levelCorrect / levelQCount) >= PASS_THRESHOLD;
        const topic = topicQueue[currentTopicIdx];
        if (topicLevelResults[topic]) topicLevelResults[topic].push(passed ? 'pass' : 'fail');

        if (passed && currentDiffIdx < DIFFICULTIES.length - 1) {
            currentDiffIdx++;
            levelQCount = 0; levelCorrect = 0;
            setTimeout(() => {
                showPop('Level Up! ▶', 'gain');
                updateTopicProgressUI(topicQueue, currentTopicIdx, currentDiffIdx, topicLevelResults);
            }, 200);
        } else if (!passed || currentDiffIdx >= DIFFICULTIES.length - 1) {
            advanceTopic();
        }
    }

    // Completion check
    const totalLevels = topicQueue.length * DIFFICULTIES.length;
    const doneLevels = Object.values(topicLevelResults).reduce((s, a) => s + a.length, 0);
    if (doneLevels >= totalLevels) { setTimeout(showCompletion, 1400); }
}

function advanceTopic() {
    currentTopicIdx++;
    currentDiffIdx = 0; levelQCount = 0; levelCorrect = 0;
    if (currentTopicIdx >= topicQueue.length) { setTimeout(showCompletion, 800); }
    else updateTopicProgressUI(topicQueue, currentTopicIdx, currentDiffIdx, topicLevelResults);
}

export function nextQuestion() {
    clearInterval(timerInterval);
    const done = Object.values(topicLevelResults).reduce((s, a) => s + a.length, 0);
    if (currentTopicIdx >= topicQueue.length || done >= topicQueue.length * DIFFICULTIES.length) {
        showCompletion();
    } else {
        loadQuestion();
    }
}

// ──────────────────────────────────────────────────────────────
//  TIMER
// ──────────────────────────────────────────────────────────────

function startTimer(diff) {
    clearInterval(timerInterval);
    timerMax = diff === 'expert' ? 20 : diff === 'hard' ? 25 : 30;
    timerSec = timerMax;
    updateTimerUI();
    timerInterval = setInterval(() => {
        timerSec--;
        updateTimerUI();
        if (timerSec <= 0) { clearInterval(timerInterval); timeUp(); }
    }, 1000);
}

function updateTimerUI() {
    const r = 31, circ = 2 * Math.PI * r;
    const pct = timerSec / timerMax;
    const arc = document.getElementById('timerArc');
    const txt = document.getElementById('timerTxt');
    const ring = document.querySelector('.timer-ring-container');
    arc.style.strokeDashoffset = circ * (1 - pct);
    if (pct > 0.5) { arc.style.stroke = 'var(--green)'; txt.style.color = 'var(--green)'; ring?.classList.remove('urgent'); }
    else if (pct > 0.25) { arc.style.stroke = 'var(--gold)'; txt.style.color = 'var(--gold)'; ring?.classList.remove('urgent'); }
    else { arc.style.stroke = 'var(--red)'; txt.style.color = 'var(--red)'; ring?.classList.add('urgent'); }
    txt.textContent = timerSec;
}

function timeUp() {
    selectedOptIdx = -1;
    document.getElementById('submitBtn').className = 'submit-btn';
    handleAnswer(-1, null, true);
}

// ──────────────────────────────────────────────────────────────
//  COMPLETION + STRENGTHS & WEAKNESSES
// ──────────────────────────────────────────────────────────────

async function showCompletion() {
    document.getElementById('gameArea').style.display = 'none';
    document.getElementById('completionArea').classList.add('show');

    const { getRank } = await import('./state.js');
    const rank = getRank(state.xp);
    const score100 = getScore100();

    document.getElementById('finalRank').textContent = rank.name;
    const rankEl = document.getElementById('finalRank');
    rankEl.style.color =
        rank.name.includes('MASTER') ? 'var(--accent2)' :
            rank.name.includes('PLATINUM') ? 'var(--accent3)' :
                rank.name.includes('GOLD') ? 'var(--gold)' :
                    rank.name.includes('SILVER') ? 'var(--text)' : 'var(--accent)';

    const m = LANG_META[currentLang];
    document.getElementById('finalXP').textContent =
        `${m.icon} ${m.label}  ·  XP: ${state.xp}  ·  Score: ${score100}/100  ·  Best Streak: ${state.highestStreak}🔥`;

    // Topic bars
    const colors = ['var(--accent)', 'var(--accent3)', 'var(--green)', 'var(--gold)', 'var(--accent2)'];
    const tb = document.getElementById('topicBars');
    tb.innerHTML = '';
    Object.entries(topicStats).forEach(([topic, s], i) => {
        const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
        tb.innerHTML += `
      <div class="topic-row">
        <span class="topic-name">${topic}</span>
        <div class="topic-bar-wrap"><div class="topic-bar-fill" style="width:${pct}%;background:${colors[i % colors.length]}"></div></div>
        <span class="topic-pct">${pct}%</span>
      </div>`;
    });

    // Strengths & Weaknesses
    buildSwSection();

    const acc = state.questionsAnswered > 0
        ? Math.round((state.correctTotal / state.questionsAnswered) * 100) : 0;
    await persistSession(state.xp, score100, acc, rank.name, state.highestStreak,
        state.questionsAnswered, state.totalMistakes, currentLang);
}

function buildSwSection() {
    const container = document.getElementById('swSection');
    if (!container) return;

    const strengths = [];
    const weaknesses = [];

    Object.entries(topicStats).forEach(([topic, s]) => {
        if (s.total === 0) return;
        const pct = Math.round((s.correct / s.total) * 100);
        if (pct >= 70) strengths.push({ topic, pct });
        else if (pct < 50) weaknesses.push({ topic, pct });
    });

    strengths.sort((a, b) => b.pct - a.pct);
    weaknesses.sort((a, b) => a.pct - b.pct);

    let html = '<div class="sw-section">';

    html += '<div class="sw-col">';
    html += '<div class="sw-header strength-header">💪 STRENGTHS</div>';
    if (strengths.length === 0) {
        html += '<p class="sw-empty">No strong topics yet — keep practicing!</p>';
    } else {
        strengths.forEach(({ topic, pct }) => {
            html += `<div class="sw-chip strength"><span class="sw-chip-topic">${topic}</span><span class="sw-chip-pct">${pct}%</span></div>`;
        });
    }
    html += '</div>';

    html += '<div class="sw-col">';
    html += '<div class="sw-header weakness-header">📖 NEEDS WORK</div>';
    if (weaknesses.length === 0) {
        html += '<p class="sw-empty">Great performance — no weak spots!</p>';
    } else {
        weaknesses.forEach(({ topic, pct }) => {
            const tip = REVISION_TIPS[topic] || 'Review the fundamentals.';
            html += `<div class="sw-chip weakness">
        <div class="sw-chip-top"><span class="sw-chip-topic">${topic}</span><span class="sw-chip-pct">${pct}%</span></div>
        <div class="sw-chip-tip">${tip}</div>
      </div>`;
        });
    }
    html += '</div>';

    html += '</div>';
    container.innerHTML = html;
}

// ──────────────────────────────────────────────────────────────
//  PERSIST SESSION
// ──────────────────────────────────────────────────────────────

async function persistSession(xp, score100, acc, rankName, hiStreak, totalQ, totalMistakes, lang) {
    const { loadProfile, saveProfile, loadHistoryCompat, saveHistory } = await import('./storage.js');
    const { updateChip } = await import('./profile.js');
    const { RANKS } = await import('./constants.js');

    const p = await loadProfile();
    if (!p || p._deleted) return;
    p.gamesPlayed++;
    p.totalXP += xp;
    p.bestScore = Math.max(p.bestScore || 0, score100);
    p.totalCorrect += (totalQ - totalMistakes);
    p.totalAnswered += totalQ;
    p.highestStreak = Math.max(p.highestStreak || 0, hiStreak);
    if (!p.langGames) p.langGames = { java: 0, c: 0, python: 0 };
    p.langGames[lang] = (p.langGames[lang] || 0) + 1;
    const ro = RANKS.map(r => r.name);
    if (ro.indexOf(rankName) > (ro.indexOf(p.bestRank) ?? -1)) p.bestRank = rankName;
    await saveProfile(p);

    const history = await loadHistoryCompat();
    const entries = Array.isArray(history) ? history : (history?.entries || []);
    entries.unshift({ xp, score100, accuracy: acc, rankName, highestStreak: hiStreak, date: Date.now(), lang });
    if (entries.length > 10) entries.pop();
    await saveHistory(entries);
    updateChip(p);
}

// ──────────────────────────────────────────────────────────────
//  RESTART / FAILURE
// ──────────────────────────────────────────────────────────────

function triggerRestart() {
    const msgs = [
        'Your focus meter reached zero. Reflect and try again.',
        '3 consecutive mistakes at high difficulty. Session reset.',
        'Critical failure. Revision recommended.',
    ];
    document.getElementById('restartMsg').textContent = msgs[Math.floor(Math.random() * msgs.length)];

    const weak = Object.entries(topicStats)
        .map(([topic, s]) => ({ topic, pct: s.total > 0 ? s.correct / s.total : 0 }))
        .sort((a, b) => a.pct - b.pct)
        .slice(0, 3);

    if (weak.length > 0) {
        const card = document.getElementById('assignmentCard');
        const items = document.getElementById('assignmentItems');
        items.innerHTML = '';
        weak.forEach(({ topic, pct }) => {
            const tip = REVISION_TIPS[topic] || 'Review the core concepts for this topic carefully.';
            items.innerHTML += `
        <div class="assignment-item">
          <div class="a-topic">📖 ${topic} — ${Math.round(pct * 100)}% accuracy</div>
          <div class="a-tip">${tip}</div>
        </div>`;
        });
        card.style.display = 'block';
    }
    document.getElementById('restartOverlay').classList.add('show');
}

export function forceRestart() {
    document.getElementById('restartOverlay').classList.remove('show');
    document.getElementById('assignmentCard').style.display = 'none';
    import('./screens.js').then(m => m.startGame());
}

// ──────────────────────────────────────────────────────────────
//  UTILITY
// ──────────────────────────────────────────────────────────────
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
