/**
 * NEXUS ASSESS — Profile Module
 * Handles profile creation UI, persistence, and the profile panel.
 */

import { AVATARS, TITLES, RANKS } from './constants.js';
import { loadProfile, saveProfile, deleteProfile, deleteHistory, loadHistory } from './storage.js';
import { getLevel, getRank, getScore100, state } from './state.js';
import { LANG_META } from './constants.js';

export { loadProfile, saveProfile };

// ──────────────────────────────────────────────────────────────
//  CREATE SCREEN
// ──────────────────────────────────────────────────────────────

let selectedAvatar = AVATARS[0];
let selectedTitle = TITLES[0];

/** Build the avatar & title grids on the create profile screen. */
export function buildCreateScreen() {
    // Avatar grid
    const ag = document.getElementById('avatarGrid');
    ag.innerHTML = '';
    AVATARS.forEach((emoji, i) => {
        const div = document.createElement('div');
        div.className = 'avatar-opt' + (i === 0 ? ' selected' : '');
        div.textContent = emoji;
        div.title = emoji;
        div.onclick = () => {
            ag.querySelectorAll('.avatar-opt').forEach(el => el.classList.remove('selected'));
            div.classList.add('selected');
            selectedAvatar = emoji;
        };
        ag.appendChild(div);
    });

    // Title grid
    const tg = document.getElementById('titleGrid');
    tg.innerHTML = '';
    TITLES.forEach((title, i) => {
        const div = document.createElement('div');
        div.className = 'title-opt' + (i === 0 ? ' selected' : '');
        div.textContent = title;
        div.onclick = () => {
            tg.querySelectorAll('.title-opt').forEach(el => el.classList.remove('selected'));
            div.classList.add('selected');
            selectedTitle = title;
        };
        tg.appendChild(div);
    });
}

/** Called when the user clicks "Initialize Profile". */
export async function createProfile() {
    const name = document.getElementById('nameInput').value.trim();
    if (!name) {
        document.getElementById('nameInput').focus();
        document.getElementById('nameInput').style.borderColor = 'var(--red)';
        setTimeout(() => (document.getElementById('nameInput').style.borderColor = ''), 1500);
        return;
    }

    const profile = {
        name,
        avatar: selectedAvatar,
        title: selectedTitle,
        gamesPlayed: 0,
        totalXP: 0,
        bestScore: 0,
        totalCorrect: 0,
        totalAnswered: 0,
        highestStreak: 0,
        bestRank: RANKS[0].name,
        langGames: { java: 0, c: 0, python: 0 },
        createdAt: Date.now(),
    };

    await saveProfile(profile);
    updateChip(profile);

    // Transition to language select
    const { showLangScreen } = await import('./screens.js');
    showLangScreen(profile);
}

// ──────────────────────────────────────────────────────────────
//  CHIP (top-bar profile pill)
// ──────────────────────────────────────────────────────────────

export function updateChip(profile) {
    const el = {
        avatar: document.getElementById('chipAvatar'),
        name: document.getElementById('chipName'),
        rank: document.getElementById('chipRank'),
    };
    if (el.avatar) el.avatar.textContent = profile.avatar;
    if (el.name) el.name.textContent = profile.name;
    if (el.rank) el.rank.textContent = getRank(profile.totalXP || 0).name;
}

// ──────────────────────────────────────────────────────────────
//  PROFILE PANEL
// ──────────────────────────────────────────────────────────────

export async function openProfile() {
    document.getElementById('profileBackdrop').classList.add('show');
    document.getElementById('profilePanel').classList.add('open');

    const p = await loadProfile();
    if (!p) return;

    const levelInfo = getLevel(p.totalXP || 0);

    // Header
    document.getElementById('panelAvatar').textContent = p.avatar;
    document.getElementById('panelName').textContent = p.name;
    document.getElementById('panelTitle').textContent = p.title;
    document.getElementById('panelRank').textContent = getRank(p.totalXP).name;

    const lb = document.getElementById('panelLevel');
    lb.textContent = levelInfo.label;
    lb.className = 'level-badge ' + levelInfo.cls;

    // Stats grid
    document.getElementById('statTotalXP').textContent = (p.totalXP || 0).toLocaleString() + ' XP';
    document.getElementById('statGames').textContent = p.gamesPlayed || 0;
    document.getElementById('statBest').textContent = p.bestScore || 0;
    document.getElementById('statAccuracy').textContent = p.totalAnswered > 0
        ? Math.round((p.totalCorrect / p.totalAnswered) * 100) + '%' : '—';
    document.getElementById('statBestRank').textContent = p.bestRank || RANKS[0].name;
    document.getElementById('statStreak').textContent = p.highestStreak || 0;
    document.getElementById('statLevel').textContent = levelInfo.label;

    // Live session bar
    const gameScreen = document.getElementById('screenGame');
    const gameArea = document.getElementById('gameArea');
    const gameActive = gameScreen.classList.contains('active') && gameArea.style.display !== 'none';
    const liveBar = document.getElementById('sessionLiveBar');

    if (gameActive) {
        liveBar.style.display = 'flex';
        refreshProfilePanel();
    } else {
        liveBar.style.display = 'none';
    }

    const ss = document.getElementById('statSessionScore');
    if (ss) ss.textContent = gameActive ? getScore100() + ' / 100' : '— / 100';

    // Lang stats
    const lg = p.langGames || { java: 0, c: 0, python: 0 };
    document.getElementById('langStatJava').textContent = lg.java + ' game' + (lg.java !== 1 ? 's' : '');
    document.getElementById('langStatC').textContent = lg.c + ' game' + (lg.c !== 1 ? 's' : '');
    document.getElementById('langStatPython').textContent = lg.python + ' game' + (lg.python !== 1 ? 's' : '');

    // Session history
    const history = await loadHistory();
    const hl = document.getElementById('historyList');
    if (!history.length) {
        hl.innerHTML = '<div class="empty-history">No sessions yet.<br>Complete a game to see your history.</div>';
    } else {
        hl.innerHTML = history.map(h => {
            const cls = h.accuracy >= 80 ? 'great' : h.accuracy >= 50 ? 'ok' : 'bad';
            const d = new Date(h.date);
            const ds = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            const langCls = h.lang || 'java';
            const langMeta = LANG_META[langCls] || LANG_META.java;
            const langLabel = langMeta.icon + ' ' + langMeta.label;
            const scoreStr = h.score100 != null ? ` · ${h.score100}/100` : '';
            return `<div class="history-item">
        <span class="hist-rank">${h.rankName.split(' ')[0]}</span>
        <div class="hist-info">
          <div class="hist-xp">${h.xp} XP${scoreStr}</div>
          <div class="hist-meta">${h.rankName.replace(/^.\s/, '')} · ${ds} · 🔥${h.highestStreak}</div>
        </div>
        <div class="hist-right">
          <span class="hist-acc ${cls}">${h.accuracy}%</span>
          <span class="hist-lang-tag ${langCls}">${langLabel}</span>
        </div>
      </div>`;
        }).join('');
    }
}

export function closeProfile() {
    document.getElementById('profileBackdrop').classList.remove('show');
    document.getElementById('profilePanel').classList.remove('open');
}

export async function resetProfile() {
    if (!confirm('Reset your profile and all history? This cannot be undone.')) return;
    await deleteProfile();
    await deleteHistory();
    closeProfile();
    const { showCreateScreen } = await import('./screens.js');
    showCreateScreen();
}

/** Refresh live session bar values while game is active. */
export function refreshProfilePanel() {
    const panel = document.getElementById('profilePanel');
    if (!panel.classList.contains('open')) return;

    document.getElementById('sessionLiveBar').style.display = 'flex';
    document.getElementById('slbScore').textContent = getScore100() + '/100';
    document.getElementById('slbStreak').textContent = state.streak + '🔥';
    const acc = state.questionsAnswered > 0
        ? Math.round((state.correctTotal / state.questionsAnswered) * 100) + '%' : '—';
    document.getElementById('slbAcc').textContent = acc;
    document.getElementById('slbFocus').textContent = Math.round(state.focus) + '%';

    document.getElementById('panelRank').textContent = getRank(state.xp).name;
    const lv = getLevel(state.xp);
    const lb = document.getElementById('panelLevel');
    lb.textContent = lv.label;
    lb.className = 'level-badge ' + lv.cls;

    const ss = document.getElementById('statSessionScore');
    if (ss) ss.textContent = getScore100() + ' / 100';
}
