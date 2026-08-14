import { Layout } from "@/components/Layout";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/PageHero";

const sections = [
  {
    title: "Information we collect",
    body: "We collect the details you submit through our quote, calculator and contact forms — name, phone number, email address, city, monthly electricity bill and any uploaded bill documents. We also collect basic analytics such as pages visited and device type.",
  },
  {
    title: "How we use your information",
    body: "Your information is used to prepare solar proposals, schedule site visits, process government subsidy applications on your behalf and provide after-sales support. We may send occasional service updates and solar insights, which you can opt out of at any time.",
  },
  {
    title: "Sharing with third parties",
    body: "We share only what is necessary with financing partners, DISCOM authorities and the national rooftop solar portal when you ask us to process a loan or subsidy claim. We never sell your personal data.",
  },
  {
    title: "Data security",
    body: "Uploaded bills and personal details are stored on access-controlled systems and retained only as long as needed to service your enquiry or contractual obligations.",
  },
  {
    title: "Cookies",
    body: "We use cookies to remember your theme preference, keep the site fast and understand which content is useful. You can decline non-essential cookies through the consent banner.",
  },
  {
    title: "Your rights",
    body: "You may request access to, correction of, or deletion of your personal data at any time by writing to ssrsolarpower125@gmail.com.",
  },
];

const PrivacyPolicy = () => (
  <Layout>
    <Seo
      title="Privacy Policy | SSR Solar Power"
      description="How SSR Solar Power collects, uses, stores and protects your personal information when you request a solar quote or subsidy assistance."
      path="/privacy-policy"
    />
    <PageHero eyebrow="Legal" title="Privacy Policy" description="Last updated: 1 January 2026" />
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

export default PrivacyPolicy;
