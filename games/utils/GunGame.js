class GunGame {
  constructor(
    x,
    y,
    length,
    targetX,
    targetY,
    gunColor,
    width,
    height,
    canvas,
    declareWin,
    walls = []
  ) {
    this.x = x;
    this.y = y;
    this.length = length;
    this.angle = 0; // angle in radians
    this.width = width;
    this.height = height;
    this.canvas = canvas;
    this.declareWin = declareWin;

    // Ball properties
    this.ballX = 0;
    this.ballY = 0;
    this.ballRadius = 8;
    this.ballVx = 0;
    this.ballVy = 0;
    this.ballFriction = 0.98;
    this.ballActive = false;
    this.maxTrailLength = 20;
    this.ballTrail = [];

    // Target properties
    this.targetX = targetX;
    this.targetY = targetY;
    this.targetRadius = 30;
    this.won = false;

    // Wall properties
    this.walls = walls;

    this.gunColor = gunColor;
    this.ballColor = "#FF6B6B";
    this.targetColor = "#FF4444";
  }

  updateAngle(mouseX, mouseY) {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    this.angle = Math.atan2(dy, dx);
  }

  fire() {
    if (!this.ballActive) {
      const POWER = 15;
      const gunTipX = this.x + Math.cos(this.angle) * this.length;
      const gunTipY = this.y + Math.sin(this.angle) * this.length;

      this.ballX = gunTipX;
      this.ballY = gunTipY;
      this.ballVx = Math.cos(this.angle) * POWER;
      this.ballVy = Math.sin(this.angle) * POWER;
      this.ballActive = true;
      this.ballTrail = [];
    }
  }

  updateBall() {
    if (!this.ballActive || this.won) return;

    // Add current position to trail
    this.ballTrail.push({ x: this.ballX, y: this.ballY });
    if (this.ballTrail.length > this.maxTrailLength) {
      this.ballTrail.shift();
    }

    // Update position
    this.ballX += this.ballVx;
    this.ballY += this.ballVy;

    // Apply friction
    this.ballVx *= this.ballFriction;
    this.ballVy *= this.ballFriction;

    // Bounce off walls
    if (
      this.ballX - this.ballRadius <= 0 ||
      this.ballX + this.ballRadius >= this.width
    ) {
      this.ballVx = -this.ballVx;
      this.ballX = Math.max(
        this.ballRadius,
        Math.min(this.width - this.ballRadius, this.ballX)
      );
    }
    if (
      this.ballY - this.ballRadius <= 0 ||
      this.ballY + this.ballRadius >= this.height
    ) {
      this.ballVy = -this.ballVy;
      this.ballY = Math.max(
        this.ballRadius,
        Math.min(this.height - this.ballRadius, this.ballY)
      );
    }

    // Check wall collisions
    this.checkWallCollisions();

    // Check target collision
    this.checkTargetCollision();

    // Stop ball if moving very slowly
    if (Math.abs(this.ballVx) < 0.1 && Math.abs(this.ballVy) < 0.1) {
      this.ballVx = 0;
      this.ballVy = 0;
      this.ballActive = false;
      this.ballTrail = [];
    }
  }

  checkWallCollisions() {
    if (!this.ballActive) return;

    for (const wall of this.walls) {
      const collision = this.lineCircleCollision(
        wall.x1,
        wall.y1,
        wall.x2,
        wall.y2,
        this.ballX,
        this.ballY,
        this.ballRadius
      );

      if (collision.hit) {
        // Reflect velocity based on wall normal
        const dot =
          this.ballVx * collision.normal.x + this.ballVy * collision.normal.y;
        this.ballVx -= 2 * dot * collision.normal.x;
        this.ballVy -= 2 * dot * collision.normal.y;

        // Move ball out of wall
        this.ballX = collision.point.x + collision.normal.x * this.ballRadius;
        this.ballY = collision.point.y + collision.normal.y * this.ballRadius;
      }
    }
  }

  lineCircleCollision(x1, y1, x2, y2, cx, cy, radius) {
    // Vector from line start to circle center
    const dx = cx - x1;
    const dy = cy - y1;

    // Line vector
    const lx = x2 - x1;
    const ly = y2 - y1;

    // Length squared of line
    const lineLength2 = lx * lx + ly * ly;

    // Project circle center onto line
    const t = Math.max(0, Math.min(1, (dx * lx + dy * ly) / lineLength2));

    // Closest point on line to circle center
    const closestX = x1 + t * lx;
    const closestY = y1 + t * ly;

    // Distance from circle center to closest point
    const distX = cx - closestX;
    const distY = cy - closestY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance <= radius) {
      // Calculate normal (pointing away from line)
      const normalX = distX / distance;
      const normalY = distY / distance;

      return {
        hit: true,
        point: { x: closestX, y: closestY },
        normal: { x: normalX, y: normalY },
      };
    }

    return { hit: false };
  }

  checkTargetCollision() {
    if (this.ballActive && !this.won) {
      const dx = this.ballX - this.targetX;
      const dy = this.ballY - this.targetY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.ballRadius + this.targetRadius) {
        this.won = true;
        this.declareWin();
      }
    }
  }

  draw() {
    const ctx = this.canvas.getContext("2d");
    const { width, height } = this.canvas;

    // Clear canvas
    ctx.fillStyle = "#2E8B57";
    ctx.fillRect(0, 0, width, height);

    // Draw target (static concentric circles)
    ctx.fillStyle = "#FF4444";
    ctx.beginPath();
    ctx.arc(this.targetX, this.targetY, this.targetRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(
      this.targetX,
      this.targetY,
      this.targetRadius * 0.7,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.fillStyle = "#FF4444";
    ctx.beginPath();
    ctx.arc(
      this.targetX,
      this.targetY,
      this.targetRadius * 0.4,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw gun
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Draw gun barrel
    ctx.strokeStyle = this.gunColor;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this.length, 0);
    ctx.stroke();

    ctx.restore();

    // Draw gun base
    ctx.fillStyle = this.gunColor;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
    ctx.fill();

    // Draw ball trail
    if (this.ballActive) {
      ctx.strokeStyle = `${this.ballColor}80`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < this.ballTrail.length - 1; i++) {
        const alpha = i / this.ballTrail.length;
        ctx.globalAlpha = alpha * 0.5;
        if (i === 0) {
          ctx.moveTo(this.ballTrail[i].x, this.ballTrail[i].y);
        } else {
          ctx.lineTo(this.ballTrail[i].x, this.ballTrail[i].y);
        }
      }
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Draw ball
      ctx.fillStyle = this.ballColor;
      ctx.beginPath();
      ctx.arc(this.ballX, this.ballY, this.ballRadius, 0, Math.PI * 2);
      ctx.fill();

      // Draw ball highlight
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.beginPath();
      ctx.arc(
        this.ballX - this.ballRadius * 0.3,
        this.ballY - this.ballRadius * 0.3,
        this.ballRadius * 0.4,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    // Draw walls
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 4;
    for (const wall of this.walls) {
      ctx.beginPath();
      ctx.moveTo(wall.x1, wall.y1);
      ctx.lineTo(wall.x2, wall.y2);
      ctx.stroke();
    }

    // Apply victory tint if won
    if (this.won) {
      ctx.fillStyle = "rgba(255, 215, 0, 0.2)";
      ctx.fillRect(0, 0, width, height);
    }
  }
}

export function createGunGame(
  gunX,
  gunY,
  gunLength,
  targetX,
  targetY,
  gunColor,
  walls = [],
  canvas,
  declareWin
) {
  const { width, height } = canvas;

  const gun = new GunGame(
    gunX,
    gunY,
    gunLength,
    targetX,
    targetY,
    gunColor,
    width,
    height,
    canvas,
    declareWin,
    walls
  );
  let animationId = null;

  const mouseMoveHandler = (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    gun.updateAngle(mouseX, mouseY);
  };

  const mouseClickHandler = () => {
    if (!gun.ballActive && !gun.won) {
      gun.fire();
    }
  };

  canvas.addEventListener("mousemove", mouseMoveHandler);
  canvas.addEventListener("click", mouseClickHandler);

  function animate() {
    // Update game state
    gun.updateBall();

    // Draw everything
    gun.draw();

    animationId = requestAnimationFrame(animate);
  }

  animate();

  return {
    destroy: () => {
      canvas.removeEventListener("mousemove", mouseMoveHandler);
      canvas.removeEventListener("click", mouseClickHandler);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    },
  };
}
