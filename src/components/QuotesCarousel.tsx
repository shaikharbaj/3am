import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Copy, Check, Heart, Sparkles, Moon } from 'lucide-react';
import { LateNightThought } from '../types';
import { soundFx } from '../utils/audioSynth';

interface QuotesCarouselProps {
  quotes: LateNightThought[];
}

export const QuotesCarousel: React.FC<QuotesCarouselProps> = ({ quotes }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(false);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);

  const currentQuote = quotes[currentIndex] || quotes[0];

  // Auto rotate quote every 7 seconds
  useEffect(() => {
    if (!isAutoRotate) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % quotes.length);
      setLiked(false);
    }, 7000);

    return () => clearInterval(interval);
  }, [quotes.length, isAutoRotate]);

  const handleNext = () => {
    soundFx.playKeyClick();
    setCurrentIndex(prev => (prev + 1) % quotes.length);
    setLiked(false);
  };

  const handlePrev = () => {
    soundFx.playKeyClick();
    setCurrentIndex(prev => (prev - 1 + quotes.length) % quotes.length);
    setLiked(false);
  };

  const handleCopy = () => {
    soundFx.playKeyClick();
    navigator.clipboard.writeText(`"${currentQuote.text}" — 3:00 AM Thoughts`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleLike = () => {
    soundFx.playKeyClick();
    setLiked(!liked);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto my-8 px-2">
      {/* Main Quote Card Frame */}
      <div 
        className="relative rounded-2xl bg-slate-950/80 border border-purple-500/20 p-6 sm:p-8 backdrop-blur-md shadow-xl transition-all duration-700 hover:border-purple-500/40"
        onMouseEnter={() => setIsAutoRotate(false)}
        onMouseLeave={() => setIsAutoRotate(true)}
      >
        <div className="absolute top-4 left-4 text-purple-500/10">
          <Moon className="w-16 h-16" />
        </div>

        {/* Category Tag */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <span className="text-xs font-mono-digital text-purple-300 bg-purple-950/60 border border-purple-500/30 px-3 py-1 rounded-full uppercase tracking-wider flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>3:00 AM THOUGHT • {currentQuote.theme}</span>
          </span>
          <span className="text-xs font-mono-digital text-slate-500">
            {currentIndex + 1} / {quotes.length}
          </span>
        </div>

        {/* Quote Content text */}
        <div className="my-6 relative z-10 min-h-[90px] flex flex-col justify-center">
          <p className="text-lg sm:text-2xl font-heading font-light text-slate-100 leading-relaxed italic drop-shadow">
            "{currentQuote.text}"
          </p>
          <div className="mt-3 flex items-center space-x-2 text-xs font-mono-digital text-purple-400/80">
            <span>— Recorded at {currentQuote.timeContext}</span>
          </div>
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 relative z-10">
          <div className="flex items-center space-x-2">
            {/* Prev Quote */}
            <button
              onClick={handlePrev}
              className="p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:bg-slate-700 transition"
              title="Previous Thought"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Next Quote */}
            <button
              onClick={handleNext}
              className="p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:bg-slate-700 transition"
              title="Next Thought"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <span className="text-xs text-slate-500 font-mono-digital hidden sm:inline pl-2">
              {isAutoRotate ? 'Cycling thoughts...' : 'Paused'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Copy Quote Button */}
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 text-xs px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition font-mono-digital"
              title="Copy thought to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Share Thought'}</span>
            </button>

            {/* Favorite Like Button */}
            <button
              onClick={handleToggleLike}
              className={`p-2 rounded-lg transition ${
                liked ? 'bg-rose-950/80 text-rose-400 border border-rose-500/50' : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
              title="Relate to thought"
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-rose-400' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

