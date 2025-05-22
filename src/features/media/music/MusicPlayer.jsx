"use client";

import { useEffect, useState, useRef } from "react";
import { useMusic } from "./MusicProvider";
import { useFocus } from "../../focus/FocusProvider";
import Panel from "@components/ui/Panel";

import { ChevronLeft, List, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";

const formatTime = (sec = 0) => {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};

function MusicPlayer() {
  // Main music player components
  const {
    isPlaying,
    play,
    pause,
    togglePlay,
    next,
    prev,
    volume,
    setPlayerVolume,
    currentTime,
    duration,
    seek,
    songs,
    currentSong,
    currentSongIndex,
    setSongIndex
  } = useMusic();

  const { focusMode } = useFocus();
  const [fadeIn, setFadeIn] = useState(false);
  const volumeRef = useRef(null);
  const playlistRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Panel
      className={`bottom-4 left-1/2 -translate-x-1/2 p-3 w-96
          ${
            focusMode
              ? "opacity-0 translate-y-4 pointer-events-none"
              : fadeIn
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
    >
      <div className="flex flex-col gap-2">
        {/* Song cover information */}
        <div className="flex items-center gap-3 overflow-hidden">
          <img
            src={currentSong.cover}
            alt={`${currentSong.title} cover`}
            className="w-12 h-12 rounded-md object-cover shrink"
          />
          <div className="min-w-0">
            <p className="text-sm font-medium text-white leading-tight truncate">{currentSong.title}</p>
            <p className="text-xs text-white/60 truncate">{currentSong.artist}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 text-white/70 text-xs">
          <span className="w-8 text-right">{formatTime(currentTime)}</span>
          <div
            className="flex-1 h-1 bg-white/20 rounded-full relative cursor-pointer group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent = (e.clientX - rect.left) / rect.width;
              seek(duration * percent);
            }}
          >
            <div
              className="absolute top-0 left-0 h-full bg-white rounded-full"
              style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
            />
            <div
              className="absolute top-0 h-full w-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `${(currentTime / duration) * 100 || 0}%` }}
            />
          </div>
          <span className="w-8 text-left">{formatTime(duration)}</span>
        </div>

        {/* Music controls */}
        <div className="flex items-center justify-between mt-2">
          <div className="relative" ref={volumeRef}>
            <button className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white transition-colors">
              {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>

          {/* Playback Buttons */}
          <div className="flex items-center gap-4">
            <button
              className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white transition-colors"
              onClick={prev}
            >
              <SkipBack size={18} />
            </button>

            <button
              className="w-10 h-10 flex items-center justify-center text-white bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
            </button>

            <button
              className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white transition-colors"
              onClick={next}
            >
              <SkipForward size={18} />
            </button>
          </div>

          {/* Playlist */}
          <div className="relative" ref={playlistRef}>
            <button
              className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white transition-colors"
              onClick={() => setShowPlaylist(!showPlaylist)}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>
    </Panel>
  );
}

export default MusicPlayer;
