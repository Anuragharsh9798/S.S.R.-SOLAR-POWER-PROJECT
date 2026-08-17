import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollToTop } from "./components/ScrollToTop";
import { ThemeProvider } from "./components/ThemeProvider";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Products from "./pages/Products";
import CalculatorPage from "./pages/CalculatorPage";
import Projects from "./pages/Projects";
import Gallery from "./pages/Gallery";
import Subsidy from "./pages/Subsidy";
import ReferAndEarn from "./pages/ReferAndEarn";
import AdminReferrals from "./pages/AdminReferrals";
import AdminDatabase from "./pages/AdminDatabase";
import TestimonialsPage from "./pages/TestimonialsPage";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import Faq from "./pages/Faq";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Maintenance from "./pages/Maintenance";
import NotFound from "./pages/NotFound";

import OnGridSolar from "./pages/OnGridSolar";
import HybridSolar from "./pages/HybridSolar";

import SolarPanelsDetail from "./pages/SolarPanelsDetail";
import HybridInverterDetail from "./pages/HybridInverterDetail";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, scale: 0.96, filter: "blur(14px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 1.02, filter: "blur(14px)" }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/solar-solutions/on-grid" element={<OnGridSolar />} />
          <Route path="/solar-solutions/hybrid" element={<HybridSolar />} />
          <Route path="/solar-solutions/off-grid" element={<HybridSolar />} />
          <Route path="/on-grid-solar" element={<OnGridSolar />} />
          <Route path="/hybrid-solar" element={<HybridSolar />} />
          <Route path="/off-grid-solar" element={<HybridSolar />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/solar-panels" element={<SolarPanelsDetail />} />
          <Route path="/products/hybrid-inverter" element={<HybridInverterDetail />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/subsidy" element={<Subsidy />} />
          <Route path="/pm-surya-ghar-yojana" element={<Subsidy />} />
          <Route path="/refer-and-earn" element={<ReferAndEarn />} />
          <Route path="/admin/referrals" element={<AdminReferrals />} />
          <Route path="/admin/database" element={<AdminDatabase />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="bottom-center" />
        <BrowserRouter>
          <ScrollToTop />
          <AnimatedRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
