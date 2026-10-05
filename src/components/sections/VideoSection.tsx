import { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { MotionSection } from "@/components/motion";

export const VideoSection = () => {
  const [playing, setPlaying] = useState(false);

  return (
    <MotionSection animation="zoomIn" id="promo-video" className="section py-10 md:py-14">
      <div className="container-wide">
        <div className="relative overflow-hidden rounded-[2rem] border shadow-card">
          {playing ? (
            <iframe
              className="aspect-video w-full"
              src="https://www.youtube.com/embed/xKxrkht7CpY?autoplay=1"
              title="SSR Solar Power — how solar works"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
              allowFullScreen
            />
          ) : (
            <div className="relative aspect-video">
              <img
                src="https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=1600&q=80"
                alt="SSR Solar Power engineers commissioning a rooftop plant"
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(222_47%_11%/0.9)] via-[hsl(222_47%_11%/0.35)] to-transparent" aria-hidden />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8 text-center text-white">
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  aria-label="Play promotional video"
                  className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-brand shadow-glow transition-transform hover:scale-110"
                >
                  <motion.span
                    className="absolute inset-0 rounded-full bg-primary/50"
                    animate={{ scale: [1, 1.55], opacity: [0.6, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                    aria-hidden
                  />
                  <Play className="relative ml-1 h-8 w-8 fill-current" />
                </button>
                <div>
                  <h2 className="text-2xl font-semibold md:text-3xl">See a full installation in 90 seconds</h2>
                  <p className="mt-2 max-w-xl text-sm text-white/80 md:text-base">
                    Survey, design, mounting, commissioning and handover — the SSR Solar Power way.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MotionSection>
  );
};
