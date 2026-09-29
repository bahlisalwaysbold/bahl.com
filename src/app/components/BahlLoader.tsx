'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { BAHL_BIRD_PATH, BAHL_BIRD_VIEWBOX } from './BahlBird';

const FLAP_MS = 780;
const FLAP_DELAY_MS = 300;
const MIN_VISIBLE_MS = 1500;
const EXIT_MS = 600;
const SETTLE_MS = 260;
const NEUTRAL_BAND_MS = 70;

export default function BahlLoader() {
  const [exiting, setExiting] = useState(false);
  const [mounted, setMounted] = useState(true);
  const timers = useRef<number[]>([]);
  const track = useCallback((id: number) => {
    timers.current.push(id);
    return id;
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const startedAt = performance.now();

    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    const prevPadding = root.style.paddingRight;
    const scrollbar = window.innerWidth - root.clientWidth;
    root.style.overflow = 'hidden';
    if (scrollbar > 0) root.style.paddingRight = `${scrollbar}px`;

    let lockReleased = false;
    const releaseLock = () => {
      if (lockReleased) return;
      lockReleased = true;
      root.style.overflow = prevOverflow;
      root.style.paddingRight = prevPadding;
    };

    let ready = false;
    let minElapsed = false;
    let exitScheduled = false;
    let exitStarted = false;

    const beginExit = () => {
      if (exitStarted) return;
      exitStarted = true;
      releaseLock();
      setExiting(true);
      track(window.setTimeout(() => setMounted(false), reduceMotion ? 0 : EXIT_MS));
    };

    const scheduleExit = () => {
      if (exitScheduled || !(ready && minElapsed)) return;
      exitScheduled = true;

      if (reduceMotion) {
        beginExit();
        return;
      }

      const flapStartedAt = startedAt + FLAP_DELAY_MS;
      const intoCycle = Math.max(0, performance.now() - flapStartedAt) % FLAP_MS;
      const wait = intoCycle < NEUTRAL_BAND_MS ? NEUTRAL_BAND_MS - intoCycle : FLAP_MS - intoCycle;
      track(window.setTimeout(beginExit, wait));
    };

    const markReady = () => {
      ready = true;
      scheduleExit();
    };

    if (document.readyState === 'complete') markReady();
    else window.addEventListener('load', markReady, { once: true });

    track(window.setTimeout(() => {
      minElapsed = true;
      scheduleExit();
    }, MIN_VISIBLE_MS));

    return () => {
      window.removeEventListener('load', markReady);
      timers.current.forEach(window.clearTimeout);
      timers.current = [];
      releaseLock();
    };
  }, [track]);

  if (!mounted) return null;

  return (
    <div
      className={`page-loader${exiting ? ' page-loader--exit' : ''}`}
      aria-hidden="true"
      {...(!exiting ? { inert: true as unknown as boolean } : {})}
      style={
        {
          '--loader-flap': `${FLAP_MS}ms`,
          '--loader-flap-delay': `${FLAP_DELAY_MS}ms`,
          '--loader-settle': `${SETTLE_MS}ms`,
        } as React.CSSProperties
      }
    >
      <svg
        className="page-loader__bird"
        viewBox={BAHL_BIRD_VIEWBOX}
        focusable="false"
        data-testid="bahl-loader-bird"
      >
        <defs>
          <clipPath id="bahl-loader-upper">
            <rect x="36" y="4" width="100" height="58" rx="2" />
          </clipPath>
          <clipPath id="bahl-loader-lower">
            <rect x="36" y="52" width="100" height="60" rx="2" />
          </clipPath>
        </defs>
        <path className="page-loader__base" d={BAHL_BIRD_PATH} fill="currentColor" />
        <g className="page-loader__wings">
          <path
            className="page-loader__wing page-loader__wing--upper"
            d={BAHL_BIRD_PATH}
            clipPath="url(#bahl-loader-upper)"
            fill="currentColor"
          />
          <path
            className="page-loader__wing page-loader__wing--lower"
            d={BAHL_BIRD_PATH}
            clipPath="url(#bahl-loader-lower)"
            fill="currentColor"
          />
        </g>
      </svg>
    </div>
  );
}
