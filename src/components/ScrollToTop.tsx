import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToTop } from "./SmoothScroll";

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll the new page to the top immediately after navigation
    const rafId = requestAnimationFrame(() => {
      scrollToTop({ immediate: true });
    });

    return () => cancelAnimationFrame(rafId);
  }, [pathname]);

  return null;
};

