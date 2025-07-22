import { useEffect, useState } from "react";
import usePrevious from "./usePrevious";

const STORAGE_KEY = "memory-game-best-scores";

export default function useBestScore(difficulty, currentTime, hasWon) {
  const [bestScore, setBestScore] = useState(null);
  const prevHasWon = usePrevious(hasWon);

  // Detect if input is already in mm:ss format
  const isFormattedTime = (value) => {
    return typeof value === "string" && /^\d{2}:\d{2}$/.test(value);
  };

  // Helper to convert seconds to mm:ss format (only if needed)
  const formatTime = (value) => {
    if (isFormattedTime(value)) return value; // Don't re-format
    const totalSeconds = Number(value);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // Load best score from localStorage on mount or difficulty change
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    const best = stored[difficulty];
    setBestScore(best ?? null);
  }, [difficulty]);

  // Update best score in localStorage only once after a win
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

  const formattedBestScore = bestScore !== null ? formatTime(bestScore) : null;

  return { raw: bestScore, formatted: formattedBestScore };
}
