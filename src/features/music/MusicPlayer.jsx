"use client";

import { ChevronLeft, List, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useMusicContext } from "./MusicProvider";
import { useFocusContext } from "../focus/FocusProvider";

export default function MusicPlayer() {
  const { isPlaying, togglePlay, volume, setPlayerVolume, songs, currentSong, currentSongIndex, setSongIndex } =
    useMusicContext();
  const { focusMode } = useFocusContext();

  const [fadeIn, setFadeIn] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const volumeRef = useRef(null);
  const playlistRef = useRef(null);

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

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 transition-all duration-700 ease-in-out z-20 ${
        focusMode
          ? "opacity-0 translate-y-5 pointer-events-none"
          : fadeIn
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10"
      }`}
    >
      <div className="p-3 rounded-xl bg-black/20 backdrop-blur-md border border-white/10 shadow-xl w-96">
        <div className="flex flex-col gap-2">
          {/* Song Info */}
          <div className="flex items-center gap-3">
            <img
              src={currentSong.cover}
              alt={`${currentSong.title} cover`}
              className="w-12 h-12 rounded-md object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">{currentSong.title}</p>
                  <p className="text-white/60 text-xs">
                    {currentSong.artist} - {currentSong.album}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1 text-white/60 text-xs">
                <span>2:14</span>
                <span>/</span>
                <span>{currentSong.duration}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
            <div className="bg-white h-full w-[55%] rounded-full" />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-2">
            {/* Volume */}
            <div className="relative" ref={volumeRef}>
              <button
                className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                onClick={() => setShowVolumeSlider(!showVolumeSlider)}
              >
                {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>

              {showVolumeSlider && (
                <div className="absolute bottom-0 right-full mr-5 p-2 rounded-lg bg-black/30 backdrop-blur-md border border-white/10 shadow-xl">
                  <div className="h-24 w-6 flex flex-col items-center">
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
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-full w-6 opacity-0 cursor-pointer appearance-none"
                        style={{ transform: "rotate(180deg) translateX(50%)" }}
                      />
                    </div>
                    <span className="text-white text-xs mt-1">{volume}%</span>
                  </div>
                </div>
              )}
            </div>

            {/* Playback Buttons */}
            <div className="flex items-center gap-4">
              <button
                className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                onClick={() => setSongIndex(Math.max(0, currentSongIndex - 1))}
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
                onClick={() => setSongIndex(Math.min(songs.length - 1, currentSongIndex + 1))}
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

              {showPlaylist && (
                <div className="absolute bottom-0 left-full ml-5 p-2 rounded-xl bg-black/20 backdrop-blur-md border border-white/10 shadow-xl w-72 max-h-96 overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white text-sm font-medium">Up Next</h4>
                    <button
                      className="text-white/60 hover:text-white text-xs flex items-center gap-1"
                      onClick={() => setShowPlaylist(false)}
                    >
                      Close <ChevronLeft size={14} />
                    </button>
                  </div>

                  <div className="overflow-y-auto pr-1 space-y-2 flex-1">
                    {songs.map((song, index) => (
                      <div
                        key={song.id}
                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                          index === currentSongIndex ? "bg-white/10" : "hover:bg-white/5"
                        }`}
                        onClick={() => setSongIndex(index)}
                      >
                        <img src={song.cover} alt={`${song.title} cover`} className="w-8 h-8 rounded object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm truncate">{song.title}</p>
                          <p className="text-white/60 text-xs truncate">{song.artist}</p>
                        </div>
                        <span className="text-white/60 text-xs">{song.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
