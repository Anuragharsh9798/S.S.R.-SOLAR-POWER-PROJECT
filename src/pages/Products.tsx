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
      description="Warranty-backed panels, inverters, storage and balance-of-system components — supplied, installed and supported by us."
      image="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1920&q=80"
    />
    <FeaturedProducts />
    <CtaBanner />
  </Layout>
);

export default Products;
