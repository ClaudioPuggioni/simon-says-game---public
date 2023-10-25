let containerEl = document.querySelector(".container");
let preStartScreenEl = document.querySelector("#preStartScreen");
let loaderCogsEl = document.querySelector(".loader");

let tapOnClips = document.querySelector("#tapOn");
let tapOutClips = document.querySelector("#tapOut");
let wheelClickEl = document.querySelector("#wheelClick");
let wheelHighlightEl = document.querySelector("#wheelHighlight");

let buttonEl = document.querySelector("#startButton");
let switchOnEl = document.querySelector("#switchON");
let switchOffEl = document.querySelector("#switchOFF");
let pressedEl = document.querySelector("#pressed");

let correctClickEl = document.querySelector("#correctClick");
let gameOverEl = document.querySelector("#gameOver");
let roundWinEl = document.querySelector("#roundWin");

function startGame() {
  preStartScreenEl.classList.add("loaded");

  setTimeout(() => {
    preStartScreenEl.style.opacity = "0";
    preStartScreenEl.style.display = "none";
    preStartScreenEl.style.visibility = "hidden";
    preStartScreenEl.style.zIndex = "-9001";
  }, 2000);

  setTimeout(() => {
    loaderCogsEl.classList.add("loaded");
  }, 6000);
  setTimeout(() => {
    loaderCogsEl.style.display = "none";
    loaderCogsEl.style.visibility = "hidden";
    loaderCogsEl.style.zIndex = "-9001";
  }, 8000);
}

let colorObj = { g: document.querySelector("#circleDiv1"), r: document.querySelector("#circleDiv2"), y: document.querySelector("#circleDiv3"), b: document.querySelector("#circleDiv4") };
let colorShadows = { g: "2px 2px 20px 7px #3ecb74", r: "2px 2px 20px 7px #f52e16", y: "2px 2px 20px 7px #ece02e", b: "2px 2px 20px 7px #38a0eb" };

for (const index in colorObj) {
  wheelClickEl.volume = 0.5;

  function onHover(e) {
    e.preventDefault();

    tapOnClips.load();
    tapOnClips.play();
  }

  function onHoverOut(e) {
    e.preventDefault();

    tapOutClips.load();
    tapOutClips.play();
  }

  function onClick(e) {
    e.preventDefault();
    wheelClickEl.load();
    wheelClickEl.play();
  }

  colorObj[index].addEventListener("mouseover", onHover);
  colorObj[index].addEventListener("mouseout", onHoverOut);
  colorObj[index].addEventListener("click", onClick);
}

switchOnEl.volume = 0.5;
switchOffEl.volume = 0.5;
pressedEl.volume = 0.5;

function onHoverSButton(e) {
  e.preventDefault();

  switchOnEl.load();
  switchOnEl.play();
}

function onHoverOutSButton(e) {
  e.preventDefault();

  switchOffEl.load();
  switchOffEl.play();
}

function onClickSButton(e) {
  e.preventDefault();

  pressedEl.load();
  pressedEl.play();
  play();
  containerEl.classList.add("cursorDisappear");
  setTimeout(() => {
    containerEl.classList.remove("cursorDisappear");
  }, 1000);
}

buttonEl.addEventListener("mouseover", onHoverSButton);
buttonEl.addEventListener("mouseout", onHoverOutSButton);
buttonEl.addEventListener("click", onClickSButton);

function getNewWord(level) {
  let colors = "gryb";
  let output = "";
  for (let index = 0; index < level; index++) {
    output += colors[Math.floor(Math.random() * colors.length)];
  }
  return output;
}

function animate(word) {
  let colorObj = { g: document.querySelector("#circleDiv1"), r: document.querySelector("#circleDiv2"), y: document.querySelector("#circleDiv3"), b: document.querySelector("#circleDiv4") };
  let colorShadows = { g: "2px 2px 20px 7px #3ecb74", r: "2px 2px 20px 7px #f52e16", y: "2px 2px 20px 7px #ece02e", b: "2px 2px 20px 7px #38a0eb" };

  for (const index in colorObj) {
    colorObj[index].style.pointerEvents = "none";
  }

  containerEl.classList.add("cursorDisappear");

  for (let index = 0; index < word.length; index++) {
    setTimeout(() => {
      setTimeout(() => {
        colorObj[word[index]].style.boxShadow = colorShadows[word[index]];
        colorObj[word[index]].style.zIndex = "9001";
        wheelHighlightEl.play();
      }, Number(`${index + 1}000`));

      setTimeout(() => {
        colorObj[word[index]].style.boxShadow = "";
        colorObj[word[index]].style.zIndex = "";
      }, Number(`${index + 1}200`));
    }, Number(`${index + 1}`));
  }

  setTimeout(() => {
    for (const index in colorObj) {
      colorObj[index].style.pointerEvents = "";
    }
    containerEl.classList.remove("cursorDisappear");
  }, Number(`${word.length - 1 + 1}200`));
}

function checkInput(selectedColor, word, tapsLeft, level) {
  document.querySelector("#userInput").innerText = "";

  if (word[0] === selectedColor) {
    word = word.slice(1);

    correctClickEl.load();
    correctClickEl.play();

    if (word.length === 0) {
      roundWinEl.play();
      play(level + 1);
    } else {
      parseLevel(word, tapsLeft, level);
    }
  } else {
    gameOverEl.play();

    document.querySelector("#txtTapsLeft1").innerText = "Game Over!";
    document.querySelector("#txtTapsLeft2").innerText = `Your score is ${level - 1}.`;
    document.querySelector("#circleSector").style.pointerEvents = "none";
    buttonEl.classList.add("buttonReappear");
    buttonEl.classList.remove("buttonVanish");
    setTimeout(() => {
      buttonEl.classList.remove("buttonReappear");
    }, 1000);
  }
}

function parseLevel(remainingWord, tapsLeft, level, firstTime) {
  let colorObj = { g: document.querySelector("#circleDiv1"), r: document.querySelector("#circleDiv2"), y: document.querySelector("#circleDiv3"), b: document.querySelector("#circleDiv4") };

  if (level === 1 && firstTime) {
    for (const index in colorObj) {
      wheelClickEl.muted = "true";
      colorObj[index].addEventListener("click", function correctlyClicked(onClick) {
        onClick.preventDefault();
        document.querySelector("#userInput").innerText = index;
        document.querySelector("#txtTapsLeft2").innerText -= 1;
      });
    }
  }

  const standby = async (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

  async function waitForUser() {
    while (document.querySelector("#userInput").innerText.length < 1) await standby(10);
    checkInput(document.querySelector("#userInput").innerText, remainingWord, tapsLeft, level);
  }

  waitForUser();
}

let firstTime = true;

function play(length = 1) {
  buttonEl.classList.add("buttonVanish");

  document.querySelector("#txtTapsLeft1").innerText = "Taps Left:";
  document.querySelector("#userInput").innerText = "";
  document.querySelector("#circleSector").style.pointerEvents = "";

  let currentWord = getNewWord(length);
  let tapsLeft = currentWord.length;

  document.querySelector("#txtTapsLeft2").innerText = tapsLeft;

  animate(currentWord);

  parseLevel(currentWord, tapsLeft, tapsLeft, firstTime);

  firstTime = false;
}
