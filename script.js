(() => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  // Переменные игры
  let basketX, basketWidth = 60, basketHeight = 20;
  let coins = [];
  let bombs = [];
  let score = 0;
  let gameOver = false;
  // Переменные для управления
  let leftPressed = false;
  let rightPressed = false;
  // Скорости движения
  const basketSpeed = 5;
  const coinSpeed = 3;
  const bombSpeed = 3;
  const coinR = 10;   // радиус монеты
  const bombR = 10;   // радиус бомбы

  // Устанавливаем размер канваса на весь экран
  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    // Начальная позиция корзины – по центру снизу
    basketX = (width - basketWidth) / 2;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Управление с клавиатуры
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') leftPressed = true;
    if (e.key === 'ArrowRight') rightPressed = true;
  });
  window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') leftPressed = false;
    if (e.key === 'ArrowRight') rightPressed = false;
  });

  // Управление через кнопки на экране (для мобильных)
  const leftBtn = document.getElementById('leftBtn');
  const rightBtn = document.getElementById('rightBtn');
  leftBtn.addEventListener('pointerdown', () => { leftPressed = true; });
  leftBtn.addEventListener('pointerup', () => { leftPressed = false; });
  leftBtn.addEventListener('pointerleave', () => { leftPressed = false; });
  rightBtn.addEventListener('pointerdown', () => { rightPressed = true; });
  rightBtn.addEventListener('pointerup', () => { rightPressed = false; });
  rightBtn.addEventListener('pointerleave', () => { rightPressed = false; });

  // Обработка нажатия по экрану для рестарта после окончания игры
  canvas.addEventListener('pointerdown', () => {
    if (gameOver) {
      restartGame();
    }
    // (при игре касание экрана вне кнопок можно обрабатывать при желании)
  });

  // Функция рестарта игры
  function restartGame() {
    coins = [];
    bombs = [];
    score = 0;
    gameOver = false;
    basketX = (width - basketWidth) / 2;
    requestAnimationFrame(gameLoop);
  }

  // Главный игровой цикл
  function gameLoop() {
    // Заливка фона (очистка экрана)
    ctx.fillStyle = '#87ceeb';
    ctx.fillRect(0, 0, width, height);

    // Двигаем корзину влево/вправо при нажатых кнопках
    if (leftPressed) {
      basketX -= basketSpeed;
      if (basketX < 0) basketX = 0;
    }
    if (rightPressed) {
      basketX += basketSpeed;
      if (basketX + basketWidth > width) {
        basketX = width - basketWidth;
      }
    }

    // Обновляем положение бомб и проверяем столкновения
    for (let i = bombs.length - 1; i >= 0; i--) {
      const b = bombs[i];
      b.y += bombSpeed;
      // Удаляем бомбы, которые упали ниже экрана
      if (b.y - bombR > height) {
        bombs.splice(i, 1);
        continue;
      }
      // Проверяем попадание бомбы в корзину
      if (b.y + bombR >= height - basketHeight && b.x >= basketX && b.x <= basketX + basketWidth) {
        gameOver = true; // поймали бомбу – игра закончена
        break;
      }
    }

    // Обновляем положение монет, если игра не окончена
    if (!gameOver) {
      for (let j = coins.length - 1; j >= 0; j--) {
        const c = coins[j];
        c.y += coinSpeed;
        // Удаляем монеты, улетевшие ниже экрана
        if (c.y - coinR > height) {
          coins.splice(j, 1);
          continue;
        }
        // Проверяем попадание монеты в корзину
        if (c.y + coinR >= height - basketHeight && c.x >= basketX && c.x <= basketX + basketWidth) {
          score += 1;            // увеличиваем счёт
          coins.splice(j, 1);    // удаляем пойманную монету
          continue;
        }
      }
    }

    // Рисуем корзину (зеленый прямоугольник)
    ctx.fillStyle = '#008800';
    ctx.fillRect(basketX, height - basketHeight, basketWidth, basketHeight);

    // Рисуем монеты (золотые круги)
    ctx.fillStyle = '#FFD700';
    for (const c of coins) {
      ctx.beginPath();
      ctx.arc(c.x, c.y, coinR, 0, Math.PI * 2);
      ctx.fill();
    }

    // Рисуем бомбы (темно-серые круги с красной «искрой»)
    ctx.fillStyle = '#444';
    for (const b of bombs) {
      ctx.beginPath();
      ctx.arc(b.x, b.y, bombR, 0, Math.PI * 2);
      ctx.fill();
      // рисуем небольшой красный фитиль у бомбы
      ctx.fillStyle = '#f00';
      ctx.beginPath();
      ctx.arc(b.x, b.y - bombR, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#444';
    }

    // Выводим счёт в левом верхнем углу
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.textAlign = 'start';
    ctx.fillText(`Score: ${score}`, 10, 30);

    // Если игра окончена – выводим сообщение и не перезапускаем цикл
    if (gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';  // полупрозрачный фон под сообщением
      ctx.fillRect(0, height/2 - 40, width, 80);
      ctx.fillStyle = '#fff';
      ctx.font = '30px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Игра окончена! Счёт: ${score}`, width / 2, height/2);
      ctx.font = '20px Arial';
      ctx.fillText(`Нажмите, чтобы начать заново`, width / 2, height/2 + 30);
      // Цикл не продолжается, игра остановлена до рестарта
    } else {
      // Если игра продолжается – случайным образом создаём новые монеты/бомбы
      if (Math.random() < 0.02) {
        coins.push({ x: Math.random() * (width - coinR*2) + coinR, y: -coinR });
      }
      if (Math.random() < 0.005) {
        bombs.push({ x: Math.random() * (width - bombR*2) + bombR, y: -bombR });
      }
      requestAnimationFrame(gameLoop);
    }
  }

  // Запускаем игру первый раз
  requestAnimationFrame(gameLoop);
})();
