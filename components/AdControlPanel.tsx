import React from 'react';
import { AdConfig } from '../types';
import { PlayIcon, PauseIcon, ArrowPathIcon, SpeakerWaveIcon, SpeakerXMarkIcon, SparklesIcon, AdjustmentsHorizontalIcon, ShoppingBagIcon } from '@heroicons/react/24/solid';

interface AdControlPanelProps {
  currentTime: number;
  setCurrentTime: (time: number) => void;
  config: AdConfig;
  setConfig: (config: AdConfig) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  onEnableAudio: () => void;
}

export const AdControlPanel: React.FC<AdControlPanelProps> = ({
  currentTime,
  setCurrentTime,
  config,
  setConfig,
  isPlaying,
  setIsPlaying,
  isMuted,
  setIsMuted,
  onEnableAudio,
}) => {
  // Map value edits
  const handleInputChange = (field: keyof AdConfig, val: string) => {
    setConfig({
      ...config,
      [field]: val,
    });
  };

  const getSceneName = (t: number): string => {
    if (t < 2) return 'Scene 1: Hook Tantangan 🔥';
    if (t < 6) return 'Scene 2: Mi-Sop Reveal 🥣';
    if (t < 10) return 'Scene 3: Gorengan Drop 🍢';
    if (t < 13) return 'Scene 4: Kue Spotlight 🍰';
    return 'Scene 5: CTA Meledak 🎉';
  };

  // Jump helpers
  const scenes = [
    { name: '1. Hook Tantangan', desc: 'Awas! Bikin Ngiler zoom, vibration shake action.', start: 0, end: 2, icon: '🔥' },
    { name: '2. Mi-Sop Reveal', desc: 'Bowl bounces up with steam, sliding price info.', start: 2, end: 6, icon: '🥣' },
    { name: '3. Gorengan Drop', desc: '5 items drop with landing oil splat expanding rings.', start: 6, end: 10, icon: '🍢' },
    { name: '4. Kue Spotlight', desc: 'Cakes spinning in with ✦ sparkles rotation.', start: 10, end: 13, icon: '🍰' },
    { name: '5. CTA Meledak', desc: 'Green WA pulse button, colorful confetti cascade.', start: 13, end: 15, icon: '🎉' },
  ];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-6">
      
      {/* ===================================================
          1. HEADER CONTROLS
          =================================================== */}
      <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
        <div>
          <h3 className="text-white text-lg font-bold flex items-center space-x-2">
            <AdjustmentsHorizontalIcon className="w-5 h-5 text-orange-500" />
            <span>Studio Ad Planner</span>
          </h3>
          <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
            Ad: {getSceneName(currentTime)}
          </p>
        </div>
        
        {/* Timing Display */}
        <div className="bg-zinc-950 border border-zinc-800 px-3.5 py-1.5 rounded-full font-mono text-zinc-200 text-xs font-bold shadow-inner">
          <span className="text-orange-500">{currentTime.toFixed(2)}s</span>
          <span className="text-zinc-600"> / 15.0s</span>
        </div>
      </div>

      {/* ===================================================
          2. PLAYBACK STRIP
          =================================================== */}
      <div className="space-y-3.5 bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800/40">
        
        {/* Scrub Slider timeline */}
        <div className="flex items-center space-x-3">
          <span className="text-[10px] font-bold text-zinc-500 font-mono">0.0S</span>
          <input
            type="range"
            min="0"
            max="15"
            step="0.05"
            value={currentTime}
            onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
            className="flex-1 accent-orange-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer hover:accent-orange-400 duration-100"
          />
          <span className="text-[10px] font-bold text-zinc-500 font-mono">15.0S</span>
        </div>

        {/* Play/Pause/Mute buttons */}
        <div className="flex justify-between items-center pt-1">
          <div className="flex items-center space-x-2">
            
            {/* Play Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2.5 rounded-xl border duration-150 flex items-center justify-center cursor-pointer ${
                isPlaying
                  ? 'bg-orange-500/10 border-orange-500/25 text-orange-400 hover:bg-orange-500/20'
                  : 'bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-750'
              }`}
              title={isPlaying ? 'Pause' : 'Play ad'}
            >
              {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5 ml-0.5" />}
            </button>

            {/* Restart */}
            <button
              onClick={() => setCurrentTime(0)}
              className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 hover:border-zinc-700 text-zinc-300 duration-150 flex items-center justify-center cursor-pointer"
              title="Restart ad timeline"
            >
              <ArrowPathIcon className="w-5 h-5" />
            </button>
          </div>

          {/* ===================================================
              3. AUDIO SYNTH SOUNDTRACK
              =================================================== */}
          <div className="flex items-center space-x-2">
            
            {/* Audio Waves dance visuals */}
            {isPlaying && !isMuted && (
              <div className="flex space-x-0.5 h-6 items-end pb-1 select-none pr-1">
                {[1, 2, 3, 4, 5].map((idx) => (
                  <div
                    key={idx}
                    className="w-0.5 bg-green-500 rounded-full animate-pulse"
                    style={{
                      height: `${30 + Math.sin(currentTime * idx * 2) * 60}%`,
                      animationDuration: `${0.4 + idx * 0.15}s`,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Enable Synthesizer track */}
            <button
              onClick={() => {
                if (isMuted) {
                  onEnableAudio();
                } else {
                  setIsMuted(true);
                }
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all duration-150 flex items-center space-x-1.5 cursor-pointer ${
                !isMuted
                  ? 'bg-green-600/15 border-green-500/35 text-green-400 hover:bg-green-600/25 shadow-sm'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-350'
              }`}
              title="Aktifkan musik latar retro"
            >
              {!isMuted ? (
                <>
                  <SpeakerWaveIcon className="w-4 h-4 text-green-500" />
                  <span>Sound ON</span>
                </>
              ) : (
                <>
                  <SpeakerXMarkIcon className="w-4 h-4" />
                  <span>Muted</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================
          4. SCENE DIRECTOR BOARD
          =================================================== */}
      <div className="space-y-3">
        <h4 className="text-zinc-300 text-xs font-extrabold uppercase tracking-widest flex items-center space-x-1">
          <SparklesIcon className="w-3.5 h-3.5 text-yellow-500" />
          <span>Cinematic Scene Shortcuts</span>
        </h4>
        
        <div className="grid grid-cols-2 gap-2">
          {scenes.map((sc, index) => {
            const isInside = currentTime >= sc.start && currentTime < sc.end;
            return (
              <button
                key={index}
                onClick={() => setCurrentTime(sc.start)}
                className={`p-3 text-left rounded-xl border text-xs flex flex-col justify-between transition-all duration-150 cursor-pointer ${
                  isInside
                    ? 'bg-orange-500/10 border-orange-500/40 text-white shadow-md'
                    : 'bg-zinc-900/40 border-zinc-800/60 hover:bg-zinc-800/40 hover:border-zinc-700/60 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center space-x-1.5 font-bold mb-0.5">
                  <span className="text-sm">{sc.icon}</span>
                  <span className="font-extrabold truncate">{sc.name}</span>
                </div>
                <span className="text-[9.5px] opacity-75 font-medium line-clamp-1">{sc.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ===================================================
          5. CUSTOM AD CONTENT EDITOR FORM
          =================================================== */}
      <div className="space-y-3.5 pt-2">
        <h4 className="text-zinc-300 text-xs font-extrabold uppercase tracking-widest flex items-center space-x-1">
          <ShoppingBagIcon className="w-3.5 h-3.5 text-orange-500" />
          <span>Live Ad Customizer</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-zinc-950/30 p-4 rounded-2xl border border-zinc-800/80">
          
          {/* Shop Name */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">Warung Name</label>
            <input
              type="text"
              value={config.shopName}
              onChange={(e) => handleInputChange('shopName', e.target.value)}
              className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-lg focus:outline-none focus:border-orange-500 duration-150 font-semibold"
            />
          </div>

          {/* Location */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">Kecamatan/Slogan</label>
            <input
              type="text"
              value={config.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-lg focus:outline-none focus:border-orange-500 duration-150 font-semibold"
            />
          </div>

          {/* Slogan */}
          <div className="flex flex-col space-y-1 md:col-span-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">Intro Slogan / Subtext</label>
            <input
              type="text"
              value={config.subtext}
              onChange={(e) => handleInputChange('subtext', e.target.value)}
              className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-lg focus:outline-none focus:border-orange-500 duration-150 font-medium"
            />
          </div>

          {/* WhatsApp phone number */}
          <div className="flex flex-col space-y-1 md:col-span-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">WhatsApp Number</label>
            <input
              type="text"
              value={config.whatsappNumber}
              onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
              className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-lg focus:outline-none focus:border-orange-500 duration-150 font-mono text-zinc-300 font-extrabold"
              placeholder="e.g. 085765209782"
            />
          </div>

          {/* Mi-Sop Starting Price */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">Broth Bowl Start</label>
            <input
              type="text"
              value={config.misopPriceStart}
              onChange={(e) => handleInputChange('misopPriceStart', e.target.value)}
              className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-lg focus:outline-none focus:border-orange-500 duration-150 font-mono font-bold"
            />
          </div>

          {/* Mi-Sop High Price Range */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">Broth price range</label>
            <input
              type="text"
              value={config.misopPriceRange}
              onChange={(e) => handleInputChange('misopPriceRange', e.target.value)}
              className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-lg focus:outline-none focus:border-orange-500 duration-150 font-mono font-bold"
            />
          </div>

          {/* Gorengan Price Range */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">Fritter price range</label>
            <input
              type="text"
              value={config.gorenganPriceRange}
              onChange={(e) => handleInputChange('gorenganPriceRange', e.target.value)}
              className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-lg focus:outline-none focus:border-orange-500 duration-150 font-mono font-bold"
            />
          </div>

          {/* Kue Price Range */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">Kue Price range</label>
            <input
              type="text"
              value={config.kuePriceRange}
              onChange={(e) => handleInputChange('kuePriceRange', e.target.value)}
              className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-lg focus:outline-none focus:border-orange-500 duration-150 font-mono font-bold"
            />
          </div>

        </div>
      </div>

    </div>
  );
};
