"use client";

import { useClock } from "./ClockProvider";

function ClockDisplay() {
  const { time, isDisplayed } = useClock();

  return (
    <div
      className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-700 ease-in-out pointer-events-none z-10 ${
        isDisplayed ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex flex-col items-center space-y-2 text-center">
        <div className="text-white/80 text-xl font-mono">{time.toLocaleDateString(undefined, { weekday: "long" })}</div>
        <div className="text-white text-6xl font-mono">{time.toLocaleTimeString()}</div>
        <div className="text-white/80 text-xl font-mono">{time.toLocaleDateString()}</div>
      </div>
    </div>
  );
}

export default ClockDisplay;
