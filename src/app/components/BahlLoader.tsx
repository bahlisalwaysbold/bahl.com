'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { BAHL_BIRD_PATH, BAHL_BIRD_VIEWBOX } from './BahlBird';

const FLAP_MS = 880;
const FLAP_DELAY_MS = 260;
const MIN_INITIAL_MS = 1400;
const MIN_NAV_MS = 700;
const EXIT_MS = 560;
const NEUTRAL_BAND_MS = 80;

const PIVOT_LEFT = '72px 44px';
const PIVOT_RIGHT = '102px 46px';

const WING_LEFT_EDGE = 78;
const CORE_LEFT = 70;
const CORE_RIGHT = 106;
const WING_RIGHT_EDGE = 100;

type Phase = 'enter' | 'exit';

function reducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function BahlLoader() {
  const pathname = usePathname();
  // Route-keyed so a new pathname immediately resets to the enter phase during
  // render, instead of calling setState synchronously inside an effect.
  const [view, setView] = useState({ route: '', phase: 'enter' as Phase, mounted: true });
  const current = view.route === pathname ? view : { route: pathname, phase: 'enter' as Phase, mounted: true };
  const phase = current.phase;
  const rendered = current.mounted;
  const timers = useRef<number[]>([]);
  const isFirst = useRef(true);
  const lock = useRef<{ overflow: string; paddingRight: string } | null>(null);

  const update = useCallback(
    (next: Partial<{ phase: Phase; mounted: boolean }>) =>
      setView({ route: pathname, phase: next.phase ?? 'enter', mounted: next.mounted ?? true }),
    [pathname],
  );

  const track = useCallback((id: number) => {
    timers.current.push(id);
    return id;
  }, []);

  const clearTimers = useCallback(() => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  }, []);

  const lockScroll = useCallback(() => {
    if (lock.current) return;
    const root = document.documentElement;
    lock.current = { overflow: root.style.overflow, paddingRight: root.style.paddingRight };
    const scrollbar = window.innerWidth - root.clientWidth;
    root.style.overflow = 'hidden';
    if (scrollbar > 0) root.style.paddingRight = `${scrollbar}px`;
  }, []);

  const releaseScroll = useCallback(() => {
    if (!lock.current) return;
    const root = document.documentElement;
    root.style.overflow = lock.current.overflow;
    root.style.paddingRight = lock.current.paddingRight;
    lock.current = null;
  }, []);

  const beginExit = useCallback(
    (flapStart: number) => {
      update({ phase: 'exit' });
      if (reducedMotion()) {
        releaseScroll();
        update({ phase: 'exit', mounted: false });
        return;
      }
      const into = Math.max(0, performance.now() - flapStart) % FLAP_MS;
      const wait = into < NEUTRAL_BAND_MS ? NEUTRAL_BAND_MS - into : FLAP_MS - into;
      track(
        window.setTimeout(() => {
          releaseScroll();
          update({ phase: 'exit', mounted: false });
        }, wait + EXIT_MS),
      );
    },
    [releaseScroll, track, update],
  );

  useEffect(() => {
    clearTimers();
    lockScroll();

    const initial = isFirst.current;
    isFirst.current = false;
    const minMs = initial ? MIN_INITIAL_MS : MIN_NAV_MS;
    const flapStart = performance.now() + FLAP_DELAY_MS;

    let pageReady = false;
    const tryExit = () => {
      if (!pageReady) return;
      beginExit(flapStart);
    };

    if (document.readyState === 'complete') {
      pageReady = true;
    } else {
      window.addEventListener('load', () => {
        pageReady = true;
        tryExit();
      }, { once: true });
    }

    track(window.setTimeout(tryExit, minMs));

    return () => {
      clearTimers();
      releaseScroll();
    };
  }, [pathname, beginExit, clearTimers, lockScroll, releaseScroll, track]);

  const showImmediately = useCallback(() => {
    clearTimers();
    lockScroll();
    update({ phase: 'enter', mounted: true });
  }, [clearTimers, lockScroll, update]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest('a');
      if (!anchor) return;
      if (anchor.target && anchor.target !== '_self') return;
      if (anchor.hasAttribute('download')) return;
      if ((anchor.getAttribute('rel') ?? '').includes('external')) return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || /^(mailto|tel|sms):/i.test(href)) return;

      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      showImmediately();
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [showImmediately]);

  if (!rendered) return null;

  return (
    <div
      className={`page-loader page-loader--${phase}`}
      aria-hidden="true"
      {...(phase === 'exit' ? {} : { inert: true as unknown as boolean })}
      data-phase={phase}
      style={
        {
          '--loader-flap': `${FLAP_MS}ms`,
          '--loader-flap-delay': `${FLAP_DELAY_MS}ms`,
          '--loader-settle': '300ms',
          '--loader-exit': `${EXIT_MS}ms`,
          '--loader-pivot-left': PIVOT_LEFT,
          '--loader-pivot-right': PIVOT_RIGHT,
        } as React.CSSProperties
      }
    >
      <svg className="page-loader__bird" viewBox={BAHL_BIRD_VIEWBOX} focusable="false" data-testid="bahl-loader-bird">
        <defs>
          <mask id="bahl-loader-body-mask">
            <rect x="0" y="0" width="200" height="200" fill="#fff" />
            <rect x="0" y="0" width={CORE_LEFT} height="200" fill="#000" />
            <rect x={CORE_RIGHT} y="0" width={200 - CORE_RIGHT} height="200" fill="#000" />
          </mask>
          <clipPath id="bahl-loader-wing-left">
            <rect x="0" y="0" width={WING_LEFT_EDGE} height="200" />
          </clipPath>
          <clipPath id="bahl-loader-wing-right">
            <rect x={WING_RIGHT_EDGE} y="0" width={200 - WING_RIGHT_EDGE} height="200" />
          </clipPath>
        </defs>

        <g className="page-loader__lift">
          <path className="page-loader__core" d={BAHL_BIRD_PATH} mask="url(#bahl-loader-body-mask)" fill="currentColor" />
          <g className="page-loader__wing page-loader__wing--left">
            <path d={BAHL_BIRD_PATH} clipPath="url(#bahl-loader-wing-left)" fill="currentColor" />
          </g>
          <g className="page-loader__wing page-loader__wing--right">
            <path d={BAHL_BIRD_PATH} clipPath="url(#bahl-loader-wing-right)" fill="currentColor" />
          </g>
        </g>
      </svg>
    </div>
  );
}
