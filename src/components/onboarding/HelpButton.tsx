import { useState, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';
import { canShowHelpButton } from '@/lib/onboarding';

export default function HelpButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show if user has seen onboarding
    if (canShowHelpButton()) {
      setIsVisible(true);
    }
  }, []);

  const handleClick = () => {
    // Dispatch custom event to start tour
    window.dispatchEvent(new CustomEvent('devtools:start-tour'));
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={handleClick}
      className="btn-icon touch-target"
      aria-label="Show help tour"
      title="Take a tour"
    >
      <HelpCircle size={20} />
    </button>
  );
}

