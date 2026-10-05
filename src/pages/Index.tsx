import { Layout } from "@/components/Layout";
import { Seo } from "@/components/Seo";
import { SolarIntroAnimation } from "@/components/SolarIntroAnimation";
import { Hero } from "@/components/sections/Hero";
import { TrustedBy, StatsSection } from "@/components/sections/Stats";
import { WhyChoose } from "@/components/sections/WhyChoose";
import { ServicesSection } from "@/components/sections/Services";
import { EnergyFlowSection } from "@/components/sections/EnergyFlow";
import { InstallationProcess, SubsidyTimeline } from "@/components/sections/Timelines";
import { ProjectsGrid } from "@/components/sections/Projects";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { RealTimeMonitoring } from "@/components/sections/RealTimeMonitoring";
import { Testimonials } from "@/components/sections/Testimonials";
import { VideoSection } from "@/components/sections/VideoSection";
import { BlogSection } from "@/components/sections/Blog";
import { FaqSection } from "@/components/sections/Faq";
import { SchemePromoCard } from "@/components/SchemePromoCard";

const Index = () => (
  <Layout>
    <SolarIntroAnimation />
    <Seo
      title="SSR Solar Power | Residential & Commercial Solar Solutions"
      description="Reduce your electricity bills by up to 90% with SSR Solar Power — premium rooftop and commercial solar systems, subsidy assistance, EMI options and 25-year warranty."
      path="/"
    />
    <Hero />
    <TrustedBy />
    <StatsSection />
    <WhyChoose />
    <ServicesSection />
    <EnergyFlowSection />
    <RealTimeMonitoring />
    <SubsidyTimeline />
    <InstallationProcess />
    <ProjectsGrid />
    <BeforeAfter />
    <Testimonials isHomePage={true} />
    <VideoSection />
    <BlogSection />
    <FaqSection />
    <SchemePromoCard />
  </Layout>
);

export default Index;
