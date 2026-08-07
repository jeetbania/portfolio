"use client";

/**
 * A small row of pastel swatches (off a reference) that recolor the
 * canvas's own backdrop — nothing else on the page, just this card's
 * background. `null` means "use the theme default" (var(--col-bg)),
 * which is also the initial state — a visitor has to actively pick a
 * tint rather than land on an already-changed page.
 */

export const BACKGROUND_SWATCHES = [
  "#F9D6E4", // pink
  "#FBDBB8", // orange
  "#FBF0AE", // yellow
  "#D3F2C7", // green
  "#C8E6F7", // blue
  "#DCD0F5", // purple
];

export function BackgroundPicker({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (color: string | null) => void;
}) {
  return (
    <div className="bg-picker" onPointerDown={e => e.stopPropagation()}>
      {BACKGROUND_SWATCHES.map(color => (
        <button
          key={color}
          type="button"
          className={`bg-picker-swatch ${value === color ? "bg-picker-swatch-active" : ""}`}
          style={{ background: color }}
          onClick={() => onChange(value === color ? null : color)}
          aria-label={`Set canvas background to ${color}`}
          aria-pressed={value === color}
        />
      ))}
    </div>
  );
}
