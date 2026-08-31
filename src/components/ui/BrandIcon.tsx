import type { SVGProps } from "react";

type BrandIconProps = SVGProps<SVGSVGElement> & {
  name: string;
};

export function BrandIcon({ name, ...props }: BrandIconProps) {
  const commonProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };

  switch (name.toLowerCase()) {
    case "react":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
          <ellipse cx="12" cy="12" rx="9" ry="3.6" />
          <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)" />
        </svg>
      );
    case "flutter":
      return (
        <svg {...commonProps}>
          <path d="M14.8 2.8 5.2 12.4l3.1 3.1L21 2.8z" />
          <path d="m11.5 18.7 3.3 3.3H21l-6.4-6.5z" />
          <path d="m8.3 15.5 3.2 3.2 3.1-3.2-3.1-3.1z" />
        </svg>
      );
    case "dart":
      return (
        <svg {...commonProps}>
          <path d="m5.2 4.2 9.4-1.1 4.3 4.3 1 9.4-5.4 4.1-8.8-3.2-2.6-9z" />
          <path d="m5.2 4.2 10.2 10.2-.9 6.5M3.1 8.7l8.5-.4 7.3-.9" />
        </svg>
      );
    case "nextjs":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9.5" />
          <path d="M7.8 16V8l8.4 9V8" />
          <path d="m14.4 14.8 3.4 3.3" />
        </svg>
      );
    case "typescript":
    case "javascript":
      return (
        <svg {...commonProps}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <text
            x="12"
            y="15.5"
            fill="currentColor"
            stroke="none"
            textAnchor="middle"
            fontSize="7.5"
            fontWeight="800"
            fontFamily="sans-serif"
          >
            {name.toLowerCase() === "typescript" ? "TS" : "JS"}
          </text>
        </svg>
      );
    case "nodejs":
      return (
        <svg {...commonProps}>
          <path d="m12 2.7 8 4.6v9.4l-8 4.6-8-4.6V7.3z" />
          <text
            x="12"
            y="14.5"
            fill="currentColor"
            stroke="none"
            textAnchor="middle"
            fontSize="6.5"
            fontWeight="800"
            fontFamily="sans-serif"
          >
            JS
          </text>
        </svg>
      );
    case "supabase":
      return (
        <svg {...commonProps}>
          <path d="M13.3 2.8 5.2 13h7l-1.5 8.2L18.8 11h-7z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "postgresql":
      return (
        <svg {...commonProps}>
          <ellipse cx="12" cy="6" rx="7.5" ry="3.2" />
          <path d="M4.5 6v6c0 1.8 3.4 3.2 7.5 3.2s7.5-1.4 7.5-3.2V6" />
          <path d="M4.5 12v6c0 1.8 3.4 3.2 7.5 3.2s7.5-1.4 7.5-3.2v-6" />
        </svg>
      );
    case "tailwind":
      return (
        <svg {...commonProps}>
          <path d="M3 9.5c2.3-3.7 5.2-4.7 8.6-2.8 1.8 1 3 1.2 4.1.8 1.1-.4 2-1.3 2.8-2.7-2.3 3.7-5.2 4.7-8.6 2.8-1.8-1-3-1.2-4.1-.8C4.7 7.2 3.8 8.1 3 9.5Z" />
          <path d="M5.5 16.7c2.3-3.7 5.2-4.7 8.6-2.8 1.8 1 3 1.2 4.1.8 1.1-.4 2-1.3 2.8-2.7-2.3 3.7-5.2 4.7-8.6 2.8-1.8-1-3-1.2-4.1-.8-1.1.4-2 1.3-2.8 2.7Z" />
        </svg>
      );
    case "html":
    case "css":
      return (
        <svg {...commonProps}>
          <path d="M4.5 3h15l-1.4 16-6.1 2-6.1-2z" />
          <text
            x="12"
            y="14.5"
            fill="currentColor"
            stroke="none"
            textAnchor="middle"
            fontSize="6.5"
            fontWeight="800"
            fontFamily="sans-serif"
          >
            {name.toUpperCase()}
          </text>
        </svg>
      );
    case "figma":
      return (
        <svg {...commonProps}>
          <path d="M12 3H8.5a3 3 0 0 0 0 6H12z" />
          <path d="M12 9H8.5a3 3 0 0 0 0 6H12z" />
          <path d="M12 15H8.5a3 3 0 1 0 3.5 3z" />
          <path d="M12 3h3.5a3 3 0 1 1 0 6H12z" />
          <circle cx="15.5" cy="12" r="3" />
        </svg>
      );
    case "git":
      return (
        <svg {...commonProps}>
          <path d="m12 2.8 9.2 9.2-9.2 9.2L2.8 12z" />
          <circle cx="9" cy="8.7" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="15" cy="15.2" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="15" cy="8.7" r="1.2" fill="currentColor" stroke="none" />
          <path d="m10 9.4 4 4.8M10.2 8.7H14" />
        </svg>
      );
    case "uiux":
      return (
        <svg {...commonProps}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 8h18M8 8v13M11.5 12h6M11.5 16h4" />
          <circle cx="6" cy="5.5" r=".7" fill="currentColor" stroke="none" />
        </svg>
      );
    case "ai":
      return (
        <svg {...commonProps}>
          <path d="M12 2.8c.8 4.9 3.4 7.5 8.2 8.2-4.8.8-7.4 3.4-8.2 8.2-.8-4.8-3.4-7.4-8.2-8.2 4.8-.7 7.4-3.3 8.2-8.2Z" />
          <path d="M19 2.8c.2 1.5 1 2.3 2.5 2.5C20 5.5 19.2 6.3 19 7.8c-.2-1.5-1-2.3-2.5-2.5C18 5.1 18.8 4.3 19 2.8Z" />
        </svg>
      );
    case "notion":
      return (
        <svg {...commonProps}>
          <rect x="3" y="3" width="18" height="18" rx="1" />
          <path d="M7.5 17V7l9 10V7" />
        </svg>
      );
    case "canva":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9.5" />
          <path d="M15.7 8.5a5 5 0 1 0 0 7" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...commonProps} fill="currentColor" stroke="none">
          <path d="M13.7 21v-8h2.8l.4-3.1h-3.2v-2c0-.9.3-1.5 1.6-1.5H17V3.6c-.7-.1-1.5-.2-2.4-.2-2.4 0-4.1 1.5-4.1 4.2v2.3H7.8V13h2.7v8z" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...commonProps}>
          <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" />
          <circle cx="12" cy="12" r="4.1" />
          <circle cx="17.5" cy="6.7" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...commonProps} fill="currentColor" stroke="none">
          <path d="M5.3 8.2H2.4V21h2.9zM3.85 3A1.8 1.8 0 1 0 3.9 6.6 1.8 1.8 0 0 0 3.85 3ZM21.6 13.7c0-3.9-2.1-5.8-4.9-5.8a4.2 4.2 0 0 0-3.8 2.1V8.2H10V21h2.9v-6.4c0-1.7.3-3.3 2.4-3.3 2 0 2.1 1.9 2.1 3.4V21h4.2z" />
        </svg>
      );
    case "x":
      return (
        <svg {...commonProps} fill="currentColor" stroke="none">
          <path d="M18.6 3h3.7l-8.1 9.2L23.7 21h-7.4l-5.8-7.6L3.8 21H.1l8.7-9.9L-.3 3h7.6l5.2 6.9L18.6 3Zm-1.3 16h2L6.2 4.9H4.1z" />
        </svg>
      );
    case "github":
      return (
        <svg {...commonProps} fill="currentColor" stroke="none">
          <path d="M12 2.5a9.7 9.7 0 0 0-3.1 18.9c.5.1.7-.2.7-.5v-1.9c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.7.1-.7.1-.7 1 .1 1.6 1.1 1.6 1.1.9 1.6 2.4 1.1 2.9.9.1-.7.4-1.1.7-1.3-2.3-.3-4.6-1.1-4.6-5a3.9 3.9 0 0 1 1-2.7c-.1-.3-.4-1.3.1-2.7 0 0 .9-.3 2.8 1a9.6 9.6 0 0 1 5.1 0c2-1.3 2.8-1 2.8-1 .6 1.4.2 2.4.1 2.7a3.9 3.9 0 0 1 1 2.7c0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.8v2.8c0 .3.2.6.7.5A9.7 9.7 0 0 0 12 2.5Z" />
        </svg>
      );
    case "email":
      return (
        <svg {...commonProps}>
          <rect x="2.8" y="5" width="18.4" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      );
    case "website":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9.5" />
          <path d="M2.8 12h18.4M12 2.5c2.5 2.6 3.8 5.8 3.8 9.5S14.5 18.9 12 21.5C9.5 18.9 8.2 15.7 8.2 12S9.5 5.1 12 2.5Z" />
        </svg>
      );
    default:
      return (
        <svg {...commonProps}>
          <path d="m8.5 7-5 5 5 5M15.5 7l5 5-5 5M13.8 4 10.2 20" />
        </svg>
      );
  }
}
