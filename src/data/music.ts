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

/* The real lineup — covers live in public/albums/. */
export const TRACKS: Track[] = [
  {
    artist: "A.R Rahman",
    title: "Kun Faya Kun",
    cover: "rockstar-kun-faya-kun.jpg",
    spotifyUrl: "https://open.spotify.com/track/7F8RNvTQlvbeBLeenycvN6?si=2757015e23ac43b9",
  },
  {
    artist: "John Denver",
    title: "Country Roads",
    cover: "country-roads.jpg",
    spotifyUrl: "https://open.spotify.com/track/1YYhDizHx7PnDhAhko6cDS?si=52ff442c3aea4fca",
  },
  {
    artist: "Goo Goo Dolls",
    title: "Iris",
    // Only file that landed as a .png, not .jpg — matched to the real
    // filename in public/albums/ (this is case-/extension-sensitive on
    // Vercel's Linux deploys, unlike a local Mac filesystem).
    cover: "goo-goo-dolls-iris.png",
    spotifyUrl: "https://open.spotify.com/track/6Qyc6fS4DsZjB2mRW9DsQs?si=2e70cbcfc14843ff",
  },
  {
    artist: "Blue",
    title: "One Love",
    cover: "one-love.jpg",
    spotifyUrl: "https://open.spotify.com/track/2W5acFzXf5FrktecuD30Or?si=15d7601a7e704765",
  },
  {
    artist: "Connor Price",
    title: "Still Hot",
    cover: "Still-Hot-English.jpg",
    spotifyUrl: "https://open.spotify.com/track/23IahlGF2rWghCCuJIjQNm?si=9dfb7a9af0034d59",
  },
  {
    artist: "Nusrat Fateh Ali Khan",
    title: "Shukar Manawa",
    cover: "nustrat-fateh-khan.jpg",
    spotifyUrl: "https://open.spotify.com/track/2t2FECruuvafe79EVo41t5?si=35346ae4b9a84c79",
  },
];
