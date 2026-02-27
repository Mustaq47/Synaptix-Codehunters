const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3030;

app.use(cors());
app.use(express.json());

// Serve static frontend files from /client
app.use(express.static(path.join(__dirname, '../client')));

// OpenAI Prompt Builder
function buildPrompt(lang, topic, diff) {
    const diffMap = {
        easy: 'basic beginner-level',
        medium: 'intermediate-level',
        hard: 'advanced-level',
        expert: 'expert / tricky edge-case',
    };
    return `You are a programming quiz generator for ${lang.toUpperCase()} programming.
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

// ── Secure API Route ───────────────────────────────────────────
app.post('/api/ai', async (req, res) => {
    try {
        const { lang, topic, diff, prompt } = req.body;

        // If a direct prompt is provided (e.g., for simple explanations)
        let messages = [];
        if (prompt) {
            messages = [{ role: 'user', content: prompt }];
        } else if (lang && topic && diff) {
            messages = [{ role: 'user', content: buildPrompt(lang, topic, diff) }];
        } else {
            return res.status(400).json({ error: 'Missing parameters' });
        }

        const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: messages,
                temperature: 0.7,
                max_tokens: 400,
            }),
        });

        if (!openaiRes.ok) {
            const errBody = await openaiRes.text();
            console.warn('[AI] OpenAI returned', openaiRes.status, errBody);
            return res.status(openaiRes.status).json({ error: 'OpenAI API Error' });
        }

        const data = await openaiRes.json();
        const content = data?.choices?.[0]?.message?.content?.trim();

        res.json({ content });

    } catch (err) {
        console.error('[SERVER] AI route error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Serve index.html for all other routes (SPA fallback)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.listen(PORT, () => {
    console.log(`[SERVER] Running on http://localhost:${PORT}`);
});
