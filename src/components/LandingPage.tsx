'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Search,
  Sparkles,
  Layers,
  Code2,
  UtensilsCrossed,
  ShoppingBag,
  FileText,
  MapPin,
  Menu,
  ShieldCheck,
  Zap,
  Globe,
  ChevronRight,
  Terminal,
} from 'lucide-react';

interface LandingPageProps {
  onEnterDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterDashboard }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Full-Screen Interactive 3D Molten Glossy Spheres Canvas (No border clipping, spans full width)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 780);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || 780;
    };
    window.addEventListener('resize', handleResize);

    // Initial mouse position around the right side cluster
    let mouseX = width * 0.68;
    let mouseY = height * 0.42;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Spheres with fluid physics and full-screen range
    const spheres = [
      { x: width * 0.65, y: height * 0.42, r: 88, vx: 0.5, vy: 0.3, baseR: 88 },
      { x: width * 0.78, y: height * 0.32, r: 72, vx: -0.4, vy: 0.5, baseR: 72 },
      { x: width * 0.56, y: height * 0.58, r: 62, vx: 0.35, vy: -0.4, baseR: 62 },
      { x: width * 0.74, y: height * 0.60, r: 56, vx: -0.3, vy: -0.25, baseR: 56 },
      { x: width * 0.68, y: height * 0.24, r: 42, vx: 0.25, vy: 0.4, baseR: 42 },
      { x: width * 0.83, y: height * 0.50, r: 38, vx: -0.2, vy: 0.3, baseR: 38 },
    ];

    let time = 0;

    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      // Warm radial ambient glow positioned behind the main cluster
      const clusterCenterX = (spheres[0].x + spheres[1].x) / 2;
      const clusterCenterY = (spheres[0].y + spheres[1].y) / 2;
      const ambientGlow = ctx.createRadialGradient(
        clusterCenterX,
        clusterCenterY,
        40,
        clusterCenterX,
        clusterCenterY,
        width * 0.5
      );
      ambientGlow.addColorStop(0, 'rgba(255, 85, 0, 0.22)');
      ambientGlow.addColorStop(0.4, 'rgba(255, 55, 0, 0.08)');
      ambientGlow.addColorStop(0.8, 'rgba(255, 30, 0, 0.02)');
      ambientGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = ambientGlow;
      ctx.fillRect(0, 0, width, height);

      // Organic liquid connecting bridges between nearby spheres
      for (let i = 0; i < spheres.length; i++) {
        for (let j = i + 1; j < spheres.length; j++) {
          const s1 = spheres[i];
          const s2 = spheres[j];
          const dx = s2.x - s1.x;
          const dy = s2.y - s1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < (s1.r + s2.r) * 1.45) {
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.lineWidth = Math.min(s1.r, s2.r) * 0.72;
            ctx.lineCap = 'round';
            ctx.strokeStyle = '#0E0E13';
            ctx.stroke();

            // Amber rim glow along connecting bridge
            ctx.lineWidth = 5;
            ctx.strokeStyle = 'rgba(255, 85, 0, 0.45)';
            ctx.stroke();
          }
        }
      }

      // Update positions and render 3D glossy obsidian spheres
      spheres.forEach((s, idx) => {
        // Floating organic harmonic motion + smooth mouse attraction across whole width
        const targetX = mouseX + Math.sin(time * 0.8 + idx * 1.6) * 120 + (idx - 2) * 60;
        const targetY = mouseY + Math.cos(time * 0.7 + idx * 1.3) * 100 + (idx % 2 === 0 ? 40 : -40);

        s.x += (targetX - s.x) * 0.015 + Math.sin(time + idx * 2) * 0.8;
        s.y += (targetY - s.y) * 0.015 + Math.cos(time + idx * 1.7) * 0.8;

        // Soft elastic screen boundaries (NEVER clip or cut off at any border!)
        const margin = s.r + 30;
        if (s.x < margin) {
          s.x = margin;
          s.vx = Math.abs(s.vx);
        } else if (s.x > width - margin) {
          s.x = width - margin;
          s.vx = -Math.abs(s.vx);
        }
        if (s.y < margin) {
          s.y = margin;
          s.vy = Math.abs(s.vy);
        } else if (s.y > height - margin) {
          s.y = height - margin;
          s.vy = -Math.abs(s.vy);
        }

        // 1. Base Obsidian Metallic Body
        ctx.save();
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        const baseGrad = ctx.createRadialGradient(
          s.x - s.r * 0.35,
          s.y - s.r * 0.35,
          s.r * 0.05,
          s.x,
          s.y,
          s.r
        );
        baseGrad.addColorStop(0, '#2D2D36');
        baseGrad.addColorStop(0.3, '#18181E');
        baseGrad.addColorStop(0.7, '#0D0D10');
        baseGrad.addColorStop(1, '#050507');
        ctx.fillStyle = baseGrad;
        ctx.fill();

        // 2. Fiery Orange/Amber Rim Reflection (Clipped strictly inside sphere)
        ctx.clip();
        ctx.beginPath();
        const rimOffsetX = s.x + s.r * 0.45;
        const rimOffsetY = s.y + s.r * 0.45;
        ctx.arc(rimOffsetX, rimOffsetY, s.r * 0.95, 0, Math.PI * 2);
        const rimGrad = ctx.createRadialGradient(
          rimOffsetX,
          rimOffsetY,
          s.r * 0.25,
          rimOffsetX,
          rimOffsetY,
          s.r * 0.95
        );
        rimGrad.addColorStop(0, 'rgba(255, 140, 0, 0.95)');
        rimGrad.addColorStop(0.4, 'rgba(255, 75, 0, 0.75)');
        rimGrad.addColorStop(0.75, 'rgba(210, 35, 0, 0.35)');
        rimGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = rimGrad;
        ctx.fill();

        // 3. Specular Curved Glossy Highlight on Top-Left
        ctx.beginPath();
        ctx.arc(s.x - s.r * 0.35, s.y - s.r * 0.35, s.r * 0.22, 0, Math.PI * 2);
        const specGrad = ctx.createRadialGradient(
          s.x - s.r * 0.35,
          s.y - s.r * 0.35,
          1,
          s.x - s.r * 0.35,
          s.y - s.r * 0.35,
          s.r * 0.22
        );
        specGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
        specGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.3)');
        specGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = specGrad;
        ctx.fill();

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#070709] text-white selection:bg-[#FF5500]/30 selection:text-white font-tech overflow-x-hidden relative">
      {/* Subtle futuristic background grid */}
      <div className="absolute inset-0 bg-perspective-grid opacity-30 pointer-events-none" />

      {/* Top Navbar matching reference layout */}
      <nav className="relative z-30 flex items-center justify-between px-6 sm:px-12 py-6 border-b border-white/5 bg-[#070709]/80 backdrop-blur-md">
        {/* Left: Menu & Nav Links */}
        <div className="flex items-center gap-8">
          <button
            onClick={onEnterDashboard}
            className="w-9 h-9 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center text-neutral-300 hover:text-white hover:border-[#FF5500]/50 transition-colors"
            title="Open Dashboard"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="hidden md:flex items-center gap-7 text-xs font-medium text-neutral-400">
            <a href="#about" className="hover:text-white transition-colors">
              About
            </a>
            <a href="#solutions" className="hover:text-white transition-colors">
              Solutions
            </a>
            
          </div>
        </div>

        {/* Center: Brand Logo with 4-petal geometric glyph */}
        <div className="flex items-center gap-2 cursor-pointer group" onClick={onEnterDashboard}>
          <div className="w-5 h-5 text-[#FF5500] flex items-center justify-center transform group-hover:rotate-45 transition-transform duration-300">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <circle cx="7" cy="7" r="4" />
              <circle cx="17" cy="7" r="4" />
              <circle cx="7" cy="17" r="4" />
              <circle cx="17" cy="17" r="4" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-widest text-white uppercase font-syne">
            TRACE
          </span>
        </div>

        {/* Right: FAQ & Contact/Launch Pill */}
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-6 text-xs text-neutral-400">
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
            <a href="#support" className="hover:text-white transition-colors">
              Help & Support
            </a>
          </div>

          <button
            onClick={onEnterDashboard}
            className="group flex items-center gap-2.5 px-4 py-2 rounded-full bg-neutral-900/90 border border-white/15 hover:border-[#FF5500] text-xs font-medium text-white transition-all duration-200 hover:shadow-[0_0_20px_rgba(255,85,0,0.25)]"
          >
            <span>Launch App</span>
            <div className="w-4 h-4 rounded-full bg-[#FF5500] text-black flex items-center justify-center text-[10px] font-bold group-hover:translate-x-0.5 transition-transform">
              →
            </div>
          </button>
        </div>
      </nav>

      {/* Hero Section Container */}
      <section className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 pt-12 lg:pt-16 pb-20 min-h-[640px] flex items-center">
        {/* Full-Screen Interactive 3D Molten Spheres Canvas (Spans full page width, zero clipping!) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-[720px] pointer-events-none z-10 overflow-hidden">
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>

        {/* Content Layer (Over top of canvas with pointer-events-auto) */}
        <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
          {/* Left Column: Bold Condensed Typography & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center pointer-events-auto">
            {/* Massive Hero Headline */}
            <div className="flex flex-col select-none leading-none mb-6">
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white uppercase font-hero">
                THE{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5500] via-[#FF7700] to-[#FFAA00]">
                  FUTURE
                </span>{' '}
                OF
              </h1>
              <div className="flex items-center gap-3">
                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white uppercase font-hero">
                  MEMORY IS
                </h1>
                <div className="w-8 h-8 sm:w-12 sm:h-12 text-[#FF5500] flex items-center justify-center flex-shrink-0 animate-pulse">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <circle cx="7" cy="7" r="4" />
                    <circle cx="17" cy="7" r="4" />
                    <circle cx="7" cy="17" r="4" />
                    <circle cx="17" cy="17" r="4" />
                  </svg>
                </div>
              </div>
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight uppercase font-hero text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-200 to-neutral-400">
                INTELLIGENT
              </h1>
            </div>

            {/* Subtitle Description */}
            <p className="text-xs sm:text-sm text-neutral-400 max-w-lg leading-relaxed mb-8 font-normal">
              A cutting-edge visual intelligence platform revolutionizing personal archives by
              transforming passive screenshots into searchable, structured knowledge with instant OCR,
              entity detection, and AI synthesis.
            </p>

            {/* CTA Buttons & Social Proof */}
            <div className="flex flex-wrap items-center gap-6 mb-12">
              <button
                onClick={onEnterDashboard}
                className="group flex items-center gap-3 px-6 py-3 rounded-full bg-neutral-900 border border-white/20 hover:border-[#FF5500] text-sm font-semibold text-white transition-all hover:shadow-[0_0_25px_rgba(255,85,0,0.3)] cursor-pointer"
              >
                <span>Get Started</span>
                <div className="w-5 h-5 rounded-full bg-[#FF5500] text-black flex items-center justify-center text-xs font-bold group-hover:translate-x-0.5 transition-transform">
                  ↗
                </div>
              </button>

              {/* Overlapping User Avatars + 5k+ badge */}
              <div className="flex items-center gap-3">
                <div className="flex items-center -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-[#070709] bg-gradient-to-tr from-orange-600 to-amber-400 overflow-hidden flex items-center justify-center text-[10px] font-bold text-black">
                    YK
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-[#070709] bg-gradient-to-tr from-neutral-700 to-neutral-500 overflow-hidden flex items-center justify-center text-[10px] font-bold text-white">
                    AI
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-[#070709] bg-gradient-to-tr from-amber-600 to-yellow-500 overflow-hidden flex items-center justify-center text-[10px] font-bold text-black">
                    TR
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-neutral-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-ping" />
                  <span>5K+ Active Archives</span>
                </div>
              </div>
            </div>

            {/* Metrics Bar */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10 max-w-lg">
              <div>
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-syne">
                  100%
                </span>
                <p className="text-[11px] text-neutral-500 uppercase tracking-wider mt-1">
                  Local-first Privacy
                </p>
              </div>

              <div>
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-syne">
                  +25M
                </span>
                <p className="text-[11px] text-neutral-500 uppercase tracking-wider mt-1">
                  Screenshots Indexed
                </p>
              </div>

              <div>
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-syne">
                  +50M
                </span>
                <p className="text-[11px] text-neutral-500 uppercase tracking-wider mt-1">
                  Entities Retrieved
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Open focal area for the full-width floating spheres */}
          <div className="lg:col-span-5 h-[360px] sm:h-[420px] pointer-events-none" />
        </div>
      </section>

      {/* Feature Showcase Grid (Recreating the cards & perspectives from image) */}
      <section id="solutions" className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 py-16 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: 3D Wireframe Perspective Grid */}
          <div className="group p-6 rounded-2xl bg-[#0D0D11] border border-white/10 hover:border-[#FF5500]/40 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-5">
              <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-[#FF5500] text-neutral-400 group-hover:text-black flex items-center justify-center transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            {/* Perspective Wireframe SVG */}
            <div className="h-36 w-full relative mb-6 flex items-center justify-center overflow-hidden opacity-60 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 200 120" className="w-full h-full stroke-neutral-700 group-hover:stroke-[#FF5500]/60 transition-colors">
                <path d="M 10 110 L 190 110" fill="none" strokeWidth="1" />
                <path d="M 30 90 L 170 90" fill="none" strokeWidth="1" />
                <path d="M 50 70 L 150 70" fill="none" strokeWidth="1" />
                <path d="M 70 50 L 130 50" fill="none" strokeWidth="1" />
                <path d="M 10 110 L 100 20" fill="none" strokeWidth="1" />
                <path d="M 60 110 L 100 20" fill="none" strokeWidth="1" />
                <path d="M 100 110 L 100 20" fill="none" strokeWidth="1" />
                <path d="M 140 110 L 100 20" fill="none" strokeWidth="1" />
                <path d="M 190 110 L 100 20" fill="none" strokeWidth="1" />
              </svg>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-[#FF5500]">
                Autonomous Extraction
              </span>
              <h3 className="text-lg font-bold text-white uppercase tracking-tight font-syne mt-1 mb-2">
                PERSONALIZED SPENDING & ENTITY ANALYSIS
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Breaks down your food deliveries, hotel reservations, code snippets, and invoices into structured
                entities and actionable takeaways.
              </p>
            </div>
          </div>

          {/* Card 2: Interactive Mobile Device Preview */}
          <div className="group p-6 rounded-2xl bg-[#0D0D11] border border-white/10 hover:border-[#FF5500]/40 transition-all duration-300 flex flex-col justify-between">
            {/* Mini Mobile Frame UI */}
            <div className="p-4 rounded-xl bg-[#141419] border border-white/5 mb-6">
              <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-3">
                <span>9:41</span>
                <span>Active Vault</span>
              </div>
              <div className="flex items-baseline justify-between mb-2">
                <div>
                  <span className="text-[10px] text-neutral-500 block uppercase">Indexed Memory</span>
                  <span className="text-xl font-bold text-white font-syne">$752.00</span>
                </div>
                <span className="text-xs text-emerald-400 font-medium">+12.4%</span>
              </div>
              {/* Glowing Holographic Pass */}
              <div className="p-3 rounded-lg bg-gradient-to-r from-[#FF5500] to-[#FF8800] text-black text-[11px] font-bold flex items-center justify-between shadow-lg">
                <span>TRACE PROTOCOL</span>
                <span>•••• 1312</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-[#FF5500]">
                Instant Sync
              </span>
              <h3 className="text-lg font-bold text-white uppercase tracking-tight font-syne mt-1 mb-2">
                USER-FRIENDLY MULTI-MODAL INDEX
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Seamless OCR search across 15 native categories including Code, Food, Shopping, Documents, and Chats.
              </p>
            </div>
          </div>

          {/* Card 3: 3D Globe with Location Nodes */}
          <div className="group p-6 rounded-2xl bg-[#0D0D11] border border-white/10 hover:border-[#FF5500]/40 transition-all duration-300 flex flex-col justify-between">
            <div className="h-36 w-full relative mb-6 flex items-center justify-center">
              <div className="w-28 h-28 rounded-full border border-white/10 relative flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border border-dashed border-[#FF5500]/40 animate-spin" style={{ animationDuration: '20s' }} />
                <div className="absolute top-4 left-6 w-3 h-3 rounded-full bg-[#FF5500] animate-ping" />
                <div className="absolute top-4 left-6 w-3 h-3 rounded-full bg-[#FF5500]" />
                <div className="absolute bottom-6 right-6 w-2.5 h-2.5 rounded-full bg-amber-400" />
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-[#FF5500]">
                Private Architecture
              </span>
              <h3 className="text-lg font-bold text-white uppercase tracking-tight font-syne mt-1 mb-2">
                DECENTRALIZED ARCHIVE VAULT
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Zero telemetry, local storage encryption, and standalone Gemini AI assistant grounded in your visual memory.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Massive Futuristic Footer Marquee */}
      <section className="relative z-10 py-16 border-t border-white/5 overflow-hidden">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-6 sm:px-12">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 text-[#FF5500]">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <circle cx="7" cy="7" r="4" />
                <circle cx="17" cy="7" r="4" />
                <circle cx="7" cy="17" r="4" />
                <circle cx="17" cy="17" r="4" />
              </svg>
            </div>
            <span className="text-sm font-bold tracking-widest text-white uppercase font-syne">
              TRACE ARCHIVE
            </span>
          </div>

          <button
            onClick={onEnterDashboard}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#FF5500] text-black font-semibold text-xs hover:bg-[#FFAA00] transition-colors"
          >
            <span>Open Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
};
