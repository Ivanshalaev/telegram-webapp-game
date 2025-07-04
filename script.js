(() => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const coinSound = document.getElementById('coinSound');
  const boomSound = document.getElementById('boomSound');

  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  let basketX = width / 2;
  const basketWidth = 80;
  const basketHeight = 20;
  let leftPressed = false;
  let rightPressed = false;
  let coins = [];
  let bombs = [];
  let score = 0;
  let gameOver = false;

  const coinSprite = new Image();
  coinSprite.src = 'coin_sprite_sheet.png';
  const COIN_FRAME_COUNT = 109;
  const COIN_FRAME_WIDTH = 150;
  let coinFrame = 0;
  let coinTick = 0;

  const leftBtn = document.getElementById('leftBtn');
  const rightBtn = document.getElementById('rightBtn');
  leftBtn.onpointerdown = () => leftPressed = true;
  leftBtn.onpointerup = () => leftPressed = false;
  rightBtn.onpointerdown = () => rightPressed = true;
  rightBtn.onpointerup = () => rightPressed = false;

  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') leftPressed = true;
    if (e.key === 'ArrowRight') rightPressed = true;
  });
  window.addEventListener('keyup', e => {
    if (e.key === 'ArrowLeft') leftPressed = false;
    if (e.key === 'ArrowRight') rightPressed = false;
  });

  canvas.addEventListener('pointerdown', () => {
    if (gameOver) startGame();
  });

  function startGame() {
    coins = [];
    bombs = [];
    score = 0;
    gameOver = false;
    basketX = width / 2;
    requestAnimationFrame(gameLoop);
  }

  function drawCoin(x, y) {
    ctx.drawImage(
      coinSprite,
      coinFrame * COIN_FRAME_WIDTH, 0,
      COIN_FRAME_WIDTH, 150,
      x - 75, y - 75,
      150, 150
    );
  }

  function drawBasket() {
    ctx.fillStyle = '#ffaa00';
    ctx.fillRect(basketX, height - basketHeight - 10, basketWidth, basketHeight);
  }

  function drawBomb(x, y) {
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fill();
  }

  function gameLoop() {
    ctx.clearRect(0, 0, width, height);

    if (leftPressed) basketX = Math.max(0, basketX - 5);
    if (rightPressed) basketX = Math.min(width - basketWidth, basketX + 5);

    for (let i = coins.length - 1; i >= 0; i--) {
      const c = coins[i];
      c.y += 3;
      drawCoin(c.x, c.y);
      if (c.y > height) {
        coins.splice(i, 1);
      } else if (c.y >= height - basketHeight - 10 && c.x >= basketX && c.x <= basketX + basketWidth) {
        coinSound.play();
        coins.splice(i, 1);
        score++;
      }
    }

    for (let i = bombs.length - 1; i >= 0; i--) {
      const b = bombs[i];
      b.y += 3;
      drawBomb(b.x, b.y);
      if (b.y > height) {
        bombs.splice(i, 1);
      } else if (b.y >= height - basketHeight - 10 && b.x >= basketX && b.x <= basketX + basketWidth) {
        boomSound.play();
        gameOver = true;
      }
    }

    drawBasket();

    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText("Score: " + score, 10, 30);

    if (!gameOver) {
      if (Math.random() < 0.02) coins.push({ x: Math.random() * (width - 150) + 75, y: -150 });
      if (Math.random() < 0.01) bombs.push({ x: Math.random() * (width - 30) + 15, y: -30 });
      coinTick++;
      if (coinTick % 2 === 0) {
        coinFrame = (coinFrame + 1) % COIN_FRAME_COUNT;
      }
      requestAnimationFrame(gameLoop);
    } else {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, height / 2 - 50, width, 100);
      ctx.fillStyle = '#fff';
      ctx.font = '30px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over! Tap to restart', width / 2, height / 2);
    }
  }

  startGame();
})();