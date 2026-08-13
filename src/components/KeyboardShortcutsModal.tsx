import React from 'react';
import { X, Keyboard, Command, Terminal } from 'lucide-react';
import { soundFx } from '../utils/audioSynth';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Space', desc: 'Play / Pause Lofi Soundtrack' },
    { key: 'N', desc: 'Next Song in Playlist' },
    { key: 'P', desc: 'Previous Song in Playlist' },
    { key: 'R', desc: 'Cycle Weather Atmosphere (Rain / Winter / Clear)' },
    { key: 'T', desc: 'Next 3AM Late Night Thought' },
    { key: 'K / ?', desc: 'Toggle Keyboard Shortcuts Guide' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <Command className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold font-heading text-slate-100">3:00 AM Thoughts Hotkeys</h3>
          </div>
          <button
            onClick={() => { soundFx.playKeyClick(); onClose(); }}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-5 space-y-2.5">
          {shortcuts.map((sc, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80"
            >
              <span className="text-xs text-slate-300 font-mono-digital">{sc.desc}</span>
              <kbd className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-cyan-300 font-digital-clock text-xs tracking-wider shadow-inner">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-slate-500 text-center font-mono-digital">
          PRESS ANY KEY ON YOUR KEYBOARD TO TRIGGER MECHANICAL KEY SWITCH AUDIO
        </p>
      </div>
    </div>
  );
};
