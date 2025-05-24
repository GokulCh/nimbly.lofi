"use client";

import { useEffect, useState, useRef } from "react";
import { useTimer } from "./TimerProvider";
import { useFocus } from "../focus/FocusProvider";
import Panel from "@components/ui/Panel";
import HoverButton from "@components/ui/HoverButton";
import { Play, Pause, RefreshCw, X, ChevronUp, ChevronDown } from "lucide-react";

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
    setTimer,
    timeInSeconds
  } = useTimer();

  const { focusMode } = useFocus();
  const panelRef = useRef(null);
  const [fadeIn, setFadeIn] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(30);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Format seconds to HH:MM:SS always
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  // Update customMinutes when timeInSeconds changes
  useEffect(() => {
    setCustomMinutes(Math.floor(timeInSeconds / 60));
  }, [timeInSeconds]);

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

  // Handle mouse wheel scrolling
  useEffect(() => {
    const handleWheel = (e) => {
      if (!panelRef.current || isRunning) return;

      // Check if the mouse is over the panel
      const rect = panelRef.current.getBoundingClientRect();
      const isOverPanel =
        e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

      if (isOverPanel) {
        e.preventDefault();

        const currentMinutes = Math.floor(timeInSeconds / 60);
        let newMinutes;

        if (e.deltaY < 0) {
          // Scrolling up - increase time
          newMinutes = Math.min(currentMinutes + 1, 1440); // 24 hours max
        } else {
          // Scrolling down - decrease time
          newMinutes = Math.max(currentMinutes - 1, 1);
        }

        if (newMinutes !== currentMinutes) {
          setTimer(newMinutes);
        }
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: false });
    return () => document.removeEventListener("wheel", handleWheel);
  }, [isRunning, timeInSeconds, setTimer]);

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
        transition-all duration-700 ease-in-out`}
      style={{
        height: "auto",
        transition: "all 0.7s ease-in-out, height 0.7s ease-in-out, min-height 0.7s ease-in-out"
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
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

        {/* Timer display with background and arrows */}
        <div
          className="relative bg-black/20 rounded-lg px-6 py-4 transition-all duration-500 ease-in-out"
          style={{ marginTop: isRunning ? "0.5rem" : "1.5rem" }}
        >
          <div className="flex items-center gap-3">
            {/* Up/Down arrows - only visible when not running */}
            <div
              className={`flex flex-col transition-all duration-300 ${
                isRunning ? "opacity-0 pointer-events-none w-0" : isHovering ? "opacity-80" : "opacity-50"
              }`}
              style={{
                width: isRunning ? "0px" : "16px",
                transition: "all 0.3s ease-in-out"
              }}
            >
              <ChevronUp size={16} />
              <ChevronDown size={16} className="-mt-1" />
            </div>

            {/* Timer text */}
            <div
              className={`text-4xl sm:text-5xl font-mono text-white transition-all duration-500 ease-in-out ${
                isCompleted ? "animate-pulse text-red-400" : ""
              }`}
            >
              {formatTime(remainingSeconds)}
            </div>
          </div>
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
      </div>
    </Panel>
  );
}

export default TimerDisplay;
