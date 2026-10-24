import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToTop } from "./SmoothScroll";

export const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If navigating to an anchor hash, allow smooth scroll to the target element
    if (hash) return;

    // Scroll the new page to the top immediately after navigation
    const rafId = requestAnimationFrame(() => {
      scrollToTop({ immediate: true });
    });

    return () => cancelAnimationFrame(rafId);
  }, [pathname, hash]);

  return null;
};

