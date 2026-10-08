import { useEffect } from 'react';

/**
 * useScrollReveal — High-performance IntersectionObserver hook for
 * Apple/Linear-grade staggered entry reveal animations.
 *
 * Automatically unobserves elements once revealed to maintain 0 CPU overhead.
 * Respects 'prefers-reduced-motion' for accessibility.
 */
export default function useScrollReveal(containerRef, deps = []) {
  useEffect(() => {
    // If user prefers reduced motion, reveal everything immediately
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const root = containerRef?.current || document;
      const elements = root.querySelectorAll('.reveal-on-scroll');
      elements.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      const root = containerRef?.current || document;
      const elements = root.querySelectorAll('.reveal-on-scroll');
      elements.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.12,
      }
    );

    const root = containerRef?.current || document;
    const elements = root.querySelectorAll('.reveal-on-scroll:not(.is-revealed)');
    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export { useScrollReveal };

