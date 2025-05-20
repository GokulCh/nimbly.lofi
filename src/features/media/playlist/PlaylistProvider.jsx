import { createContext, useContext, useState } from "react";
const PlaylistContext = createContext();

export function PlaylistProvider({ children }) {
  const [playlist, setPlaylist] = useState([]);
  return <PlaylistContext.Provider value={{ playlist, setPlaylist }}>{children}</PlaylistContext.Provider>;
}

export const usePlaylist = () => useContext(PlaylistContext);
