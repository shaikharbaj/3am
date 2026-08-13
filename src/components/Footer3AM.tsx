import React from 'react';
import { Heart, Sparkles, Send, Moon, Radio } from 'lucide-react';
import { soundFx } from '../utils/audioSynth';

interface Footer3AMProps {
  onNavigateToSubmit: () => void;
}

export const Footer3AM: React.FC<Footer3AMProps> = ({ onNavigateToSubmit }) => {
  return (
    <footer className="relative z-20 w-full max-w-5xl mx-auto px-4 pt-8 pb-32">
      <div className="relative rounded-2xl bg-slate-950/80 border border-purple-500/20 backdrop-blur-md p-6 shadow-xl text-center flex flex-col items-center justify-center space-y-4">
        
        {/* Banner CTA to encourage users to submit their 3 AM song recommendation */}
        <div className="w-full p-4 rounded-xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/30">
              <Radio className="w-5 h-5 text-purple-400 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-heading text-slate-100 flex items-center space-x-1.5">
                <span>Have a song recommendation for 3 AM?</span>
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              </h4>
              <p className="text-xs text-slate-400 font-mono-digital">
                Share your favorite late-night song with us and we will definitely add it to our playlist!
              </p>
            </div>
          </div>

          <button
            onClick={() => { soundFx.playKeyClick(); onNavigateToSubmit(); }}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono-digital text-xs font-semibold shadow-lg shadow-purple-600/30 transition-all active:scale-95 whitespace-nowrap"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Your Song Recommendation</span>
          </button>
        </div>

        {/* Brand & Author Signature */}
        <div className="flex flex-col sm:flex-row items-center justify-between w-full pt-2 text-xs font-mono-digital text-slate-400 border-t border-slate-800/80">
          <div className="flex items-center space-x-2 mb-2 sm:mb-0">
            <Moon className="w-3.5 h-3.5 text-purple-400" />
            <span>3:00 AM Thoughts • Late Night Music Sanctuary</span>
          </div>

          {/* Requested Exact Text Signature */}
          <div className="flex items-center space-x-1.5 text-slate-300 font-semibold text-sm">
            <span>Crafted With</span>
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-bounce inline-block mx-0.5" />
            <span>By Arbaj</span>
          </div>

          <div className="text-slate-500 text-[11px] mt-2 sm:mt-0">
            © {new Date().getFullYear()} All Night Owls Welcome
          </div>
        </div>

      </div>
    </footer>
  );
};
