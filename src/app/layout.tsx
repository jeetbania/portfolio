import type { Metadata } from "next";
import { Instrument_Sans, Instrument_Serif, Nanum_Pen_Script } from "next/font/google";
import "./globals.css";
import Header  from "@/components/Header";
import DotGrid from "@/components/DotGrid";
import { ThemeProvider, THEME_INIT_SCRIPT } from "@/lib/theme";

/*
 * Self-hosted via next/font/google instead of a manual <link> to
 * fonts.googleapis.com in <head> — that link was a render-blocking
 * request to an external origin (Lighthouse flagged ~500ms of blocking
 * time from it alone), and Instrument Sans/Serif were actually being
 * loaded TWICE: once via that <link> and again via the @import at the
 * top of globals.css. next/font downloads the font files at build time,
 * serves them from this domain, and injects non-blocking @font-face CSS
 * — no external request, no render-blocking, no duplicate load. Each
 * font's `variable` name matches the --font-sans/--font-serif/--font-hand
 * custom properties already used everywhere via var(--font-*), so no
 * component code needs to change — only where the value comes from.
 */
const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"], // italic is only ever used with --font-serif, never --font-sans
  variable: "--font-sans",
  display: "swap",
});
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400", // Instrument Serif only ships one weight
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
/* Swapped from Shadows Into Light per feedback — same --font-hand token,
   so every component already using var(--font-hand) picks this up with
   no code change on their end, only the font behind it changes. */
const nanumPenScript = Nanum_Pen_Script({
  subsets: ["latin"],
  weight: "400", // Nanum Pen Script only ships one weight
  variable: "--font-hand",
  display: "swap",
});

/*
 * Just the OG image + a real title/tagline for now — deliberately not a
 * full SEO pass (sitemap, structured data, per-page metadata, robots.txt
 * tuning, etc). That waits until real copy and case studies are in;
 * doing it against placeholder content now would mean redoing most of it
 * later anyway.
 */
const SITE_TITLE = "Jeet Bania — UX & Motion Designer";
const SITE_DESCRIPTION = "I make real experiences that connect with real people.";

export const metadata: Metadata = {
  metadataBase: new URL("https://jeetcreates.cc"),
  title: {
    default: SITE_TITLE,
    template: "%s — Jeet Bania",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "https://jeetcreates.cc",
    siteName: "Jeet Bania",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: SITE_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${instrumentSans.variable} ${instrumentSerif.variable} ${nanumPenScript.variable}`}
    >
      <head>
        {/*
         * Runs before hydration so the correct theme (from localStorage,
         * or the OS preference on first visit) is already applied to
         * <html> for the very first paint — no flash of the wrong theme.
         * This one script is the only thing every future page needs;
         * everything else flows from the CSS variables it activates.
         */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body style={{ position: "relative" }}>
        <ThemeProvider>
          {/* Dot grid sits behind everything */}
          <DotGrid />
          <Header />
          <div style={{ position: "relative", zIndex: 1 }}>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
