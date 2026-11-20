# Digital Speech Therapy (Duospeech)

An AI-powered speech practice platform . Users practice pronunciation and fluency, record their voice, receive real AI-assisted feedback, and advance through interactive skill paths with streaks, leagues, gems, and hearts.

## Architecture

React (frontend) -> Node.js/Express (backend) -> MongoDB  
Node.js/Express (backend) -> Python/FastAPI (AI service) -> faster-whisper (ASR) + Gemini API (feedback)

The frontend never calls the AI service directly - all requests go through
the Node backend, which is the single authenticated entry point.

## Project structure

```
frontend/     React + Vite + Tailwind CSS + Lucide Icons + Canvas-Confetti + Web Audio Synthesizer
backend/      Node.js + Express + MongoDB (Mongoose) + Gamification Engine
ai-service/   Python + FastAPI + faster-whisper + Gemini API
```

## Setup

### Prerequisites
- Node.js 18+
- Python 3.10+
- MongoDB running locally (or a MongoDB Atlas connection string)

### 1. Backend

```bash
cd backend
npm install
copy .env.example .env    # then fill in MONGO_URI, JWT_SECRET, etc.
node src/utils/seedExercises.js   # populate sample exercises across units
node src/utils/makeAdmin.js you@example.com   # optional: make a registered user an admin
npm run dev
```

Check it's running: http://localhost:5001/api/health

### 2. AI service

```bash
cd ai-service
python -m venv venv
venv\Scripts\activate          # Windows; use "source venv/bin/activate" on Mac/Linux
pip install -r requirements.txt
copy .env.example .env         # then set GEMINI_API_KEY
uvicorn app.main:app --reload --port 8000
```

Check it's running: http://localhost:8000/ai/health

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

---

## Duolingo Gamification & Themed Features

- **The Learning Path ("The Snake"):**
  - Vertically winding skill progression tree with organic sine-wave stepping stones.
  - Organized into distinct thematic units:
    - *Unit 1: Speech Foundations* (Warm-ups, open vowels, greetings)
    - *Unit 2: Daily Conversation & Rhythm* (Social phrasing, questions, natural cadence)
    - *Unit 3: Articulation Masters* (Tongue twisters, tricky consonants, precision)
    - *Unit 4: Storytelling & Fluency Flow* (Extended paragraphs, expressive emphasis)
  - Unit speech therapy guidebooks containing clinical articulation and diaphragmatic breathing tips.
  - Interactive milestone gift chests yielding gem rewards.

- **Echo the Owl Mascot:**
  - Expressive, animated SVG speech mascot with multiple moods (idle, speaking, listening with headphones, cheering, encouraging, thinking) and speech bubbles.

- **Interactive Duolingo Lesson Experience:**
  - Top header with exit confirmation modal, animated green progress bar, and real-time hearts.
  - Text-to-Speech (TTS) listening buttons (normal speed + slow turtle 🐢 speed for phoneme study).
  - Massive circular microphone button with live waveform audio animations and recording timer.
  - Sliding bottom evaluation drawer:
    - Success (>= 70%): Green slide-up bar, ascending chime, celebratory mascot, and word diff review.
    - Needs Practice (< 70%): Red slide-up bar, gentle reminder bonk, -1 heart animation, and supportive feedback.

- ** Gamification Engine:**
  - **XP & Levels:** Earn XP per speech attempt with accuracy bonuses for 80%+ and 90%+.
  - **Daily Streaks:** Streak tracker (🔥) to encourage daily habits with streak freeze protection.
  - **Hearts (Health):** 5-heart system with refill capabilities via practice or gem purchases.
  - **Lingots / Gems:** In-app currency (💎) earned from exercises, quests, and milestone chests.
  - **Leaderboards / Leagues:** Weekly league table (Bronze to Diamond) featuring promotion zones and friendly competition.
  - **Daily Quests:** 3 daily challenges with progress tracking and gem claim rewards.
  - ** Shop:** In-game store for Heart Refills, Streak Freezes, Double XP Boosts, and trophies.

- **Audio & Visual Polish:**
  - **Web Audio Sound Effects:** Zero-dependency, real-time audio synthesizer reproducing Duolingo's signature rising success chime, soft error bonk, tactile button pops, chest unlocks, and fanfare. Includes global mute/unmute toggle.
  - **Confetti Celebrations:** Rich celebratory confetti showers upon completing exercises, unlocking chests, or achieving quests.
  - **Tactile 3D Buttons:** Custom Duolingo-style 3D buttons (`border-b-4 active:border-b-0 active:translate-y-1`) in iconic Duolingo Green, Blue, Red, Yellow, and Purple.

- **Speech AI Core:**
  - Real faster-whisper transcription with language hints.
  - Real Gemini API scoring and coaching feedback.
  - Real, deterministic word-level diff accuracy (difflib) highlighting correct, different, and missed words.

## Development phases

- Phase 0 - Project setup, health checks (done)
- Phase 1 - Auth + core loop: record -> real ASR -> real LLM feedback (done)
- Phase 3 - Progress tracking: history page, stats, trend chart (done)
- Phase 4 - UI polish, error handling, validation (done)
- Phase 5 - Stretch features: categories, difficulty filtering, admin panel (done)
- Phase 6 - Multi-language support, word-level accuracy feedback (done)
- Phase 7 - Gamification: learning path snake, mascot, Web Audio effects, XP, streaks, hearts, gems, quests, leagues, shop (done)
