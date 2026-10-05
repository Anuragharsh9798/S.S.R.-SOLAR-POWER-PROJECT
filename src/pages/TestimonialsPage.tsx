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
      title="Verified Client Feedback"
      className="pb-10 md:pb-14"
      description="Discover firsthand experiences from homeowners, businesses, and institutions powered by SSR Solar Power. This section features genuine feedback highlighting our solar system planning, installation quality, transparent guidance, and dedicated post-commissioning customer support across Uttar Pradesh. Read how our residential and commercial solar installations have helped property owners achieve dependable electricity savings and long-term energy independence."
      image="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1920&q=80"
    />
    <Testimonials className="pt-0 pb-10 md:pb-14" />
    <StatsSection className="py-10 md:py-14" />
    <CtaBanner />
  </Layout>
);

export default TestimonialsPage;
