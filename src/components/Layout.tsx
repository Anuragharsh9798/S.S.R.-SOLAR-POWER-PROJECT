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
import { CustomCursor } from "./CustomCursor";

export const Layout = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-screen flex-col">
    <div className="print:hidden">
      <PageLoader />
      <CustomCursor />
      <AmbientBackground />
      <ScrollProgress />
      <Navbar />
    </div>
    <main className="flex-1">
      {children}
    </main>
    <div className="print:hidden">
      <Footer />
      <FloatingActions />
      <FreeQuoteModal />
      <CookieConsent />
    </div>
  </div>
);
