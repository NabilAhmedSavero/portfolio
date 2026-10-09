import { HOME_ENTRANCE_READY_EVENT, HOME_ENTRANCE_SCRIPT_ID } from "./home-entrance-init";

type HomeRevealOptions = {
  routeTransition?: Promise<unknown>;
  initialLoad: boolean;
};

/** Enhances the visible-by-default CSS entrance with once-per-visit section reveals. */
export function observeHomeBlurFade(root: HTMLElement, { initialLoad, routeTransition }: HomeRevealOptions) {
  const panels = Array.from(root.querySelectorAll<HTMLElement>(".home-page .home-panel"));
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  // Panels have 32px content padding: start just before their text enters view.
  const revealInset = 24;
  let observer: IntersectionObserver | undefined;
  let disposed = false;
  const completed = new Set<HTMLElement>();

  const finish = (panel: HTMLElement) => {
    completed.add(panel);
    panel.dataset.homeReveal = "done";
    observer?.unobserve(panel);
  };
  const finishAll = () => panels.forEach(finish);
  const inViewport = (panel: HTMLElement) => {
    const bounds = panel.getBoundingClientRect();
    return bounds.top < window.innerHeight - revealInset && bounds.bottom > 0;
  };
  const onAnimationEnd = (event: AnimationEvent) => {
    const panel = event.target;
    if (event.animationName === "home-blur-fade" && panel instanceof HTMLElement && panels.includes(panel)
      && panel.dataset.homeReveal !== "pending") finish(panel);
  };
  const onFocus = (event: FocusEvent) => {
    const panel = event.target instanceof HTMLElement ? event.target.closest<HTMLElement>(".home-panel") : null;
    // Keyboard access should never wait for a reveal.
    if (panel && panels.includes(panel)) finish(panel);
  };
  const onMotionChange = () => {
    if (motion.matches) {
      observer?.disconnect();
      finishAll();
    }
  };

  if (!panels.length) return () => {};
  if (motion.matches || !("IntersectionObserver" in window)) {
    finishAll();
    return () => {};
  }

  const initialize = () => {
    if (disposed || motion.matches) return;
    try {
      observer = new IntersectionObserver((entries) => {
        try {
          for (const entry of entries) {
            const panel = entry.target as HTMLElement;
            if (!entry.isIntersecting || panel.dataset.homeReveal !== "pending") continue;
            // Unobserve before starting: scrolling or content updates cannot replay it.
            observer?.unobserve(panel);
            panel.dataset.homeReveal = "revealing";
          }
        } catch {
          observer?.disconnect();
          finishAll();
        }
      }, { rootMargin: `0px 0px -${revealInset}px 0px`, threshold: 0 });

      for (const panel of panels) {
        if (completed.has(panel)) continue;
        panel.dataset.homeReveal = inViewport(panel) ? (initialLoad ? "initial" : "done") : "pending";
      }

      const startObserving = () => {
        if (disposed || motion.matches) return;
        try {
          for (const panel of panels) {
            // Route arrival can settle Home's stylesheet and fonts after the first layout.
            // Recheck below-fold blocks after the wrapper fade; never fade visible blocks twice.
            if (!initialLoad) {
              if (panel.getBoundingClientRect().top < window.innerHeight - revealInset) finish(panel);
              else panel.dataset.homeReveal = "pending";
            }
            if (panel.dataset.homeReveal === "pending") observer?.observe(panel);
          }
        } catch {
          observer?.disconnect();
          finishAll();
        }
      };
      if (routeTransition) void routeTransition.then(startObserving, startObserving);
      else startObserving();
    } catch {
      observer?.disconnect();
      finishAll();
    }
  };

  root.addEventListener("animationend", onAnimationEnd);
  root.addEventListener("animationcancel", onAnimationEnd);
  root.addEventListener("focusin", onFocus);
  motion.addEventListener("change", onMotionChange);

  if (initialLoad && document.getElementById(HOME_ENTRANCE_SCRIPT_ID)?.dataset.homeBoot === "armed") {
    document.addEventListener(HOME_ENTRANCE_READY_EVENT, initialize, { once: true });
  } else initialize();

  return () => {
    disposed = true;
    observer?.disconnect();
    document.removeEventListener(HOME_ENTRANCE_READY_EVENT, initialize);
    root.removeEventListener("animationend", onAnimationEnd);
    root.removeEventListener("animationcancel", onAnimationEnd);
    root.removeEventListener("focusin", onFocus);
    motion.removeEventListener("change", onMotionChange);
    finishAll();
  };
}
