import React, { useState } from 'react';
import HeroSection from './HeroSection';
import ProjectsSection from './ProjectsSection';
import AboutSection from './AboutSection';

export default function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  return (
    <HeroSection
      onOpenContact={() => setIsContactOpen(true)}
      onOpenResume={() => setIsResumeOpen(true)}
    >
      <ProjectsSection onOpenContact={() => setIsContactOpen(true)} />
      <AboutSection
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
      />
    </HeroSection>
  );
}
