import { Layout } from "@/components/Layout";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/PageHero";
import { FeaturedProducts } from "@/components/sections/Products";
import { CtaBanner } from "@/components/sections/CtaBanner";

const Products = () => (
  <Layout>
    <Seo
      title="Solar Products | Solar Panels & Hybrid Inverters | SSR Solar Power"
      description="Browse Tier-1 solar panels and hybrid inverters supplied and installed by SSR Solar Power."
      path="/products"
    />
    <PageHero
      eyebrow="Products"
      title="Hardware chosen for 25 years of service"
      className="pb-10 md:pb-14"
      description="SSR Solar Power offers a curated selection of Tier-1 solar panels, high-efficiency grid-tied and hybrid inverters, and long-life battery storage systems engineered for durable long-term performance. Every product in our catalog is chosen for proven reliability, weather resistance, and high energy yield across diverse residential rooftops and commercial facilities. Whether you are seeking to reduce monthly household electricity bills or lower daytime commercial operating overheads, our experienced engineering team provides clear, personalized guidance to help you select the most suitable and cost-effective equipment for your specific energy requirements."
      image="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1920&q=80"
    />
    <FeaturedProducts className="pt-0 md:pt-4" />
    <CtaBanner />
  </Layout>
);

export default Products;
