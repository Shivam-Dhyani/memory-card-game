import { useCallback, useEffect, useRef, useState } from "react";

export default function useTimer(isRunning) {
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);

  // Function to format seconds as mm:ss
  const formatTime = (totalSeconds) => {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const secs = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  const formattedTime = formatTime(seconds);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const reset = useCallback(() => {
    setSeconds(0);
    clearInterval(timerRef.current);
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
  }, [isRunning]);

  return { seconds, formattedTime, reset };
}
