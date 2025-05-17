"use client";

import { MessageSquare, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);
  const onlineUsers = 24;

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {/* Chat toggle button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border border-white/10 shadow-xl flex items-center justify-center text-white hover:bg-black/30 transition-all"
      >
        <MessageSquare size={20} />
        <span className="absolute -top-1 -right-1 bg-gray-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {onlineUsers}
        </span>
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className="fixed bottom-10 left-10 w-80 h-96 rounded-xl bg-black/20 backdrop-blur-md border border-white/10 shadow-xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-3 border-b border-white/10 flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">Live Chat</h3>
              <p className="text-white/60 text-xs">{onlineUsers} people online</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages with better scrollbar */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {/* Message 1 */}
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs">
                JD
              </div>
              <div className="bg-white/10 rounded-lg p-2 text-sm text-white max-w-[80%]">
                <p className="text-xs text-white/60 mb-1">John Doe</p>
                <p>Has anyone tried the new feature yet?</p>
              </div>
            </div>

            {/* Message 2 */}
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white text-xs">
                AS
              </div>
              <div className="bg-white/10 rounded-lg p-2 text-sm text-white max-w-[80%]">
                <p className="text-xs text-white/60 mb-1">Alice Smith</p>
                <p>Yes, it's amazing! The UI is so intuitive.</p>
              </div>
            </div>

            {/* Message 3 */}
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs">
                RJ
              </div>
              <div className="bg-white/10 rounded-lg p-2 text-sm text-white max-w-[80%]">
                <p className="text-xs text-white/60 mb-1">Robert Johnson</p>
                <p>I'm still exploring it. Any tips?</p>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/30"
              />
              <button className="bg-white/10 hover:bg-white/20 text-white rounded-lg px-3 py-2 text-sm transition-colors">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
