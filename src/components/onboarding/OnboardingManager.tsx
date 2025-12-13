import { useState, useEffect } from 'react';
import WelcomeModal from './WelcomeModal';
import TourGuide from './TourGuide';
import { hasSeenOnboarding } from '@/lib/onboarding';

export default function OnboardingManager() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    // Check if we should show welcome modal
    if (!hasSeenOnboarding()) {
      setShowWelcome(true);
    }

    // Listen for tour start events (from HelpButton)
    const handleStartTourEvent = () => {
      setShowWelcome(false);
      setShowTour(true);
    };

    window.addEventListener('devtools:start-tour', handleStartTourEvent);

    return () => {
      window.removeEventListener('devtools:start-tour', handleStartTourEvent);
    };
  }, []);

  const handleStartTour = () => {
    setShowWelcome(false);
    // Small delay to allow welcome modal to fade out
    setTimeout(() => {
      setShowTour(true);
    }, 350);
  };

  const handleSkip = () => {
    setShowWelcome(false);
    setShowTour(false);
  };

  const handleTourComplete = () => {
    setShowTour(false);
  };

  return (
    <>
      {showWelcome && (
        <WelcomeModal
          onStartTour={handleStartTour}
          onSkip={handleSkip}
        />
      )}
      <TourGuide
        isActive={showTour}
        onComplete={handleTourComplete}
        onSkip={handleSkip}
      />
    </>
  );
}

