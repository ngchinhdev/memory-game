/* Source code was create by CDP Team - Cuộc thi tìm kiếm tài năng JS */

const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const playAgain = document.getElementById("play-again");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
const fireworks = document.querySelector(".fire");
const wrap = document.querySelector(".wrapper");

const buttonSound = document.getElementById('clickSound');
const bgSound = document.getElementById('bg-sound');
const soundClickCard = document.getElementById('click-card');
const winSound = document.getElementById('winning');

let isFinished = false;
let cards;
let interval;
let firstCard = false;
let secondCard = false;
let movesCount = 0;
let winCount = 0;
let seconds = 0;
let minutes = 0;

const items = [
  { name: "ruby", image: "images/ruby.png" },
  { name: "nodejs", image: "images/nodejs.webp" },
  { name: "ts", image: "images/ts.png" },
  { name: "js", image: "images/js.png" },
  { name: "php", image: "images/php.webp" },
  { name: "html", image: "images/html.webp" },
  { name: "css", image: "images/css.webp" },
  { name: "reactjs", image: "images/reactjs.png" },
  { name: "mongodb", image: "images/mongodb.webp" },
  { name: "vuejs", image: "images/vuejs.png" },
  { name: "angular", image: "images/angular.png" },
  { name: "java", image: "images/java.gif" },
  { name: "csharp", image: "images/csharp.png" },
  { name: "mysql", image: "images/mysql.webp" },
  { name: "python", image: "images/python.png" },
  { name: "c", image: "images/c.png" },
];

function initializeGame() {
  isFinished = false;
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  gameContainer.style.gap = "0.6em";
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  playAgain.classList.add("active");
  fireworks.innerHTML = "";
  bgSound.play();
  interval = setInterval(timeGenerator, 1000);
  moves.innerHTML = `<span>Lượt đã chọn: </span> ${movesCount}`;
  initializeCards();
}

function initializeCards() {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  generateMatrix(cardValues);
}

function generateRandom() {
  let tempArray = [...items];
  let cardValues = [];
  for (let i = 0; i < 16; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
}

function generateMatrix(cardValues) {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  cardValues.sort(() => Math.random() - 0.5);
  for (let i = 0; i < 32; i++) {
    gameContainer.innerHTML += `
     <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before">?</div>
        <div class="card-after">
        <img src="${cardValues[i].image}" class="image"/></div>
     </div>
     `;
  }
  gameContainer.style.gridTemplateColumns = `repeat(${8},auto)`;
  setTimeout(() => {
    cards.forEach((card) => {
      card.classList.add("flipped");
    });
  }, 500);
  setTimeout(() => {
    cards.forEach((card) => {
      card.classList.remove("flipped");
      gameContainer.style.pointerEvents = "auto";
    });
  }, 3500);
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      onCardClick(card);
    });
  });
}

function timeGenerator() {
  seconds += 1;
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Thời gian: </span>${minutesValue}:${secondsValue}`;
}

function onCardClick(card) {
  soundClickCard.play();
  if (!card.classList.contains("matched")) {
    card.classList.add("flipped");
    if (!firstCard) {
      firstCard = card;
      firstCard.style.pointerEvents = "none";
      firstCardValue = card.getAttribute("data-card-value");
    } else {
      movesCounter();
      secondCard = card;
      secondCard.style.pointerEvents = "none";
      let secondCardValue = card.getAttribute("data-card-value");
      if (firstCardValue == secondCardValue) {
        handleMatchedCards();
      } else {
        handleMismatchedCards();
      }
    }
  }
}

function movesCounter() {
  movesCount += 1;
  moves.innerHTML = `<span>Lượt đã chọn:</span>${movesCount}`;
}

function handleMatchedCards() {
  firstCard.classList.add("matched");
  secondCard.classList.add("matched");
  firstCard = false;
  winCount += 1;
  if (winCount === Math.floor(cards.length / 2)) {
    endGame();
  }
}

function handleMismatchedCards() {
  firstCard.style.pointerEvents = "auto";
  let [tempFirst, tempSecond] = [firstCard, secondCard];
  firstCard = false;
  secondCard = false;
  let delay = setTimeout(() => {
    tempFirst.classList.remove("flipped");
    tempSecond.classList.remove("flipped");
    tempSecond.style.pointerEvents = "auto";
  }, 900);
}

function endGame() {
  isFinished = true;
  bgSound.pause();
  winSound.play();
  clearInterval(interval);
  const fireworksHTML = `
    <div class="pyro">
        <div class="before"></div>
        <div class="after"></div>
    </div>
  `;
  const winningHTML = `
    <div class="e-card playing">
        <div class="image"></div>
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="infotop">
            <svg xmlns="http://www.w3org/2000/svg" height="69" width="70" viewBox="0 0 576 512">
            <path fill="#ffffff" d="M400 0H176c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8H24C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H357.9C337 448 320 431 320 410.1c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C542.5 245 576 180.6 576 88c0-13.3-10.7-24-24-24H446.4c.3-5.2 .5-10.4 .7-15.8C448.1 21.8 426.5 0 400 0zM48.9 112h84.4c9.1 90.1 29.2 150.3 51.9 190.6c-24.9-11-50.8-26.5-73.2-48.3c-32-31.1-58-76-63-142.3zM464.1 254.3c-22.4 21.8-48.3 37.3-73.2 48.3c22.7-40.3 42.8-100.5 51.9-190.6h84.4c-5.1 66.3-31.1 111.2-63 142.3z"/>
        </svg>
        <br>      
          XIN CHÚC MỪNG
        <br>
        <div class="name"> <h3>BẠN ĐÃ THẮNG</h3></div>
    </div>
</div>
`;
  playAgain.classList.remove("active");
  fireworks.innerHTML = fireworksHTML;
  gameContainer.style.gap = "0";
  gameContainer.innerHTML = winningHTML;
}

startButton.addEventListener('mouseenter', () => {
  soundClickCard.play();
});

startButton.addEventListener('click', () => {
  buttonSound.play();
  bgSound.play();
  initializeGame();
});

playAgain.addEventListener('click', () => {
  isFinished = false;
  buttonSound.play();
  clearInterval(interval);
  initializeGame();
});

stopButton.addEventListener('click', () => {
  buttonSound.play();
  bgSound.pause();
  const confirmStopGame = confirm("Bạn có muốn dừng trò chơi?");
  if (confirmStopGame) {
    isFinished = true;
    fireworks.innerHTML = "";
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    playAgain.classList.add("active");
    startButton.classList.remove("hide");
    clearInterval(interval);
  }
  !isFinished && bgSound.play();
});

/* Source code was create by CDP Team - Cuộc thi tìm kiếm tài năng JS */

