export function BeanMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <ellipse cx="12" cy="12" rx="7.4" ry="10" transform="rotate(28 12 12)" fill="currentColor" />
      <path
        d="M9.2 3.9c3.2 3 0.6 6.2 2.6 8.6s4.4 3.3 3.1 7.6"
        transform="rotate(4 12 12)"
        fill="none"
        stroke="var(--mark-groove, #f6f1e7)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({ tone = "ink" }: { tone?: "ink" | "cream" }) {
  return (
    <span className={`inline-flex items-center gap-2 ${tone === "cream" ? "text-cream" : "text-ink"}`}>
      <BeanMark
        className={`h-6 w-6 ${tone === "cream" ? "text-ember [--mark-groove:#15100c]" : "text-terracotta"}`}
      />
      <span className="font-display text-[21px] leading-none tracking-tight">Grão &amp; Brasa</span>
    </span>
  );
}
