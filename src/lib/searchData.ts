import {
  services,
  products,
  projects as fallbackProjects,
  blogPosts as fallbackBlogPosts,
  subsidySteps,
  faqs,
  whyChoose,
  company,
} from "@/data/site";
import { api } from "@/lib/api";

export type SearchCategory =
  | "All"
  | "Pages"
  | "Services"
  | "Solutions"
  | "Products"
  | "Projects"
  | "Blog"
  | "Subsidy"
  | "FAQ";

export interface SearchResultItem {
  id: string;
  title: string;
  description: string;
  category: Exclude<SearchCategory, "All">;
  href: string;
  tags: string[];
  badge?: string;
  score?: number;
}

// Static Base Index from site configuration and knowledge base
const getBaseSearchItems = (): SearchResultItem[] => [
  // --- Core Pages ---
  {
    id: "page-home",
    title: "Home - SSR Solar Power",
    description: "Leading MNRE-empanelled solar EPC company in UP offering residential, commercial, and hybrid rooftop solar solutions.",
    category: "Pages",
    href: "/",
    tags: ["home", "main", "ssr solar", "solar company", "solar plant", "mau", "uttar pradesh"],
    badge: "Page",
  },
  {
    id: "page-about",
    title: "About SSR Solar Power",
    description: "Certified solar engineering team, MNRE empanelment, mission, vision, and solar journey across Eastern UP.",
    category: "Pages",
    href: "/about",
    tags: ["about us", "company", "mnre", "engineers", "mission", "team", "experience", "founder"],
    badge: "Page",
  },
  {
    id: "page-services",
    title: "Solar Services & Solutions",
    description: "Turnkey solar rooftop installation, DISCOM net metering, government subsidy assistance, and operation maintenance.",
    category: "Pages",
    href: "/services",
    tags: ["services", "solar installation", "rooftop", "residential", "commercial", "industrial"],
    badge: "Page",
  },
  {
    id: "page-products",
    title: "Solar Products & Hardware",
    description: "Tier-1 Mono PERC & TOPCon solar modules, high-efficiency hybrid inverters, mounting structures, and monitoring units.",
    category: "Pages",
    href: "/products",
    tags: ["products", "panels", "inverters", "topcon", "mono perc", "batteries", "mppt"],
    badge: "Page",
  },
  {
    id: "page-projects",
    title: "Completed Projects Portfolio",
    description: "Over 100 kW+ commissioned solar rooftop installations across Uttar Pradesh with verified customer ratings and annual savings.",
    category: "Pages",
    href: "/projects",
    tags: ["projects", "case studies", "portfolio", "installed capacity", "residential projects", "commercial projects"],
    badge: "Page",
  },
  {
    id: "page-calculator",
    title: "Solar Savings & ROI Calculator",
    description: "Calculate recommended solar system capacity (kW), required roof area (sq.ft), monthly unit generation, and bill savings.",
    category: "Pages",
    href: "/calculator",
    tags: ["calculator", "solar calculator", "estimate", "cost", "savings", "units", "roof area", "roi", "payback"],
    badge: "Calculator",
  },
  {
    id: "page-subsidy",
    title: "PM Surya Ghar Muft Bijli Yojana & Subsidy",
    description: "Complete guide on Central Government rooftop solar subsidy up to ₹1,08,000, eligibility, national portal process, and DBT credit.",
    category: "Subsidy",
    href: "/subsidy",
    tags: ["subsidy", "pm surya ghar", "muft bijli", "government subsidy", "dbt", "mnre", "yojana", "financial assistance"],
    badge: "Govt Scheme",
  },
  {
    id: "page-gallery",
    title: "Project Installation Gallery",
    description: "Browse verified photographs of our residential rooftop panel mountings, inverter wiring, and industrial solar plants.",
    category: "Pages",
    href: "/gallery",
    tags: ["gallery", "photos", "site images", "installations", "wiring", "fieldwork"],
    badge: "Gallery",
  },
  {
    id: "page-testimonials",
    title: "Customer Reviews & Testimonials",
    description: "Read genuine feedback and 5-star ratings from homeowners and business owners powered by SSR Solar.",
    category: "Pages",
    href: "/testimonials",
    tags: ["reviews", "testimonials", "feedback", "rating", "customers", "client stories"],
    badge: "Page",
  },
  {
    id: "page-blog",
    title: "Solar Insights & Knowledge Hub",
    description: "Expert articles on solar panel maintenance, inverter selection, net-metering regulations, and system efficiency.",
    category: "Pages",
    href: "/blog",
    tags: ["blog", "articles", "news", "guides", "solar tips", "knowledge"],
    badge: "Knowledge",
  },
  {
    id: "page-refer",
    title: "Refer & Earn Program",
    description: "Refer friends, neighbors, or businesses to switch to solar and earn exciting cash rewards and vouchers.",
    category: "Pages",
    href: "/refer-and-earn",
    tags: ["refer", "earn", "referral", "reward", "cashback", "incentive"],
    badge: "Rewards",
  },
  {
    id: "page-maintenance",
    title: "Solar Maintenance & AMC",
    description: "Comprehensive Annual Maintenance Contracts (AMC), panel cleaning cycles, thermal scanning, and performance auditing.",
    category: "Pages",
    href: "/maintenance",
    tags: ["maintenance", "amc", "panel cleaning", "repair", "service", "health check", "fault fix"],
    badge: "Service",
  },
  {
    id: "page-faq",
    title: "Frequently Asked Questions (FAQ)",
    description: "Clear answers on solar investment costs, subsidies, net metering, power cuts, warranties, and payback periods.",
    category: "Pages",
    href: "/faq",
    tags: ["faq", "questions", "answers", "doubts", "help", "support"],
    badge: "FAQ",
  },
  {
    id: "page-contact",
    title: "Contact SSR Solar Power",
    description: `Get a free consultation, site survey, or quote. Phone: ${company.phone}, Email: ${company.email}, Mau, UP.`,
    category: "Pages",
    href: "/contact",
    tags: ["contact", "phone", "email", "address", "location", "office", "call", "whatsapp", "inquiry"],
    badge: "Contact",
  },

  // --- Solar Solutions & Architecture ---
  {
    id: "sol-ongrid",
    title: "On-Grid Solar System (Grid-Tied)",
    description: "Direct DISCOM grid connection with bi-directional net metering. Surplus power is exported to the grid with maximum monthly bill reduction.",
    category: "Solutions",
    href: "/solar-solutions/on-grid",
    tags: ["on-grid", "on grid", "grid tied", "net metering", "discom", "export", "bill reduction", "anti-islanding"],
    badge: "Solution",
  },
  {
    id: "sol-hybrid",
    title: "Hybrid Solar System (Solar + Grid + Battery)",
    description: "Combines solar generation, grid net metering, and lithium/tubular battery backup for 24x7 uninterrupted power security during power outages.",
    category: "Solutions",
    href: "/solar-solutions/hybrid",
    tags: ["hybrid solar", "hybrid", "battery backup", "power cuts", "load shedding", "storage", "inverter battery", "24x7 power"],
    badge: "Solution",
  },
  {
    id: "sol-offgrid",
    title: "Off-Grid Solar System (Standalone)",
    description: "Self-sustaining solar system with heavy battery bank for remote areas with no DISCOM power grid access.",
    category: "Solutions",
    href: "/solar-solutions/hybrid",
    tags: ["off-grid", "off grid", "standalone", "remote power", "battery bank", "independent"],
    badge: "Solution",
  },

  // --- Services ---
  ...services.map((svc) => ({
    id: `svc-${svc.slug}`,
    title: svc.title,
    description: `${svc.description} Key features: ${svc.points.join(", ")}.`,
    category: "Services" as const,
    href: "/services",
    tags: ["service", svc.slug, svc.title.toLowerCase(), ...svc.points.map((p) => p.toLowerCase())],
    badge: "Service",
  })),

  // --- Products ---
  ...products.map((prod) => ({
    id: `prod-${prod.slug}`,
    title: prod.name,
    description: `${prod.specs} · ${prod.warranty}. Category: ${prod.category}.`,
    category: "Products" as const,
    href: `/products/${prod.slug}`,
    tags: [
      "product",
      prod.slug,
      prod.name.toLowerCase(),
      prod.category.toLowerCase(),
      "specs",
      "warranty",
      "hardware",
    ],
    badge: prod.category,
  })),

  // Specific Product detail shortcuts
  {
    id: "prod-solar-panels-detail",
    title: "High-Efficiency Solar Panels (Mono PERC & TOPCon)",
    description: "545 Wp Tier-1 photovoltaic modules with 21.3% efficiency, IP68 junction box, and 25-year linear performance warranty.",
    category: "Products",
    href: "/products/solar-panels",
    tags: ["solar panels", "panels", "mono perc", "topcon", "bifacial", "545 wp", "pv module", "tier 1"],
    badge: "Panels",
  },
  {
    id: "prod-hybrid-inverter-detail",
    title: "Smart Hybrid Solar Inverter (MPPT & Wi-Fi)",
    description: "5 kW to 20 kW intelligent hybrid inverters with 98.2% MPPT efficiency, app monitoring, pure sine wave output, and 5-year warranty.",
    category: "Products",
    href: "/products/hybrid-inverter",
    tags: ["hybrid inverter", "inverter", "mppt", "wi-fi monitoring", "solar converter", "sine wave", "battery inverter"],
    badge: "Inverters",
  },

  // --- Subsidy Steps & Scheme Data ---
  ...subsidySteps.map((step, idx) => ({
    id: `subsidy-step-${idx}`,
    title: `PM Surya Ghar Subsidy: ${step.title}`,
    description: step.description,
    category: "Subsidy" as const,
    href: "/subsidy",
    tags: ["subsidy", "pm surya ghar", "yojana", step.title.toLowerCase(), "financial aid", "central grant"],
    badge: "Subsidy Step",
  })),

  // --- Why Choose / Highlights ---
  ...whyChoose.map((item, idx) => ({
    id: `why-choose-${idx}`,
    title: item.title,
    description: item.description,
    category: "Services" as const,
    href: "/about",
    tags: ["feature", "why choose", item.title.toLowerCase(), "benefit"],
    badge: "Why Choose",
  })),

  // --- FAQs ---
  ...faqs.map((faq, idx) => ({
    id: `faq-${idx}`,
    title: faq.q,
    description: faq.a,
    category: "FAQ" as const,
    href: "/faq",
    tags: ["faq", "question", "doubt", faq.q.toLowerCase(), "solar cost", "maintenance", "warranty"],
    badge: "FAQ",
  })),
];

// Fallback project search items
const getFallbackProjectItems = (): SearchResultItem[] =>
  fallbackProjects.map((p) => ({
    id: `proj-${p.id}`,
    title: `${p.title} (${p.capacity} ${p.type})`,
    description: `Location: ${p.location} · Capacity: ${p.capacity} · Annual Savings: ${p.savings} · Commissioned: ${p.completed}.`,
    category: "Projects",
    href: "/projects",
    tags: ["project", p.title.toLowerCase(), p.type.toLowerCase(), p.location.toLowerCase(), p.capacity.toLowerCase()],
    badge: p.type,
  }));

// Fallback blog post search items
const getFallbackBlogItems = (): SearchResultItem[] =>
  fallbackBlogPosts.map((b) => ({
    id: `blog-${b.slug}`,
    title: b.title,
    description: b.excerpt,
    category: "Blog",
    href: `/blog/${b.slug}`,
    tags: ["blog", "article", b.category.toLowerCase(), b.slug.replace(/-/g, " "), ...b.content.map((c) => c.slice(0, 50).toLowerCase())],
    badge: b.category,
  }));

/**
 * Loads the complete, unified public search index with optional async backend enrichment.
 */
export async function fetchFullSearchIndex(): Promise<SearchResultItem[]> {
  const baseItems = getBaseSearchItems();
  let projectItems = getFallbackProjectItems();
  let blogItems = getFallbackBlogItems();

  // Try fetching live public projects & blogs from backend if available
  try {
    const [liveProjects, liveBlogs] = await Promise.allSettled([
      api.get<any[]>("/api/v1/projects"),
      api.get<any[]>("/api/v1/blogs"),
    ]);

    if (liveProjects.status === "fulfilled" && Array.isArray(liveProjects.value) && liveProjects.value.length > 0) {
      projectItems = liveProjects.value.map((p: any) => ({
        id: `proj-${p.id || p._id || p.title}`,
        title: `${p.title || "Solar Project"} (${p.capacity || "Rooftop"} ${p.type || p.category || "Solar"})`,
        description: `Location: ${p.location || "Uttar Pradesh"} · Capacity: ${p.capacity || "N/A"} · Savings: ${p.savings || "Substantial"} · Status: ${p.status || "Completed"}.`,
        category: "Projects",
        href: "/projects",
        tags: [
          "project",
          (p.title || "").toLowerCase(),
          (p.type || p.category || "").toLowerCase(),
          (p.location || "").toLowerCase(),
          (p.capacity || "").toLowerCase(),
        ],
        badge: p.type || "Project",
      }));
    }

    if (liveBlogs.status === "fulfilled" && Array.isArray(liveBlogs.value) && liveBlogs.value.length > 0) {
      blogItems = liveBlogs.value.map((b: any) => ({
        id: `blog-${b.slug || b.id || b._id}`,
        title: b.title || "Solar Article",
        description: b.excerpt || (b.summary ? b.summary : b.content ? String(b.content).slice(0, 140) + "..." : "Practical solar advice and guide."),
        category: "Blog",
        href: `/blog/${b.slug || b.id}`,
        tags: [
          "blog",
          "article",
          (b.category || b.categoryName || "").toLowerCase(),
          (b.slug || "").replace(/-/g, " ").toLowerCase(),
          (b.title || "").toLowerCase(),
        ],
        badge: b.category || "Article",
      }));
    }
  } catch (err) {
    console.warn("Search index using fallback dataset:", err);
  }

  return [...baseItems, ...projectItems, ...blogItems];
}

/**
 * Filter and score search results based on query and active category filter.
 */
export function searchItems(
  items: SearchResultItem[],
  query: string,
  categoryFilter: SearchCategory = "All"
): SearchResultItem[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    if (categoryFilter === "All") {
      return items.slice(0, 8);
    }
    return items.filter((i) => i.category === categoryFilter).slice(0, 10);
  }

  const queryWords = trimmed.split(/\s+/).filter(Boolean);

  const matchedItems: SearchResultItem[] = [];

  for (const item of items) {
    // Check category filter
    if (categoryFilter !== "All" && item.category !== categoryFilter) {
      continue;
    }

    const titleLower = item.title.toLowerCase();
    const descLower = item.description.toLowerCase();
    const tagsLower = item.tags.join(" ").toLowerCase();
    const badgeLower = (item.badge || "").toLowerCase();

    let score = 0;

    // Exact full query matches
    if (titleLower === trimmed) {
      score += 100;
    } else if (titleLower.startsWith(trimmed)) {
      score += 50;
    } else if (titleLower.includes(trimmed)) {
      score += 35;
    }

    if (descLower.includes(trimmed)) {
      score += 20;
    }

    if (tagsLower.includes(trimmed)) {
      score += 25;
    }

    if (badgeLower.includes(trimmed)) {
      score += 15;
    }

    // Individual word matching
    let allWordsMatch = true;
    for (const word of queryWords) {
      const matchInTitle = titleLower.includes(word);
      const matchInDesc = descLower.includes(word);
      const matchInTags = tagsLower.includes(word);
      const matchInBadge = badgeLower.includes(word);

      if (matchInTitle || matchInDesc || matchInTags || matchInBadge) {
        if (matchInTitle) score += 15;
        if (matchInDesc) score += 5;
        if (matchInTags) score += 8;
        if (matchInBadge) score += 4;
      } else {
        allWordsMatch = false;
      }
    }

    if (score > 0 || (queryWords.length > 1 && allWordsMatch)) {
      matchedItems.push({
        ...item,
        score,
      });
    }
  }

  // Sort by highest score first, then shorter titles
  return matchedItems.sort((a, b) => {
    if ((b.score || 0) !== (a.score || 0)) {
      return (b.score || 0) - (a.score || 0);
    }
    return a.title.length - b.title.length;
  });
}
