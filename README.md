# Riya — Visual Artist & Creative Director

An editorial, luxury interactive visual artist portfolio featuring a zero-lag, 60 FPS cursor-tracking character canvas, curated exhibition gallery, artist statement, and inquiry system.

![React](https://img.shields.io/badge/React-19-blue?style=flat-square)
![Vite](https://img.shields.io/badge/Vite-5.4-purple?style=flat-square)
![OpenCV](https://img.shields.io/badge/OpenCV-Python-green?style=flat-square)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=flat-square)

---

## Highlights

- **60 FPS Cursor-Tracking Canvas**: Full-screen HTML5 Canvas renderer tracking cursor vector angles (`atan2(-dy, dx)`) with shortest-path circular interpolation and 3-frame deceleration.
- **Eye-Contact Deadzone**: Switches seamlessly to direct frontal eye contact (`center.webp`) when the viewer's cursor rests near Riya's face.
- **Watermark Inpainting Pipeline**: Automated Python OpenCV pipeline that cleanly inpaint AI watermarks using Telea inpainting across all extracted WebP frames.
- **Visual Artist Identity & Palette**: Seamless `#e993a3` rose pink backdrop with deep espresso `#2a171b` and olive green `#3d5a45` accents.
- **Selected Works Exhibition Gallery**: Curated series (*Ethereal Resonance*, *Chromata*, *Flora Obscura*, *Metamorphosis*) with an interactive curatorial lightbox and technical specs.
- **Curated Practice & Philosophy**: Artist statement on computational form and light, exhibition timeline (Mori Art Museum, Venice Biennale, Serpentine Galleries), and residency history.
- **Interactive Modals**:
  - **Studio Inquiry Dialog**: Categorized inquiry form (Commissions, Exhibitions, Press, Representation).
  - **Curriculum Vitae Modal**: Full printable exhibition CV with dedicated print stylesheet.
- **Synthesized Web Audio**: Tactile clicks and soft hover chimes using the native Web Audio API (zero audio files needed, fully toggleable).
- **Mobile Touch Gaze**: Interactive touch-tracking for mobile devices that smoothly drifts back to eye contact upon release.

---

## Project Structure

```
├── docs/                               # Design specs and implementation plans
├── extract_frames.py                   # OpenCV frame extraction & inpainting script
└── portfolio-hero/                     # Frontend Vite + React application
    ├── public/
    │   └── frames/                     # 64 circular WebP frames + center.webp
    └── src/
        ├── App.jsx                     # Root application
        ├── CharacterCanvas.jsx         # 60 FPS vector tracking canvas
        ├── HeroSection.jsx             # Editorial hero & top navigation
        ├── ProjectsSection.jsx         # Exhibition gallery & lightbox
        ├── ProjectMockup.jsx           # Generative visual art displays
        ├── AboutSection.jsx            # Artist statement & exhibition history
        ├── ContactSection.jsx          # Studio inquiries & colophon
        ├── ContactModal.jsx            # Studio inquiry modal
        ├── ResumeModal.jsx             # Exhibition CV modal
        └── soundEffects.js             # Web Audio API sound synthesizer
```

---

## Quick Start

### 1. Install & Run Frontend

```bash
cd portfolio-hero
npm install
npm run dev
```

### 2. Build for Production

```bash
npm run build
```

---

## License

MIT © Studio Riya
