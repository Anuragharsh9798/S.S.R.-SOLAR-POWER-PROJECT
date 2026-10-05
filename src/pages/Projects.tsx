import { Layout } from "@/components/Layout";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/PageHero";
import { ProjectsGrid } from "@/components/sections/Projects";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { CtaBanner } from "@/components/sections/CtaBanner";

const Projects = () => (
  <Layout>
    <Seo
      title="Completed Solar Projects | SSR Solar Power Case Studies"
      description="Explore residential and commercial solar plants commissioned by SSR Solar Power with capacity, savings and customer ratings."
      path="/projects"
    />
    <PageHero
      eyebrow="Projects"
      title="100 KW+ commissioned and counting"
      className="pb-10 md:pb-14"
      description="SSR Solar Power takes pride in delivering dependable, high-yield rooftop and commercial solar installations tailored to our clients' unique energy requirements. From independent residential homes seeking to eliminate recurring electricity bills to commercial complexes aiming to optimize daytime operating expenses, every project represents practical system planning, certified engineering, and uncompromising installation quality. Explore our portfolio of successfully commissioned solar power plants to see verified capacities, locations, and annual savings delivered across Uttar Pradesh."
      image="https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1920&q=80"
    />
    <ProjectsGrid heading={false} className="pt-0 pb-10 md:pb-14" />
    <BeforeAfter className="py-10 md:py-14" />
    <CtaBanner />
  </Layout>
);

export default Projects;
