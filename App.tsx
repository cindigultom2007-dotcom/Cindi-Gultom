import React, { useState, useEffect, useRef } from 'react';
import { AdConfig } from './types';
import { ReelsAdPlayer } from './components/ReelsAdPlayer';
import { AdControlPanel } from './components/AdControlPanel';
import { SparklesIcon } from '@heroicons/react/24/solid';

const App: React.FC = () => {
  // 1. Initial State for Warung Mak Cindy
  const [config, setConfig] = useState<AdConfig>({
    shopName: 'Warung Mak Cindy',
    slogan: 'Pahae Jae • Enak • Murah • Bikin Nagih',
    location: 'Pahae Jae',
    whatsappNumber: '085765209782',
    subtext: 'Pahae Jae • Enak • Murah • Bikin Nagih',
    misopPriceStart: '5.000',
    misopPriceRange: '5.000 – 10.000',
    gorenganPriceRange: '1.000 – 2.000',
    kuePriceRange: '1.500 – 3.000',
  });

  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  
  // Transition trigger incremented when scene boundary is crossed
  const [transitionTrigger, setTransitionTrigger] = useState<number>(0);
  
  const lastSceneRef = useRef<number>(1);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastBeatRef = useRef<number>(-1);

  // Helper to resolve scene index mathematically
  const getSceneFromTime = (t: number): number => {
    if (t < 2) return 1;
    if (t < 6) return 2;
    if (t < 10) return 3;
    if (t < 13) return 4;
    return 5;
  };

  // 2. TIMELINE TIMER LOOP
  useEffect(() => {
    if (!isPlaying) return;

    // Tick every 50ms (responsive timeline scrubbing)
    const step = 0.05;
    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        let next = prev + step;
        if (next >= 15) {
          next = 0; // Seamless auto-loop!
        }
        return parseFloat(next.toFixed(2));
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // 3. BOUNDARY CROSS FADE EFFECT (FADES IN OVER 0.5s OVERLAY ON SCENE CHANGES)
  useEffect(() => {
    const currentScene = getSceneFromTime(currentTime);
    if (currentScene !== lastSceneRef.current) {
      // Trigger the keyframe black transition overlay
      setTransitionTrigger((prev) => prev + 1);
      lastSceneRef.current = currentScene;
    }
  }, [currentTime]);

  // 4. WEBAUDIO PRO-SYNTHESIS SOUNDTRACK COMPOSER
  const enableAudio = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      setIsMuted(false);
    } catch (err) {
      console.warn("Failed to activate audio node context:", err);
    }
  };

  const triggerSynthTone = (timeVal: number, sceneNum: number) => {
    if (!audioCtxRef.current || isMuted) return;
    const ctx = audioCtxRef.current;
    
    // Prevent noise on tab suspension or closed tabs
    if (ctx.state === 'suspended') return;
    
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    let freq = 220; // default note A3
    let duration = 0.15;

    // Procedural tracks matching each scene's mood and timings are generated:
    if (sceneNum === 1) {
      // SCENE 1: Cinematic title sweeps
      osc.type = 'sawtooth';
      const notes = [110, 146.83, 164.81, 220]; // D2, E2, A3
      const beatIndex = Math.floor((timeVal % 2) * 5) % notes.length;
      freq = notes[beatIndex];
      gainNode.gain.setValueAtTime(0.06, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      duration = 0.35;
    } else if (sceneNum === 2) {
      // SCENE 2: Warm soup tones
      osc.type = 'triangle';
      const notes = [261.63, 311.13, 392.00, 466.16]; // Cm7 chord arpeggios
      const beatIndex = Math.floor((timeVal % 4) * 4) % notes.length;
      freq = notes[beatIndex];
      gainNode.gain.setValueAtTime(0.12, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      duration = 0.3;
    } else if (sceneNum === 3) {
      // SCENE 3: Gorengan Crispy frying splats / high hat blips
      osc.type = 'sine';
      const isSplashOff = (timeVal * 10) % 5 < 2.5;
      freq = isSplashOff ? 840 : 420;
      gainNode.gain.setValueAtTime(0.05, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      duration = 0.08;

      if (isSplashOff) {
        const sizzleOsc = ctx.createOscillator();
        const sizzleGain = ctx.createGain();
        sizzleOsc.type = 'triangle';
        sizzleOsc.frequency.setValueAtTime(1400, now);
        sizzleOsc.connect(sizzleGain);
        sizzleGain.connect(ctx.destination);
        sizzleGain.gain.setValueAtTime(0.02, now);
        sizzleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        sizzleOsc.start(now);
        sizzleOsc.stop(now + 0.05);
      }
    } else if (sceneNum === 4) {
      // SCENE 4: Semicircle cake flips bell chimes
      osc.type = 'sine';
      const notes = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50]; // Beautiful sparkle C Major pentatonic
      const beatIndex = Math.floor((timeVal % 3) * 5) % notes.length;
      freq = notes[beatIndex];
      gainNode.gain.setValueAtTime(0.07, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      duration = 0.45;
    } else {
      // SCENE 5: High energy grand finale celebration melody!
      osc.type = 'square';
      const notes = [293.66, 329.63, 392.00, 440.00, 493.88, 587.33]; // Joyful energetic F major pentatonic
      const beatIndex = Math.floor((timeVal % 2) * 6) % notes.length;
      freq = notes[beatIndex];
      gainNode.gain.setValueAtTime(0.025, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      duration = 0.15;
    }

    osc.frequency.setValueAtTime(freq, now);
    osc.start(now);
    osc.stop(now + duration);
  };

  // Run beat checks every state update
  useEffect(() => {
    if (!isPlaying || isMuted) return;

    // Schedule note on sixteenth beats (4 beats per second)
    const currentBeat = Math.floor(currentTime * 4.5);
    if (currentBeat !== lastBeatRef.current) {
      const activeSec = getSceneFromTime(currentTime);
      triggerSynthTone(currentTime, activeSec);
      lastBeatRef.current = currentBeat;
    }
  }, [currentTime, isPlaying, isMuted]);

  // Jump helper
  const handleGoToScene = (targetTime: number) => {
    setCurrentTime(targetTime);
  };

  return (
    <div className="h-screen bg-zinc-950 bg-dot-grid text-zinc-50 selection:bg-orange-500/30 overflow-y-auto relative flex flex-col antialiased">
      
      {/* 1. Header workspace */}
      <h2 className="hidden">Warung Mak Cindy Reels Ad</h2>
      <header className="flex-shrink-0 bg-zinc-900/60 backdrop-blur-xl border-b border-zinc-900 px-6 py-4 flex items-center justify-between z-40 select-none">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/10">
            <span className="text-xl font-black">🍜</span>
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight leading-none text-white uppercase">
              {config.shopName} Ad Engine
            </h1>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-1 flex items-center">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping mr-1.5" />
              Simulated Reels AD Format • Facebook Reels
            </p>
          </div>
        </div>

        {/* Quick Help */}
        <div className="flex items-center space-x-3.5">
          <div className="hidden md:flex items-center space-x-1.5 text-zinc-400 text-xs font-semibold">
            <SparklesIcon className="w-4 h-4 text-orange-500" />
            <span>Murni Live Canvas + MediaExporter Engine</span>
          </div>
        </div>
      </header>

      {/* 2. Main Studio desk workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 flex items-center justify-center relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
          
          {/* LEFT CONTAINER: Ad Mockup Player (lg:col-span-6) */}
          <section className="lg:col-span-6 xl:col-span-7 flex justify-center items-center py-4">
            <ReelsAdPlayer
              currentTime={currentTime}
              config={config}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              transitionTrigger={transitionTrigger}
              onGoToScene={handleGoToScene}
              setCurrentTime={setCurrentTime}
            />
          </section>

          {/* RIGHT CONTAINER: Studio controller inputs (lg:col-span-6) */}
          <section className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center">
            <AdControlPanel
              currentTime={currentTime}
              setCurrentTime={setCurrentTime}
              config={config}
              setConfig={setConfig}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              isMuted={isMuted}
              setIsMuted={setIsMuted}
              onEnableAudio={enableAudio}
            />
          </section>

        </div>
      </main>

      {/* 3. Footer branding info */}
      <footer className="flex-shrink-0 bg-transparent py-4 text-center select-none text-zinc-600 font-mono text-[10px] uppercase">
        <p>
          Warung Mak Cindy Pahae Jae Facebook Reels Ad Generator © 2026 • Crafted with premium precision
        </p>
      </footer>

    </div>
  );
};

export default App;
