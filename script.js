const today = new Date()
const options = { timeZone: "America/Denver" }
const localDate = new Date(today.toLocaleString("en-US", options))
const date = localDate.getDate()
const month = localDate.getMonth() + 1
const year = localDate.getFullYear()
const seed = 6592
const wordIndex = Number(date.toString() + month.toString() + year.toString()) % seed

let secretWord = ""
let wordLength = 0
let gameOver = false
let guessCount = 0

const checkGuessComplete = (container) => {
  const inputs = container.querySelectorAll("input")
  return Array.from(inputs).every((input) => input.value.trim() !== "")
}

const colorInputs = (container) => {
  const inputs = container.querySelectorAll("input")
  Array.from(inputs).forEach((input, index) => {
    const currentLetter = input.value.trim().toLowerCase()
    const secretLetter = secretWord[index].toLowerCase()
    if (!currentLetter || currentLetter.length !== 1 || !/^[a-z]$/.test(currentLetter)) {
      input.style.borderColor = "gray"
      return
    }
    if (currentLetter === secretLetter) {
      input.style.borderColor = "green"
    } else if (currentLetter.charCodeAt(0) < secretLetter.charCodeAt(0)) {
      input.style.borderColor = "#70d9e7"
    } else {
      input.style.borderColor = "#ca3555"
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
    input.addEventListener("input", (e) => {
      if (gameOver) return
      const currentInput = e.target
      const nextInput = currentInput.nextElementSibling
      if (nextInput && currentInput.value !== "") {
        nextInput.focus()
      }
      if (checkGuessComplete(container)) {
        const guess = Array.from(container.querySelectorAll("input"))
          .map((inp) => inp.value)
          .join("")
        if (guess === secretWord) {
          gameOver = true
          Array.from(container.querySelectorAll("input")).forEach((inp) => {
            inp.style.borderColor = "green"
          })
          document.getElementById("message").textContent = `You guessed the word in ${guessCount} guesses!`
        } else {
          colorInputs(container)
          pushGuessBlock(wordLength)
        }
      }
    })
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
  secretWord = dict[wordIndex]
  wordLength = secretWord.length
  pushGuessBlock(wordLength)
  console.log(secretWord)
})
