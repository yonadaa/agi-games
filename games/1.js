import MazeGame from "./utils/MazeGame.js";

// A 10x10 maze puzzle
function game1(canvas, declareWin) {
  const WALLS = {
    horizontal: [
      [0, 1, 0, 1, 0, 0, 1, 0, 1, 0],
      [1, 0, 1, 0, 1, 0, 0, 1, 0, 0],
      [0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
      [1, 1, 0, 1, 0, 1, 1, 0, 1, 0],
      [0, 1, 1, 0, 0, 0, 0, 1, 0, 0],
      [0, 1, 1, 0, 1, 0, 1, 1, 0, 1],
      [1, 0, 1, 1, 0, 1, 0, 0, 1, 0],
      [0, 1, 0, 0, 1, 1, 0, 1, 0, 1],
      [0, 1, 0, 1, 0, 1, 1, 0, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
    vertical: [
      [1, 0, 1, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 1, 1, 0, 0, 1, 0, 1, 0],
      [0, 1, 0, 0, 0, 1, 0, 1, 0, 0],
      [0, 0, 1, 0, 1, 0, 1, 0, 0, 1],
      [0, 0, 0, 0, 0, 1, 0, 1, 1, 0],
      [0, 0, 1, 1, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 0, 1, 1, 0, 1, 0, 0],
      [1, 0, 0, 1, 0, 0, 1, 0, 1, 0],
      [0, 0, 1, 0, 1, 0, 1, 1, 0, 0],
      [0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
    ],
  };

  const NUM_ROWS = 10;
  const NUM_COLS = 10;

  const START_ROW = 0;
  const START_COL = 0;
  const GOAL_ROW = 9;
  const GOAL_COL = 9;

  const EMPTY_TILE_COLOR = "#FFFFFF";
  const WALL_TILE_COLOR = "#000000";
  const GOAL_COLOR = "#00FF00";
  const PLAYER_COLOR = "#0000FF";

  return new MazeGame(
    WALLS,
    NUM_ROWS,
    NUM_COLS,
    START_ROW,
    START_COL,
    GOAL_ROW,
    GOAL_COL,
    EMPTY_TILE_COLOR,
    WALL_TILE_COLOR,
    GOAL_COLOR,
    PLAYER_COLOR,
    canvas,
    declareWin
  );
}

export { game1 };
