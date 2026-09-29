'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Thermometer,
  Wind,
  Droplets,
  Gauge,
  Cloud,
  Eye,
  Search,
  RefreshCw,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  MapPin,
  Clock,
  Compass,
  Radio,
  X,
  CheckCircle2,
  Info,
} from 'lucide-react';
import {
  ICityWeatherData,
  IWeatherAlert,
  IRealtimeWeatherResponse,
} from '@/lib/weather-service';
import {
  INDIA_MAINLAND_PATH,
  INDIA_ISLANDS_PATH,
  projectCoordinates,
} from '@/lib/india-map-data';
import GifIcon from '@/components/GifIcon';

export type WeatherLayer = 'temperature' | 'rainfall' | 'wind' | 'pressure' | 'cloud';

interface RealtimeIndiaWeatherMapProps {
  compact?: boolean;
}

export default function RealtimeIndiaWeatherMap({ compact = false }: RealtimeIndiaWeatherMapProps = {}) {
  const [weatherData, setWeatherData] = useState<IRealtimeWeatherResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCity, setSelectedCity] = useState<ICityWeatherData | null>(null);
  const [hoveredCity, setHoveredCity] = useState<ICityWeatherData | null>(null);
  const [activeLayer, setActiveLayer] = useState<WeatherLayer>('temperature');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [lastFetchTime, setLastFetchTime] = useState<Date>(new Date());
  const [minutesSinceUpdate, setMinutesSinceUpdate] = useState<number>(0);

  // Fetch weather data
  const fetchWeather = async (forceDemo: boolean = false) => {
    setIsLoading(true);
    try {
      const url = `/api/weather/india${forceDemo ? '?mode=demo' : ''}`;
      const res = await fetch(url, { cache: 'no-store' });
      const data: IRealtimeWeatherResponse = await res.json();
      if (data && data.cities) {
        setWeatherData(data);
        setIsDemoMode(!data.isLive);
        setLastFetchTime(new Date(data.lastUpdated || Date.now()));
        setMinutesSinceUpdate(0);

        // If previously selected city exists, update its reference
        if (selectedCity) {
          const updated = data.cities.find((c) => c.id === selectedCity.id);
          if (updated) setSelectedCity(updated);
        }
      }
    } catch (err) {
      console.error('Failed to fetch real-time weather:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and 5-minute auto refresh loop
  useEffect(() => {
    fetchWeather(false);

    // 5-minute auto refresh
    const autoRefreshInterval = setInterval(() => {
      fetchWeather(isDemoMode);
    }, 5 * 60 * 1000);

    // 1-minute UI timer for "Updated X min ago"
    const timerInterval = setInterval(() => {
      setMinutesSinceUpdate((prev) => prev + 1);
    }, 60 * 1000);

    return () => {
      clearInterval(autoRefreshInterval);
      clearInterval(timerInterval);
    };
  }, [isDemoMode]);

  // City search filtering
  const matchingCities = useMemo(() => {
    if (!weatherData?.cities) return [];
    if (!searchQuery.trim()) return weatherData.cities;
    const q = searchQuery.toLowerCase();
    return weatherData.cities.filter(
      (c) => c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q)
    );
  }, [weatherData, searchQuery]);

  // Color coding by temperature
  const getCityTempColor = (temp: number) => {
    if (temp >= 35) return { bg: '#ef4444', text: '#fee2e2', border: '#b91c1c' }; // Red: Hot
    if (temp >= 28) return { bg: '#f97316', text: '#ffedd5', border: '#c2410c' }; // Orange: Warm
    if (temp >= 22) return { bg: '#06b6d4', text: '#cffafe', border: '#0e7490' }; // Cyan: Moderate
    return { bg: '#3b82f6', text: '#dbeafe', border: '#1d4ed8' }; // Blue: Cool
  };

  // Color coding by rainfall
  const getCityRainColor = (rain: number) => {
    if (rain >= 25) return '#ef4444'; // Heavy
    if (rain >= 10) return '#f97316'; // Moderate-heavy
    if (rain >= 2) return '#06b6d4'; // Light-moderate
    if (rain > 0) return '#3b82f6'; // Trace
    return '#64748b'; // Nil
  };

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(1.4, Math.max(0.9, prev + delta)));
  };

  const handleReset = () => {
    setZoomLevel(1);
    setSearchQuery('');
  };

  // Default key city for initial view
  const defaultSelected = useMemo(() => {
    if (selectedCity) return selectedCity;
    if (weatherData?.cities) {
      return weatherData.cities.find((c) => c.id === 'delhi') || weatherData.cities[0];
    }
    return null;
  }, [weatherData, selectedCity]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start select-none">
      {/* LEFT COLUMN: Overview, Status, Layers Info & Live Weather Telemetry */}
      <div className="lg:col-span-5 space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <GifIcon name="wired-lineal-1-cloud-hover-pinch" alt="Cloud" className="w-5 h-5 object-contain" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 inline-block">
              Live Synoptic Feed
            </span>
          </div>
          <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
            National Weather Grid
          </h2>
          <p className="text-sm text-stone-600 mt-2 leading-relaxed">
            Real-time synoptic telemetry across AWS stations, Doppler Radars, and Regional Meteorological Centres throughout India.
          </p>
        </div>

        {/* Status pills */}
        <div className="grid grid-cols-2 gap-3 text-xs pt-1">
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-stone-500 block text-[11px]">Primary RMC Hubs</span>
            <span className="text-base font-bold text-stone-900 mt-0.5 block">6 Centres</span>
            <span className="text-[10px] text-emerald-700 font-medium">● Operational</span>
          </div>
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-stone-500 block text-[11px]">Surface AWS Network</span>
            <span className="text-base font-bold text-stone-900 mt-0.5 block">750+ Feeds</span>
            <span className="text-[10px] text-sky-700 font-medium">Synoptic intervals</span>
          </div>
        </div>

        {/* Interactive Observation Layers text card */}
        <div className="p-3.5 rounded-xl bg-slate-900 text-white space-y-1">
          <p className="text-xs font-semibold text-sky-300">
            Interactive Observation Layers
          </p>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Toggle surface temperatures, rainfall accumulations, wind vector streams, and isobaric pressure directly on the map.
          </p>
        </div>

        {/* BELOW Interactive Observation Layers: Selected City Weather Telemetry Panel */}
        {defaultSelected && (
          <div className="bg-slate-950/95 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-3 sm:p-3.5 shadow-lg text-white space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-800/80 pb-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                  <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                    {defaultSelected.name}, {defaultSelected.state}
                  </h3>
                  <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                    {defaultSelected.region}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {defaultSelected.condition} &bull; Feels like {defaultSelected.feelsLike}°C
                </p>
              </div>

              {/* Main Temperature Display */}
              <div className="flex items-baseline gap-1.5 self-start sm:self-auto">
                <span className="text-xl sm:text-2xl font-bold font-mono text-cyan-300">
                  {defaultSelected.temperature}°C
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {defaultSelected.observationTime}
                </span>
              </div>
            </div>

            {/* 6 Key Weather Instrument Readouts */}
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              {/* Humidity */}
              <div className="p-1.5 px-2 rounded-lg bg-slate-900/70 border border-slate-800 space-y-0.5">
                <span className="text-[9px] uppercase font-bold text-slate-400 flex items-center gap-1 font-mono">
                  <Droplets className="w-2.5 h-2.5 text-cyan-400" /> Humidity
                </span>
                <p className="text-xs font-semibold font-mono text-white">{defaultSelected.relativeHumidity}%</p>
              </div>

              {/* Wind */}
              <div className="p-1.5 px-2 rounded-lg bg-slate-900/70 border border-slate-800 space-y-0.5">
                <span className="text-[9px] uppercase font-bold text-slate-400 flex items-center gap-1 font-mono">
                  <Wind className="w-2.5 h-2.5 text-emerald-400" /> Wind
                </span>
                <p className="text-xs font-semibold font-mono text-white">
                  {defaultSelected.windSpeed} <span className="text-[10px] text-slate-400">km/h</span>{' '}
                  <span className="text-[10px] text-emerald-400 font-normal">{defaultSelected.windDirectionCompass}</span>
                </p>
              </div>

              {/* Barometric Pressure */}
              <div className="p-1.5 px-2 rounded-lg bg-slate-900/70 border border-slate-800 space-y-0.5">
                <span className="text-[9px] uppercase font-bold text-slate-400 flex items-center gap-1 font-mono">
                  <Gauge className="w-2.5 h-2.5 text-blue-400" /> Pressure
                </span>
                <p className="text-xs font-semibold font-mono text-white">{defaultSelected.pressureMsl} <span className="text-[10px] text-slate-400">hPa</span></p>
              </div>

              {/* Rainfall */}
              <div className="p-1.5 px-2 rounded-lg bg-slate-900/70 border border-slate-800 space-y-0.5">
                <span className="text-[9px] uppercase font-bold text-slate-400 flex items-center gap-1 font-mono">
                  <Droplets className="w-2.5 h-2.5 text-sky-400" /> Rain
                </span>
                <p className="text-xs font-semibold font-mono text-white">{defaultSelected.precipitation} <span className="text-[10px] text-slate-400">mm</span></p>
              </div>

              {/* Cloud Cover */}
              <div className="p-1.5 px-2 rounded-lg bg-slate-900/70 border border-slate-800 space-y-0.5">
                <span className="text-[9px] uppercase font-bold text-slate-400 flex items-center gap-1 font-mono">
                  <Cloud className="w-2.5 h-2.5 text-slate-300" /> Cloud
                </span>
                <p className="text-xs font-semibold font-mono text-white">{defaultSelected.cloudCover}%</p>
              </div>

              {/* Visibility */}
              <div className="p-1.5 px-2 rounded-lg bg-slate-900/70 border border-slate-800 space-y-0.5">
                <span className="text-[9px] uppercase font-bold text-slate-400 flex items-center gap-1 font-mono">
                  <Eye className="w-2.5 h-2.5 text-violet-400" /> Visibility
                </span>
                <p className="text-xs font-semibold font-mono text-white">{defaultSelected.visibility} <span className="text-[10px] text-slate-400">km</span></p>
              </div>
            </div>

            {/* Source Attribution & Official Notice */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[9px] font-mono text-slate-500 pt-1 border-t border-slate-800/80">
              <span>Source: {weatherData?.source || 'Open-Meteo High-Resolution Numerical API'}</span>
              <span>Refreshes dynamically every 5 min</span>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Interactive Weather Map */}
      <div className="lg:col-span-7">
        <div className="w-full rounded-2xl bg-slate-950 p-2 sm:p-3 shadow-xl border border-slate-800 flex flex-col">
          {/* 1. TOP STATUS & CONTROLS BAR */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 z-20 mb-2">
        {/* Status Indicator: Live or Demo */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-cyan-500/30 text-xs shadow-md">
          <span
            className={`w-2 h-2 rounded-full ${
              weatherData?.isLive && !isDemoMode
                ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]'
                : 'bg-amber-400 animate-pulse'
            }`}
          />
          <span className="font-mono font-bold text-white tracking-wider">
            {isDemoMode ? 'DEMO WEATHER DATA' : weatherData?.isLive ? '● LIVE INDIA WEATHER' : 'DATA DELAYED'}
          </span>
          <span className="text-[10px] text-slate-400 font-mono border-l border-slate-700 pl-2">
            {minutesSinceUpdate === 0 ? 'Just now' : `${minutesSinceUpdate} min ago`}
          </span>
        </div>

        {/* Action Controls: Refresh & Mode Toggle */}
        <div className="flex items-center gap-2">
          {/* Demo / Live Switcher */}
          {/* <button
            onClick={() => {
              const nextMode = !isDemoMode;
              setIsDemoMode(nextMode);
              fetchWeather(nextMode);
            }}
            className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold border transition bg-slate-900/80 text-cyan-200 border-cyan-500/40 hover:bg-slate-800"
            title="Toggle between Live API and Synthesized Demo dataset"
          >
            {isDemoMode ? 'Switch to LIVE API' : 'Demo Mode'}
          </button> */}

          {/* Manual Refresh */}
          <button
            onClick={() => fetchWeather(isDemoMode)}
            disabled={isLoading}
            className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 transition"
            title="Refresh weather data now"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. LAYER SELECTOR STRIP */}
      <div className="flex flex-wrap items-center justify-between gap-2 z-20 mb-3 bg-slate-950/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-800/80">
        <div className="flex flex-wrap items-center gap-1 text-[11px]">
          <span className="text-[10px] font-mono text-slate-400 px-2 uppercase font-bold flex items-center gap-1">
            <Layers className="w-3 h-3 text-cyan-400" /> Layers:
          </span>
          {[
            { id: 'temperature', label: 'Temperature', icon: Thermometer },
            { id: 'rainfall', label: 'Rainfall', icon: Droplets },
            { id: 'wind', label: 'Wind Vector', icon: Wind },
            { id: 'pressure', label: 'Isobar Pressure', icon: Gauge },
            { id: 'cloud', label: 'Cloud Cover', icon: Cloud },
          ].map((l) => {
            const Icon = l.icon;
            const active = activeLayer === l.id;
            return (
              <button
                key={l.id}
                onClick={() => setActiveLayer(l.id as WeatherLayer)}
                className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1.5 ${
                  active
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-xs font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{l.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Search */}
        <div className="relative text-xs w-36 sm:w-44">
          <Search className="w-3 h-3 text-slate-400 absolute left-2 top-2" />
          <input
            type="text"
            placeholder="Search city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-6 pr-2 py-1 bg-slate-900/90 border border-slate-700 rounded-lg text-[11px] text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-400"
          />
        </div>
      </div>

      {/* 3. MAIN GEOGRAPHIC MAP VIEWPORT */}
      <div
        className="relative w-full h-[460px] sm:h-[500px] rounded-2xl overflow-hidden border border-cyan-500/30 bg-gradient-to-b from-[#06172e]/90 via-[#071d3a]/80 to-[#041224]/95 shadow-2xl flex items-center justify-center"
        style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.25s ease-out' }}
      >
        {/* Lat/Long Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c712_1px,transparent_1px),linear-gradient(to_bottom,#0284c712_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] opacity-70 pointer-events-none"></div>

        {/* SVG GEOGRAPHIC OUTLINE & ATMOSPHERIC METEOROLOGY */}
        <svg
          viewBox="0 0 600 680"
          className="w-full h-full max-h-[490px] p-1.5 drop-shadow-[0_0_24px_rgba(56,189,248,0.25)] select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="mapFillGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0b2e59" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#072040" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#04142b" stopOpacity="0.55" />
            </linearGradient>

            <linearGradient id="windStream" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.9" />
            </linearGradient>

            <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Authentic Geographic Mainland Outline of India */}
          <path
            d={INDIA_MAINLAND_PATH}
            fill="url(#mapFillGradient)"
            stroke="#38bdf8"
            strokeWidth="1.8"
            strokeLinejoin="round"
            className="filter drop-shadow-[0_0_10px_rgba(56,189,248,0.4)]"
          />

          {/* Authentic Islands (Andaman & Nicobar, Lakshadweep) */}
          <path
            d={INDIA_ISLANDS_PATH}
            fill="url(#mapFillGradient)"
            stroke="#38bdf8"
            strokeWidth="1.4"
            strokeLinejoin="round"
            className="filter drop-shadow-[0_0_6px_rgba(56,189,248,0.35)]"
          />

          {/* LAYER VISUALIZATION: WINDS */}
          {activeLayer === 'wind' && (
            <g>
              {/* Southwest Arabian Sea Monsoon Jet Stream */}
              <path
                d="M 50,560 C 100,480 130,420 190,360 C 240,310 320,280 420,260"
                stroke="url(#windStream)"
                strokeWidth="2.8"
                strokeDasharray="18 12"
                strokeLinecap="round"
                className="animate-wind-flow"
              />
              <path
                d="M 70,610 C 120,530 160,450 220,390 C 280,330 360,290 460,250"
                stroke="url(#windStream)"
                strokeWidth="2.2"
                strokeDasharray="14 10"
                strokeLinecap="round"
                className="animate-wind-flow-slow"
              />
              {/* Bay of Bengal Monsoon Branch curving to Northeast */}
              <path
                d="M 370,550 C 360,460 380,380 410,320 C 440,270 470,250 530,230"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeDasharray="12 8"
                strokeLinecap="round"
                opacity="0.85"
                className="animate-wind-flow"
              />
              {/* Himalayan Westerly High-Altitude Stream */}
              <path
                d="M 120,110 C 180,130 250,140 340,160"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeDasharray="10 6"
                strokeLinecap="round"
                opacity="0.75"
                className="animate-wind-flow"
              />
            </g>
          )}

          {/* LAYER VISUALIZATION: PRESSURE ISOBARS */}
          {activeLayer === 'pressure' && (
            <g className="animate-contour-drift">
              {/* 1008 hPa */}
              <path
                d="M 80,310 C 150,370 220,430 280,510 C 340,430 420,350 520,290"
                stroke="#60a5fa"
                strokeWidth="1.8"
                strokeDasharray="6 4"
                opacity="0.8"
              />
              <text x="85" y="305" fill="#93c5fd" fontSize="10" fontFamily="monospace" fontWeight="bold">
                1008 hPa
              </text>

              {/* 1010 hPa */}
              <path
                d="M 60,230 C 140,290 210,370 280,450 C 350,370 450,280 520,220"
                stroke="#38bdf8"
                strokeWidth="1.4"
                strokeDasharray="4 4"
                opacity="0.7"
              />
              <text x="65" y="225" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                1010 hPa
              </text>
            </g>
          )}

          {/* DYNAMIC CITY WEATHER MARKERS & VALUE CHIPS */}
          {matchingCities.map((city) => {
            // Coordinate mapping to authentic SVG frame (600x680)
            const { x: cx, y: cy } = (city.lat && city.lng)
              ? projectCoordinates(city.lng, city.lat)
              : { x: (city.x / 100) * 600, y: (city.y / 100) * 680 };

            const isSelected = selectedCity?.id === city.id || defaultSelected?.id === city.id;
            const isHovered = hoveredCity?.id === city.id;
            const tempColors = getCityTempColor(city.temperature);

            // What value to show on map chip depending on layer
            let chipText = `${Math.round(city.temperature)}°`;
            if (activeLayer === 'rainfall') chipText = `${city.precipitation}mm`;
            if (activeLayer === 'wind') chipText = `${Math.round(city.windSpeed)}k`;
            if (activeLayer === 'pressure') chipText = `${Math.round(city.pressureMsl)}`;
            if (activeLayer === 'cloud') chipText = `${city.cloudCover}%`;

            return (
              <g
                key={city.id}
                className="cursor-pointer transition-all duration-150"
                onClick={() => setSelectedCity(city)}
                onMouseEnter={() => setHoveredCity(city)}
                onMouseLeave={() => setHoveredCity(null)}
              >
                {/* Pulsing ring on selected city */}
                {isSelected && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r="14"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    className="animate-ping"
                    opacity="0.75"
                  />
                )}

                {/* Outer Glow Circle */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? '7' : isHovered ? '6' : '5'}
                  fill={tempColors.bg}
                  stroke="#ffffff"
                  strokeWidth={isSelected ? '2' : '1.2'}
                  filter={isSelected ? 'url(#nodeGlow)' : undefined}
                />

                {/* Center Core dot */}
                <circle cx={cx} cy={cy} r="2" fill="#ffffff" />

                {/* City Name & Dynamic Metric Tag */}
                <g transform={`translate(${cx + 8}, ${cy - 10})`}>
                  {/* Glass Tag Background */}
                  <rect
                    x="0"
                    y="0"
                    width={city.name.length * 6.2 + chipText.length * 7 + 14}
                    height="18"
                    rx="4"
                    fill="rgba(6, 21, 43, 0.9)"
                    stroke={isSelected ? '#38bdf8' : 'rgba(56, 189, 248, 0.4)'}
                    strokeWidth={isSelected ? '1.4' : '0.8'}
                  />

                  {/* City Label */}
                  <text
                    x="5"
                    y="9.5"
                    dominantBaseline="central"
                    fill={isSelected ? '#ffffff' : '#e2e8f0'}
                    fontSize="9"
                    fontFamily="sans-serif"
                    fontWeight={isSelected ? 'bold' : '600'}
                  >
                    {city.name}
                  </text>

                  {/* Value Badge */}
                  <text
                    x={city.name.length * 6.2 + 8}
                    y="9.5"
                    dominantBaseline="central"
                    fill={tempColors.text}
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {chipText}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* COMPACT HOVER TOOLTIP */}
        {hoveredCity && (() => {
          const { x: cx, y: cy } = (hoveredCity.lat && hoveredCity.lng)
            ? projectCoordinates(hoveredCity.lng, hoveredCity.lat)
            : { x: (hoveredCity.x / 100) * 600, y: (hoveredCity.y / 100) * 680 };
          const leftPercent = Math.min(80, Math.max(20, (cx / 600) * 100));
          const topPercent = Math.min(80, Math.max(15, (cy / 680) * 100));
          return (
            <div
              className="absolute z-30 pointer-events-none bg-slate-950/95 backdrop-blur-md border border-cyan-400/80 rounded-xl p-3 shadow-2xl text-xs space-y-1 w-48 animate-in fade-in zoom-in-95 duration-100"
              style={{
                left: `${leftPercent}%`,
                top: `${topPercent}%`,
                transform: 'translate(-50%, -100%)',
              }}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                <span className="font-bold text-white text-sm">{hoveredCity.name}</span>
                <span className="text-cyan-300 font-mono font-extrabold text-sm">
                  {hoveredCity.temperature}°C
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium">{hoveredCity.condition}</p>
              <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-400 pt-1 font-mono">
                <span>RH: {hoveredCity.relativeHumidity}%</span>
                <span>Wind: {hoveredCity.windSpeed} km/h {hoveredCity.windDirectionCompass}</span>
                <span>Rain: {hoveredCity.precipitation} mm</span>
                <span>Pressure: {hoveredCity.pressureMsl} hPa</span>
              </div>
            </div>
          );
        })()}

        {/* MAP ZOOM CONTROLS */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 bg-slate-950/80 backdrop-blur-md p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => handleZoom(0.1)}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-800 text-slate-200"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(-0.1)}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-800 text-slate-200"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-800 text-slate-200"
            title="Reset India View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* LAYER LEGEND */}
        <div className="absolute bottom-3 left-3 z-20 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-400">
          {activeLayer === 'temperature' && (
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-300">Temp (°C):</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span>&lt;22</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400"></span>22-28</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span>28-35</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span>&gt;35</span>
            </div>
          )}
          {activeLayer === 'rainfall' && (
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-300">Rain (mm):</span>
              <span className="text-slate-400">&lt;2</span>
              <span className="text-blue-400">2-10</span>
              <span className="text-cyan-400">10-25</span>
              <span className="text-orange-400">25-50</span>
              <span className="text-red-400">&gt;50</span>
            </div>
          )}
          {activeLayer === 'wind' && (
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-300">Wind:</span>
              <span className="text-emerald-400">Animated Surface Vectors (km/h)</span>
            </div>
          )}
          {activeLayer === 'pressure' && (
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-300">Pressure:</span>
              <span className="text-blue-400">Synoptic Isobar Contours (hPa)</span>
            </div>
          )}
          {activeLayer === 'cloud' && (
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-300">Cloud Cover:</span>
              <span className="text-cyan-300">Percentage Cloudiness (0-100%)</span>
            </div>
          )}
        </div>
      </div>

        </div>
      </div>
    </div>
  );
}
