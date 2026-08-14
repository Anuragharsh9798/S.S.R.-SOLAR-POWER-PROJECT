import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { SunDim } from "lucide-react";

const NotFound = () => (
  <Layout>
    <Seo title="Page Not Found | SSR Solar Power" description="The page you are looking for could not be found." path="/404" />
    <section className="relative flex min-h-[80vh] items-center overflow-hidden">
      <div className="blob -left-16 top-24 h-72 w-72 bg-primary/25" aria-hidden />
      <div className="blob -right-10 bottom-10 h-80 w-80 bg-secondary/25" aria-hidden />
      <div className="container-narrow relative text-center">
        <SunDim className="mx-auto h-14 w-14 animate-spin-slow text-secondary" />
        <p className="mt-6 font-display text-7xl font-bold text-gradient md:text-8xl">404</p>
        <h1 className="mt-4 text-2xl md:text-3xl">This page has gone off-grid</h1>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          The link may be outdated or mistyped. Head back to the homepage or explore our solar solutions.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild className="btn-premium h-12 rounded-full bg-gradient-brand px-7 font-semibold text-primary-foreground shadow-glow">
            <Link to="/">Back to Home</Link>
          </Button>
          <Button asChild variant="outline" className="h-12 rounded-full px-7">
            <Link to="/calculator">Solar Calculator</Link>
          </Button>
        </div>
      </div>
    </section>
  </Layout>
);

export default NotFound;
