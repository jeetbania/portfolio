import Image from "next/image";
import Tooltip from "./Tooltip";

/* Known logos we have real assets for. Tools without an entry here fall
   back to a gradient icon tile — the same treatment used elsewhere in the
   site before real logos existed — swap one in the same way these were
   added, once you have a real logo for it. */
const TOOL_LOGOS: Record<string, string> = {
  "Figma": "/logo-figma.png",
  "Paper.design": "/logo-paper.png",
  "Claude": "/logo-claude.png",
  "After Effects": "/logo-ae.png",
};

/* Cycled by a stable hash of the tool name, so an unknown tool always
   gets the same colours rather than random ones on every render. Each
   triplet reuses the site's existing folder-tint colours, paired with a
   darker ink for the letter and a matching shadow tint — the same
   "gradient ramp + white stroke + tinted shadow" language as the game's
   enemy cards in Footer.tsx (see obstacleSvg / OBSTACLE_DEFS there). */
const FALLBACK_COLORS = [
  { light: "#B8F0D8", dark: "#1F9D55", shadow: "31,157,85"   },
  { light: "#D4C9F5", dark: "#6C4FD1", shadow: "108,79,209"  },
  { light: "#B8CEF5", dark: "#2563C7", shadow: "37,99,199"   },
  { light: "#F5D4B8", dark: "#B8790F", shadow: "184,121,15"  },
  { light: "#F5C6DC", dark: "#C2417F", shadow: "194,65,127"  },
  { light: "#C8E6C0", dark: "#2E7D32", shadow: "46,125,50"   },
];

function hashName(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return h;
}

export default function ToolLogo({ name, size = 34 }: { name: string; size?: number }) {
  const src = TOOL_LOGOS[name];

  if (src) {
    return (
      <Tooltip label={name}>
        <div
          className="snapshot-tile"
          style={{ width: size, height: size, display: "grid", placeItems: "center", flexShrink: 0, cursor: "default" }}
        >
          <Image src={src} alt={name} width={size} height={size} style={{ objectFit: "contain" }} />
        </div>
      </Tooltip>
    );
  }

  const hash = hashName(name);
  const { light, dark, shadow } = FALLBACK_COLORS[hash % FALLBACK_COLORS.length];
  const letter = name.charAt(0).toUpperCase();
  const gradId = `tool-grad-${hash}`;
  const filterId = `tool-shadow-${hash}`;

  return (
    <Tooltip label={name}>
      <div style={{ width: size, height: size, flexShrink: 0, cursor: "default" }}>
        <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
          <defs>
            <filter id={filterId} x="-60%" y="-50%" width="220%" height="220%">
              <feDropShadow dx="0" dy="3" stdDeviation="6" floodColor={`rgb(${shadow})`} floodOpacity={0.2} />
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor={`rgb(${shadow})`} floodOpacity={0.15} />
            </filter>
            <linearGradient id={gradId} x1="32" y1="2" x2="32" y2="62" gradientUnits="userSpaceOnUse">
              <stop stopColor={light} />
              <stop offset="1" stopColor="white" />
            </linearGradient>
          </defs>
          <g filter={`url(#${filterId})`}>
            <rect x="5" y="5" width="54" height="54" rx="14" fill={`url(#${gradId})`} />
            <rect x="5" y="5" width="54" height="54" rx="14" fill="none" stroke="white" strokeWidth={3} />
            <text
              x="32" y="33" textAnchor="middle" dominantBaseline="central"
              fontFamily="var(--font-sans)" fontWeight={700} fontSize="26"
              fill={dark}
            >
              {letter}
            </text>
          </g>
        </svg>
      </div>
    </Tooltip>
  );
}
