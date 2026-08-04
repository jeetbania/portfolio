import type { Metadata } from "next";
import AboutFan from "@/components/AboutFan";
import AboutCurrently from "@/components/AboutCurrently";
import Footer from "@/components/Footer";
import RoundedCap from "@/components/RoundedCap";

export const metadata: Metadata = {
  title: "About — Jeet Bania",
  description: "Product & UX Designer. Bengaluru.",
};

/* Typography from Paper.design export:
   - Headlines: Instrument Serif, not bold
   - Body / subheads: Instrument Sans, weight 500, -0.03em tracking, 24px/30px
   - Section headings: Instrument Sans, bold (700), 24px, no tracking, capitalised */

const BODY: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "clamp(17px, 2vw, 22px)",
  fontWeight: 500,
  letterSpacing: "-0.03em",
  lineHeight: 1.35,
  color: "var(--col-muted)",
};

const SECTION_HEAD: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "clamp(17px, 2vw, 22px)",
  fontWeight: 700,
  letterSpacing: "-0.01em",
  lineHeight: 1.35,
  textTransform: "capitalize" as const,
  color: "var(--col-fg)",
};

export default function AboutPage() {
  return (
    <main style={{ background: "var(--col-bg)" }}>
      <div style={{
        maxWidth: "820px",
        margin: "0 auto",
        padding: "clamp(90px, 12vh, 130px) clamp(20px, 5vw, 40px) 80px",
        display: "flex",
        flexDirection: "column",
        gap: "clamp(32px, 5vh, 52px)",
      }}>

        {/* ── Hero headings ────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", textAlign: "center" }}>
          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(38px, 6.5vw, 56px)",
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "var(--col-fg)",
          }}>
            Hey, I&rsquo;m Jeet.
          </h1>
          <p style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(25px, 4vw, 44px)",
            fontWeight: 400,
            lineHeight: 1.22,
            letterSpacing: "-0.015em",
            color: "var(--col-muted)",
          }}>
            I design products that solve real problems and hopefully make people smile along the way.
          </p>
        </div>

        {/* ── Photo fan — deliberately breaks out of the 820px text
            column to full viewport width, so the fan has real room to
            spread; AboutFan measures its own actual rendered width at
            open-time, so this just works without any prop threading. ── */}
        <div style={{
          width: "100vw",
          position: "relative",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          justifyContent: "center",
          /* Pulls the fan up closer to the subheading — targeted at this
             one gap rather than the shared flex `gap` above, which also
             spaces every other section on the page and shouldn't tighten
             along with it. */
          marginTop: "clamp(-36px, -4vh, -16px)",
          /* No overflow-x:hidden here (there used to be one) — it was
             papering over a real bug in AboutFan's fan-spread math that
             let cards overflow the stage horizontally on narrow phones.
             overflow-x:hidden forces overflow-y to compute as "auto" too
             (a real CSS quirk, not a bug — see CLAUDE.md), which was
             clipping the cards' vertical hover-lift and the speech-bubble
             pills above them. Now that computeFanPositions() has a hard
             ceiling tied to the actual stage width, the fan never
             overflows in the first place, so this guard isn't needed —
             and keeping it around would just re-introduce the cropping. */
        }}>
          <AboutFan />
        </div>

        {/* ── Short punchy line ─────────────────────────────────────── */}
        <p style={{ ...BODY, color: "var(--col-muted)" }}>
          I spend way too much time obsessing over tiny details, but I like to think people notice.
        </p>

        {/* ── Narrative bio ─────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <p style={BODY}>
            I&rsquo;m a Product &amp; UX Designer working across digital products, websites, and design systems.
          </p>
          <p style={BODY}>
            Over the last few years, I&rsquo;ve worked with startups, agencies, and growing teams to turn complicated ideas into experiences that feel clear, intuitive, and genuinely enjoyable to use.
          </p>
          <p style={BODY}>
            I enjoy designing interfaces that look beautiful, but more importantly, I care about how they feel. The little interactions, thoughtful animations, and tiny details that most people won&rsquo;t consciously notice, but would definitely miss if they disappeared.
          </p>
        </div>

        {/* ── Currently card ────────────────────────────────────────── */}
        <AboutCurrently />

        {/* ── What I enjoy working on ───────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <h2 style={SECTION_HEAD}>What I enjoy working on</h2>
          <p style={BODY}>
            I naturally gravitate toward products with complex problems. Whether it&rsquo;s an enterprise dashboard, a consumer app, or a marketing website, I enjoy untangling messy workflows and turning them into experiences that feel effortless.
          </p>
          <p style={BODY}>
            I believe good design isn&rsquo;t about adding more. It&rsquo;s about knowing what deserves attention and what should quietly get out of the way.
          </p>
        </div>

        {/* ── My process ───────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <h2 style={SECTION_HEAD}>My process</h2>
          <p style={BODY}>
            I usually begin with questions rather than screens. I like understanding why something feels confusing before thinking about how it should look. Once the problem is clear, I explore different directions, prototype ideas quickly, and keep refining until the solution feels simple.
          </p>
          <p style={BODY}>
            I&rsquo;m also constantly experimenting with new tools — especially AI — not to replace thoughtful design, but to spend less time on repetitive work and more time polishing the parts that people actually remember.
          </p>
        </div>

        {/* ── Outside of work ───────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <h2 style={SECTION_HEAD}>Outside of work</h2>
          <p style={BODY}>
            You&rsquo;ll usually find me rebuilding interfaces I admire, experimenting with motion and interactions, or falling down a rabbit hole after spotting a tiny design detail that could be better.
          </p>
          <p style={BODY}>
            I&rsquo;m endlessly curious, occasionally obsessive, and always looking for ways to make digital experiences feel a little more human.
          </p>
        </div>

      </div>

      <RoundedCap />

      <Footer />
    </main>
  );
}
