"use client";

import { Grip, Images, Settings, Timer, MousePointerClick, AlarmClock } from "lucide-react";
import { useFocusContext } from "../focus/FocusProvider";
import { useEffect, useRef, useState } from "react";

const icons = [
  { icon: <Grip size={22} />, label: "Focus mode", action: "focus" },
  { icon: <Images size={22} />, label: "Backgrounds", action: "backgrounds" },
  { icon: <Timer size={22} />, label: "Timer", action: "timer" },
  { icon: <AlarmClock size={22} />, label: "Clock", action: "clock" },
  {
    icon: <MousePointerClick size={22} />,
    label: "Rythem mode",
    action: "rythem"
  },
  { icon: <Settings size={22} />, label: "Settings", action: "settings" }
];

function ToolBar() {
  const { focusMode, toggleFocusMode } = useFocusContext();
  const [fadeIn, setFadeIn] = useState(false);
  const clickAudioRef = useRef(null);

  useEffect(() => {
    // Ensure file is in /public/audio/button.mp3
    clickAudioRef.current = new Audio("/audio/button.mp3");
    clickAudioRef.current.volume = 1; // Max volume

    const timer = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const playClickSound = () => {
    if (clickAudioRef.current) {
      clickAudioRef.current.currentTime = 0;
      clickAudioRef.current.play();
    }
  };

  const handleClick = (action) => {
    playClickSound();

    if (action === "focus") {
      toggleFocusMode();
    }

    // Add more logic here if needed
  };

  return (
    <div
      className={`fixed left-6 top-1/2 -translate-y-1/2 flex flex-col items-center p-3 rounded-xl bg-black/20 backdrop-blur-md border border-white/10 shadow-xl transition-all duration-700 ease-in-out
        ${
          focusMode
            ? "opacity-0 -translate-x-5 pointer-events-none"
            : fadeIn
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-10"
        }`}
    >
      <div className="flex flex-col items-center gap-8 py-5">
        {icons.map(({ icon, label, action }, index) => (
          <div key={index} className="relative group">
            <button
              className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white transition-colors"
              onClick={() => handleClick(action)}
            >
              {icon}
            </button>
            <span className="absolute left-12 top-1/2 -translate-y-1/2 whitespace-nowrap text-sm px-2 py-1 rounded bg-black/20 text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ToolBar;
