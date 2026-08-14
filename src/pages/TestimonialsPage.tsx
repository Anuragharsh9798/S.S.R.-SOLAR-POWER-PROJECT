import { Layout } from "@/components/Layout";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/PageHero";
import { Testimonials } from "@/components/sections/Testimonials";
import { StatsSection } from "@/components/sections/Stats";
import { CtaBanner } from "@/components/sections/CtaBanner";

const TestimonialsPage = () => (
  <Layout>
    <Seo
      title="Customer Testimonials | SSR Solar Power Reviews"
      description="Read verified reviews from homeowners and business customers powered by SSR Solar Power."
      path="/testimonials"
    />
    <PageHero
      eyebrow="Testimonials"
      title="98% of our customers would recommend us"
      description="Real feedback from the rooftops, factories and farms we've powered across South India."
      image="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1920&q=80"
    />
    <Testimonials />
    <StatsSection />
    <CtaBanner />
  </Layout>
);

export default TestimonialsPage;
