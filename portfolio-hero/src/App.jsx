import React, { useState } from 'react';
import HeroSection from './HeroSection';
import ProjectsSection from './ProjectsSection';
import AboutSection from './AboutSection';
import ContactSection from './ContactSection';
import ContactModal from './ContactModal';
import ResumeModal from './ResumeModal';

/**
 * App
 * 
 * Root container wiring:
 * - HeroSection with gaze-tracking character canvas & custom physics cursor
 * - ProjectsSection with 4 featured masterworks & curatorial lightbox
 * - AboutSection with artist statement, disciplines, chronology & honors
 * - ContactSection with editorial footer, direct email copy & studio locations
 * - Interactive ContactModal ("Studio Inquiry")
 * - Interactive ResumeModal ("Curriculum Vitae — Riya" with print capability)
 */
export default function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  return (
    <>
      <HeroSection
        onOpenContact={() => setIsContactOpen(true)}
        onOpenResume={() => setIsResumeOpen(true)}
      >
        <ProjectsSection onOpenContact={() => setIsContactOpen(true)} />
        <AboutSection
          onOpenResume={() => setIsResumeOpen(true)}
          onOpenContact={() => setIsContactOpen(true)}
        />
        <ContactSection
          onOpenContact={() => setIsContactOpen(true)}
          onOpenResume={() => setIsResumeOpen(true)}
        />
      </HeroSection>

      {/* Interactive Studio Inquiry Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* Interactive Curriculum Vitae Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </>
  );
}
