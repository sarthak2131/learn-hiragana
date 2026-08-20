# ⛩️ Hiragana Mastery — Active-Recall Studio

An ultra-modern, responsive, pure client-side **Japanese Hiragana learning and active-recall studio** designed to help anyone memorize, recognize, read, write, and pronounce all 46 Japanese Hiragana characters effortlessly.

![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=for-the-badge&logo=tailwindcss)
![PWA Ready](https://img.shields.io/badge/PWA-Ready-10B981?style=for-the-badge)

---

## 🌟 Key Highlights & Features

- **⚡ 100% Client-Side**: No backend, no server, no database, no authentication required.
- **💾 LocalStorage Persistence**: Stores user progress, SRS mastery levels, daily streaks, and settings locally on your browser.
- **🎮 10 Interactive Practice Game Modes**:
  1. **📖 Read It** (`Character → Sound`) — Recognise character and pick correct sound.
  2. **🧩 Build It** (`Sound → Character`) — Hear/see sound and select correct Hiragana.
  3. **📻 Audio Sequence Memory** (`Simon Says Recall`) — Listen to 3, 5, 8 or 10 spoken sounds sequentially & tap tiles in exact order.
  4. **🎧 Ear Training** (`Audio Blind Test`) — Prompt is 100% hidden; listen to spoken audio and pick the character.
  5. **🧠 Pure Recall** (`True Recall`) — Type character/sound from memory with auto-clearing text boxes & detailed error feedback.
  6. **✍️ Write It** (`Handwriting Canvas`) — Draw Hiragana on an interactive HTML5 canvas with customizable countdown timers (5s, 10s, 15s, 20s).
  7. **🧩 Match Up** (`Matching Game`) — Interactive 2-deck matching game with line animations and confetti rewards.
  8. **🔍 Spot the Difference** (`Similar Chars`) — Learn commonly confused pairs (`さ` vs `き`, `ぬ` vs `め`, `る` vs `ろ`).
  9. **⚡ Speed Recall** (`Fast Recognition`) — Fast-paced timer challenge with adjustable speed up to 3x.
  10. **🌟 Mixed Challenge** (`Complete Mastery`) — Unpredictable randomized mix of all game types.
- **🔤 Real-Time Authentic Japanese Font Switching**:
  - **Kyōkasho (教科書体)** — Official Japanese Textbook style for handwriting guidance.
  - **Minchō (明朝体)** — Elegant Serif style for printed media recognition.
  - **Gothic (ゴシック体)** — Clean Sans-Serif style common in modern UIs.
- **🔊 Hardware-Accelerated Native Japanese Audio Engine**:
  - Zero-lag, zero-stutter native Japanese speech synthesizer.
  - **Playback Speed Controller** (`0.5x`, `1.0x`, `1.5x`, `2.0x`, `3.0x`).
  - **Play Full Row** button on Hiragana Chart for sequential audio playback (`あ → い → う → え → お`).
- **🌙 Dark Mode & Light Mode**: Instant toggle with system preference auto-detection.
- **📱 PWA & Offline Support**: Progressive Web App ready for installation on mobile and desktop.

---

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS v3 (Custom Dark Mode & Responsive Layouts)
- **Icons**: Lucide React
- **Canvas / Drawing**: Native HTML5 Canvas API
- **Audio Engine**: Web Speech API (`SpeechSynthesisUtterance` `ja-JP`) & Fallback Japanese Stream
- **Confetti Effects**: Canvas Confetti

---

## 📁 Project Structure

```text
hiragana/
├── public/                # Static assets & PWA manifest icons
├── src/
│   ├── components/        # UI Components
│   │   ├── chart/         # Character Detail & Chart Modals
│   │   ├── common/        # Header, MobileNav, FontSelector, SettingsModal
│   │   └── practice/      # 10 Interactive Game Components
│   ├── data/              # Hiragana Dataset, Stroke Data & Vocabulary
│   ├── hooks/             # Custom React Hooks (Audio, Font, Theme, SRS Progress)
│   ├── pages/             # Main Application Pages (Home, Practice, Chart, Dashboard, Writing)
│   ├── styles/            # Tailwind Directives & Global Styles
│   ├── types/             # TypeScript Type Definitions
│   └── App.tsx            # Root Application Component
├── index.html             # Entry HTML Document
├── package.json           # Dependencies & Scripts
├── tailwind.config.js     # Tailwind CSS Configuration
└── vite.config.ts         # Vite Configuration & PWA Plugin
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have **Node.js (v18+)** installed.

### Installation

1. Clone or download the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/hiragana-mastery.git
   ```

2. Navigate into the project folder:
   ```bash
   cd hiragana-mastery
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Development Server

Start the local development server:
```bash
npm run dev
```
Open your browser and navigate to **`http://localhost:5173/`**.

### Production Build

To build the static production bundle:
```bash
npm run build
```
The compiled production assets will be generated in the **`dist/`** directory.

---

## 🌐 Deploying To Cloud (100% Free)

Since this app is a pure static single-page application (SPA), it can be hosted for free on any web host:

### Deploy to Vercel
```bash
npx vercel
```

### Deploy to Netlify Drop
1. Run `npm run build` to generate the `dist` folder.
2. Drag and drop the `dist` folder into [app.netlify.com/drop](https://app.netlify.com/drop).

---

## 📄 License

This project is open-source and available under the **MIT License**.
