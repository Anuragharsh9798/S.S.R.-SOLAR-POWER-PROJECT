import { Layout } from "@/components/Layout";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/PageHero";
import { SolarCalculator } from "@/components/sections/SolarCalculator";
import { FaqSection } from "@/components/sections/Faq";
import { CtaBanner } from "@/components/sections/CtaBanner";

const CalculatorPage = () => (
  <Layout>
    <Seo
      title="Solar Savings Calculator | Estimate Plant Size & Savings | SSR Solar Power"
      description="Calculate your recommended rooftop solar plant size, monthly savings, annual savings and CO2 reduction with SSR Solar Power."
      path="/calculator"
    />
    <PageHero
      eyebrow="Solar Calculator"
      title="Estimate your savings in under a minute"
      description="Enter your bill, consumption and roof size to see recommended plant size, monthly & annual savings and carbon reduction for your rooftop."
      image="https://images.unsplash.com/photo-1545209463-e2825498edbf?w=1920&q=80"
    />
    <SolarCalculator />
    <FaqSection />
    <CtaBanner />
  </Layout>
);

export default CalculatorPage;

