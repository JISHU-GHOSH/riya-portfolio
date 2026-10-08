import React, { useEffect, useRef, useState } from 'react';

/**
 * CharacterCanvas
 * 
 * High-performance 60 FPS interactive character canvas.
 * Preloads 64 directional frames + 1 center eye-contact frame.
 * Renders exactly 1 frame per tick at 100% opacity with object-fit: cover math.
 * Implements continuous shortest-path angular lerp (FRAME_LERP = 0.18) with
 * two-phase deceleration to eliminate frame skips, and a 14% viewport radius
 * deadzone for direct frontal eye contact.
 */

const TOTAL_FRAMES = 64;
const DEADZONE_RADIUS = 0.14; // 14% of normalized viewport radius
const FRAME_LERP = 0.18;      // Smooth settling factor
const FACE_X_RATIO = 0.50;    // 50% horizontal center
const FACE_Y_RATIO = 0.40;    // 40% vertical face center
const IMG_ASPECT = 1920 / 1080;
const DRIFT_DURATION = 350;   // ms to return gaze to center on touch release

export default function CharacterCanvas({ className = '', style = {} }) {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const centerImgRef = useRef(null);
  const currentAngleRef = useRef(0);
  const cursorRef = useRef({ x: null, y: null });
  const driftRef = useRef({
    active: false,
    startTime: 0,
    startX: 0,
    startY: 0,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Preload all 65 WebP frames
  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL || '/';
    const framesPath = `${baseUrl.replace(/\/$/, '')}/frames/`;

    const loadedImgs = [];
    let loadedCount = 0;
    const totalCount = TOTAL_FRAMES + 1;

    const checkComplete = () => {
      loadedCount++;
      if (loadedCount >= totalCount) {
        setIsLoaded(true);
      }
    };

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      const fileName = String(i).padStart(3, '0') + '.webp';
      img.src = `${framesPath}${fileName}`;
      if (img.complete) {
        checkComplete();
      } else {
        img.onload = checkComplete;
        img.onerror = checkComplete;
      }
      loadedImgs.push(img);
    }

    const centerImg = new Image();
    centerImg.src = `${framesPath}center.webp`;
    if (centerImg.complete) {
      checkComplete();
    } else {
      centerImg.onload = checkComplete;
      centerImg.onerror = checkComplete;
    }

    imagesRef.current = loadedImgs;
    centerImgRef.current = centerImg;
  }, []);

  // 2. Main 60 FPS Render Loop & Input Handling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    let animationFrameId;

    const updateCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2.0);
      const width = window.innerWidth;
      const height = window.innerHeight;

      const targetW = Math.round(width * dpr);
      const targetH = Math.round(height * dpr);

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const startDriftToCenter = (faceX, faceY) => {
      const curX = cursorRef.current.x ?? faceX;
      const curY = cursorRef.current.y ?? faceY;
      driftRef.current = {
        active: true,
        startTime: performance.now(),
        startX: curX,
        startY: curY,
      };
    };

    // Pointer & Touch Handlers
    const onPointerMove = (e) => {
      driftRef.current.active = false;
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
    };

    const onPointerUp = (e) => {
      if (e.pointerType === 'touch') {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const canvasAspect = width / height;
        let drawW = width;
        let drawH = height;
        let drawX = 0;
        let drawY = 0;

        if (canvasAspect > IMG_ASPECT) {
          drawH = width / IMG_ASPECT;
          drawY = (height - drawH) / 2;
        } else {
          drawW = height * IMG_ASPECT;
          drawX = (width - drawW) / 2;
        }
        startDriftToCenter(drawX + FACE_X_RATIO * drawW, drawY + FACE_Y_RATIO * drawH);
      }
    };

    const onTouchMove = (e) => {
      if (e.touches && e.touches.length > 0) {
        driftRef.current.active = false;
        cursorRef.current.x = e.touches[0].clientX;
        cursorRef.current.y = e.touches[0].clientY;
      }
    };

    const onTouchEnd = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const canvasAspect = width / height;
      let drawW = width;
      let drawH = height;
      let drawX = 0;
      let drawY = 0;

      if (canvasAspect > IMG_ASPECT) {
        drawH = width / IMG_ASPECT;
        drawY = (height - drawH) / 2;
      } else {
        drawW = height * IMG_ASPECT;
        drawX = (width - drawW) / 2;
      }
      startDriftToCenter(drawX + FACE_X_RATIO * drawW, drawY + FACE_Y_RATIO * drawH);
    };

    const onMouseLeave = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const canvasAspect = width / height;
      let drawW = width;
      let drawH = height;
      let drawX = 0;
      let drawY = 0;

      if (canvasAspect > IMG_ASPECT) {
        drawH = width / IMG_ASPECT;
        drawY = (height - drawH) / 2;
      } else {
        drawW = height * IMG_ASPECT;
        drawX = (width - drawW) / 2;
      }
      startDriftToCenter(drawX + FACE_X_RATIO * drawW, drawY + FACE_Y_RATIO * drawH);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave, { passive: true });

    // Render loop
    const render = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2.0);

      // object-fit: cover coordinates
      const canvasAspect = width / height;
      let drawW, drawH, drawX, drawY;

      if (canvasAspect > IMG_ASPECT) {
        drawW = width;
        drawH = width / IMG_ASPECT;
        drawX = 0;
        drawY = (height - drawH) / 2;
      } else {
        drawH = height;
        drawW = height * IMG_ASPECT;
        drawX = (width - drawW) / 2;
        drawY = 0;
      }

      // Exact pixel coordinates of Riya's face in viewport
      const facePixelX = drawX + FACE_X_RATIO * drawW;
      const facePixelY = drawY + FACE_Y_RATIO * drawH;

      // Handle touch drift back to center
      if (driftRef.current.active) {
        const elapsed = performance.now() - driftRef.current.startTime;
        const progress = Math.min(elapsed / DRIFT_DURATION, 1.0);
        // Smooth ease-out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        cursorRef.current.x = driftRef.current.startX + (facePixelX - driftRef.current.startX) * ease;
        cursorRef.current.y = driftRef.current.startY + (facePixelY - driftRef.current.startY) * ease;
        if (progress >= 1.0) {
          driftRef.current.active = false;
        }
      }

      // Initialize cursor to face center if idle
      if (cursorRef.current.x === null || cursorRef.current.y === null) {
        cursorRef.current.x = facePixelX;
        cursorRef.current.y = facePixelY;
      }

      const dx = cursorRef.current.x - facePixelX;
      const dy = cursorRef.current.y - facePixelY;

      // Normalized distance relative to viewport bounds
      const normDx = dx / width;
      const normDy = dy / height;
      const dist = Math.hypot(normDx, normDy);

      const inDeadzone = dist < DEADZONE_RADIUS;

      // Cursor angle relative to face coordinates: atan2(-dy, dx)
      // Screen coordinates have Y positive downward, so -dy maps upwards to +Y
      const targetAngle = Math.atan2(-dy, dx);

      // Continuous shortest-path angle lerp
      let diff = targetAngle - currentAngleRef.current;
      while (diff < -Math.PI) diff += 2 * Math.PI;
      while (diff > Math.PI) diff -= 2 * Math.PI;

      // Two-phase deceleration:
      // Phase 1 (Far): Capped maximum angular step per tick (~2 frames at 60fps) to eliminate frame jumps
      // Phase 2 (Near): Smooth exponential settling via FRAME_LERP (0.18)
      const maxAngularStep = (2 * Math.PI / TOTAL_FRAMES) * 2.2;
      const rawStep = diff * FRAME_LERP;
      let step = rawStep;
      if (Math.abs(step) > maxAngularStep) {
        step = Math.sign(diff) * maxAngularStep;
      }

      currentAngleRef.current += step;

      // Normalize current angle into [0, 2 * Math.PI)
      while (currentAngleRef.current < 0) currentAngleRef.current += 2 * Math.PI;
      while (currentAngleRef.current >= 2 * Math.PI) currentAngleRef.current -= 2 * Math.PI;

      // Map continuous angle to frame index (0..63)
      const frameIndex = Math.round((currentAngleRef.current / (2 * Math.PI)) * TOTAL_FRAMES) % TOTAL_FRAMES;

      // Clear & fill canvas to ensure zero seams
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#e993a3';
      ctx.fillRect(0, 0, width, height);

      // Select frame: center frame in deadzone; directional frame otherwise
      let imgToDraw = null;
      if (inDeadzone && centerImgRef.current?.complete && centerImgRef.current.naturalWidth > 0) {
        imgToDraw = centerImgRef.current;
      } else if (imagesRef.current[frameIndex]?.complete && imagesRef.current[frameIndex].naturalWidth > 0) {
        imgToDraw = imagesRef.current[frameIndex];
      } else if (centerImgRef.current?.complete && centerImgRef.current.naturalWidth > 0) {
        imgToDraw = centerImgRef.current;
      }

      // Draw exactly ONE frame at 100% opacity
      if (imgToDraw) {
        ctx.drawImage(imgToDraw, drawX, drawY, drawW, drawH);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateCanvasSize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        backgroundColor: '#e993a3',
        zIndex: 0,
        ...style,
      }}
      aria-label="Interactive character portrait"
    />
  );
}
