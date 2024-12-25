const today = new Date()
const date = today.getDate()
const month = today.getMonth() + 1
const year = today.getFullYear()
const seed = 6592
// Create an index for today's word
const wordIndex = Number(date.toString() + month.toString() + year.toString()) % seed

let secretWord = ""
let wordLength = 0
let gameOver = false
let guessCount = 0

// Some iOS versions don't consistently fire the "input" event
// as expected when using a virtual keyboard. To be safe, we add
// multiple listeners: "input", "keyup", and "change".
const addInputListeners = (input, container) => {
  const handleInputEvent = () => {
    if (gameOver) return
    if (checkGuessComplete(container)) {
      const guess = Array.from(container.querySelectorAll("input"))
        .map((inp) => inp.value)
        .join("")
      if (guess === secretWord) {
        gameOver = true
        Array.from(container.querySelectorAll("input")).forEach((inp) => {
          inp.style.borderColor = "green"
        })
        document.getElementById("message").textContent =
          `You guessed the word in ${guessCount} guesses!`
      } else {
        colorInputs(container)
        pushGuessBlock(wordLength)
      }
    }
  }

  // We listen to multiple events to ensure iOS Safari triggers our check
  ;["input", "keyup", "change"].forEach((evt) => {
    input.addEventListener(evt, (e) => {
      if (gameOver) return
      if (input.value !== "") {
        const nextInput = input.nextElementSibling
        if (nextInput) nextInput.focus()
      }
      handleInputEvent()
    })
  })
}

const checkGuessComplete = (container) => {
  const inputs = container.querySelectorAll("input")
  return Array.from(inputs).every((inp) => inp.value.trim() !== "")
}

const colorInputs = (container) => {
  const inputs = container.querySelectorAll("input")
  Array.from(inputs).forEach((inp, index) => {
    const currentLetter = inp.value.trim().toLowerCase()
    const secretLetter = secretWord[index].toLowerCase()
    if (!currentLetter || currentLetter.length !== 1 || !/^[a-z]$/.test(currentLetter)) {
      inp.style.borderColor = "gray"
      return
    }
    if (currentLetter === secretLetter) {
      inp.style.borderColor = "green"
    } else if (currentLetter.charCodeAt(0) < secretLetter.charCodeAt(0)) {
      inp.style.borderColor = "#70d9e7"
    } else {
      inp.style.borderColor = "#ca3555"
    }
  })
}

const createGuessContainer = (numLetters) => {
  const container = document.createElement("div")
  container.classList.add("guess-block")
  for (let i = 0; i < numLetters; i++) {
    const input = document.createElement("input")
    input.type = "text"
    input.maxLength = 1
    input.classList.add("letter-box")
    addInputListeners(input, container)
    container.appendChild(input)
  }
  return container
}

const pushGuessBlock = (numLetters) => {
  if (gameOver) return
  guessCount++
  const container = createGuessContainer(numLetters)
  document.getElementById("guess-container").appendChild(container)
}

addEventListener("load", () => {
  // Use the dictionary from dictionary.js
  secretWord = dict[wordIndex]
  wordLength = secretWord.length
  pushGuessBlock(wordLength)
  console.log(secretWord)
})
