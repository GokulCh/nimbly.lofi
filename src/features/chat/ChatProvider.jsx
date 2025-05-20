import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const sendMessage = (msg) => setMessages((prev) => [...prev, msg]);
  return <ChatContext.Provider value={{ messages, sendMessage }}>{children}</ChatContext.Provider>;
}

export const useChat = () => useContext(ChatContext);
