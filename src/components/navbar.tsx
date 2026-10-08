"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation" className="site-nav">
      <ul className="nav-links">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              className="nav-link underline-offset-4 hover:underline aria-[current=page]:underline"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
      <a href="#contact" className="contact-action">
        Let’s talk
      </a>
    </nav>
  );
}
