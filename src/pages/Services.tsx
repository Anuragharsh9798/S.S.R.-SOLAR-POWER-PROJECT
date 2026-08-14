import { Layout } from "@/components/Layout";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/PageHero";
import { ServicesSection } from "@/components/sections/Services";
import { InstallationProcess } from "@/components/sections/Timelines";
import { FaqSection } from "@/components/sections/Faq";
import { CtaBanner } from "@/components/sections/CtaBanner";

const Services = () => (
  <Layout>
    <Seo
      title="Solar Services | Residential & Commercial | SSR Solar Power"
      description="Rooftop solar, commercial plants, and solar water pumps from SSR Solar Power."
      path="/services"
    />
    <PageHero
      eyebrow="Services"
      title="Complete solar services under one roof"
      description="Design, supply, installation, DISCOM liaison and lifetime maintenance — delivered by in-house certified teams."
      image="https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=1920&q=80"
    />
    <ServicesSection />
    <InstallationProcess />
    <FaqSection />
    <CtaBanner />
  </Layout>
);

export default Services;
