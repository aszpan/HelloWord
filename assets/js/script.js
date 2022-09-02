//Some global variables that will need to be accessed at a later point.
const WORD_LENGTH = 5;
const FLIP_ANIMATION_DURATION = 500
const DANCE_ANIMATION_DURATION= 500
const keyboard = document.querySelector("[data-keyboard]");
const alertContainer = document.querySelector("[data-alert-container]");
const guessGrid = document.querySelector("[data-guess-grid]");
var targetWord;

startInteraction();

// starts to listen to keys being pressed
function startInteraction() {
  document.addEventListener("click", handleMouseClick);
  document.addEventListener("keydown", handleKeyPress);
}

function stopInteraction() {
  document.removeEventListener("click", handleMouseClick);
  document.removeEventListener("keydown", handleKeyPress);
}

// the mouse click
function handleMouseClick(e) {
  if (e.target.matches("[data-key]")) {
    pressKey(e.target.dataset.key);
    return;
  }

  if (e.target.matches("[data-enter]")) {
    submitGuess();
    return;
  }

  if (e.target.matches("[data-delete]")) {
    deleteKey();
    return;
  }
}

// handle the keys pressed on keyboard
function handleKeyPress(e) {
  //console.log(e);
  if (e.key === "Enter") {
    submitGuess();
    return;
  }

  if (e.key === "Backspace" || e.key === "Delete") {
    deleteKey();
    return;
  }

  if (e.key.match(/^[a-z]$/)) {
    pressKey(e.key);
    return;
  }
}

function pressKey(key) {
  const activeTiles = getActiveTiles();
  if (activeTiles.length >= WORD_LENGTH) return;
  const nextTile = guessGrid.querySelector(":not([data-letter])");
  nextTile.dataset.letter = key.toLowerCase();
  nextTile.textContent = key;
  nextTile.dataset.state = "active";
}

// handles deleting a key thats on game board
function deleteKey() {
  const activeTiles = getActiveTiles();
  const lastTile = activeTiles[activeTiles.length - 1];
  if (lastTile == null) return;
  lastTile.textContent = "";
  delete lastTile.dataset.state;
  delete lastTile.dataset.letter;
}


function submitGuess() {
  const activeTiles = [...getActiveTiles()]
  if (activeTiles.length !== WORD_LENGTH) {
    //console.log("not")
    showAlert('Not Enough Letters')
    shakeTiles(activeTiles)
    return
  }
  const guess = activeTiles.reduce((word, tile) => {

    return word + tile.dataset.letter
  }, "")
  //console.log(guess);

  if (guess == targetWord) {
    //console.log("You Win");
  } else {
    
  }


  stopInteraction()
  activeTiles.forEach((...params) => flipTile(...params, guess))
}

function flipTile(tile, index, array, guess) {
  const letter = tile.dataset.letter
  const key = keyboard.querySelector(`[data-key="${letter}"i]`)
  setTimeout(() => {
    tile.classList.add("flip")
  }, (index * FLIP_ANIMATION_DURATION) / 2)
  tile.addEventListener("transitionend", () => {
    tile.classList.remove("flip")
    if (targetWord[index] === letter) {
      tile.dataset.state = "correct"
      key.classList.add("correct")
    } else if (targetWord.includes(letter)) {
      tile.dataset.state = "wrong-location"
      key.classList.add("wrong-location")
    } else {
      tile.dataset.state = "wrong"
      key.classList.add("wrong")
    }
    if (index === array.length - 1 ) {
      tile.addEventListener("transitionend", () => {
        startInteraction()
        checkWinLose(guess, array)
      }, { once: true })
     
    }
  }, { once:true })
}

function getActiveTiles() {
  return guessGrid.querySelectorAll('[data-state="active"]')

}

function shakeTiles(tiles) {
  tiles.forEach(tile => {
    tile.classList.add("shake")
    tile.addEventListener("animationend", () => {
      tile.classList.remove("shake")
    }, { once: true })
  })
}

function showAlert(message, duration = 1000) {
  const alert = document.createElement("div")
  alert.textContent = message
  alert.classList.add("alert")
  alertContainer.prepend(alert)
  if (duration == null) return

  setTimeout(() => {
    alert.classList.add("hide")
    addEventListener("transitionend", () => {
      alert.remove()
    })
  }, duration)

}

function checkWinLose(guess, tiles) {
  console.log(guess);
  console.log(targetWord);
  if (guess == targetWord) {
    showAlert("YOU WIN!", 5000)
    danceTiles(tiles)
    stopInteraction()
    return
  }
  const remainingTiles = guessGrid.querySelectorAll(":not([data-letter]")
  if (remainingTiles.length === 0) {
    showAlert(targetWord.toLocaleUpperCase(), null)
    stopInteraction()
  }
}

function danceTiles(tiles) {
  tiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add("dance")
    tile.addEventListener("animationend", () => {
      tile.classList.remove("dance")
    }, { once: true })
  }, index * DANCE_ANIMATION_DURATION / 5)
  })
}


///added 8/23 @ 7:33pm

var easyEl = document.getElementById("easy");
var mediumEl = document.getElementById("medium");
var hardEl = document.getElementById("hard");
var submitBtnEl = document.getElementById("submit-btn");



document.addEventListener('DOMContentLoaded', () => {
  // Functions to open and close a modal
  function openModal($el) {
    $el.classList.add('is-active');

  }

  function closeModal($el) {
    $el.classList.remove('is-active');
  }

  function closeAllModals() {
    (document.querySelectorAll('.modal') || []).forEach(($modal) => {
      closeModal($modal);
    });
  }

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);

    $trigger.addEventListener('click', () => {
      openModal($target);
    });
  });
  (document.querySelectorAll('.js-modal-trigger2') || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);

    $trigger.addEventListener('click', () => {
      openModal($target);
    });
  });


  // Add a click event on various child elements to close the parent modal
  (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
    const $target = $close.closest('.modal');

    $close.addEventListener('click', () => {
      closeModal($target);
    });
  });


  // Add a keyboard event to close all modals
  document.addEventListener('keydown', (event) => {
    const e = event || window.event;

    if (e.keyCode === 27) { // Escape key
      closeAllModals();
    }
  });
});
//Function that waits for the API fetch request to complete and determine what the target word is and then saves that word to local storage. 
function retrieve(_callback) {
  //console.log(localStorage.getItem("selected word"));
  _callback();
  var targetWord = localStorage.getItem("selected word");
  //console.log(selectedWord);
  //wordArr.push(selectedWord);
  //selectedWordArr = selectedWord.split("");
  //console.log(selectedWordArr);
  window.targetWord = targetWord;
  console.log(targetWord);
}

/*Function that runs the first API to generate our random word and then uses
that random word as an input for the next api to find the definition and a 
synonym of that word*/
submitBtnEl.addEventListener("click", function fetchReq() {
  var randomwordrequesturl = "https://random-word-api.herokuapp.com/word?length=5";
  //console.log(randomwordrequesturl);
  fetch(randomwordrequesturl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      var answer = data[0];
      localStorage.setItem("selected word", answer);
      retrieve(()=>{
        console.log(localStorage.getItem("selected word"));
      })
      //console.log(localStorage.getItem("selected word"));
      function getHintsApi() {
        const options = {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': 'df02901123mshf66abc7b8995688p190526jsn4d9ab6e75ba3',
            'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
          }
        };
        
        fetch('https://wordsapiv1.p.rapidapi.com/words/' + data[0] + '/definitions', options)
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            console.log(data);
            console.log(data.definitions[0].definition);
            document.getElementById("hint").innerHTML = data.definitions[0].definition;
            
          })

        fetch("https://wordsapiv1.p.rapidapi.com/words/" + data[0] + "/synonyms", options)
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            console.log(data);
            console.log(data.synonyms[0]);
            console.log(typeof(data.synonyms[0]));
            // document.getElementById("hint2").innerHTML = data.synonyms[0];
            if (typeof(data.synonyms[0]) === "undefined") {
              document.getElementById("hint2").innerHTML = "Sorry, no synonym available.";
            } else if (typeof(data.synonyms[0]) !== "undefined") {
              document.getElementById("hint2").innerHTML = data.synonyms[0];
            }
          })
      }
      getHintsApi();
    })
})

//Function that chooses whether or not the hint buttons are displayed given the users selected difficulty.
function getDifficulty() {
  var difficulty = document.getElementById("difficulty").value;
  console.log(difficulty);
  if (difficulty === "easy") {
    document.querySelector(".js-modal-trigger").style.display = "block";
    document.querySelector(".js-modal-trigger2").style.display = "block";
  } else if (difficulty === "medium") {
    document.querySelector(".js-modal-trigger").style.display = "block";
    document.querySelector(".js-modal-trigger2").style.display = "none";
  } else if (difficulty === "hard") {
    document.querySelector(".js-modal-trigger").style.display = "none";
    document.querySelector(".js-modal-trigger2").style.display = "none";
  }
}
































