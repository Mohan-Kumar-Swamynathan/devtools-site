import { useState, useEffect, useCallback } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

export interface TourStep {
  target: string; // CSS selector or element ID
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface TourGuideProps {
  steps: TourStep[];
  onComplete?: () => void;
  onSkip?: () => void;
  storageKey?: string;
}

export default function TourGuide({ 
  steps, 
  onComplete, 
  onSkip,
  storageKey = 'tour-completed'
}: TourGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [overlayStyle, setOverlayStyle] = useState<React.CSSProperties>({});
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Check if tour was already completed
    const completed = localStorage.getItem(storageKey);
    if (completed === 'true') {
      return;
    }
    
    // Show tour after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
      updateTooltipPosition();
    }, 500);

    return () => clearTimeout(timer);
  }, [storageKey]);

  const updateTooltipPosition = useCallback(() => {
    if (currentStep >= steps.length) return;

    const step = steps[currentStep];
    const element = document.querySelector(step.target) as HTMLElement;
    
    if (!element) {
      // If element not found, center the tooltip
      setTooltipStyle({
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10001,
      });
      setOverlayStyle({
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 10000,
      });
      setTargetElement(null);
      return;
    }

    setTargetElement(element);
    const rect = element.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    // Calculate overlay to highlight target
    const highlightPadding = 10;
    setOverlayStyle({
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      clipPath: `polygon(
        0% 0%,
        0% 100%,
        ${rect.left - highlightPadding}px 100%,
        ${rect.left - highlightPadding}px ${rect.top - highlightPadding}px,
        ${rect.right + highlightPadding}px ${rect.top - highlightPadding}px,
        ${rect.right + highlightPadding}px ${rect.bottom + highlightPadding}px,
        ${rect.left - highlightPadding}px ${rect.bottom + highlightPadding}px,
        ${rect.left - highlightPadding}px 100%,
        100% 100%,
        100% 0%
      )`,
      zIndex: 10000,
    });

    // Position tooltip based on step position preference
    const position = step.position || 'bottom';
    let tooltipTop = 0;
    let tooltipLeft = 0;

    switch (position) {
      case 'top':
        tooltipTop = rect.top + scrollY - 20;
        tooltipLeft = rect.left + scrollX + rect.width / 2;
        break;
      case 'bottom':
        tooltipTop = rect.bottom + scrollY + 20;
        tooltipLeft = rect.left + scrollX + rect.width / 2;
        break;
      case 'left':
        tooltipTop = rect.top + scrollY + rect.height / 2;
        tooltipLeft = rect.left + scrollX - 20;
        break;
      case 'right':
        tooltipTop = rect.top + scrollY + rect.height / 2;
        tooltipLeft = rect.right + scrollX + 20;
        break;
      case 'center':
        tooltipTop = rect.top + scrollY + rect.height / 2;
        tooltipLeft = rect.left + scrollX + rect.width / 2;
        break;
    }

    setTooltipStyle({
      position: 'absolute',
      top: `${tooltipTop}px`,
      left: `${tooltipLeft}px`,
      transform: position === 'center' 
        ? 'translate(-50%, -50%)' 
        : position === 'left' || position === 'right'
        ? 'translateY(-50%)'
        : 'translateX(-50%)',
      zIndex: 10001,
      maxWidth: '320px',
    });

    // Scroll element into view if needed
    element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
  }, [currentStep, steps]);

  useEffect(() => {
    if (isVisible) {
      updateTooltipPosition();
      window.addEventListener('resize', updateTooltipPosition);
      window.addEventListener('scroll', updateTooltipPosition, true);

      return () => {
        window.removeEventListener('resize', updateTooltipPosition);
        window.removeEventListener('scroll', updateTooltipPosition, true);
      };
    }
  }, [isVisible, updateTooltipPosition]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem(storageKey, 'true');
    setIsVisible(false);
    onComplete?.();
  };

  const handleSkip = () => {
    localStorage.setItem(storageKey, 'true');
    setIsVisible(false);
    onSkip?.();
  };

  if (!isVisible || currentStep >= steps.length) {
    return null;
  }

  const step = steps[currentStep];
  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');

  return (
    <>
      {/* Overlay */}
      <div
        style={overlayStyle}
        onClick={handleNext}
        className="cursor-pointer"
      />

      {/* Tooltip */}
      <div
        style={tooltipStyle}
        className="tour-tooltip"
      >
        <div
          className="rounded-2xl shadow-2xl p-6"
          style={{
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
            color: isDark ? '#f1f5f9' : '#0f172a',
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2" style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
                {step.title}
              </h3>
              <p className="text-sm" style={{ color: isDark ? '#cbd5e1' : '#475569' }}>
                {step.content}
              </p>
            </div>
            <button
              onClick={handleSkip}
              className="ml-4 p-1 rounded-lg hover:bg-opacity-20 transition-colors"
              style={{ color: isDark ? '#94a3b8' : '#64748b' }}
              aria-label="Skip tour"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                {currentStep + 1} of {steps.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <button
                  onClick={handlePrevious}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: isDark ? '#334155' : '#f1f5f9',
                    color: isDark ? '#f1f5f9' : '#0f172a',
                  }}
                >
                  <ChevronLeft size={16} className="inline mr-1" />
                  Previous
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: isDark ? '#3b82f6' : '#2563eb',
                  color: '#ffffff',
                }}
              >
                {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                {currentStep < steps.length - 1 && <ChevronRight size={16} className="inline ml-1" />}
              </button>
            </div>
          </div>
        </div>

        {/* Arrow pointer */}
        {step.position !== 'center' && (
          <div
            className="absolute w-0 h-0"
            style={{
              ...(step.position === 'top' && {
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: `8px solid ${isDark ? '#1e293b' : '#ffffff'}`,
              }),
              ...(step.position === 'bottom' && {
                top: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderBottom: `8px solid ${isDark ? '#1e293b' : '#ffffff'}`,
              }),
              ...(step.position === 'left' && {
                right: '-8px',
                top: '50%',
                transform: 'translateY(-50%)',
                borderTop: '8px solid transparent',
                borderBottom: '8px solid transparent',
                borderLeft: `8px solid ${isDark ? '#1e293b' : '#ffffff'}`,
              }),
              ...(step.position === 'right' && {
                left: '-8px',
                top: '50%',
                transform: 'translateY(-50%)',
                borderTop: '8px solid transparent',
                borderBottom: '8px solid transparent',
                borderRight: `8px solid ${isDark ? '#1e293b' : '#ffffff'}`,
              }),
            }}
          />
        )}
      </div>
    </>
  );
}



