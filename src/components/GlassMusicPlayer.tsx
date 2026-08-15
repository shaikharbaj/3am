import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ListMusic, Music, ChevronDown, Terminal, Disc, Code2 } from 'lucide-react';
import { Track } from '../types';
import { soundFx } from '../utils/audioSynth';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface GlassMusicPlayerProps {
  tracks: Track[];
  currentTrackIndex: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSelectTrack: (index: number) => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
}

export const GlassMusicPlayer: React.FC<GlassMusicPlayerProps> = ({
  tracks,
  currentTrackIndex,
  isPlaying,
  onTogglePlay,
  onSelectTrack,
  onNextTrack,
  onPrevTrack,
}) => {
  const currentTrack = tracks[currentTrackIndex] || tracks[0];

  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(currentTrack.durationSeconds || 180);
  const [volume, setVolume] = useState<number>(80);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showPlaylist, setShowPlaylist] = useState<boolean>(false);

  const playerRef = useRef<any>(null);
  const isYtReady = useRef<boolean>(false);

  // Load YouTube IFrame Player API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initPlayer(currentTrack.youtubeId);
      };
    } else {
      initPlayer(currentTrack.youtubeId);
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
  }, []);

  const initPlayer = (videoId: string) => {
    if (playerRef.current) return;
    try {
      playerRef.current = new window.YT.Player('yt-hidden-player', {
        height: '0',
        width: '0',
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0
        },
        events: {
          onReady: () => {
            isYtReady.current = true;
            if (playerRef.current.getDuration) {
              const dur = playerRef.current.getDuration();
              if (dur > 0) setDuration(dur);
            }
          },
          onStateChange: (event: any) => {
            if (event.data === 0) {
              onNextTrack();
            }
          }
        }
      });
    } catch {
      // YT API fallback
    }
  };

  // Sync play/pause with YouTube Player
  useEffect(() => {
    if (!playerRef.current || !isYtReady.current) return;
    try {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    } catch {
      // ignore
    }
  }, [isPlaying]);

  // Load track when changed
  useEffect(() => {
    if (!playerRef.current || !isYtReady.current) return;
    try {
      playerRef.current.loadVideoById(currentTrack.youtubeId);
      if (isPlaying) {
        playerRef.current.playVideo();
      }
      setCurrentTime(0);
    } catch {
      // ignore
    }
  }, [currentTrackIndex]);

  // Periodic progress polling
  useEffect(() => {
    const timer = setInterval(() => {
      if (playerRef.current && isYtReady.current && isPlaying) {
        try {
          if (playerRef.current.getCurrentTime) {
            const curr = playerRef.current.getCurrentTime();
            setCurrentTime(curr);
          }
          if (playerRef.current.getDuration) {
            const dur = playerRef.current.getDuration();
            if (dur > 0) setDuration(dur);
          }
        } catch {
          // ignore
        }
      } else if (isPlaying) {
        setCurrentTime(prev => (prev + 1) % duration);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, duration]);

  // Volume sync
  useEffect(() => {
    if (playerRef.current && isYtReady.current && playerRef.current.setVolume) {
      try {
        playerRef.current.setVolume(isMuted ? 0 : volume);
      } catch {
        // ignore
      }
    }
  }, [volume, isMuted]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (playerRef.current && isYtReady.current && playerRef.current.seekTo) {
      try {
        playerRef.current.seekTo(targetTime, true);
      } catch {
        // ignore
      }
    }
  };

  const handleMuteToggle = () => {
    soundFx.playKeyClick();
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div id="yt-hidden-player" className="hidden pointer-events-none" />

      {/* Playlist Selection Drawer */}
      {showPlaylist && (
        <div className="fixed bottom-24 right-4 sm:right-8 z-40 w-full max-w-sm bg-slate-950/95 border border-cyan-500/30 rounded-2xl p-4 shadow-2xl backdrop-blur-2xl animate-fadeIn font-mono-digital">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <ListMusic className="w-4 h-4 text-cyan-400" />
              <h4 className="font-bold text-xs text-slate-100">3 AM Playlist</h4>
            </div>
            <button
              onClick={() => setShowPlaylist(false)}
              className="p-1 text-slate-400 hover:text-slate-100"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
            {tracks.map((track, idx) => (
              <button
                key={track.id}
                onClick={() => {
                  soundFx.playKeyClick();
                  onSelectTrack(idx);
                  setShowPlaylist(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition ${idx === currentTrackIndex
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/80'
                  }`}
              >
                <div className="flex items-center space-x-2 truncate pr-2">
                  <span className="text-slate-500 w-4">{idx + 1}.</span>
                  <span className="truncate">{track.title}</span>
                </div>
                <span className="text-[10px] text-slate-500">{track.duration}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main IDE Glassmorphism Player Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-2 sm:p-4 pointer-events-none pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]">
        <div className="max-w-4xl mx-auto bg-slate-950/95 backdrop-blur-2xl border border-slate-800/90 rounded-2xl p-2.5 sm:p-4 shadow-2xl shadow-black pointer-events-auto flex flex-col gap-1.5 sm:gap-2">

          {/* Progress Bar */}
          <div className="flex items-center space-x-2 sm:space-x-3 text-[10px] sm:text-xs font-mono-digital text-slate-400 px-1">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 sm:h-1.5 bg-slate-800 accent-cyan-400 rounded-lg cursor-pointer transition-all hover:h-2"
            />
            <span>{formatTime(duration)}</span>
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            {/* Track Info */}
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 max-w-[140px] sm:max-w-xs">
              <div className={`relative w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center flex-shrink-0 ${isPlaying ? 'animate-spin-tape' : ''}`}>
                <Code2 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              </div>
              <div className="min-w-0">
                <h4 className="text-[11px] sm:text-sm font-semibold text-slate-100 truncate font-mono-digital">
                  {currentTrack.title}
                </h4>
                <p className="text-[10px] sm:text-[11px] font-mono-digital text-cyan-400/80 truncate">
                  {currentTrack.artist}
                </p>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center space-x-1 sm:space-x-4">
              <button
                onClick={() => { soundFx.playKeyClick(); onPrevTrack(); }}
                className="p-1.5 sm:p-2 text-slate-300 hover:text-cyan-400 transition"
                title="Previous Track [P]"
              >
                <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                onClick={() => { soundFx.playKeyClick(); onTogglePlay(); }}
                className="p-2 sm:p-3 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold transition shadow-md shadow-cyan-500/30 active:scale-95"
                title="Play / Pause [Space]"
              >
                {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-slate-950" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-slate-950" />}
              </button>

              <button
                onClick={() => { soundFx.playKeyClick(); onNextTrack(); }}
                className="p-1.5 sm:p-2 text-slate-300 hover:text-cyan-400 transition"
                title="Next Track [N]"
              >
                <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Volume & Playlist Drawer Toggle */}
            <div className="flex items-center space-x-1 sm:space-x-3">
              <div className="hidden sm:flex items-center space-x-2">
                <button onClick={handleMuteToggle} className="text-slate-400 hover:text-slate-200">
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-slate-300" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={isMuted ? 0 : volume}
                  onChange={e => {
                    setVolume(parseInt(e.target.value));
                    setIsMuted(false);
                  }}
                  className="w-16 h-1 bg-slate-800 accent-cyan-400 rounded cursor-pointer"
                />
              </div>

              <button
                onClick={() => { soundFx.playKeyClick(); setShowPlaylist(!showPlaylist); }}
                className={`flex items-center space-x-1 px-2 sm:px-3 py-1.5 rounded-xl border text-xs font-mono-digital transition ${showPlaylist ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50' : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600'
                  }`}
              >
                <ListMusic className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                <span className="hidden sm:inline">Playlist</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
