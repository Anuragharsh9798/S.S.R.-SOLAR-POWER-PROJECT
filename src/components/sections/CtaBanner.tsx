import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { company } from "@/data/site";
import { MotionSection } from "@/components/motion";

export const CtaBanner = () => (
  <MotionSection animation="zoomIn" className="section pt-0">
    <div className="container-wide">
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.55 }}
        className="relative overflow-hidden rounded-[2rem] bg-gradient-brand px-7 py-14 text-center text-primary-foreground shadow-glow md:px-14"
      >
        <div className="blob -left-10 -top-10 h-56 w-56 bg-white/30" aria-hidden />
        <div className="blob -bottom-14 -right-10 h-64 w-64 bg-secondary/50" aria-hidden />
        <div className="relative">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold leading-tight text-balance md:text-4xl">
            Switch to Solar &amp; Cut Your Electricity Bills Up to 90% Today
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/85">
            Free site assessment, transparent pricing and full subsidy assistance from SSR Solar Power.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="group h-12 rounded-full bg-background px-7 font-semibold text-foreground hover:bg-background/90">
              <Link to="/contact">
                Get Free Quote
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-white/50 bg-white/10 px-7 font-semibold text-primary-foreground hover:bg-white/20 hover:text-primary-foreground">
              <a href={`tel:${company.phone}`}>
                <PhoneCall className="mr-2 h-4 w-4" /> {company.phone}
              </a>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  </MotionSection>
);
