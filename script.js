const board = document.querySelector('.game-board');
const timerDisplay = document.querySelector('.timer');
const movesDisplay = document.querySelector('.moves');
const buttons = document.querySelectorAll('.sidebar button');
const music = document.getElementById('bg-music');

let firstCard = null;
let lockBoard = false;
let matches = 0;
let moves = 0;
let timer = null;
let seconds = 0;

const levels = {
  easy: 6,
  normal: 8,
  hard: 12
};

const backImage = 'back.jpg';

buttons.forEach(btn => {
  btn.addEventListener('click', () => startGame(btn.dataset.level));
});

function startGame(level) {
  resetGame();

  const pairs = levels[level];
  const images = [];

  for (let i = 1; i <= pairs; i++) {
    images.push(`img${i}.jpg`);
    images.push(`img${i}.jpg`);
  }

  shuffle(images);
  setupGrid(pairs);

  images.forEach(src => board.appendChild(createCard(src)));

  music.volume = 0.3;
  music.play();
  startTimer();
}

function setupGrid(pairs) {
  if (pairs <= 6) board.style.gridTemplateColumns = 'repeat(3, 100px)';
  else if (pairs <= 8) board.style.gridTemplateColumns = 'repeat(4, 100px)';
  else board.style.gridTemplateColumns = 'repeat(6, 100px)';
}

function createCard(imageSrc) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.image = imageSrc;

  card.innerHTML = `
    <div class="card-inner">
      <div class="card-front"></div>
      <div class="card-back">
        <img src="${imageSrc}">
      </div>
    </div>
  `;

  card.addEventListener('click', () => flipCard(card));
  return card;
}

function flipCard(card) {
  if (lockBoard || card === firstCard || card.classList.contains('matched')) return;

  card.classList.add('flipped');

  if (!firstCard) {
    firstCard = card;
    return;
  }

  moves++;
  movesDisplay.textContent = `🧮 Moves: ${moves}`;

  if (firstCard.dataset.image === card.dataset.image) {
    card.classList.add('matched');
    firstCard.classList.add('matched');
    matches++;
    firstCard = null;

    if (matches === document.querySelectorAll('.card').length / 2) {
      setTimeout(() => {
        alert(`🏴‍☠️ YOU FOUND THE ONE PIECE!\nMoves: ${moves}\nTime: ${formatTime(seconds)}`);
      }, 500);
      stopTimer();
    }
  } else {
    lockBoard = true;
    setTimeout(() => {
      card.classList.remove('flipped');
      firstCard.classList.remove('flipped');
      firstCard = null;
      lockBoard = false;
    }, 1000);
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function resetGame() {
  board.innerHTML = '';
  firstCard = null;
  lockBoard = false;
  matches = 0;
  moves = 0;
  seconds = 0;

  movesDisplay.textContent = '🧮 Moves: 0';
  timerDisplay.textContent = '⏱ Time: 00:00';

  stopTimer();
  music.pause();
  music.currentTime = 0;
}

function startTimer() {
  timer = setInterval(() => {
    seconds++;
    timerDisplay.textContent = `⏱ Time: ${formatTime(seconds)}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}