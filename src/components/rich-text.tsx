"use client";

import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { PortableText, type PortableTextBlockComponent, type PortableTextComponents } from "@portabletext/react";
import { safeHref } from "@/sanity/lib/links";
import type { Color, RichText as RichTextValue } from "@/sanity/types";

export const HOVER_PALETTE = [
  "#2563EB", // blue
  "#16A34A", // green
  "#D97706", // amber
  "#DC2626", // red
  "#9333EA", // purple
  "#0D9488", // teal
] as const;

function resolveHexColor(color?: Color | string | null): string | undefined {
  if (!color) return undefined;
  if (typeof color === "string") return color.trim() || undefined;
  if (typeof color === "object" && typeof color.hex === "string") {
    return color.hex.trim() || undefined;
  }
  return undefined;
}

const DETERMINISTIC_KEY_COLORS: Record<string, (typeof HOVER_PALETTE)[number]> = {
  "city-balikpapan-trigger": "#2563EB", // blue
  "profile-link": "#16A34A", // green
  "faction-link": "#D97706", // amber
  "serving-hours-link": "#DC2626", // red
  "plied-link": "#9333EA", // purple
  "cara-florist-link": "#0D9488", // teal
  "cta-link": "#2563EB", // blue
  "email-link": "#16A34A", // green
  "twitter-link": "#9333EA", // purple
  "linkedin-link": "#0D9488", // teal
};

function getDeterministicPaletteColor(seed: string): string {
  if (seed in DETERMINISTIC_KEY_COLORS) {
    return DETERMINISTIC_KEY_COLORS[seed];
  }
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return HOVER_PALETTE[hash % HOVER_PALETTE.length];
}

export function InlineLink({
  href,
  markKey,
  hoverColor,
  children,
}: {
  href: string;
  markKey?: string;
  hoverColor?: Color | string | null;
  children: ReactNode;
}) {
  const customHex = resolveHexColor(hoverColor);
  const assignedColor = customHex || getDeterministicPaletteColor(markKey || href);
  const isExternal = /^https?:/.test(href);

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="home-inline-link"
      style={{ "--link-hover-color": assignedColor } as CSSProperties}
    >
      {children}
    </a>
  );
}

export function BalikpapanTrigger({
  hoverColor,
  children,
}: {
  hoverColor?: Color | string | null;
  children: ReactNode;
}) {
  const customHex = resolveHexColor(hoverColor);
  const assignedColor = customHex || getDeterministicPaletteColor("city-balikpapan-trigger");
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span
      className="relative inline-block cursor-pointer align-baseline focus:outline-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      tabIndex={0}
      aria-describedby="balikpapan-tooltip"
    >
      <span
        className="home-inline-link"
        data-hovered={isHovered ? "true" : undefined}
        style={{ "--link-hover-color": assignedColor } as CSSProperties}
      >
        {children}
      </span>
      <span
        id="balikpapan-tooltip"
        role="tooltip"
        className={`font-sans absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap z-30 bg-[#1c1c1c] text-white text-[12px] leading-[16px] px-2.5 py-1 rounded-md shadow-sm pointer-events-none transition-all duration-200 ${
          isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
        }`}
      >
        GMT+8 · Indonesia
      </span>
    </span>
  );
}

const Paragraph: PortableTextBlockComponent = ({ children }) => <p className="text-muted">{children}</p>;

function injectBalikpapanMark(
  blocks: RichTextValue,
  cityHoverColor?: Color | string | null,
): RichTextValue {
  let injected = false;
  return blocks.map((block) => {
    if (injected || !block.children?.length) return block;

    const hasBalikpapan = block.children.some(
      (child) => typeof child.text === "string" && child.text.includes("Balikpapan"),
    );
    if (!hasBalikpapan) return block;

    const markKey = "city-balikpapan-trigger";
    const newChildren: NonNullable<typeof block.children> = [];

    for (const child of block.children) {
      if (!injected && typeof child.text === "string" && child.text.includes("Balikpapan")) {
        injected = true;
        const idx = child.text.indexOf("Balikpapan");
        const before = child.text.slice(0, idx);
        const after = child.text.slice(idx + "Balikpapan".length);

        if (before) {
          newChildren.push({
            ...child,
            _key: `${child._key}-before`,
            text: before,
          });
        }
        newChildren.push({
          _type: "span",
          _key: `${child._key}-balikpapan`,
          text: "Balikpapan",
          marks: [markKey],
        });
        if (after) {
          newChildren.push({
            ...child,
            _key: `${child._key}-after`,
            text: after,
          });
        }
      } else {
        newChildren.push(child);
      }
    }

    const existingMarkDefs = block.markDefs ?? [];
    return {
      ...block,
      children: newChildren,
      markDefs: [
        ...existingMarkDefs,
        {
          _type: "cityTrigger" as "link",
          _key: markKey,
          hoverColor: typeof cityHoverColor === "string" ? ({ _type: "color", hex: cityHoverColor } as Color) : (cityHoverColor ?? undefined),
        },
      ],
    };
  });
}

export function RichText({
  value,
  cityHoverColor,
}: {
  value: RichTextValue;
  cityHoverColor?: Color | string | null;
}) {
  const processedValue = useMemo(
    () => injectBalikpapanMark(value, cityHoverColor),
    [value, cityHoverColor],
  );

  const components = useMemo<Partial<PortableTextComponents>>(
    () => ({
      block: Paragraph,
      marks: {
        link: ({ children, value: markValue, markKey }) => {
          const href = safeHref(typeof markValue?.href === "string" ? markValue.href : null);
          return href ? (
            <InlineLink href={href} markKey={markKey} hoverColor={markValue?.hoverColor}>
              {children}
            </InlineLink>
          ) : (
            <>{children}</>
          );
        },
        cityTrigger: ({ children, value: markValue }) => (
          <BalikpapanTrigger hoverColor={markValue?.hoverColor ?? cityHoverColor}>
            {children}
          </BalikpapanTrigger>
        ),
      },
    }),
    [cityHoverColor],
  );

  return <PortableText value={processedValue} components={components} onMissingComponent={false} />;
}
