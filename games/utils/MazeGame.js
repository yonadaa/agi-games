class MazeGame {
  constructor(
    walls,
    numRows,
    numCols,
    startRow,
    startCol,
    goalRow,
    goalCol,
    emptyTileColor,
    wallTileColor,
    goalColor,
    playerColor,
    canvas,
    declareWin
  ) {
    // walls object contains: { horizontal: [...], vertical: [...] }
    // horizontal[row][col] = true if there's a wall below cell (row, col)
    // vertical[row][col] = true if there's a wall to the right of cell (row, col)
    this.walls = walls;

    this.numRows = numRows;
    this.numCols = numCols;

    this.playerRow = startRow;
    this.playerCol = startCol;

    this.goalRow = goalRow;
    this.goalCol = goalCol;

    this.emptyTileColor = emptyTileColor;
    this.wallTileColor = wallTileColor;
    this.goalColor = goalColor;
    this.playerColor = playerColor;
    this.canvas = canvas;
    this.declareWin = declareWin;

    this.won = false;

    // Bind event handler to maintain proper context
    this.keyDownHandler = this.keyDownHandler.bind(this);

    // Start listening for input
    this.startListening();

    // Initial draw
    this.draw();
  }

  keyDownHandler(e) {
    if (
      !this.won &&
      ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "KeyA", "KeyD", "KeyW", "KeyS"].includes(e.code)
    ) {
      this.move(e.code);
    }
  }

  startListening() {
    document.addEventListener("keydown", this.keyDownHandler);
  }

  stopListening() {
    document.removeEventListener("keydown", this.keyDownHandler);
  }

  destroy() {
    this.stopListening();
  }

  draw() {
    const ctx = this.canvas.getContext("2d");
    const { width, height } = this.canvas;
    const cellSize = Math.min(width / this.numCols, height / this.numRows);
    const wallThickness = Math.max(2, cellSize * 0.1);

    // Clear canvas
    ctx.fillStyle = this.emptyTileColor;
    ctx.fillRect(0, 0, width, height);

    // Draw cells
    for (let row = 0; row < this.numRows; row++) {
      for (let col = 0; col < this.numCols; col++) {
        const x = col * cellSize;
        const y = row * cellSize;

        // Draw cell background
        ctx.fillStyle = this.emptyTileColor;
        ctx.fillRect(x, y, cellSize, cellSize);
      }
    }

    // Draw walls
    ctx.fillStyle = this.wallTileColor;

    // Draw horizontal walls (walls below cells)
    for (let row = 0; row < this.numRows; row++) {
      for (let col = 0; col < this.numCols; col++) {
        if (this.walls.horizontal[row] && this.walls.horizontal[row][col]) {
          const x = col * cellSize;
          const y = (row + 1) * cellSize - wallThickness / 2;
          ctx.fillRect(x, y, cellSize, wallThickness);
        }
      }
    }

    // Draw vertical walls (walls to the right of cells)
    for (let row = 0; row < this.numRows; row++) {
      for (let col = 0; col < this.numCols; col++) {
        if (this.walls.vertical[row] && this.walls.vertical[row][col]) {
          const x = (col + 1) * cellSize - wallThickness / 2;
          const y = row * cellSize;
          ctx.fillRect(x, y, wallThickness, cellSize);
        }
      }
    }

    // Draw boundary walls
    ctx.fillStyle = this.wallTileColor;
    // Top boundary
    ctx.fillRect(0, 0, width, wallThickness);
    // Bottom boundary
    ctx.fillRect(0, height - wallThickness, width, wallThickness);
    // Left boundary
    ctx.fillRect(0, 0, wallThickness, height);
    // Right boundary
    ctx.fillRect(width - wallThickness, 0, wallThickness, height);

    // Draw goal
    const centerX = this.goalCol * cellSize + cellSize / 2;
    const centerY = this.goalRow * cellSize + cellSize / 2;
    const radius = cellSize / 4;

    ctx.fillStyle = this.goalColor;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw player
    const playerX = this.playerCol * cellSize + cellSize / 4;
    const playerY = this.playerRow * cellSize + cellSize / 4;

    ctx.fillStyle = this.playerColor;
    ctx.fillRect(playerX, playerY, cellSize / 2, cellSize / 2);

    if (this.won) {
      ctx.fillStyle = "rgba(44, 38, 38, 0.3)";
      ctx.fillRect(0, 0, width, height);
    }
  }

  canMove(fromRow, fromCol, toRow, toCol) {
    // Check if destination is within bounds
    if (
      toRow < 0 ||
      toRow >= this.numRows ||
      toCol < 0 ||
      toCol >= this.numCols
    ) {
      return false;
    }

    // Check if there's a wall between the cells
    if (toRow === fromRow + 1) {
      // Moving down - check horizontal wall below current cell
      return !(this.walls.horizontal[fromRow] && this.walls.horizontal[fromRow][fromCol]);
    } else if (toRow === fromRow - 1) {
      // Moving up - check horizontal wall below destination cell
      return !(this.walls.horizontal[toRow] && this.walls.horizontal[toRow][toCol]);
    } else if (toCol === fromCol + 1) {
      // Moving right - check vertical wall to right of current cell
      return !(this.walls.vertical[fromRow] && this.walls.vertical[fromRow][fromCol]);
    } else if (toCol === fromCol - 1) {
      // Moving left - check vertical wall to right of destination cell
      return !(this.walls.vertical[toRow] && this.walls.vertical[toRow][toCol]);
    }

    return false; // Invalid move (diagonal or too far)
  }

  move(keyCode) {
    let newRow = this.playerRow;
    let newCol = this.playerCol;

    if (keyCode === "ArrowLeft" || keyCode === "KeyA") {
      newCol = this.playerCol - 1;
    } else if (keyCode === "ArrowRight" || keyCode === "KeyD") {
      newCol = this.playerCol + 1;
    } else if (keyCode === "ArrowUp" || keyCode === "KeyW") {
      newRow = this.playerRow - 1;
    } else if (keyCode === "ArrowDown" || keyCode === "KeyS") {
      newRow = this.playerRow + 1;
    }

    if (this.canMove(this.playerRow, this.playerCol, newRow, newCol)) {
      this.playerRow = newRow;
      this.playerCol = newCol;
      if (this.playerRow === this.goalRow && this.playerCol === this.goalCol) {
        this.won = true;
        this.declareWin();
      }
    }

    this.draw();
  }
}

export default MazeGame;