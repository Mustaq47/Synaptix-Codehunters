/**
 * NEXUS ASSESS — Storage Module (Firebase-backed)
 * Re-exports all persistence functions from firebase.js so that
 * all other modules continue to import from 'storage.js' without change.
 */

export {
    loadProfile,
    saveProfile,
    deleteProfile,
    loadHistory,
    saveHistory,
    deleteHistory,
    loadHistoryCompat,
    waitForAuth,
    getCurrentUid,
} from './firebase.js';
