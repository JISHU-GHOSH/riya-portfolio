import React, { useEffect, useRef, useCallback } from 'react';
import { 
  X, 
  Printer, 
  Sparkles 
} from 'lucide-react';
import { playClick, playHover, playOpen, playClose } from './soundEffects';
import './ResumeModal.css';

/**
 * Detailed Exhibition CV Data Structure
 */
export const CV_DATA = {
  artist: 'Riya',
  descriptor: 'Visual Artist, Creative Director & Spatial Scenographer',
  contact: {
    email: 'studio@riya-art.com',
    web: 'www.riya-art.com',
    studios: 'London (Shoreditch) • Tokyo (Roppongi) • New York (Chelsea)',
  },
  statement:
    'Riya (b. 1993, London & Tokyo) operates at the intersection of architectural scale, optical physics, and generative computation. Her practice questions sensory thresholds through synchronized volumetric laser planes, autonomous Navier-Stokes fluid simulations, and spatial acoustics, dissolving solid architectural boundaries into intangible light planes.',
  
  education: [
    {
      degree: 'MA Information Experience Design (Distinction)',
      institution: 'Royal College of Art',
      location: 'London, UK',
      year: '2021–2023',
      notes: 'Thesis: "Volumetric Thresholds: Spatial Light as Architectural Partition". Awarded Dean’s Prize.',
    },
    {
      degree: 'BA (Hons) Fine Art (First Class Honours)',
      institution: 'Central Saint Martins, University of the Arts London',
      location: 'London, UK',
      year: '2017–2020',
      notes: 'Focus on kinetic sculpture, optical physics, and procedural programming.',
    },
  ],

  soloExhibitions: [
    {
      year: '2026',
      title: 'Luminous Thresholds',
      venue: 'Mori Art Museum',
      location: 'Tokyo, Japan',
      curator: 'Curated by Kenjiro Hosaka',
      description: 'Comprehensive institutional solo presentation across three monumental galleries, featuring interactive volumetric laser enclosures and autonomous fluid architectures.',
    },
    {
      year: '2025',
      title: 'Resonant Geometries',
      venue: 'White Cube Mason’s Yard (Project Space)',
      location: 'London, UK',
      curator: 'Curated by Katherine Finlay',
      description: 'Site-specific light architectures exploring micro-particulate haze dispersion and directional spatial sound.',
    },
    {
      year: '2024',
      title: 'Ephemeral Matter',
      venue: 'Palais de Tokyo (Modules)',
      location: 'Paris, France',
      curator: 'Curated by François Quintin',
      description: 'Sensory deprivation immersion chamber with synchronized crystalline computational light bursts.',
    },
    {
      year: '2024',
      title: 'Subsurface Dispersion',
      venue: 'Gallery Koyanagi',
      location: 'Tokyo, Japan',
      curator: 'Solo presentation',
      description: 'Tactile digital lithographs and procedural fluid sculptures examining mineral formations.',
    },
  ],

  groupExhibitions: [
    {
      year: '2025',
      title: 'Chromatics of Memory',
      biennale: '61st Venice Biennale (Collateral Exhibition)',
      venue: 'Palazzo Gervasuti',
      location: 'Venice, Italy',
      description: 'Historical palazzo intervention conversing with canal water reflections via real-time algorithmic fluid optics.',
    },
    {
      year: '2025',
      title: 'Synthetic Biomes',
      venue: 'Serpentine Galleries',
      location: 'London, UK',
      description: 'Curated survey of post-natural biological simulations and circadian-responsive procedural forms.',
    },
    {
      year: '2024',
      title: 'The Computational Sublime',
      venue: 'ZKM | Center for Art and Media',
      location: 'Karlsruhe, Germany',
      description: 'Pioneering exhibition of real-time GPU-based generative systems and non-linear aesthetics.',
    },
    {
      year: '2023',
      title: 'Form in Suspension',
      venue: 'New Museum',
      location: 'New York, USA',
      description: 'Debut US institutional commission featuring monolithic vertical LED glass columns.',
    },
    {
      year: '2023',
      title: 'Liminal States',
      venue: 'Tate Modern (The Tanks)',
      location: 'London, UK',
      description: 'Four-channel spatial acoustic intervention and volumetric haze sculptures.',
    },
  ],

  institutionalCollections: [
    {
      institution: 'Centre Pompidou Digital Art Collection',
      location: 'Paris, France',
      works: 'Chromata (Generative Dynamic Edition #1/3, 2025)',
    },
    {
      institution: 'Mori Art Museum Special Archive',
      location: 'Tokyo, Japan',
      works: 'Study for Volumetric Diffraction (Light Blueprint Archive, 2026)',
    },
    {
      institution: 'ZKM Media Museum Permanent Archive',
      location: 'Karlsruhe, Germany',
      works: 'Fluid Morphometry Solvers (Algorithmic Software Score, 2024)',
    },
    {
      institution: 'Selected Private Collections',
      location: 'London, Zurich, Kyoto & New York',
      works: 'Various unique architectural editions and kinetic light sculptures',
    },
  ],

  honorsAndResidencies: [
    {
      year: '2025',
      title: 'Prix Ars Electronica — Honorary Mention',
      category: 'Computer Animation & Digital Form',
      institution: 'Ars Electronica Center, Linz, Austria',
    },
    {
      year: '2024',
      title: 'CERN Arts Guest Artist Residency',
      category: 'Scientific Art Fellowship (3-month residency)',
      institution: 'European Organization for Nuclear Research, Geneva, Switzerland',
    },
    {
      year: '2023',
      title: 'RCA Studio Fellowship Grant',
      category: 'Postgraduate Fine Art Award',
      institution: 'Royal College of Art, London, UK',
    },
    {
      year: '2022',
      title: 'Lumen Prize for Art and Technology',
      category: 'Finalist — 3D/Interactive Award',
      institution: 'The Lumen Arts Projects, UK',
    },
  ],

  selectedPress: [
    {
      publication: 'Frieze Magazine',
      title: '“Sculpting the Ineffable: Riya’s Volumetric Architecture”',
      author: 'Interview by Arthur Chen',
      issue: 'Issue 241, Autumn 2025',
    },
    {
      publication: 'Wallpaper*',
      title: '“Future Visionaries: The New Wave of Computational Scenography”',
      author: 'Profile by Harriet Thorpe',
      issue: 'October 2025 Edition',
    },
    {
      publication: 'Artforum International',
      title: '“Review: Riya at Mori Art Museum, Tokyo”',
      author: 'Critical Review by Hiroshi Sugimoto',
      issue: 'Vol. 64, No. 6, 2026',
    },
    {
      publication: 'ELEPHANT Magazine',
      title: '“Studio Visit: Inside Riya’s East London Light Laboratory”',
      author: 'Photography & Essay by Louise Benson',
      issue: 'Spring 2024',
    },
    {
      publication: 'The Art Newspaper',
      title: '“Venice Collateral Highlights: Light, Haze, and Acoustic Palazzos”',
      author: 'Feature by Jane Morris',
      issue: 'May 2025',
    },
  ],
};

/**
 * ResumeModal
 * 
 * Elegant curatorial CV modal presenting comprehensive exhibition history,
 * institutional collections, residencies, and press.
 * Supports window.print() with clean high-contrast print media styling.
 */
export default function ResumeModal({ isOpen, onClose }) {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Close handler with sound
  const handleClose = useCallback(() => {
    playClose();
    onClose?.();
  }, [onClose]);

  // Handle window.print with sound
  const handlePrint = useCallback(() => {
    playClick();
    window.print();
  }, []);

  // Keyboard navigation, focus trap, and body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    playOpen();
    previousActiveElement.current = document.activeElement;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Auto-focus container
    const focusTimer = setTimeout(() => {
      if (modalRef.current) {
        modalRef.current.focus();
      }
    }, 50);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const focusable = Array.from(focusableElements).filter(
          (el) => !el.hasAttribute('disabled') && el.offsetParent !== null
        );

        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);

      if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, handleClose]);

  // Backdrop click handler
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="resume-modal-overlay" 
      onClick={handleBackdropClick} 
      role="presentation"
    >
      <div
        ref={modalRef}
        className="resume-modal-dialog glass-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="resume-modal-title"
        tabIndex={-1}
      >
        {/* Modal Top Control Bar (Hidden on print) */}
        <div className="resume-controls-bar">
          <div className="resume-status-badge font-cinzel">
            <Sparkles size={13} className="text-olive" />
            <span>Official Curatorial Dossier • 2026</span>
          </div>

          <div className="resume-actions-group">
            <button
              type="button"
              className="btn-print-cv"
              onClick={handlePrint}
              onMouseEnter={playHover}
              title="Print CV or save as PDF"
              aria-label="Print or save Curriculum Vitae as PDF"
            >
              <Printer size={15} />
              <span>Print / Save PDF</span>
            </button>

            <button
              type="button"
              className="btn-resume-close"
              onClick={handleClose}
              onMouseEnter={playHover}
              aria-label="Close Curriculum Vitae"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable CV Document Content */}
        <article className="cv-document" id="cv-printable-area">
          {/* Header */}
          <header className="cv-header">
            <div className="cv-title-block">
              <h1 id="resume-modal-title" className="cv-artist-name font-serif">
                {CV_DATA.artist}
              </h1>
              <div className="cv-artist-title font-cinzel">
                {CV_DATA.descriptor}
              </div>
            </div>

            <div className="cv-contact-meta">
              <div className="meta-line">
                <strong>Studios:</strong> {CV_DATA.contact.studios}
              </div>
              <div className="meta-line">
                <strong>Mail:</strong> {CV_DATA.contact.email} &nbsp;•&nbsp; <strong>Web:</strong> {CV_DATA.contact.web}
              </div>
            </div>
          </header>

          <hr className="cv-divider" />

          {/* Statement */}
          <section className="cv-section">
            <h2 className="cv-section-title font-cinzel">Artist Statement & Practice</h2>
            <p className="cv-statement-text font-serif">
              {CV_DATA.statement}
            </p>
          </section>

          {/* Education */}
          <section className="cv-section">
            <h2 className="cv-section-title font-cinzel">Education</h2>
            <div className="cv-entries-list">
              {CV_DATA.education.map((edu, idx) => (
                <div key={idx} className="cv-entry">
                  <div className="cv-entry-head">
                    <span className="cv-entry-title"><strong>{edu.degree}</strong></span>
                    <span className="cv-entry-year">{edu.year}</span>
                  </div>
                  <div className="cv-entry-sub">{edu.institution}, {edu.location}</div>
                  <div className="cv-entry-notes">{edu.notes}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Solo Exhibitions */}
          <section className="cv-section">
            <h2 className="cv-section-title font-cinzel">Solo Exhibitions (2024–2026)</h2>
            <div className="cv-entries-list">
              {CV_DATA.soloExhibitions.map((item, idx) => (
                <div key={idx} className="cv-entry">
                  <div className="cv-entry-head">
                    <span className="cv-entry-title">
                      <em>{item.title}</em> — {item.venue}
                    </span>
                    <span className="cv-entry-year">{item.year}</span>
                  </div>
                  <div className="cv-entry-sub">{item.location} • {item.curator}</div>
                  <p className="cv-entry-desc">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Group Exhibitions & Biennales */}
          <section className="cv-section">
            <h2 className="cv-section-title font-cinzel">Selected Group Exhibitions & Biennales (2023–2025)</h2>
            <div className="cv-entries-list">
              {CV_DATA.groupExhibitions.map((item, idx) => (
                <div key={idx} className="cv-entry">
                  <div className="cv-entry-head">
                    <span className="cv-entry-title">
                      <em>{item.title}</em> — {item.venue}
                    </span>
                    <span className="cv-entry-year">{item.year}</span>
                  </div>
                  <div className="cv-entry-sub">
                    {item.location} {item.biennale ? `• ${item.biennale}` : ''}
                  </div>
                  <p className="cv-entry-desc">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Institutional Collections */}
          <section className="cv-section">
            <h2 className="cv-section-title font-cinzel">Institutional Collections & Archives</h2>
            <div className="cv-entries-list">
              {CV_DATA.institutionalCollections.map((col, idx) => (
                <div key={idx} className="cv-entry">
                  <div className="cv-entry-head">
                    <span className="cv-entry-title"><strong>{col.institution}</strong></span>
                    <span className="cv-entry-year">{col.location}</span>
                  </div>
                  <div className="cv-entry-notes">{col.works}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Residencies, Honors & Grants */}
          <section className="cv-section">
            <h2 className="cv-section-title font-cinzel">Residencies, Honors & Distinctions</h2>
            <div className="cv-entries-list">
              {CV_DATA.honorsAndResidencies.map((honor, idx) => (
                <div key={idx} className="cv-entry">
                  <div className="cv-entry-head">
                    <span className="cv-entry-title"><strong>{honor.title}</strong></span>
                    <span className="cv-entry-year">{honor.year}</span>
                  </div>
                  <div className="cv-entry-sub">{honor.institution}</div>
                  <div className="cv-entry-notes">{honor.category}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Selected Press & Monograph Features */}
          <section className="cv-section">
            <h2 className="cv-section-title font-cinzel">Selected Press & Publications</h2>
            <div className="cv-entries-list">
              {CV_DATA.selectedPress.map((press, idx) => (
                <div key={idx} className="cv-entry">
                  <div className="cv-entry-head">
                    <span className="cv-entry-title">
                      <strong>{press.publication}</strong>: {press.title}
                    </span>
                    <span className="cv-entry-year">{press.issue}</span>
                  </div>
                  <div className="cv-entry-notes">{press.author}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Colophon */}
          <footer className="cv-footer">
            <div className="cv-footer-colophon">
              Curriculum Vitae updated Autumn 2026 • Studio Riya London & Tokyo • All inquiries via studio@riya-art.com
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}
