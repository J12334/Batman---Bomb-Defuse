class AudioController{
  constructor() {
      this.bgMusic = new Audio('bgm.mp3');
      this.bgMusic.volume = 0.4;
  }
  startMusic(){
    this.bgMusic.currentTime = 0;
    this.bgMusic.play();
  }
  stopMusic(){
    this.bgMusic.pause();
    this.bgMusic.currentTime = 0;
  }

}










let getinstruction = document.getElementsByClassName("ino");
let instructions = document.getElementsByClassName("instructions");
let menu = document.getElementsByClassName("menu");
let backtomenu = document.getElementsByClassName("goback");
let startgame = document.getElementsByClassName("startgame");
let game = document.getElementsByClassName("game");


console.log(getinstruction);

this.ac = new AudioController()
ac.stopMusic();

function abc(){
  menu[0].classList.add("invisible");
  instructions[0].classList.remove("invisible");
};

function btm(){
  instructions[0].classList.add("invisible");
  menu[0].classList.remove("invisible");
};


function start(){
  startInteraction();
  menu[0].classList.add("invisible");
  game[0].classList.remove("invisible");
};


let timerall = document.getElementsByClassName("timer");
let timer = timerall[0];

let totaltimetocountdown = 90;



// function updateCountdown(){
//   let ts = totaltimetocountdown;
//   timer.innerHTML = `${ts}`;
//   totaltimetocountdown--;
// }






const WORD_LENGTH = 5
const FLIP_ANIMATION_DURATION = 500
const DANCE_ANIMATION_DURATION = 500
const keyboard = document.querySelector("[data-keyboard]")
const alertContainer = document.querySelector("[data-alert-container]")
const guessGrid = document.querySelector("[data-guess-grid]")
const tw = Math.floor(Math.random() * 100000)
const targetWord = tw.toString();

console.log(targetWord);
console.log(typeof(targetWord));


function startInteraction() {
  setInterval(() => {
    let ts = totaltimetocountdown;
    timer.innerHTML = `${ts}`;
    totaltimetocountdown--;
    if(totaltimetocountdown <= 0){
      stopInteraction();
      showAlert(targetWord, 5000);
    }
  }, 1000);
  clearInterval(timer);
  this.ac = new AudioController()
  ac.startMusic();
  document.addEventListener("click", handleMouseClick)
  document.addEventListener("keydown", handleKeyPress)
  // updateCountdown();
}

function stopInteraction() {
  this.ac = new AudioController()
  ac.stopMusic();
  document.removeEventListener("click", handleMouseClick)
  document.removeEventListener("keydown", handleKeyPress)
}

function handleMouseClick(e) {
  if (e.target.matches("[data-key]")) {
    pressKey(e.target.dataset.key)
    return
  }

  if (e.target.matches("[data-enter]")) {
    submitGuess()
    return
  }

  if (e.target.matches("[data-delete]")) {
    deleteKey()
    return
  }
}

function handleKeyPress(e) {
  if (e.key === "Enter") {
    submitGuess()
    return
  }

  if (e.key === "Backspace" || e.key === "Delete") {
    deleteKey()
    return
  }

  if (e.key.match(/^[0-9]$/)) {
    /* a-z ke beechme sab hai kya uske liye regular expression */
    pressKey(e.key)
    return
  }
}

function pressKey(key) {
  const activeTiles = getActiveTiles()
  if (activeTiles.length >= WORD_LENGTH) return
  const nextTile = guessGrid.querySelector(":not([data-letter])")
  // nextTile.dataset.letter = key.toLowerCase()
  nextTile.dataset.letter = key;
  nextTile.textContent = key
  nextTile.dataset.state = "active"
}

function deleteKey() {
  const activeTiles = getActiveTiles()
  const lastTile = activeTiles[activeTiles.length - 1]
  if (lastTile == null) return
  lastTile.textContent = ""
  delete lastTile.dataset.state
  delete lastTile.dataset.letter
}

function submitGuess() {
  const activeTiles = [...getActiveTiles()]
  // const activeTiles = getActiveTiles();
  if (activeTiles.length !== WORD_LENGTH) {
    // showAlert("Not enough letters")
    // shakeTiles(activeTiles)
    return
  }
  
  // let guess = 0;
  
  // activeTiles.forEach((tile) => {

  //    guess = (guess * 10) + Number(tile.dataset.letter);

  // });

  const guess = activeTiles.reduce((guess, tile) => {
    
      return (guess * 10) + Number(tile.dataset.letter);

  },0);
 
  // if (!dictionary.includes(guess)) {
  //   showAlert("Not in word list")
  //   shakeTiles(activeTiles)
  //   return
  // }
 
  console.log(guess);
  stopInteraction()
  activeTiles.forEach((...params) => flipTile(...params, guess))
}

function flipTile(tile, index, array, guess) {
  const letter = tile.dataset.letter
  const key = keyboard.querySelector(`[data-key="${letter}"i]`)
  setTimeout(() => {
    tile.classList.add("flip")
  }, (index * FLIP_ANIMATION_DURATION) / 2)

  tile.addEventListener(
    "transitionend",
    () => {
      tile.classList.remove("flip")
      if (Number(targetWord[index]) === Number(letter)) {
               tile.dataset.state = "correct"
              //  key.classList.add("correct")
      }else{
            
            if(Math.abs(Number(targetWord[index]) - Number(letter)) > 6){
               tile.dataset.state = "red";
            }else if(Math.abs(Number(targetWord[index]) - Number(letter)) > 3){
               tile.dataset.state = "orange";
            }else{
               tile.dataset.state = "yellow";
            }
            
      } 
      

      if (index === array.length - 1) {
        tile.addEventListener(
          "transitionend",
          () => {
            startInteraction()
            checkWinLose(guess, array)
          }, {
            once: true
          }
        )
      }
    }, {
      once: true
    }
  )
}

function getActiveTiles() {
  return guessGrid.querySelectorAll('[data-state="active"]')
}

function showAlert(message, duration = 1000) {
  const alert = document.createElement("div")
  alert.textContent = message
  alert.classList.add("alert")
  alertContainer.prepend(alert)
  if (duration == null) return

  setTimeout(() => {
    alert.classList.add("hide")
    alert.addEventListener("transitionend", () => {
      alert.remove()
    })
  }, duration)
}

function shakeTiles(tiles) {
  tiles.forEach(tile => {
    tile.classList.add("shake")
    tile.addEventListener(
      "animationend",
      () => {
        tile.classList.remove("shake")
      }, {
        once: true
      }
    )
  })
}

function checkWinLose(guess, tiles) {
  if (guess === Number(targetWord)) {
    showAlert("You Win", 5000)
    danceTiles(tiles)
    stopInteraction()
    return
  }

  const remainingTiles = guessGrid.querySelectorAll(":not([data-letter])")
  if (remainingTiles.length === 0) {
    showAlert(targetWord.toUpperCase(), null)
    stopInteraction()
  }
}

// function danceTiles(tiles) {
//   tiles.forEach((tile, index) => {
//     setTimeout(() => {
//       tile.classList.add("dance")
//       tile.addEventListener(
//         "animationend",
//         () => {
//           tile.classList.remove("dance")
//         }, {
//           once: true
//         }
//       )
//     }, (index * DANCE_ANIMATION_DURATION) / 5)
//   })
// }