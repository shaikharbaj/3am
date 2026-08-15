import React, { useState } from 'react';
import { Send, Music, ArrowLeft, Heart, Sparkles, Radio, Smile, CheckCircle2, Music2 } from 'lucide-react';
import { soundFx } from '../utils/audioSynth';

interface SubmitToAdminPageProps {
  onBackToRadio: () => void;
}

export const SubmitToAdminPage: React.FC<SubmitToAdminPageProps> = ({ onBackToRadio }) => {
  const [nickname, setNickname] = useState<string>('');
  const [songRecommendation, setSongRecommendation] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showThankYouAlert, setShowThankYouAlert] = useState<boolean>(false);
  const [submittedName, setSubmittedName] = useState<string>('');

  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!songRecommendation.trim()) return;

    soundFx.playKeyClick();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('https://3am-admin-api.vercel.app/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nickname: nickname.trim() || 'Night Owl',
          recommendation: songRecommendation.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to submit (${response.status})`);
      }

      soundFx.playSuccessSound();
      setSubmittedName(nickname.trim() || 'Night Owl');
      setIsSubmitting(false);
      setShowThankYouAlert(true);

      // Reset form fields
      setNickname('');
      setSongRecommendation('');
    } catch (error: any) {
      setIsSubmitting(false);
      setErrorMessage(error.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto my-6 px-4">
      {/* Navigation Header Back Button */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => { soundFx.playKeyClick(); onBackToRadio(); }}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-950 transition-all font-mono-digital text-xs shadow-lg shadow-black/50 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to 3 AM Radio Sanctuary</span>
        </button>

        <div className="flex items-center space-x-2 text-xs font-mono-digital text-purple-300 bg-purple-950/60 border border-purple-500/30 px-3 py-1.5 rounded-full">
          <Radio className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          <span>3 AM Community Songs</span>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="relative rounded-3xl bg-slate-950/90 border border-purple-500/30 backdrop-blur-2xl shadow-2xl p-6 sm:p-10">
        
        {/* Title Header */}
        <div className="text-center max-w-lg mx-auto mb-8">
          <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs px-3.5 py-1 rounded-full mb-3 uppercase tracking-wider font-mono-digital">
            <Music className="w-3.5 h-3.5 text-purple-400" />
            <span>Share Your Late Night Soundtracks</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-sky-100 to-indigo-300">
            Submit Your Songs
          </h2>
          <p className="text-slate-400 text-sm mt-2 font-light leading-relaxed">
            Got a special track that accompanies your late-night thoughts? Share your recommendation with us below!
          </p>
        </div>

        {/* Sweet Lovely Thank You Alert Modal Overlay */}
        {showThankYouAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-md bg-gradient-to-b from-purple-950 via-slate-900 to-slate-950 border border-purple-400/50 rounded-3xl p-8 shadow-2xl text-center space-y-5 transform animate-bounce-short">
              
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-purple-500 to-rose-500 p-0.5 shadow-lg shadow-purple-500/30 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-rose-400 fill-rose-500 animate-pulse" />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold font-heading text-purple-100 flex items-center justify-center space-x-2">
                  <span>Thank You So Much, {submittedName}!</span>
                  <Sparkles className="w-5 h-5 text-purple-300" />
                </h3>
                <p className="text-sm text-purple-200/90 font-light mt-3 leading-relaxed">
                  Your 3 AM song recommendation was received with so much love 💖! We can't wait to add it to our late-night playlist and share it with fellow night owls.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-purple-900/30 border border-purple-500/20 text-xs font-mono-digital text-purple-300 flex items-center justify-center space-x-2">
                <Music2 className="w-4 h-4 text-purple-400 animate-spin-slow" />
                <span>Added to our playlist queue with care! 🎧</span>
              </div>

              <button
                onClick={() => { soundFx.playKeyClick(); setShowThankYouAlert(false); }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold font-mono-digital text-xs shadow-lg shadow-purple-600/30 transition-all active:scale-95"
              >
                Back to Music Sanctuary 🎧
              </button>
            </div>
          </div>
        )}

        {/* Clean Simple Form */}
        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
          
          {/* Input 1: Nickname */}
          <div>
            <label className="block text-xs font-mono-digital text-purple-300 mb-2 font-semibold">
              Your Nickname <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              placeholder="e.g. Sleepless Wanderer, RainLover, Anonymous"
              className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition font-mono-digital shadow-inner"
            />
          </div>

          {/* Input 2: 3 AM Songs */}
          <div>
            <label className="block text-xs font-mono-digital text-purple-300 mb-2 font-semibold">
              3 AM Songs / Song Recommendation <span className="text-rose-400">*</span>
            </label>
            <textarea
              value={songRecommendation}
              onChange={e => setSongRecommendation(e.target.value)}
              placeholder="Type your favorite 3 AM song title, artist, or link here... (e.g. 'Lofi Rain - Kainbeats' or 'https://youtube.com/...')"
              rows={4}
              required
              className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition font-mono-digital leading-relaxed shadow-inner"
            />
          </div>

          {/* Submit Button with requested exact label */}
          <button
            type="submit"
            disabled={isSubmitting || !songRecommendation.trim()}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold font-mono-digital text-sm shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center space-x-2 active:scale-[0.99]"
          >
            {isSubmitting ? (
              <span>Sending Your Song Recommendation...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Your Song Recommendation</span>
              </>
            )}
          </button>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-center text-xs font-mono-digital text-rose-300 flex items-center justify-center space-x-2">
              <span>⚠️ {errorMessage}</span>
            </div>
          )}
        </form>

        {/* Funny Notice at the Bottom as requested */}
        <div className="mt-10 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-center text-xs font-mono-digital text-amber-200/90 space-y-1 max-w-xl mx-auto shadow-lg">
          <div className="flex items-center justify-center space-x-1.5 font-bold text-amber-300 text-sm">
            <Smile className="w-4 h-4 text-amber-400 inline-block" />
            <span>Funny Late Night Promise 😄</span>
          </div>
          <p className="text-amber-200/80 font-light pt-0.5 leading-relaxed">
            "If you share your songs, we will definitely add them to our playlist — even if it's 3 AM acoustic whistling or midnight rain sounds!" 🎵✨
          </p>
        </div>

      </div>
    </div>
  );
};
