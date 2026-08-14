import { Layout } from "@/components/Layout";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/PageHero";
import { StatsSection } from "@/components/sections/Stats";
import { WhyChoose } from "@/components/sections/WhyChoose";
import { InstallationProcess } from "@/components/sections/Timelines";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { motion } from "framer-motion";
import { Eye, Heart, Target } from "lucide-react";

const pillars = [
  { icon: Target, title: "Our Mission", text: "Make clean, affordable solar energy the default choice for every Indian home and business." },
  { icon: Eye, title: "Our Vision", text: "Power one gigawatt of rooftops by 2032 without compromising on engineering quality." },
  { icon: Heart, title: "Our Values", text: "Transparent pricing, honest sizing, no hidden costs and service that outlives the warranty." },
];

const About = () => (
  <Layout>
    <Seo
      title="About SSR Solar Power | Certified Solar EPC Since 2016"
      description="Meet SSR Solar Power — MNRE-empanelled engineers who have delivered 1000+ solar installations and 100 KW+ of clean capacity across India."
      path="/about"
    />
    <PageHero
      eyebrow="About Us"
      title="A decade of building solar people can rely on"
      description="Since 2016, SSR Solar Power has designed, installed and maintained more than 1000 solar systems — from single-family rooftops to commercial plants."
    />

    <section className="section pt-0">
      <div className="container-wide grid gap-10 lg:grid-cols-2 lg:items-center">
        <motion.img
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          src="https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=1200&q=80"
          alt="SSR Solar Power engineers installing rooftop solar modules"
          loading="lazy"
          className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-card"
        />
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="eyebrow">Our Story</span>
          <h2 className="mt-5 text-3xl leading-tight md:text-4xl">Built by engineers, not resellers</h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            We started with a single 3 kW rooftop in Hyderabad and a simple conviction: most solar disappointments come
            from bad sizing and worse service, not bad panels. Every SSR Solar Power system is engineered around your
            actual load curve, roof structure and DISCOM rules.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Today our in-house teams handle survey, design, installation, DISCOM liaison and lifetime maintenance —
            so accountability never gets passed between vendors.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {pillars.map(({ icon: Icon, title, text }) => (
              <div key={title} className="group about-card-glow relative transition-all duration-500">
                <div className="relative h-full w-full overflow-hidden rounded-2xl p-5 transition-all duration-500 about-card-gradient-border">
                  <Icon className="h-5 w-5 text-primary" />
                  <h3 className="mt-3 text-sm font-semibold">{title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>

    <StatsSection />
    <WhyChoose />
    <InstallationProcess />
    <CtaBanner />
  </Layout>
);

export default About;
