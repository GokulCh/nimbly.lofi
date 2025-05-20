import { createContext, useContext, useState } from "react";
const ToolbarContext = createContext();

export function ToolbarProvider({ children }) {
  const [visible, setVisible] = useState(true);
  return <ToolbarContext.Provider value={{ visible, setVisible }}>{children}</ToolbarContext.Provider>;
}

export const useToolbar = () => useContext(ToolbarContext);
