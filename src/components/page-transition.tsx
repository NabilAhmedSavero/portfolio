"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { useSelectedLayoutSegment } from "next/navigation";
import { observeHomeBlurFade } from "./home-blur-fade";

export function PageTransition({ children }: { children: ReactNode }) {
  const segment = useSelectedLayoutSegment();
  const previousSegment = useRef(segment);
  const content = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const changedRoute = previousSegment.current !== segment;
    previousSegment.current = segment;

    const root = content.current;
    if (!root) return;
    if (changedRoute) root.removeAttribute("data-home-entrance");

    // Only the route wrapper animates visible content on client navigation.
    const animation = changedRoute && !window.matchMedia("(prefers-reduced-motion: reduce)").matches ? root.animate(
      [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }],
      { duration: 200, easing: "ease-out" },
    ) : undefined;
    const stopHomeReveals = segment === null ? observeHomeBlurFade(root, {
      initialLoad: !changedRoute,
      routeTransition: animation?.finished,
    }) : undefined;

    return () => {
      stopHomeReveals?.();
      animation?.cancel();
    };
  }, [segment]);

  return <div ref={content} className="page-transition" data-home-entrance="initial">{children}</div>;
}
