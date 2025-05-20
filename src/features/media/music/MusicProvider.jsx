import { createContext, useContext, useState } from "react";
const MusicContext = createContext();

export function MusicProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const togglePlay = () => setIsPlaying((prev) => !prev);
  return <MusicContext.Provider value={{ isPlaying, togglePlay }}>{children}</MusicContext.Provider>;
}

export const useMusic = () => useContext(MusicContext);
