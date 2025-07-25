# Snake Game Frontend - Developer & User Guide

## Overview

The Snake Game Frontend is a modern, lightweight React application that delivers the classic Snake gaming experience in the browser. This application demonstrates clean architecture, straightforward gameplay logic, and a responsive design suitable for both desktop and mobile devices.

This documentation targets both end users and developers maintaining or extending the project.

---

## Table of Contents

1. [Project Architecture](#project-architecture)
    - [High-Level Diagram](#high-level-diagram)
2. [Code Structure](#code-structure)
3. [Core Features](#core-features)
4. [Dependencies](#dependencies)
5. [How to Run](#how-to-run)
6. [Game Usage Instructions](#game-usage-instructions)
7. [Customization & Theming](#customization--theming)
8. [Testing](#testing)
9. [Development Notes](#development-notes)

---

## Project Architecture

The application is a **single-page React app** implemented with functional components and React Hooks. It manages all game state client-side, with no backend dependencies.

- **Entry Point:** `src/index.js` renders the root `<App />` component.
- **Game Logic, UI, and State Handling:** All managed within `src/App.js` using function components and multiple `useState` and `useEffect` hooks.
- **Styling:** Managed via vanilla CSS in `src/App.css` and `src/index.css`.
- **No external UI frameworks** are used – the UI uses custom CSS variables and classes for the "Snake" brand.

### High-Level Diagram

```mermaid
flowchart TD
    A[User Browser] --> B[React App (index.js)]
    B --> C[App.js - Main Game Component]
    C --> D[Game State & Logic]
    C --> E[Game Board Render]
    C --> F[UI Controls & Score Display]
    D -.->|CSS Modules| G[App.css & index.css]
```

---

## Code Structure

```
snake_game_frontend/
│
├── README.md
├── package.json
├── eslint.config.mjs
├── public/ (if exists)
├── src/
│   ├── App.js          # Main React component, contains ALL game logic and UI
│   ├── App.css         # Main CSS file for app and game styles
│   ├── index.js        # App entry point
│   ├── index.css       # Global base styles
│   ├── App.test.js     # Sample test scaffold for App
│   └── setupTests.js   # Test environment setup
│
└── kavia-docs/
    └── developer_user_guide.md  # This documentation
```

- The bulk of the logic resides in `src/App.js` for simplicity and maintainability.

---

## Core Features

- **Responsive 20x20 Game Board:** Auto-resizes based on viewport.
- **Smooth Keyboard Controls:** Use arrow keys to direct the snake; spacebar toggles pause/start.
- **Scoring:** Score increases as the snake eats food.
- **Game States:** Supports "init", "running", "paused", and "game over" states.
- **Pause/Resume:** Accessible via the UI or using the spacebar.
- **Restart Mechanism:** Easy restart after a game over.
- **Mobile & Desktop Friendly:** UI elements adjust for different screens.
- **Toggle Theme Button:** Minimal theme mechanism.
- **Pure React + CSS:** No Redux, no third-party UI kit.

---

## Dependencies

All dependencies are declared in `package.json`:

- [react](https://reactjs.org/) (v18+): For UI components and hooks.
- [react-dom](https://www.npmjs.com/package/react-dom): DOM rendering.
- [react-scripts](https://www.npmjs.com/package/react-scripts): Scripts and configuration used by Create React App.
- Developer Dependencies: 
    - [cross-env](https://www.npmjs.com/package/cross-env) for environment variable handling in scripts.
    - ESLint config for JavaScript and React style checking.

There are **no runtime dependencies on backends or external APIs**.

---

## How to Run

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Development server:**

   ```bash
   npm start
   ```

   Default: [http://localhost:3000](http://localhost:3000)

3. **Run tests:**

   ```bash
   npm test
   ```

4. **Build for production:**

   ```bash
   npm run build
   ```

   Output is generated in the `/build` directory.

---

## Game Usage Instructions

- **Start Game:** Press the "Start" button or spacebar to start.
- **Move Snake:** Use Arrow Keys (`←`, `→`, `↑`, `↓`).
- **Pause / Resume:** Press Spacebar or use the on-screen button.
- **Restart:** After "Game Over", use the "Restart" button.
- **Score:** Displayed beneath the title.

**Eat food to grow the snake and increase your score! Avoid crashing into yourself or the walls.**

---

## Customization & Theming

- **Colors and Theme Variables:** All principal theme colors are defined in `src/App.css`:

    ```css
    :root {
      --snake-primary: #27ae60;
      --snake-secondary: #2c3e50;
      --snake-accent: #e67e22;
      --snake-bg: #f6f6f8;
    }
    ```

- Change these values to adjust the app's look and branding.

- **Component Styling:** Modify or extend `.App`, `.game-board-wrapper`, `.theme-toggle`, etc. classes in `App.css`.

- **Game Parameters:** To adjust the board dimensions, change `BOARD_SIZE` in `App.js`.

- **UI Behavior:** UI logic, including state transitions (pause, resume, game over), is implemented as React functions in `App.js`.

---

## Testing

- Unit tests use [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) with [Jest](https://jestjs.io/).
- `src/App.test.js` demonstrates a scaffold (currently expects the default React "learn react" text – extend as needed for game features).

---

## Development Notes

- **Linting:** Configured with `eslint.config.mjs` to enforce code style and highlight React/JS best practices.
- **No environment variables** are required to run this frontend.
- **Custom Features:** 
    - The game board and UI are self-contained, suitable for extending with new features (e.g., high scores, color themes, sound effects).

---

## Useful Links

- [React Documentation](https://reactjs.org/)
- [Create React App User Guide](https://facebook.github.io/create-react-app/docs/getting-started)
- [Jest - Testing Framework](https://jestjs.io/)
- [ESLint](https://eslint.org/)

---

## Attributions

Developed using the [KAVIA lightweight React template](https://github.com/kavia-ai).  
Feel free to modify, extend, and share!

---
