"use client";
import { createContext, useContext, useState } from "react";
import ChatButton from "./ChatButton";

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  return (
    <ChatContext.Provider value={{}}>
      <ChatButton />
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChatContext must be used within a ChatProvider");
  return context;
}
