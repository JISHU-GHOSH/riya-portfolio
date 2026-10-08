import React, { useState } from 'react';
import './ProjectMockup.css';

/**
 * ProjectMockup
 * 
 * High-fidelity generative visual artwork renderer for Riya's featured works:
 * - ethereal-resonance: glowing light rays, undulating chromatic gradients, spatial harmonic waves
 * - chromata: rich tactile chromatic gradients, organic layered fluid ribbons, deep color fields
 * - flora-obscura: surreal botanical forms, delicate organic foliage silhouettes, luminescent bioluminescent spores
 * - metamorphosis: geometric kinetic lattice, morphing wireframe ribbons, iridescent metallic sheen
 * 
 * Pure vector SVG & CSS art: zero external assets, crisp at all resolutions.
 */
export default function ProjectMockup({
  id = 'ethereal-resonance',
  title = '',
  className = '',
  isLightbox = false,
}) {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  return (
    <div
      className={`project-mockup-wrapper ${isLightbox ? 'is-lightbox-preview' : ''} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        '--tilt-x': `${mouseOffset.x}px`,
        '--tilt-y': `${mouseOffset.y}px`,
      }}
    >
      <div className="mockup-noise-overlay" />
      <div className="mockup-vignette" />

      {id === 'ethereal-resonance' && <EtherealResonanceSVG />}
      {id === 'chromata' && <ChromataSVG />}
      {id === 'flora-obscura' && <FloraObscuraSVG />}
      {id === 'metamorphosis' && <MetamorphosisSVG />}

      <div className="mockup-watermark">
        <span className="mockup-badge">
          <span className="mockup-pulse-dot" />
          <span>{title || id.replace('-', ' ').toUpperCase()}</span>
        </span>
        <span className="mockup-id-tag">
          {id === 'ethereal-resonance' && 'SPATIAL LIGHT // 432 HZ'}
          {id === 'chromata' && 'FLUID DYNAMICS // 8K'}
          {id === 'flora-obscura' && 'CIRCADIAN // 2.4M PARTICLES'}
          {id === 'metamorphosis' && 'TITANIUM LATTICE // KINETIC'}
        </span>
      </div>
    </div>
  );
}

// 1. Ethereal Resonance: Volumetric Light Rays & Harmonic Waves
function EtherealResonanceSVG() {
  return (
    <svg
      className="project-mockup-svg"
      viewBox="0 0 600 400"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="er-bg" cx="50%" cy="45%" r="65%">
          <stop offset="0%" stopColor="#2c1424" />
          <stop offset="50%" stopColor="#170c14" />
          <stop offset="100%" stopColor="#0b0509" />
        </radialGradient>

        <radialGradient id="er-core-glow" cx="50%" cy="45%" r="35%">
          <stop offset="0%" stopColor="#ffe4ea" stopOpacity="0.95" />
          <stop offset="20%" stopColor="#e993a3" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#dc8293" stopOpacity="0.4" />
          <stop offset="85%" stopColor="#3d5a45" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#170c14" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="er-ray-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="35%" stopColor="#e993a3" stopOpacity="0.4" />
          <stop offset="80%" stopColor="#3d5a45" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#1a0f18" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="er-ray-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fff3d9" stopOpacity="0.7" />
          <stop offset="40%" stopColor="#dc8293" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#0b0509" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="er-wave-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3d5a45" stopOpacity="0.2" />
          <stop offset="25%" stopColor="#e993a3" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="75%" stopColor="#e993a3" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#3d5a45" stopOpacity="0.2" />
        </linearGradient>

        <linearGradient id="er-wave-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e993a3" stopOpacity="0.1" />
          <stop offset="40%" stopColor="#3d5a45" stopOpacity="0.6" />
          <stop offset="60%" stopColor="#a7f3d0" stopOpacity="0.8" />
          <stop offset="80%" stopColor="#dc8293" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#e993a3" stopOpacity="0.1" />
        </linearGradient>

        <filter id="er-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <filter id="er-soft-blur">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* Base Dark Field */}
      <rect width="600" height="400" fill="url(#er-bg)" />

      {/* Volumetric Glowing Light Rays */}
      <g className="anim-rays">
        <polygon points="300,180 50,0 120,0" fill="url(#er-ray-grad-1)" opacity="0.65" />
        <polygon points="300,180 200,0 280,0" fill="url(#er-ray-grad-2)" opacity="0.8" />
        <polygon points="300,180 340,0 420,0" fill="url(#er-ray-grad-1)" opacity="0.75" />
        <polygon points="300,180 500,0 580,0" fill="url(#er-ray-grad-2)" opacity="0.6" />
        <polygon points="300,180 600,120 600,190" fill="url(#er-ray-grad-1)" opacity="0.5" />
        <polygon points="300,180 600,280 600,360" fill="url(#er-ray-grad-2)" opacity="0.4" />
        <polygon points="300,180 0,110 0,180" fill="url(#er-ray-grad-2)" opacity="0.5" />
        <polygon points="300,180 0,260 0,330" fill="url(#er-ray-grad-1)" opacity="0.4" />
      </g>

      {/* Radiant Focal Core */}
      <circle cx="300" cy="180" r="140" fill="url(#er-core-glow)" filter="url(#er-glow)" />
      <circle cx="300" cy="180" r="45" fill="#ffe4ea" opacity="0.4" filter="url(#er-glow)" />
      <circle cx="300" cy="180" r="14" fill="#ffffff" opacity="0.9" filter="url(#er-glow)" />

      {/* Undulating Chromatic Harmonic Wave Arrays */}
      <g className="anim-harmonic-1">
        <path
          d="M -50,220 C 100,150 200,280 300,200 C 400,120 500,260 650,210"
          fill="none"
          stroke="url(#er-wave-grad-1)"
          strokeWidth="2.5"
          filter="url(#er-glow)"
        />
        <path
          d="M -50,235 C 90,165 210,295 300,215 C 390,135 510,275 650,225"
          fill="none"
          stroke="url(#er-wave-grad-1)"
          strokeWidth="1.2"
          opacity="0.8"
        />
        <path
          d="M -50,250 C 80,180 220,310 300,230 C 380,150 520,290 650,240"
          fill="none"
          stroke="url(#er-wave-grad-2)"
          strokeWidth="1.5"
          opacity="0.7"
        />
      </g>

      <g className="anim-harmonic-2">
        <path
          d="M -50,140 C 120,230 220,100 300,170 C 380,240 480,110 650,160"
          fill="none"
          stroke="url(#er-wave-grad-2)"
          strokeWidth="2.2"
          filter="url(#er-glow)"
        />
        <path
          d="M -50,155 C 130,245 210,115 300,185 C 390,255 470,125 650,175"
          fill="none"
          stroke="url(#er-wave-grad-1)"
          strokeWidth="1"
          opacity="0.75"
        />
      </g>

      {/* Spatial Resonance Coordinate Grid & Harmonic Nodes */}
      <g opacity="0.35" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="3,6">
        <line x1="300" y1="0" x2="300" y2="400" />
        <line x1="0" y1="180" x2="600" y2="180" />
        <circle cx="300" cy="180" r="90" fill="none" />
        <circle cx="300" cy="180" r="160" fill="none" />
        <circle cx="300" cy="180" r="230" fill="none" />
      </g>

      {/* Floating Harmonic Light Nodes */}
      <circle cx="160" cy="190" r="3" fill="#ffffff" filter="url(#er-glow)" />
      <circle cx="440" cy="170" r="3" fill="#ffffff" filter="url(#er-glow)" />
      <circle cx="240" cy="240" r="2" fill="#e993a3" />
      <circle cx="360" cy="120" r="2.5" fill="#a7f3d0" />
      <circle cx="210" cy="140" r="1.5" fill="#ffffff" />
      <circle cx="390" cy="220" r="2" fill="#ffffff" />
    </svg>
  );
}

// 2. Chromata: Tactile Chromatic Gradients & Layered Fluid Ribbons
function ChromataSVG() {
  return (
    <svg
      className="project-mockup-svg"
      viewBox="0 0 600 400"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="chr-base" cx="40%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#2c111c" />
          <stop offset="50%" stopColor="#180911" />
          <stop offset="100%" stopColor="#090306" />
        </radialGradient>

        <linearGradient id="chr-ribbon-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff758c" />
          <stop offset="35%" stopColor="#ff7eb3" />
          <stop offset="70%" stopColor="#e993a3" />
          <stop offset="100%" stopColor="#7928ca" />
        </linearGradient>

        <linearGradient id="chr-ribbon-2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffb199" />
          <stop offset="40%" stopColor="#dc8293" />
          <stop offset="70%" stopColor="#3d5a45" />
          <stop offset="100%" stopColor="#1e3a2f" />
        </linearGradient>

        <linearGradient id="chr-ribbon-3" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#fb7185" stopOpacity="0.9" />
          <stop offset="80%" stopColor="#fed7aa" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#e993a3" stopOpacity="0.6" />
        </linearGradient>

        <radialGradient id="chr-warm-pool" cx="70%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#fbcfe8" stopOpacity="0.75" />
          <stop offset="45%" stopColor="#e993a3" stopOpacity="0.45" />
          <stop offset="85%" stopColor="#2c111c" stopOpacity="0" />
        </radialGradient>

        <filter id="chr-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="12" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Deep Canvas Field */}
      <rect width="600" height="400" fill="url(#chr-base)" />

      {/* Ambient Fluid Glow Pool */}
      <circle cx="420" cy="140" r="180" fill="url(#chr-warm-pool)" filter="url(#chr-glow)" />

      {/* Layer 1: Deep Fluid Ribbon Swell */}
      <g className="anim-fluid-ribbon-1">
        <path
          d="M -60,350 Q 80,120 260,220 T 520,110 Q 620,60 660,180 L 660,450 L -60,450 Z"
          fill="url(#chr-ribbon-2)"
          opacity="0.82"
          filter="url(#chr-glow)"
        />
      </g>

      {/* Layer 2: Main Tactile Chromatic Ribbon */}
      <g className="anim-fluid-ribbon-2">
        <path
          d="M -40,160 C 120,40 240,320 400,210 C 510,130 560,260 650,220 L 650,420 L -40,420 Z"
          fill="url(#chr-ribbon-1)"
          opacity="0.9"
        />
      </g>

      {/* Layer 3: Dynamic High-Luminance Liquid Wave */}
      <g className="anim-fluid-glow">
        <path
          d="M -20,260 C 140,180 220,380 380,270 C 490,190 560,300 640,240"
          fill="none"
          stroke="url(#chr-ribbon-3)"
          strokeWidth="28"
          strokeLinecap="round"
          filter="url(#chr-glow)"
          style={{ mixBlendMode: 'screen' }}
        />
        <path
          d="M -20,260 C 140,180 220,380 380,270 C 490,190 560,300 640,240"
          fill="none"
          stroke="#ffffff"
          strokeWidth="3.5"
          opacity="0.8"
        />
      </g>

      {/* Fine Curvilinear Topographic Viscosity Contours */}
      <g opacity="0.45" stroke="#ffffff" strokeWidth="0.8" fill="none">
        <path d="M 0,210 C 160,130 240,330 400,220 C 510,140 570,270 600,240" />
        <path d="M 0,195 C 150,115 250,315 400,205 C 500,125 580,255 600,225" />
        <path d="M 0,225 C 170,145 230,345 400,235 C 520,155 560,285 600,255" />
        <path d="M 0,240 C 180,160 220,360 400,250 C 530,170 550,300 600,270" />
      </g>

      {/* Fluid Specular Droplets */}
      <circle cx="280" cy="180" r="3.5" fill="#ffffff" opacity="0.9" filter="url(#chr-glow)" />
      <circle cx="340" cy="130" r="2.5" fill="#ffe4ea" opacity="0.8" />
      <circle cx="450" cy="170" r="4" fill="#ffffff" opacity="0.85" filter="url(#chr-glow)" />
      <circle cx="190" cy="270" r="2" fill="#ffd1dc" opacity="0.7" />
    </svg>
  );
}

// 3. Flora Obscura: Surreal Botanical Forms & Bioluminescent Spores
function FloraObscuraSVG() {
  return (
    <svg
      className="project-mockup-svg"
      viewBox="0 0 600 400"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="fo-bg" cx="50%" cy="70%" r="75%">
          <stop offset="0%" stopColor="#1e1823" />
          <stop offset="45%" stopColor="#120c15" />
          <stop offset="100%" stopColor="#070308" />
        </radialGradient>

        <linearGradient id="fo-stem-grad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#1b281f" />
          <stop offset="40%" stopColor="#3d5a45" />
          <stop offset="75%" stopColor="#5eead4" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>

        <radialGradient id="fo-spore-cyan" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#38bdf8" stopOpacity="0.9" />
          <stop offset="75%" stopColor="#0284c7" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="fo-spore-pink" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#f472b6" stopOpacity="0.9" />
          <stop offset="80%" stopColor="#be185d" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#be185d" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="fo-spore-lime" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#a3e635" stopOpacity="0.9" />
          <stop offset="80%" stopColor="#4d7c0f" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#4d7c0f" stopOpacity="0" />
        </radialGradient>

        <filter id="fo-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Dark Nocturnal Soil Canvas */}
      <rect width="600" height="400" fill="url(#fo-bg)" />

      {/* Background Soft Bioluminescent Aura */}
      <ellipse cx="300" cy="240" rx="200" ry="120" fill="url(#fo-spore-cyan)" opacity="0.18" filter="url(#fo-glow)" />
      <ellipse cx="360" cy="180" rx="140" ry="100" fill="url(#fo-spore-pink)" opacity="0.22" filter="url(#fo-glow)" />

      {/* Procedural Botanical Silhouette / Branching Fronds */}
      <g className="anim-flora-frond">
        {/* Main Central Stem */}
        <path
          d="M 300,410 Q 305,280 290,200 T 320,80"
          fill="none"
          stroke="url(#fo-stem-grad)"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Left Fronds */}
        <path
          d="M 295,290 C 240,280 180,240 160,200 C 190,215 250,250 293,270"
          fill="#1b2e23"
          stroke="#5eead4"
          strokeWidth="0.8"
          opacity="0.85"
        />
        <path
          d="M 290,220 C 230,195 190,150 170,110 C 200,135 250,175 288,205"
          fill="#251a28"
          stroke="#ec4899"
          strokeWidth="0.8"
          opacity="0.85"
        />
        <path
          d="M 300,150 C 255,120 220,80 210,40 C 235,65 270,105 298,138"
          fill="#1b2e23"
          stroke="#a3e635"
          strokeWidth="0.75"
          opacity="0.85"
        />

        {/* Right Fronds */}
        <path
          d="M 302,320 C 370,300 440,270 470,220 C 435,245 370,275 304,300"
          fill="#1b2e23"
          stroke="#5eead4"
          strokeWidth="0.8"
          opacity="0.85"
        />
        <path
          d="M 295,250 C 365,225 425,185 450,140 C 415,165 355,205 297,235"
          fill="#251a28"
          stroke="#ec4899"
          strokeWidth="0.8"
          opacity="0.85"
        />
        <path
          d="M 305,175 C 360,145 405,100 420,60 C 390,85 345,125 308,162"
          fill="#1b2e23"
          stroke="#a3e635"
          strokeWidth="0.75"
          opacity="0.85"
        />

        {/* Delicate Tendrils & Vascular Nodes */}
        <path
          d="M 320,80 Q 335,50 325,30 Q 310,45 315,75"
          fill="none"
          stroke="#ec4899"
          strokeWidth="1.5"
          filter="url(#fo-glow)"
        />
      </g>

      {/* Bioluminescent Spores (Group 1: Cyan) */}
      <g className="anim-spore-1">
        <circle cx="170" cy="110" r="9" fill="url(#fo-spore-cyan)" filter="url(#fo-glow)" />
        <circle cx="280" cy="90" r="6" fill="url(#fo-spore-cyan)" filter="url(#fo-glow)" />
        <circle cx="430" cy="190" r="8" fill="url(#fo-spore-cyan)" filter="url(#fo-glow)" />
        <circle cx="360" cy="270" r="5" fill="url(#fo-spore-cyan)" />
        <circle cx="140" cy="230" r="4" fill="url(#fo-spore-cyan)" />
      </g>

      {/* Bioluminescent Spores (Group 2: Radiant Magenta) */}
      <g className="anim-spore-2">
        <circle cx="325" cy="30" r="11" fill="url(#fo-spore-pink)" filter="url(#fo-glow)" />
        <circle cx="450" cy="140" r="8" fill="url(#fo-spore-pink)" filter="url(#fo-glow)" />
        <circle cx="160" cy="200" r="7" fill="url(#fo-spore-pink)" filter="url(#fo-glow)" />
        <circle cx="240" cy="160" r="5" fill="url(#fo-spore-pink)" />
        <circle cx="390" cy="90" r="6" fill="url(#fo-spore-pink)" filter="url(#fo-glow)" />
      </g>

      {/* Bioluminescent Spores (Group 3: Lime Chartreuse) */}
      <g className="anim-spore-3">
        <circle cx="210" cy="40" r="8" fill="url(#fo-spore-lime)" filter="url(#fo-glow)" />
        <circle cx="420" cy="60" r="7" fill="url(#fo-spore-lime)" filter="url(#fo-glow)" />
        <circle cx="470" cy="220" r="9" fill="url(#fo-spore-lime)" filter="url(#fo-glow)" />
        <circle cx="250" cy="250" r="4.5" fill="url(#fo-spore-lime)" />
        <circle cx="310" cy="180" r="3.5" fill="url(#fo-spore-lime)" />
      </g>

      {/* Tiny Drifting Light Dust */}
      <g fill="#ffffff" opacity="0.8">
        <circle cx="180" cy="70" r="1.2" />
        <circle cx="225" cy="130" r="1.5" />
        <circle cx="350" cy="60" r="1.2" />
        <circle cx="470" cy="110" r="1" />
        <circle cx="410" cy="240" r="1.5" />
        <circle cx="270" cy="310" r="1.2" />
        <circle cx="190" cy="280" r="1" />
      </g>
    </svg>
  );
}

// 4. Metamorphosis: Geometric Kinetic Lattice & Iridescent Metallic Sheen
function MetamorphosisSVG() {
  return (
    <svg
      className="project-mockup-svg"
      viewBox="0 0 600 400"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="meta-bg" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#251a23" />
          <stop offset="55%" stopColor="#140c13" />
          <stop offset="100%" stopColor="#080307" />
        </radialGradient>

        <linearGradient id="meta-iridescent-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="25%" stopColor="#ec4899" />
          <stop offset="55%" stopColor="#fbbf24" />
          <stop offset="85%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>

        <linearGradient id="meta-chrome-edge" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#d1d5db" stopOpacity="0.7" />
          <stop offset="70%" stopColor="#4b5563" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#e993a3" stopOpacity="0.8" />
        </linearGradient>

        <radialGradient id="meta-core-flare" cx="50%" cy="50%" r="40%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="30%" stopColor="#e993a3" stopOpacity="0.5" />
          <stop offset="70%" stopColor="#6366f1" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#080307" stopOpacity="0" />
        </radialGradient>

        <filter id="meta-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="9" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Dark Titanium Base */}
      <rect width="600" height="400" fill="url(#meta-bg)" />

      {/* Central Radiance Flare */}
      <circle cx="300" cy="200" r="160" fill="url(#meta-core-flare)" filter="url(#meta-glow)" />

      {/* Perspective Grid Plane */}
      <g opacity="0.25" stroke="#ffffff" strokeWidth="0.6">
        <line x1="300" y1="200" x2="0" y2="0" />
        <line x1="300" y1="200" x2="600" y2="0" />
        <line x1="300" y1="200" x2="0" y2="400" />
        <line x1="300" y1="200" x2="600" y2="400" />
        <line x1="300" y1="200" x2="0" y2="200" strokeDasharray="4,6" />
        <line x1="300" y1="200" x2="600" y2="200" strokeDasharray="4,6" />
      </g>

      {/* Outer Rotating Kinetic Rings */}
      <g className="anim-lattice-spin">
        <circle
          cx="300"
          cy="200"
          r="140"
          fill="none"
          stroke="url(#meta-iridescent-1)"
          strokeWidth="1.5"
          strokeDasharray="16,8,4,8"
          opacity="0.8"
        />
        <circle
          cx="300"
          cy="200"
          r="120"
          fill="none"
          stroke="url(#meta-chrome-edge)"
          strokeWidth="1"
          strokeDasharray="30,12"
          opacity="0.65"
        />
        <circle
          cx="300"
          cy="200"
          r="95"
          fill="none"
          stroke="#ffffff"
          strokeWidth="0.8"
          strokeDasharray="6,12"
          opacity="0.5"
        />

        {/* Orbiting Kinetic Vertex Pins */}
        <circle cx="440" cy="200" r="4.5" fill="#ffffff" filter="url(#meta-glow)" />
        <circle cx="160" cy="200" r="4.5" fill="#38bdf8" filter="url(#meta-glow)" />
        <circle cx="300" cy="60" r="4.5" fill="#ec4899" filter="url(#meta-glow)" />
        <circle cx="300" cy="340" r="4.5" fill="#fbbf24" filter="url(#meta-glow)" />
      </g>

      {/* Inner Morphing Isometric Lattice */}
      <g className="anim-lattice-inner">
        {/* Parametric Octahedron Facets */}
        <polygon
          points="300,90 405,150 405,250 300,310 195,250 195,150"
          fill="none"
          stroke="url(#meta-iridescent-1)"
          strokeWidth="2.2"
          filter="url(#meta-glow)"
        />
        <polygon
          points="300,120 375,160 375,240 300,280 225,240 225,160"
          fill="rgba(233, 147, 163, 0.08)"
          stroke="url(#meta-chrome-edge)"
          strokeWidth="1.8"
        />

        {/* Isometric Internal Cross-Lines */}
        <line x1="300" y1="90" x2="300" y2="310" stroke="url(#meta-iridescent-1)" strokeWidth="1.5" />
        <line x1="195" y1="150" x2="405" y2="250" stroke="url(#meta-chrome-edge)" strokeWidth="1.2" />
        <line x1="195" y1="250" x2="405" y2="150" stroke="url(#meta-chrome-edge)" strokeWidth="1.2" />
        <line x1="300" y1="200" x2="375" y2="160" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="300" y1="200" x2="225" y2="240" stroke="#ffffff" strokeWidth="1.5" />

        {/* Central Kinetic Nucleus */}
        <polygon
          points="300,170 330,185 330,215 300,230 270,215 270,185"
          fill="url(#meta-iridescent-1)"
          opacity="0.75"
          filter="url(#meta-glow)"
        />
        <circle cx="300" cy="200" r="6" fill="#ffffff" filter="url(#meta-glow)" />
      </g>

      {/* Metallic Accent Sparkles */}
      <g fill="#ffffff" opacity="0.9">
        <path d="M 300,80 L 302,88 L 310,90 L 302,92 L 300,100 L 298,92 L 290,90 L 298,88 Z" />
        <path d="M 410,140 L 411,145 L 416,146 L 411,147 L 410,152 L 409,147 L 404,146 L 409,145 Z" />
        <path d="M 190,260 L 191,265 L 196,266 L 191,267 L 190,272 L 189,267 L 184,266 L 189,265 Z" />
      </g>
    </svg>
  );
}
