"use client";

import { useBackground } from "./BackgroundProvider";

function DefaultBackground({ visible = true }) {
  // const { background } = useBackground();

  return (
    <div
      className={`fixed inset-0 -z-10 pointer-events-none transition-opacity duration-700 ease-in-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Solid or dynamic background */}
      <div
        className="absolute inset-0 bg-[#18181b]"
        // style={{
        //   backgroundImage: `url(${background})`,
        //   backgroundSize: "cover",
        //   backgroundPosition: "center"
        // }}
      />

      {/* Optional Centered logo */}
      {/* <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          src="/nimbly.svg"
          alt="Nimbly Logo"
          className="w-[280px] h-[280px] opacity-30 select-none"
          draggable="false"
        />
      </div> */}

      {/* Grid overlay with radial mask */}
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

export default DefaultBackground;
