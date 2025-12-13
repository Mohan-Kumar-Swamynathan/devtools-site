const ONBOARDING_KEY = 'devtools-onboarding-seen';
const TOUR_COMPLETED_KEY = 'devtools-tour-completed';
const TOUR_STEP_KEY = 'devtools-tour-step';

export function hasSeenOnboarding(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(ONBOARDING_KEY) === 'true';
}

export function markOnboardingSeen(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ONBOARDING_KEY, 'true');
}

export function hasCompletedTour(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(TOUR_COMPLETED_KEY) === 'true';
}

export function markTourCompleted(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
}

export function getTourStep(): number {
  if (typeof window === 'undefined') return 0;
  const step = localStorage.getItem(TOUR_STEP_KEY);
  return step ? parseInt(step, 10) : 0;
}

export function setTourStep(step: number): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOUR_STEP_KEY, step.toString());
}

export function resetOnboarding(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ONBOARDING_KEY);
  localStorage.removeItem(TOUR_COMPLETED_KEY);
  localStorage.removeItem(TOUR_STEP_KEY);
}

export function canShowHelpButton(): boolean {
  return hasSeenOnboarding() || hasCompletedTour();
}

