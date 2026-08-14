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
      description="Filter by segment to see capacity, completion date and the annual savings each plant delivers."
      image="https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1920&q=80"
    />
    <ProjectsGrid heading={false} />
    <BeforeAfter />
    <CtaBanner />
  </Layout>
);

export default Projects;
