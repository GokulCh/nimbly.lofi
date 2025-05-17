"use client";

import { useEffect, useState } from "react";

function GridBackground() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 -z-10 pointer-events-none transition-opacity duration-[1000ms] ease-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Solid background */}
      <div className="absolute inset-0 bg-[#18181b]" />

      {/* Centered logo */}
      {/* <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img src="/nimbly.svg" alt="Nimbly Logo" className="w-70 h-70 opacity-30 select-none" draggable="false" />
      </div> */}

      {/* Grid overlay with fading mask */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          backgroundPosition: "center",
          WebkitMaskImage: "radial-gradient(circle at 50% 50%, white 60%, transparent 100%)",
          maskImage: "radial-gradient(circle at 50% 50%, white 60%, transparent 100%)"
        }}
      />
    </div>
  );
}

export default GridBackground;
