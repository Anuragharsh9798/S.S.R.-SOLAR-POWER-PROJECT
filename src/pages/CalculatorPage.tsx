import { Layout } from "@/components/Layout";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/PageHero";
import { SolarCalculator } from "@/components/sections/SolarCalculator";
import { FaqSection } from "@/components/sections/Faq";
import { CtaBanner } from "@/components/sections/CtaBanner";

const CalculatorPage = () => (
  <Layout>
    <Seo
      title="Solar Savings Calculator | Estimate Size, Cost & Subsidy | SSR Solar Power"
      description="Estimate your recommended plant size, system cost and government subsidy with the SSR Solar Power calculator."
      path="/calculator"
    />
    <PageHero
      eyebrow="Solar Calculator"
      title="Estimate your savings in under a minute"
      description="Enter your bill and consumption to see indicative sizing, project cost and subsidy for your rooftop."
      image="https://images.unsplash.com/photo-1545209463-e2825498edbf?w=1920&q=80"
    />
    <SolarCalculator />
    <FaqSection />
    <CtaBanner />
  </Layout>
);

export default CalculatorPage;

