import { createGunGame } from "./utils/GunGame.js";

// An aiming puzzle
function game2(canvas, declareWin) {
  const gunX = 50;
  const gunY = 250;
  const gunLength = 60;
  const targetX = 420;
  const targetY = 250;

  const gunColor = "#333333";

  const walls = [
    { x1: 250, y1: 0, x2: 250, y2: 400 },
    { x1: 250, y1: 350, x2: 400, y2: 350 },
  ];

  return createGunGame(
    gunX,
    gunY,
    gunLength,
    targetX,
    targetY,
    gunColor,
    walls,
    canvas,
    declareWin
  );
}

export { game2 };
