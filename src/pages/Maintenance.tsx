import { Layout } from "@/components/Layout";
import { Seo } from "@/components/Seo";
import { Wrench } from "lucide-react";
import { company } from "@/data/site";

const Maintenance = () => (
  <Layout>
    <Seo title="Scheduled Maintenance | SSR Solar Power" description="Our website is briefly undergoing scheduled maintenance. Please check back soon." path="/maintenance" />
    <section className="relative flex min-h-[80vh] items-center overflow-hidden">
      <div className="blob -left-16 top-20 h-72 w-72 bg-secondary/25" aria-hidden />
      <div className="container-narrow relative text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-brand shadow-glow">
          <Wrench className="h-7 w-7 text-primary-foreground" />
        </span>
        <h1 className="mt-8 text-3xl md:text-4xl">We&apos;ll be back shortly</h1>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          Our site is undergoing scheduled maintenance to bring you a faster experience. For urgent solar support,
          call our team directly.
        </p>
        <a href={`tel:${company.emergency}`} className="mt-6 inline-block font-display text-xl font-semibold text-primary">
          {company.emergency}
        </a>
      </div>
    </section>
  </Layout>
);

export default Maintenance;
