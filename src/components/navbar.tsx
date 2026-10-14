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
      className="site-nav border border-[#232323]/10"
      data-work-gallery={isWork ? "true" : undefined}
    >
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
        className="empty:hidden"
      />
    </nav>
  );
}
