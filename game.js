document.addEventListener('DOMContentLoaded', function() {
  // Элементы авторизации
  const authScreen = document.getElementById('authScreen');
  const passwordInput = document.getElementById('passwordInput');
  const authButton = document.getElementById('authButton');
  const errorMessage = document.getElementById('errorMessage');

  // Элементы игры
  const gameInterface = document.getElementById('gameInterface');
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const livesEl = document.getElementById('lives');
  const levelEl = document.getElementById('level');
  const startBtn = document.getElementById('startButton');

  let score = 0, lives = 8, level = 1, running = false;
  let player, bullets = [], asteroids = [], stars = [], keys = {};
  let spawnRate = 0.02, speedMultiplier = 1;

  // Функция авторизации
  authButton.addEventListener('click', function() {
    const password = passwordInput.value;
    if (password === '2015') {
      // Успешная авторизация
      authScreen.style.display = 'none';
      gameInterface.style.display = 'block';
    } else {
      // Ошибка авторизации
      errorMessage.textContent = 'Неверный пароль! Попробуйте снова.';
      passwordInput.value = '';
    }
  });

  // Создаём звёзды
  for (let i = 0; i < 100; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5
    });
  }

  // Корабль
  player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 40,
    w: 50,
    h: 30,
    speed: 5,
    draw() {
      ctx.fillStyle = '#0f0';
      ctx.fillRect(this.x, this.y, this.w, this.h);
    },
    move() {
      if (keys.ArrowLeft && this.x > 0) this.x -= this.speed;
      if (keys.ArrowRight && this.x < canvas.width - this.w) this.x += this.speed;
    }
  };

  // Функция создания метеорита
  function createAsteroid() {
    return {
      x: Math.random() * (canvas.width - 30),
      y: -30,
      size: Math.random() * 30 + 20,
      speed: (Math.random() * 3 + 1) * speedMultiplier
    };
  }

  // Функция создания пули
  function createBullet() {
    return {
      x: player.x + player.w / 2 - 2,
      y: player.y,
      w: 4,
      h: 12,
      speed: 7
    };
  }

  // Инициализация
  function init() {
    bullets = [];
    asteroids = [];
    score = 0; lives = 8; level = 1;
    spawnRate = 0.02; speedMultiplier = 1;
    running = true;
    startBtn.style.display = 'none';
    gameLoop();
  }

  // Конец игры
  function gameOver() {
    running = false;
    alert(`Игра окончена! Счёт: ${score}, Уровень: ${level}`);
    startBtn.style.display = 'block';
  }

  // Основной цикл
  function gameLoop() {
    if (!running) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Звёзды
    ctx.fillStyle = 'white';
    stars.forEach(s => {
      s.y += 0.5;
      if (s.y > canvas.height) s.y = 0;
      ctx.fillRect(s.x, s.y, s.size, s.size);
    });

    // Игрок
    player.move();
    player.draw();

    // Пули
    for (let i = bullets.length - 1; i >= 0; i--) {
      const b = bullets[i];
      b.y -= b.speed;
      ctx.fillStyle = '#f00';
      ctx.fillRect(b.x, b.y, b.w, b.h);
      if (b.y < 0) bullets.splice(i, 1);
    }

    // Метеориты
    if (Math.random() < spawnRate) asteroids.push(createAsteroid());

    for (let i = asteroids.length - 1; i >= 0; i--) {
      const a = asteroids[i];
      a.y += a.speed;

      // Отрисовка метеорита
      ctx.fillStyle = '#aaa';
      ctx.fillRect(a.x, a.y, a.size, a.size);

      // Столкновение пули с метеоритом
      for (let j = bullets.length - 1; j >= 0; j--) {
        const b = bullets[j];
        const distance = Math.sqrt(
          (b.x + b.w/2 - (a.x + a.size/2)) ** 2 +
          (b.y + b.h/2 - (a.y + a.size/2)) ** 2
        );
        if (distance < a.size / 2) {
          asteroids.splice(i, 1);
          bullets.splice(j, 1);
          score += 10;
          scoreEl.textContent = score;
          if (score % 50 === 0) {
            level++;
            levelEl.textContent = level;
            spawnRate += 0.005;
            speedMultiplier += 0.2;
          }
          break;
        }
      }

      // Столкновение с игроком
      const px = player.x + player.w/2;
      const py = player.y + player.h/2;
      const ax = a.x + a.size/2;
      const ay = a.y + a.size/2;
      const distanceToPlayer = Math.sqrt((px - ax) ** 2 + (py - ay) ** 2);
      if (distanceToPlayer < player.w/2 + a.size/2) {
        asteroids.splice(i, 1);
        lives--;
        livesEl.textContent = lives;
        if (lives <= 0) gameOver();
        break;
      }

      if (a.y > canvas.height) asteroids.splice(i, 1);
    }

    requestAnimationFrame(gameLoop);
  }

  // Управление
  window.addEventListener('keydown', function(e) {
    keys[e.key] = true;
    if (e.key === ' ' && running) {
      bullets.push(createBullet());
    }
  });

  window.addEventListener('keyup', function(e) {
    keys[e.key] = false;
  });

  startBtn.addEventListener('click', init);
});
