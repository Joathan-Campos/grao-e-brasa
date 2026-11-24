type P = { className?: string };

export const ArrowRight = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 20 20" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 10h12M11 5l5 5-5 5" />
  </svg>
);

export const BagIcon = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" />
    <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
  </svg>
);

export const PlusIcon = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 20 20" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M10 4v12M4 10h12" />
  </svg>
);

export const MinusIcon = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 20 20" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M4 10h12" />
  </svg>
);

export const CloseIcon = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 20 20" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
    <path d="M5 5l10 10M15 5 5 15" />
  </svg>
);

export const MenuIcon = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 20 20" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
    <path d="M3 6h14M3 14h14" />
  </svg>
);

export const CheckIcon = ({ className = "h-6 w-6" }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);
