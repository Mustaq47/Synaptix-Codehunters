const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3030;

app.use(cors());
app.use(express.json());

// Serve static frontend files from /client
app.use(express.static(path.join(__dirname, '../client')));

// ── Config ────────────────────────────────────────────────────
const CODING_SUBJECTS = ['java', 'c', 'python'];

function buildPrompt(lang, topic, diff) {
    const diffMap = {
        easy: 'basic beginner-level',
        medium: 'intermediate-level',
        hard: 'advanced-level',
        expert: 'expert / tricky edge-case',
    };
    const isCoding = CODING_SUBJECTS.includes(lang.toLowerCase());
    const persona = isCoding
        ? `programming quiz generator for ${lang.toUpperCase()} programming`
        : `educational quiz generator for the subject of ${lang.toUpperCase()}`;

    return `You are an ${persona}.
Generate exactly ONE ${diffMap[diff] || 'intermediate'} multiple-choice question about the topic: "${topic}".

Requirements:
- The question must be clear, accurate, and exam-style.
- Provide EXACTLY 4 options labeled A, B, C, D.
- The correct answer must be one of the 4 options.
- Do NOT include numbering or letters in the option text itself.

Respond ONLY with a valid JSON object in this exact format (no markdown, no extra text):
{
  "q": "Question text here?",
  "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
  "ans": 1,
  "topic": "${topic}",
  "ai": true
}
Where "ans" is the 0-based index of the correct option.`;
}

// ── Provider 1: Groq (Llama 3.3 70B) ─────────────────────────
async function callGroq(promptText) {
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) throw new Error('No GROQ_API_KEY set');

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: promptText }],
            temperature: 0.7,
            max_tokens: 600,
        }),
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Groq Error ${response.status}: ${err}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content?.trim();
    if (!content) throw new Error('Empty Groq response');
    console.log('[AI] Responded via Llama 3.3 (Groq)');
    return content;
}

// ── Provider 2: Gemini Flash ──────────────────────────────────
async function callGemini(promptText) {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) throw new Error('No GEMINI_API_KEY set');

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 600 },
        }),
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Gemini Error ${response.status}: ${err}`);
    }

    const data = await response.json();
    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!content) throw new Error('Empty Gemini response');
    console.log('[AI] Responded via Gemini Flash');
    return content;
}

// ── Smart Waterfall: Groq → Gemini ───────────────────────────
async function callAI(promptText) {
    const errors = [];

    // Try Groq (Llama 3.3) first
    try {
        return await callGroq(promptText);
    } catch (e) {
        console.warn('[AI] Groq failed:', e.message);
        errors.push('Groq: ' + e.message);
    }

    // Fall back to Gemini
    try {
        return await callGemini(promptText);
    } catch (e) {
        console.warn('[AI] Gemini failed:', e.message);
        errors.push('Gemini: ' + e.message);
    }

    throw new Error('All AI providers failed: ' + errors.join(' | '));
}

// ── Secure API Route ───────────────────────────────────────────
app.post('/api/ai', async (req, res) => {
    try {
        const { lang, topic, diff, prompt } = req.body;

        let promptText = '';
        if (prompt) {
            promptText = prompt;
        } else if (lang && topic && diff) {
            promptText = buildPrompt(lang, topic, diff);
        } else {
            return res.status(400).json({ error: 'Missing parameters' });
        }

        let content;
        try {
            content = await callAI(promptText);
        } catch (aiErr) {
            console.warn('[SERVER] AI APIs failed:', aiErr.message);
            // Fallback for explanations
            if (prompt && topic) {
                console.log(`[SERVER] Using predefined explanation fallback for topic: ${topic}`);
                try {
                    const exps = JSON.parse(fs.readFileSync(path.join(__dirname, 'explanations.json'), 'utf8'));
                    content = exps[topic.toLowerCase()] || exps['default'];
                } catch (readErr) {
                    console.error('[SERVER] Failed to read explanations.json:', readErr.message);
                    throw aiErr;
                }
            } else {
                throw aiErr; // Throw for regular question generation
            }
        }

        res.json({ content });

    } catch (err) {
        console.error('[SERVER] AI route error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ── Health check ───────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        providers: {
            groq: !!process.env.GROQ_API_KEY,
            gemini: !!process.env.GEMINI_API_KEY,
        }
    });
});

// Serve index.html for all other routes (SPA fallback)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`[SERVER] Running on http://localhost:${PORT}`);
        console.log(`[AI]    Primary:  Groq (Llama 3.3-70B) — ${process.env.GROQ_API_KEY ? '✅ Key set' : '❌ No key'}`);
        console.log(`[AI]    Fallback: Gemini Flash          — ${process.env.GEMINI_API_KEY ? '✅ Key set' : '❌ No key'}`);
    });
}

module.exports = app;
