import { createContext, useContext, useEffect, useRef, useState } from "react";
import { fetchAudiusSongs } from "./MusicService";

const MusicContext = createContext();

const shuffleArray = (arr) =>
  arr
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

const loadingTrack = {
  title: "Loading Track",
  artist: "Nimbly",
  album: "Loading",
  streamUrl: "/audios/song.mp3",
  cover: "/images/placeholder.jpg"
};

const offlineTrack = {
  title: "Offline Track",
  artist: "Nimbly",
  album: "Offline",
  streamUrl: "/audios/song.mp3",
  cover: "/images/placeholder.jpg"
};

export function MusicProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [songs, setSongs] = useState([loadingTrack]);
  const [shuffledSongs, setShuffledSongs] = useState([loadingTrack]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [offline, setOffline] = useState(false);
  const preloadAudioRef = useRef(null);

  const audioRef = useRef(null);

  // 📦 Load Songs
  useEffect(() => {
    const loadSongs = async () => {
      console.log("[MusicProvider] ⏬ Calling fetchAudiusSongs");
      try {
        const fetched = await fetchAudiusSongs();
        if (!fetched?.length) throw new Error("No songs fetched");
        setSongs(fetched);
        setShuffledSongs(shuffleArray(fetched));
      } catch (err) {
        console.warn("⚠️ Failed to fetch songs. Using offline fallback.");
        setOffline(true);
        setSongs([offlineTrack]);
        setShuffledSongs([offlineTrack]);
      }
    };
    loadSongs();
  }, []);

  // ▶️ Handle song change
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !shuffledSongs.length) return;

    audio.volume = volume / 100;
    audio.load();

    if (isPlaying) {
      audio.play().catch((err) => console.warn("❌ Playback failed:", err));
    }

    setCurrentTime(0);
  }, [currentSongIndex]);

  // 🔊 Sync volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // ⏱️ Track progress
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateProgress);
    audio.addEventListener("ended", handleNext);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateProgress);
      audio.removeEventListener("ended", handleNext);
    };
  }, [shuffledSongs, currentSongIndex]);

  useEffect(() => {
    const preloadAudio = preloadAudioRef.current;
    const nextIndex = (currentSongIndex + 1) % shuffledSongs.length;
    if (preloadAudio && shuffledSongs[nextIndex]) {
      preloadAudio.src = shuffledSongs[nextIndex].streamUrl;
      preloadAudio.load(); // Begin preloading
    }
  }, [currentSongIndex, shuffledSongs]);

  // 🔁 Controls
  const play = () => {
    if (!audioRef.current) return;
    audioRef.current.play().catch((err) => console.warn("❌ Manual play failed:", err));
    setIsPlaying(true);
  };

  const pause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const togglePlay = () => (isPlaying ? pause() : play());

  const seek = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleNext = () => {
    if (shuffledSongs.length <= 1 || offline) return;

    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * shuffledSongs.length);
    } while (nextIndex === currentSongIndex);

    setCurrentSongIndex(nextIndex);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    seek(0);
  };

  const setSongIndex = (index) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  const contextValue = {
    isPlaying,
    play,
    pause,
    togglePlay,
    next: handleNext,
    prev: handlePrev,
    volume,
    setPlayerVolume: setVolume,
    currentTime,
    duration,
    seek,
    songs: shuffledSongs,
    currentSong: shuffledSongs[currentSongIndex] || {},
    currentSongIndex,
    setSongIndex
  };

  return (
    <MusicContext.Provider value={contextValue}>
      {shuffledSongs.length > 0 && (
        <audio ref={audioRef} src={shuffledSongs[currentSongIndex]?.streamUrl} autoPlay={isPlaying} />
      )}
      {children}
    </MusicContext.Provider>
  );
}

export const useMusic = () => useContext(MusicContext);
