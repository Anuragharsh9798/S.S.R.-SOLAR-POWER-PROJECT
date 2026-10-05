import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

let globalLenis: Lenis | null = null;

export const getLenis = (): Lenis | null => globalLenis;

export const pauseLenis = () => {
  if (globalLenis) {
    globalLenis.stop();
  }
};

export const resumeLenis = () => {
  if (globalLenis) {
    globalLenis.start();
  }
};

export const scrollToTop = (options?: { immediate?: boolean }) => {
  if (globalLenis) {
    globalLenis.scrollTo(0, {
      immediate: options?.immediate ?? false,
      duration: options?.immediate ? 0 : 1.0,
    });
  } else if (typeof window !== "undefined") {
    window.scrollTo({
      top: 0,
      behavior: options?.immediate ? "instant" : "smooth",
    });
  }
};

export const SmoothScroll = () => {
  useEffect(() => {
    // Keep single persistent Lenis instance across navigation
    if (globalLenis) return;

    // Detect touch device
    const isTouch = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: !isTouch, // Use native hardware momentum scrolling on mobile touch devices
      syncTouch: false,
      touchMultiplier: 1.0,
    });

    globalLenis = lenis;

    let rafId = 0;
    let isRunning = true;

    const raf = (time: number) => {
      if (!isRunning) return;
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      isRunning = false;
      cancelAnimationFrame(rafId);
      lenis.destroy();
      globalLenis = null;
    };
  }, []);

  return null;
};

