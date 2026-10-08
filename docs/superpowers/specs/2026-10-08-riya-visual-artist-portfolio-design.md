# Specification: Riya — Visual Artist Interactive Portfolio

**Date:** 2026-10-08  
**Topic:** Riya Visual Artist Interactive Portfolio  
**Status:** Approved  

---

## 1. Overview & Vision
A luxury, editorial-grade visual artist portfolio for **Riya**, featuring a fluid, zero-ghosting, 60 FPS cursor-tracking character canvas. 

The portfolio is designed with a refined aesthetic matching the rose-pink background (`#e993a3`) and olive green accents (`#3d5a45`). It rejects technical buzzwords and gimmicks in favor of pure artistic elegance, showcasing curated exhibition series, artist philosophy, selected exhibitions, and inquiry systems.

---

## 2. Media Pipeline & Frame Extraction (`extract_frames.py`)

### 2.1 Video Source Analysis
- **Source Video**: `C:\porfolio_riya\Woman_moving_head_and_eyes_20261008162542.mp4`
- **Resolution**: 1920 × 1080 (16:9)
- **Framerate & Count**: 24.0 FPS, 240 frames (10.0 seconds)
- **Background Color**: Uniform `#e993a3` (rose pink)
- **Watermark Location**: Kling AI star sparkle at bottom-right `[800:1080, 1600:1920]`

### 2.2 Watermark Inpainting
- Automated OpenCV Telea algorithm (`cv2.inpaint`) with a binary mask covering `[790:1020, 1590:1870]`.
- Dilated mask radius 6px to erase any edge fringing or compression artifacts.

### 2.3 360° Circular Compass Mapping
The 64 frames for full 360° cursor tracking are extracted along a counter-clockwise circle matching `atan2(-dy, dx)`:
- **0° (RIGHT / 3 o'clock)**: Frame 182
- **45° (UP-RIGHT / 1:30)**: Frame 160
- **90° (UP / 12 o'clock)**: Frame 24
- **135° (UP-LEFT / 10:30)**: Frame 54
- **180° (LEFT / 9 o'clock)**: Frame 76
- **225° (DOWN-LEFT / 7:30)**: Frame 100
- **270° (DOWN / 6 o'clock)**: Frame 126
- **315° (DOWN-RIGHT / 4:30)**: Frame 200
- **CENTER (Neutral Frontal Eye Contact)**: Frame 0

### 2.4 Output Asset Specifications
- **Format**: WebP (`.webp`) at quality 92.
- **Location**: `portfolio-hero/public/frames/` (or `public/frames/` in Vite app).
- **Naming**: `000.webp` through `063.webp`, plus `center.webp`.
- **Total Payload**: Under 4.5 MB across all 65 frames.

---

## 3. Character Canvas Rendering Engine (`CharacterCanvas.jsx`)

### 3.1 Architecture & Performance Guardrails
- **Zero-Ghosting**: Exactly one frame rendered at 100% opacity per frame tick. No alpha blending.
- **Memory Efficiency**: 65 standard `HTMLImageElement` preloaded once at mount. Zero GPU texture overflow or VRAM bloat.
- **DPR Scaling**: Automatically scales to viewport device pixel ratio (capped at 2.0).
- **Aspect Ratio Maintenance**: CSS / Canvas `object-fit: cover` logic centered around `FACE_CENTER_X: 0.50`, `FACE_CENTER_Y: 0.40`.

### 3.2 Cursor Tracking & Vector Mathematics
- In a `requestAnimationFrame` loop:
  - Vector from face center `(W * 0.5, H * 0.4)` to cursor `(mouseX * W, mouseY * H)` calculates `dx, dy`.
  - Angle: `targetAngle = Math.atan2(-dy, dx)`.
  - Continuous shortest-path circular lerp with smooth settling factor (`FRAME_LERP = 0.18`).
  - Step clamp to prevent frame skipping or jitter.
- **Eye Contact Deadzone (14% viewport radius)**:
  - When cursor is within `DEADZONE_RADIUS = 0.14`, immediately switches to `center.webp` so Riya looks directly into the viewer's eyes.
- **Mobile Touch Handling**:
  - Touch moves steer gaze.
  - Releasing touch smoothly drifts gaze back to center eye-contact over 350ms.
- **No Gimmicks / No Easter Eggs**:
  - No bouncing nods or technical metrics overlay. Pure, seamless artistic interaction.

---

## 4. UI/UX Design & Portfolio Architecture

### 4.1 Typography & Color Palette
- **Primary Background**: `#e993a3` (rose blush)
- **Deep Accent / Text**: `#2a171b` (espresso plum / deep onyx)
- **Secondary Accent**: `#3d5a45` (olive green, harmonizing with her shirt)
- **Glassmorphism Panels**: `rgba(255, 245, 247, 0.45)` with `backdrop-filter: blur(16px)` and subtle borders.
- **Typography**:
  - Headings: Elegant High-Editorial Serif (Playfair Display / Cormorant / Italian Plate)
  - Body: Precision Modern Sans (Plus Jakarta Sans / Inter / Syne)

### 4.2 Portfolio Sections
1. **Hero Section (`HeroSection.jsx`)**:
   - Fixed character canvas background.
   - Minimalist top navigation bar (Home, Selected Works, Practice, Contact).
   - Bottom-left editorial title:
     - Name: **Riya**
     - Role: **Visual Artist & Creative Director**
     - Studio Status: *"Available for commissions & exhibitions • 2026"*
     - Direct CTAs: *"Explore Works"*, *"Artist Statement"*, *"Inquire"*.
   - Spring-physics custom magnetic cursor.
   - Subtle tactile Web Audio effects toggle in header.

2. **Selected Works & Exhibitions (`ProjectsSection.jsx` & `ProjectMockup.jsx`)**:
   - Exhibition grid featuring 4 primary series:
     1. *Ethereal Resonance* — Generative Light & Audio-Visual Space
     2. *Chromata* — Chromatics, Materiality & Tactile Digital Forms
     3. *Flora Obscura* — Botanical Surrealism & 3D Editorial Studies
     4. *Metamorphosis* — Kinetic Sculpture & Generative Identity
   - Interactive Lightbox / Detail Drawer with high-res artwork, year, medium, dimensions, and curatorial statement.

3. **Artist Practice & Statement (`AboutSection.jsx`)**:
   - Curatorial artist statement exploring light, perception, and materiality.
   - Exhibition History (Solo & Group Exhibitions 2024–2026).
   - Artist Residencies, Press, and Permanent Collections.
   - Core disciplines: Spatial Installation, Generative Art, Creative Direction, 3D Sculpture.

4. **Inquiry & CV System (`ContactSection.jsx`, `ContactModal.jsx`, `ResumeModal.jsx`)**:
   - Studio Inquiry modal (Commissions, Gallery Representation, Collaborations).
   - Exhibition CV Modal with download/print functionality.
   - Studio coordinates, gallery representation info, and social links.

---

## 5. Verification & Testing Criteria
1. **Frame Quality**: All 64 frames + center frame extract cleanly with no watermark remnants or clipping.
2. **Animation Fluidity**: Canvas renders smoothly at 60 FPS with responsive vector tracking across all screen sizes.
3. **Deadzone Behavior**: When cursor hovers over her face, she transitions to `center.webp` with zero ghosting.
4. **Responsive Layout**: Flawless display on mobile, tablet, and ultra-wide displays.
5. **Clean Tone**: Complete absence of technical jargon ("60 FPS canvas renderer", etc.) or easter eggs, ensuring an authentic fine-art studio feel.
