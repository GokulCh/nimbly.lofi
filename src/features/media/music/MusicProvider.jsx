import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
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
  streamUrl: "/",
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
  const [previousStack, setPreviousStack] = useState([]);
  const preloadAudioRef = useRef(null);
  const audioRef = useRef(null);

  const appendSongs = useCallback((newBatch) => {
    setSongs((prev) => {
      const filtered = prev[0]?.title === "Loading Track" ? prev.slice(1) : prev;
      return [...filtered, ...newBatch];
    });

    setShuffledSongs((prev) => {
      const filtered = prev[0]?.title === "Loading Track" ? prev.slice(1) : prev;
      return [...filtered, ...shuffleArray(newBatch)];
    });
  }, []);

  useEffect(() => {
    setSongs([loadingTrack]);
    setShuffledSongs([loadingTrack]);
    setOffline(false);

    fetchAudiusSongs((batch) => {
      appendSongs(batch);
    }).catch((err) => {
      console.warn("⚠️ Failed to fetch songs. Using offline fallback.");
      setOffline(true);
      setSongs([offlineTrack]);
      setShuffledSongs([offlineTrack]);
    });
  }, [appendSongs]);

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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

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
      preloadAudio.load();
    }
  }, [currentSongIndex, shuffledSongs]);

  const play = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.play().catch((err) => console.warn("❌ Manual play failed:", err));
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const togglePlay = () => (isPlaying ? pause() : play());

  const seek = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleNext = useCallback(() => {
    if (shuffledSongs.length <= 1 || offline) return;

    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * shuffledSongs.length);
    } while (nextIndex === currentSongIndex);

    setPreviousStack((prev) => [...prev.slice(-49), currentSongIndex]);
    setCurrentSongIndex(nextIndex);
    setIsPlaying(true);
  }, [shuffledSongs, currentSongIndex, offline]);

  const handlePrev = () => {
    if (currentTime > 3 || previousStack.length === 0) {
      seek(0);
      return;
    }

    const lastIndex = previousStack[previousStack.length - 1];
    setPreviousStack((prev) => prev.slice(0, -1));
    setCurrentSongIndex(lastIndex);
    setIsPlaying(true);
  };

  const setSongIndex = (index) => {
    if (index !== currentSongIndex) {
      setPreviousStack((prev) => [...prev.slice(-49), currentSongIndex]);
    }
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler("play", play);
      navigator.mediaSession.setActionHandler("pause", pause);
      navigator.mediaSession.setActionHandler("previoustrack", handlePrev);
      navigator.mediaSession.setActionHandler("nexttrack", handleNext);
    }
  }, [play, pause, handleNext]);

  useEffect(() => {
    if ("mediaSession" in navigator && shuffledSongs[currentSongIndex]) {
      const song = shuffledSongs[currentSongIndex];
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: song.title,
        artist: song.artist,
        album: "Nimbly",
        artwork: [{ src: song.cover, sizes: "150x150", type: "image/jpeg" }]
      });
    }
  }, [shuffledSongs, currentSongIndex]);

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
        <>
          <audio ref={audioRef} src={shuffledSongs[currentSongIndex]?.streamUrl} autoPlay={isPlaying} />
          <audio ref={preloadAudioRef} preload="auto" style={{ display: "none" }} />
        </>
      )}
      {children}
    </MusicContext.Provider>
  );
}

export const useMusic = () => useContext(MusicContext);
