/**
 * NEXUS ASSESS — Firebase Module
 * Initializes Firebase, handles anonymous auth,
 * and provides Firestore CRUD for profile & history.
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import {
    getFirestore, doc, getDoc, setDoc, collection, getDocs,
    query, orderBy, limit,
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import {
    getAuth, signInAnonymously, onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';

// ── Firebase config ──────────────────────────────────────────
const firebaseConfig = {
    apiKey: 'AIzaSyAaEhgzK4ToAt-mWE2IMtXHVnBozmtlwzU',
    authDomain: 'edutech47-76f0a.firebaseapp.com',
    projectId: 'edutech47-76f0a',
    storageBucket: 'edutech47-76f0a.firebasestorage.app',
    messagingSenderId: '781026145452',
    appId: '1:781026145452:web:3b35e48597297ee8881b09',
    measurementId: 'G-HYW3RYFKV6',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ── Auth state ───────────────────────────────────────────────
let currentUid = null;

/** Returns a Promise that resolves once anonymous auth is ready. */
export function waitForAuth() {
    return new Promise((resolve) => {
        const unsub = onAuthStateChanged(auth, (user) => {
            unsub();
            if (user) {
                currentUid = user.uid;
                resolve(user.uid);
            } else {
                signInAnonymously(auth)
                    .then(({ user }) => { currentUid = user.uid; resolve(user.uid); })
                    .catch(() => { currentUid = 'local-' + Date.now(); resolve(currentUid); });
            }
        });
    });
}

export function getCurrentUid() { return currentUid; }

// ── Profile CRUD ─────────────────────────────────────────────
export async function loadProfile() {
    if (!currentUid) return null;
    try {
        const snap = await getDoc(doc(db, 'users', currentUid, 'data', 'profile'));
        return snap.exists() ? snap.data() : null;
    } catch { return null; }
}

export async function saveProfile(data) {
    if (!currentUid) return;
    try {
        await setDoc(doc(db, 'users', currentUid, 'data', 'profile'), data);
    } catch (e) { console.warn('[Firebase] saveProfile failed:', e); }
}

export async function deleteProfile() {
    if (!currentUid) return;
    try {
        await setDoc(doc(db, 'users', currentUid, 'data', 'profile'), { _deleted: true });
    } catch (e) { console.warn('[Firebase] deleteProfile failed:', e); }
}

// ── History CRUD ─────────────────────────────────────────────
const HISTORY_COL = (uid) => collection(db, 'users', uid, 'history');

export async function loadHistory() {
    if (!currentUid) return [];
    try {
        const q = query(HISTORY_COL(currentUid), orderBy('date', 'desc'), limit(10));
        const snap = await getDocs(q);
        return snap.docs.map(d => d.data());
    } catch { return []; }
}

export async function saveHistory(entries) {
    if (!currentUid) return;
    // Store as single doc for simplicity (max 10 items)
    try {
        await setDoc(doc(db, 'users', currentUid, 'data', 'history'), { entries });
    } catch (e) { console.warn('[Firebase] saveHistory failed:', e); }
}

export async function loadHistoryCompat() {
    // Compat: try both doc-based and collection-based
    if (!currentUid) return [];
    try {
        const snap = await getDoc(doc(db, 'users', currentUid, 'data', 'history'));
        if (snap.exists() && snap.data().entries) return snap.data().entries;
    } catch { }
    return loadHistory();
}

export async function deleteHistory() {
    if (!currentUid) return;
    try {
        await setDoc(doc(db, 'users', currentUid, 'data', 'history'), { entries: [] });
    } catch { }
}
