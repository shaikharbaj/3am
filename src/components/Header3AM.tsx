import React, { useState, useEffect } from 'react';
import { CloudRain, Snowflake, Sun, Monitor, Keyboard, Moon, Sparkles, Heart, Send } from 'lucide-react';
import { WeatherMode } from '../types';
import { soundFx } from '../utils/audioSynth';

interface Header3AMProps {
  crtEnabled: boolean;
  setCrtEnabled: (val: boolean) => void;
  lightingTheme: 'amber' | 'indigo' | 'cyan';
  setLightingTheme: (val: 'amber' | 'indigo' | 'cyan') => void;
  weatherMode: WeatherMode;
  setWeatherMode: (val: WeatherMode) => void;
  onOpenShortcuts: () => void;
  onNavigateToSubmit: () => void;
  currentPage: 'radio' | 'submit';
}

export const Header3AM: React.FC<Header3AMProps> = ({
  crtEnabled,
  setCrtEnabled,
  lightingTheme,
  setLightingTheme,
  weatherMode,
  setWeatherMode,
  onOpenShortcuts,
  onNavigateToSubmit,
  currentPage,
}) => {
  const [timeStr, setTimeStr] = useState<string>('03:00:00 AM');
  const [blink, setBlink] = useState<boolean>(true);

  // Live clock updating
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      const secs = now.getSeconds().toString().padStart(2, '0');
      setTimeStr(`${hours}:${mins}:${secs} AM`);
      setBlink(prev => !prev);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const cycleWeather = () => {
    soundFx.playKeyClick();
    if (weatherMode === 'rain') {
      setWeatherMode('winter');
      soundFx.setRain(false);
      soundFx.setWinterWind(true, 0.3);
    } else if (weatherMode === 'winter') {
      setWeatherMode('clear');
      soundFx.setRain(false);
      soundFx.setWinterWind(false);
    } else {
      setWeatherMode('rain');
      soundFx.setWinterWind(false);
      soundFx.setRain(true, 0.3);
    }
  };

  const handleCrtToggle = () => {
    soundFx.playKeyClick();
    setCrtEnabled(!crtEnabled);
  };

  const cycleTheme = () => {
    soundFx.playKeyClick();
    if (lightingTheme === 'amber') setLightingTheme('indigo');
    else if (lightingTheme === 'indigo') setLightingTheme('cyan');
    else setLightingTheme('amber');
  };

  return (
    <header className="relative z-30 w-full max-w-7xl mx-auto px-4 pt-6 pb-2">
      {/* Top Status Ticker Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono-digital text-slate-400 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-800 shadow-lg shadow-black/40 mb-6">
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center text-cyan-400 font-semibold animate-pulse">
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
            3:00 AM THOUGHTS — NOCTURNAL RADIO
          </span>
          <span className="text-slate-700">|</span>
          <span className="text-purple-300 font-semibold flex items-center">
            <Heart className="w-3 h-3 text-rose-400 mr-1 animate-ping" />
            FOR THOSE STILL AWAKE
          </span>
          <span className="hidden sm:inline text-slate-700">|</span>
          <span className="hidden sm:inline text-sky-400 uppercase">
            ATMOSPHERE: {weatherMode === 'winter' ? 'SNOWY WINTER NIGHT' : weatherMode === 'rain' ? 'HEAVY RAIN ON WINDOW' : 'QUIET CLEAR NIGHT'}
          </span>
        </div>

        {/* Digital Clock Display */}
        <div className="flex items-center space-x-2">
          <span className="text-slate-500 hidden md:inline">SYSTEM TIME:</span>
          <div className="bg-slate-950/90 border border-cyan-500/30 px-3 py-1 rounded font-digital-clock text-cyan-400 text-lg tracking-widest glow-cyan flex items-center">
            <Moon className="w-3.5 h-3.5 mr-2 text-cyan-400 animate-pulse" />
            {timeStr.split(':')[0]}
            <span className={blink ? 'opacity-100' : 'opacity-20'}>:</span>
            {timeStr.split(':')[1]}
            <span className={blink ? 'opacity-100' : 'opacity-20'}>:</span>
            {timeStr.split(':')[2]}
          </div>
        </div>
      </div>

      {/* Main Title & Subtitle Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs px-3 py-1 rounded-full mb-3 uppercase tracking-wider font-mono-digital">
            <Moon className="w-3.5 h-3.5 text-purple-400" />
            <span>Late Night Music Sanctuary • Rain, Snow & Lofi Solitude</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-heading text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-sky-100 to-indigo-300 drop-shadow-sm">
            3:00 AM THOUGHTS
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl font-light leading-relaxed">
            When the world is fast asleep, your mind wanders furthest. A quiet aesthetic space for overthinkers, dreamers, and night owls navigating the late hours.
          </p>
        </div>

        {/* Action Controls & Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Prominent Submit Song Recommendation Button */}
          <button
            onClick={() => { soundFx.playKeyClick(); onNavigateToSubmit(); }}
            className={`flex items-center space-x-2 text-xs px-4 py-2 rounded-xl font-mono-digital font-semibold transition-all shadow-lg active:scale-95 ${
              currentPage === 'submit'
                ? 'bg-purple-600 text-white border border-purple-400 shadow-purple-600/40'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border border-purple-400/50 shadow-purple-900/50 animate-pulse'
            }`}
          >
            <Send className="w-3.5 h-3.5 text-purple-200" />
            <span>Submit Your Song Recommendation</span>
          </button>

          {/* Weather Mode Toggle (Rain / Winter / Clear) */}
          <button
            onClick={cycleWeather}
            className={`flex items-center space-x-2 text-xs px-3.5 py-2 rounded-lg border transition-all duration-300 ${
              weatherMode === 'winter'
                ? 'bg-sky-950/80 border-sky-400/50 text-sky-200 box-glow-cyan'
                : weatherMode === 'rain'
                ? 'bg-blue-950/80 border-blue-500/50 text-blue-300 box-glow-cyan'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Weather Atmosphere (Rain / Winter Snow / Clear)"
          >
            {weatherMode === 'winter' && <Snowflake className="w-4 h-4 text-sky-300 animate-spin-slow" />}
            {weatherMode === 'rain' && <CloudRain className="w-4 h-4 text-blue-400 animate-bounce" />}
            {weatherMode === 'clear' && <Sun className="w-4 h-4 text-amber-400" />}
            <span className="capitalize font-mono-digital">{weatherMode === 'winter' ? 'Winter Snow' : weatherMode === 'rain' ? 'Rainy Night' : 'Clear Night'}</span>
          </button>

          {/* CRT Overlay Toggle */}
          <button
            onClick={handleCrtToggle}
            className={`flex items-center space-x-2 text-xs px-3.5 py-2 rounded-lg border transition-all duration-300 ${
              crtEnabled
                ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300 box-glow-cyan'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Retro Screen Lines"
          >
            <Monitor className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline font-mono-digital">Retro Ambient</span>
          </button>

          {/* Color Lighting Swapper */}
          <button
            onClick={cycleTheme}
            className="flex items-center space-x-1.5 text-xs px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300 hover:border-slate-700 transition font-mono-digital"
            title={`Current Lighting: ${lightingTheme.toUpperCase()}`}
          >
            <div className={`w-2.5 h-2.5 rounded-full ${
              lightingTheme === 'amber' ? 'bg-amber-400 shadow-amber-400/50 shadow-sm' :
              lightingTheme === 'cyan' ? 'bg-cyan-400 shadow-cyan-400/50 shadow-sm' :
              'bg-indigo-400 shadow-indigo-400/50 shadow-sm'
            }`} />
            <span className="capitalize">{lightingTheme}</span>
          </button>

          {/* Keyboard Shortcuts Trigger */}
          <button
            onClick={() => { soundFx.playKeyClick(); onOpenShortcuts(); }}
            className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 transition"
            title="Keyboard Shortcuts Guide (Press 'K')"
          >
            <Keyboard className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};


