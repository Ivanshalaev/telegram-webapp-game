(() => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const coinSprite = new Image();
  coinSprite.src = 'coin_sprite_sheet.png';

  const COIN_FRAME_COUNT = 24;
  let coinFrame = 0;
  let coinTick = 0;

  function drawAnimatedCoin(x, y) {
    const frameWidth = 150;
    const frameHeight = 150;
    ctx.drawImage(
      coinSprite,
      coinFrame * frameWidth, 0,
      frameWidth, frameHeight,
      x - frameWidth / 2, y - frameHeight / 2,
      frameWidth, frameHeight
    );
  }

  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем монету по центру
    drawAnimatedCoin(canvas.width / 2, canvas.height / 2);

    // Анимация кадров
    coinTick++;
    if (coinTick % 5 === 0) {
      coinFrame = (coinFrame + 1) % COIN_FRAME_COUNT;
    }

    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);
})();
