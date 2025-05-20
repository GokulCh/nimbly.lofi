"use client";

function Panel({ className = "", children, ...props }) {
  return (
    <div
      className={`fixed ${className} rounded-xl bg-black/20 backdrop-blur-md border border-white/10 shadow-xl transition-all duration-700 ease-in-out`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Panel;
