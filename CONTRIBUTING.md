# Contributing & Architecture Guide

Thank you for contributing to Riya's interactive visual artist portfolio!

## Architecture Highlights

1. **Pure Vector Canvas**:
   - `CharacterCanvas.jsx` renders directly to an HTML5 canvas at `window.devicePixelRatio` (capped at 2.0).
   - Only ONE image is drawn to the canvas per animation tick at 100% opacity.
   - Drawing uses object-fit cover mathematics based on a 16:9 native aspect ratio (`1920 / 1080`).

2. **3D Facial Bindi Engine**:
   - `add_bindi.py` calculates exact 3D anatomical surface coordinates from MediaPipe FaceMesh to ensure the bindi is anchored to her skin and rotates with her head angle.

3. **Web Audio Synthesizer**:
   - `soundEffects.js` generates audio directly via the browser's `AudioContext`.
   - No external audio MP3/WAV assets are loaded over the network.
   - The user's mute preference is persisted in memory and toggled via the speaker icon in the navigation bar.

4. **Responsive Breakpoints**:
   - Desktop: full cursor tracking with trailing magnetic ring.
   - Mobile / Tablet: touch gestures steer gaze direction, releasing smoothly drifts gaze back to center over ~350ms.

## Local Development Guidelines

1. Run `npm run dev` from the repository root.
2. Ensure `npm run build` passes before submitting PRs or deploying.
3. Keep public WebP frames optimized and do not commit large uncompressed video files.
