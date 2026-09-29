'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { ArrowRight, CloudRain, Wind } from 'lucide-react';
import GifIcon from '@/components/GifIcon';
import { FontAwesomeIcon, byPrefixAndName } from '@/lib/fontawesome';

interface ParallaxComponentProps {
  title?: string;
}

export function ParallaxComponent({ title = 'MeghSetu' }: ParallaxComponentProps = {}) {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const triggerElement = parallaxRef.current?.querySelector('[data-parallax-layers]');

    if (triggerElement) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: '0% 0%',
          end: '100% 0%',
          scrub: 0.6,
        },
      });

      // Layer 1: Background sea bridge hero visual (smooth parallax drift)
      tl.to(
        triggerElement.querySelectorAll('[data-parallax-layer="1"]'),
        {
          yPercent: 25,
          scale: 1.05,
          ease: 'none',
        },
        0
      );

      // Layer 3: Title and Portals — gently translates, scales slightly, and dissolves gracefully on scroll
      tl.to(
        triggerElement.querySelectorAll('[data-parallax-layer="3"]'),
        {
          yPercent: -12,
          scale: 0.94,
          opacity: 0,
          ease: 'power1.in',
        },
        0
      );
    }

    // Initialize full-page smooth inertia scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      if (triggerElement) {
        gsap.killTweensOf(triggerElement);
      }
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="parallax" ref={parallaxRef}>
      <section className="parallax__header">
        <div className="parallax__visuals">
          <div className="parallax__black-line-overflow"></div>
          <div data-parallax-layers className="parallax__layers">
            {/* Layer 1: Sea Bridge Hero Visual */}
            <img
              src="/gdmoonkiller-sea-bridge-7407726.jpg"
              loading="eager"
              width={1920}
              height={1080}
              data-parallax-layer="1"
              alt="MeghSetu Sea Bridge"
              className="parallax__layer-img brightness-95 contrast-105"
            />

            {/* Layer 3: Hero Title & Description */}
            <div data-parallax-layer="3" className="parallax__layer-title">
              <div className="text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
                {/* Institutional Badge with Glowing Activity Beacon */}
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-950/70 backdrop-blur-md border border-sky-400/40 text-sky-200 text-[11px] sm:text-xs font-bold tracking-[0.16em] uppercase mb-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                  <GifIcon name="wired-lineal-1-cloud-hover-pinch" alt="Cloud" className="w-4 h-4 object-contain" />
                  <span>India Meteorological Department &bull; MoES</span>
                </div>

                {/* Monumental Hero Title with Ambient Backlight Glow */}
                <div className="relative flex flex-col items-center justify-center w-full my-2">
                  <div className="absolute w-[85%] max-w-3xl h-44 bg-sky-400/25 blur-3xl rounded-full pointer-events-none -z-10" />

                  <h1 className="parallax__title tracking-tight font-black select-none">
                    {title}
                  </h1>

                  {/* High-Contrast Frosted Badge for 100% Readability */}
                  <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-[#1e9df1]/40 text-[#1e9df1] text-xs sm:text-sm font-bold tracking-[0.16em] uppercase mt-3 mb-1 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
                    Centralized Learning &amp; Capacity Building Portal
                  </div>
                </div>

                {/* Quick Interactive Demo Selector */}
                <div className="w-full max-w-2xl pointer-events-auto bg-slate-950/80 backdrop-blur-xl border border-sky-500/20 p-4 sm:p-5 rounded-[1.3rem] shadow-[0_16px_48px_rgba(0,0,0,0.65)] mt-4">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-sky-300">
                      Explore Portals
                    </p>
                    {/* <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                      Direct Role Access
                    </span> */}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <Link
                      href="/login?demo=trainee"
                      onMouseEnter={() => setHoveredRole('trainee')}
                      onMouseLeave={() => setHoveredRole(null)}
                      className="flex items-center justify-between p-2.5 sm:p-3 rounded-[1.1rem] bg-white hover:bg-white text-slate-900 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(30,157,241,0.25)] border border-slate-200/90 hover:border-[#1e9df1] group"
                    >
                      <div className="flex items-center gap-2.5 text-left">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100 group-hover:scale-105 transition-transform text-[#1e9df1]">
                          <FontAwesomeIcon icon={byPrefixAndName.fas['user']} className="w-4 h-4 text-base" />
                        </div>
                        <div>
                          <span className="font-bold text-xs sm:text-sm text-slate-900 block leading-tight">Trainee</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#1e9df1] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                    </Link>

                    <Link
                      href="/login?demo=trainer"
                      onMouseEnter={() => setHoveredRole('trainer')}
                      onMouseLeave={() => setHoveredRole(null)}
                      className="flex items-center justify-between p-2.5 sm:p-3 rounded-[1.1rem] bg-white hover:bg-white text-slate-900 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(16,185,129,0.25)] border border-slate-200/90 hover:border-emerald-500 group"
                    >
                      <div className="flex items-center gap-2.5 text-left">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:scale-105 transition-transform text-emerald-600">
                          <FontAwesomeIcon icon={byPrefixAndName.fas['building-columns']} className="w-4 h-4 text-base" />
                        </div>
                        <div>
                          <span className="font-bold text-xs sm:text-sm text-slate-900 block leading-tight">Trainer</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                    </Link>

                    <Link
                      href="/login?demo=admin"
                      onMouseEnter={() => setHoveredRole('admin')}
                      onMouseLeave={() => setHoveredRole(null)}
                      className="flex items-center justify-between p-2.5 sm:p-3 rounded-[1.1rem] bg-white hover:bg-white text-slate-900 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(245,158,11,0.25)] border border-slate-200/90 hover:border-amber-500 group"
                    >
                      <div className="flex items-center gap-2.5 text-left">
                        <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100 group-hover:scale-105 transition-transform text-amber-600">
                          <FontAwesomeIcon icon={byPrefixAndName.fas['shield']} className="w-4 h-4 text-base" />
                        </div>
                        <div>
                          <span className="font-bold text-xs sm:text-sm text-slate-900 block leading-tight">Admin</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div className="parallax__fade"></div>
        </div>
      </section>
    </div>
  );
}
