import React, { useEffect, useRef, useState } from 'react';
import { AdConfig } from '../types';
import { formatWhatsAppLink } from './SceneComponents';

interface ReelsAdPlayerProps {
  currentTime: number;
  config: AdConfig;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  transitionTrigger: number;
  onGoToScene: (sceneIdx: number) => void;
  setCurrentTime: (time: number) => void;
}

export const ReelsAdPlayer: React.FC<ReelsAdPlayerProps> = ({
  currentTime,
  config,
  isPlaying,
  setIsPlaying,
  transitionTrigger,
  onGoToScene,
  setCurrentTime,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Local state for recording workflow
  const [isRecording, setIsRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Resolution parameters
  const canvasWidth = 390;
  const canvasHeight = 844;

  // Active scene mapper
  const getActiveScene = (time: number): number => {
    if (time < 2) return 1;
    if (time < 6) return 2;
    if (time < 10) return 3;
    if (time < 13) return 4;
    return 5;
  };

  const activeScene = getActiveScene(currentTime);

  // Background smooth color interpolation (0.5s transition times)
  const getBackgroundColor = (t: number): string => {
    const keyframes = [
      { t: 0, c: [0, 0, 0] },
      { t: 1.75, c: [0, 0, 0] },
      { t: 2.25, c: [67, 20, 7] }, // #431407
      { t: 5.75, c: [67, 20, 7] },
      { t: 6.25, c: [120, 53, 15] }, // #78350F
      { t: 9.75, c: [120, 53, 15] },
      { t: 10.25, c: [46, 16, 101] }, // #2E1065
      { t: 12.75, c: [46, 16, 101] },
      { t: 13.25, c: [249, 115, 22] }, // #F97316
      { t: 14.75, c: [249, 115, 22] },
      { t: 15.0, c: [0, 0, 0] }
    ];
    
    for (let i = 0; i < keyframes.length - 1; i++) {
      const k1 = keyframes[i];
      const k2 = keyframes[i+1];
      if (t >= k1.t && t <= k2.t) {
        const ratio = (t - k1.t) / (k2.t - k1.t);
        const r = Math.round(k1.c[0] + ratio * (k2.c[0] - k1.c[0]));
        const g = Math.round(k1.c[1] + ratio * (k2.c[1] - k1.c[1]));
        const b = Math.round(k1.c[2] + ratio * (k2.c[2] - k1.c[2]));
        return `rgb(${r}, ${g}, ${b})`;
      }
    }
    return 'rgb(0, 0, 0)';
  };

  // Helper bezier drawer for steam curves
  const drawSteam = (ctx: CanvasRenderingContext2D, startX: number, startY: number, height: number, relTime: number, offsetPhase: number) => {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    
    const drift = Math.sin(relTime * 4 + offsetPhase) * 12;
    const currH = height * Math.min(1, relTime * 1.5);
    
    ctx.moveTo(startX, startY);
    ctx.bezierCurveTo(
      startX - 15 + drift, startY - currH * 0.3,
      startX + 15 + drift, startY - currH * 0.7,
      startX + drift, startY - currH
    );
    ctx.stroke();
    ctx.restore();
  };

  // ----------------------------------------------------
  // DRAW ALL GRAPHICS ONTO THE CANVAS BASED ON CURRENT TIME
  // ----------------------------------------------------
  const renderFrame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const t = currentTime;
    const scene = getActiveScene(t);

    // Clean canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // 1. Get smoothly interpolated background color
    ctx.fillStyle = getBackgroundColor(t);
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Save state for shaking and custom scene animations
    ctx.save();

    // Scene 1: SCREEN SHAKE (Hook 0-2s)
    if (scene === 1) {
      const shakeX = Math.sin(t * 80) * 4;
      const shakeY = Math.cos(t * 80) * 4;
      ctx.translate(shakeX, shakeY);
    }

    // ------------------------------------
    // SCENE RENDERING PIPELINES
    // ------------------------------------

    if (scene === 1) {
      // SCENE 1 - HOOK (0 - 2s)
      // Background ambient lighting spot info
      const gradient = ctx.createRadialGradient(canvasWidth/2, canvasHeight/2, 20, canvasWidth/2, canvasHeight/2, 220);
      gradient.addColorStop(0, 'rgba(249, 115, 22, 0.15)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Text "AWAS..." (fade in, putih, 72px, bold, tengah layar)
      const awasOpacity = Math.min(1, t / 0.8);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = `rgba(255, 255, 255, ${awasOpacity})`;
      ctx.font = 'bold 72px sans-serif';
      ctx.fillText('AWAS...', canvasWidth / 2, canvasHeight / 2 - 80);

      // Text "BIKIN NGILER 🔥" (ZOOM effect from 0.8s)
      if (t >= 0.8) {
        ctx.save();
        const relZoomTime = t - 0.8;
        // Elastic scale-up factor
        const zoomProgress = Math.min(1, relZoomTime / 0.4);
        const scale = zoomProgress === 1 ? 1 : Math.sin(zoomProgress * Math.PI * 1.5) * 0.15 + zoomProgress;
        ctx.translate(canvasWidth / 2, canvasHeight / 2 + 50);
        ctx.scale(scale, scale);
        
        // Shadow offset
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 4;

        ctx.fillStyle = '#F97316';
        ctx.font = 'black 52px sans-serif';
        ctx.fillText('BIKIN NGILER 🔥', 0, 0);
        ctx.restore();
      }
    }

    else if (scene === 2) {
      // SCENE 2 - MI-SOP REVEAL (2 - 6s)
      const relTime = t - 2.0;

      // Draw beautiful steam waves background floating
      for (let i = 0; i < 6; i++) {
        const px = 40 + i * 62;
        const py = 740 - ((relTime * 100 + i * 80) % 650);
        ctx.fillStyle = 'rgba(249, 115, 22, 0.08)';
        ctx.beginPath();
        ctx.arc(px, py, 20 + (i % 3) * 15, 0, Math.PI * 2);
        ctx.fill();
      }

      // Title header texts
      ctx.textAlign = 'center';
      
      // "MI-SOP HANGAT" slide from left (0 to 0.8s)
      ctx.save();
      const slideProgress = Math.min(1, relTime / 0.8);
      const easeSlide = 1 - Math.pow(1 - slideProgress, 3); // cubic out
      const startX = -250 + easeSlide * (canvasWidth / 2 + 250);
      
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 6;
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 38px sans-serif';
      ctx.fillText('MI-SOP HANGAT', startX, 100);
      ctx.restore();

      // "Mulai Rp 5.000 aja!" blinks 2x during first 1.6s, then stays
      const isBlinkingTextVisible = relTime < 1.6 ? Math.floor(relTime * 4) % 2 === 0 : true;
      if (isBlinkingTextVisible) {
        ctx.fillStyle = '#FCD34D';
        ctx.font = '800 24px sans-serif';
        ctx.fillText('Mulai Rp 5.000 aja!', canvasWidth / 2, 160);
      }

      // Bouncing Soup Bowl custom graphic
      ctx.save();
      // Elastic physics bounce from bottom center
      const bowlProgress = Math.min(1, relTime / 1.1);
      // Elastic Out:
      const c4 = (2 * Math.PI) / 3;
      const easeElastic = bowlProgress === 0 ? 0 : bowlProgress === 1 ? 1 : Math.pow(2, -10 * bowlProgress) * Math.sin((bowlProgress * 10 - 0.75) * c4) + 1;
      
      const bowlX = canvasWidth / 2;
      const bowlY = 900 - easeElastic * 420; // settles at y = 480

      // Draw steam from bowl (rising animations)
      drawSteam(ctx, bowlX - 40, bowlY - 80, 70, relTime, 0);
      drawSteam(ctx, bowlX, bowlY - 90, 90, relTime, 1.5);
      drawSteam(ctx, bowlX + 40, bowlY - 80, 70, relTime, 3.0);

      // Bowl Outer rim
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 12;
      
      ctx.fillStyle = '#D97706'; // Amber bowl wall
      ctx.beginPath();
      ctx.arc(bowlX, bowlY, 110, 0, Math.PI * 2);
      ctx.fill();

      // Inner broth (Kuah kuning kemerahan inside)
      ctx.shadowBlur = 0; // disable shadow for interior layers
      ctx.shadowOffsetY = 0;
      
      const kuahGradient = ctx.createRadialGradient(bowlX, bowlY, 5, bowlX, bowlY, 100);
      kuahGradient.addColorStop(0, '#FBBF24'); // Yellow
      kuahGradient.addColorStop(0.6, '#F97316'); // Orange
      kuahGradient.addColorStop(1, '#EA580C'); // Deep orange-red broth
      ctx.fillStyle = kuahGradient;
      ctx.beginPath();
      ctx.arc(bowlX, bowlY, 98, 0, Math.PI * 2);
      ctx.fill();

      // Yellow noodles loops (Curved yellow lines)
      ctx.strokeStyle = '#FDE047';
      ctx.lineWidth = 4.5;
      ctx.lineCap = 'round';
      
      // Loop 1
      ctx.beginPath();
      ctx.arc(bowlX - 25, bowlY - 15, 45, 0.2 * Math.PI, 1.1 * Math.PI);
      ctx.stroke();

      // Loop 2
      ctx.beginPath();
      ctx.arc(bowlX + 15, bowlY + 20, 50, 0.9 * Math.PI, 1.9 * Math.PI);
      ctx.stroke();

      // Loop 3
      ctx.beginPath();
      ctx.arc(bowlX - 10, bowlY + 5, 60, -0.2 * Math.PI, 0.6 * Math.PI);
      ctx.stroke();

      // Bakso (2 large circles with grey-brown shiny gradient)
      const drawBakso = (bx: number, by: number, br: number) => {
        const baksoGrad = ctx.createRadialGradient(bx - br*0.3, by - br*0.3, br*0.1, bx, by, br);
        baksoGrad.addColorStop(0, '#A1A1AA'); // zinc reflection
        baksoGrad.addColorStop(0.4, '#52525B'); 
        baksoGrad.addColorStop(1, '#27272A'); // charcoal body
        ctx.fillStyle = baksoGrad;
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#3F3F46';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      };
      drawBakso(bowlX - 45, bowlY - 10, 24);
      drawBakso(bowlX + 5, bowlY - 45, 22);

      // Telur rebus (1 half circle egg: white base, yellow inner yolk)
      ctx.save();
      ctx.translate(bowlX + 35, bowlY + 15);
      ctx.rotate(-0.3);
      
      // White base oval
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(0, 0, 28, 34, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Orange yolk center
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(0, 5, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FBBF24';
      ctx.beginPath();
      ctx.arc(-4, 2, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Scallions / Seledri small green bits scattered
      ctx.fillStyle = '#16A34A';
      const greenBits = [
        { x: -50, y: -50, w: 10, h: 5, r: 0.5 },
        { x: -10, y: -70, w: 8, h: 6, r: -0.2 },
        { x: -75, y: 15, w: 12, h: 4, r: 0.9 },
        { x: 10, y: 65, w: 9, h: 5, r: 0.1 },
        { x: 60, y: -30, w: 11, h: 4, r: -0.8 },
      ];
      greenBits.forEach(b => {
        ctx.save();
        ctx.translate(bowlX + b.x, bowlY + b.y);
        ctx.rotate(b.r);
        ctx.fillRect(-b.w/2, -b.h/2, b.w, b.h);
        ctx.restore();
      });

      ctx.restore(); // end bowl bounce
    }

    else if (scene === 3) {
      // SCENE 3 - GORENGAN DROP (6 - 10s)
      const relTime = t - 6.0;

      // Table baseline draw at 75% depth (y = 650)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(30, 650);
      ctx.lineTo(canvasWidth - 30, 650);
      ctx.stroke();

      // Title Text bouncing from bottom
      ctx.textAlign = 'center';
      const textProgress = Math.min(1, relTime / 0.6);
      const textY = 900 - Math.sin(textProgress * Math.PI)/0.1 - textProgress * 780; // beautiful jump curve
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'italic bold 34px sans-serif';
      ctx.fillText('GORENGAN KRIUUUK', canvasWidth / 2, Math.max(100, textY));

      // Subtitle "Rp 1.500 per biji!" fade in
      if (relTime >= 0.8) {
        const priceOpacity = Math.min(1, (relTime - 0.8) / 0.5);
        ctx.fillStyle = `rgba(252, 211, 77, ${priceOpacity})`;
        ctx.font = '800 22px sans-serif';
        ctx.fillText('Rp 1.500 per biji!', canvasWidth / 2, 150);
      }

      // Physics 5 Fritters falling staggeredly (stagger: 0.2s)
      // Destination floor y = 633
      const fritters = [
        { name: 'Tempe', type: 'tempe', x: 75, delay: 0.0, r: 0.1 },
        { name: 'Tahu', type: 'tahu', x: 135, delay: 0.2, r: -0.15 },
        { name: 'Pisang', type: 'pisang', x: 195, delay: 0.4, r: 0.25 },
        { name: 'Ubi', type: 'ubi', x: 255, delay: 0.6, r: -0.05 },
        { name: 'Bakwan', type: 'bakwan', x: 315, delay: 0.8, r: 0.35 },
      ];

      fritters.forEach((f) => {
        const itemRel = relTime - f.delay;
        if (itemRel < 0) return;

        const fallDur = 0.5;
        let fy = -100;
        let rot = f.r * 15;

        if (itemRel < fallDur) {
          // quadratic fall down
          const prog = itemRel / fallDur;
          fy = -100 + prog * prog * 733;
          rot = itemRel * 12 + f.r;
        } else {
          // Loded/landed - micro landing bounce
          const bounceRel = itemRel - fallDur;
          const bounceDamp = Math.max(0, Math.sin(bounceRel * 14) * 20 * Math.pow(0.4, bounceRel * 4));
          fy = 633 - bounceDamp;
          rot = f.r;

          // Splash oil particles when just landed
          if (bounceRel >= 0 && bounceRel < 0.25) {
            ctx.strokeStyle = '#FCD34D';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(f.x, 633, bounceRel * 120, 0, Math.PI * 2);
            ctx.stroke();
          }
        }

        // Draw the vectors directly using Canvas Paths
        ctx.save();
        ctx.translate(f.x, fy);
        ctx.rotate(rot);

        ctx.shadowColor = 'rgba(0,0,0,0.4)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 4;

        if (f.type === 'tempe') {
          // Rectangle with beans
          ctx.fillStyle = '#D97706'; // Golden tempe brown
          ctx.fillRect(-26, -18, 52, 36);
          ctx.strokeStyle = '#B45309';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(-26, -18, 52, 36);
          // Beans
          ctx.fillStyle = '#FEF3C7';
          ctx.beginPath();
          ctx.ellipse(-15, -6, 4, 2, 0.4, 0, Math.PI*2);
          ctx.ellipse(8, 8, 4, 2, -0.3, 0, Math.PI*2);
          ctx.ellipse(-5, 10, 3, 2, 0.1, 0, Math.PI*2);
          ctx.ellipse(12, -8, 4, 2, 0.8, 0, Math.PI*2);
          ctx.fill();
        } 
        else if (f.type === 'tahu') {
          // Yellow wedge box
          ctx.fillStyle = '#EA580C'; // Tahu crispy outer
          ctx.strokeStyle = '#9A3412';
          ctx.lineWidth = 2.5;
          
          ctx.beginPath();
          ctx.moveTo(-20, -20);
          ctx.lineTo(24, -20);
          ctx.lineTo(10, 24);
          ctx.lineTo(-24, 24);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Soft pale interior hints
          ctx.fillStyle = '#FEF3C7';
          ctx.beginPath();
          ctx.moveTo(-16, -16);
          ctx.lineTo(12, -16);
          ctx.lineTo(2, 10);
          ctx.lineTo(-18, 10);
          ctx.closePath();
          ctx.fill();
        } 
        else if (f.type === 'pisang') {
          // Curved yellow shape
          ctx.fillStyle = '#EAB308';
          ctx.strokeStyle = '#CA8A04';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, 0, 24, 0, 1.1 * Math.PI);
          ctx.quadraticCurveTo(-15, -10, 24, 0);
          ctx.fill();
          ctx.stroke();
        } 
        else if (f.type === 'ubi') {
          // Orange oval with violet crust
          ctx.fillStyle = '#7C3AED'; // violet outer skin
          ctx.beginPath();
          ctx.ellipse(0, 0, 30, 20, 0, 0, Math.PI*2);
          ctx.fill();

          ctx.fillStyle = '#F97316'; // gold interior ubi orange
          ctx.beginPath();
          ctx.ellipse(0, 0, 22, 14, 0, 0, Math.PI*2);
          ctx.fill();
        } 
        else {
          // Bakwan: irregular circle with carrots & scallions
          ctx.fillStyle = '#F59E0B';
          ctx.strokeStyle = '#D97706';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          for (let i = 0; i < 11; i++) {
            const angle = (i * Math.PI * 2) / 10;
            const radius = 24 + (i % 2 === 0 ? 4 : -4);
            const rx = Math.cos(angle) * radius;
            const ry = Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(rx, ry);
            else ctx.lineTo(rx, ry);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Green and red strips
          ctx.strokeStyle = '#22C55E'; // green bayam list
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(-12, -8); ctx.lineTo(-4, 4);
          ctx.moveTo(8, -10); ctx.lineTo(12, 5);
          ctx.stroke();

          ctx.strokeStyle = '#EF4444'; // carrot orange list
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(-8, 8); ctx.lineTo(8, 8);
          ctx.stroke();
        }

        ctx.restore();
      });
    }

    else if (scene === 4) {
      // SCENE 4 - KUE SPOTLIGHT (10 - 13s)
      const relTime = t - 10.0;

      // Title Spotlight Header texts
      ctx.textAlign = 'center';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('KUE HOMEMADE', canvasWidth / 2, 95);

      ctx.fillStyle = '#FCD34D';
      ctx.font = '700 20px sans-serif';
      ctx.fillText('Mulai Rp 1.500', canvasWidth / 2, 145);

      // Rotating Spot sparkle stars ✦ around the center screen background
      const starScale = 1.0 + Math.sin(relTime * 6) * 0.15;
      ctx.save();
      ctx.translate(canvasWidth / 2, 450);
      ctx.rotate(relTime * 1.5);
      ctx.fillStyle = 'rgba(253, 224, 71, 0.12)';
      for (let s = 0; s < 4; s++) {
        ctx.rotate(Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(0, -220);
        ctx.lineTo(20, -100);
        ctx.lineTo(100, -100);
        ctx.lineTo(30, -50);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // 3 Cakes entering dynamically
      // Kue Lapis, Bolu Kukus, Brownies
      const cakes = [
        { name: 'Lapis', type: 'lapis', startX: -150, targetX: 110, y: 460, startY: 460, delay: 0.0, label: 'Lapis 💚' },
        { name: 'Bolu', type: 'bolu', startX: canvasWidth / 2, targetX: canvasWidth / 2, y: 950, startY: 530, delay: 0.25, label: 'Bolu 🌸' },
        { name: 'Brownies', type: 'brownies', startX: canvasWidth + 150, targetX: 280, y: 460, startY: 460, delay: 0.5, label: 'Brownies 🍫' },
      ];

      cakes.forEach((c) => {
        const itemRel = relTime - c.delay;
        if (itemRel < 0) return;

        // Slide interpolation
        const slideProgress = Math.min(1, itemRel / 0.7);
        const easeSlide = 1 - Math.pow(1 - slideProgress, 3); // cubic out
        const cx = c.startX + (c.targetX - c.startX) * easeSlide;
        const cy = c.y + (c.startY - c.y) * easeSlide;

        // Draw cake with rotating spin effect
        ctx.save();
        ctx.translate(cx, cy);
        
        // Continuous gentle tilt/spin
        ctx.rotate(Math.sin(relTime * 2.5 + c.delay * 10) * 0.15);

        // Card frame
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetY = 8;

        ctx.fillStyle = 'rgba(46, 16, 101, 0.6)'; // deep violet translucent card
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#A78BFA';
        
        ctx.beginPath();
        ctx.roundRect(-35, -35, 70, 70, 16);
        ctx.fill();
        ctx.stroke();

        ctx.shadowBlur = 0; // disable inner shadows
        ctx.shadowOffsetY = 0;

        if (c.type === 'lapis') {
          // Layered pink, white, green cube block
          ctx.fillStyle = '#EC4899'; // Pink
          ctx.fillRect(-22, -22, 44, 15);
          ctx.fillStyle = '#F4F4F5'; // White
          ctx.fillRect(-22, -7, 44, 15);
          ctx.fillStyle = '#22C55E'; // Green
          ctx.fillRect(-22, 8, 44, 14);
        } 
        else if (c.type === 'bolu') {
          // Bolu: blooming pink blossom dome + corrugated container Cupcake liner
          ctx.fillStyle = '#F472B6'; // Pink mekar top
          ctx.beginPath();
          ctx.arc(-11, -5, 14, 0, Math.PI * 2);
          ctx.arc(11, -5, 14, 0, Math.PI * 2);
          ctx.arc(0, -15, 16, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#FEF3C7'; // Yellow batter base cake cup
          ctx.beginPath();
          ctx.moveTo(-16, -3);
          ctx.lineTo(16, -3);
          ctx.lineTo(10, 22);
          ctx.lineTo(-10, 22);
          ctx.closePath();
          ctx.fill();

          ctx.strokeStyle = '#D1FAE5';
          ctx.lineWidth = 1;
          ctx.stroke();
        } 
        else {
          // Brownies: deep chocolate cube with nuts
          ctx.fillStyle = '#451A03'; // deep choc
          ctx.fillRect(-22, -22, 44, 44);
          ctx.strokeStyle = '#1C1917';
          ctx.lineWidth = 2;
          ctx.strokeRect(-22, -22, 44, 44);

          // Cracks and nut flakes
          ctx.fillStyle = '#FEF3C7';
          ctx.fillRect(-12, -12, 5, 5);
          ctx.fillRect(8, 6, 6, 4);
          ctx.fillRect(4, -14, 4, 6);
        }

        // Draw micro sparkle stars circling around this cake card
        ctx.fillStyle = '#FEF08A';
        const sparkleAngle = relTime * 4 + c.delay * 5;
        const spkrX = Math.cos(sparkleAngle) * 45;
        const spkyY = Math.sin(sparkleAngle) * 45;
        
        ctx.beginPath();
        ctx.arc(spkrX, spkyY, Math.abs(Math.sin(relTime*10))*3 + 1, 0, Math.PI*2);
        ctx.fill();

        ctx.restore();

        // Label tag bubble under card
        ctx.save();
        ctx.translate(cx, cy + 55);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.beginPath();
        ctx.roundRect(-38, -11, 76, 22, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#E4E4E7';
        ctx.font = 'bold 10.5px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(c.label, 0, 0);
        ctx.restore();
      });
    }

    else if (scene === 5) {
      // SCENE 5 - CTA MELEDAK (13 - 15s)
      const relTime = t - 13.0;

      // Draw confetti rain down
      const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#FFFFFF'];
      for (let i = 0; i < 24; i++) {
        const cx = (i * 17 + 10) % canvasWidth;
        const cy = ((relTime * 220 + i * 40) % (canvasHeight + 50)) - 30;
        const rot = relTime * 5 + i;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);
        ctx.fillStyle = colors[i % colors.length];
        ctx.fillRect(-4, -6, 8, 12);
        ctx.restore();
      }

      // "WARUNG MAK CINDY" (Rubber-band scale effect at top)
      ctx.save();
      ctx.textAlign = 'center';
      
      const rubberScale = Math.sin(relTime * 12) * Math.pow(0.4, relTime * 3);
      const scaleX = 1 + rubberScale * 0.35;
      const scaleY = 1 - rubberScale * 0.25;

      ctx.translate(canvasWidth / 2, 280);
      ctx.scale(scaleX, scaleY);

      ctx.shadowColor = 'rgba(0,0,0,0.7)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 4;

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'extra-bold 38px sans-serif';
      ctx.fillText('WARUNG MAK CINDY', 0, 0);
      ctx.restore();

      // Location Slogan "Pahae Jae 🍜"
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 21px sans-serif';
      ctx.fillText('Pahae Jae 🍜', canvasWidth / 2, 340);

      // Spinning verified logo
      ctx.fillStyle = '#3B82F6';
      ctx.beginPath();
      ctx.arc(canvasWidth / 2, 385, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('✓', canvasWidth / 2, 389);

      // Green WA Pulsate Button "Chat WA Sekarang ->" at Y=500
      ctx.save();
      ctx.translate(canvasWidth / 2, 500);
      
      const pScale = 1.0 + Math.sin(relTime * 9) * 0.04;
      ctx.scale(pScale, pScale);

      ctx.shadowColor = 'rgba(22, 163, 74, 0.4)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 6;

      ctx.fillStyle = '#16A34A'; // Whatsapp beautiful emerald
      ctx.beginPath();
      ctx.roundRect(-130, -25, 260, 50, 25);
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 14px sans-serif';
      ctx.fillText('Chat WA Sekarang ➔', 0, 2);
      ctx.restore();

      // Slogan under description
      ctx.fillStyle = '#FEF3C7';
      ctx.font = 'italic 700 13px sans-serif';
      ctx.fillText('• Enak, Murah, Bikin Nagih •', canvasWidth / 2, 575);
    }

    // Restore shake/custom transformations
    ctx.restore();

    // ==========================================
    // REELS OVERLAY CONTROLS (Rendered ON CANVAS for pristine Video capture files)
    // ==========================================
    
    // Top progress tracker bar (0 to 15s)
    const progWidth = (t / 15.0) * (canvasWidth - 32);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.beginPath();
    ctx.roundRect(16, 42, canvasWidth - 32, 4, 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(16, 42, progWidth, 4, 2);
    ctx.fill();

    // Reels watermark tag top header
    ctx.save();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.roundRect(16, 56, 120, 26, 13);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 11px sans-serif';
    ctx.fillText('Facebook Reels', 28, 62);
    ctx.restore();

    // Active ad scene state indicator tag
    ctx.save();
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#F97316';
    ctx.beginPath();
    ctx.roundRect(canvasWidth - 110, 56, 94, 26, 13);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 10px sans-serif';
    ctx.fillText(`SCENE ${scene} / 5`, canvasWidth - 42, 62);
    ctx.restore();

    // Bottom info description footer (Mocking genuine social overlay)
    ctx.save();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    
    // Verified Profile Label
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 13.5px sans-serif';
    ctx.fillText('warungmakcindy', 16, canvasHeight - 110);
    // Verified check bubble
    ctx.fillStyle = '#3B82F6';
    ctx.beginPath();
    ctx.arc(132, canvasHeight - 114, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 8px sans-serif';
    ctx.fillText('✓', 130, canvasHeight - 111);

    // Follow badge button
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(150, canvasHeight - 124, 46, 17, 3);
    ctx.stroke();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 8.5px sans-serif';
    ctx.fillText('Ikuti', 161, canvasHeight - 112);

    // Short caption paragraph
    ctx.fillStyle = '#E4E4E7';
    ctx.font = 'normal 11.5px sans-serif';
    ctx.fillText('Tantangan Ngiler Warung Mak Cindy Pahae Jae! 🍢🍜🍰', 16, canvasHeight - 88);
    ctx.fillStyle = '#93C5FD';
    ctx.font = '800 11px sans-serif';
    ctx.fillText('Order WA: ' + config.whatsappNumber, 16, canvasHeight - 68);
    ctx.restore();

    // Sidebar overlay utilities icon list: Like heart, Comment, Share, sound disc
    ctx.save();
    ctx.translate(canvasWidth - 36, canvasHeight - 150);

    // Avatar Icon circle
    ctx.shadowBlur = 6;
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.fillStyle = '#1E293B';
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#F97316';
    ctx.beginPath();
    ctx.arc(0, -220, 18, 0, Math.PI*2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#F97316';
    ctx.font = '900 10.5px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('MC', 0, -219);

    // Plus follower dot badge
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.arc(0, -204, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 8px sans-serif';
    ctx.fillText('+', 0, -203);

    // Simple Heart Drawing for Likes (Like value mapping)
    const drawHeart = (ox: number, oy: number) => {
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(ox - 7, oy - 2, 6, 0, Math.PI * 2);
      ctx.arc(ox + 1, oy - 2, 6, 0, Math.PI * 2);
      ctx.moveTo(ox - 13, oy - 1);
      ctx.lineTo(ox - 3, oy + 11);
      ctx.lineTo(ox + 7, oy - 1);
      ctx.fill();
    };
    drawHeart(0, -145);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText('23.6K', 0, -124);

    // Comments SVG shape
    ctx.fillStyle = '#E4E4E7';
    ctx.beginPath();
    ctx.roundRect(-10, -100, 20, 14, 4);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-5, -86); ctx.lineTo(-8, -80); ctx.lineTo(1, -86);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText('1.9K', 0, -74);

    // Share Plane SVG shape
    ctx.fillStyle = '#E4E4E7';
    ctx.beginPath();
    ctx.moveTo(-10, -50); ctx.lineTo(11, -40); ctx.lineTo(-10, -30); ctx.lineTo(-5, -40);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText('4.8K', 0, -20);

    // Spinning track disc icon (Sound track)
    ctx.save();
    ctx.translate(0, 25);
    if (isPlaying) {
      ctx.rotate(t * 3.5);
    }
    ctx.fillStyle = '#09090B';
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#52525B';
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Disc label center
    ctx.fillStyle = '#EA580C';
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();
  };

  // Redraw whenever currentTime or metadata modifications happen
  useEffect(() => {
    renderFrame();
  }, [currentTime, config]);

  // ----------------------------------------------------
  // MEDIA RECORDER SYSTEM (SEAMLESS 15.0S DIRECT FRAME-BY-FRAME RECORDING)
  // ----------------------------------------------------
  const handleStartVideoRecording = async () => {
    if (isRecording) return;
    setIsRecording(true);
    setRecordProgress(0);

    try {
      const canvas = canvasRef.current;
      if (!canvas) throw new Error("Missing Canvas stream binding source");

      // Pause standard playback tick loop
      setIsPlaying(false);

      // Force canvas size properties are exact for high resolution recording outputs
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // 1. Capture stream with 30fps
      const canvasStream = canvas.captureStream(30);
      
      // Determine support options (WebM with VP9, fallback to general WebM, or H264 bounds)
      let recordOptions: MediaRecorderOptions = { mimeType: 'video/webm;codecs=vp9' };
      if (!MediaRecorder.isTypeSupported(recordOptions.mimeType)) {
        recordOptions = { mimeType: 'video/webm;codecs=vp8' };
      }
      if (!MediaRecorder.isTypeSupported(recordOptions.mimeType)) {
        recordOptions = { mimeType: 'video/webm' };
      }

      const mRecorder = new MediaRecorder(canvasStream, recordOptions);
      mediaRecorderRef.current = mRecorder;
      recordedChunksRef.current = [];

      mRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mRecorder.onstop = () => {
        const adBlob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const videoURL = URL.createObjectURL(adBlob);
        
        // Trigger download block
        const fileLink = document.createElement('a');
        fileLink.href = videoURL;
        fileLink.download = `${config.shopName.toLowerCase().replace(/\s+/g, '-')}-ad.webm`;
        document.body.appendChild(fileLink);
        fileLink.click();
        document.body.removeChild(fileLink);

        setIsRecording(false);
        setIsPlaying(true); // Restart standard loop playback
      };

      // Set timestamp starting index point
      setCurrentTime(0.0);
      mRecorder.start();

      // Step programmatically in discrete steps of 33 milliseconds to guarantee frame-rate frames
      const stepDuration = 0.033; // 30 Frames per second
      let internalTimer = 0.0;

      const recordStepInterval = setInterval(() => {
        internalTimer += stepDuration;
        
        if (internalTimer >= 15.0) {
          clearInterval(recordStepInterval);
          setCurrentTime(15.00);
          mRecorder.stop();
        } else {
          setCurrentTime(parseFloat(internalTimer.toFixed(2)));
          setRecordProgress(Math.min(100, (internalTimer / 15.0) * 100));
        }
      }, 33);

    } catch (recorderError) {
      console.error("Direct system device recording failed: ", recorderError);
      setIsRecording(false);
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center relative">
      
      {/* Recording progress full overlay frame indicator */}
      {isRecording && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md rounded-[48px] z-50 flex flex-col items-center justify-center px-8 border-[12px] border-zinc-800 scale-[0.8] origin-center xs:scale-[0.9] sm:scale-100 duration-300">
          <div className="text-center space-y-4">
            <span className="text-4xl animate-bounce block">🎬</span>
            <h3 className="text-white font-extrabold text-lg tracking-tight uppercase">Merekam Video Iklan</h3>
            <p className="text-zinc-400 text-xs font-medium">Jangan menutup halaman ini. Canvas sedang direkam frame-by-frame untuk hasil video mulus.</p>
            
            {/* ProgressBar */}
            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-orange-500 h-full rounded-full transition-all duration-[30ms] ease-out shadow-inner"
                style={{ width: `${recordProgress}%` }}
              />
            </div>
            <div className="text-[11px] font-mono font-bold text-orange-400 tracking-widest uppercase mt-1">
              Prosessing: {recordProgress.toFixed(0)}% ({currentTime.toFixed(1)}s / 15.0s)
            </div>
          </div>
        </div>
      )}

      {/* Main Smartphone shell Mockup containing Canvas player */}
      <div 
        id="reels-mockup-frame"
        className="relative w-[390px] h-[844px] bg-[#09090b] rounded-[48px] border-[12px] border-zinc-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden select-none flex flex-col scale-[0.8] origin-center xs:scale-[0.9] sm:scale-100 duration-300"
      >
        
        {/* Notch / Speaker bar */}
        <div className="absolute top-0 inset-x-0 h-8 flex justify-center items-start z-50 pointer-events-none">
          <div className="w-36 h-4.5 bg-zinc-800 rounded-b-2xl flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-950 ml-16" />
          </div>
        </div>

        {/* Canvas area (Full viewport portrait bounds) */}
        <div className="relative flex-1 w-full h-full overflow-hidden">
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            className="w-full h-full block bg-black"
          />

          {/* Transparent interaction pane overlay when NOT recording */}
          {!isRecording && (
            <div 
              className="absolute inset-x-0 bottom-24 top-16 z-40 cursor-pointer bg-transparent"
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? "Klik untuk pause" : "Klik untuk bermain"}
            />
          )}

          {/* Pause icon overlay */}
          {!isPlaying && !isRecording && (
            <div className="absolute inset-0 bg-black/40 z-40 flex items-center justify-center pointer-events-none animate-[fadeIn_0.15s_ease-out]">
              <div className="p-5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 animate-pulse">
                <svg className="w-12 h-12 text-white fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Download Video CTA button wrapper (Beneath mobile frame layout) */}
      <div className="mt-4 sm:mt-6 z-40">
        <button
          onClick={handleStartVideoRecording}
          disabled={isRecording}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 disabled:from-zinc-800 disabled:to-zinc-800 text-white font-extrabold text-sm uppercase tracking-wider shadow-lg hover:shadow-orange-500/25 transition-all duration-150 flex items-center space-x-2.5 active:scale-95 cursor-pointer disabled:cursor-not-allowed group"
        >
          <span>📥</span>
          <span>Unduh Video Reels (MP4/WEBM)</span>
        </button>
        <p className="text-center text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-2.5">
          Tanpa Watermark • Kualitas Tinggi 100% Mulus
        </p>
      </div>

    </div>
  );
};
