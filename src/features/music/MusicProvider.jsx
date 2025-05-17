import { createContext, useContext, useState } from "react";
import MusicPlayer from "./MusicPlayer";

const MusicContext = createContext(null);

export function MusicProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [songs] = useState([
    {
      id: 1,
      title: "Midnight City",
      artist: "M83",
      album: "Hurry Up, We're Dreaming",
      duration: "4:03",
      cover: "/placeholder.svg"
    },
    {
      id: 2,
      title: "Blinding Lights",
      artist: "The Weeknd",
      album: "After Hours",
      duration: "3:22",
      cover: "/placeholder.svg"
    },
    {
      id: 3,
      title: "Bad Guy",
      artist: "Billie Eilish",
      album: "When We All Fall Asleep",
      duration: "3:14",
      cover: "/placeholder.svg"
    },
    {
      id: 4,
      title: "Levitating",
      artist: "Dua Lipa",
      album: "Future Nostalgia",
      duration: "3:23",
      cover: "/placeholder.svg"
    }
  ]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const togglePlay = () => setIsPlaying((prev) => !prev);
  const setPlayerVolume = (v) => setVolume(v);
  const setSongIndex = (index) => setCurrentSongIndex(index);

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        togglePlay,
        volume,
        setPlayerVolume,
        songs,
        currentSong: songs[currentSongIndex],
        currentSongIndex,
        setSongIndex
      }}
    >
      <MusicPlayer />
      {children}
    </MusicContext.Provider>
  );
}

export function useMusicContext() {
  const context = useContext(MusicContext);
  if (!context) throw new Error("useMusicContext must be used within a MusicProvider");
  return context;
}
