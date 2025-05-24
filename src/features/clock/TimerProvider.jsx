"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const TimerContext = createContext();

export function TimerProvider({ children }) {
  const [isDisplayed, setIsDisplayed] = useState(false);
  const [timeInSeconds, setTimeInSeconds] = useState(25 * 60); // Default: 25 minutes
  const [remainingSeconds, setRemainingSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Toggle timer visibility
  const toggleTimer = useCallback(() => {
    setIsDisplayed((prev) => !prev);
  }, []);

  // Start the timer
  const startTimer = useCallback(() => {
    if (remainingSeconds > 0) {
      setIsRunning(true);
      setIsCompleted(false);
    }
  }, [remainingSeconds]);

  // Pause the timer
  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  // Reset the timer
  const resetTimer = useCallback(() => {
    setRemainingSeconds(timeInSeconds);
    setIsRunning(false);
    setIsCompleted(false);
  }, [timeInSeconds]);

  // Set a new timer duration
  const setTimer = useCallback((minutes) => {
    const seconds = minutes * 60;
    setTimeInSeconds(seconds);
    setRemainingSeconds(seconds);
    setIsRunning(false);
    setIsCompleted(false);
  }, []);

  // Timer countdown effect
  useEffect(() => {
    let interval;

    if (isRunning && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsRunning(false);
            setIsCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, remainingSeconds]);

  // Play sound when timer completes
  useEffect(() => {
    if (isCompleted) {
      // Could add sound notification here in the future
      console.log("Timer completed!");
    }
  }, [isCompleted]);

  return (
    <TimerContext.Provider
      value={{
        isDisplayed,
        toggleTimer,
        remainingSeconds,
        isRunning,
        isCompleted,
        startTimer,
        pauseTimer,
        resetTimer,
        setTimer,
        timeInSeconds
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export const useTimer = () => useContext(TimerContext);
