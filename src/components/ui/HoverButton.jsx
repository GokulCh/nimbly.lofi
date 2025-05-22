"use client";

function HoverButton({ className = "", children, ...props }) {
  return (
    <button
      className={`${className} bg-black/25 backdrop-blur-md border border-white/10 rounded-lg text-white/80 hover:text-white transition-all duration-700 ease-in-out transform shadow-lg`}
      {...props}
    >
      {children}
    </button>
  );
}

export default HoverButton;
