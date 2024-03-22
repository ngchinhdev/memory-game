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

startButton.addEventListener('mouseenter', function () {
  buttonSound.play();
});

startButton.addEventListener('click', function () {
  soundClickCard.play();
  bgSound.play();
});

let cards;
let interval;
let firstCard = false;
let secondCard = false;

//Items array
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

gameContainer.style.pointerEvents = "none";

//Initial Time
let seconds = 0, minutes = 0;

//Initial moves and win count
let movesCount = 0, winCount = 15;
console.log(winCount);

//For timer
const timeGenerator = () => {
  seconds += 1;

  //Minutes logic
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }

  //Format time before displaying
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Thời gian: </span>${minutesValue}:${secondsValue}`;
};

//For calculating moves
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Lượt đã chọn:</span>${movesCount}`;
};

//Pick random objects from the items array
const generateRandom = () => {
  //Temporary array
  let tempArray = [...items];

  //Initializes cardValues array
  let cardValues = [];

  //Random object selection
  for (let i = 0; i < 16; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);

    //Once selected remove the object from temp array
    tempArray.splice(randomIndex, 1);
  }

  return cardValues;
};

const matrixGenerator = (cardValues) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];

  //Shuffle
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
  //Grid
  gameContainer.style.gridTemplateColumns = `repeat(${8},auto)`;

  // Open 3s in the beginning
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

  //Cards
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      soundClickCard.play();

      //If selected card is not matched yet then only run
      if (!card.classList.contains("matched")) {
        //Flip the clicked card
        card.classList.add("flipped");

        //If it is the first card
        if (!firstCard) {
          firstCard = card;

          // Prevent double click on card
          firstCard.style.pointerEvents = "none";

          firstCardValue = card.getAttribute("data-card-value");
        } else {
          movesCounter();

          secondCard = card;

          // Prevent double click on card
          secondCard.style.pointerEvents = "none";

          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");

            //Set firstCard to false since next card would be first now
            firstCard = false;

            //WinCount increment as user found a correct match
            winCount += 1;

            //Check if winCount == half of cardValues
            console.log(winCount, Math.floor(cardValues.length));
            if (winCount === Math.floor(cardValues.length / 2)) {
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
                          <svg xmlns="http://www.w3.org/2000/svg" height="32" width="36" viewBox="0 0 576 512">
                              <path fill="#ffffff" d="M400 0H176c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8H24C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H357.9C337 448 320 431 320 410.1c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C542.5 245 576 180.6 576 88c0-13.3-10.7-24-24-24H446.4c.3-5.2 .5-10.4 .7-15.8C448.1 21.8 426.5 0 400 0zM48.9 112h84.4c9.1 90.1 29.2 150.3 51.9 190.6c-24.9-11-50.8-26.5-73.2-48.3c-32-31.1-58-76-63-142.3zM464.1 254.3c-22.4 21.8-48.3 37.3-73.2 48.3c22.7-40.3 42.8-100.5 51.9-190.6h84.4c-5.1 66.3-31.1 111.2-63 142.3z"/>
                          </svg>
                          <br>      
                            BẠN ĐÃ THẮNG
                          <br>
                          <div class="name"> <h4>Lượt đã chọn: ${movesCount}</h4></div>
                      </div>
                  </div>
              `;
              playAgain.classList.remove("active");
              fireworks.innerHTML = fireworksHTML;
              gameContainer.style.gap = "0";
              gameContainer.innerHTML = winningHTML;
            }
          } else {
            //If the cards don't match
            firstCard.style.pointerEvents = "auto";
            // secondCard.style.pointerEvents = "auto";
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
              tempSecond.style.pointerEvents = "auto";
            }, 900);
          }
        }
      }
    });
  });
};

//Start game
startButton.addEventListener("click", () => {
  setTimeout(() => {
    movesCount = 0;
    seconds = 0;
    minutes = 0;

    //Controls amd buttons visibility
    gameContainer.style.gap = "0.6em";
    controls.classList.add("hide");
    stopButton.classList.remove("hide");
    startButton.classList.add("hide");
    playAgain.classList.add("active");

    //Start timer
    interval = setInterval(timeGenerator, 1000);

    //Initial moves
    moves.innerHTML = `<span>Lượt đã chọn: </span> ${movesCount}`;
    initializer();
  }, 300);
});

//Play again
playAgain.addEventListener("click", () => {
  buttonSound.play();
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  gameContainer.style.gap = "0.6em";
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  playAgain.classList.add("active");
  fireworks.innerHTML = "";
  bgSound.play();

  //Start timer
  interval = setInterval(timeGenerator, 1000);

  //Initial moves
  moves.innerHTML = `<span>Lượt đã chọn: </span> ${movesCount}`;
  initializer();
});

//Stop game
stopButton.addEventListener(
  "click",
  (stopGame = () => {
    buttonSound.play();
    bgSound.pause();
    const confirmStopGame = confirm("Bạn có muốn dừng trò chơi?");
    if (confirmStopGame) {
      fireworks.innerHTML = "";
      controls.classList.remove("hide");
      stopButton.classList.add("hide");
      playAgain.classList.add("active");
      startButton.classList.remove("hide");
      bgSound.pause();
      clearInterval(interval);
    }
    bgSound.play();
  })
);

//Initialize values and func calls
const initializer = () => {
  result.innerText = "";
  winCount = 15;
  let cardValues = generateRandom();
  matrixGenerator(cardValues);
};
