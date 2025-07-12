import { useCallback, useEffect, useRef, useState } from "react";

export default function useTimer(isRunning) {
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef?.current);
  }, [isRunning]);

  const reset = useCallback(() => {
    setSeconds(0);
    clearInterval(timerRef?.current);
    // Restart timer if isRunning is true
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
  }, [isRunning]);

  return { seconds, reset };
}
