import { motion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { whyChoose } from "@/data/site";
import { MotionSection } from "@/components/motion";

export const WhyChoose = () => (
  <MotionSection animation="fadeRight" className="section py-10 md:py-14 bg-gradient-soft">
    <div className="container-wide">
      <SectionHeading
        eyebrow="Why SSR Solar Power"
        title={<>Engineering, paperwork and service — <span className="text-gradient">handled end to end</span></>}
        description="Everything that makes a solar investment safe, bankable and genuinely low-maintenance."
      />

      <div className="mt-8 md:mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {whyChoose.map(({ icon: Icon, title, description }, i) => (
          <motion.article
            key={title}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: i * 0.07 }}
            className="group feature-card-glow relative transition-all duration-500"
          >
            <div className="relative h-full w-full overflow-hidden rounded-3xl p-7 transition-all duration-500 feature-card-gradient-border">
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-brand opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30" aria-hidden />
              <span className="btn-premium flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand shadow-glow transition-transform duration-500 group-hover:scale-110">
                <Icon className="h-5 w-5 text-primary-foreground" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  </MotionSection>
);
