import { createContext, useContext, useState } from "react";
const ToolbarContext = createContext();

export function ToolbarProvider({ children }) {
  const [visible, setVisible] = useState(true);
  const toggleVisability = () => setVisible((prev) => !prev);
  return <ToolbarContext.Provider value={{ visible, toggleVisability }}>{children}</ToolbarContext.Provider>;
}

export const useToolbar = () => useContext(ToolbarContext);
