(() => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const coinSound = document.getElementById('coinSound');
  const boomSound = document.getElementById('boomSound');

  let width, height;
  let basketX, basketWidth = 70, basketHeight = 20;
  let coins = [];
  let bombs = [];
  let explosions = [];
  let score = 0;
  let gameOver = false;
  let leftPressed = false;
  let rightPressed = false;
  const basketSpeed = 5;
  const coinSpeed = 3;
  const bombSpeed = 3;
  const coinR = 15;
  const bombR = 15;

  const explosionImage = new Image();
  explosionImage.src = 'explosion.png';

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    basketX = (width - basketWidth) / 2;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') leftPressed = true;
    if (e.key === 'ArrowRight') rightPressed = true;
  });
  window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') leftPressed = false;
    if (e.key === 'ArrowRight') rightPressed = false;
  });

  const leftBtn = document.getElementById('leftBtn');
  const rightBtn = document.getElementById('rightBtn');
  leftBtn.onpointerdown = () => leftPressed = true;
  leftBtn.onpointerup = () => leftPressed = false;
  rightBtn.onpointerdown = () => rightPressed = true;
  rightBtn.onpointerup = () => rightPressed = false;

  canvas.addEventListener('pointerdown', () => {
    if (gameOver) restartGame();
  });

  function restartGame() {
    coins = [];
    bombs = [];
    explosions = [];
    score = 0;
    gameOver = false;
    basketX = (width - basketWidth) / 2;
    requestAnimationFrame(gameLoop);
  }

  function draw3DCoin(x, y) {
    const gradient = ctx.createRadialGradient(x, y, 5, x, y, coinR);
    gradient.addColorStop(0, '#fff480');
    gradient.addColorStop(1, '#ffcc00');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, coinR, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#996600';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', x, y);
  }

  function drawBomb(x, y) {
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(x, y, bombR, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f00';
    ctx.beginPath();
    ctx.arc(x, y - bombR, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawExplosion(x, y) {
    ctx.drawImage(explosionImage, x - 32, y - 32, 64, 64);
  }

  function gameLoop() {
    ctx.clearRect(0, 0, width, height);

    // Draw ground
    ctx.fillStyle = '#444';
    ctx.fillRect(0, height - 40, width, 40);
    ctx.fillStyle = '#222';
    ctx.fillRect(0, height - 20, width, 20);

    if (leftPressed) basketX = Math.max(0, basketX - basketSpeed);
    if (rightPressed) basketX = Math.min(width - basketWidth, basketX + basketSpeed);

    for (let i = bombs.length - 1; i >= 0; i--) {
      let b = bombs[i];
      b.y += bombSpeed;
      if (b.y - bombR > height) {
        bombs.splice(i, 1);
        continue;
      }
      if (b.y + bombR >= height - basketHeight && b.x >= basketX && b.x <= basketX + basketWidth) {
        gameOver = true;
        explosions.push({ x: b.x, y: b.y, timer: 30 });
        boomSound.play();
        break;
      }
    }

    for (let j = coins.length - 1; j >= 0; j--) {
      let c = coins[j];
      c.y += coinSpeed;
      if (c.y - coinR > height) {
        coins.splice(j, 1);
        continue;
      }
      if (c.y + coinR >= height - basketHeight && c.x >= basketX && c.x <= basketX + basketWidth) {
        score++;
        coinSound.play();
        coins.splice(j, 1);
        continue;
      }
    }

    for (let e = explosions.length - 1; e >= 0; e--) {
      let exp = explosions[e];
      drawExplosion(exp.x, exp.y);
      exp.timer--;
      if (exp.timer <= 0) explosions.splice(e, 1);
    }

    ctx.fillStyle = '#00aa00';
    ctx.fillRect(basketX, height - basketHeight, basketWidth, basketHeight);

    for (const c of coins) draw3DCoin(c.x, c.y);
    for (const b of bombs) drawBomb(b.x, b.y);

    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);

    if (gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(0, height / 2 - 40, width, 80);
      ctx.fillStyle = '#fff';
      ctx.font = '30px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Игра окончена! Счёт: ${score}`, width / 2, height / 2);
      ctx.font = '20px Arial';
      ctx.fillText(`Нажми, чтобы начать заново`, width / 2, height / 2 + 30);
    } else {
      if (Math.random() < 0.02) coins.push({ x: Math.random() * (width - coinR*2) + coinR, y: -coinR });
      if (Math.random() < 0.01) bombs.push({ x: Math.random() * (width - bombR*2) + bombR, y: -bombR });
      requestAnimationFrame(gameLoop);
    }
  }

  requestAnimationFrame(gameLoop);
})();