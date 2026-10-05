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
      description={
        <>
          <p>
            SSR Solar Power provides comprehensive rooftop solar installation and engineering services for residential homes, commercial properties, and institutions across Uttar Pradesh. We guide customers through every phase of their solar journey, starting with a meticulous on-site rooftop assessment to evaluate available shadow-free area, structural stability, and actual electricity consumption patterns for proper system sizing and design.
          </p>
          <p>
            Our service offerings encompass both high-efficiency on-grid systems for optimal electricity bill savings and hybrid solar solutions for reliable backup power. From professional installation and electrical or DISCOM coordination where applicable, to rigorous system commissioning, routine maintenance, and dependable post-installation support, we ensure your solar plant performs safely and consistently over the long term.
          </p>
        </>
      }
      image="https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=1920&q=80"
    />
    <ServicesSection className="pt-0 md:pt-2" />
    <InstallationProcess className="pt-8 md:pt-12 pb-12 md:pb-16" />
    <FaqSection className="pt-4 md:pt-6" />
    <CtaBanner />
  </Layout>
);

export default Services;
