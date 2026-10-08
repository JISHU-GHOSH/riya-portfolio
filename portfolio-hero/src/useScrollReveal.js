import { useEffect, useRef, useState } from 'react';

/**
 * useScrollReveal
 * 
 * Custom React hook leveraging IntersectionObserver to detect when elements
 * scroll into view and seamlessly apply active reveal classes.
 * 
 * @param {Object} [options]
 * @param {number} [options.threshold=0.15] - Intersection ratio before triggering reveal
 * @param {string} [options.rootMargin='0px 0px -50px 0px'] - Viewport margin offsets
 * @param {boolean} [options.once=true] - Whether to trigger only once
 * @param {string|null} [options.selector=null] - Optional child selector to reveal child elements individually
 * @returns {[React.RefObject, boolean]} Ref to attach to container/element, and visibility boolean
 */
export function useScrollReveal(options = {}) {
  const {
    threshold = 0.15,
    rootMargin = '0px 0px -50px 0px',
    once = true,
    selector = null,
  } = options;

  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      el.classList.add('is-revealed', 'active');
      if (selector) {
        el.querySelectorAll(selector).forEach((child) => {
          child.classList.add('is-revealed', 'active');
        });
      }
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed', 'active');
            if (entry.target === el) {
              setIsVisible(true);
            }
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            entry.target.classList.remove('is-revealed', 'active');
            if (entry.target === el) {
              setIsVisible(false);
            }
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (selector) {
      const targets = el.querySelectorAll(selector);
      if (targets.length > 0) {
        targets.forEach((target) => observer.observe(target));
      } else {
        observer.observe(el);
      }
    } else {
      observer.observe(el);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, once, selector]);

  return [elementRef, isVisible];
}

export default useScrollReveal;
