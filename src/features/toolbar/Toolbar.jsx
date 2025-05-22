"use client";

import { useEffect, useState } from "react";
import Panel from "@components/ui/Panel";
import Tooltip from "@components/ui/Tooltip";
import { useFocus } from "../focus/FocusProvider";
import { AlarmClock, Grip, Images, MousePointerClick, Settings, Timer } from "lucide-react";
import { useClock } from "../clock/ClockProvider";
import { useTimer } from "../clock/TimerProvider";

function Toolbar() {
  const [fadeIn, setFadeIn] = useState(false);
  const { focusMode, toggleFocusMode } = useFocus();
  const { toggleClock } = useClock();
  const { toggleTimer } = useTimer();

  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const options = [
    { icon: <Grip size={22} />, label: "Focus mode", action: "focus", handler: () => toggleFocusMode() },
    // { icon: <Images size={22} />, label: "Backgrounds", action: "backgrounds", handler: null },
    { icon: <Timer size={22} />, label: "Timer", action: "timer", handler: () => toggleTimer() },
    { icon: <AlarmClock size={22} />, label: "Clock", action: "clock", handler: () => toggleClock() }
    // { icon: <MousePointerClick size={22} />, label: "Rythem mode", action: "rythem", handler: null },
    // { icon: <Settings size={22} />, label: "Settings", action: "settings", handler: null }
  ];

  return (
    <Panel
      className={`left-5 top-1/2 -translate-y-1/2 flex flex-col items-center gap-5 p-3 py-5
        ${
          focusMode
            ? "opacity-0 -translate-x-4 pointer-events-none"
            : fadeIn
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-4"
        }`}
    >
      {options.map(({ icon, label, action, handler }) => (
        <div key={action} className="relative group">
          <button
            className="text-white/80 hover:text-white p-2 rounded hover:bg-white/10"
            aria-label={label}
            onClick={handler}
          >
            {icon}
          </button>
          <Tooltip label={label} className="left-15" />
        </div>
      ))}
    </Panel>
  );
}

export default Toolbar;
