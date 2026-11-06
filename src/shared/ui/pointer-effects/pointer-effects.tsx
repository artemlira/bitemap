"use client";

import { useEffect } from "react";

/**
 * One set of delegated listeners for the whole app (no per-component handlers):
 * - [data-tilt]   tilts the element towards the pointer (fine pointers only)
 * - [data-ripple] spawns a water ripple from the click point
 */
export function PointerEffects() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let frame = 0;

    function handleMove(event: PointerEvent) {
      const target = (event.target as Element | null)?.closest<HTMLElement>("[data-tilt]");
      if (!target) return;
      const { clientX, clientY } = event;

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = target.getBoundingClientRect();
        const x = (clientX - bounds.left) / bounds.width - 0.5;
        const y = (clientY - bounds.top) / bounds.height - 0.5;
        target.style.setProperty("--rx", `${(-y * 6).toFixed(2)}deg`);
        target.style.setProperty("--ry", `${(x * 8).toFixed(2)}deg`);
        target.style.setProperty("--gx", `${((x + 0.5) * 100).toFixed(1)}%`);
        target.style.setProperty("--gy", `${((y + 0.5) * 100).toFixed(1)}%`);
      });
    }

    function handleOut(event: PointerEvent) {
      const target = (event.target as Element | null)?.closest<HTMLElement>("[data-tilt]");
      if (!target || target.contains(event.relatedTarget as Node | null)) return;
      target.style.removeProperty("--rx");
      target.style.removeProperty("--ry");
    }

    function handleDown(event: PointerEvent) {
      const target = (event.target as Element | null)?.closest<HTMLElement>("[data-ripple]");
      if (!target) return;
      const bounds = target.getBoundingClientRect();
      const size = Math.max(bounds.width, bounds.height) * 2;
      const ripple = document.createElement("span");
      ripple.className = "fx-ripple";
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${event.clientX - bounds.left - size / 2}px`;
      ripple.style.top = `${event.clientY - bounds.top - size / 2}px`;
      ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
      target.append(ripple);
    }

    if (canHover) {
      document.addEventListener("pointermove", handleMove, { passive: true });
      document.addEventListener("pointerout", handleOut, { passive: true });
    }
    document.addEventListener("pointerdown", handleDown, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerout", handleOut);
      document.removeEventListener("pointerdown", handleDown);
    };
  }, []);

  return null;
}
