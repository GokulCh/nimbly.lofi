"use client";

function Tooltip({ label, className = "" }) {
  return (
    <span
      className={`absolute ${className} top-1/2 -translate-y-1/2 whitespace-nowrap text-sm px-2 py-1 rounded 
      bg-black/20 text-white opacity-0 group-hover:opacity-100 pointer-events-none shadow-md`}
    >
      {label}
    </span>
  );
}

export default Tooltip;
