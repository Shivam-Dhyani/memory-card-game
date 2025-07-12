import { useEffect, useState } from "react";
import usePrevious from "./usePrevious";

const STORAGE_KEY = "memory-game-best-scores";

export default function useBestScore(difficulty, currentTime, hasWon) {
  const [bestScore, setBestScore] = useState(null);
  const prevHasWon = usePrevious(hasWon);

  // Load best score when difficulty changes
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    setBestScore(stored[difficulty] || null);
  }, [difficulty]);

  // Save best score only once right after a win
  useEffect(() => {
    if (!prevHasWon && hasWon) {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
      const existing = stored[difficulty];

      if (!existing || currentTime < existing) {
        const updated = { ...stored, [difficulty]: currentTime };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setBestScore(currentTime);
      }
    }
  }, [hasWon, prevHasWon, currentTime, difficulty]);

  return bestScore;
}
