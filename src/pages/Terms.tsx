import { Layout } from "@/components/Layout";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/PageHero";

const sections = [
  {
    title: "Quotations and pricing",
    body: "All quotations issued by SSR Solar Power are valid for 15 days unless stated otherwise. Prices are subject to change based on final site survey findings, structural requirements and statutory duties.",
  },
  {
    title: "Generation estimates",
    body: "Savings, generation and payback figures shown on this website — including the solar calculator — are indicative estimates based on typical irradiance and tariff data. Actual performance depends on shading, weather, tariff changes and consumption patterns.",
  },
  {
    title: "Subsidy assistance",
    body: "We prepare and submit subsidy applications on your behalf but cannot guarantee approval, disbursement timelines or amounts, which are determined solely by the relevant government authority.",
  },
  {
    title: "Warranty",
    body: "Product warranties are provided by the respective manufacturers. SSR Solar Power provides a 5-year workmanship warranty covering installation and balance-of-system defects, excluding damage from misuse, tampering or force majeure events.",
  },
  {
    title: "Payments and cancellation",
    body: "Projects commence on receipt of the agreed advance. Cancellations after material procurement may attract restocking charges. Statutory net-metering fees are billed at actuals.",
  },
  {
    title: "Governing law",
    body: "These terms are governed by the laws of India, with exclusive jurisdiction of the courts at Mau, Uttar Pradesh.",
  },
];

const Terms = () => (
  <Layout>
    <Seo
      title="Terms & Conditions | SSR Solar Power"
      description="Terms and conditions governing quotations, generation estimates, subsidy assistance, warranty and payments with SSR Solar Power."
      path="/terms"
    />
    <PageHero eyebrow="Legal" title="Terms & Conditions" description="Last updated: 1 January 2026" />
    <section className="section pt-0">
      <div className="container-narrow space-y-8">
        {sections.map((s) => (
          <article key={s.title}>
            <h2 className="text-xl font-semibold">{s.title}</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{s.body}</p>
          </article>
        ))}
      </div>
    </section>
  </Layout>
);

export default Terms;
