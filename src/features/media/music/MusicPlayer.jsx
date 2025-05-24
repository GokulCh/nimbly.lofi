"use client";

import { useEffect, useState, useRef } from "react";
import { useMusic } from "./MusicProvider";
import { useFocus } from "../../focus/FocusProvider";
import Panel from "@components/ui/Panel";
import { ChevronLeft, List, Pause, Play, SkipBack, SkipForward, Volume1, Volume2, VolumeX } from "lucide-react";

const formatTime = (sec = 0) => {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};

function MusicPlayer() {
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
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const volumeRef = useRef(null);
  const playlistRef = useRef(null);
  const songRefs = useRef([]);

  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (volumeRef.current && !volumeRef.current.contains(event.target)) {
        setShowVolumeSlider(false);
      }
      if (playlistRef.current && !playlistRef.current.contains(event.target)) {
        setShowPlaylist(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (showPlaylist && songRefs.current[currentSongIndex]) {
      songRefs.current[currentSongIndex].scrollIntoView({
        block: "start"
      });
    }
  }, [showPlaylist, currentSongIndex]);

  return (
    <Panel
      className={`bottom-4 left-1/2 -translate-x-1/2 p-3 w-96
        ${
          focusMode
            ? "opacity-0 translate-y-4 pointer-events-none"
            : fadeIn
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"
        } transition-all duration-500`}
    >
      <div className="flex flex-col gap-2">
        {/* Song Info */}
        <div className="flex items-center gap-3 overflow-hidden">
          <img
            src={currentSong.cover || "/placeholder.svg"}
            alt={`${currentSong.title} cover`}
            className="w-12 h-12 rounded-md object-cover shrink"
          />
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{currentSong.title}</p>
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

        {/* Controls */}
        <div className="flex items-center justify-between mt-2">
          {/* Volume */}
          <div className="relative" ref={volumeRef}>
            <button
              className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white rounded-md hover:bg-white/10 transition-colors"
              onClick={() => setShowVolumeSlider(!showVolumeSlider)}
            >
              {volume === 0 ? <VolumeX size={18} /> : volume <= 50 ? <Volume1 size={18} /> : <Volume2 size={18} />}
            </button>

            <div
              className={`absolute bottom-0 right-full mr-5 p-2 py-4 rounded-lg bg-black/25 backdrop-blur-md border border-white/10 shadow-xl transition-all duration-300 transform origin-bottom-right ${
                showVolumeSlider ? "opacity-100 scale-100" : "opacity-0 scale-85 pointer-events-none"
              }`}
            >
              <div className="h-30 w-6 flex flex-col items-center">
                <div className="relative h-full w-1 bg-white/10 rounded-full mx-auto">
                  <div
                    className="absolute bottom-0 left-0 w-full bg-white rounded-full"
                    style={{ height: `${volume}%` }}
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setPlayerVolume(parseInt(e.target.value))}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 w-[100px] h-6 cursor-pointer appearance-none"
                    style={{
                      transform: "rotate(270deg)",
                      transformOrigin: "center"
                    }}
                  />
                </div>
                <span className="text-white text-xs mt-1">{volume}%</span>
              </div>
            </div>
          </div>

          {/* Play Controls */}
          <div className="flex items-center gap-4">
            <button
              className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white rounded-md hover:bg-white/10 transition-colors"
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
              className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white rounded-md hover:bg-white/10 transition-colors"
              onClick={next}
            >
              <SkipForward size={18} />
            </button>
          </div>

          {/* Playlist */}
          <div className="relative" ref={playlistRef}>
            <button
              className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white rounded-md hover:bg-white/10 transition-colors"
              onClick={() => setShowPlaylist(!showPlaylist)}
            >
              <List size={18} />
            </button>

            <div
              className={`absolute bottom-0 left-full ml-5 p-2 rounded-xl bg-black/25 backdrop-blur-md border border-white/10 shadow-xl w-72 max-h-96 overflow-hidden flex flex-col transition-all duration-300 transform origin-bottom-left ${
                showPlaylist ? "opacity-100 scale-100" : "opacity-0 scale-85 pointer-events-none"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white text-sm font-medium">Up Next</h4>
                <span className="text-white/50 text-xs">
                  Song {currentSongIndex + 1} of {songs.length}
                </span>
                <button
                  className="text-white/60 hover:text-white text-xs flex items-center gap-1 px-2 py-1 hover:bg-white/10 rounded-md"
                  onClick={() => setShowPlaylist(false)}
                >
                  Close <ChevronLeft size={14} />
                </button>
              </div>

              <div className="overflow-y-auto pr-1 space-y-2 flex-1 custom-scrollbar">
                {songs.map((song, index) => (
                  <div
                    key={song.id}
                    ref={(el) => (songRefs.current[index] = el)}
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                      index === currentSongIndex ? "bg-white/10" : "hover:bg-white/5"
                    }`}
                    onClick={() => setSongIndex(index)}
                  >
                    <img
                      src={song.cover || "/placeholder.svg"}
                      alt={`${song.title} cover`}
                      className="w-8 h-8 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{song.title}</p>
                      <p className="text-white/60 text-xs truncate">{song.artist}</p>
                    </div>
                    <span className="text-white/60 text-xs">{song.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

export default MusicPlayer;
