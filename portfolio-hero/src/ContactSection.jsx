import React, { useState, useCallback, useRef } from 'react';
import { 
  Mail, 
  Copy, 
  Check, 
  MapPin, 
  ArrowUpRight, 
  FileText, 
  Sparkles, 
  Globe, 
  ArrowUp
} from 'lucide-react';
import useScrollReveal from './useScrollReveal';
import { playClick, playHover } from './soundEffects';
import './ContactSection.css';

/**
 * Studio Locations
 */
export const STUDIO_LOCATIONS = [
  {
    city: 'London',
    district: 'Shoreditch',
    role: 'Primary Studio & Optical Lab',
    address: '18 Boundary Street, London E2 7JE',
    timezone: 'Europe/London',
    status: 'Active Studio',
    availability: 'Studio visits by curatorial appointment',
  },
  {
    city: 'Tokyo',
    district: 'Roppongi',
    role: 'Asian Representation & Archive',
    address: 'Gallery Koyanagi / Roppongi Hills, Tokyo',
    timezone: 'Asia/Tokyo',
    status: 'Exhibition Archive',
    availability: 'Gallery liaison & institutional loans',
  },
  {
    city: 'New York',
    district: 'Chelsea',
    role: 'US Gallery Representation',
    address: '524 West 24th Street, New York, NY 10011',
    timezone: 'America/New_York',
    status: 'Curatorial Liaison',
    availability: 'US commissions & institutional presentations',
  },
];

/**
 * External Platform Links
 */
export const EXTERNAL_LINKS = [
  {
    name: 'Instagram',
    handle: '@riya.studio',
    url: 'https://instagram.com',
    description: 'Process ephemera, laser lab studies & studio updates',
  },
  {
    name: 'Foundation',
    handle: '@riya',
    url: 'https://foundation.app',
    description: 'Curated digital provenance & 1-of-1 sculptural releases',
  },
  {
    name: 'Behance',
    handle: 'riya-art',
    url: 'https://behance.net',
    description: 'Exhibition schematics, architectural renders & technical specs',
  },
  {
    name: 'Substack',
    handle: 'Notes on Light',
    url: 'https://substack.com',
    description: 'Monograph essays on generative fluid mechanics & optics',
  },
];

/**
 * ContactSection
 * 
 * Editorial footer and studio inquiry section featuring:
 * - Direct studio email with one-click copy to clipboard + tactile sound
 * - Studio location cards across London, Tokyo, and New York
 * - External digital platforms and publications
 * - Primary CTAs for Studio Inquiry Modal & Exhibition CV Modal
 * - Colophon & Back-to-top navigation
 */
export default function ContactSection({ onOpenContact, onOpenResume }) {
  const [copied, setCopied] = useState(false);
  const studioEmail = 'studio@riya-art.com';
  const sectionRef = useRef(null);

  useScrollReveal(sectionRef);

  // Copy email to clipboard handler
  const handleCopyEmail = useCallback(async () => {
    playClick();
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(studioEmail);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = studioEmail;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [studioEmail]);

  // Back to top scroll handler
  const handleScrollTop = useCallback((e) => {
    e.preventDefault();
    playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <footer id="contact" ref={sectionRef} className="contact-section" aria-label="Contact and Inquiries">
      <div className="contact-container">
        
        {/* 1. Editorial Header */}
        <header className="contact-header reveal-on-scroll">
          <div className="contact-label-row">
            <span className="contact-label font-cinzel">INQUIRIES & COLLABORATIONS</span>
            <span className="contact-label-line" aria-hidden="true" />
            <span className="contact-sublabel">Studio Dialogue</span>
          </div>

          <h2 className="contact-title font-serif">
            Initiating dialogue across galleries, cultural institutions, and visionary commissions.
          </h2>

          <p className="contact-lead">
            Studio Riya welcomes inquiries regarding museum commissions, biennale collateral projects, 
            site-specific light installations, and curated exhibitions worldwide.
          </p>
        </header>

        {/* 2. Primary Direct Invitation & Action Hero Card */}
        <div className="contact-action-hero glass-panel reveal-on-scroll">
          <div className="action-hero-content">
            <div className="action-hero-badge font-cinzel">
              <Sparkles size={14} className="text-olive" />
              <span>Direct Studio Access</span>
            </div>

            <h3 className="action-hero-title font-serif">
              Have a prospective exhibition or architectural commission in mind?
            </h3>

            <p className="action-hero-text">
              Direct discussions regarding curatorial feasibility, optical laser specifications, 
              budgeting frameworks, and institutional loan agreements.
            </p>

            <div className="action-hero-buttons">
              <button
                type="button"
                className="btn-editorial btn-primary contact-cta-btn"
                onClick={() => {
                  playClick();
                  onOpenContact?.();
                }}
                onMouseEnter={playHover}
              >
                <span>Initiate Studio Inquiry</span>
                <ArrowUpRight size={17} />
              </button>

              <button
                type="button"
                className="btn-editorial btn-secondary contact-cv-btn"
                onClick={() => {
                  playClick();
                  onOpenResume?.();
                }}
                onMouseEnter={playHover}
              >
                <FileText size={16} />
                <span>Download / View Exhibition CV</span>
              </button>
            </div>
          </div>

          {/* Right side: Email copy card */}
          <div className="action-hero-email-card glass-card">
            <div className="email-card-header">
              <Mail size={16} className="text-olive" />
              <span className="email-card-label font-cinzel">Studio Mailbox</span>
            </div>

            <div className="email-display-row">
              <a
                href={`mailto:${studioEmail}`}
                className="email-address-link font-serif"
                onClick={playClick}
                onMouseEnter={playHover}
                title="Send email via mail client"
              >
                {studioEmail}
              </a>

              <button
                type="button"
                className={`btn-copy-email ${copied ? 'is-copied' : ''}`}
                onClick={handleCopyEmail}
                onMouseEnter={playHover}
                title={copied ? 'Copied to clipboard' : 'Copy email address'}
                aria-label={copied ? 'Email copied to clipboard' : 'Copy studio email address'}
              >
                {copied ? (
                  <>
                    <Check size={14} />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="email-card-meta">
              <span className="meta-indicator" aria-hidden="true" />
              <span className="meta-text">Average curatorial response time: 24–48 hours</span>
            </div>
          </div>
        </div>

        {/* 3. Studio Locations Grid */}
        <div className="contact-locations-block">
          <div className="block-header reveal-on-scroll">
            <div className="block-label-row">
              <MapPin size={16} className="text-olive" />
              <span className="block-label font-cinzel">Studio Presences</span>
            </div>
            <h3 className="block-title font-serif">Global Representation & Laboratories</h3>
          </div>

          <div className="locations-grid">
            {STUDIO_LOCATIONS.map((loc) => (
              <div 
                key={loc.city} 
                className="location-card glass-card reveal-on-scroll"
                onMouseEnter={playHover}
              >
                <div className="location-top">
                  <div className="location-city-wrap">
                    <h4 className="location-city font-serif">{loc.city}</h4>
                    <span className="location-district font-cinzel">{loc.district}</span>
                  </div>
                  <span className="location-status-badge">{loc.status}</span>
                </div>

                <div className="location-role">{loc.role}</div>

                <address className="location-address">
                  <MapPin size={14} className="address-icon" />
                  <span>{loc.address}</span>
                </address>

                <div className="location-footer">
                  <span className="location-avail">{loc.availability}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. External Platforms & Publications */}
        <div className="contact-platforms-block">
          <div className="block-header reveal-on-scroll">
            <div className="block-label-row">
              <Globe size={16} className="text-olive" />
              <span className="block-label font-cinzel">Digital Platforms</span>
            </div>
            <h3 className="block-title font-serif">Publications & Channels</h3>
          </div>

          <div className="platforms-grid">
            {EXTERNAL_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="platform-card glass-card reveal-on-scroll"
                onClick={playClick}
                onMouseEnter={playHover}
              >
                <div className="platform-card-header">
                  <div className="platform-info">
                    <span className="platform-name font-cinzel">{link.name}</span>
                    <span className="platform-handle">{link.handle}</span>
                  </div>
                  <div className="platform-arrow" aria-hidden="true">
                    <ArrowUpRight size={16} />
                  </div>
                </div>

                <p className="platform-desc">{link.description}</p>
              </a>
            ))}
          </div>
        </div>

        {/* 5. Editorial Colophon & Legal Footer */}
        <div className="contact-colophon-bar reveal-on-scroll">
          <div className="colophon-left">
            <span className="colophon-brand font-cinzel">STUDIO RIYA</span>
            <span className="colophon-sep" aria-hidden="true">•</span>
            <span className="colophon-copyright">
              © 2026 Studio Riya. All rights reserved.
            </span>
          </div>

          <div className="colophon-center">
            <span>Spatial Scenography • Volumetric Light • Generative Computation</span>
          </div>

          <div className="colophon-right">
            <button
              type="button"
              className="btn-back-to-top"
              onClick={handleScrollTop}
              onMouseEnter={playHover}
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp size={14} />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
