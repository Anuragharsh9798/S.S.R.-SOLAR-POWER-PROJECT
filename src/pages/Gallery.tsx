import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/PageHero";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { galleryImages } from "@/data/site";

const categories = ["All", "Residential", "Commercial"];

const Gallery = () => {
  const [active, setActive] = useState("All");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const visible = active === "All" ? galleryImages : galleryImages.filter((i) => i.category === active);

  return (
    <Layout>
      <Seo
        title="Solar Installation Gallery | SSR Solar Power"
        description="Photo gallery of rooftop and commercial solar installations, products and maintenance work by SSR Solar Power."
        path="/gallery"
      />
      <PageHero
        eyebrow="Gallery"
        title="Our work, frame by frame"
        description="Rooftops, ground mounts, control rooms and service visits from across our project portfolio."
        image="/reference/WhatsApp Image 2026-08-12 at 1.15.05 AM (1).jpeg"
      />

      <section className="section pt-0">
        <div className="container-wide">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setActive(c)}
                className={`rounded-full border px-5 py-2 text-sm font-medium transition-all duration-300 ${
                  active === c
                    ? "border-transparent bg-gradient-brand text-primary-foreground shadow-glow"
                    : "border-border bg-card hover:border-primary/40 hover:text-primary"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <motion.div layout className="mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
            <AnimatePresence mode="popLayout">
              {visible.map((img, i) => (
                <motion.button
                  key={img.src}
                  layout
                  type="button"
                  onClick={() => setLightbox(img.src)}
                  initial={{ opacity: 0, scale: 0.94, filter: "blur(6px)" }}
                  whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  viewport={{ once: true }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="group gallery-card-glow block w-full text-left transition-all duration-500"
                >
                  <div className="relative h-full w-full overflow-hidden rounded-3xl transition-all duration-500 gallery-card-gradient-border">
                    <motion.img
                      src={img.src}
                      alt={img.alt}
                      loading="lazy"
                      animate={{
                        scale: [1, 1.05, 1],
                        x: [0, 4, 0, -4, 0],
                        y: [0, -5, 0],
                      }}
                      transition={{
                        duration: 7.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: (i % 5) * 0.3,
                      }}
                      whileHover={{ scale: 1.1, transition: { duration: 0.4 } }}
                      className="w-full object-cover transition-shadow duration-500"
                    />
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-6"
          >
            <img src={lightbox} alt="Enlarged gallery view" className="max-h-[85vh] w-auto rounded-2xl" />
          </motion.div>
        )}
      </AnimatePresence>

      <CtaBanner />
    </Layout>
  );
};

export default Gallery;
