"use client";

import { useEffect, useState, useRef } from "react";
import { useTimer } from "./TimerProvider";
import { useFocus } from "../focus/FocusProvider";
import Panel from "@components/ui/Panel";
import HoverButton from "@components/ui/HoverButton";
import { Play, Pause, RefreshCw, X } from "lucide-react";

function TimerDisplay() {
  const {
    isDisplayed,
    toggleTimer,
    remainingSeconds,
    isRunning,
    isCompleted,
    startTimer,
    pauseTimer,
    resetTimer,
    setTimer
  } = useTimer();

  const { focusMode } = useFocus();
  const panelRef = useRef(null);
  const [fadeIn, setFadeIn] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(25);
  const [isMobile, setIsMobile] = useState(false);

  // Format seconds to MM:SS
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  // Preset timer durations
  const presets = [
    { label: "5", minutes: 5 },
    { label: "15", minutes: 15 },
    { label: "25", minutes: 25 },
    { label: "45", minutes: 45 }
  ];

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target) && isDisplayed && !isRunning) {
        toggleTimer();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDisplayed, isRunning, toggleTimer]);

  const handleCustomMinutesChange = (e) => {
    const value = Number.parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0 && value <= 180) {
      setCustomMinutes(value);
    }
  };

  const applyCustomTimer = () => {
    setTimer(customMinutes);
  };

  // Determine position based on screen size
  const positionClass = isMobile
    ? "left-1/2 -translate-x-1/2 bottom-24" // Center bottom on mobile
    : "sm:left-24 md:left-32 lg:left-40 top-1/2 -translate-y-1/2"; // Right of toolbar on desktop

  return (
    <Panel
      ref={panelRef}
      className={`fixed p-6 z-20 ${positionClass}
        ${focusMode ? "opacity-0 pointer-events-none" : ""}
        ${
          isDisplayed
            ? fadeIn
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95"
            : "opacity-0 scale-95 pointer-events-none"
        }
        transition-all duration-700 ease-in-out
        ${isRunning ? "w-64" : "w-[280px] sm:w-80"}`}
      style={{
        height: "auto",
        minHeight: isRunning ? "160px" : "240px",
        transition: "all 0.7s ease-in-out, height 0.7s ease-in-out, min-height 0.7s ease-in-out"
      }}
    >
      <div className="flex flex-col items-center gap-6 w-full transition-all duration-700 ease-in-out">
        {/* Close button */}
        <div
          className="absolute top-3 right-3 transition-opacity duration-500 ease-in-out"
          style={{ opacity: isRunning ? 0 : 1, pointerEvents: isRunning ? "none" : "auto" }}
        >
          <button className="text-white/60 hover:text-white" onClick={toggleTimer}>
            <X size={18} />
          </button>
        </div>

        {/* Timer display */}
        <div
          className={`text-4xl sm:text-5xl font-mono text-white transition-all duration-500 ease-in-out ${
            isCompleted ? "animate-pulse text-red-400" : ""
          }`}
          style={{ marginTop: isRunning ? "0.5rem" : "1.5rem" }}
        >
          {formatTime(remainingSeconds)}
        </div>

        {/* Timer controls */}
        <div className="flex items-center gap-4 transition-all duration-500 ease-in-out">
          {!isRunning ? (
            <HoverButton
              className="w-12 h-12 flex items-center justify-center rounded-full"
              onClick={startTimer}
              disabled={remainingSeconds === 0}
            >
              <Play size={20} className="ml-1" />
            </HoverButton>
          ) : (
            <HoverButton className="w-12 h-12 flex items-center justify-center rounded-full" onClick={pauseTimer}>
              <Pause size={20} />
            </HoverButton>
          )}

          <HoverButton className="w-12 h-12 flex items-center justify-center rounded-full" onClick={resetTimer}>
            <RefreshCw size={20} />
          </HoverButton>
        </div>

        {/* Preset timers */}
        <div
          className="flex flex-wrap items-center gap-2 w-full justify-center transition-all duration-500 ease-in-out overflow-hidden"
          style={{
            maxHeight: isRunning ? "0" : "80px", // Increased for potential wrapping
            opacity: isRunning ? 0 : 1,
            marginTop: isRunning ? "0" : "0.5rem",
            pointerEvents: isRunning ? "none" : "auto"
          }}
        >
          {presets.map((preset) => (
            <HoverButton key={preset.minutes} className="px-3 py-1 text-sm" onClick={() => setTimer(preset.minutes)}>
              {preset.label}m
            </HoverButton>
          ))}
        </div>

        {/* Custom timer input */}
        <div
          className="flex items-center gap-2 w-full justify-center transition-all duration-500 ease-in-out overflow-hidden"
          style={{
            maxHeight: isRunning ? "0" : "40px",
            opacity: isRunning ? 0 : 1,
            marginTop: isRunning ? "0" : "0.5rem",
            pointerEvents: isRunning ? "none" : "auto"
          }}
        >
          <input
            type="number"
            min="1"
            max="180"
            value={customMinutes}
            onChange={handleCustomMinutesChange}
            className="w-16 px-2 py-1 bg-black/25 border border-white/10 rounded text-white text-center"
          />
          <HoverButton className="px-3 py-1 text-sm" onClick={applyCustomTimer}>
            Set
          </HoverButton>
        </div>
      </div>
    </Panel>
  );
}

export default TimerDisplay;
