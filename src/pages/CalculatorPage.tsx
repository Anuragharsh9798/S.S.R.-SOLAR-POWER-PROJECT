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
      title="Solar Savings Calculator"
      className="pb-10 md:pb-14"
      description="Calculate your estimated rooftop solar plant size, required roof area, and potential monthly and annual electricity bill savings in seconds. This interactive calculator provides indicative estimates based on your typical electricity bill, monthly unit consumption, available rooftop area, and location parameters. Please note that actual solar generation and final financial returns depend on specific site orientation, shading, roof structure, and local DISCOM net metering guidelines. For a precise engineering assessment and customized quotation, get in touch with our solar specialists."
      image="https://images.unsplash.com/photo-1545209463-e2825498edbf?w=1920&q=80"
    />
    <SolarCalculator heading={false} className="pt-0 pb-10 md:pb-14" />
    <FaqSection className="py-10 md:py-14" />
    <CtaBanner />
  </Layout>
);

export default CalculatorPage;

