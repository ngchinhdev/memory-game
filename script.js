const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
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
  { name: "cplus", image: "images/cplus.png" },
  { name: "java", image: "images/java.gif" },
  { name: "csharp", image: "images/csharp.png" },
  { name: "mysql", image: "images/mysql.webp" },
  { name: "dart", image: "images/dart.png" },
  { name: "flutter", image: "images/flutter.png" },
  { name: "python", image: "images/python.png" },
  { name: "asp", image: "images/asp.png" },
  { name: "go", image: "images/go.png" },
  { name: "swift", image: "images/swift.png" },
  { name: "c", image: "images/c.png" },
];

//Initial Time
let seconds = 0,
  minutes = 0;
//Initial moves and win count
let movesCount = 0,
  winCount = 0;

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
  //Size should be double (4*4 matrix)/2 since pairs of objects would exist
  size = (23 * 4) / 2;
  //Random object selection
  for (let i = 0; i < size; i++) {
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
  //Simple shuffle
  cardValues.sort(() => Math.random() - 0.5);
  for (let i = 0; i < 44; i++) {
    console.log(cardValues[i]);
    /*
        Create Cards
        before => front side (contains question mark)
        after => back side (contains actual image);
        data-card-values is a custom attribute which stores the names of the cards to match later
      */
    gameContainer.innerHTML += `
     <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before">?</div>
        <div class="card-after">
        <img src="${cardValues[i].image}" class="image"/></div>
     </div>
     `;
  }
  //Grid
  gameContainer.style.gridTemplateColumns = `repeat(${11},auto)`;

  //Cards
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      //If selected card is not matched yet then only run (i.e already matched card when clicked would be ignored)
      if (!card.classList.contains("matched")) {
        //Flip the cliked card
        card.classList.add("flipped");
        //If it is the firstcard (!firstCard since firstCard is initially false)
        if (!firstCard) {
          //So current card will become firstCard
          firstCard = card;
          //Current cards value becomes firstCardValue
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          //Increment moves since user selected second card
          movesCounter();
          //SecondCard and value
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            //Ff both cards match add matched class so these cards would be ignored next time
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            //Set firstCard to false since next card would be first now
            firstCard = false;
            //WinCount increment as user found a correct match
            winCount += 1;
            //Check if winCount == half of cardValues
            if (winCount == Math.floor(cardValues.length / 2)) {
              result.innerHTML = `<h2>Bạn đã thắng</h2>
            <h4>Lượt đã chọn: ${movesCount}</h4>`;
              stopGame();
            }
          } else {
            //If the cards dont match
            //Flip the cards back to normal
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    });
  });
};

//Start game
startButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  //Controls amd buttons visibility
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
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
    const confirmStopGame = confirm("Bạn có muốn dừng trò chơi?");

    if (confirmStopGame) {
      controls.classList.remove("hide");
      stopButton.classList.add("hide");
      startButton.classList.remove("hide");
      clearInterval(interval);
    }
  })
);

//Initialize values and func calls
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};
