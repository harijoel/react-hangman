import { useCallback, useEffect, useState } from "react"
import HangmanDrawing from "./HangmanDrawing"
import HangmanWord from "./HangmanWord"
import Keyboard from "./Keyboard"
import words from "./wordList.json"

function getWord() {
  return words[Math.floor(Math.random() * words.length)]
}

function App() {
  const [wordToGuess, setWordToGuess] = useState(getWord)
  const [guessedLetters, setGuessedLetters] = useState<string[]>([])

  const incorrectLetters = guessedLetters.filter(
    letter => !wordToGuess.includes(letter)
  )

  const isLoser = incorrectLetters.length >= 6
  const isWinner = wordToGuess.split("").every(letter => guessedLetters.includes(letter))

  // Add guessed letter to State of Guessed letters if it is not there
  const addGuessedLetter = useCallback(
    (letter: string) => {
      if (guessedLetters.includes(letter) || isLoser || isWinner) return

      setGuessedLetters(currentLetters => [...currentLetters, letter])
    },
    [guessedLetters, isWinner, isLoser]
  )

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key
      // Ignore pressed key if it is not a letter
      if (!key.match(/^[a-z]$/)) return
      
      // Prevent default and try to Add key to guessed letter
      e.preventDefault()
      addGuessedLetter(key)
    }

    document.addEventListener("keypress", handler)

    // Make sure clean this up and remove this even listener
    // whenever our use even is done working (like when component is removed)
    return () => {
      document.removeEventListener("keypress", handler)
    }
  }, [guessedLetters])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key
      if (key !== "Enter") return
      
      e.preventDefault
      setGuessedLetters([])
      setWordToGuess(getWord())
    }

    document.addEventListener("keypress", handler)

    // Make sure clean this up and remove this even listener
    // whenever our use even is done working (like when component is removed)
    return () => {
      document.removeEventListener("keypress", handler)
    }
  }, [guessedLetters])

  console.log(wordToGuess)
  return (
    <div
      style={{
        maxWidth: "800px",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        margin: "0 auto",
        alignItems: "center",
      }}>

      <div style={{ fontSize: "2rem", textAlign: "center" }}>
        {isWinner && "Winner! - Refresh to try again"}
        {isLoser && "Nice Try! - Refresh to try again"}
      </div>
      <HangmanDrawing numberOfGuesses={incorrectLetters.length} />
      <HangmanWord 
        reveal={isLoser}
        guessedLetters={guessedLetters} 
        wordToGuess={wordToGuess} 
      />
      <div style={{ alignSelf: "stretch" }} >
        <Keyboard 
          disabled={isWinner || isLoser}
          activeLetters={guessedLetters.filter(letter => 
            wordToGuess.includes(letter)
          )}
          inactiveLetters={incorrectLetters} 
          addGuessedLetter={addGuessedLetter}
        />
      </div>

    </div>
  )
}

export default App
