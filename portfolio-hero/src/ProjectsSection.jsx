import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowUpRight, X, Sparkles, SlidersHorizontal, Eye } from 'lucide-react';
import ProjectMockup from './ProjectMockup';
import useScrollReveal from './useScrollReveal';
import { playClick, playHover, playOpen, playClose } from './soundEffects';
import './ProjectsSection.css';

/**
 * 4 Featured Masterworks curated for Riya
 */
export const FEATURED_WORKS = [
  {
    id: 'ethereal-resonance',
    title: 'Ethereal Resonance',
    year: '2026',
    category: 'Spatial Installations',
    medium: 'Multi-channel Spatial Light Array, Generative Laser Optics & Spatial Audio',
    dimensions: '14.2m × 8.5m × 4.2m Architectural Pavilion',
    duration: 'Continuous Generative Cycle (12-ch Audio)',
    summary: 'A monumental spatial installation investigating the liminal boundaries of physical architecture through synchronized volumetric laser planes, reactive harmonic sound fields, and oscillating chromatic light.',
    curatorialStatement: 'Presented as an architectural intervention, Ethereal Resonance challenges the observer’s sensory thresholds. Volumetric light planes slice through particulate-dense atmosphere, creating fluid, non-solid partitions that respond in real time to acoustic pressure and physical presence. The spectator is invited to traverse immaterial partitions, experiencing light as an elastic, tangible volume rather than a passive illumination.',
    specifications: {
      medium: 'Custom 24-diode Volumetric Laser Scanners, Haze Dispersion, Spatialized 12-channel Resonant Sound',
      resolution: 'Real-time Generative Vector Path Synthesis (60 FPS)',
      soundDesign: 'Custom Sub-harmonic Sine & Granular Strings (432Hz tuning)',
      year: '2026',
      firstExhibited: 'Collateral Pavilion, Venice Architecture Biennale 2026',
      edition: 'Unique Architectural Commission + 1 Artist Proof',
    },
  },
  {
    id: 'chromata',
    title: 'Chromata',
    year: '2025',
    category: 'Generative Systems',
    medium: 'Algorithmic Fluid Dynamics & High-Resolution LED Kinetic Canvas',
    dimensions: '6.0m × 3.4m Frameless Curved Surface',
    duration: 'Non-repeating Autonomous Simulation',
    summary: 'An autonomous generative system modeling chromatic pigment viscosity and thermal turbulence, generating unrepeatable tactile compositions of liquid color and radiant tension.',
    curatorialStatement: 'Chromata is an inquiry into pigment as an organic, living ecosystem. Using custom Navier-Stokes fluid simulations modified with simulated thermal friction and surface tension, the digital canvas mimics the behavior of rare mineral pigments suspended in slow-drying oils. The result is an infinite, non-repeating tapestry where colors collide, bleed, and re-crystallize across hours of hypnotic progression.',
    specifications: {
      medium: 'Custom GLSL Navier-Stokes Fluid Solver, Uncompressed 10-bit Color Pipeline',
      resolution: '7680 × 4320 (Native 8K UHD)',
      soundDesign: 'Microsound granular textures & organic hydrophone captures',
      year: '2025',
      firstExhibited: 'Mori Art Museum, Tokyo — "Calculated Nature" Group Exhibition',
      edition: 'Edition of 3 + 1 AP',
    },
  },
  {
    id: 'flora-obscura',
    title: 'Flora Obscura',
    year: '2025',
    category: 'Generative Systems',
    medium: 'Procedural Botanical Morphometry & Bioluminescent Particle Simulation',
    dimensions: '4.8m × 2.7m Dual Ultra-Stretch Display',
    duration: 'Circadian-Synced Procedural Simulation',
    summary: 'A surreal exploration of nocturnal flora, procedural growth structures, and bioluminescent spore dynamics reacting to local atmospheric metrics and circadian rhythms.',
    curatorialStatement: 'Flora Obscura conceives an alternative evolutionary trajectory where plant biology communicates through photon emission rather than photosynthetic consumption. Algorithmic L-systems generate skeletal botanical structures that open and bloom in response to ambient barometric shifts and circadian daylight cycles. Spores of bioluminescent light drift between digital branches, questioning our relationship with fragile nocturnal ecosystems.',
    specifications: {
      medium: 'Procedural Differential Growth Algorithms, GPU Particle Simulator (2.4M particles)',
      resolution: '5120 × 2880 (5K Dual-Channel Display)',
      soundDesign: 'Generative field recordings, acoustic cello, and bio-frequency sonification',
      year: '2025',
      firstExhibited: 'Serpentine North Gallery, London — Solo Showcase',
      edition: 'Edition of 5 + 2 AP',
    },
  },
  {
    id: 'metamorphosis',
    title: 'Metamorphosis',
    year: '2024',
    category: '3D Studies',
    medium: 'Parametric Kinetic Sculpture, Anodized Titanium & Holographic Mesh',
    dimensions: '220cm × 160cm × 110cm Suspended Kinetic Assembly',
    duration: 'Mechanical Loop & Real-Time Light Reflection',
    summary: 'A kinetic parametric lattice study exploring topological deformation, iridescent metallic materiality, and the hypnotic transition between crystalline order and fluid chaos.',
    curatorialStatement: 'Metamorphosis investigates the geometry of transformation. Anchored by a suspended Möbius lattice constructed from micro-machined anodized titanium ribbons, the piece physically flexes and torques via silent precision stepper motors. As light strikes the interference-coated titanium surfaces, spectra of iridescent magenta, gold, and deep peacock blue shimmer across gallery walls, capturing the fragile instant between structure and dissolution.',
    specifications: {
      medium: 'Anodized Aerospace Titanium, Micro-Stepper Actuators, Custom Microcontroller Rig',
      resolution: 'Physical Kinetic Sculpture with Optical Light Distortion',
      soundDesign: 'Acoustic resonance of metallic chimes & low-frequency drone',
      year: '2024',
      firstExhibited: 'Basel Art Center, Switzerland — Curated Sculpture Selection',
      edition: 'Unique Kinetic Object',
    },
  },
];

const FILTER_CATEGORIES = [
  'All',
  'Spatial Installations',
  'Generative Systems',
  '3D Studies',
];

/**
 * ProjectsSection
 * 
 * Curated exhibition showcase featuring filter controls, high-res generative
 * artwork previews, and an interactive curatorial detail lightbox.
 */
export default function ProjectsSection({ onOpenContact }) {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [activeArtwork, setActiveArtwork] = useState(null);
  const sectionRef = useRef(null);

  // Filtered artworks
  const displayedWorks = selectedFilter === 'All'
    ? FEATURED_WORKS
    : FEATURED_WORKS.filter((work) => work.category === selectedFilter);

  // High-performance scroll reveal observer
  useScrollReveal(sectionRef, [displayedWorks]);

  // Close lightbox handler
  const handleCloseLightbox = useCallback(() => {
    playClose();
    setActiveArtwork(null);
  }, []);

  // Open lightbox handler
  const handleOpenArtwork = useCallback((work) => {
    playOpen();
    setActiveArtwork(work);
  }, []);

  // Keyboard navigation & body lock for modal
  useEffect(() => {
    if (!activeArtwork) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleCloseLightbox();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeArtwork, handleCloseLightbox]);

  return (
    <section id="works" className="works-section" ref={sectionRef}>
      <div className="works-container">
        {/* Editorial Section Header */}
        <header className="works-header reveal-on-scroll">
          <div className="works-label-row">
            <span className="works-label">SELECTED WORKS</span>
            <span className="works-label-line" />
          </div>

          <h2 className="works-title font-serif">Exhibitions & Studies</h2>

          <p className="works-subtitle">
            Curated series spanning generative installations, light sculpture, and chromatic materiality.
          </p>
        </header>

        {/* Filter Navigation Pills */}
        <div className="works-filters reveal-on-scroll" style={{ '--reveal-delay': '120ms' }} role="tablist" aria-label="Artwork categories">
          {FILTER_CATEGORIES.map((cat) => {
            const count = cat === 'All'
              ? FEATURED_WORKS.length
              : FEATURED_WORKS.filter((w) => w.category === cat).length;
            const isActive = selectedFilter === cat;

            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`filter-pill-btn ${isActive ? 'active' : ''}`}
                onClick={() => {
                  playClick();
                  setSelectedFilter(cat);
                }}
                onMouseEnter={() => playHover()}
              >
                <span>{cat}</span>
                <span className="filter-count">({count})</span>
              </button>
            );
          })}
        </div>

        {/* 4 Exhibition Cards in Grid */}
        <div className="works-grid">
          {displayedWorks.map((work, idx) => (
            <article
              key={work.id}
              className="work-card reveal-on-scroll"
              style={{ '--reveal-delay': `${idx * 130 + 160}ms` }}
              onMouseEnter={() => playHover()}
            >
              {/* Top Artwork Media Frame */}
              <div
                className="work-card-media"
                onClick={() => handleOpenArtwork(work)}
                title={`Examine ${work.title}`}
              >
                <ProjectMockup id={work.id} title={work.title} />
                
                <div className="work-card-media-overlay">
                  <span className="work-overlay-btn">
                    <Eye size={15} /> Examine Exhibition Details
                  </span>
                </div>
              </div>

              {/* Editorial Card Body */}
              <div className="work-card-body">
                <div className="work-card-meta-top">
                  <span className="work-category-badge">{work.category}</span>
                  <span className="work-year-badge">{work.year}</span>
                </div>

                <h3 className="work-card-title">{work.title}</h3>

                <div className="work-card-specs">
                  <div className="work-spec-item">
                    <span className="work-spec-label">Medium:</span>
                    <span>{work.medium}</span>
                  </div>
                  <div className="work-spec-item">
                    <span className="work-spec-label">Scale:</span>
                    <span>{work.dimensions}</span>
                  </div>
                </div>

                <p className="work-card-summary">{work.summary}</p>

                <div className="work-card-footer">
                  <span className="work-dimensions-tag">{work.duration}</span>

                  <button
                    type="button"
                    className="btn-view-artwork"
                    onClick={() => handleOpenArtwork(work)}
                  >
                    <span>View Artwork</span>
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Curatorial Lightbox / Artwork Detail Modal */}
      {activeArtwork && (
        <div
          className="curatorial-lightbox-backdrop"
          onClick={handleCloseLightbox}
          role="presentation"
        >
          <div
            className="curatorial-lightbox-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lightbox-title"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Modal Button */}
            <button
              type="button"
              className="lightbox-close-btn"
              onClick={handleCloseLightbox}
              aria-label="Close artwork details"
            >
              <X size={18} />
            </button>

            {/* Left Column: Visual Artwork Presentation */}
            <div className="lightbox-media-stage">
              <div className="lightbox-mockup-container">
                <ProjectMockup
                  id={activeArtwork.id}
                  title={activeArtwork.title}
                  isLightbox
                />
              </div>

              <div className="lightbox-caption-card">
                <span className="lightbox-caption-title">ARCHIVAL RECORD</span>
                <p className="lightbox-caption-text">
                  Generative documentation rendered from real-time parameters. High-resolution archival captures and spatial schematics available upon curatorial request.
                </p>
              </div>
            </div>

            {/* Right Column: Curatorial Statement & Technical Specifications */}
            <div className="lightbox-editorial-content">
              <div className="lightbox-header-tags">
                <span className="lightbox-category-tag">{activeArtwork.category}</span>
                <span className="lightbox-year-tag">• {activeArtwork.year}</span>
              </div>

              <h2 id="lightbox-title" className="lightbox-title font-serif">
                {activeArtwork.title}
              </h2>

              {/* Curatorial Statement */}
              <div className="lightbox-statement-block">
                <span className="lightbox-section-label">CURATORIAL STATEMENT</span>
                <p className="lightbox-statement">
                  {activeArtwork.curatorialStatement}
                </p>
              </div>

              {/* Technical Specifications */}
              <div className="lightbox-statement-block">
                <span className="lightbox-section-label">TECHNICAL SPECIFICATIONS</span>
                <div className="lightbox-specs-table">
                  <div className="lightbox-spec-row">
                    <span className="lightbox-spec-name">Medium</span>
                    <span className="lightbox-spec-val">{activeArtwork.specifications.medium}</span>
                  </div>
                  <div className="lightbox-spec-row">
                    <span className="lightbox-spec-name">Resolution</span>
                    <span className="lightbox-spec-val">{activeArtwork.specifications.resolution}</span>
                  </div>
                  <div className="lightbox-spec-row">
                    <span className="lightbox-spec-name">Sound Design</span>
                    <span className="lightbox-spec-val">{activeArtwork.specifications.soundDesign}</span>
                  </div>
                  <div className="lightbox-spec-row">
                    <span className="lightbox-spec-name">First Exhibited</span>
                    <span className="lightbox-spec-val">{activeArtwork.specifications.firstExhibited}</span>
                  </div>
                  <div className="lightbox-spec-row">
                    <span className="lightbox-spec-name">Edition</span>
                    <span className="lightbox-spec-val">{activeArtwork.specifications.edition}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="lightbox-actions">
                <button
                  type="button"
                  className="btn-editorial btn-primary"
                  onClick={() => {
                    playClick();
                    handleCloseLightbox();
                    if (onOpenContact) {
                      onOpenContact(activeArtwork);
                    }
                  }}
                >
                  <span>Inquire About Piece</span>
                  <ArrowUpRight size={15} />
                </button>

                <button
                  type="button"
                  className="btn-editorial btn-secondary"
                  onClick={handleCloseLightbox}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
