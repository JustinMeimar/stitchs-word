
const today = new Date();
const options = { timeZone: "America/Denver" };
const localDate = new Date(today.toLocaleString("en-US", options));

const date = localDate.getDate();
const month = localDate.getMonth() + 1;
const year = localDate.getFullYear();

const seed = 6592;
const wordIndex = Number(date.toString() + month.toString() + year.toString()) % seed;

// mutable state
let secretWord = "";
let wordLength = 0;

const checkGuessComplete = (container) => {
  const inputs = container.querySelectorAll("input");
  return Array.from(inputs).every((input) => input.value.trim() !== "");
};

const colorInputs = (container) => {
  const inputs = container.querySelectorAll("input");
  Array.from(inputs).forEach((input, index) => {
    const currentLetter = input.value;
    const secretLetter = secretWord[index];

    if (currentLetter === secretLetter) {
      input.style.borderColor = "green";
    } else if (currentLetter < secretLetter) {
      input.style.borderColor = "#70d9e7";
    } else {
      input.style.borderColor = "#ca3555";
    }
  });
};

// Function to create the guess container
const createGuessContainer = (numLetters) => {
  const container = document.createElement("div");
  container.classList.add("guess-block");

  for (let i = 0; i < numLetters; i++) {

    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 1;
    input.classList.add("letter-box");

    input.addEventListener("input", (e) => {
      const currentInput = e.target;
      const nextInput = currentInput.nextElementSibling;

      // auto focus the next input box
      if (nextInput && currentInput.value !== "") {
        nextInput.focus();
      }

      if (checkGuessComplete(container)) {
        const guess = Array.from(container.querySelectorAll("input"))
          .map((input) => input.value)
          .join("");

        if (guess === secretWord) {
          alert("Correct! 🎉");
          Array.from(container.querySelectorAll("input")).forEach((input) => {
            input.style.borderColor = "green";
          });
        } else {
          colorInputs(container);
          pushGuessBlock(wordLength);
        }
      }
    });
    container.appendChild(input);
  }

  return container;
};

const pushGuessBlock = (numLetters) => {
  const container = createGuessContainer(numLetters);
  const guessDiv = document.getElementById("guess-container");
  guessDiv.appendChild(container);
};

addEventListener("load", (_event) => {
  secretWord = dict[wordIndex];
  wordLength = secretWord.length;

  pushGuessBlock(wordLength);
  console.log(secretWord);
});

