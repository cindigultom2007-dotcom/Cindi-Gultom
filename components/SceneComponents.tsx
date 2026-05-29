import React from 'react';
import { AdConfig } from '../types';

interface SceneProps {
  time: number;
  config: AdConfig;
}

// ==========================================
// SCENE 1: CINEMATIC TITLE (0–3s)
// ==========================================
export const Scene1Cinematic: React.FC<SceneProps> = ({ config }) => {
  return (
    <div className="absolute inset-0 bg-black flex flex-col justify-center items-center overflow-hidden p-6 text-center select-none">
      {/* Background ambient lighting */}
      <div className="absolute w-72 h-72 rounded-full bg-orange-600/10 blur-[120px] top-1/4 left-1/2 -translate-x-1/2" />
      
      <div className="s1-bounce-effect flex flex-col items-center">
        <h1 className="s1-title-left text-white text-[50px] font-black tracking-tighter leading-none uppercase mb-1">
          {config.shopName.split(' ')[0]}
        </h1>
        <h1 className="s1-title-right text-[#F97316] text-[52px] font-black tracking-tighter leading-none uppercase">
          {config.shopName.split(' ').slice(1).join(' ') || 'MAK CINDY'}
        </h1>
        
        {/* Animated Oranye Line */}
        <div className="w-48 h-[6px] bg-[#F97316] rounded-full mt-4 mb-3 s1-line-expand" />
        
        {/* Sub-text Fade */}
        <p className="s1-subtext-fade text-zinc-400 font-bold tracking-[0.15em] text-[13px] uppercase">
          {config.subtext}
        </p>
      </div>
    </div>
  );
};

// ==========================================
// SCENE 2: MI-SOP HERO (3–9s)
// ==========================================
export const Scene2Misop: React.FC<SceneProps> = ({ time, config }) => {
  // Relative time in scene (0 to 6s)
  const relTime = Math.max(0, time - 3);

  // 10 orange particles floating up
  const particles = Array.from({ length: 10 }).map((_, i) => {
    const xPos = (i * 9) + 5; // spacing across width
    const delay = (i * 0.4);
    const floatDur = 5 + (i % 3);
    const maxOpacity = 0.3 + (i % 4) * 0.1;
    const drift = 15 + (i % 3) * 10;
    return (
      <div
        key={i}
        className="s2-particle bg-[#F97316]"
        style={{
          left: `${xPos}%`,
          width: `${4 + (i % 3) * 2}px`,
          height: `${4 + (i % 3) * 2}px`,
          '--float-dur': `${floatDur}s`,
          '--max-opacity': maxOpacity,
          '--drift-x': `${drift}px`,
          animationDelay: `${delay}s`,
        } as React.CSSProperties}
      />
    );
  });

  return (
    <div className="absolute inset-0 bg-zinc-950 flex flex-col justify-between overflow-hidden p-6 text-center select-none">
      {/* Drifting Particles background */}
      <div className="absolute inset-0 opacity-80 z-0">{particles}</div>

      {/* Header and Titles */}
      <div className="relative z-10 pt-10 flex flex-col items-center">
        <h2 className="s2-text-left text-white text-[42px] font-black tracking-tight leading-none uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          MI-SOP
        </h2>
        <h2 className="s2-text-right text-[#F97316] text-[42px] font-black tracking-tight leading-none uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] mt-1">
          HANGAT
        </h2>
      </div>

      {/* Bowl graphic centered */}
      <div className="relative flex items-center justify-center flex-1 my-auto z-10">
        {/* Steam overlay (Uap rising) */}
        <div className="absolute -top-16 flex justify-center space-x-6 w-48 z-20">
          {[1, 2, 3, 4].map((i) => (
            <svg
              key={i}
              className="s2-uap-path w-6 h-16 text-white/20"
              style={{
                '--steam-dur': `${2.2 + i * 0.4}s`,
                '--uap-drift': `${i * 6 - 15}px`,
                animationDelay: `${i * 0.3}s`,
              } as React.CSSProperties}
              viewBox="0 0 24 80"
              fill="none"
            >
              <path
                d="M12 80 C 18 60, 6 40, 12 20 C 18 10, 6 10, 12 0"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          ))}
        </div>

        {/* Master springing core bowl */}
        <div className="s2-bowl-container relative">
          {/* Rim / Bowl Outer circle */}
          <div className="w-56 h-56 rounded-full bg-amber-50 border-[10px] border-amber-800 shadow-2xl flex items-center justify-center relative overflow-hidden">
            {/* Inner Broth (Kuah) */}
            <div className="w-[92%] h-[92%] rounded-full bg-gradient-to-tr from-orange-600 via-amber-500 to-red-600 relative shadow-[inset_0_4px_12px_rgba(0,0,0,0.6)] flex items-center justify-center">
              
              {/* Golden Yellow Noodles - Curved bands */}
              <div className="absolute inset-0 overflow-hidden rounded-full opacity-90">
                <div className="absolute w-36 h-8 border-b-4 border-yellow-300 rounded-[50%] top-1/3 left-6 rotate-12" />
                <div className="absolute w-40 h-10 border-b-4 border-yellow-300 rounded-[50%] top-6 left-4 rotate-[-20deg]" />
                <div className="absolute w-32 h-12 border-b-4 border-yellow-400 rounded-[50%] bottom-8 left-8 rotate-[45deg]" />
                <div className="absolute w-32 h-6 border-b-4 border-yellow-300 rounded-[50%] top-[45%] right-8 rotate-[-15deg]" />
                <div className="absolute w-44 h-16 border-b-[3px] border-yellow-200/80 rounded-[50%] top-4 right-2 rotate-[110deg]" />
              </div>

              {/* Bakso (3 small dark grey circles) */}
              <div className="absolute w-12 h-12 rounded-full bg-stone-700 shadow-[inset_-3px_-3px_8px_rgba(0,0,0,0.6),_2px_4px_6px_rgba(0,0,0,0.3)] border border-stone-600 left-[22%] top-[30%] flex items-center justify-center" />
              <div className="absolute w-11 h-11 rounded-full bg-stone-750 shadow-[inset_-3px_-3px_8px_rgba(0,0,0,0.6),_2px_4px_6px_rgba(0,0,0,0.3)] border border-stone-600 left-[44%] top-[18%] flex items-center justify-center" />
              <div className="absolute w-11 h-11 rounded-full bg-stone-800 shadow-[inset_-3px_-3px_8px_rgba(0,0,0,0.6),_2px_4px_6px_rgba(0,0,0,0.3)] border border-stone-600 left-[30%] top-[55%] flex items-center justify-center" />

              {/* Telur (Boiled Egg Half) */}
              <div className="absolute w-14 h-16 bg-white rounded-[45%_45%_50%_50%] right-[18%] top-[32%] rotate-[-25deg] shadow-lg flex items-center justify-center border border-zinc-200 overflow-hidden">
                {/* Yellow Yolk */}
                <div className="w-[60%] h-[55%] rounded-full bg-yellow-400 border border-yellow-500 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4)]" />
              </div>

              {/* Scattered Green Scallions / Celery */}
              <div className="absolute w-2 h-4 bg-green-500 rounded-sm rotate-[30deg] left-[15%] top-[15%]" />
              <div className="absolute w-2.5 h-1.5 bg-green-600 rounded-sm rotate-[-45deg] right-[10%] top-[25%]" />
              <div className="absolute w-2 h-3.5 bg-green-500 rounded-sm rotate-[15deg] right-[40%] bottom-[12%]" />
              <div className="absolute w-1.5 h-3 bg-green-450 rounded-sm rotate-[-15deg] left-[20%] bottom-[25%]" />
              <div className="absolute w-3 h-1.5 bg-green-500 rounded-sm rotate-[60deg] right-[25%] top-[60%]" />
            </div>
          </div>

          {/* Glowing Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-orange-500/30 scale-105 animate-pulse pointer-events-none" />
        </div>
      </div>

      {/* Red Price Badge bubble rising up */}
      <div className="relative z-20 pb-12">
        <div className="s2-badge-pop mx-auto bg-red-600 shadow-[0_8px_20px_rgba(220,38,38,0.4)] text-white font-extrabold text-[15px] px-6 py-3.5 rounded-full border-2 border-white max-w-[220px]">
          Mulai Rp {config.misopPriceStart}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// SCENE 3: GORENGAN RAIN (9–15s)
// ==========================================
export const Scene3Gorengan: React.FC<SceneProps> = ({ time, config }) => {
  const relTime = Math.max(0, time - 9);

  // Define 8 raining items with coordinates & styles
  const fItems = [
    { name: 'Tempe', type: 'tempe', left: '15%', delay: 0.1, duration: 1.0, y: '580px', rot: '12deg' },
    { name: 'Tahu', type: 'tahu', left: '38%', delay: 0.4, duration: 0.9, y: '595px', rot: '-18deg' },
    { name: 'Pisang', type: 'pisang', left: '62%', delay: 0.7, duration: 1.1, y: '590px', rot: '25deg' },
    { name: 'Ubi', type: 'ubi', left: '82%', delay: 1.0, duration: 1.0, y: '600px', rot: '-5deg' },
    { name: 'Bakwan', type: 'bakwan', left: '26%', delay: 1.3, duration: 0.95, y: '565px', rot: '15deg' },
    { name: 'Tempe', type: 'tempe', left: '50%', delay: 1.6, duration: 1.05, y: '575px', rot: '-35deg' },
    { name: 'Tahu', type: 'tahu', left: '72%', delay: 1.9, duration: 0.9, y: '585px', rot: '8deg' },
    { name: 'Pisang', type: 'pisang', left: '46%', delay: 2.2, duration: 1.1, y: '550px', rot: '45deg' },
  ];

  return (
    <div className="absolute inset-0 s3-rain-bg flex flex-col items-center overflow-hidden p-6 select-none">
      {/* Dynamic titles */}
      <div className="relative z-20 pt-10 text-center">
        <h2 className="text-white text-[44px] font-black tracking-tighter leading-none uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
          GORENGAN
        </h2>
        <div className="h-1" />
        <h3 className="s3-shake-kriuuk text-yellow-300 text-[35px] font-black italic tracking-wide drop-shadow-[0_3px_8px_rgba(0,0,0,0.6)]">
          KRIUUUK!!
        </h3>
      </div>

      {/* Physics 8 Raining elements falling */}
      {fItems.map((item, idx) => {
        const hasLand = relTime >= (item.delay + item.duration - 0.2);
        return (
          <React.Fragment key={idx}>
            {/* Raining item */}
            <div
              className="s3-raining-item absolute z-15"
              style={{
                left: item.left,
                '--fall-dur': `${item.duration}s`,
                '--fall-delay': `${item.delay}s`,
                '--land-y': item.y,
                '--rot-start': `${-40 + (idx * 20)}deg`,
                '--rot-mid': `${180 + (idx * 90)}deg`,
                '--rot-final': item.rot,
              } as React.CSSProperties}
            >
              {renderGorenganVector(item.type)}
            </div>

            {/* Splash triggers around landing time */}
            {relTime >= (item.delay + item.duration - 0.1) && relTime <= (item.delay + item.duration + 0.5) && (
              <div
                className="absolute z-20 pointer-events-none"
                style={{ left: item.left, top: item.y }}
              >
                {/* 6 splash dots dispersing */}
                {[0, 60, 120, 180, 240, 300].map((deg) => (
                  <div
                    key={deg}
                    className="s3-splash absolute w-1.5 h-1.5 bg-yellow-300 rounded-full"
                    style={{
                      '--dx': `${Math.cos((deg * Math.PI) / 180) * 35}px`,
                      '--dy': `${Math.sin((deg * Math.PI) / 180) * 20 - 15}px`,
                    } as React.CSSProperties}
                  />
                ))}
              </div>
            )}
          </React.Fragment>
        );
      })}

      {/* Pile grow heaps in sync with rainfall (increasing depth) */}
      <div className="absolute inset-x-6 bottom-[24%] h-12 z-10 flex justify-center items-end">
        {/* Layered representations of piles */}
        <div className="s3-pile-layer absolute bottom-0 w-11/12 h-6" style={{ '--pile-delay': '1.1s' } as React.CSSProperties}>
          <div className="w-full h-full bg-amber-800/80 rounded-full blur-[2px]" />
        </div>
        <div className="s3-pile-layer absolute bottom-1 w-10/12 h-6" style={{ '--pile-delay': '1.8s' } as React.CSSProperties}>
          <div className="w-full h-full bg-amber-700/80 rounded-full" />
        </div>
        <div className="s3-pile-layer absolute bottom-2 w-8/12 h-7" style={{ '--pile-delay': '2.4s' } as React.CSSProperties}>
          <div className="w-full h-full bg-amber-600/90 rounded-full border border-amber-500/30 shadow-md" />
        </div>
      </div>

      {/* The Table Line at 75% depth */}
      <div className="absolute left-6 right-6 h-1 bg-white/60 bottom-[25%] rounded-full shadow-lg z-10" />

      {/* Price billboard badge pop (from 11.5s onwards, i.e., relTime >= 2.5s) */}
      {relTime >= 2.5 && (
        <div className="absolute bottom-[10%] mx-auto left-1/2 -translate-x-1/2 z-30 animate-[fadeIn_0.5s_ease-out_forwards] flex flex-col items-center">
          <div className="bg-amber-950/80 backdrop-blur-md border border-amber-700 py-3 px-8 rounded-full text-white font-extrabold text-[19px] tracking-wide text-center">
            @ Rp {config.gorenganPriceRange}
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// SCENE 4: KUE CAROUSEL (15–20s)
// ==========================================
export const Scene4Kue: React.FC<SceneProps> = ({ time, config }) => {
  const relTime = Math.max(0, time - 15);

  // Semicircle crescent coordinates for 5 cakes
  // Left offsets and vertical bends
  const cakes = [
    { name: 'Kue Lapis', type: 'lapis', x: '18%', y: '61%', delay: 0.0, label: 'Lapis 💚' },
    { name: 'Bolu Kukus', type: 'bolu', x: '34%', y: '52%', delay: 0.2, label: 'Bolu 🌸' },
    { name: 'Brownies', type: 'brownies', x: '50%', y: '47%', delay: 0.4, label: 'Brownies 🍫' },
    { name: 'Bakpau', type: 'bakpau', x: '66%', y: '52%', delay: 0.6, label: 'Bakpau 🥯' },
    { name: 'Kue Lumpur', type: 'lumpur', x: '82%', y: '61%', delay: 0.8, label: 'Lumpur 🍮' },
  ];

  return (
    <div className="absolute inset-0 bg-gradient-to-b from-[#1E1B4B] to-[#4C1D95] flex flex-col justify-between overflow-hidden p-6 select-none">
      
      {/* Title */}
      <div className="relative pt-10 text-center z-10">
        <h2 className="text-white text-[38px] font-black tracking-tighter leading-none uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
          KUE HOMEMADE
        </h2>
        <p className="text-yellow-300 font-bold text-lg mt-2 tracking-wide">
          {config.kuePriceRange ? `Mulai Rp ${config.kuePriceRange.split(' ')[0]}` : 'Fresh setiap hari 🍰'}
        </p>
      </div>

      {/* Semicircular Carousel Arc of Cakes */}
      <div className="relative flex-1 w-full h-full z-10">
        <div className={`w-full h-full relative ${relTime >= 3.5 ? 's4-master-bounce' : ''}`}>
          {cakes.map((cake, idx) => {
            return (
              <div
                key={idx}
                className="absolute flex flex-col items-center select-none"
                style={{
                  left: cake.x,
                  top: cake.y,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* 3D Flip Card Shell */}
                <div
                  className="s4-kue-card relative w-16 h-16 flex items-center justify-center p-1 rounded-2xl bg-zinc-900/90 border border-purple-500/20 shadow-xl"
                  style={{ '--flip-delay': `${cake.delay}s` } as React.CSSProperties}
                >
                  {renderKueVector(cake.type)}

                  {/* Sparkle star elements */}
                  {relTime >= cake.delay + 0.4 && (
                    <div
                      className="s4-star-fast absolute text-yellow-300 text-lg select-none"
                      style={{
                        top: idx % 2 === 0 ? '-8px' : '48px',
                        left: idx % 2 === 0 ? '48px' : '-8px',
                        '--star-delay': `${idx * 0.3}seconds`
                      } as React.CSSProperties}
                    >
                      ✦
                    </div>
                  )}
                </div>

                {/* Micro Cake tag */}
                <div className="mt-2.5 bg-black/60 border border-purple-400/30 text-[10px] text-zinc-100 font-extrabold px-1.5 py-0.5 rounded shadow">
                  {cake.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Slogan details */}
      <div className="relative pb-10 text-center z-10">
        <div className="bg-purple-950/50 backdrop-blur-md border border-purple-800/40 py-2 px-6 rounded-full inline-block">
          <p className="text-purple-200 text-xs font-bold tracking-[0.1em] uppercase">
            RESEP PILIHAN • 100% HIGIENIS 🧁
          </p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// SCENE 5: HARGA BILLBOARD (20–24s)
// ==========================================
export const Scene5Billboard: React.FC<SceneProps> = ({ config }) => {
  return (
    <div className="absolute inset-0 bg-white flex flex-col justify-between overflow-hidden p-6 select-none shadow-inner">
      {/* Upper branding */}
      <div className="pt-10 flex flex-col items-center">
        <h2 className="text-[#09090b] text-[30px] font-black tracking-tighter leading-none text-center">
          HARGA BERSAHABAT
        </h2>
        <div className="w-20 h-1 bg-[#F97316] rounded-full mt-2" />
      </div>

      {/* Stacked price cards */}
      <div className="flex-1 flex flex-col justify-center space-y-4 my-auto px-2">
        {/* Card 1: Mi Sop */}
        <div
          className="s5-card-bounce flex items-center justify-between p-4 bg-orange-50 border-2 border-[#F97316] rounded-2xl shadow-md"
          style={{ '--card-delay': '0.1s' } as React.CSSProperties}
        >
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🍜</span>
            <span className="text-[#09090b] font-black text-lg tracking-tight uppercase">Mi-SOP</span>
          </div>
          <div className="text-right">
            <span className="text-zinc-500 font-bold block text-[10px] uppercase">Rentan Harga</span>
            <span className="text-[#F97316] font-black text-lg">Rp {config.misopPriceRange}</span>
          </div>
        </div>

        {/* Card 2: Gorengan */}
        <div
          className="s5-card-bounce flex items-center justify-between p-4 bg-amber-50 border-2 border-amber-800 rounded-2xl shadow-md"
          style={{ '--card-delay': '0.3s' } as React.CSSProperties}
        >
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🍢</span>
            <span className="text-[#09090b] font-black text-lg tracking-tight uppercase">GORENGAN</span>
          </div>
          <div className="text-right">
            <span className="text-zinc-500 font-bold block text-[10px] uppercase font-bold">Per Biji</span>
            <span className="text-amber-800 font-black text-lg">Rp {config.gorenganPriceRange}</span>
          </div>
        </div>

        {/* Card 3: Kue */}
        <div
          className="s5-card-bounce flex items-center justify-between p-4 bg-purple-50 border-2 border-purple-800 rounded-2xl shadow-md"
          style={{ '--card-delay': '0.5s' } as React.CSSProperties}
        >
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🍰</span>
            <span className="text-[#09090b] font-black text-lg tracking-tight uppercase font-extrabold">KUE BASAH</span>
          </div>
          <div className="text-right">
            <span className="text-zinc-500 font-bold block text-[10px] uppercase font-bold">Mulai Dari</span>
            <span className="text-purple-800 font-black text-lg">Rp {config.kuePriceRange}</span>
          </div>
        </div>
      </div>

      {/* Bottom statement info */}
      <div className="pb-10 flex flex-col items-center">
        <p className="text-zinc-500 font-bold tracking-wide text-sm">
          Bisa pesan langsung via WA!
        </p>
      </div>
    </div>
  );
};

// ==========================================
// SCENE 6: GRAND FINALE CTA (24–30s)
// ==========================================
export const Scene6Finale: React.FC<SceneProps> = ({ config }) => {
  // Generate 32 falling color confetti dots
  const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#FFFFFF'];
  const confetti = Array.from({ length: 30 }).map((_, i) => {
    const leftPr = (i * 3.3) + 1; // spacing across screen x
    const delay = (i * 0.12);
    const duration = 2.5 + (i % 3) * 0.8;
    const size = 6 + (i % 3) * 4;
    const color = colors[i % colors.length];
    const driftX = -40 + (i % 4) * 30; // left/right drift during fall
    const rot = 180 + (i % 3) * 180; // spin degrees
    
    return (
      <div
        key={i}
        className="s6-confetti"
        style={{
          left: `${leftPr}%`,
          backgroundColor: color,
          width: `${size}px`,
          height: `${size * (1 + (i % 2))}px`, // square or rect rectangular confetti
          borderRadius: i % 3 === 0 ? '50%' : '2px', // circles or flakes
          '--c-dur': `${duration}s`,
          '--c-delay': `${delay}s`,
          '--c-drift': `${driftX}px`, 
          '--c-rot': `${rot}deg`,
        } as React.CSSProperties}
      />
    );
  });

  return (
    <div className="absolute inset-0 bg-[#F97316] flex flex-col justify-between overflow-hidden p-6 text-center select-none shadow-bevel">
      {/* Simulated confetti rain overlay */}
      <div className="absolute inset-0 opacity-90 pointer-events-none z-10">{confetti}</div>

      {/* Main Core Store Heading Card */}
      <div className="relative pt-12 z-20 flex flex-col items-center">
        <span className="text-[34px] animate-bounce filter drop-shadow">🔥🏠🔥</span>
        <h1 className="s6-rubberband-text text-white text-[38px] font-black tracking-tighter uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)] mt-3">
          {config.shopName}
        </h1>
        <h2 className="text-white text-[21px] font-extrabold tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] mt-1.5 bg-black/25 px-5 py-1.5 rounded-full inline-block">
          {config.location} ❤️
        </h2>
      </div>

      {/* Big Action CTA pulse */}
      <div className="relative z-25 flex flex-col items-center px-2">
        <a
          href={formatWhatsAppLink(config.whatsappNumber)}
          target="_blank"
          rel="noopener noreferrer"
          className="s6-wa-pulse bg-[#15803D] hover:bg-[#166534] border border-green-500/30 text-white font-extrabold text-[17px] tracking-tight uppercase py-4 px-6 rounded-full w-full shadow-lg flex items-center justify-center space-x-2.5 active:scale-[0.97] transition-all cursor-pointer select-none"
        >
          {/* Logo WhatsApp inline SVG code */}
          <svg className="w-6 h-6 fill-current flex-shrink-0" viewBox="0 0 24 24">
            <path d="M12.004 2c-5.517 0-9.993 4.476-9.993 9.993 0 1.761.458 3.473 1.332 4.978L2 22l5.183-1.361c1.45.79 3.067 1.206 4.814 1.206 5.518 0 10-4.478 10-10.001S17.521 2 12.004 2zm0 1.662c4.6 0 8.339 3.738 8.339 8.331 0 4.593-3.739 8.331-8.339 8.331-1.554 0-3.045-.436-4.343-1.258l-.311-.19-.3.08-3.084.81.823-3.003-.2-.315c-.9-1.425-1.378-3.093-1.378-4.781 0-4.592 3.739-8.331 8.339-8.331zm-1.802 4.195c-.172-.382-.35-.39-.512-.396-.134-.006-.288-.006-.44-.006-.153 0-.403.057-.613.287-.21.23-.805.785-.805 1.914 0 1.13.821 2.222.936 2.375.115.153 1.618 2.47 3.92 3.467 1.916.829 2.304.664 2.716.626s1.321-.54 1.512-1.033c.191-.493.191-.916.134-1.005-.057-.089-.23-.134-.516-.277s-1.684-.83-1.947-.925c-.263-.095-.455-.143-.646.143-.191.287-.741.925-.908 1.116-.167.191-.335.215-.62.072s-1.207-.442-2.301-1.419c-.854-.761-1.431-1.701-1.598-1.988-.167-.287-.018-.442.125-.584.129-.127.287-.335.43-.502.143-.167.191-.287.287-.478.095-.191.048-.359-.024-.502s-.584-1.405-.8-1.93z" />
          </svg>
          <span className="drop-shadow-sm truncate">PESAN via WA SEKARANG →</span>
        </a>
        <p className="text-orange-100 font-bold text-xs uppercase tracking-[0.1em] mt-3.5 italic">
          Buka Setiap Hari • Fast Response
        </p>
      </div>

      {/* Marquee scroll continuous ticker bottom */}
      <div className="relative mb-5 bg-black/25 py-2 overflow-hidden w-full select-none rotate-[0.5deg]">
        <div className="animate-marquee font-black uppercase text-[12.5px] text-yellow-300 tracking-wider whitespace-nowrap space-x-1 flex">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="flex items-center">
              MI-SOP • GORENGAN • KUE • ORDER WA • {config.whatsappNumber} •&nbsp;
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};


// ==========================================
// RENDER HELPERS (Pure CSS Vectors)
// ==========================================

// Gorengan shapes
function renderGorenganVector(type: string) {
  switch (type) {
    case 'tempe':
      return (
        <div className="w-16 h-11 bg-amber-500 rounded border-2 border-amber-600 shadow-md relative overflow-hidden flex items-center justify-center rotate-[10deg]">
          {/* Soy bean grains */}
          <div className="absolute w-1 h-2 bg-amber-200 rounded-full top-1 left-2 rotate-12" />
          <div className="absolute w-1.5 h-1 bg-amber-200 rounded-full top-5 left-10 -rotate-45" />
          <div className="absolute w-1 h-2.5 bg-amber-350 rounded-full bottom-2 left-6 rotate-12" />
          <div className="absolute w-1 h-2 bg-amber-200 rounded-full bottom-4 right-2 rotate-[60deg]" />
          <div className="absolute w-2 h-1 bg-amber-200 rounded-full top-2 right-4 -rotate-12" />
          <div className="w-12 h-0.5 bg-amber-400 opacity-60 absolute" />
        </div>
      );
    case 'tahu':
      return (
        <div className="w-14 h-14 bg-amber-600 rounded border-2 border-amber-700 shadow-md relative overflow-hidden rotate-[-20deg]">
          {/* Crunchy air pocket lines */}
          <div className="absolute w-[80%] h-1 bg-amber-500/70 top-2 left-1 rounded" />
          <div className="absolute w-[50%] h-[30%] bg-amber-550/40 bottom-2 right-2 rounded-lg" />
          <div className="absolute w-1 h-8 bg-amber-500/40 left-3 top-3 rounded" />
          <div className="absolute w-2 h-2 bg-amber-400 rounded-full top-5 right-4" />
        </div>
      );
    case 'pisang':
      return (
        <div className="w-18 h-9 bg-yellow-500 rounded-[50%_0] border-t-2 border-r-2 border-amber-600 shadow-lg relative flex items-center justify-center rotate-[40deg]">
          {/* Crispy flour coatings */}
          <div className="absolute w-14 h-5 bg-yellow-400 rounded-[40%] text-center border-b border-amber-500 flex" />
          <div className="absolute w-2 h-2 bg-amber-700 rounded-full top-2 left-4 opacity-50" />
          <div className="absolute w-1.5 h-1.5 bg-amber-850 rounded-full bottom-2 right-4 opacity-40" />
        </div>
      );
    case 'ubi':
      return (
        <div className="w-14 h-12 bg-yellow-400 border-l-[7px] border-amber-800 rounded-tr-[50%] rounded-br-[50%] shadow-md relative rotate-[-10deg]">
          {/* Deep sweet potato center */}
          <div className="absolute w-10 h-8 bg-yellow-450 border border-yellow-300 rounded-tr-[50%] top-1 left-1 opacity-70" />
          <div className="absolute w-1 h-3 bg-amber-700/30 top-2 right-5 rounded" />
        </div>
      );
    case 'bakwan':
    default:
      return (
        <div className="w-15 h-15 bg-amber-500 rounded-full border-2 border-amber-600 shadow-lg relative flex flex-wrap items-center justify-center overflow-hidden rotate-[15deg]">
          {/* Carrots orange strips */}
          <div className="absolute w-1 h-5 bg-orange-500 rounded-sm top-2 left-4 rotate-[15deg]" />
          <div className="absolute w-4 h-1 bg-orange-600 rounded-sm bottom-3 right-3 rotate-[35deg]" />
          {/* Scallion green strips */}
          <div className="absolute w-1.5 h-4 bg-green-500 rounded-sm top-7 right-2 rotate-[-45deg]" />
          <div className="absolute w-3 h-1 bg-green-600 rounded-sm bottom-4 left-3 rotate-[10deg]" />
          <div className="absolute w-2.5 h-2 bg-amber-100/60 rounded-full top-5 left-6" />
        </div>
      );
  }
}

// Kue shapes
function renderKueVector(type: string) {
  switch (type) {
    case 'lapis':
      return (
        <div className="w-12 h-12 bg-white rounded border border-zinc-200 flex flex-col overflow-hidden shadow-inner rotate-3">
          {/* 3 colorful layers pink white green */}
          <div className="h-4 bg-[#EC4899] border-b border-pink-400 select-none flex items-center justify-center text-[7px] text-white">pink</div>
          <div className="h-4 bg-zinc-50 border-b border-zinc-200 select-none flex items-center justify-center text-[7.5px] text-zinc-400">clean</div>
          <div className="h-4 bg-green-500 select-none flex items-center justify-center text-[7px] text-white">green</div>
        </div>
      );
    case 'bolu':
      return (
        <div className="w-12 h-12 relative flex flex-col justify-end items-center rotate-[-5deg]">
          {/* Top bloomed colorful dome */}
          <div className="w-13 h-7 bg-pink-500 rounded-t-full border border-pink-450 z-10 flex space-x-1 justify-center p-0.5 shadow-sm">
            <div className="w-3 h-4 bg-green-450 rounded-t-full" />
            <div className="w-3 h-4 bg-pink-300 rounded-t-full" />
            <div className="w-3 h-4 bg-green-450 rounded-t-full" />
          </div>
          {/* Bottom Cupcake liner */}
          <div className="w-9 h-6 bg-yellow-100 border-l border-r border-b border-yellow-200 rounded-b shadow-[0_1px_4px_rgba(0,0,0,0.2)] flex justify-around">
            <div className="w-0.5 h-5 bg-yellow-300/40" />
            <div className="w-0.5 h-5 bg-yellow-300/40" />
            <div className="w-0.5 h-5 bg-yellow-300/40" />
          </div>
        </div>
      );
    case 'brownies':
      return (
        <div className="w-12 h-12 bg-[#2D1B10] rounded border-[3px] border-[#1F120A] shadow-md relative flex flex-col p-1 overflow-hidden rotate-6">
          <div className="w-full h-1 bg-stone-900/40 mb-1" />
          {/* Tiny chopped almonds or gold chips */}
          <div className="absolute w-1.5 h-1.5 bg-yellow-250 rounded-sm top-3 left-2 rotate-[12deg]" />
          <div className="absolute w-2 h-1.5 bg-zinc-200 rounded-sm bottom-3 right-5 rotate-[-25deg]" />
          <div className="absolute w-1 h-1.5 bg-yellow-250 rounded-sm top-2 right-2 rotate-[40deg]" />
          <div className="absolute w-2 h-2 bg-zinc-100 rounded-sm bottom-2 right-2 rotate-[15deg]" />
          <div className="text-[7px] font-bold text-[#E78B45]/50 mt-1 uppercase text-center select-none font-mono">choco</div>
        </div>
      );
    case 'bakpau':
      return (
        <div className="w-12 h-11 bg-stone-100 rounded-t-full rounded-b-lg border border-zinc-300 shadow flex items-center justify-center relative rotate-2">
          {/* Pure white dome with red dot center top */}
          <div className="w-2.5 h-2.5 bg-red-600 rounded-full border border-red-700 absolute top-2 self-center animate-pulse" />
          <div className="absolute bottom-[2px] w-9 h-[1.5px] bg-[#C59B6D] mx-auto opacity-75" title="papel base" />
        </div>
      );
    case 'lumpur':
    default:
      return (
        <div className="w-12 h-12 rounded-full bg-yellow-500 border-x-4 border-y-2 border-amber-600 shadow flex items-center justify-center relative -rotate-6">
          <div className="w-[85%] h-[85%] rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
            {/* Center raisin */}
            <div className="w-4 h-2.5 bg-zinc-900 rounded-full border border-stone-950 flex shadow" />
          </div>
        </div>
      );
  }
}

// Helper to clean and format WhatsApp link
export function formatWhatsAppLink(num: string): string {
  let cleaned = num.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  } else if (cleaned.startsWith('8')) {
    cleaned = '62' + cleaned;
  }
  return `https://wa.me/${cleaned}`;
}
