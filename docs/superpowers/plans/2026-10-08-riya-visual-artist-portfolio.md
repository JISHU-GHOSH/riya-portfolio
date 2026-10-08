# Riya — Visual Artist Interactive Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a luxury, high-performance visual artist portfolio for Riya featuring a zero-ghosting, 60 FPS cursor-tracking character canvas, curated exhibition gallery, artist statement, and inquiry system.

**Architecture:** A Python OpenCV pipeline extracts 64 circular WebP frames + `center.webp` with watermark inpainting from the source video into `public/frames/`. A React HTML5 Canvas component performs vector angular tracking (`atan2(-dy, dx)`) with a 14% eye-contact deadzone. Surrounding the canvas is an editorial exhibition portfolio built with React and modern CSS.

**Tech Stack:** React 19 / Vite, HTML5 Canvas, OpenCV (via Python & `uv`), Web Audio API, Lucide React, Google Fonts (*Playfair Display*, *Plus Jakarta Sans*, *Cinzel*).

**Spec:** [`docs/superpowers/specs/2026-10-08-riya-visual-artist-portfolio-design.md`](file:///c:/Users/jishu/Documents/antigravity/quirky-maxwell/docs/superpowers/specs/2026-10-08-riya-visual-artist-portfolio-design.md)

## Global Constraints
- Background color must be exact `#e993a3` with zero seam lines against video frames.
- Palette accents: Deep espresso `#2a171b` and olive green `#3d5a45`.
- No technical buzzwords or gimmick text on screen (no "60 FPS canvas renderer").
- No easter eggs (no head nod bouncing; pure, dignified cursor tracking).
- Zero-ghosting: Exactly one frame rendered at 100% opacity per tick.
- Complete responsiveness for desktop, tablet, and mobile.

---

### Task 1: Frame Extraction & Watermark Inpainting Pipeline

**Files:**
- Create: `extract_frames.py`
- Output: `portfolio-hero/public/frames/000.webp` through `063.webp`, `center.webp`

**Interfaces:**
- Consumes: `C:\porfolio_riya\Woman_moving_head_and_eyes_20261008162542.mp4`
- Produces: 65 WebP images in `portfolio-hero/public/frames/`

- [ ] **Step 1: Write `extract_frames.py`**

```python
import cv2
import numpy as np
import os
import sys

VIDEO_PATH = r"C:\porfolio_riya\Woman_moving_head_and_eyes_20261008162542.mp4"
OUT_DIR = r"portfolio-hero/public/frames"
os.makedirs(OUT_DIR, exist_ok=True)

# 8 compass anchor directions mapped to video frames
# 0° = RIGHT, 45° = UP-RIGHT, 90° = UP, 135° = UP-LEFT
# 180° = LEFT, 225° = DOWN-LEFT, 270° = DOWN, 315° = DOWN-RIGHT
ANCHOR_FRAMES = {
    0:   182,  # RIGHT
    45:  160,  # UP-RIGHT
    90:   24,  # UP
    135:  54,  # UP-LEFT
    180:  76,  # LEFT
    225: 100,  # DOWN-LEFT
    270: 126,  # DOWN
    315: 200,  # DOWN-RIGHT
}

# Inpaint Kling AI watermark sparkle at bottom right [800:1080, 1600:1920]
def inpaint_frame(img):
    mask = np.zeros(img.shape[:2], dtype=np.uint8)
    mask[790:1020, 1590:1870] = 255
    return cv2.inpaint(img, mask, 6, cv2.INPAINT_TELEA)

# Interpolate 64 frames evenly around 360° circle (every 5.625°)
angles = np.linspace(0, 360, 64, endpoint=False)

def get_mapped_frame_idx(angle):
    # Anchor keys in sorted order
    anchor_deg = [0, 45, 90, 135, 180, 225, 270, 315, 360]
    anchor_f   = [182, 160, 24, 54, 76, 100, 126, 200, 182]
    
    for i in range(len(anchor_deg) - 1):
        if anchor_deg[i] <= angle <= anchor_deg[i+1]:
            t = (angle - anchor_deg[i]) / (anchor_deg[i+1] - anchor_deg[i])
            f_idx = int(round(anchor_f[i] + t * (anchor_f[i+1] - anchor_f[i])))
            return max(0, min(239, f_idx))
    return 182

cap = cv2.VideoCapture(VIDEO_PATH)
if not cap.isOpened():
    print(f"Error opening video: {VIDEO_PATH}")
    sys.exit(1)

total_fc = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
all_frames = {}
frame_idx = 0
while True:
    ret, frame = cap.read()
    if not ret: break
    all_frames[frame_idx] = frame
    frame_idx += 1
cap.release()

print(f"Loaded {len(all_frames)} frames from video.")

# Save 64 circular frames
for i, ang in enumerate(angles):
    f_num = get_mapped_frame_idx(ang)
    raw = all_frames[f_num]
    cleaned = inpaint_frame(raw)
    out_path = os.path.join(OUT_DIR, f"{i:03d}.webp")
    cv2.imwrite(out_path, cleaned, [cv2.IMWRITE_WEBP_QUALITY, 92])

# Save center direct eye-contact frame (Frame 0)
raw_center = all_frames[0]
cleaned_center = inpaint_frame(raw_center)
cv2.imwrite(os.path.join(OUT_DIR, "center.webp"), cleaned_center, [cv2.IMWRITE_WEBP_QUALITY, 92])

print(f"Successfully extracted 64 circular frames + center.webp into {OUT_DIR}")
```

- [ ] **Step 2: Run `extract_frames.py` using `uv`**
Run: `uv run --with opencv-python --with numpy python extract_frames.py`
Verify: All 65 `.webp` files exist in `portfolio-hero/public/frames/` and are non-empty.

- [ ] **Step 3: Commit extraction assets**
Run: `git add extract_frames.py portfolio-hero/public/frames; git commit -m "feat: extract 64 WebP frames and center eye-contact frame"`

---

### Task 2: Project Setup & Editorial Typography/Styles

**Files:**
- Create: `portfolio-hero/package.json`
- Create: `portfolio-hero/vite.config.js`
- Create: `portfolio-hero/index.html`
- Create: `portfolio-hero/src/index.css`
- Create: `portfolio-hero/src/main.jsx`
- Create: `portfolio-hero/src/App.jsx`

**Interfaces:**
- Produces: Working Vite + React application running on `#e993a3` base theme.

- [ ] **Step 1: Create `portfolio-hero/package.json` with React and Lucide icons**
- [ ] **Step 2: Create `portfolio-hero/vite.config.js` with standard React plugin**
- [ ] **Step 3: Create `portfolio-hero/index.html`**
Include Google Fonts: *Playfair Display*, *Cinzel*, and *Plus Jakarta Sans*.
- [ ] **Step 4: Create `portfolio-hero/src/index.css`**
Set body background `#e993a3`, custom scrollbars, glassmorphic utility classes, and selection colors.
- [ ] **Step 5: Install dependencies & verify Vite builds**
Run: `npm install` and verify dev server starts cleanly.
- [ ] **Step 6: Commit project foundation**
Run: `git add portfolio-hero; git commit -m "chore: scaffold Vite React portfolio foundation"`

---

### Task 3: Character Canvas Component (`CharacterCanvas.jsx`)

**Files:**
- Create: `portfolio-hero/src/CharacterCanvas.jsx`

**Interfaces:**
- Consumes: `public/frames/*.webp`
- Produces: `<CharacterCanvas />` React component

- [ ] **Step 1: Implement `CharacterCanvas.jsx`**
  - Preload all 65 images using `new Image()`.
  - Resize canvas dynamically matching window DPR (capped at 2.0).
  - Compute cursor angle `atan2(-dy, dx)` relative to face coordinates `(0.50, 0.40)`.
  - Continuous shortest-path angle lerp with settling factor `FRAME_LERP = 0.18`.
  - Deadzone detection: when cursor is within `0.14` radius, switch to `center.webp` at 100% opacity.
  - Draw exactly one frame per tick at full opacity with `object-fit: cover` math.
  - Mobile touch support: touch tracks gaze; release smoothly drifts to center over 350ms.
  - Zero easter eggs or technical debug text.

- [ ] **Step 2: Test CharacterCanvas in isolation in App.jsx**
Verify cursor tracking in browser at 60 FPS with no ghosting or stutter.

- [ ] **Step 3: Commit CharacterCanvas**
Run: `git add portfolio-hero/src/CharacterCanvas.jsx; git commit -m "feat: add 60 FPS CharacterCanvas tracking engine"`

---

### Task 4: Hero Section, Navigation & Audio System

**Files:**
- Create: `portfolio-hero/src/soundEffects.js`
- Create: `portfolio-hero/src/HeroSection.jsx`
- Create: `portfolio-hero/src/HeroSection.css`

**Interfaces:**
- Consumes: `<CharacterCanvas />`
- Produces: `<HeroSection />` component with frosted navigation, custom cursor, and audio engine.

- [ ] **Step 1: Implement `soundEffects.js`**
Lightweight Web Audio synthesizer generating soft tactile clicks and ethereal hover sounds, with global mute state.
- [ ] **Step 2: Implement `HeroSection.jsx` & `HeroSection.css`**
  - Fixed glassmorphism top navigation (Home, Works, Statement, Contact).
  - Editorial nameplate: "Riya" in grand serif, "Visual Artist & Creative Director".
  - Status indicator: "Available for commissions & exhibitions • 2026".
  - Action buttons: "Explore Works", "Artist Statement", "Inquire".
  - Magnetic spring-physics cursor (`cursor-dot`, `cursor-ring`).
- [ ] **Step 3: Test Hero Section visual flow and responsiveness**
- [ ] **Step 4: Commit Hero Section**
Run: `git commit -am "feat: implement editorial HeroSection and audio system"`

---

### Task 5: Selected Works & Exhibition Gallery

**Files:**
- Create: `portfolio-hero/src/ProjectMockup.jsx`
- Create: `portfolio-hero/src/ProjectsSection.jsx`
- Create: `portfolio-hero/src/ProjectsSection.css`

**Interfaces:**
- Produces: `<ProjectsSection />` exhibition showcase with interactive artwork lightbox.

- [ ] **Step 1: Implement `ProjectMockup.jsx`**
High-res generative visual artwork renders representing Riya's portfolio pieces (*Ethereal Resonance*, *Chromata*, *Flora Obscura*, *Metamorphosis*).
- [ ] **Step 2: Implement `ProjectsSection.jsx` & `ProjectsSection.css`**
  - 4 exhibition cards with year, medium, dimensions, and curatorial summary.
  - Interactive Artwork Detail Lightbox displaying full curatorial text and exhibition credentials upon click.
- [ ] **Step 3: Test lightbox and gallery interactions**
- [ ] **Step 4: Commit Projects Section**
Run: `git commit -am "feat: implement Selected Works exhibition gallery and lightbox"`

---

### Task 6: Artist Practice & Statement Section

**Files:**
- Create: `portfolio-hero/src/useScrollReveal.js`
- Create: `portfolio-hero/src/AboutSection.jsx`
- Create: `portfolio-hero/src/AboutSection.css`

**Interfaces:**
- Produces: `<AboutSection />` showcasing artist philosophy, solo/group exhibitions, and residencies.

- [ ] **Step 1: Implement `useScrollReveal.js` hook**
IntersectionObserver hook for smooth fade-and-rise animations.
- [ ] **Step 2: Implement `AboutSection.jsx` & `AboutSection.css`**
  - Artist statement on perception, materiality, and light.
  - Exhibition History (2024–2026: Venice Biennale Collateral, Mori Art Museum Tokyo, Serpentine Gallery London).
  - Selected Residencies, Honors & Collections.
  - Core mediums: Spatial Installations, Generative Systems, 3D Sculpture, Creative Direction.
- [ ] **Step 3: Test About section layout and typography**
- [ ] **Step 4: Commit About Section**
Run: `git commit -am "feat: implement Artist Practice and Exhibition History section"`

---

### Task 7: Contact Section & Interactive Modals

**Files:**
- Create: `portfolio-hero/src/ContactSection.jsx` & `ContactSection.css`
- Create: `portfolio-hero/src/ContactModal.jsx` & `ContactModal.css`
- Create: `portfolio-hero/src/ResumeModal.jsx` & `ResumeModal.css`

**Interfaces:**
- Produces: Studio inquiry form modal and comprehensive Exhibition CV modal.

- [ ] **Step 1: Implement `ContactModal.jsx` & `ContactModal.css`**
Editorial studio inquiry dialog (Select type: Commission, Exhibition, Press, Representation; inputs for name, email, details; submission confirmation).
- [ ] **Step 2: Implement `ResumeModal.jsx` & `ResumeModal.css`**
Exhibition CV with timeline, awards, education (Royal College of Art / Central Saint Martins alumni), and print trigger.
- [ ] **Step 3: Implement `ContactSection.jsx` & `ContactSection.css`**
Footer section with studio location (London / Tokyo / New York), direct email, and quick links.
- [ ] **Step 4: Test modals open/close and keyboard accessibility (`Escape` key)**
- [ ] **Step 5: Commit Contact & Modals**
Run: `git commit -am "feat: implement Studio Inquiry and Exhibition CV modals"`

---

### Task 8: Build Verification & Final Polish

**Files:**
- Verify all components assembled in `portfolio-hero/src/App.jsx`.

- [ ] **Step 1: Run production build**
Run: `npm run build` inside `portfolio-hero` to verify zero compile or bundle warnings.
- [ ] **Step 2: Verify runtime performance**
Ensure 60 FPS canvas loop, zero console warnings, perfect color match (`#e993a3`), and smooth scroll transitions.
- [ ] **Step 3: Final git commit**
Run: `git commit -am "chore: final build verification and polish"`
