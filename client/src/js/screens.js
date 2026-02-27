/**
 * NEXUS ASSESS — Screens Module
 * Manages screen transitions and the language/topic selection logic.
 */

import { LANG_META } from './constants.js';
import { loadProfile } from './storage.js';
import { updateChip, buildCreateScreen } from './profile.js';
import { QB } from './data.js';

// ── Currently selected language ──────────────────────────────

let currentLang = 'java';
let selectedTopics = [];

export function getCurrentLang() { return currentLang; }
export function getSelectedTopics() { return selectedTopics; }

// ──────────────────────────────────────────────────────────────
//  SCREEN HELPERS
// ──────────────────────────────────────────────────────────────

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

export function showCreateScreen() {
    buildCreateScreen();
    showScreen('screenCreate');
}

// ──────────────────────────────────────────────────────────────
//  LANGUAGE SELECT SCREEN
// ──────────────────────────────────────────────────────────────

export function showLangScreen(profile, isReturn = false) {
    if (profile) updateChip(profile);

    const sub = document.getElementById('langSubtitle');
    if (sub && isReturn) sub.textContent = `◆ Welcome back, ${profile?.name || 'Agent'} ◆`;

    // Clear previous selections
    Object.keys(LANG_META).forEach(lang => {
        const el = document.getElementById('lang' + lang.charAt(0).toUpperCase() + lang.slice(1));
        const check = document.getElementById('check' + lang.charAt(0).toUpperCase() + lang.slice(1));
        if (el) el.classList.remove('selected');
        if (check) { check.textContent = ''; check.style.background = ''; }
    });

    currentLang = 'java';
    selectedTopics = [];
    selectLang('java'); // default selection
    showScreen('screenLang');
}

export function selectLang(lang) {
    currentLang = lang;

    // Deselect all
    Object.keys(LANG_META).forEach(l => {
        const el = document.getElementById('lang' + l.charAt(0).toUpperCase() + l.slice(1));
        const check = document.getElementById('check' + l.charAt(0).toUpperCase() + l.slice(1));
        if (el) el.classList.remove('selected');
        if (check) { check.textContent = ''; }
    });

    // Select chosen
    const lKey = lang.charAt(0).toUpperCase() + lang.slice(1);
    const el = document.getElementById('lang' + lKey);
    const check = document.getElementById('check' + lKey);
    if (el) el.classList.add('selected');
    if (check) check.textContent = '✓';

    // Update pill
    const pill = document.getElementById('langPill');
    if (pill) {
        const meta = LANG_META[lang];
        pill.textContent = meta.icon + ' ' + meta.label;
        pill.className = 'lang-pill ' + meta.cls;
    }

    buildTopicChips(lang);
}

function buildTopicChips(lang) {
    const section = document.getElementById('topicSelectSection');
    if (!section) return;

    // Collect unique topics for this language
    const langBank = QB[lang];
    if (!langBank) return;
    const topicSet = new Set();
    Object.values(langBank).flat().forEach(q => topicSet.add(q.topic));
    const allTopics = [...topicSet];

    selectedTopics = [...allTopics]; // all selected by default

    const wrap = document.getElementById('topicChipsWrap');
    if (!wrap) return;
    wrap.innerHTML = '';

    allTopics.forEach(topic => {
        const chip = document.createElement('span');
        chip.className = 'topic-chip active';
        chip.textContent = topic;
        chip.dataset.topic = topic;
        chip.onclick = () => toggleTopic(topic, chip);
        wrap.appendChild(chip);
    });
}

function toggleTopic(topic, chip) {
    const idx = selectedTopics.indexOf(topic);
    if (idx === -1) {
        selectedTopics.push(topic);
        chip.classList.add('active');
    } else {
        // Don't allow deselecting all topics
        if (selectedTopics.length <= 1) return;
        selectedTopics.splice(idx, 1);
        chip.classList.remove('active');
    }
}

// ──────────────────────────────────────────────────────────────
//  START GAME
// ──────────────────────────────────────────────────────────────

export async function startGame() {
    const p = await loadProfile();
    if (!p) { showCreateScreen(); return; }
    updateChip(p);

    if (!currentLang) { selectLang('java'); }

    showScreen('screenGame');

    // Init left sidebar with profile identity
    const { initLeftSidebar } = await import('./ui.js');
    initLeftSidebar(p);

    const { initGame } = await import('./game.js');
    await initGame(currentLang, selectedTopics);
}

/** Allow changing language mid-session (from top-bar pill). */
export async function goChangeLang() {
    const { stopTimer } = await import('./game.js');
    stopTimer();
    const p = await loadProfile();
    showLangScreen(p);
}
