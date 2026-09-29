'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { ArrowRight, CloudRain, Wind, Sparkles } from 'lucide-react';
import GifIcon from '@/components/GifIcon';

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
          scrub: 0.5,
        },
      });

      const layers = [
        { layer: '1', yPercent: 60 },
        { layer: '2', yPercent: 42 },
        { layer: '3', yPercent: 25 },
        { layer: '4', yPercent: 8 },
      ];

      layers.forEach((layerObj, idx) => {
        tl.to(
          triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`),
          {
            yPercent: layerObj.yPercent,
            ease: 'none',
          },
          idx === 0 ? undefined : '<'
        );
      });
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
            {/* Layer 1: High Atmosphere & Deep Sky (Background) */}
            <img
              src="https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1920&q=80"
              loading="eager"
              width="1920"
              height="1080"
              data-parallax-layer="1"
              alt="Atmospheric sky layer"
              className="parallax__layer-img brightness-90 contrast-110"
            />

            {/* Layer 2: Mountain and Cloudscape Depth */}
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80"
              loading="eager"
              width="1920"
              height="1080"
              data-parallax-layer="2"
              alt="Mountain and cloud layer"
              className="parallax__layer-img opacity-80 mix-blend-screen"
            />

            {/* Layer 3: Hero Title & Description */}
            <div data-parallax-layer="3" className="parallax__layer-title">
              <div className="text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
                <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/60 backdrop-blur-md border border-sky-400/30 text-sky-200 text-xs font-semibold tracking-widest uppercase mb-4 shadow-lg group">
                  <GifIcon name="wired-lineal-1-cloud-hover-pinch" alt="Cloud" className="w-4 h-4 object-contain" />
                  India Meteorological Department &bull; MoES
                </span>

                <h1 className="parallax__title mb-4 tracking-tight drop-shadow-2xl">
                  {title}
                </h1>

                {/* <p className="text-sm sm:text-base md:text-lg text-slate-100/95 leading-relaxed max-w-2xl drop-shadow-md mb-8 font-normal">
                  A digital learning and competency management portal for IMD.
                  Structured curriculum, competency evaluations, and capacity mapping
                  for meteorologists across all Regional Meteorological Centres.
                </p> */}

                {/* Quick Interactive Demo Selector */}
                <div className="w-full max-w-2xl pointer-events-auto bg-slate-950/75 backdrop-blur-md border border-slate-700/60 p-4 sm:p-5 rounded-2xl shadow-2xl">
                  <p className="text-xs font-semibold uppercase tracking-wider text-sky-300/90 mb-3 text-center sm:text-left">
                    Explore Portals
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <Link
                      href="/login?demo=trainee"
                      onMouseEnter={() => setHoveredRole('trainee')}
                      onMouseLeave={() => setHoveredRole(null)}
                      className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-white/95 hover:bg-white text-slate-900 transition-all transform hover:-translate-y-0.5 shadow-md group"
                    >
                      <div className="flex items-center gap-2.5 text-left">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100 p-0.5">
                          <GifIcon
                            name="wired-lineal-21-avatar-in-reveal-student"
                            alt="Trainee"
                            className="w-full h-full object-contain"
                            active={hoveredRole === 'trainee'}
                          />
                        </div>
                        <div>
                          <span className="font-bold text-xs sm:text-sm text-slate-900 block leading-tight">Trainee</span>
                          {/* <span className="text-[11px] text-slate-500 block truncate max-w-[95px] sm:max-w-[110px]">Pooja Iyer, Mumbai</span> */}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                    </Link>

                    <Link
                      href="/login?demo=trainer"
                      onMouseEnter={() => setHoveredRole('trainer')}
                      onMouseLeave={() => setHoveredRole(null)}
                      className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-white/95 hover:bg-white text-slate-900 transition-all transform hover:-translate-y-0.5 shadow-md group"
                    >
                      <div className="flex items-center gap-2.5 text-left">
                        <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100 p-0.5">
                          <GifIcon
                            name="wired-lineal-486-school-loop-cycle-teacher"
                            alt="Trainer"
                            className="w-full h-full object-contain"
                            active={hoveredRole === 'trainer'}
                          />
                        </div>
                        <div>
                          <span className="font-bold text-xs sm:text-sm text-slate-900 block leading-tight">Trainer</span>
                          {/* <span className="text-[11px] text-slate-500 block truncate max-w-[95px] sm:max-w-[110px]">Dr. Rajesh Sharma</span> */}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                    </Link>

                    <Link
                      href="/login?demo=admin"
                      onMouseEnter={() => setHoveredRole('admin')}
                      onMouseLeave={() => setHoveredRole(null)}
                      className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-white/95 hover:bg-white text-slate-900 transition-all transform hover:-translate-y-0.5 shadow-md group"
                    >
                      <div className="flex items-center gap-2.5 text-left">
                        <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100 p-0.5">
                          <GifIcon
                            name="wired-flat-966-file-policy-in-unfold-admin"
                            alt="Admin"
                            className="w-full h-full object-contain"
                            active={hoveredRole === 'admin'}
                          />
                        </div>
                        <div>
                          <span className="font-bold text-xs sm:text-sm text-slate-900 block leading-tight">Admin</span>
                          {/* <span className="text-[11px] text-slate-500 block truncate max-w-[95px] sm:max-w-[110px]">Dr. M. Mohapatra</span> */}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Layer 4: Foreground Mist & Cloud Formation */}
            <img
              src="https://images.unsplash.com/photo-1498496294664-d9372eb521f3?auto=format&fit=crop&w=1920&q=80"
              loading="eager"
              width="1920"
              height="1080"
              data-parallax-layer="4"
              alt="Foreground mist layer"
              className="parallax__layer-img opacity-50 mix-blend-overlay"
            />
          </div>
          <div className="parallax__fade"></div>
        </div>
      </section>
    </div>
  );
}
