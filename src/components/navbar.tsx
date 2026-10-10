"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

const links = [
  { href: "/", label: "Home", segment: null },
  { href: "/work", label: "Works", segment: "work" },
];

export function Navbar() {
  const activeSegment = useSelectedLayoutSegment();
  const isWork = activeSegment === "work";

  return (
    <nav
      aria-label="Main navigation"
      className="site-nav"
      data-work-gallery={isWork ? "true" : undefined}
    >
      {/* Floating project title positioned directly ABOVE the nav pill */}
      <div
        id="work-gallery-title"
        role="status"
        aria-live="polite"
        style={{ display: isWork ? "block" : "none" }}
      />
      <ul className="nav-links">
        {links.map(({ href, label, segment }) => (
          <li key={href}>
            <Link
              href={href}
              aria-current={activeSegment === segment ? "page" : undefined}
              className="nav-link"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
      <div
        id="work-gallery-dock"
        role="group"
        aria-label="Gallery controls"
        style={{ display: isWork ? "flex" : "none" }}
      />
    </nav>
  );
}
