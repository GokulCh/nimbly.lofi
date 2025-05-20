"use client";

import { useBackground } from "./BackgroundProvider";

function DefaultBackground({ visible = true, mode = "image" }) {
  const { background } = useBackground();

  const isImageMode = mode === "image";

  return (
    <div
      className={`fixed inset-0 -z-10 pointer-events-none transition-opacity duration-700 ease-in-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Optional image background */}
      {isImageMode && (
        <div
          className="absolute inset-0 bg-[#18181b]"
          style={{
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
      )}

      {/* Grid overlay with radial mask */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          backgroundPosition: "center",
          WebkitMaskImage: `radial-gradient(circle at 50% 50%, ${
            isImageMode ? "transparent 60%, white 100%" : "white 60%, transparent 100%"
          })`,
          maskImage: `radial-gradient(circle at 50% 50%, ${
            isImageMode ? "transparent 60%, white 100%" : "white 60%, transparent 100%)"
          })`
        }}
      />
    </div>
  );
}

export default DefaultBackground;
