import { Layout } from "@/components/Layout";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/PageHero";
import { FaqSection } from "@/components/sections/Faq";
import { CtaBanner } from "@/components/sections/CtaBanner";

const Faq = () => (
  <Layout>
    <Seo
      title="Solar FAQ | Costs, Subsidy, Warranty & Maintenance | SSR Solar Power"
      description="Answers to the most common solar questions: savings, roof area, subsidy amounts, installation time, warranty, net metering and payback period."
      path="/faq"
    />
    <PageHero
      eyebrow="FAQ"
      title="Everything you wanted to ask about solar"
      description="Costs, subsidy, maintenance, warranty and payback — answered by our consultants."
      image="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1920&q=80"
    />
    <FaqSection heading={false} />
    <CtaBanner />
  </Layout>
);

export default Faq;
