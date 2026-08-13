import React, { useEffect, useRef } from 'react';
import { WeatherMode } from '../types';

interface BackgroundRainCanvasProps {
  weatherMode: WeatherMode;
  crtEnabled: boolean;
  lightingTheme: 'amber' | 'indigo' | 'cyan';
  bgImageUrl?: string;
}

export const BackgroundRainCanvas: React.FC<BackgroundRainCanvasProps> = ({
  weatherMode,
  crtEnabled,
  lightingTheme,
  bgImageUrl
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Rain drops
    const drops: { x: number; y: number; length: number; speed: number; opacity: number }[] = [];
    for (let i = 0; i < 140; i++) {
      drops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: 15 + Math.random() * 25,
        speed: 8 + Math.random() * 12,
        opacity: 0.2 + Math.random() * 0.4
      });
    }

    // Snowflakes
    const snowflakes: { x: number; y: number; radius: number; speedY: number; speedX: number; opacity: number; swing: number }[] = [];
    for (let i = 0; i < 160; i++) {
      snowflakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 1.2 + Math.random() * 2.8,
        speedY: 1.0 + Math.random() * 1.8,
        speedX: (Math.random() - 0.5) * 0.8,
        opacity: 0.4 + Math.random() * 0.5,
        swing: Math.random() * Math.PI * 2
      });
    }

    // Floating dust motes
    const dusts: { x: number; y: number; radius: number; speedX: number; speedY: number; opacity: number }[] = [];
    for (let i = 0; i < 40; i++) {
      dusts.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 0.5 + Math.random() * 1.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: 0.15 + Math.random() * 0.3
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render dust motes
      dusts.forEach(dust => {
        dust.x += dust.speedX;
        dust.y += dust.speedY;

        if (dust.x < 0) dust.x = canvas.width;
        if (dust.x > canvas.width) dust.x = 0;
        if (dust.y < 0) dust.y = canvas.height;
        if (dust.y > canvas.height) dust.y = 0;

        ctx.beginPath();
        ctx.arc(dust.x, dust.y, dust.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(254, 243, 199, ${dust.opacity})`;
        ctx.fill();
      });

      // Render falling rain
      if (weatherMode === 'rain') {
        ctx.lineWidth = 1.2;
        ctx.lineCap = 'round';

        drops.forEach(drop => {
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x - 2, drop.y + drop.length);
          ctx.strokeStyle = `rgba(186, 230, 253, ${drop.opacity})`;
          ctx.stroke();

          drop.y += drop.speed;
          drop.x -= 0.8;

          if (drop.y > canvas.height) {
            drop.y = -20;
            drop.x = Math.random() * (canvas.width + 100);
          }
        });
      }

      // Render falling snow
      if (weatherMode === 'winter') {
        snowflakes.forEach(flake => {
          flake.swing += 0.02;
          flake.y += flake.speedY;
          flake.x += Math.sin(flake.swing) * 0.8 + flake.speedX;

          if (flake.y > canvas.height) {
            flake.y = -10;
            flake.x = Math.random() * canvas.width;
          }
          if (flake.x > canvas.width) flake.x = 0;
          if (flake.x < 0) flake.x = canvas.width;

          ctx.beginPath();
          ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(240, 249, 255, ${flake.opacity})`;
          ctx.shadowBlur = 4;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [weatherMode]);

  const getThemeGradient = () => {
    if (weatherMode === 'winter') {
      return 'from-sky-950/50 via-slate-950/85 to-slate-950/98';
    }
    switch (lightingTheme) {
      case 'amber':
        return 'from-amber-950/40 via-slate-950/80 to-slate-950/95';
      case 'cyan':
        return 'from-cyan-950/40 via-slate-950/80 to-slate-950/95';
      case 'indigo':
      default:
        return 'from-indigo-950/50 via-slate-950/85 to-slate-950/98';
    }
  };

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 ${crtEnabled ? 'crt-overlay' : ''}`}>
      {/* Background Image Layer */}
      {bgImageUrl && (
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105 filter brightness-75 contrast-110"
          style={{ backgroundImage: `url(${bgImageUrl})` }}
        />
      )}

      {/* Atmospheric Radial Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-b ${getThemeGradient()} backdrop-blur-[2px] transition-colors duration-1000`} />

      {/* Soft Ambient Glow Bulbs */}
      <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] animate-pulse pointer-events-none ${
        weatherMode === 'winter' ? 'bg-sky-400/15' : 'bg-amber-500/10'
      }`} />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-indigo-500/15 blur-[140px] pointer-events-none" />

      {/* Canvas for Rain, Snow, and Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 z-10 opacity-80" />
    </div>
  );
};

