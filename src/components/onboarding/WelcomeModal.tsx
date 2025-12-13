import { useState, useEffect } from 'react';
import { X, Sparkles, Search, Navigation, MessageCircle, Wrench } from 'lucide-react';
import { hasSeenOnboarding, markOnboardingSeen } from '@/lib/onboarding';

interface Props {
  onStartTour: () => void;
  onSkip: () => void;
}

export default function WelcomeModal({ onStartTour, onSkip }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Check if user has already seen onboarding
    if (hasSeenOnboarding()) {
      return;
    }

    // Delay appearance to allow page to load
    const timer = setTimeout(() => {
      setIsMounted(true);
      // Small delay for animation
      setTimeout(() => setIsVisible(true), 50);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleSkip = () => {
    markOnboardingSeen();
    setIsVisible(false);
    setTimeout(() => {
      onSkip();
    }, 300);
  };

  const handleStartTour = () => {
    markOnboardingSeen();
    setIsVisible(false);
    setTimeout(() => {
      onStartTour();
    }, 300);
  };

  const handleGotIt = () => {
    markOnboardingSeen();
    setIsVisible(false);
    setTimeout(() => {
      onSkip();
    }, 300);
  };

  if (!isMounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[100] transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={handleSkip}
      />

      {/* Modal */}
      <div
        className={`fixed left-1/2 top-1/2 z-[101] w-[90%] max-w-lg -translate-x-1/2 -translate-y-1/2 transform transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        style={{
          backgroundColor: 'var(--bg-elevated)',
          border: '1px solid var(--border-primary)',
          borderRadius: '1.5rem',
          boxShadow: 'var(--shadow-xl)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
          {/* Close Button */}
          <button
            onClick={handleSkip}
            className="absolute right-4 top-4 btn-icon"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: 'var(--brand-primary-light)' }}>
              <Sparkles size={32} style={{ color: 'var(--brand-primary)' }} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Welcome to DevTools! 🎉
            </h2>
            <p className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
              Your all-in-one developer toolkit. Here's what you can do:
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <Search size={20} style={{ color: 'var(--brand-primary)' }} />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                  Search Tools
                </h3>
                <p className="text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
                  Use the search bar or press <kbd className="px-1.5 py-0.5 rounded border text-xs" style={{ borderColor: 'var(--border-primary)' }}>⌘K</kbd> to find any tool instantly
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <Navigation size={20} style={{ color: 'var(--brand-primary)' }} />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                  Browse Categories
                </h3>
                <p className="text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
                  Explore tools by category - JSON, Text, Code, and more
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <MessageCircle size={20} style={{ color: 'var(--brand-primary)' }} />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                  AI Assistant
                </h3>
                <p className="text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
                  Ask our assistant to find tools or get help - just click the chat button
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <Wrench size={20} style={{ color: 'var(--brand-primary)' }} />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                  Easy to Use
                </h3>
                <p className="text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
                  All tools run locally in your browser - fast, free, and private
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleStartTour}
              className="btn-primary flex-1"
            >
              Take Tour
            </button>
            <button
              onClick={handleGotIt}
              className="btn-secondary flex-1"
            >
              Got it
            </button>
          </div>

          <button
            onClick={handleSkip}
            className="w-full mt-3 text-xs text-center transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            Skip for now
          </button>
        </div>
      </div>
    </>
  );
}

