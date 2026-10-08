import React, { useState } from 'react';
import HeroSection from './HeroSection';
import ProjectsSection from './ProjectsSection';

export default function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  return (
    <HeroSection
      onOpenContact={() => setIsContactOpen(true)}
      onOpenResume={() => setIsResumeOpen(true)}
    >
      <ProjectsSection onOpenContact={() => setIsContactOpen(true)} />
    </HeroSection>
  );
}
