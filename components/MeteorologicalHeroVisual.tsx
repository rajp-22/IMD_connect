'use client';

import React from 'react';
import {
  Compass,
  Radio,
  Wind,
  Gauge,
  Droplets,
  Thermometer,
  Satellite,
  Activity,
  Layers,
} from 'lucide-react';

export default function MeteorologicalHeroVisual() {
  return (
    <div className="relative w-full h-full min-h-[460px] lg:min-h-[580px] flex items-center justify-center select-none pointer-events-none">
      {/* 1. OUTER RADAR SCANNER RINGS & ROTATING SWEEP */}
      <div className="absolute w-[360px] h-[360px] sm:w-[480px] sm:h-[480px] lg:w-[540px] lg:h-[540px] rounded-full border border-sky-400/25 flex items-center justify-center">
        {/* Mid Range Ring */}
        <div className="w-[75%] h-[75%] rounded-full border border-sky-400/30 border-dashed flex items-center justify-center">
          {/* Inner Core Ring */}
          <div className="w-[60%] h-[60%] rounded-full border border-cyan-400/40 relative flex items-center justify-center">
            {/* Center Origin Pulsing Blip */}
            <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 animate-ping opacity-75"></div>
            <div className="absolute w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_12px_#38bdf8]"></div>
          </div>
        </div>

        {/* Continuous Radar Ray Sweep (12s smooth loop) */}
        <div className="absolute inset-0 rounded-full animate-radar-sweep bg-[conic-gradient(from_0deg,transparent_0_270deg,rgba(56,189,248,0.08)_320deg,rgba(56,189,248,0.32)_360deg)] pointer-events-none"></div>

        {/* Degree Markers & Crosshairs */}
        <div className="absolute inset-x-0 top-1/2 h-[1px] bg-sky-400/20"></div>
        <div className="absolute inset-y-0 left-1/2 w-[1px] bg-sky-400/20"></div>

        {/* Cardinal Bearing Labels */}
        <span className="absolute top-2 text-[10px] font-mono font-bold text-sky-300/80 tracking-widest">
          000° N [DWR-DELHI]
        </span>
        <span className="absolute right-2 text-[10px] font-mono font-bold text-sky-300/80 tracking-widest">
          090° E
        </span>
        <span className="absolute bottom-2 text-[10px] font-mono font-bold text-sky-300/80 tracking-widest">
          180° S [CYCLONE TRACK]
        </span>
        <span className="absolute left-2 text-[10px] font-mono font-bold text-sky-300/80 tracking-widest">
          270° W
        </span>
      </div>

      {/* 2. SATELLITE ORBIT PATHWAY (INSAT-3DR / 3DS TRACK) */}
      <div className="absolute w-[440px] h-[260px] sm:w-[560px] sm:h-[320px] rounded-[50%] border border-cyan-400/40 -rotate-12 pointer-events-none">
        {/* Orbit track dash glow */}
        <div className="absolute inset-0 rounded-[50%] border border-dashed border-cyan-300/50"></div>

        {/* Orbiting Satellite Node */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-950/90 border border-cyan-400/70 shadow-[0_0_15px_rgba(56,189,248,0.6)]">
          <Satellite className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
          <span className="text-[9px] font-mono font-bold text-cyan-200">
            INSAT-3DS • 82.5°E
          </span>
        </div>
      </div>

      {/* 3. INDIA SUB-CONTINENT SYNOPTIC WEATHER MAP SVG */}
      <div className="relative z-10 w-[300px] sm:w-[380px] lg:w-[420px] aspect-4/5 flex items-center justify-center opacity-90 drop-shadow-[0_0_30px_rgba(56,189,248,0.25)]">
        <svg
          viewBox="0 0 400 480"
          className="w-full h-full filter drop-shadow-[0_0_12px_rgba(30,58,138,0.5)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="indiaAtmosphereGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#1e40af" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.15" />
            </linearGradient>

            <linearGradient id="streamlineGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.1" />
              <stop offset="40%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.9" />
            </linearGradient>

            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* India Continental Coastline & Territorial Boundary Silhouette */}
          <path
            d="M 180,30 L 195,45 L 215,50 L 220,70 L 245,85 L 270,90 L 295,95 L 340,110 L 360,135 L 345,150 L 315,145 L 290,165 L 270,180 L 255,210 L 250,240 L 240,280 L 225,325 L 210,370 L 195,410 L 180,440 L 165,410 L 155,370 L 145,330 L 135,285 L 125,260 L 105,245 L 90,230 L 75,215 L 70,180 L 85,160 L 110,165 L 135,150 L 150,115 L 165,75 Z"
            fill="url(#indiaAtmosphereGrad)"
            stroke="#38bdf8"
            strokeWidth="1.8"
            strokeLinejoin="round"
            className="filter drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]"
          />

          {/* Bay of Bengal & Arabian Sea Pressure Isobar Contours */}
          <g className="animate-contour-drift">
            {/* 1008 hPa Isobar */}
            <path
              d="M 50,220 C 100,260 140,320 180,380 C 220,320 280,260 350,220"
              stroke="#60a5fa"
              strokeWidth="1.4"
              strokeDasharray="6 4"
              opacity="0.75"
            />
            <text x="55" y="215" fill="#93c5fd" fontSize="9" fontFamily="monospace" fontWeight="bold">
              1008 hPa
            </text>

            {/* 1010 hPa Isobar */}
            <path
              d="M 30,160 C 90,210 150,270 200,340 C 250,270 320,200 370,150"
              stroke="#38bdf8"
              strokeWidth="1.2"
              strokeDasharray="4 4"
              opacity="0.6"
            />
            <text x="35" y="155" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
              1010 hPa
            </text>

            {/* 1012 hPa Isobar */}
            <path
              d="M 60,110 C 130,150 180,200 220,260 C 270,200 330,140 380,95"
              stroke="#0ea5e9"
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.5"
            />
          </g>

          {/* Monsoon Trough & Wind Streamlines (Animated flow lines) */}
          <g>
            {/* Southwest Monsoon Vector Stream 1 */}
            <path
              d="M 40,430 C 90,380 140,330 180,280 C 220,240 280,200 350,180"
              stroke="url(#streamlineGrad)"
              strokeWidth="2.5"
              strokeDasharray="16 12"
              strokeLinecap="round"
              className="animate-wind-flow"
            />

            {/* Southwest Monsoon Vector Stream 2 */}
            <path
              d="M 70,460 C 120,400 170,340 210,290 C 260,230 320,170 380,140"
              stroke="url(#streamlineGrad)"
              strokeWidth="2"
              strokeDasharray="12 10"
              strokeLinecap="round"
              className="animate-wind-flow-slow"
            />

            {/* Arabian Sea Branch Streamline */}
            <path
              d="M 60,340 C 100,300 130,260 160,200 C 180,150 200,100 240,70"
              stroke="#38bdf8"
              strokeWidth="1.5"
              strokeDasharray="8 6"
              strokeLinecap="round"
              opacity="0.8"
              className="animate-wind-flow"
            />
          </g>

          {/* Tropical Cyclonic Vortex Pattern over Bay of Bengal */}
          <g transform="translate(290, 270)" className="animate-radar-sweep">
            <circle cx="0" cy="0" r="28" stroke="#f43f5e" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            <circle cx="0" cy="0" r="18" stroke="#fb7185" strokeWidth="1.4" opacity="0.75" />
            <circle cx="0" cy="0" r="8" stroke="#f43f5e" strokeWidth="1.8" fill="rgba(244,63,94,0.2)" />
            {/* Spiral rainband arms */}
            <path
              d="M 0,0 Q 15,-15 35,-5 Q 45,15 25,30"
              stroke="#fb7185"
              strokeWidth="1.8"
              fill="none"
              strokeDasharray="4 2"
              opacity="0.85"
            />
            <path
              d="M 0,0 Q -15,15 -35,5 Q -45,-15 -25,-30"
              stroke="#fb7185"
              strokeWidth="1.8"
              fill="none"
              strokeDasharray="4 2"
              opacity="0.85"
            />
          </g>
          {/* Cyclone Warning Label */}
          <g transform="translate(260, 320)">
            <rect x="0" y="0" width="100" height="22" rx="5" fill="rgba(15,23,42,0.92)" stroke="#f43f5e" strokeWidth="1" />
            <text
              x="50"
              y="11"
              textAnchor="middle"
              dominantBaseline="central"
              fill="#fda4af"
              fontSize="8.5"
              fontFamily="monospace"
              fontWeight="bold"
              letterSpacing="0.02em"
            >
              DEPRESSION: 996 hPa
            </text>
          </g>

          {/* IMD Key Regional Radar & Observational Stations */}
          {/* New Delhi (HQ) */}
          <g transform="translate(180, 140)">
            <circle cx="0" cy="0" r="5" fill="#38bdf8" className="animate-observation-pulse" />
            <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
            <text x="8" y="3" fill="#ffffff" fontSize="9" fontFamily="sans-serif" fontWeight="bold">
              DELHI [HQ]
            </text>
          </g>

          {/* Mumbai (RMC) */}
          <g transform="translate(125, 260)">
            <circle cx="0" cy="0" r="4.5" fill="#38bdf8" className="animate-observation-pulse" />
            <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
            <text x="-48" y="3" fill="#e2e8f0" fontSize="8.5" fontFamily="sans-serif" fontWeight="600">
              RMC MUMBAI
            </text>
          </g>

          {/* Kolkata (RMC) */}
          <g transform="translate(295, 215)">
            <circle cx="0" cy="0" r="4.5" fill="#38bdf8" className="animate-observation-pulse" />
            <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
            <text x="8" y="3" fill="#e2e8f0" fontSize="8.5" fontFamily="sans-serif" fontWeight="600">
              RMC KOLKATA
            </text>
          </g>

          {/* Chennai (RMC) */}
          <g transform="translate(210, 350)">
            <circle cx="0" cy="0" r="4.5" fill="#38bdf8" className="animate-observation-pulse" />
            <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
            <text x="8" y="3" fill="#e2e8f0" fontSize="8.5" fontFamily="sans-serif" fontWeight="600">
              RMC CHENNAI
            </text>
          </g>

          {/* Pune (CRS / National Training Center) */}
          <g transform="translate(145, 275)">
            <circle cx="0" cy="0" r="4" fill="#34d399" className="animate-observation-pulse" />
            <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
            <text x="7" y="3" fill="#a7f3d0" fontSize="8" fontFamily="sans-serif" fontWeight="600">
              PUNE [CRS/CTI]
            </text>
          </g>

          {/* Doppler Echo Reflectivity Indicator Tag */}
          <g transform="translate(45, 90)">
            <rect x="0" y="0" width="124" height="22" rx="5" fill="rgba(15,23,42,0.92)" stroke="#38bdf8" strokeWidth="1" />
            <circle cx="12" cy="11" r="3" fill="#38bdf8" className="animate-ping" />
            <circle cx="12" cy="11" r="2" fill="#38bdf8" />
            <text
              x="22"
              y="11"
              dominantBaseline="central"
              fill="#7dd3fc"
              fontSize="8.5"
              fontFamily="monospace"
              fontWeight="bold"
            >
              RADAR ECHO: 45 dBZ
            </text>
          </g>
        </svg>
      </div>

      {/* 4. METEOROLOGICAL INSTRUMENTATION TELEMETRY CARDS (Glassmorphic Badges) */}
      {/* Top Right: AWS Telemetry */}
      <div className="absolute top-2 right-2 sm:top-6 sm:right-6 bg-slate-950/85 backdrop-blur-md border border-cyan-500/40 rounded-xl p-3 shadow-lg flex items-center gap-3 animate-contour-drift pointer-events-auto">
        <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
          <Thermometer className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[9px] font-mono uppercase text-slate-400 font-bold block">
            AWS SFC OBSERVATION
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-extrabold font-mono text-white">28.4°C</span>
            <span className="text-[10px] text-cyan-300 font-mono">RH 74%</span>
          </div>
        </div>
      </div>

      {/* Bottom Right: Radar Nowcast / Wind Telemetry */}
      <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-10 bg-slate-950/85 backdrop-blur-md border border-blue-500/40 rounded-xl p-3 shadow-lg flex items-center gap-3 animate-synoptic-pulse pointer-events-auto">
        <div className="w-8 h-8 rounded-lg bg-blue-950/80 border border-blue-500/50 flex items-center justify-center text-blue-400">
          <Wind className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[9px] font-mono uppercase text-slate-400 font-bold block">
            WIND VECTOR • NOWCAST
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-extrabold font-mono text-white">240° / 18 kt</span>
            <span className="text-[10px] text-emerald-400 font-mono">SW MONSOON</span>
          </div>
        </div>
      </div>

      {/* Bottom Left: Barometric Pressure Telemetry */}
      <div className="absolute bottom-2 left-2 sm:bottom-6 sm:left-4 bg-slate-950/85 backdrop-blur-md border border-sky-500/40 rounded-xl p-3 shadow-lg flex items-center gap-3 hidden sm:flex pointer-events-auto">
        <div className="w-8 h-8 rounded-lg bg-sky-950/80 border border-sky-500/50 flex items-center justify-center text-sky-400">
          <Gauge className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[9px] font-mono uppercase text-slate-400 font-bold block">
            MSL PRESSURE
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-extrabold font-mono text-white">1008.2 hPa</span>
            <span className="text-[10px] text-sky-300 font-mono">QNH STANDARD</span>
          </div>
        </div>
      </div>
    </div>
  );
}
