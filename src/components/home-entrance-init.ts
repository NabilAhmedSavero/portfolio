export const HOME_ENTRANCE_SCRIPT_ID = "home-entrance-init";
export const HOME_ENTRANCE_READY_EVENT = "home-entrance-ready";

// Runs while HTML is parsed, before Home's CSS timeline can be consumed by a cold load.
// It is independent of hydration, so a failed Next.js bundle cannot leave Home hidden.
export const HOME_ENTRANCE_INIT = `(() => {
  const boot = document.currentScript;
  if (!boot || boot.dataset.homeBoot) return;
  let frame = 0;
  let assetsReady = false;
  let preparing = false;
  let finished = false;
  const release = () => {
    if (finished) return;
    finished = true;
    boot.dataset.homeBoot = "ready";
    document.removeEventListener("DOMContentLoaded", prepare);
    document.removeEventListener("visibilitychange", schedule);
    document.removeEventListener("prerenderingchange", schedule);
    if (frame) cancelAnimationFrame(frame);
    document.dispatchEvent(new Event("${HOME_ENTRANCE_READY_EVENT}"));
  };
  const schedule = () => {
    if (finished || frame || !assetsReady || document.visibilityState !== "visible" || document.prerendering) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (document.visibilityState === "visible" && !document.prerendering) release();
    });
  };
  const prepare = () => {
    if (preparing || finished || document.readyState === "loading") return;
    preparing = true;
    try {
      const home = document.querySelector(".home-page");
      if (!home) { release(); return; }
      // Resolve fonts after layout has registered the faces actually used by Home.
      home.getBoundingClientRect();
      const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
      const image = home.querySelector(".home-profile");
      const profile = !image || image.complete ? Promise.resolve() : new Promise(resolve => {
        const done = () => {
          image.removeEventListener("load", done);
          image.removeEventListener("error", done);
          resolve();
        };
        image.addEventListener("load", done, { once: true });
        image.addEventListener("error", done, { once: true });
      });
      Promise.all([fonts, profile]).then(() => { assetsReady = true; schedule(); }).catch(release);
    } catch { release(); }
  };
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.addEventListener("DOMContentLoaded", prepare, { once: true });
    document.addEventListener("visibilitychange", schedule);
    document.addEventListener("prerenderingchange", schedule);
    boot.dataset.homeBoot = "armed";
    prepare();
  } catch { release(); }
})();`;
