import Image from "next/image";

/**
 * Mac-style browser-window frame around a real screenshot. Used instead of
 * a live iframe embed everywhere a tool has a real website, per Jeet: he'd
 * rather send visitors to the actual site than embed it (heavier, and he
 * wants the traffic going to the real domain). Screenshots are captured at
 * 1568x696, hence the fixed aspect ratio below, real screenshots dropped in
 * flat in public/ under a tool-*-screenshot.webp name, swap in place as
 * better ones come in.
 */
export default function ToolBrowserMockup({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      style={{
        borderRadius: "14px",
        overflow: "hidden",
        border: "1px solid var(--surface-card-border)",
        boxShadow: "0 2px 8px rgba(var(--shadow-tint-rgb),0.12)",
        background: "var(--surface-card)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "11px 14px" }}>
        <span aria-hidden="true" style={{ width: 10, height: 10, borderRadius: "50%", background: "#EC6A5E" }} />
        <span aria-hidden="true" style={{ width: 10, height: 10, borderRadius: "50%", background: "#F4BF4F" }} />
        <span aria-hidden="true" style={{ width: 10, height: 10, borderRadius: "50%", background: "#61C454" }} />
      </div>
      <div style={{ position: "relative", width: "100%", aspectRatio: "1568/696", background: "var(--surface-wash)" }}>
        <Image src={src} alt={alt} fill sizes="(max-width: 700px) 100vw, 620px" style={{ objectFit: "cover", objectPosition: "top" }} />
      </div>
    </div>
  );
}
