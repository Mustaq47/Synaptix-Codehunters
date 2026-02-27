/**
 * NEXUS ASSESS — Application Boot Entry Point
 * Bootstraps Firebase auth, wires all event handlers, keyboard shortcuts.
 */

import { buildCreateScreen, createProfile, openProfile, closeProfile, resetProfile } from './profile.js';
import { showCreateScreen, showLangScreen, selectLang, startGame, goChangeLang } from './screens.js';
import { waitForAuth, loadProfile } from './storage.js';
import { submitAnswer, nextQuestion, forceRestart, selectOption } from './game.js';
import { getLevel } from './state.js';

// Expose getLevel for ui.js to use via window._stateHelpers
window._stateHelpers = { getLevel };

// ── Keyboard shortcuts ───────────────────────────────────────
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    const gameScreen = document.getElementById('screenGame');
    if (!gameScreen?.classList.contains('active')) return;
    if (document.getElementById('gameArea').style.display === 'none') return;
    const hadAnswer = document.getElementById('nextBtn')?.classList.contains('show');

    switch (e.key.toUpperCase()) {
        case 'A': case '1': { const b = document.querySelector('.option-btn[data-idx="0"]'); if (b && !b.disabled) selectOption(0, b); break; }
        case 'B': case '2': { const b = document.querySelector('.option-btn[data-idx="1"]'); if (b && !b.disabled) selectOption(1, b); break; }
        case 'C': case '3': { const b = document.querySelector('.option-btn[data-idx="2"]'); if (b && !b.disabled) selectOption(2, b); break; }
        case 'D': case '4': { const b = document.querySelector('.option-btn[data-idx="3"]'); if (b && !b.disabled) selectOption(3, b); break; }
        case 'ENTER': { hadAnswer ? nextQuestion() : submitAnswer(); e.preventDefault(); break; }
        case ' ': case 'ARROWRIGHT': { if (hadAnswer) { nextQuestion(); e.preventDefault(); } break; }
        case 'ESCAPE': { const p = document.getElementById('profilePanel'); if (p?.classList.contains('open')) closeProfile(); break; }
    }
});

// ── Expose to HTML onclick= handlers ────────────────────────
window.createProfile = createProfile;
window.selectLang = selectLang;
window.startGame = startGame;
window.submitAnswer = submitAnswer;
window.nextQuestion = nextQuestion;
window.openProfile = openProfile;
window.closeProfile = closeProfile;
window.resetProfile = resetProfile;
window.goChangeLang = goChangeLang;
window.forceRestart = forceRestart;

// ── Boot ─────────────────────────────────────────────────────
(async function boot() {
    buildCreateScreen();

    // Show loading indicator while Firebase auth resolves
    document.body.insertAdjacentHTML('beforeend',
        '<div id="bootLoader" style="position:fixed;inset:0;background:#05060f;display:flex;align-items:center;justify-content:center;z-index:999;font-family:\'Share Tech Mono\',monospace;color:#00d4ff;letter-spacing:4px;font-size:.85rem;">⚡ CONNECTING…</div>'
    );

    try {
        await waitForAuth();
        console.info('[NEXUS] Firebase authenticated.');
    } catch (err) {
        console.warn('[NEXUS] Auth failed, continuing offline:', err);
    }

    document.getElementById('bootLoader')?.remove();

    const profile = await loadProfile();
    if (profile && !profile._deleted) {
        showLangScreen(profile, true);
    } else {
        showCreateScreen();
    }

    // Register Service Worker
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('/sw.js');
            console.info('[NEXUS] Service Worker registered.');
        } catch (err) {
            console.warn('[NEXUS] SW registration failed:', err);
        }
    }
})();
