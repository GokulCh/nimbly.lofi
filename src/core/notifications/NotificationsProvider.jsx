import { createContext, useContext, useState } from "react";
const NotificationsContext = createContext();

export function NotificationsProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const push = (msg) => setMessages((prev) => [...prev, msg]);
  return <NotificationsContext.Provider value={{ messages, push }}>{children}</NotificationsContext.Provider>;
}

export const useNotifications = () => useContext(NotificationsContext);
