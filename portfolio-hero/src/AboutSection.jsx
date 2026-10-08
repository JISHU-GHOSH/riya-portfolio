import React from 'react';
import { 
  ArrowUpRight, 
  FileText, 
  Sparkles, 
  Award, 
  MapPin, 
  Calendar, 
  Layers, 
  Compass 
} from 'lucide-react';
import { useScrollReveal } from './useScrollReveal';
import { playClick, playHover } from './soundEffects';
import './AboutSection.css';

/**
 * Core Artistic Disciplines
 */
export const ARTISTIC_DISCIPLINES = [
  {
    id: 'spatial-installations',
    number: '01',
    title: 'Spatial Installations & Light Architectures',
    tagline: 'Monumental Site-Specific Environments',
    summary:
      'Architectural scale pavilions sculpting space through precision laser diffraction, volumetric haze, and spatialized multichannel acoustics. Physical boundaries dissolve into intangible light planes.',
    medium: 'Volumetric Laser Arrays • Atmospheric Haze • Spatial Audio',
    tags: ['Architectural Intervention', 'Volumetric Optics', 'Resonant Light'],
  },
  {
    id: 'generative-systems',
    number: '02',
    title: 'Generative Systems & Computational Fluid Form',
    tagline: 'Autonomous Non-Repeating Natural Algorithms',
    summary:
      'Autonomous systems modeling Navier-Stokes fluid turbulence, thermal dispersion, and botanical morphometry. Code behaves as organic living matter rather than static computation.',
    medium: 'Real-time GLSL • Custom Fluid Solvers • Algorithmic Ecology',
    tags: ['Fluid Dynamics', 'Emergent Complexity', '10-bit Color Synthesis'],
  },
  {
    id: 'digital-sculpture',
    number: '03',
    title: '3D Materiality & Digital Sculpture',
    tagline: 'Tactile Optics & Mineral Formations',
    summary:
      'Sculptural digital forms examining micro-topographical light scattering, sub-surface chromatic diffusion, and the tactile tension between synthetic geometry and natural mineral formations.',
    medium: 'Procedural Geometry • Subsurface Light Refraction • Organic Shaders',
    tags: ['Mineral Topography', 'Tactile Shading', 'Digital Lithography'],
  },
  {
    id: 'creative-direction',
    number: '04',
    title: 'Creative Direction & Spatial Scenography',
    tagline: 'Curatorial Dramaturgy & Spatial Ephemera',
    summary:
      'Holistic curatorial narratives and immersive stage scenography for international biennales, cultural institutions, and collaborative avant-garde spatial performances.',
    medium: 'Spatial Dramaturgy • Curatorial Scenography • Kinetic Direction',
    tags: ['Curatorial Direction', 'Stage Architecture', 'Liminal Experience'],
  },
];

/**
 * Curated Exhibition History (2023–2026)
 */
export const EXHIBITION_HISTORY = [
  {
    year: '2026',
    title: 'Luminous Thresholds',
    role: 'Solo Exhibition',
    institution: 'Mori Art Museum',
    location: 'Tokyo, Japan',
    description:
      'A comprehensive institutional solo presentation occupying three monumental galleries, featuring interactive volumetric laser enclosures and autonomous fluid architectures.',
    badge: 'Solo Exhibition',
  },
  {
    year: '2025',
    title: 'Chromatics of Memory',
    role: 'Biennale Collateral Exhibition',
    institution: 'Fondazione Gervasuti / Venice Biennale',
    location: 'Venice, Italy',
    description:
      'Site-specific historical palazzo intervention conversing with Venetian canal reflections through real-time algorithmic fluid optics and sub-harmonic acoustic frequencies.',
    badge: 'Biennale Collateral',
  },
  {
    year: '2025',
    title: 'Synthetic Biomes',
    role: 'Curated Group Exhibition',
    institution: 'Serpentine Galleries',
    location: 'London, UK',
    description:
      'Curated examination of post-natural botanical organisms and circadian-responsive procedural simulations questioning synthetic biodiversity.',
    badge: 'Group Exhibition',
  },
  {
    year: '2024',
    title: 'Ephemeral Matter',
    role: 'Institutional Feature',
    institution: 'Palais de Tokyo',
    location: 'Paris, France',
    description:
      'Immersion chamber investigating sensory deprivation and sudden bursts of crystalline computational light synchronized with ultrasonic directional speakers.',
    badge: 'Museum Feature',
  },
  {
    year: '2023',
    title: 'Form in Suspension',
    role: 'Commission Presentation',
    institution: 'New Museum',
    location: 'New York, USA',
    description:
      'Debut US institutional commission examining the weight of digital artifacts through custom monolithic vertical LED glass columns.',
    badge: 'Commission',
  },
];

/**
 * Honors & Residencies
 */
export const HONORS_RESIDENCIES = [
  {
    title: 'Prix Ars Electronica — Honorary Mention',
    category: 'Computer Animation & Digital Form',
    year: '2025',
    institution: 'Ars Electronica Center, Linz',
    description:
      'Recognized for exceptional contribution to computational aesthetics and organic emergent systems.',
  },
  {
    title: 'CERN Arts Guest Artist Residency',
    category: 'Scientific Art Fellowship',
    year: '2024',
    institution: 'European Organization for Nuclear Research, Geneva',
    description:
      'Three-month studio residency researching subatomic particle collision trajectories and translating high-energy physics into volumetric light architectures.',
  },
  {
    title: 'RCA London Studio Grant',
    category: 'Fine Arts Fellowship',
    year: '2023',
    institution: 'Royal College of Art, London',
    description:
      'Postgraduate fellowship grant for innovative developments in physical-digital hybrid scenography and optical installations.',
  },
];

/**
 * AboutSection (Practice & Philosophy)
 * 
 * Editorial section detailing Riya's artistic statement, disciplines,
 * curated exhibition timeline, and international honors.
 */
export default function AboutSection({ onOpenResume, onOpenContact }) {
  const [sectionRef] = useScrollReveal({
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
    selector: '.reveal-item',
  });

  return (
    <section id="practice" ref={sectionRef} className="practice-section" aria-label="Practice and Philosophy">
      <div className="practice-container">
        
        {/* 1. Editorial Section Header */}
        <header className="practice-header reveal-item">
          <div className="practice-label-row">
            <span className="practice-label">PRACTICE & PHILOSOPHY</span>
            <span className="practice-label-line" aria-hidden="true" />
            <span className="practice-sublabel">Artist Statement</span>
          </div>

          <h2 className="practice-title font-serif">
            Sensory thresholds, light architectures & digital materiality.
          </h2>

          <p className="practice-lead">
            Interrogating the fragile boundary between synthetic computation and tangible reality through responsive light, algorithmic fluids, and spatial presence.
          </p>
        </header>

        {/* 2. Curatorial Statement & Philosophical Pillars */}
        <div className="practice-statement-grid">
          <article className="practice-statement-text reveal-item">
            <h3 className="statement-subhead font-cinzel">Curatorial Statement</h3>
            
            <p className="statement-paragraph">
              Riya’s artistic practice operates at the intersection of architectural scale, optical physics, and generative computation. Rather than approaching technology as an instrument of sterile reproduction, she treats algorithmic code as a living, viscous medium—one that breathes, reacts, and dissolves like organic pigment or mineral sediment.
            </p>

            <p className="statement-paragraph">
              Central to her inquiry is how light can exist not merely as illumination, but as an elastic structural volume. By sculpting atmospheres with synchronized volumetric lasers, micro-particulate haze, and multi-channel resonant acoustics, her installations subvert ordinary spatial perception, turning ephemeral digital events into unforgettable tactile encounters.
            </p>

            <p className="statement-paragraph">
              Her works invite the spectator to slow down, traverse immaterial partitions, and inhabit a state of contemplative wonder. In an era dominated by hyper-accelerated screens, her environments offer refuge in slow, hypnotic metamorphosis—anchoring code back into human sensoria.
            </p>

            <div className="statement-cta-row">
              <button
                type="button"
                className="btn-editorial btn-primary"
                onClick={() => {
                  playClick();
                  onOpenResume?.();
                }}
                onMouseEnter={playHover}
              >
                <FileText size={16} />
                <span>Exhibition CV</span>
              </button>

              <button
                type="button"
                className="btn-editorial btn-secondary"
                onClick={() => {
                  playClick();
                  onOpenContact?.();
                }}
                onMouseEnter={playHover}
              >
                <span>Studio Inquiry</span>
                <ArrowUpRight size={15} />
              </button>
            </div>
          </article>

          {/* Right Column: Pull Quote & Core Values */}
          <aside className="practice-pullquote-panel reveal-item">
            <div className="pullquote-card glass-panel">
              <div className="pullquote-symbol font-serif" aria-hidden="true">“</div>
              <blockquote className="pullquote-body font-serif">
                Light is not merely that which makes things visible; it is an elastic, architectural volume that reorganizes our relationship with time and memory.
              </blockquote>
              <div className="pullquote-attribution">
                <span className="attribution-name">Riya</span>
                <span className="attribution-title">Studio Monograph • Tokyo, 2026</span>
              </div>
            </div>

            <div className="philosophy-tags-card glass-card">
              <div className="philosophy-title-row">
                <Sparkles size={16} className="text-olive" />
                <span className="philosophy-title font-cinzel">Inquiry Principles</span>
              </div>
              <ul className="philosophy-list">
                <li>
                  <strong>Viscous Materiality:</strong> Treating computational shaders and pixels with the tactile weight of raw oil pigment and stone.
                </li>
                <li>
                  <strong>Volumetric Architecture:</strong> Dissolving solid partitions using light, haze, and reactive spatial resonance.
                </li>
                <li>
                  <strong>Slow Perception:</strong> Counteracting digital haste through prolonged, contemplative temporal cycles.
                </li>
              </ul>
            </div>
          </aside>
        </div>

        {/* 3. Core Artistic Disciplines */}
        <div className="practice-disciplines-block">
          <div className="block-header reveal-item">
            <div className="block-label-row">
              <Layers size={16} className="text-olive" />
              <span className="block-label font-cinzel">Core Disciplines</span>
            </div>
            <h3 className="block-title font-serif">Areas of Research & Production</h3>
            <p className="block-desc">
              Four interconnected methodologies uniting computational craft and physical installation.
            </p>
          </div>

          <div className="disciplines-grid">
            {ARTISTIC_DISCIPLINES.map((discipline) => (
              <div
                key={discipline.id}
                className="discipline-card glass-card reveal-item"
                onMouseEnter={playHover}
              >
                <div className="discipline-card-top">
                  <span className="discipline-number font-cinzel">{discipline.number}</span>
                  <span className="discipline-tagline">{discipline.tagline}</span>
                </div>

                <h4 className="discipline-name font-serif">{discipline.title}</h4>

                <p className="discipline-summary">{discipline.summary}</p>

                <div className="discipline-medium-row">
                  <span className="medium-label">Focus Medium:</span>
                  <span className="medium-value">{discipline.medium}</span>
                </div>

                <div className="discipline-tags-row">
                  {discipline.tags.map((tag, i) => (
                    <span key={i} className="discipline-tag-pill">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Curated Exhibition History Timeline (2023–2026) */}
        <div className="practice-timeline-block">
          <div className="block-header reveal-item">
            <div className="block-label-row">
              <Calendar size={16} className="text-olive" />
              <span className="block-label font-cinzel">Chronology</span>
            </div>
            <h3 className="block-title font-serif">Curated Exhibition History</h3>
            <p className="block-desc">
              Selected solo exhibitions, biennale collateral interventions, and museum presentations (2023–2026).
            </p>
          </div>

          <div className="timeline-container">
            <div className="timeline-spine" aria-hidden="true" />

            <div className="timeline-items">
              {EXHIBITION_HISTORY.map((item, idx) => (
                <div
                  key={`${item.year}-${idx}`}
                  className="timeline-item reveal-item"
                  onMouseEnter={playHover}
                >
                  {/* Year & Node */}
                  <div className="timeline-node-col">
                    <span className="timeline-year font-cinzel">{item.year}</span>
                    <div className="timeline-node-dot" aria-hidden="true">
                      <div className="node-inner-dot" />
                    </div>
                  </div>

                  {/* Exhibition Details Card */}
                  <div className="timeline-content glass-card">
                    <div className="timeline-meta-row">
                      <span className="timeline-badge">{item.badge}</span>
                      <span className="timeline-location">
                        <MapPin size={13} />
                        <span>{item.location}</span>
                      </span>
                    </div>

                    <h4 className="timeline-item-title font-serif">
                      <em>{item.title}</em>
                    </h4>

                    <div className="timeline-venue">
                      <strong>{item.institution}</strong>
                    </div>

                    <p className="timeline-desc">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Honors & Residencies */}
        <div className="practice-honors-block">
          <div className="block-header reveal-item">
            <div className="block-label-row">
              <Award size={16} className="text-olive" />
              <span className="block-label font-cinzel">Distinctions</span>
            </div>
            <h3 className="block-title font-serif">Honors & Research Residencies</h3>
          </div>

          <div className="honors-grid">
            {HONORS_RESIDENCIES.map((honor, idx) => (
              <div
                key={idx}
                className="honor-card glass-card reveal-item"
                onMouseEnter={playHover}
              >
                <div className="honor-icon-wrapper" aria-hidden="true">
                  <Award size={20} className="text-olive" />
                </div>
                
                <div className="honor-year font-cinzel">{honor.year}</div>

                <h4 className="honor-title font-serif">{honor.title}</h4>
                <div className="honor-institution">{honor.institution}</div>
                <div className="honor-category">{honor.category}</div>
                <p className="honor-desc">{honor.desc || honor.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Editorial Practice Footer Callout */}
        <div className="practice-footer-callout glass-panel reveal-item">
          <div className="footer-callout-text">
            <div className="callout-tag font-cinzel">Studio Practice & Inquiries</div>
            <h3 className="callout-title font-serif">
              Engage for museum commissions, biennales, and curatorial dialogues.
            </h3>
            <p className="callout-sub">
              Full dossier including floor plans, tech specs, and artist CV available upon request.
            </p>
          </div>

          <div className="callout-actions">
            <button
              type="button"
              className="btn-editorial btn-primary"
              onClick={() => {
                playClick();
                onOpenResume?.();
              }}
              onMouseEnter={playHover}
            >
              <FileText size={16} />
              <span>Exhibition CV</span>
            </button>

            <button
              type="button"
              className="btn-editorial btn-secondary"
              onClick={() => {
                playClick();
                onOpenContact?.();
              }}
              onMouseEnter={playHover}
            >
              <span>Studio Inquiry</span>
              <ArrowUpRight size={15} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
