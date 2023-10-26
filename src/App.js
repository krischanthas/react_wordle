import "./styles.css";
import { useState, useEffect } from "react";
import API_WORDS from "./data";

// const API_URL = "https://api.frontendexpert.io/api/fe/wordle-words";
const WORD_LENGTH = 5;

export default function App() {
  const [solution, setSolution] = useState("");
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const handleUserType = (event) => {
      if (gameOver) return;

      // handle Enter press
      if (event.key === "Enter") {
        if (currentGuess.length !== 5) return;

        // handle case when attempt is made
        const newGuesses = [...guesses];
        newGuesses[guesses.findIndex((val) => val === null)] = currentGuess;
        setGuesses(newGuesses);
        setCurrentGuess("");

        // handle case when correct
        const isCorrect = currentGuess === solution;

        if (isCorrect) {
          setGameOver(true);
          setResult("Winner!");
        }

        // handle user exhausted attempts
        if (guesses[guesses.length - 2] !== null) {
          setGameOver(true);
          setResult("Loser...");
        }
      }

      // handle Backspace press
      if (event.key === "Backspace") {
        setCurrentGuess(currentGuess.slice(0, -1));
        return;
      }

      // Reached 5 characters
      if (currentGuess.length >= 5) return;
      const isValidLetter = event.key.match(/^[a-z]{1}$/);
      if (isValidLetter) {
        setCurrentGuess((currentGuess + event.key).toUpperCase());
      }
    };

    window.addEventListener("keydown", handleUserType);

    return () => {
      window.removeEventListener("keydown", handleUserType);
    };
  }, [currentGuess, gameOver, solution, guesses]);

  useEffect(() => {
    const fetchWords = async () => {
      const response = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(API_WORDS);
        }, 300);
      });

      const words = await response;
      const randomWord = words[Math.floor(Math.random() * words.length)];
      setSolution(randomWord);
    };

    fetchWords();
  }, []);

  return (
    <div className="App">
      {guesses.map((guess, idx) => {
        const isCurrentGuess = idx === guesses.findIndex((val) => val === null);
        return (
          <div key={idx}>
            <Line
              guess={isCurrentGuess ? currentGuess : guess ?? ""}
              solution={solution}
              lineSubmitted={!isCurrentGuess && guess !== null}
            />
          </div>
        );
      })}
      <h1>{result !== null && result}</h1>
    </div>
  );
}

function Line({ guess, lineSubmitted, solution }) {
  const tiles = [];

  for (let i = 0; i < WORD_LENGTH; i++) {
    const char = guess[i];
    let className = "tile";

    if (lineSubmitted) {
      if (char === solution[i]) {
        className += " correct";
      } else if (solution.includes(char)) {
        className += " close";
      } else {
        className += " incorrect";
      }
    }

    tiles.push(
      <div key={i} className={className}>
        {char}
      </div>
    );
  }
  return (
    <div className="line">
      {tiles.map((tile, idx) => (
        <Tile key={idx} letter={tile} />
      ))}
    </div>
  );
}

function Tile({ letter }) {
  return <div className="tile">{letter}</div>;
}
