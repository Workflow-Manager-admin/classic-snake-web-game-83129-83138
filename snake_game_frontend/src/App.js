import React, { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";

// Color theme from requirements
const COLOR_PRIMARY = "#27ae60";
const COLOR_SECONDARY = "#2c3e50";
const COLOR_ACCENT = "#e67e22";
const BOARD_SIZE = 20; // 20x20 grid

// Direction vectors
const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

// Utility: Check collision with snake or wall
const isCollision = (pos, snake) => {
  if (
    pos.x < 0 ||
    pos.y < 0 ||
    pos.x >= BOARD_SIZE ||
    pos.y >= BOARD_SIZE
  )
    return true;
  for (let cell of snake) {
    if (cell.x === pos.x && cell.y === pos.y) return true;
  }
  return false;
};

// Utility: Get a random free cell
function getRandomCell(snake) {
  let availableCells = [];
  for (let x = 0; x < BOARD_SIZE; x++) {
    for (let y = 0; y < BOARD_SIZE; y++) {
      if (!snake.some(cell => cell.x === x && cell.y === y)) {
        availableCells.push({ x, y });
      }
    }
  }
  return availableCells[
    Math.floor(Math.random() * availableCells.length)
  ];
}

// PUBLIC_INTERFACE
function App() {
  /**
   * PUBLIC_INTERFACE
   * Main application for the Snake game.
   * Handles UI, state, and gameplay logic.
   */

  // Game states
  const [snake, setSnake] = useState([
    { x: Math.floor(BOARD_SIZE / 2), y: Math.floor(BOARD_SIZE / 2) },
  ]);
  const [direction, setDirection] = useState("ArrowRight");
  const [nextDirection, setNextDirection] = useState("ArrowRight");
  const [food, setFood] = useState(getRandomCell([{ x: Math.floor(BOARD_SIZE / 2), y: Math.floor(BOARD_SIZE / 2) }]));
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState("init"); // "init", "running", "paused", "gameover"
  const moveRef = useRef();
  const directionRef = useRef(direction);
  const stateRef = useRef(gameState);

  // Responsive theme (from App.js template)
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Update refs to avoid stale closures
  useEffect(() => {
    directionRef.current = direction;
    stateRef.current = gameState;
  }, [direction, gameState]);

  // Handle keyboard controls
  const onKeyDown = useCallback(
    (e) => {
      if (DIRECTIONS[e.key] && gameState === "running") {
        // Prevent reversing into itself
        const opp = {
          ArrowUp: "ArrowDown",
          ArrowDown: "ArrowUp",
          ArrowLeft: "ArrowRight",
          ArrowRight: "ArrowLeft",
        };
        if (opp[e.key] !== directionRef.current) {
          setNextDirection(e.key);
        }
      }
      // Quick controls
      if (e.code === "Space") {
        if (gameState === "running") handlePause();
        else if (gameState === "paused") handleResume();
        else if (gameState === "gameover" || gameState === "init") handleStart();
      }
    },
    [gameState]
  );
  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  // Main game loop
  useEffect(() => {
    if (gameState !== "running") {
      if (moveRef.current) clearInterval(moveRef.current);
      return;
    }
    moveRef.current = setInterval(() => {
      setSnake((prevSnake) => {
        let newDir = nextDirection;
        setDirection(newDir);
        let vector = DIRECTIONS[newDir];
        let newHead = {
          x: prevSnake[0].x + vector.x,
          y: prevSnake[0].y + vector.y,
        };

        // Check collision
        if (isCollision(newHead, prevSnake)) {
          setGameState("gameover");
          return prevSnake;
        }

        // Check eat food
        let newSnake;
        if (newHead.x === food.x && newHead.y === food.y) {
          newSnake = [newHead, ...prevSnake];
          setScore((s) => s + 1);
          setFood(getRandomCell(newSnake));
        } else {
          newSnake = [newHead, ...prevSnake.slice(0, prevSnake.length - 1)];
        }
        return newSnake;
      });
    }, Math.max(60, 180 - score * 8));
    return () => clearInterval(moveRef.current);
    // eslint-disable-next-line
  }, [gameState, nextDirection, food, score]);

  // Start the game
  // PUBLIC_INTERFACE
  const handleStart = () => {
    setScore(0);
    let initCell = { x: Math.floor(BOARD_SIZE / 2), y: Math.floor(BOARD_SIZE / 2) };
    setSnake([initCell]);
    setDirection("ArrowRight");
    setNextDirection("ArrowRight");
    let f = getRandomCell([initCell]);
    setFood(f);
    setGameState("running");
  };

  // Pause game
  // PUBLIC_INTERFACE
  const handlePause = () => {
    if (gameState === "running") setGameState("paused");
  };
  // Resume game
  // PUBLIC_INTERFACE
  const handleResume = () => {
    if (gameState === "paused") setGameState("running");
  };

  // Restart game from game over
  // PUBLIC_INTERFACE
  const handleRestart = () => {
    handleStart();
  };

  // Style helpers
  const gameBoardStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
    gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
    gap: 1,
    background: COLOR_SECONDARY,
    maxWidth: "min(90vw, 90vh)",
    maxHeight: "min(90vw, 90vh)",
    aspectRatio: "1 / 1",
    margin: "0 auto",
    borderRadius: 16,
    boxShadow: "0 4px 24px rgba(44,62,80,0.14)",
    border: `2px solid ${COLOR_PRIMARY}`,
    position: "relative",
  };
  const boardWrapperStyle = {
    padding: "2vw",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  };

  const cellStyle = {
    width: "100%",
    height: "100%",
    background: "#fafafa",
    borderRadius: 4,
    boxSizing: "border-box",
    transition: "background 0.15s",
  };

  // Responsive for mobile
  const controlsStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    margin: "16px 0 8px 0",
    flexWrap: "wrap",
  };

  const scoreBoxStyle = {
    fontSize: 22,
    fontWeight: 700,
    color: COLOR_PRIMARY,
    background: "#FFF9F4",
    border: `1.5px solid ${COLOR_ACCENT}40`,
    borderRadius: 16,
    padding: "6px 24px",
    boxShadow: "0 2px 6px 0 rgba(230, 126, 34, 0.12)",
    marginBottom: 8,
    userSelect: "none",
  };

  // Render the game board
  const cells = [];
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      let type = "";
      if (food.x === x && food.y === y) {
        type = "food";
      }
      for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === x && snake[i].y === y) {
          type = i === 0 ? "snake-head" : "snake-body";
          break;
        }
      }
      let style = { ...cellStyle };
      if (type === "food") {
        style.background = COLOR_ACCENT;
        style.boxShadow = `0 1px 8px 0 ${COLOR_ACCENT}50`;
        style.display = "flex";
        style.justifyContent = "center";
        style.alignItems = "center";
      } else if (type === "snake-head") {
        style.background = COLOR_PRIMARY;
        style.boxShadow = `0 1px 8px 0 ${COLOR_PRIMARY}60`;
        style.transition = "background 0.07s";
      } else if (type === "snake-body") {
        style.background = COLOR_PRIMARY + "80";
        style.boxShadow = `0 1px 6px 0 ${COLOR_PRIMARY}33`;
      } else {
        style.background = "#ededed";
      }
      cells.push(
        <div key={`${x},${y}`} style={style}>
          {type === "food" ? (
            <svg width="70%" height="70%" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill={COLOR_ACCENT} />
              <ellipse cx="15" cy="9" rx="3" ry="1.2" fill="#fff7e8" />
            </svg>
          ) : null}
        </div>
      );
    }
  }

  return (
    <div className="App" style={{ background: "#f6f6f8", padding: 0, minHeight: "100vh" }}>
      <header className="App-header" style={{ background: "transparent", minHeight: "auto" }}>
        <button
          className="theme-toggle"
          style={{ background: COLOR_SECONDARY, color: "#fff", right: 30, top: 30 }}
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>

        <h1 style={{ fontWeight: 800, color: COLOR_PRIMARY, margin: "28px 0 8px 0", fontSize: "2.4rem", letterSpacing: "-1.5px" }}>
          SNAKE<span style={{ color: COLOR_ACCENT }}>.</span>GAME
        </h1>
        <div style={scoreBoxStyle}>
          Score: {score}
        </div>

        <div style={controlsStyle}>
          {gameState === "init" || gameState === "gameover" ? (
            <button
              style={{
                background: COLOR_PRIMARY,
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontSize: 18,
                fontWeight: 700,
                padding: "8px 28px",
                cursor: "pointer",
                boxShadow: `0 2px 8px 0 ${COLOR_PRIMARY}22`,
              }}
              onClick={handleStart}
              aria-label="Start Game"
            >
              Start
            </button>
          ) : null}
          {gameState === "running" ? (
            <button
              style={{
                background: COLOR_ACCENT,
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontSize: 18,
                fontWeight: 700,
                padding: "8px 28px",
                cursor: "pointer",
                boxShadow: `0 2px 8px 0 ${COLOR_ACCENT}22`,
              }}
              onClick={handlePause}
              aria-label="Pause Game"
            >Pause</button>
          ) : null}
          {gameState === "paused" ? (
            <button
              style={{
                background: COLOR_PRIMARY,
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontSize: 18,
                fontWeight: 700,
                padding: "8px 28px",
                cursor: "pointer",
                boxShadow: `0 2px 8px 0 ${COLOR_PRIMARY}22`,
              }}
              onClick={handleResume}
              aria-label="Resume Game"
            >Resume</button>
          ) : null}
          {gameState === "gameover" ? (
            <button
              style={{
                background: COLOR_ACCENT,
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontSize: 18,
                fontWeight: 700,
                padding: "8px 28px",
                cursor: "pointer",
                boxShadow: `0 2px 8px 0 ${COLOR_ACCENT}22`,
              }}
              onClick={handleRestart}
              aria-label="Restart Game"
            >Restart</button>
          ) : null}
        </div>
        <div style={boardWrapperStyle}>
          <div
            style={{
              ...gameBoardStyle,
              width: "min(94vw,440px)",
              height: "min(94vw,440px)",
              position: "relative",
              margin: "0 auto",
              background: "#f3f5f7",
            }}
            tabIndex={0}
            aria-label="Snake game board"
          >
            {cells}
            <div
              aria-live="polite"
              style={{
                position: "absolute",
                left: 6,
                bottom: 6,
                fontSize: 10,
                color: COLOR_SECONDARY + "97",
                pointerEvents: "none",
                userSelect: "none",
                letterSpacing: "0.2px",
              }}
            >
              Use arrow keys to move. Spacebar = pause/start.
            </div>
          </div>
        </div>

        {/* Game Over/Message Overlay */}
        {(gameState === "gameover" || gameState === "paused") && (
          <div
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 6,
              background: "#192027d7",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            aria-label={gameState === "gameover" ? "Game Over Screen" : "Game Paused"}
          >
            <div
              style={{
                background: "#fff",
                color: COLOR_SECONDARY,
                borderRadius: 22,
                minWidth: 260,
                padding: "32px 38px",
                boxShadow: "0 12px 44px 0 rgba(44,62,80,0.14)",
                textAlign: "center",
              }}
            >
              {gameState === "gameover" ? (
                <>
                  <h2 style={{ color: COLOR_ACCENT, fontWeight: 900, fontSize: "2.2rem", margin: 0 }}>GAME OVER</h2>
                  <div style={{ color: COLOR_PRIMARY, fontWeight: 700, fontSize: 20, margin: "18px 0" }}>
                    Your Score: <span>{score}</span>
                  </div>
                  <button
                    style={{
                      background: COLOR_PRIMARY,
                      color: "#fff",
                      border: "none",
                      borderRadius: 10,
                      fontSize: 18,
                      fontWeight: 700,
                      padding: "8px 28px",
                      cursor: "pointer",
                      marginTop: 5,
                      boxShadow: `0 2px 8px 0 ${COLOR_PRIMARY}22`,
                    }}
                    onClick={handleRestart}
                    aria-label="Restart Game"
                  >Restart</button>
                </>
              ) : (
                <>
                  <h2 style={{ color: COLOR_PRIMARY, fontWeight: 900, fontSize: "2.1rem", margin: 0 }}>Game Paused</h2>
                  <button
                    style={{
                      background: COLOR_ACCENT,
                      color: "#fff",
                      border: "none",
                      borderRadius: 10,
                      fontSize: 18,
                      fontWeight: 700,
                      padding: "8px 28px",
                      cursor: "pointer",
                      marginTop: 15,
                      boxShadow: `0 2px 8px 0 ${COLOR_ACCENT}22`,
                    }}
                    onClick={handleResume}
                    aria-label="Resume Game"
                  >Resume</button>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
