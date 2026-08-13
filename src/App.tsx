import React, { useState, useEffect, useCallback } from 'react';
import { Header3AM } from './components/Header3AM';
import { BackgroundRainCanvas } from './components/BackgroundRainCanvas';
import { Central3AMThoughtsHero } from './components/Central3AMThoughtsHero';
import { QuotesCarousel } from './components/QuotesCarousel';
import { SubmitToAdminPage } from './components/SubmitToAdminPage';
import { Footer3AM } from './components/Footer3AM';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { GlassMusicPlayer } from './components/GlassMusicPlayer';

import { TRACKS, LATE_NIGHT_THOUGHTS } from './data/playlist';
import { WeatherMode } from './types';
import { soundFx } from './utils/audioSynth';

import bg3amThoughtsRoom from './assets/images/bg_3am_thoughts_room_1786640871674.jpg';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'radio' | 'submit'>('radio');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [weatherMode, setWeatherMode] = useState<WeatherMode>('rain');
  const [crtEnabled, setCrtEnabled] = useState<boolean>(true);
  const [lightingTheme, setLightingTheme] = useState<'amber' | 'indigo' | 'cyan'>('cyan');

  const [showShortcutsModal, setShowShortcutsModal] = useState<boolean>(false);

  // Audio weather ambient initialization
  useEffect(() => {
    if (weatherMode === 'rain') {
      soundFx.setRain(true, 0.25);
    } else if (weatherMode === 'winter') {
      soundFx.setWinterWind(true, 0.25);
    }
  }, []);

  const handleTogglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const handleNextTrack = useCallback(() => {
    setCurrentTrackIndex(prev => (prev + 1) % TRACKS.length);
  }, []);

  const handlePrevTrack = useCallback(() => {
    setCurrentTrackIndex(prev => (prev - 1 + TRACKS.length) % TRACKS.length);
  }, []);

  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      switch (e.key) {
        case ' ':
          e.preventDefault();
          soundFx.playKeyClick();
          handleTogglePlay();
          break;
        case 'n':
        case 'N':
          soundFx.playKeyClick();
          handleNextTrack();
          break;
        case 'p':
        case 'P':
          soundFx.playKeyClick();
          handlePrevTrack();
          break;
        case 'r':
        case 'R':
          soundFx.playKeyClick();
          setWeatherMode(prev => {
            if (prev === 'rain') {
              soundFx.setRain(false);
              soundFx.setWinterWind(true, 0.3);
              return 'winter';
            } else if (prev === 'winter') {
              soundFx.setWinterWind(false);
              return 'clear';
            } else {
              soundFx.setRain(true, 0.3);
              return 'rain';
            }
          });
          break;
        case 'k':
        case 'K':
        case '?':
          soundFx.playKeyClick();
          setShowShortcutsModal(prev => !prev);
          break;
        default:
          soundFx.playKeyClick();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTogglePlay, handleNextTrack, handlePrevTrack]);

  return (
    <div className="relative min-h-screen pb-32 overflow-x-hidden selection:bg-purple-500/30 selection:text-purple-200 bg-slate-950">
      {/* Rain & Winter Canvas Background */}
      <BackgroundRainCanvas
        weatherMode={weatherMode}
        crtEnabled={crtEnabled}
        lightingTheme={lightingTheme}
        bgImageUrl={bg3amThoughtsRoom}
      />

      {/* Main Content Container */}
      <div className="relative z-20">
        {/* Header Bar */}
        <Header3AM
          crtEnabled={crtEnabled}
          setCrtEnabled={setCrtEnabled}
          lightingTheme={lightingTheme}
          setLightingTheme={setLightingTheme}
          weatherMode={weatherMode}
          setWeatherMode={setWeatherMode}
          onOpenShortcuts={() => setShowShortcutsModal(true)}
          onNavigateToSubmit={() => setCurrentPage(prev => prev === 'radio' ? 'submit' : 'radio')}
          currentPage={currentPage}
        />

        {currentPage === 'submit' ? (
          /* Page 2: Submit 3 AM Song/Thought to Admin Page */
          <SubmitToAdminPage
            onBackToRadio={() => setCurrentPage('radio')}
          />
        ) : (
          /* Page 1: Main Radio Sanctuary */
          <>
            {/* Central Hero Visualizer: 3:00 AM Thoughts Sanctuary */}
            <Central3AMThoughtsHero
              currentTrack={TRACKS[currentTrackIndex]}
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
              thoughts={LATE_NIGHT_THOUGHTS}
              weatherMode={weatherMode}
            />

            {/* Rotating 3 AM Thoughts Reflection Carousel */}
            <QuotesCarousel
              quotes={LATE_NIGHT_THOUGHTS}
            />
          </>
        )}

        {/* Footer with "Crafted With 💖 By Arbaj" */}
        <Footer3AM
          onNavigateToSubmit={() => setCurrentPage('submit')}
        />
      </div>

      {/* Glassmorphism Music Player Fixed at Bottom */}
      <GlassMusicPlayer
        tracks={TRACKS}
        currentTrackIndex={currentTrackIndex}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onSelectTrack={(idx) => setCurrentTrackIndex(idx)}
        onNextTrack={handleNextTrack}
        onPrevTrack={handlePrevTrack}
      />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
      />
    </div>
  );
}


