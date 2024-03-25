/* Source code was created by CDP Team - Cuộc thi tìm kiếm tài năng JS */
const levels = document.getElementById("level");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const nextLevelButton = document.getElementById("next-level");
const playAgainButton = document.getElementById("play-again");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
const fireworks = document.querySelector(".fire");
const wrap = document.querySelector(".wrapper");
const overlay = document.getElementById("overlay");

const buttonSound = document.getElementById("clickSound");
const bgSound = document.getElementById("bg-sound");
const soundClickCard = document.getElementById("click-card");
const winSound = document.getElementById("winning");

let maxLevel = 5;
let curLevel = 1;
let isFinished = false;
let isBothOpened = false;
let cards;
let interval;
let firstCard = false;
let secondCard = false;
let winCount = 0;
let tempTime = 0;

const languages = [
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

const identifyEachLevel = {
  1: {
    languages: 2,
    grid: [2, 2]
  },
  2: {
    languages: 4,
    grid: [4, 2]
  },
  3: {
    languages: 8,
    grid: [4, 4]
  },
  4: {
    languages: 12,
    grid: [6, 4]
  },
  5: {
    languages: 16,
    grid: [8, 4]
  },
};

const timeEachLevel = {
  1: 30,
  2: 60,
  3: 90,
  4: 120,
  5: 150,
};

const stopClickOtherCards = (isStop) => {
  if (isStop) {
    cards.forEach((card) => {
      card.style.pointerEvents = "none";
    });
  } else {
    cards.forEach((card) => {
      card.style.pointerEvents = "auto";
    });
  }
};

function initializeGame() {
  isFinished = false;
  seconds = 0;
  minutes = 0;
  overlay.style.transition = "none";
  overlay.style.left = "0";
  overlay.style.opacity = "1";
  overlay.style.pointerEvents = "auto";
  gameContainer.style.pointerEvents = "none";
  setTimeout(function () {
    overlay.style.transition = "left 1s ease";
    overlay.style.left = "-100%";
    overlay.style.pointerEvents = "none";
    gameContainer.style.gap = "0.6em";
    gameContainer.style.pointerEvents = "none";
    controls.classList.add("hide");
    stopButton.classList.remove("hide");
    startButton.classList.add("hide");
    playAgainButton.classList.add("active");
    nextLevelButton.classList.add("active");
    fireworks.innerHTML = "";
    bgSound.play();
    tempTime = timeEachLevel[curLevel];
    interval = setInterval(() => {
      timeGenerator(tempTime);
      tempTime -= 1;
    }, 1000);
    initializeCards(1);
  }, 400);
}

function initializeCards(level) {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom(level);
  generateMatrix(cardValues, level);
}

function generateRandom(level) {
  let tempArray = [...languages];
  let cardValues = [];
  for (let i = 0; i < identifyEachLevel[level]['languages']; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
}

function generateMatrix(cardValues, level) {
  const { languages, grid } = identifyEachLevel[level];

  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  cardValues.sort(() => Math.random() - 0.5);
  for (let i = 0; i < languages * 2; i++) {
    gameContainer.innerHTML += `
     <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before"><span>?</span></div>
        <div class="card-after">
        <img src="${cardValues[i].image}" class="image"/></div>
     </div>
     `;
  }
  gameContainer.style.gridTemplateColumns = `repeat(${grid[0]},auto)`;
  gameContainer.style.gridTemplateRows = `repeat(${grid[1]},auto)`;
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

function timeGenerator(time) {
  if (time < 0) {
    endGame();
    return;
  }

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

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
      stopClickOtherCards(true);
      isBothOpened = true;
      isBothOpened && (gameContainer.style.pointerEvents = "none");
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

function handleNextLevel() {
  curLevel += 1;
  levels.innerText = `Cấp độ: ${curLevel}`;
  initializeCards(curLevel);

  tempTime = timeEachLevel[curLevel];
  interval = setInterval(() => {
    timeGenerator(tempTime);
    tempTime -= 1;
  }, 1000);

  if (curLevel < maxLevel) {
    nextLevelButton.classList.remove("active");
  } else {
    nextLevelButton.classList.add("hide");
  }
}

function handleMatchedCards() {
  firstCard.classList.add("matched");
  secondCard.classList.add("matched");
  firstCard = false;
  winCount += 1;
  stopClickOtherCards(false);
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
    stopClickOtherCards(false);
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
          Cấp độ: ${curLevel}
        <br>
        <div class="name"> <h3>BẠN ĐÃ THẮNG</h3></div>
    </div>
</div>
`;
  if (curLevel < maxLevel) {
    nextLevelButton.classList.remove("active");
  } else {
    nextLevelButton.classList.add("hide");
    playAgainButton.classList.remove("active");
    fireworks.innerHTML = fireworksHTML;
  }

  gameContainer.style.gap = "0.6";
  gameContainer.innerHTML = winningHTML;
}

startButton.addEventListener("mouseenter", () => {
  soundClickCard.play();
});

startButton.addEventListener("click", () => {
  buttonSound.play();
  bgSound.play();
  setTimeout(() => {
    initializeGame();
    curLevel = 1;
    levels.innerText = `Cấp độ: ${curLevel}`;
  }, 400);
});

nextLevelButton.addEventListener("click", () => {
  clearInterval(interval);
  buttonSound.play();
  handleNextLevel();
});

playAgainButton.addEventListener("click", () => {
  isFinished = false;
  curLevel = 1;
  buttonSound.play();
  clearInterval(interval);
  initializeGame();
  levels.innerText = `Cấp độ: ${curLevel}`;
  nextLevelButton.classList.remove("hide");
});

stopButton.addEventListener("click", () => {
  buttonSound.play();
  bgSound.pause();
  const confirmStopGame = confirm("Bạn có muốn dừng trò chơi?");
  if (confirmStopGame) {
    isFinished = true;
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";
    overlay.style.left = "0";
    fireworks.innerHTML = "";
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    playAgainButton.classList.add("active");
    startButton.classList.remove("hide");
    clearInterval(interval);
  }
  !isFinished && bgSound.play();
});
/* Source code was created by CDP Team - Cuộc thi tìm kiếm tài năng JS */
