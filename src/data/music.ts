export type Track = {
  artist: string;
  title: string;
  /** Opens in a new tab from the "See on Spotify" button. Omit and the
   * button just renders inert (no href) — that's what the placeholder
   * tracks below do until real links exist. */
  spotifyUrl?: string;
  /** Filename only, living in public/albums/ — e.g. "overdrive.jpg" for
   * a file at public/albums/overdrive.jpg. Any image format next/image
   * handles is fine (jpg/png/webp/avif). Omit to fall back to the
   * `colors` gradient placeholder instead of a real cover. */
  cover?: string;
  /** Fallback placeholder art (GradientThumb) — three hex colors blended
   * into a soft blob. Only used when `cover` is omitted; ignored
   * otherwise. Every placeholder track below has one; real tracks with a
   * `cover` set don't need it. */
  colors?: readonly [string, string, string];
};

/* Swap these for the real lineup whenever it's ready — see MusicWidget.tsx
   for how `cover`/`colors` are used, and the Track type above for the
   exact shape each entry needs. */
export const TRACKS: Track[] = [
  { artist: "Night Static", title: "Overdrive", colors: ["#6C4FD1", "#A79AFF", "#2A1D5C"] },
  { artist: "Paper Cranes", title: "Low Tide", colors: ["#1F9D55", "#6EDB98", "#0E4A28"] },
  { artist: "Radio Silence", title: "Fast Forward", colors: ["#E8734A", "#F5C15A", "#7A2E12"] },
  { artist: "Sunday Static", title: "Afterglow", colors: ["#C23B6B", "#F58FB0", "#5C1230"] },
  { artist: "The Long Way", title: "Home Movies", colors: ["#C77D11", "#F5C15A", "#5C3A08"] },
  { artist: "Nova & Wren", title: "Static Bloom", colors: ["#2563C7", "#6FA8F5", "#12245C"] },
];
