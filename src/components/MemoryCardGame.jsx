import { useEffect, useState } from "react";
import Card from "./Card";
import { createShuffledDeck, getPairCount } from "../utils/deckConfig";
import useTimer from "../hooks/useTimer";
import useBestScore from "../hooks/useBestScore";
import useDarkMode from "../hooks/useDarkMode";

const MemoryCardGame = () => {
  const [difficulty, setDifficulty] = useState("easy");
  const [deck, setDeck] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matched, setMatched] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const { seconds, reset: resetTimer } = useTimer(gameStarted);
  const bestScore = useBestScore(difficulty, seconds, hasWon);
  const { isDark, toggle } = useDarkMode();

  const generateDeck = (difficulty) => {
    setDeck(createShuffledDeck(getPairCount(difficulty)));
    setFlipped([]);
    setMoves(0);
    setMatched(0);
    setHasWon(false);
    setDisabled(false);
    setGameStarted(true);
    resetTimer();
  };

  useEffect(() => {
    generateDeck(difficulty);
  }, [difficulty]);

  useEffect(() => {
    if (matched === deck.length / 2 && deck.length > 0) {
      setGameStarted(false);
      setHasWon(true);
    }
  }, [matched, deck]);

  const handleCardClick = (index) => {
    if (disabled || deck[index].isFlipped || deck[index].isMatched) return;

    const newDeck = [...deck];
    newDeck[index].isFlipped = true;
    const newFlipped = [...flipped, index];

    setDeck(newDeck);
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setDisabled(true);
      setMoves((prev) => prev + 1);

      const [first, second] = newFlipped;
      if (newDeck[first].symbol === newDeck[second].symbol) {
        newDeck[first].isMatched = true;
        newDeck[second].isMatched = true;
        setMatched((prev) => prev + 1);
        setFlipped([]);
        setDisabled(false);
      } else {
        setTimeout(() => {
          newDeck[first].isFlipped = false;
          newDeck[second].isFlipped = false;
          setDeck([...newDeck]);
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  return (
    <div>
      <h1 className="title">🧠 Memory Card Game</h1>

      <div className="controls">
        <label>
          <span>Difficulty:</span>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="easy">Easy (4x4)</option>
            <option value="hard">Hard (6x6)</option>
          </select>
        </label>

        <button onClick={() => generateDeck(difficulty)}>🔁 Restart</button>
        <button onClick={toggle}>
          {isDark ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <div className="stats">
        <p>Moves: {moves}</p>
        <p>⏱ Time: {seconds}s</p>
        {bestScore !== null && <p>🏆 Best: {bestScore}s</p>}
      </div>

      <div className={`grid ${difficulty === "hard" ? "grid-hard" : ""}`}>
        {deck.map((card, i) => (
          <Card key={card.id} card={card} onClick={() => handleCardClick(i)} />
        ))}
      </div>

      {hasWon && <h2 className="won-message">🎉 You Won in {seconds}s!</h2>}
    </div>
  );
};

export default MemoryCardGame;
