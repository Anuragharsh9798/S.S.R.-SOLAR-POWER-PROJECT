import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { FloatingActions } from "./FloatingActions";
import { FreeQuoteModal } from "./FreeQuoteModal";
import { ScrollProgress } from "./ScrollProgress";
import { CookieConsent } from "./CookieConsent";
import { PageLoader } from "./PageLoader";
import { AmbientBackground } from "./AmbientBackground";
import { SmoothScroll } from "./SmoothScroll";
import { CustomCursor } from "./CustomCursor";

export const Layout = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-screen flex-col">
    <PageLoader />
    <CustomCursor />
    <SmoothScroll />
    <AmbientBackground />
    <ScrollProgress />
    <Navbar />
    <main className="flex-1">
      {children}
    </main>
    <Footer />
    <FloatingActions />
    <FreeQuoteModal />
    <CookieConsent />
  </div>
);
