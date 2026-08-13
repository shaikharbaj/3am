import React, { useState, useEffect } from 'react';
import { Disc3, Moon, Sparkles, Heart, Coffee, CloudRain, Snowflake, Sun, Music2, Volume2, ShieldCheck, RefreshCw, ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import { Track, LateNightThought, MidnightMood, WeatherMode } from '../types';
import { soundFx } from '../utils/audioSynth';

interface Central3AMThoughtsHeroProps {
  currentTrack: Track;
  isPlaying: boolean;
  onTogglePlay: () => void;
  thoughts: LateNightThought[];
  weatherMode: WeatherMode;
}

export const Central3AMThoughtsHero: React.FC<Central3AMThoughtsHeroProps> = ({
  currentTrack,
  isPlaying,
  onTogglePlay,
  thoughts,
  weatherMode
}) => {
  const [selectedMood, setSelectedMood] = useState<MidnightMood>('cozy');
  const [thoughtIndex, setThoughtIndex] = useState<number>(0);
  const [isSteamActive, setIsSteamActive] = useState<boolean>(true);
  const [listeningCount, setListeningCount] = useState<number>(1428);

  // Slowly simulate fluctuating night owl listener count
  useEffect(() => {
    const interval = setInterval(() => {
      setListeningCount(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleNextThought = () => {
    soundFx.playKeyClick();
    setThoughtIndex((prev) => (prev + 1) % thoughts.length);
  };

  const handlePrevThought = () => {
    soundFx.playKeyClick();
    setThoughtIndex((prev) => (prev - 1 + thoughts.length) % thoughts.length);
  };

  const handleShuffleThought = () => {
    soundFx.playSuccessSound();
    const randomIndex = Math.floor(Math.random() * thoughts.length);
    setThoughtIndex(randomIndex);
  };

  const currentThought = thoughts[thoughtIndex] || thoughts[0];

  const moods: { id: MidnightMood; label: string; icon: string; desc: string }[] = [
    { id: 'cozy', label: 'Cozy Solitude', icon: '☕', desc: 'Warm blanket, quiet room, tea in hand' },
    { id: 'melancholy', label: 'Late Memories', icon: '🌧️', desc: 'Thinking of old places & past conversations' },
    { id: 'peaceful', label: 'Midnight Peace', icon: '🌙', desc: 'Zero noise, zero expectations, pure calmness' },
    { id: 'reflective', label: 'Overthinking', icon: '💭', desc: 'Replaying life choices at 3 AM' },
    { id: 'dreamy', label: 'Dreamer', icon: '✨', desc: 'Staring at city lights and starry skies' },
  ];

  return (
    <div className="relative w-full max-w-5xl mx-auto my-6 px-2">
      {/* Outer Glow Container */}
      <div className="relative rounded-3xl bg-slate-950/85 border border-purple-500/30 backdrop-blur-2xl shadow-2xl shadow-purple-950/40 overflow-hidden transition-all duration-500">
        
        {/* Top Decorative Sanctuary Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-slate-900/90 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-xs font-mono-digital">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
            <span className="text-purple-300 font-semibold uppercase tracking-widest">
              3:00 AM Midnight Sanctuary
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 hidden sm:inline">Nocturnal Listener Hub</span>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono-digital">
            <div className="flex items-center space-x-1.5 text-slate-300 bg-slate-950/80 px-3 py-1 rounded-full border border-slate-800">
              <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
              <span>{listeningCount.toLocaleString()} night owls awake</span>
            </div>
          </div>
        </div>

        {/* Main Hero Content Layout */}
        <div className="p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Visualizer: Spinning Vinyl & Audio Wave Animation (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950/90 border border-purple-500/20 shadow-inner text-center relative group">
            
            {/* Spinning Vinyl Record Player Visual */}
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 my-2 flex items-center justify-center">
              {/* Outer Vinyl Glow Ring */}
              <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500/20 via-cyan-500/20 to-indigo-500/20 blur-xl transition-opacity duration-1000 ${isPlaying ? 'opacity-100 scale-105' : 'opacity-30'}`} />
              
              {/* Vinyl Groove Disk */}
              <div className={`relative w-full h-full rounded-full bg-slate-950 border-4 border-slate-800 shadow-2xl flex items-center justify-center transition-transform duration-1000 ${isPlaying ? 'animate-spin-tape' : ''}`}>
                {/* Vinyl Grooves Pattern */}
                <div className="absolute inset-2 rounded-full border border-slate-800/80" />
                <div className="absolute inset-5 rounded-full border border-slate-800/60" />
                <div className="absolute inset-8 rounded-full border border-slate-800/40" />
                <div className="absolute inset-12 rounded-full border border-slate-800/20" />

                {/* Center Record Label Badge */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 p-0.5 shadow-lg flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-slate-950/90 flex flex-col items-center justify-center text-center p-1">
                    <Disc3 className={`w-6 h-6 text-purple-300 ${isPlaying ? 'animate-spin' : ''}`} />
                    <span className="text-[9px] font-mono-digital text-purple-200 mt-0.5 tracking-tighter truncate w-12">
                      3 AM BEATS
                    </span>
                  </div>
                </div>

                {/* Center Spindle Hole */}
                <div className="absolute w-3 h-3 rounded-full bg-slate-900 border border-slate-700 z-10" />
              </div>

              {/* Tonearm Arm Needle */}
              <div className={`absolute -top-1 right-2 w-20 h-20 pointer-events-none transition-transform duration-700 origin-top-right ${isPlaying ? 'rotate-12' : '-rotate-12'}`}>
                <div className="w-1.5 h-16 bg-slate-400 rounded-full shadow-md ml-auto mr-4" />
                <div className="w-3 h-3 rounded-full bg-amber-400 shadow-lg ml-auto mr-3 -mt-2" />
              </div>
            </div>

            {/* Play/Pause Quick Action */}
            <button
              onClick={() => { soundFx.playKeyClick(); onTogglePlay(); }}
              className="mt-4 flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-purple-600/90 hover:bg-purple-500 text-white font-semibold text-xs font-mono-digital transition shadow-lg shadow-purple-600/30 active:scale-95"
            >
              <Music2 className="w-4 h-4" />
              <span>{isPlaying ? 'Pause Midnight Melody' : 'Play Midnight Melody'}</span>
            </button>

            {/* Live Frequency Spectrum Audio Visualizer Bars */}
            <div className="flex items-end justify-center space-x-1 h-8 mt-5 w-full max-w-xs">
              {[40, 70, 30, 85, 50, 95, 60, 40, 80, 55, 90, 45, 75, 35, 85].map((height, idx) => (
                <div
                  key={idx}
                  className="w-1.5 rounded-t bg-gradient-to-t from-purple-600 via-sky-400 to-cyan-300 transition-all duration-300"
                  style={{
                    height: isPlaying ? `${Math.max(15, (height * (0.4 + Math.random() * 0.6)))}%` : '20%',
                    opacity: isPlaying ? 0.9 : 0.3
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right Content: 3 AM Thought Card & Mood Selector (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            
            {/* Mood Category Badges */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-mono-digital text-purple-300 uppercase tracking-widest font-semibold">
                  Select Midnight Mood
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {moods.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      soundFx.playKeyClick();
                      setSelectedMood(m.id);
                    }}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-mono-digital transition-all ${
                      selectedMood === m.id
                        ? 'bg-purple-950 border border-purple-400 text-purple-200 font-semibold shadow-md shadow-purple-950'
                        : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{m.icon}</span>
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Curated 3 AM Thought Card Display */}
            <div className="relative p-6 rounded-2xl bg-slate-900/90 border border-purple-500/30 backdrop-blur-md shadow-xl flex flex-col justify-between min-h-[190px]">
              {/* Corner Ambient Moon Deco */}
              <div className="absolute top-3 right-3 text-purple-400/20">
                <Moon className="w-10 h-10" />
              </div>

              {/* Time Context Stamp */}
              <div className="flex items-center justify-between text-xs font-mono-digital text-purple-300/80 mb-3">
                <span className="flex items-center space-x-1.5 bg-purple-950/60 border border-purple-500/20 px-2.5 py-1 rounded-md">
                  <Moon className="w-3.5 h-3.5 text-purple-400" />
                  <span>THOUGHT AT {currentThought.timeContext}</span>
                </span>
                <span className="capitalize text-slate-500 text-[11px]">
                  # {currentThought.theme}
                </span>
              </div>

              {/* Main Thought Quote Text */}
              <blockquote className="text-base sm:text-lg text-slate-100 font-light leading-relaxed my-2 italic font-heading">
                "{currentThought.text}"
              </blockquote>

              {/* Carousel Navigation Controls */}
              <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-800/80">
                <span className="text-xs font-mono-digital text-slate-500">
                  Thought {thoughtIndex + 1} of {thoughts.length}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePrevThought}
                    className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-purple-300 hover:border-purple-500/40 transition"
                    title="Previous Thought"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleShuffleThought}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-mono-digital hover:bg-purple-900 transition"
                    title="Random Thought"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Shuffle</span>
                  </button>

                  <button
                    onClick={handleNextThought}
                    className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-purple-300 hover:border-purple-500/40 transition"
                    title="Next Thought"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Status Banner */}
            <div className="flex items-center justify-between text-xs font-mono-digital text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center space-x-2">
                <Coffee className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Atmosphere: {weatherMode === 'winter' ? 'Frosted Window & Snowfall' : weatherMode === 'rain' ? 'Rain Tapping Glass' : 'Clear Midnight Silence'}</span>
              </div>
              <span className="text-purple-400 font-semibold hidden sm:inline">
                You are not alone awake.
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
