# Riya — Visual Artist & Creative Director

An editorial, luxury interactive visual artist portfolio featuring a zero-lag, 60 FPS cursor-tracking character canvas, 3D facial-anchored traditional bindi, curated exhibition gallery, artist statement, synthesized tactile audio, and interactive studio inquiry system.

![React](https://img.shields.io/badge/React-19-blue?style=flat-square)
![Vite](https://img.shields.io/badge/Vite-5.4-purple?style=flat-square)
![OpenCV](https://img.shields.io/badge/OpenCV-Python-green?style=flat-square)
![MediaPipe](https://img.shields.io/badge/MediaPipe-FaceMesh-orange?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-black?style=flat-square)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=flat-square)

---

## 🌟 Highlights & Key Features

- **60 FPS Cursor-Tracking Canvas**: Full-screen HTML5 Canvas renderer tracking cursor vector angles (`atan2(-dy, dx)`) relative to Riya's face, smoothly steering her gaze in 360° across 64 high-resolution WebP frames.
- **Direct Eye-Contact Deadzone**: Switches seamlessly to direct frontal eye contact (`center.webp`) when the viewer's cursor rests near Riya's face.
- **True 3D Facial-Anchored Bindi**: Delicate carbon black dot ($r = 4.5\text{px}$) locked directly to her forehead plane between the inner eyebrows using MediaPipe FaceMesh 3D landmarks, rotating and foreshortening naturally with her head roll and pitch angle across all 65 interactive frames.
- **Watermark Inpainting Pipeline**: Automated Python OpenCV pipeline that cleanly inpaint AI watermarks using Telea inpainting across all extracted WebP frames.
- **Editorial Identity & Palette**: Bespoke editorial palette featuring `#e993a3` (dusty rose), deep espresso `#2a171b`, and olive green `#3d5a45` accents.
- **Selected Works Exhibition Gallery**: Curated series (*Ethereal Resonance*, *Chromata*, *Flora Obscura*, *Metamorphosis*) with an interactive curatorial lightbox and technical specs.
- **Curated Practice & Philosophy**: Artist statement on computational form and light, exhibition timeline (Mori Art Museum, Venice Biennale, Serpentine Galleries), and residency history.
- **Interactive Modals**:
  - **Studio Inquiry Dialog**: Categorized inquiry form (Commissions, Exhibitions, Press, Representation).
  - **Curriculum Vitae Modal**: Full printable exhibition CV with dedicated print stylesheet.
- **Synthesized Web Audio**: Tactile clicks and soft hover chimes using the native Web Audio API (zero audio files needed, fully toggleable with mute state).
- **Mobile Touch Gaze**: Interactive touch-tracking for mobile devices that smoothly drifts back to eye contact upon release.

---

## 📁 Repository Structure

```
quirky-maxwell/
├── package.json                        # Root workspace scripts (npm run dev / build)
├── extract_frames.py                   # OpenCV frame extraction & inpainting script
├── add_bindi.py                        # 3D FaceMesh bindi anchoring & rendering pipeline
├── portfolio-hero/                     # Frontend Vite + React application
│   ├── index.html                      # HTML root with Playfair Display & Cormorant Garamond
│   ├── package.json                    # Application dependencies (React 19, Lucide, Vite)
│   ├── vite.config.js                  # Vite configuration (port 3000)
│   ├── public/
│   │   └── frames/                     # 64 circular WebP frames + center.webp
│   └── src/
│       ├── main.jsx                    # Application entry point
│       ├── App.jsx                     # Root application state & modal wiring
│       ├── index.css                   # Global rose palette tokens & glassmorphism
│       ├── CharacterCanvas.jsx         # 60 FPS vector tracking canvas
│       ├── HeroSection.jsx             # Editorial hero & top navigation pill
│       ├── HeroSection.css             # Hero styles, magnetic cursor & glass pill
│       ├── ProjectsSection.jsx         # Exhibition gallery & lightbox modal
│       ├── ProjectsSection.css         # Exhibition masonry grid & lightbox styles
│       ├── ProjectMockup.jsx           # Generative visual artworks for exhibition cards
│       ├── AboutSection.jsx            # Artist statement, practice & exhibition history
│       ├── AboutSection.css            # Practice timeline & honors styling
│       ├── ContactSection.jsx          # Studio inquiries, global locations & colophon
│       ├── ContactSection.css          # Contact card & copy-to-clipboard button
│       ├── ContactModal.jsx            # Studio inquiry form modal
│       ├── ContactModal.css            # Frosted glass inquiry modal styling
│       ├── ResumeModal.jsx             # Exhibition CV modal with print stylesheet
│       ├── ResumeModal.css             # Exhibition CV layout & @media print styles
│       ├── soundEffects.js             # Web Audio API procedural sound synthesizer
│       └── useScrollReveal.js          # IntersectionObserver hook for scroll reveals
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18.0 or higher)
- **npm** or **pnpm** / **yarn**

### 1. Install Dependencies

From the repository root:
```bash
npm run install:all
```
*(Or `cd portfolio-hero && npm install`)*

### 2. Start the Development Server

```bash
npm run dev
```
Open **[http://localhost:3000/](http://localhost:3000/)** in your browser.

### 3. Build for Production

```bash
npm run build
```
The optimized production bundle will be output to `portfolio-hero/dist/`.

---

## 🛠️ How It Works

### 1. Character Tracking Engine (`CharacterCanvas.jsx`)
- Computes cursor vector `dx = mouseX - faceCX`, `dy = mouseY - faceCY`.
- Converts cursor direction into continuous radians `atan2(-dy, dx)`.
- Normalizes angle to floating-point frame index `[0..64)`.
- Uses shortest-path circular interpolation with two-phase deceleration so gaze transitions are smooth and natural.
- Within `DEADZONE_RADIUS = 0.08`, the canvas locks onto `center.webp` for direct eye contact.

### 2. 3D Bindi Anchoring Pipeline (`add_bindi.py`)
- Uses **MediaPipe FaceMesh** 3D landmarks:
  - Inner eyebrow tips: Landmark 107 (right) and Landmark 336 (left).
  - Forehead midline: Landmark 8 (glabella) and Landmark 9 (mid-forehead).
- Computes the true 3D surface normal $\vec{n} = \frac{\vec{v}_h \times \vec{v}_v}{\|\vec{v}_h \times \vec{v}_v\|}$.
- Calculates head roll angle $\theta_{\text{roll}} = \text{atan2}(v_{h,y}, v_{h,x})$ in image plane.
- Applies perspective foreshortening to ellipse axes based on yaw and pitch tilts.
- Renders an anti-aliased, softly blended carbon black bindi (`#121014`) directly onto each frame.

To re-run the 3D bindi processing:
```bash
uv run --python 3.12 --with "mediapipe==0.10.14" --with opencv-python python add_bindi.py
```

---

## 🎨 Customization Guide

- **Theme Colors**: Edit CSS variables in `portfolio-hero/src/index.css` (`--bg-primary: #e993a3`, `--text-espresso: #2a171b`, etc.).
- **Artist Bio & Statement**: Edit copy in `portfolio-hero/src/HeroSection.jsx` and `portfolio-hero/src/AboutSection.jsx`.
- **Selected Works**: Update artwork titles, mediums, years, and descriptions in `portfolio-hero/src/ProjectsSection.jsx`.
- **Exhibition CV**: Update solo/group shows, institutional collections, and press in `portfolio-hero/src/ResumeModal.jsx`.
- **Contact Details**: Update studio email and representation locations in `portfolio-hero/src/ContactSection.jsx`.

---

## 📄 License

MIT © Studio Riya
