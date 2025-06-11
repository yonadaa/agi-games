import TiltGame from "./utils/TiltGame.js";

// A "marble tilt game" puzzle
function game3(canvas, declareWin) {
  const LAYOUT = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 3, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  const GRID_SIZE = 10;
  const START_ROW = 1;
  const START_COL = 1;

  const BACKGROUND_COLOR = "#2c2c2c";
  const WALL_COLOR = "#8b4513";
  const PATH_COLOR = "#f0f0f0";
  const MARBLE_COLOR = "#c0c0c0";
  const GOAL_COLOR = "#00ff00";

  return new TiltGame(
    LAYOUT,
    GRID_SIZE,
    START_ROW,
    START_COL,
    BACKGROUND_COLOR,
    WALL_COLOR,
    PATH_COLOR,
    MARBLE_COLOR,
    GOAL_COLOR,
    canvas,
    declareWin
  );
}

export { game3 };
