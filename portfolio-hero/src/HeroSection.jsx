import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Volume2, VolumeX, ArrowUpRight } from 'lucide-react';
import CharacterCanvas from './CharacterCanvas';
import ProjectsSection from './ProjectsSection';
import { playClick, playHover, toggleMute, isMuted } from './soundEffects';
import './HeroSection.css';

/**
 * HeroSection
 * 
 * Luxury editorial hero section featuring:
 * - Full-screen responsive CharacterCanvas tracking gaze
 * - Custom magnetic spring-physics trailing cursor
 * - Frosted glass top navigation pill with scroll spy and Web Audio toggle
 * - Bottom-left editorial identity card with curatorial statement and CTAs
 */
export default function HeroSection({
  onOpenContact,
  onOpenResume,
  children,
}) {
  const [activeSection, setActiveSection] = useState('hero');
  const [soundMuted, setSoundMuted] = useState(isMuted());
  const [isHovered, setIsHovered] = useState(false);
  const [isOffscreen, setIsOffscreen] = useState(true);

  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const mousePosRef = useRef({ x: -100, y: -100 });
  const dotPosRef = useRef({ x: -100, y: -100 });
  const ringPosRef = useRef({ x: -100, y: -100, vx: 0, vy: 0 });
  const lastHoverTargetRef = useRef(null);

  // 1. Spring-physics Custom Cursor Loop
  useEffect(() => {
    let animId;

    const handlePointerMove = (e) => {
      mousePosRef.current.x = e.clientX;
      mousePosRef.current.y = e.clientY;
      setIsOffscreen(false);
    };

    const handleMouseLeave = () => {
      setIsOffscreen(true);
      setIsHovered(false);
    };

    const handleMouseEnter = () => {
      setIsOffscreen(false);
    };

    const handleGlobalMouseOver = (e) => {
      const interactiveEl = e.target.closest(
        'a, button, [role="button"], input, textarea, select, .clickable, .frosted-pill, .btn-editorial, .work-card-media'
      );
      if (interactiveEl) {
        setIsHovered(true);
        if (lastHoverTargetRef.current !== interactiveEl) {
          lastHoverTargetRef.current = interactiveEl;
          playHover();
        }
      }
    };

    const handleGlobalMouseOut = (e) => {
      const interactiveEl = e.target.closest(
        'a, button, [role="button"], input, textarea, select, .clickable, .frosted-pill, .btn-editorial, .work-card-media'
      );
      if (interactiveEl && e.relatedTarget && !e.relatedTarget.closest(
        'a, button, [role="button"], input, textarea, select, .clickable, .frosted-pill, .btn-editorial, .work-card-media'
      )) {
        setIsHovered(false);
        lastHoverTargetRef.current = null;
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleGlobalMouseOver, { passive: true });
    document.addEventListener('mouseout', handleGlobalMouseOut, { passive: true });

    // Physics Animation Loop
    const springTick = () => {
      const mouse = mousePosRef.current;
      const dot = dotPosRef.current;
      const ring = ringPosRef.current;

      // Fast tracking for center dot
      dot.x += (mouse.x - dot.x) * 0.85;
      dot.y += (mouse.y - dot.y) * 0.85;

      // Spring physics for trailing ring
      const stiffness = 0.18;
      const damping = 0.72;
      const dx = mouse.x - ring.x;
      const dy = mouse.y - ring.y;
      ring.vx = (ring.vx + dx * stiffness) * damping;
      ring.vy = (ring.vy + dy * stiffness) * damping;
      ring.x += ring.vx;
      ring.y += ring.vy;

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0) translate(-50%, -50%)`;
      }
      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }

      animId = requestAnimationFrame(springTick);
    };

    animId = requestAnimationFrame(springTick);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleGlobalMouseOver);
      document.removeEventListener('mouseout', handleGlobalMouseOut);
    };
  }, []);

  // 2. Section Scroll Spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 220;
      const sectionIds = ['contact', 'practice', 'works', 'hero'];

      if (window.scrollY < 120) {
        setActiveSection('hero');
        return;
      }

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 3. Navigation link click handler
  const handleNavClick = useCallback((e, sectionId) => {
    e.preventDefault();
    playClick();
    setActiveSection(sectionId);

    if (sectionId === 'contact' && !document.getElementById('contact') && onOpenContact) {
      onOpenContact();
      return;
    }

    const targetEl = document.getElementById(sectionId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  }, [onOpenContact]);

  // 4. Sound mute toggle
  const handleToggleSound = useCallback(() => {
    const newMuteState = toggleMute();
    setSoundMuted(newMuteState);
  }, []);

  return (
    <div className="hero-root">
      {/* Magnetic spring-physics custom cursor */}
      <div
        ref={cursorDotRef}
        className={`cursor-dot ${isHovered ? 'cursor-hover' : ''} ${isOffscreen ? 'cursor-hidden' : ''}`}
        aria-hidden="true"
      />
      <div
        ref={cursorRingRef}
        className={`cursor-ring ${isHovered ? 'cursor-hover' : ''} ${isOffscreen ? 'cursor-hidden' : ''}`}
        aria-hidden="true"
      />

      {/* Full-screen Character Canvas Background */}
      <CharacterCanvas />

      {/* Frosted vignette gradient overlay for text readability & atmospheric depth */}
      <div className="hero-vignette" aria-hidden="true" />

      {/* Top-Center Frosted Glass Navigation Pill */}
      <header className="nav-pill-container">
        <nav className="nav-pill" role="navigation" aria-label="Main Navigation">
          <a
            href="#hero"
            className={`nav-link ${activeSection === 'hero' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'hero')}
          >
            Home
          </a>
          <a
            href="#works"
            className={`nav-link ${activeSection === 'works' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'works')}
          >
            Works
          </a>
          <a
            href="#practice"
            className={`nav-link ${activeSection === 'practice' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'practice')}
          >
            Practice
          </a>
          <a
            href="#contact"
            className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'contact')}
          >
            Contact
          </a>

          {/* Sound Toggle Button */}
          <button
            type="button"
            className={`nav-sound-btn ${soundMuted ? 'is-muted' : ''}`}
            onClick={handleToggleSound}
            title={soundMuted ? 'Unmute sound' : 'Mute sound'}
            aria-label={soundMuted ? 'Unmute sound' : 'Mute sound'}
          >
            {soundMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
        </nav>
      </header>

      {/* Main Hero Viewport Area */}
      <section id="hero" className="hero-viewport">
        {/* Bottom-Left Editorial Identity Card */}
        <div className="hero-text">
          <div className="hero-pretitle">STUDIO • RIYA</div>
          
          <h1 className="hero-title font-serif">Riya</h1>
          
          <p className="hero-subtitle">Visual Artist & Creative Director</p>
          
          <p className="hero-summary">
            Exploring form, light, and human perception across computational canvas and spatial environments.
          </p>

          <div className="hero-status">
            <span className="status-dot" aria-hidden="true" />
            <span>Available for select commissions & exhibitions • 2026</span>
          </div>

          <div className="hero-actions">
            <a
              href="#works"
              className="btn-editorial btn-primary"
              onClick={(e) => handleNavClick(e, 'works')}
            >
              Explore Works
            </a>
            
            <a
              href="#practice"
              className="btn-editorial btn-secondary"
              onClick={(e) => handleNavClick(e, 'practice')}
            >
              Artist Statement
            </a>

            <button
              type="button"
              className="btn-editorial btn-secondary"
              onClick={() => {
                playClick();
                onOpenContact?.();
              }}
            >
              Inquire <ArrowUpRight size={14} />
            </button>
          </div>
        </div>

        {/* Luxury Bottom-Right Scroll Indicator */}
        <a
          href="#works"
          className="scroll-indicator"
          aria-label="Scroll down to explore works"
          onClick={(e) => handleNavClick(e, 'works')}
        >
          <span>Explore Works</span>
          <span className="scroll-indicator-arrow" aria-hidden="true">↓</span>
        </a>
      </section>

      {/* Downstream Content Container with Frosted Glass Transparency */}
      <main className="content-wrapper">
        {children || <ProjectsSection onOpenContact={onOpenContact} />}
      </main>
    </div>
  );
}
