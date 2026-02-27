import { state } from './state.js';
import { QB } from './data.js';
import { REVISION_TIPS } from './constants.js';

const modal = document.getElementById('revisionModal');
const titleEl = document.getElementById('rmTopicTitle');
const loadingEl = document.getElementById('rmLoading');
const contentEl = document.getElementById('rmContent');
const explanationEl = document.getElementById('rmExplanation');
const questionsEl = document.getElementById('rmQuestions');

let currentRevisionData = null;

export async function openRevisionModal(topic) {
    modal.classList.add('show');
    titleEl.textContent = `Revise: ${topic}`;
    loadingEl.style.display = 'block';
    contentEl.style.display = 'none';
    explanationEl.innerHTML = '';
    questionsEl.innerHTML = '';

    const diff = state.difficulty || 'medium';
    const lang = state.lang || 'python';

    const prompt = `You are a beginner-friendly expert ${lang} instructor.
The user is struggling with the topic: "${topic}" at ${diff} difficulty.
Provide:
1. A concise, very simple explanation of the topic (max 3 short paragraphs). Use HTML tags like <b> or <code> for formatting.
2. Exactly 5 distinct, high-quality multiple-choice practice questions to test their understanding.

Format the response ONLY as valid JSON (no markdown block fences):
{
  "explanation": "...",
  "questions": [
    {
      "q": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "ans": 0
    }
  ]
}
Where "ans" is the 0-indexed correct option. Do NOT add A, B, C prefixes in the options array.`;

    try {
        const res = await fetch('/api/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });

        if (!res.ok) throw new Error('AI API Error');
        const data = await res.json();
        const content = data?.content || '';

        // Clean JSON formatting
        const jsonStr = content.replace(/^```json?\s*/i, '').replace(/\s*```$/i, '');
        currentRevisionData = JSON.parse(jsonStr);

        renderRevisionData();

    } catch (err) {
        console.warn('[REVISION] AI failed or rate limited, using offline fallback data:', err);

        // Build fallback data
        const fallbackExpl = REVISION_TIPS[topic] || `Review the core concepts and fundamental rules of ${topic} to improve your accuracy.`;

        // Discover questions from the local bank
        const bank = QB[lang]?.[diff] || [];
        let matchingQs = bank.filter(q => q.topic === topic);

        // Padding with general questions if we lack exact matches offline
        if (matchingQs.length < 5) {
            const others = bank.filter(q => q.topic !== topic).sort(() => 0.5 - Math.random());
            matchingQs = [...matchingQs, ...others].slice(0, 5);
        }

        if (matchingQs.length === 0) {
            loadingEl.textContent = '❌ Failed to load revision. No offline data available.';
            loadingEl.style.color = 'var(--red)';
            return;
        }

        currentRevisionData = {
            explanation: `<p><i>(Offline Fallback Active)</i><br><br><b>${topic}</b>: ${fallbackExpl}</p>`,
            questions: matchingQs.map(q => ({
                q: q.q,
                options: q.options,
                ans: q.ans
            }))
        };

        renderRevisionData();
    }
}

export function closeRevisionModal() {
    modal.classList.remove('show');
    currentRevisionData = null;
    loadingEl.textContent = '⚙ Generating explanation & questions…';
    loadingEl.style.color = 'var(--accent3)';
}

function renderRevisionData() {
    loadingEl.style.display = 'none';
    contentEl.style.display = 'block';

    explanationEl.innerHTML = currentRevisionData.explanation;

    questionsEl.innerHTML = '';
    currentRevisionData.questions.forEach((q, qIndex) => {
        const qItem = document.createElement('div');
        qItem.className = 'rm-question-item';

        const qText = document.createElement('div');
        qText.className = 'rm-q-text';
        qText.innerHTML = `${qIndex + 1}. ${q.q}`;
        qItem.appendChild(qText);

        q.options.forEach((opt, optIndex) => {
            const btn = document.createElement('button');
            btn.className = 'rm-opt';
            btn.textContent = opt;
            btn.onclick = () => {
                // Disable all options in this question
                const siblings = qItem.querySelectorAll('.rm-opt');
                siblings.forEach(sib => sib.disabled = true);

                if (optIndex === q.ans) {
                    btn.classList.add('correct');
                } else {
                    btn.classList.add('wrong');
                    siblings[q.ans].classList.add('correct');
                }
            };
            qItem.appendChild(btn);
        });

        questionsEl.appendChild(qItem);
    });
}

// Global exposure for HTML buttons
window.closeRevisionModal = closeRevisionModal;
