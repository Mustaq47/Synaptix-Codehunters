/**
 * NEXUS ASSESS — AI Question Generator
 * Uses OpenAI Chat API to generate fresh MCQ questions on demand.
 * Falls back to local question bank on any error.
 */

const API_URL = '/api/ai';
const CACHE = new Map(); // sessionStorage-backed cache

// ── In-memory session cache ──────────────────────────────────
function cacheKey(lang, topic, diff) { return `${lang}::${topic}::${diff}`; }

function getCached(lang, topic, diff) {
    const k = cacheKey(lang, topic, diff);
    const raw = sessionStorage.getItem('nexus_ai_' + k);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
}

function setCache(lang, topic, diff, q) {
    const k = cacheKey(lang, topic, diff);
    try { sessionStorage.setItem('nexus_ai_' + k, JSON.stringify(q)); } catch { }
}

// ── Main export ──────────────────────────────────────────────
/**
 * Generate a question via backend API for the given lang/topic/difficulty.
 * Returns a question object compatible with the game engine, or null on failure.
 */
export async function generateQuestion(lang, topic, diff) {
    // Return cached version if available
    const cached = getCached(lang, topic, diff);
    if (cached) return cached;

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout

        const res = await fetch(API_URL, {
            method: 'POST',
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ lang, topic, diff }),
        });
        clearTimeout(timeout);

        if (!res.ok) {
            console.warn('[AI] Backend returned', res.status);
            return null;
        }

        const data = await res.json();
        const content = data?.content;
        if (!content) return null;

        // Strip markdown code fences if present
        const jsonStr = content.replace(/^```json?\s*/i, '').replace(/\s*```$/i, '');
        const q = JSON.parse(jsonStr);

        // Validate structure
        if (
            typeof q.q !== 'string' ||
            !Array.isArray(q.options) || q.options.length !== 4 ||
            typeof q.ans !== 'number'
        ) return null;

        q.topic = q.topic || topic;
        q.ai = true;
        setCache(lang, topic, diff, q);
        return q;

    } catch (err) {
        if (err.name !== 'AbortError') {
            console.warn('[AI] Question generation failed:', err.message);
        }
        return null;
    }
}

/** Whether AI generation is enabled. Can be toggled at runtime. */
export let AI_ENABLED = true;
export function setAIEnabled(v) { AI_ENABLED = v; }
