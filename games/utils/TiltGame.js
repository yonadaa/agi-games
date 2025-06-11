class TiltGame {
  constructor(
    layout,
    gridSize,
    startRow,
    startCol,
    backgroundColor,
    wallColor,
    pathColor,
    marbleColor,
    goalColor,
    canvas,
    declareWin
  ) {
    this.layout = layout;
    this.gridSize = gridSize;
    this.marbleRow = startRow;
    this.marbleCol = startCol;

    this.backgroundColor = backgroundColor;
    this.wallColor = wallColor;
    this.pathColor = pathColor;
    this.marbleColor = marbleColor;
    this.goalColor = goalColor;
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

  // Check if position contains wall
  isWall(row, col) {
    if (row < 0 || row >= this.gridSize || col < 0 || col >= this.gridSize) {
      return true; // Boundaries act as walls
    }
    return this.layout[row][col] === 1;
  }

  // Check if position is goal
  isGoal(row, col) {
    return this.layout[row][col] === 3;
  }

  draw() {
    const ctx = this.canvas.getContext("2d");
    const { width, height } = this.canvas;
    const cellSize = Math.min(width, height) / this.gridSize;
    const gridStartX = (width - this.gridSize * cellSize) / 2;
    const gridStartY = (height - this.gridSize * cellSize) / 2;

    // Clear canvas
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Draw maze
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        const x = gridStartX + col * cellSize;
        const y = gridStartY + row * cellSize;

        const cellType = this.layout[row][col];

        if (cellType === 1) {
          // Wall
          ctx.fillStyle = this.wallColor;
          ctx.fillRect(x, y, cellSize, cellSize);

          // Add wall border effect
          ctx.fillStyle = "#654321";
          ctx.fillRect(x + 2, y + 2, cellSize - 4, cellSize - 4);
        } else if (cellType === 3) {
          // Goal
          ctx.fillStyle = this.pathColor;
          ctx.fillRect(x, y, cellSize, cellSize);

          // Draw goal
          ctx.fillStyle = this.goalColor;
          const goalSize = cellSize * 0.8;
          const goalOffset = (cellSize - goalSize) / 2;
          ctx.fillRect(x + goalOffset, y + goalOffset, goalSize, goalSize);

          // Add goal glow effect
          ctx.fillStyle = "#00aa00";
          ctx.fillRect(
            x + goalOffset + 2,
            y + goalOffset + 2,
            goalSize - 4,
            goalSize - 4
          );
        } else {
          // Path
          ctx.fillStyle = this.pathColor;
          ctx.fillRect(x, y, cellSize, cellSize);

          // Add subtle grid lines
          ctx.strokeStyle = "#e0e0e0";
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, cellSize, cellSize);
        }
      }
    }

    // Draw marble
    const marbleX = gridStartX + this.marbleCol * cellSize + cellSize / 2;
    const marbleY = gridStartY + this.marbleRow * cellSize + cellSize / 2;
    const marbleRadius = cellSize * 0.3;

    // Marble shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.beginPath();
    ctx.arc(marbleX + 2, marbleY + 2, marbleRadius, 0, Math.PI * 2);
    ctx.fill();

    // Marble
    ctx.fillStyle = this.marbleColor;
    ctx.beginPath();
    ctx.arc(marbleX, marbleY, marbleRadius, 0, Math.PI * 2);
    ctx.fill();

    // Marble highlight
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(
      marbleX - marbleRadius / 3,
      marbleY - marbleRadius / 3,
      marbleRadius / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    if (this.won) {
      ctx.fillStyle = "rgba(44, 38, 38, 0.3)";
      ctx.fillRect(0, 0, width, height);
    }
  }

  keyDownHandler(e) {
    if (this.won) return;

    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "KeyA", "KeyD", "KeyW", "KeyS"].includes(e.code)) {
      e.preventDefault();
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

  // Move marble in direction until hitting wall or goal
  move(keyCode) {
    if (this.won) return;

    let newRow = this.marbleRow;
    let newCol = this.marbleCol;

    // Keep moving in direction until hitting wall
    while (true) {
      let nextRow = newRow;
      let nextCol = newCol;

      if (keyCode === "ArrowUp" || keyCode === "KeyW") nextRow--;
      else if (keyCode === "ArrowDown" || keyCode === "KeyS") nextRow++;
      else if (keyCode === "ArrowLeft" || keyCode === "KeyA") nextCol--;
      else if (keyCode === "ArrowRight" || keyCode === "KeyD") nextCol++;

      // Check if next position is a wall
      if (this.isWall(nextRow, nextCol)) {
        break; // Stop moving
      } else if (this.isGoal(nextRow, nextCol)) {
        // Reached goal - win
        newRow = nextRow;
        newCol = nextCol;
        this.won = true;
        this.declareWin();
        break;
      } else {
        // Path - continue moving
        newRow = nextRow;
        newCol = nextCol;
      }
    }

    // Update marble position
    this.marbleRow = newRow;
    this.marbleCol = newCol;
    this.draw();
  }
}

export default TiltGame;
