import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight, Search, Navigation, MessageCircle, Wrench } from 'lucide-react';
import { markTourCompleted, setTourStep } from '@/lib/onboarding';

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  selector: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  onlyOnHomepage?: boolean;
  onlyOnToolPage?: boolean;
}

const tourSteps: TourStep[] = [
  {
    id: 'search',
    title: 'Search Tools',
    description: 'Use the search bar to quickly find any tool. Press ⌘K (or Ctrl+K) to focus it instantly.',
    icon: <Search size={20} />,
    selector: 'input[type="text"][placeholder*="Search"]',
    position: 'bottom',
    onlyOnHomepage: false,
  },
  {
    id: 'navigation',
    title: 'Browse Categories',
    description: 'Navigate through tool categories using the menu. Scroll down to see all available tools organized by category.',
    icon: <Navigation size={20} />,
    selector: 'nav a[href*="#"]',
    position: 'bottom',
    onlyOnHomepage: true,
  },
  {
    id: 'assistant',
    title: 'AI Assistant',
    description: 'Click the chat button to get help finding tools or ask questions. The assistant can guide you to the right tool!',
    icon: <MessageCircle size={20} />,
    selector: 'button[aria-label="Open assistant"]',
    position: 'top',
    onlyOnHomepage: false,
  },
  {
    id: 'tool-usage',
    title: 'Using Tools',
    description: 'Each tool has a simple interface. Paste your data, adjust settings if needed, and get instant results. All processing happens in your browser!',
    icon: <Wrench size={20} />,
    selector: '.tool-panel',
    position: 'top',
    onlyOnToolPage: true,
  },
];

interface Props {
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export default function TourGuide({ isActive, onComplete, onSkip }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const [isHomepage, setIsHomepage] = useState(false);
  const [isToolPage, setIsToolPage] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      const isHome = pathname === '/' || pathname === '/index.html';
      setIsHomepage(isHome);
      setIsToolPage(!isHome && pathname !== '/about' && pathname !== '/about/');
    }
  }, []);

  // Filter steps based on current page
  const availableSteps = useMemo(() => {
    return tourSteps.filter(step => {
      if (step.onlyOnHomepage && !isHomepage) return false;
      if (step.onlyOnToolPage && !isToolPage) return false;
      return true;
    });
  }, [isHomepage, isToolPage]);

  const updateTargetElement = useCallback(() => {
    if (!isActive || currentStep >= availableSteps.length) return;

    const step = availableSteps[currentStep];
    
    // Retry finding element with a delay
    const findElement = (retries = 3) => {
      const element = document.querySelector(step.selector) as HTMLElement;

      if (element) {
        setTargetElement(element);
        // Small delay to ensure element is fully rendered
        setTimeout(() => {
          calculateTooltipPosition(element, step.position || 'bottom');
          updateSpotlightRect(element);
          // Scroll element into view if needed
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      } else if (retries > 0) {
        // Retry after a short delay
        setTimeout(() => findElement(retries - 1), 300);
      } else {
        // Element not found after retries, skip to next step or complete
        if (currentStep < availableSteps.length - 1) {
          setTimeout(() => setCurrentStep(prev => prev + 1), 500);
        } else {
          handleComplete();
        }
      }
    };

    findElement();
  }, [isActive, currentStep, availableSteps]);

  const updateSpotlightRect = (element: HTMLElement) => {
    setSpotlightRect(element.getBoundingClientRect());
  };

  const calculateTooltipPosition = (element: HTMLElement, position: string) => {
    const rect = element.getBoundingClientRect();
    const tooltip = tooltipRef.current;
    if (!tooltip) return;

    const tooltipRect = tooltip.getBoundingClientRect();
    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = rect.top - tooltipRect.height - 16;
        left = rect.left + rect.width / 2 - tooltipRect.width / 2;
        break;
      case 'bottom':
        top = rect.bottom + 16;
        left = rect.left + rect.width / 2 - tooltipRect.width / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2 - tooltipRect.height / 2;
        left = rect.left - tooltipRect.width - 16;
        break;
      case 'right':
        top = rect.top + rect.height / 2 - tooltipRect.height / 2;
        left = rect.right + 16;
        break;
    }

    // Keep tooltip within viewport
    const padding = 16;
    top = Math.max(padding, Math.min(top, window.innerHeight - tooltipRect.height - padding));
    left = Math.max(padding, Math.min(left, window.innerWidth - tooltipRect.width - padding));

    setTooltipPosition({ top, left });
  };

  useEffect(() => {
    if (!isActive) return;

    // Wait for DOM to be ready
    const timer = setTimeout(() => {
      updateTargetElement();
    }, 100);

    // Update on scroll/resize
    const handleUpdate = () => {
      if (targetElement) {
        updateSpotlightRect(targetElement);
        calculateTooltipPosition(targetElement, availableSteps[currentStep]?.position || 'bottom');
      } else {
        updateTargetElement();
      }
    };
    window.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('resize', handleUpdate);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [isActive, currentStep, availableSteps, targetElement]);

  const handleNext = () => {
    if (currentStep < availableSteps.length - 1) {
      setCurrentStep(prev => {
        const next = prev + 1;
        setTourStep(next);
        return next;
      });
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => {
        const prevStep = prev - 1;
        setTourStep(prevStep);
        return prevStep;
      });
    }
  };

  const handleComplete = () => {
    markTourCompleted();
    setTourStep(0);
    onComplete();
  };

  const handleSkip = () => {
    setTourStep(0);
    onSkip();
  };

  if (!isActive || availableSteps.length === 0) return null;

  const step = availableSteps[currentStep];
  const progress = ((currentStep + 1) / availableSteps.length) * 100;

  return (
    <>
      {/* Overlay with spotlight */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[90] transition-opacity duration-300"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
        onClick={handleSkip}
      >
        {targetElement && spotlightRect && (
          <div
            className="absolute border-2 rounded-lg transition-all duration-300"
            style={{
              top: spotlightRect.top - 4,
              left: spotlightRect.left - 4,
              width: spotlightRect.width + 8,
              height: spotlightRect.height + 8,
              borderColor: 'var(--brand-primary)',
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6), 0 0 20px rgba(14, 165, 233, 0.5)',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>

      {/* Tooltip */}
      {targetElement && (
        <div
          ref={tooltipRef}
          className="fixed z-[91] w-[90%] max-w-sm animate-fade-in"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-primary)',
            borderRadius: '1rem',
            boxShadow: 'var(--shadow-xl)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-5">
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
              <div
                className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'var(--brand-primary-light)' }}
              >
                <div style={{ color: 'var(--brand-primary)' }}>{step.icon}</div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base mb-1" style={{ color: 'var(--text-primary)' }}>
                  {step.title}
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {step.description}
                </p>
              </div>
              <button
                onClick={handleSkip}
                className="btn-icon flex-shrink-0"
                aria-label="Skip tour"
              >
                <X size={18} />
              </button>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                <span>Step {currentStep + 1} of {availableSteps.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
              >
                <div
                  className="h-full transition-all duration-300 rounded-full"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: 'var(--brand-primary)',
                  }}
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="btn-secondary flex-1 flex items-center justify-center gap-1"
                style={{ opacity: currentStep === 0 ? 0.5 : 1 }}
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              {currentStep < availableSteps.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="btn-primary flex-1 flex items-center justify-center gap-1"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  className="btn-primary flex-1"
                >
                  Finish
                </button>
              )}
            </div>

            <button
              onClick={handleSkip}
              className="w-full mt-3 text-xs text-center transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              Skip tour
            </button>
          </div>
        </div>
      )}
    </>
  );
}

