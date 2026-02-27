# NEXUS ASSESS — AI Adaptive Assessment

> **Gamified adaptive programming quiz engine for Java, C & Python**

---

## 🚀 Features

| Feature | Details |
|---|---|
| **Adaptive Difficulty** | 4 levels per topic (Easy → Medium → Hard → Expert) that unlock progressively |
| **Question Banks** | 10+ questions per difficulty per language (Java, C, Python) |
| **Gamification** | XP, streak multipliers, ranks (Bronze → Master), focus meter |
| **Profile System** | Persistent profile with career stats, session history, and level badges |
| **Topic Selection** | Choose specific topics to practice before starting |
| **Competency Profile** | Visual topic-by-topic performance bars on completion |
| **Keyboard Shortcuts** | `A/B/C/D` select · `Enter` submit · `Space/→` next · `Esc` close panel |
| **PWA** | Installable as a desktop/mobile app — works fully offline |
| **Revision Assignments** | Critical failure triggers personalized weak-topic review tasks |
| **Live Profile Panel** | Real-time score/streak/focus stats while playing |

---

## 📁 Project Structure

```
Synaptix/
├── index.html              # Entry point (clean HTML shell)
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker (offline cache)
├── README.md
└── src/
    ├── css/                # 10 CSS modules
    │   ├── variables.css   # Design tokens
    │   ├── base.css        # Reset, body, shared animations
    │   ├── screens.css     # Screen show/hide
    │   ├── create.css      # Profile creation
    │   ├── lang-select.css # Language & topic selection
    │   ├── game-ui.css     # TopBar, StatusBar, Timer, ScorePanel
    │   ├── questions.css   # Question card, options, feedback
    │   ├── profile.css     # Profile panel & history
    │   ├── completion.css  # Results screen
    │   ├── overlays.css    # Restart overlay & assignment card
    │   └── responsive.css  # All media queries
    └── js/                 # 9 ES Modules
        ├── app.js          # Boot + keyboard shortcuts
        ├── constants.js    # All config (ranks, XP, tips)
        ├── data.js         # Question banks (QB)
        ├── storage.js      # IndexedDB + localStorage fallback
        ├── state.js        # Game state + pure helpers
        ├── profile.js      # Profile CRUD & panel
        ├── screens.js      # Screen transitions
        ├── game.js         # Core game engine
        └── ui.js           # DOM update functions
```

---

## 🎮 Keyboard Shortcuts

| Key | Action |
|---|---|
| `A` / `1` | Select option A |
| `B` / `2` | Select option B |
| `C` / `3` | Select option C |
| `D` / `4` | Select option D |
| `Enter` | Submit answer (or go to next question if already answered) |
| `Space` / `→` | Next question (after answering) |
| `Escape` | Close profile panel |

---

## ▶ Running Locally

Open `index.html` directly in any modern browser (Chrome, Edge, Firefox):

```
# Option 1: Just open the file
Double-click index.html

# Option 2: Serve with npx (enables PWA install + offline)
npx serve .
# Then open http://localhost:3000
```

> **Note:** ES Modules require a web server for full functionality. Use `npx serve .` or VS Code Live Server for the best experience.

---

## 🏆 Rank System

| Rank | XP Required |
|---|---|
| 🥉 Bronze | 0 |
| 🥈 Silver | 200 |
| 🥇 Gold | 500 |
| 💎 Platinum | 800 |
| 👑 Master | 1200+ |

---

## 🧩 Adding More Questions

Edit `src/js/data.js`. Each question follows this schema:

```js
{
  q:       "Question text here?",
  options: ["Option A", "Option B", "Option C", "Option D"],
  ans:     1,          // Index of correct option (0-based)
  topic:   "OOP",      // Matches REVISION_TIPS key in constants.js
  boss:    true,       // Optional: marks as boss question (expert only)
}
```

Add to `QB.java.hard`, `QB.c.easy`, `QB.python.medium`, etc.

---

## 📦 Tech Stack

- **HTML5** — Semantic structure
- **CSS3** — Custom Properties, Grid, Flexbox, animations
- **Vanilla ES Modules** — Zero dependencies, zero build step
- **IndexedDB** — Persistent storage with localStorage fallback
- **Service Worker** — Full offline PWA support

---

*Built with ❤️ by the Synaptix team — CodeHunters 2026*
