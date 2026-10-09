"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import type { WorkSlide } from "@/data/projects";

// Provisional grid and camera limits, independent of the number of images.
export const WORK_CANVAS_MAX_COLUMNS = 5;
export const WORK_CANVAS_ZOOM = { min: 0.35, max: 2.5, default: 1 };
export function getCanvasLayout(count: number, maxColumns = WORK_CANVAS_MAX_COLUMNS) {
  const columns = Math.min(Math.max(1, maxColumns), Math.max(1, count));
  return { columns, rows: Math.ceil(count / columns), initialIndex: 0 };
}

type Point = { x: number; y: number };
type Camera = Point & { scale: number };
type FrameGeometry = Point & { width: number; height: number };
type Geometry = { frames: FrameGeometry[]; anchor: Point };
type Gesture = { id: number; start: Point; camera: Camera; moved: boolean };
type Pinch = { distance: number; scale: number; world: Point };

function Arrow({ direction }: { direction: "left" | "right" }) {
  return <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={direction === "left" ? "M15 10H5m5-5-5 5 5 5" : "M5 10h10m-5-5 5 5-5 5"} />
  </svg>;
}

export function WorkCanvas({ items }: { items: readonly WorkSlide[] }) {
  const { columns } = getCanvasLayout(items.length);
  const viewport = useRef<HTMLDivElement>(null);
  const plane = useRef<HTMLDivElement>(null);
  const camera = useRef<Camera | null>(null);
  const geometry = useRef<Geometry | null>(null);
  const currentIndex = useRef(0);
  const gesture = useRef<Gesture | null>(null);
  const pointers = useRef(new Map<number, Point>());
  const pinch = useRef<Pinch | null>(null);
  const suppressClick = useRef(false);
  const pendingFrame = useRef<number | null>(null);
  const returnFocus = useRef<HTMLButtonElement | null>(null);
  const restoreFocus = useRef(false);
  const backButton = useRef<HTMLButtonElement>(null);
  const [dock, setDock] = useState<HTMLElement | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const bindViewport = useCallback((node: HTMLDivElement | null) => {
    viewport.current = node;
    setDock(node?.ownerDocument.getElementById("work-canvas-controls") ?? null);
  }, []);
  const selectFrame = useCallback((index: number) => {
    if (currentIndex.current !== index) {
      currentIndex.current = index;
      setSelectedIndex(index);
    }
    if (viewport.current) viewport.current.dataset.currentFrame = items[index]?.id ?? "";
  }, [items]);

  const applyCamera = useCallback((next: Camera, smooth = false, reselect = true) => {
    const canvas = plane.current;
    const view = viewport.current;
    const measured = geometry.current;
    if (!canvas || !view || !measured) return;
    const scale = Math.max(WORK_CANVAS_ZOOM.min, Math.min(WORK_CANVAS_ZOOM.max, next.scale));
    camera.current = { x: next.x, y: next.y, scale };
    canvas.dataset.panning = smooth ? "smooth" : "direct";
    canvas.style.setProperty("--canvas-x", `${next.x}px`);
    canvas.style.setProperty("--canvas-y", `${next.y}px`);
    canvas.style.setProperty("--canvas-zoom", String(scale));
    view.dataset.panX = String(next.x);
    view.dataset.panY = String(next.y);
    view.dataset.zoom = String(scale);
    if (reselect && measured.frames.length) {
      const distances = measured.frames.map((frame) => Math.hypot(frame.x * scale + next.x - measured.anchor.x, frame.y * scale + next.y - measured.anchor.y));
      const closest = distances.indexOf(Math.min(...distances));
      // A 24px screen-space advantage prevents flicker around frame midpoints.
      if (distances[currentIndex.current] === undefined || distances[closest] + 24 < distances[currentIndex.current]) selectFrame(closest);
    }
  }, [selectFrame]);

  const queueCamera = useCallback((next: Camera) => {
    camera.current = next;
    if (pendingFrame.current !== null) return;
    pendingFrame.current = requestAnimationFrame(() => {
      pendingFrame.current = null;
      if (camera.current) applyCamera(camera.current);
    });
  }, [applyCamera]);

  // Sample the visible CSS transform when a drag/zoom interrupts a smooth pan.
  const interruptCamera = useCallback(() => {
    if (pendingFrame.current !== null) { cancelAnimationFrame(pendingFrame.current); pendingFrame.current = null; }
    if (!plane.current || !camera.current) return;
    const matrix = new DOMMatrixReadOnly(getComputedStyle(plane.current).transform);
    applyCamera({ x: matrix.e, y: matrix.f, scale: matrix.a });
  }, [applyCamera]);

  const centerFrame = useCallback((index: number) => {
    const measured = geometry.current;
    if (!measured?.frames.length || !camera.current) return;
    const target = ((index % measured.frames.length) + measured.frames.length) % measured.frames.length;
    const frame = measured.frames[target];
    selectFrame(target);
    applyCamera({ x: measured.anchor.x - frame.x * camera.current.scale, y: measured.anchor.y - frame.y * camera.current.scale, scale: camera.current.scale }, true, false);
  }, [applyCamera, selectFrame]);

  const resetView = useCallback(() => {
    const measured = geometry.current;
    if (!measured?.frames.length) return;
    if (pendingFrame.current !== null) { cancelAnimationFrame(pendingFrame.current); pendingFrame.current = null; }
    selectFrame(0);
    applyCamera({ x: measured.anchor.x - measured.frames[0].x, y: measured.anchor.y - measured.frames[0].y, scale: WORK_CANVAS_ZOOM.default }, true, false);
  }, [applyCamera, selectFrame]);

  const zoomTo = useCallback((requested: number, focal?: Point, smooth = true) => {
    const measured = geometry.current;
    if (!camera.current || !measured) return;
    if (plane.current?.dataset.panning === "smooth") interruptCamera();
    const previous = camera.current!;
    const scale = Math.max(WORK_CANVAS_ZOOM.min, Math.min(WORK_CANVAS_ZOOM.max, requested));
    const point = focal ?? measured.anchor;
    const world = { x: (point.x - previous.x) / previous.scale, y: (point.y - previous.y) / previous.scale };
    applyCamera({ x: point.x - world.x * scale, y: point.y - world.y * scale, scale }, smooth);
  }, [applyCamera, interruptCamera]);

  useLayoutEffect(() => {
    const view = viewport.current;
    const canvas = plane.current;
    if (!view || !canvas || !items.length) return;
    const nav = dock?.closest<HTMLElement>(".site-nav");
    const measure = () => {
      const clearance = parseFloat(getComputedStyle(view).getPropertyValue("--dock-clearance")) || 0;
      // Layout dimensions stay stable while the separate route wrapper animates.
      const availableHeight = nav ? view.clientHeight - (parseFloat(getComputedStyle(nav).bottom) || 0) - nav.offsetHeight - clearance : view.clientHeight;
      view.style.setProperty("--canvas-available-height", `${availableHeight}px`);
      const frames = Array.from(canvas.querySelectorAll<HTMLElement>(".work-canvas-item")).map((frame) => ({
        x: frame.offsetLeft + frame.offsetWidth / 2, y: frame.offsetTop + frame.offsetHeight / 2,
        width: frame.offsetWidth, height: frame.offsetHeight,
      }));
      const anchor = { x: view.clientWidth / 2, y: availableHeight / 2 };
      const previous = geometry.current;
      const index = Math.min(currentIndex.current, frames.length - 1);
      const frame = frames[index];
      let next: Camera;
      if (previous && camera.current && previous.frames[index]) {
        const old = previous.frames[index];
        next = {
          x: anchor.x - frame.x * camera.current.scale + (camera.current.x + old.x * camera.current.scale - previous.anchor.x) * frame.width / old.width,
          y: anchor.y - frame.y * camera.current.scale + (camera.current.y + old.y * camera.current.scale - previous.anchor.y) * frame.height / old.height,
          scale: camera.current.scale,
        };
      } else next = { x: anchor.x - frames[0].x, y: anchor.y - frames[0].y, scale: WORK_CANVAS_ZOOM.default };
      geometry.current = { frames, anchor };
      selectFrame(index);
      applyCamera(next, false, false);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(view);
    observer.observe(canvas);
    if (nav) observer.observe(nav);
    return () => {
      observer.disconnect();
      if (pendingFrame.current !== null) { cancelAnimationFrame(pendingFrame.current); pendingFrame.current = null; }
    };
  }, [applyCamera, dock, items, selectFrame]);

  useEffect(() => {
    const view = viewport.current;
    if (!view) return;
    const wheel = (event: WheelEvent) => {
      if (focusedIndex !== null || !camera.current) return;
      event.preventDefault();
      if (plane.current?.dataset.panning === "smooth") interruptCamera();
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? view.clientHeight : 1;
      if (event.ctrlKey || event.metaKey) {
        const bounds = view.getBoundingClientRect();
        zoomTo(camera.current.scale * Math.exp(-event.deltaY * unit * 0.0025), { x: event.clientX - bounds.left, y: event.clientY - bounds.top }, false);
      } else {
        queueCamera({ ...camera.current!, x: camera.current!.x - event.deltaX * unit, y: camera.current!.y - event.deltaY * unit });
      }
    };
    view.addEventListener("wheel", wheel, { passive: false });
    return () => view.removeEventListener("wheel", wheel);
  }, [focusedIndex, interruptCamera, queueCamera, zoomTo]);

  const closeFocus = useCallback(() => { restoreFocus.current = true; setFocusedIndex(null); }, []);
  useLayoutEffect(() => {
    if (focusedIndex !== null) backButton.current?.focus({ preventScroll: true });
    else if (restoreFocus.current) {
      returnFocus.current?.focus({ preventScroll: true });
      restoreFocus.current = false;
    }
  }, [focusedIndex]);
  useEffect(() => {
    if (focusedIndex === null) return;
    const escape = (event: globalThis.KeyboardEvent) => { if (event.key === "Escape") { event.preventDefault(); closeFocus(); } };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [focusedIndex, closeFocus]);

  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || (!event.isPrimary && event.pointerType !== "touch")) return;
    if (!pointers.current.size) interruptCamera();
    if (!camera.current) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (event.pointerType === "touch" && pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const bounds = event.currentTarget.getBoundingClientRect();
      const midpoint = { x: (a.x + b.x) / 2 - bounds.left, y: (a.y + b.y) / 2 - bounds.top };
      pinch.current = { distance: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)), scale: camera.current.scale, world: { x: (midpoint.x - camera.current.x) / camera.current.scale, y: (midpoint.y - camera.current.y) / camera.current.scale } };
      gesture.current = null;
      suppressClick.current = true;
      for (const id of pointers.current.keys()) event.currentTarget.setPointerCapture(id);
      event.currentTarget.dataset.dragging = "true";
    } else if (pointers.current.size === 1) {
      suppressClick.current = false;
      gesture.current = { id: event.pointerId, start: { x: event.clientX, y: event.clientY }, camera: { ...camera.current }, moved: false };
    }
  }
  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pinch.current && pointers.current.size >= 2) {
      const [a, b] = [...pointers.current.values()];
      const bounds = event.currentTarget.getBoundingClientRect();
      const scale = Math.max(WORK_CANVAS_ZOOM.min, Math.min(WORK_CANVAS_ZOOM.max, pinch.current.scale * Math.hypot(a.x - b.x, a.y - b.y) / pinch.current.distance));
      queueCamera({ x: (a.x + b.x) / 2 - bounds.left - pinch.current.world.x * scale, y: (a.y + b.y) / 2 - bounds.top - pinch.current.world.y * scale, scale });
      return;
    }
    const active = gesture.current;
    if (!active || active.id !== event.pointerId) return;
    if (event.buttons === 0) { pointers.current.delete(event.pointerId); gesture.current = null; event.currentTarget.dataset.dragging = "false"; return; }
    const x = event.clientX - active.start.x, y = event.clientY - active.start.y;
    if (!active.moved && Math.hypot(x, y) < 6) return;
    if (!active.moved) { active.moved = true; event.currentTarget.setPointerCapture(event.pointerId); event.currentTarget.dataset.dragging = "true"; }
    queueCamera({ ...active.camera, x: active.camera.x + x, y: active.camera.y + y });
  }
  function pointerEnd(event: PointerEvent<HTMLDivElement>) {
    if (event.type === "lostpointercapture" && event.currentTarget.hasPointerCapture(event.pointerId)) return;
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.delete(event.pointerId);
    suppressClick.current = suppressClick.current || !!pinch.current || !!gesture.current?.moved || event.type === "pointercancel";
    if (pinch.current) {
      pinch.current = null;
      if (camera.current) applyCamera(camera.current);
      const remaining = [...pointers.current.entries()][0];
      gesture.current = remaining && camera.current ? { id: remaining[0], start: remaining[1], camera: { ...camera.current }, moved: true } : null;
    } else gesture.current = null;
    if (!pointers.current.size) event.currentTarget.dataset.dragging = "false";
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }
  function leaveInspection() { restoreFocus.current = false; setFocusedIndex(null); }
  function navigate(direction: -1 | 1 | 0) {
    leaveInspection();
    if (direction === 0) resetView(); else centerFrame(currentIndex.current + direction);
  }
  function zoomButton(direction: -1 | 1) {
    leaveInspection();
    if (camera.current) zoomTo(camera.current.scale * (direction === 1 ? 1.2 : 1 / 1.2));
  }
  function keyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey || !camera.current) return;
    const directions: Record<string, Point> = { ArrowLeft: { x: 80, y: 0 }, ArrowRight: { x: -80, y: 0 }, ArrowUp: { x: 0, y: 80 }, ArrowDown: { x: 0, y: -80 } };
    const direction = directions[event.key];
    if (direction) { event.preventDefault(); interruptCamera(); applyCamera({ ...camera.current!, x: camera.current!.x + direction.x, y: camera.current!.y + direction.y }); }
    else if (event.key === "Home" || event.key === "0") { event.preventDefault(); resetView(); }
    else if (event.key === "+" || event.key === "=" || event.key === "-") { event.preventDefault(); zoomButton(event.key === "-" ? -1 : 1); }
  }

  const focused = focusedIndex === null ? null : items[focusedIndex];
  const style = { "--canvas-columns": columns, "--canvas-first-ratio": items[0]?.image.aspectRatio ?? 1.6 } as CSSProperties;
  return <>
    <p className="sr-only" id="work-canvas-instructions">Drag or scroll in any direction to explore. Use Control or Command with the wheel, pinch, or the zoom buttons to zoom. Arrow keys pan; Home or 0 resets the view. Select an image to inspect it; Back or Escape returns.</p>
    <div ref={bindViewport} className="work-canvas-viewport" role="region" aria-label="Work image canvas" aria-describedby="work-canvas-instructions" tabIndex={0} inert={focused !== null}
      onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerEnd} onPointerCancel={pointerEnd} onLostPointerCapture={pointerEnd} onKeyDown={keyDown}
      onClickCapture={(event) => { if (suppressClick.current && event.detail !== 0) { event.preventDefault(); event.stopPropagation(); } suppressClick.current = false; }}>
      {items.length ? <div ref={plane} className="work-canvas-plane" style={style}>
        {items.map((item, index) => <figure key={item.id} className="work-canvas-item" data-frame-id={item.id} data-selected={selectedIndex === index ? "true" : undefined} style={{ "--canvas-image-ratio": item.image.aspectRatio ?? 1.6 } as CSSProperties}>
          <figcaption>{item.name}</figcaption>
          <button type="button" className="work-canvas-frame" aria-label={`Inspect ${item.name} image ${index + 1}`} aria-current={selectedIndex === index ? "true" : undefined}
            onFocus={() => { if (!gesture.current && !pinch.current && !restoreFocus.current && focusedIndex === null) centerFrame(index); }}
            onClick={(event) => { selectFrame(index); returnFocus.current = event.currentTarget; setFocusedIndex(index); }}>
            <Image src={item.image.src} alt={item.image.alt} fill sizes="(max-width: 1083px) 180vw, 1950px" draggable={false} preload={index === 0} />
          </button>
        </figure>)}
      </div> : <p className="work-canvas-empty">No work images published yet.</p>}
    </div>
    {focused && <section className="work-canvas-focus" role="dialog" aria-modal="false" aria-labelledby="work-focus-heading">
      <button type="button" ref={backButton} className="work-canvas-back" onClick={closeFocus}><Arrow direction="left" />Back</button>
      <figure style={{ "--canvas-image-ratio": focused.image.aspectRatio ?? 1.6 } as CSSProperties}>
        <figcaption id="work-focus-heading">{focused.name}</figcaption>
        <div className="work-canvas-focus-image"><Image src={focused.image.src} alt={focused.image.alt} fill sizes="(max-width: 1200px) 100vw, 1200px" draggable={false} /></div>
      </figure>
    </section>}
    {dock && createPortal(<>
      <div className="work-canvas-step-controls" role="group" aria-label="Frame navigation">
        <button type="button" aria-label="Previous frame" title="Previous frame" disabled={items.length < 2} onClick={() => navigate(-1)}><Arrow direction="left" /></button>
        <output className="work-canvas-counter" aria-label={`Frame ${items.length ? selectedIndex + 1 : 0} of ${items.length}`}>{items.length ? selectedIndex + 1 : 0} / {items.length}</output>
        <button type="button" aria-label="Next frame" title="Next frame" disabled={items.length < 2} onClick={() => navigate(1)}><Arrow direction="right" /></button>
      </div>
      <div className="work-canvas-zoom-controls" role="group" aria-label="Canvas zoom">
        <button type="button" aria-label="Zoom out" title="Zoom out" disabled={!items.length} onClick={() => zoomButton(-1)}><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true"><path d="M5 10h10" /></svg></button>
        <button type="button" aria-label="Zoom in" title="Zoom in" disabled={!items.length} onClick={() => zoomButton(1)}><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true"><path d="M5 10h10M10 5v10" /></svg></button>
        <button type="button" className="work-canvas-reset" aria-label="Reset view and zoom" title="Reset view and zoom" disabled={!items.length} onClick={() => navigate(0)}>Reset</button>
      </div>
    </>, dock)}
  </>;
}
