import React, { useState } from 'react';
import HeroSection from './HeroSection';

export default function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  return (
    <HeroSection
      onOpenContact={() => setIsContactOpen(true)}
      onOpenResume={() => setIsResumeOpen(true)}
    />
  );
}
