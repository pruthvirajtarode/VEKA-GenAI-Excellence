# VEKA GenAI Excellence — Learning System

This project is a premium, offline-first corporate learning operating system designed for VEKA India, delivered by NxtWave.

It transforms standard presentation slides into an interactive, gamified, and highly practical training environment consisting of 4 products.

## The 4 Products

1. **Interactive Training Deck (`/deck/index.html`)**
   The main 8-hour presentation. Features a live leaderboard, a hidden trainer mode (Shift+T), a floating timer widget, keyboard/swipe navigation, and interactive prompt battles.

2. **Participant Workbook (`/workbook/index.html`)**
   A digital companion that participants fill out during the day. It auto-saves to their browser (`localStorage`), provides form fields for all 8 activities, and includes a print-optimized layout for PDF generation at the end of the day.

3. **Prompt Library (`/prompt-library/index.html`)**
   A searchable, filterable repository of 50 pre-tested VEKA enterprise prompts across 7 categories. It includes a "Build Your Own" template generator and allows users to favorite prompts.

4. **Trainer Guide (`/trainer/guide.html`)**
   A printable facilitator guide with hour-by-hour pacing, common failure modes, rescue lines, and keyboard shortcuts.

## Offline-First Guarantee

This entire suite is built with **zero external dependencies**.

- **No CDNs:** There are no calls to external servers for fonts, icons, or JavaScript libraries (like React or Chart.js).
- **Vanilla Tech:** Built entirely with plain HTML, CSS, and JS.
- **Local Persistence:** The Leaderboard, Workbook fields, and Prompt Library favorites all save locally to the browser's `localStorage`. They will persist even if the browser is closed, provided the user does not clear their cache.
- **To Use:** Simply open the root `index.html` file in any modern web browser. It does not require a local web server (no `npm start` needed).

## Key Keyboard Shortcuts (Deck)

- `Right Arrow` / `Space` / `Click/Swipe`: Next Slide
- `Left Arrow`: Previous Slide
- `F`: Fullscreen mode
- `G`: Agenda / Jump Map
- `L`: Live Leaderboard
- `T`: Activity Timer
- `Shift + T`: Toggle secret Trainer Mode (reveals facilitator notes at the bottom of the screen)

## Synthetic Data Pack

The training relies on safe, synthetic data to prevent the use of real corporate records in public AI tools. The data files are located in `/data/synthetic/`:
- `vendor-ledger.csv`: Financial reconciliation exercise (contains deliberate errors).
- `maintenance-log.csv`: Maintenance pattern spotting exercise (contains a hidden bearing failure pattern).
- `shift-notes.txt`: Messy shift handover notes for the SOP builder.
- `weak-prompt.txt`: Hour 2 rescue exercise.
- `sales-buyer-profiles.json`: Context for the sales personalization exercise.

## Troubleshooting

- **Leaderboard scores are missing:** Ensure the trainer is using the exact same browser/device they used previously. Scores are saved locally to that specific browser.
- **Timer doesn't show:** Press `T` to toggle the timer visibility.
- **Fonts look different:** The system uses a fallback stack (`system-ui`, `sans-serif`) if the premium fonts (`Space Grotesk`, `Inter`, `JetBrains Mono`) are not installed locally. The design will gracefully adapt to system fonts without breaking.
