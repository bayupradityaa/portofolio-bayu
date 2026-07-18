/** Legibility scrim — darkens toward bottom-left where text sits. Static. */
export function HeroOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          "linear-gradient(to right, color-mix(in oklab, var(--background) 92%, transparent) 0%, color-mix(in oklab, var(--background) 60%, transparent) 40%, transparent 75%), " +
          "linear-gradient(to top, var(--background) 2%, color-mix(in oklab, var(--background) 40%, transparent) 40%, transparent 70%)",
      }}
    />
  );
}
