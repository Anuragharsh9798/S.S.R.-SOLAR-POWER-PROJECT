import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

let globalLenis: Lenis | null = null;

export const getLenis = (): Lenis | null => globalLenis;

export const scrollToTop = (options?: { immediate?: boolean }) => {
  if (globalLenis) {
    globalLenis.scrollTo(0, {
      immediate: options?.immediate ?? false,
      duration: options?.immediate ? 0 : 1.2,
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

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      syncTouch: false,
    });

    globalLenis = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      globalLenis = null;
    };
  }, []);

  return null;
};

