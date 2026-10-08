import React from 'react';
import { Sparkles, ArrowUpRight, Eye } from 'lucide-react';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation Pill Bar */}
      <header style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="frosted-pill font-cinzel" style={{ fontWeight: 700, letterSpacing: '0.1em' }}>
          <span>RIYA</span>
          <span style={{ opacity: 0.4 }}>•</span>
          <span style={{ fontSize: '0.75rem', opacity: 0.75 }}>STUDIO 2026</span>
        </div>

        <nav style={{ display: 'flex', gap: '0.75rem' }}>
          <a href="#works" className="frosted-pill">Selected Works</a>
          <a href="#about" className="frosted-pill">Practice</a>
          <a href="#inquire" className="frosted-pill pill-olive">
            Inquire <ArrowUpRight size={14} />
          </a>
        </nav>
      </header>

      {/* Main Editorial Hero Placeholder */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="glass-panel" style={{ maxWidth: '640px', width: '100%', padding: '3rem 2.5rem', textAlign: 'center' }}>
          <div className="editorial-tag" style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={14} /> Visual Artist & Creative Director
          </div>

          <h1 className="font-serif" style={{ fontSize: '3rem', lineHeight: 1.1, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
            Riya
          </h1>

          <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '480px', marginInline: 'auto' }}>
            Interactive editorial portfolio foundation scaffolded. Ready for 60 FPS circular cursor-tracking character canvas and curated exhibitions.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span className="frosted-pill" style={{ fontSize: '0.8125rem' }}>
              <Eye size={14} /> 64 Circular Frames Ready
            </span>
            <span className="frosted-pill" style={{ fontSize: '0.8125rem' }}>
              Palette #e993a3 & #3d5a45
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ padding: '1.5rem 2rem', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
        © 2026 Riya. All rights reserved. Editorial interactive monograph.
      </footer>
    </div>
  );
}
