import {
  Award,
  BadgeIndianRupee,
  Building2,
  Factory,
  Home,
  Landmark,
  LifeBuoy,
  Sun,
  Timer,
  ShieldCheck,
  Users,
  Zap,
  Leaf,
} from "lucide-react";
import residentialSolarService from "@/assets/service-residential-solar.png";
import commercialSolarService from "@/assets/service-commercial-solar.png";
import residentialProjectImage from "@/assets/project-residential-rooftop.png";
import hybridInverterProduct from "@/assets/product-hybrid-inverter.png";
import blogPanelMaintenance from "@/assets/blog-panel-maintenance.png";
import onGridSolarSystem from "@/assets/on-grid-solar-system.png";
import heroSolarRooftopWorker from "@/assets/hero-solar-rooftop-worker.png";

export const company = {
  name: "SSR Solar Power",
  tagline: "Premium Solar Energy Solutions",
  phone: "+91 83170 61340",
  emergency: "+91 83170 61340",
  email: "ssrsolarpower125@gmail.com",
  whatsapp: "918317061340",
  address: "Kutubpur, Bahadurpur, Mau (U.P.) 221602",
  hours: "Mon – Sat: 9:00 AM – 7:00 PM · Sunday: On appointment",
};

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  {
    label: "Solar Solutions",
    href: "/solar-solutions",
    hasDropdown: true,
    children: [
      { label: "On-Grid Solar", href: "/solar-solutions/on-grid" },
      { label: "Hybrid Solar", href: "/solar-solutions/hybrid" },
    ],
  },
  { label: "Products", href: "/products" },
  { label: "Projects", href: "/projects" },
  { label: "Solar Calculator", href: "/calculator" },
  {
    label: "More",
    href: "#",
    hasDropdown: true,
    children: [
      { label: "PM Surya Ghar Yojana", href: "/subsidy" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "Gallery", href: "/gallery" },
      { label: "Blog", href: "/blog" },
      { label: "Refer & Earn", href: "/refer-and-earn" },
    ],
  },
];

export const heroCards = [
  { icon: ShieldCheck, title: "25 Years", subtitle: "Performance Warranty" },
  { icon: Users, title: "1000+", subtitle: "Installations" },
  { icon: Landmark, title: "Central & State Government Subsidy", subtitle: "Government Approved" },
  { icon: LifeBuoy, title: "24×7", subtitle: "Support Desk" },
];

export const stats = [
  { value: 1000, suffix: "+", label: "Projects Completed", icon: Building2 },
  { value: 90, suffix: "%", label: "Electricity Savings", icon: Leaf },
  { value: 100, suffix: " KW+", label: "Installation Capacity", icon: Zap },
  { value: 1000, suffix: "+", label: "Happy Customers", icon: Users },
];

export const partners = [
  "Adani Solar",
  "Tata Power",
  "Luminous",
  "Havells",
  "UTL Solar",
];

export const whyChoose = [
  {
    icon: Award,
    title: "Certified Engineers",
    description: "MNRE-empanelled engineers design and commission every plant to IEC and BIS standards.",
  },
  {
    icon: Landmark,
    title: "Central & State Government Subsidy Assistance",
    description: "Our experts guide customers through the complete Central & State Government solar subsidy process including eligibility verification, documentation and application support.",
  },
  {
    icon: Sun,
    title: "Premium Solar Panels",
    description: "Tier-1 mono PERC and TOPCon modules with 25-year linear performance guarantees.",
  },
  {
    icon: Timer,
    title: "Fast Installation",
    description: "Typical residential systems energised in 7–10 working days after site survey.",
  },
  {
    icon: LifeBuoy,
    title: "Lifetime Support",
    description: "Dedicated service desk, remote monitoring and preventive maintenance visits.",
  },
  {
    icon: BadgeIndianRupee,
    title: "Affordable EMI Options",
    description: "Affordable green loans from partner banks at interest rates up to 7%.",
  },
];

export const services = [
  {
    slug: "residential-solar",
    icon: Home,
    title: "Residential Solar",
    description: "Rooftop systems from 1 kW to 20 kW designed for Indian homes and housing societies.",
    image: residentialSolarService,
    points: ["Net metering support", "Subsidy paperwork", "App-based monitoring"],
  },
  {
    slug: "commercial-solar",
    icon: Building2,
    title: "Commercial Solar",
    description: "Cut operating costs for offices, hospitals, schools and retail with 20–500 kW plants.",
    image: commercialSolarService,
    points: ["CAPEX & OPEX models", "Accelerated depreciation", "Load-based design"],
  },
];

export const products = [
  {
    slug: "solar-panels",
    name: "Solar Panels",
    category: "Panels",
    specs: "545 Wp · 21.3% efficiency · IP68 junction box",
    warranty: "25 Year Warranty",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1000&q=80",
  },
  {
    slug: "hybrid-inverter",
    name: "Hybrid Solar Inverter",
    category: "Inverters",
    specs: "5 kW · 98.2% MPPT efficiency · Wi-Fi monitoring",
    warranty: "5 Year Warranty",
    image: hybridInverterProduct,
  },
];

export const projects = [
  {
    id: 1,
    title: "Green Meadows Villa",
    type: "Residential",
    location: "Mau, Uttar Pradesh",
    capacity: "10 kW",
    completed: "March 2026",
    savings: "₹ 1.4 L / year",
    rating: 5,
    image: residentialProjectImage,
  },
  {
    id: 2,
    title: "Sunrise Tech Park",
    type: "Commercial",
    location: "Ballia, Uttar Pradesh",
    capacity: "250 kW",
    completed: "January 2026",
    savings: "₹ 32 L / year",
    rating: 5,
    image: commercialSolarService,
  },
];

export const processSteps = [
  { step: "01", title: "Consultation", description: "We study your bills, load pattern and goals to shortlist the right system size." },
  { step: "02", title: "Site Survey", description: "Structural, shadow and electrical audit of your rooftop or ground area." },
  { step: "03", title: "Design", description: "3D layout, string design, generation estimate and financial model shared for approval." },
  { step: "04", title: "Installation", description: "Certified crews complete mounting, wiring and safety commissioning." },
  { step: "05", title: "Inspection", description: "DISCOM inspection, net-meter installation and compliance documentation." },
  { step: "06", title: "Activation", description: "Grid synchronisation, monitoring app handover and performance walkthrough." },
];

export const subsidySteps = [
  {
    title: "Eligibility",
    description: "Residential rooftop consumers with a sanctioned domestic connection and shadow-free roof area of 80–100 sq.ft per kW.",
  },
  {
    title: "Documents",
    description: "Latest electricity bill, Aadhaar, PAN, property proof, cancelled cheque and roof photographs.",
  },
  {
    title: "Application Process",
    description: "National portal registration, vendor selection, technical feasibility approval and installation booking.",
  },
  {
    title: "Benefits",
    description: "Up to ₹1,08,000 central subsidy, net-metering credits and 5-year performance monitoring at no cost.",
  },
];

export interface TestimonialItem {
  name: string;
  location: string;
  rating: number;
  quote: string;
}

export const testimonials: TestimonialItem[] = [
  {
    name: "Rajesh Kumar Singh",
    location: "Mau, Uttar Pradesh",
    rating: 5,
    quote:
      "Installed a 3 kW rooftop solar system for our home in Mau. Our electricity bill dropped significantly from around ₹4,200 to under ₹400 per month during peak summer. SSR Solar team handled the net metering paperwork smoothly.",
  },
  {
    name: "Sunil Rai",
    location: "Ballia, Uttar Pradesh",
    rating: 5,
    quote:
      "We got a 5 kW hybrid solar setup for our shop in Ballia. Inverter performance has been solid during power cuts, and the panels generate clean power consistently every day.",
  },
  {
    name: "Virendra Verma",
    location: "Kutubpur, Uttar Pradesh",
    rating: 5,
    quote:
      "The installation team arrived on time in Kutubpur and completed panel mounting and wiring in just two days. Very neat structure work and reliable post-installation support.",
  },
  {
    name: "Anil Kumar Yadav",
    location: "Azamgarh, Uttar Pradesh",
    rating: 5,
    quote:
      "Getting the PM Surya Ghar subsidy guidance from SSR Solar Power was very helpful. Our 3 kW system in Azamgarh runs all fans, lights, and refrigerator without any voltage fluctuation.",
  },
  {
    name: "Deepak Maurya",
    location: "Gopalpur, Uttar Pradesh",
    rating: 5,
    quote:
      "Switched our workshop in Gopalpur to rooftop solar. The real-time mobile app tracking makes it easy to monitor daily unit generation. Excellent performance so far.",
  },
  {
    name: "Manoj Tiwari",
    location: "Belthara Road, Uttar Pradesh",
    rating: 5,
    quote:
      "SSR Solar installed a 4 kW system at our house near Belthara Road station. Electricity bill savings are clear right from the first month, and net metering sync was done properly.",
  },
  {
    name: "Satish Chandra Sharma",
    location: "Konauli, Uttar Pradesh",
    rating: 5,
    quote:
      "Great experience with SSR Solar Power in Konauli village. Quality Mono PERC panels, sturdy mounting structure, and polite technicians. Very satisfied with the generation.",
  },
];

export interface BlogPost {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  content: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "8-things-before-installing-rooftop-solar",
    category: "Solar Checklist",
    title: "8 Things to Check Before Installing Rooftop Solar",
    excerpt: "Essential checklist before going solar: roof direction, shadow analysis, structural load capacity, wiring route, and sanctioned grid load.",
    date: "12 July 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1000&q=80",
    content: [
      "1. Roof Orientation and Tilt Angle: In India, rooftops with true south-facing orientation receive maximum solar irradiance throughout the year. East and west facing installations can also generate substantial electricity, but tilt angle alignment (typically 15° to 25° depending on latitude) ensures optimal year-round sunlight absorption.",
      "2. Shadow-Free Clearance Audit: Conduct a thorough shadow audit between 9:00 AM and 4:00 PM. Parapet walls, adjacent tall buildings, water storage tanks, staircase rooms, and nearby trees can cast shadows across solar modules, reducing power generation.",
      "3. Rooftop Structural Strength: Solar panel arrays, mounting structures, and concrete ballast blocks add dead weight to your roof. Reinforced concrete roofs (RCC) easily support solar structures, while tin sheds or tiled roofs require custom elevated mounting frames.",
      "4. Sanctioned Electricity Load: Your sanctioned connection load with your local DISCOM determines the maximum rooftop solar plant capacity eligible for net-metering synchronization without requiring a sanctioned load upgrade.",
      "5. Quality of Mounting Structures: Ensure mounting structures are fabricated from hot-dip galvanized iron or high-grade aluminum with stainless steel fasteners. Sturdy structures prevent rust and withstand high wind speeds during monsoons.",
      "6. AC/DC Wiring Route & Inverter Placement: Minimize cable length between solar panels, DC isolators, inverters, and the main AC distribution board to reduce voltage drop. Mount inverters in shaded, well-ventilated locations away from direct rain and heat.",
      "7. Earthing & Surge Protection (SPD): Install dedicated earthing pits for AC circuits, DC circuits, and lightning arresters. Metal oxide surge protection devices (SPDs) protect sensitive inverter electronics from lightning surges.",
      "8. DISCOM Net-Metering & Regulatory Readiness: Verify local DISCOM net-metering guidelines, solar meter availability, and application timelines to ensure smooth grid synchronization after physical installation."
    ]
  },
  {
    slug: "rooftop-solar-subsidy-practical-guide",
    category: "Government Policies",
    title: "Rooftop Solar Subsidy: A Practical Guide",
    excerpt: "Slab-wise financial assistance, national portal application workflow, eligibility criteria, and approval documentation.",
    date: "28 June 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1000&q=80",
    content: [
      "Understanding Central Government Financial Assistance: Residential rooftop solar installations across India may qualify for financial assistance under central government rooftop solar initiatives such as PM Surya Ghar: Muft Bijli Yojana.",
      "Slab-Wise Assistance Structure: Government financial assistance is structured in capacity slabs. Standard assistance rates apply for 1 kW and 2 kW systems, with an incremental benefit for 3 kW plants, providing substantial financial relief for domestic homeowners.",
      "Application Workflow on the National Portal: Consumers submit an application on the official National Portal by selecting their DISCOM, entering their electricity consumer account number, choosing an empanelled solar installer, and submitting site details.",
      "Technical Feasibility & Empanelled Vendors: Once the DISCOM grants technical feasibility approval, the empanelled installer completes physical rooftop mounting, wiring, earthing, and safety testing according to official standards.",
      "Net-Meter Installation & Direct Benefit Transfer: The local DISCOM inspects the plant, installs a bi-directional net meter, and issues a commissioning certificate. Verified financial assistance is credited directly to the beneficiary's bank account via Direct Benefit Transfer (DBT)."
    ]
  },
  {
    slug: "keep-solar-panels-performing-well",
    category: "Maintenance Guide",
    title: "How to Keep Your Solar Panels Performing Well",
    excerpt: "Practical maintenance tips: cleaning techniques, dust management, post-monsoon inspections, and inverter yield tracking.",
    date: "9 June 2026",
    readTime: "5 min read",
    image: blogPanelMaintenance,
    content: [
      "1. Regular Water Cleaning Schedule: Dust, dry leaves, bird droppings, and industrial soot reduce light transmission through solar glass. Cleaning panels every 15 to 20 days with plain water restores optimal generation.",
      "2. Cool Hour Washing: Wash solar modules during early morning or late evening hours. Spraying cold water on solar panels under intense midday summer sunlight causes extreme thermal stress that can crack glass or damage internal cell interconnects.",
      "3. Gentle Microfiber Cleaning Tools: Use soft microfiber mops, sponge brushes, or gentle water sprays. Never use harsh chemical detergents, wire brushes, or high-pressure washers that can scratch antireflective coatings.",
      "4. Post-Monsoon Visual Audits: Inspect structural mounting bolts, earthing strip connections, and cable junction boxes after heavy rainstorms or dust storms to confirm everything remains tight and corrosion-free.",
      "5. Tracking Inverter Generation Logs: Monitor your inverter's mobile app or digital screen weekly to track daily kWh generation units. A sudden drop in daily energy output signals potential shading issues or a tripped circuit breaker."
    ]
  },
  {
    slug: "topcon-vs-mono-perc-comparison",
    category: "Technology",
    title: "TOPCon vs Mono PERC: What Should You Choose?",
    excerpt: "Comparing cell efficiency, temperature coefficient, degradation rates, and low-light performance of modern PV module technologies.",
    date: "22 May 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1545209463-e2825498edbf?w=1000&q=80",
    content: [
      "Monocrystalline PERC Overview: Mono PERC (Passivated Emitter and Rear Cell) has been the dominant solar cell technology for years, delivering proven module efficiencies of 20% to 21.3% with high structural reliability.",
      "TOPCon (Tunnel Oxide Passivated Contact) Innovation: N-type TOPCon is an advanced cell architecture incorporating an ultra-thin silicon oxide tunnel layer that reduces carrier recombination, elevating module efficiency to 22% and higher.",
      "Summer Heat Performance (Temperature Coefficient): Solar panels experience marginal efficiency loss as ambient temperatures rise. TOPCon modules feature a superior temperature coefficient (~-0.30%/°C) compared to Mono PERC (~-0.35%/°C), producing higher energy yields in extreme summer heat.",
      "Bifacial Gains & Degradation Rates: N-type TOPCon modules exhibit virtually zero Light-Induced Degradation (LID) and higher bifaciality (generating power from rear ambient light reflections), resulting in lower long-term degradation over 25 years.",
      "Cost-to-Performance Value: While TOPCon carries a small price premium over PERC, its higher generation output per square foot makes it ideal for urban rooftops with limited space."
    ]
  },
  {
    slug: "on-grid-vs-hybrid-solar-system",
    category: "System Architecture",
    title: "On-Grid vs Hybrid Solar: Which One Is Right?",
    excerpt: "Grid-tied solar vs battery backup systems: power outages, net metering, battery costs, and household energy security.",
    date: "14 May 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1000&q=80",
    content: [
      "On-Grid (Grid-Tied) Solar Systems: On-grid systems connect directly to your local DISCOM power grid. Solar power generated during the day powers home appliances, and surplus energy is exported to the grid via net metering.",
      "Grid Safety & Anti-Islanding: During grid power outages, on-grid inverters automatically shut down within milliseconds (anti-islanding) to protect DISCOM maintenance personnel working on utility lines.",
      "Hybrid Solar Systems (Solar + Grid + Battery): Hybrid systems combine solar panels, grid connectivity, and dedicated lithium or tubular battery storage. During power cuts, hybrid inverters automatically switch load power to batteries.",
      "Energy Banking vs Power Backup: On-grid systems maximize monetary bill reduction in areas with reliable 24x7 electricity. Hybrid systems provide essential power backup during scheduled or unscheduled power cuts.",
      "Investment & Maintenance Factors: On-grid installations require lower upfront capital and zero battery replacement costs. Hybrid systems involve higher initial investment and periodic battery maintenance."
    ]
  },
  {
    slug: "how-much-3kw-5kw-solar-system-save",
    category: "Financial Savings",
    title: "How Much Can a 3kW or 5kW Solar System Save?",
    excerpt: "Realistic unit generation estimates, monthly power bill reduction factors, payback periods, and long-term financial returns.",
    date: "28 April 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1000&q=80",
    content: [
      "Daily and Monthly Unit Generation: Under optimal sunlight, a 3 kW rooftop solar system generates approximately 12 to 14 units (kWh) per day (~360–420 units/month). A 5 kW system generates roughly 20 to 23 units per day (~600–690 units/month).",
      "DISCOM Bill Reduction Impact: Electricity tariffs are billed in slab rates where higher consumption incurs higher per-unit rates. Solar generation offsets these high-tier daytime units, reducing monthly DISCOM bills by 70% to 90%.",
      "Payback Period Calculations: Factoring in equipment costs, installation, and applicable central financial assistance, typical residential rooftop installations recover their full capital cost in 3.5 to 5 years.",
      "25-Year Cumulative Savings: Because Tier-1 solar panels carry 25-year performance warranties, solar installations continue delivering free, clean electricity for two decades after payback.",
      "Key Factors Affecting Output: Actual energy generation varies based on tilt angle, shadow clearance, panel cleanliness, inverter efficiency, and seasonal solar irradiance."
    ]
  },
  {
    slug: "solar-panel-warranty-customer-guide",
    category: "Buyer Protection",
    title: "Solar Panel Warranty: What Customers Should Know",
    excerpt: "Product manufacturing warranty vs Linear power output warranty, degradation curves, and essential documentation.",
    date: "15 April 2026",
    readTime: "6 min read",
    image: heroSolarRooftopWorker,
    content: [
      "Product Warranty vs Performance Warranty: Solar module warranties consist of two separate guarantees: the Product/Workmanship Warranty and the Linear Power Output Warranty.",
      "Product Warranty (10–12 Years): Covers manufacturing defects, structural glass damage, frame joint failures, junction box defects, or bypass diode failures.",
      "Linear Performance Warranty (25 Years): Guarantees maximum allowable power output degradation over time (typically <= 2% in Year 1 and <= 0.55% annually thereafter, retaining >= 80–85% output at Year 25).",
      "Inverter & Balance of System Warranties: Solar inverters typically carry 5 to 10-year standard warranties, while hot-dip galvanized mounting structures feature structural warranties.",
      "Claim Documentation Requirements: Retain original GST tax invoices, manufacturer warranty certificates, flash test report sheets, and serial numbers safely to ensure fast warranty processing."
    ]
  },
  {
    slug: "net-metering-explained-homeowners",
    category: "Grid Policy",
    title: "Net Metering Explained for Homeowners",
    excerpt: "How bi-directional net meters track imported vs exported solar units, monthly bill adjustments, and DISCOM grid integration.",
    date: "3 April 2026",
    readTime: "7 min read",
    image: onGridSolarSystem,
    content: [
      "What is a Bi-Directional Net Meter?: A net meter replaces your standard DISCOM electricity meter. It records both electricity imported from the grid and excess solar electricity exported to the grid.",
      "Daytime Generation & Export Flow: During sunny daytime hours, if your rooftop solar system generates more power than your home uses, surplus electricity automatically flows into the DISCOM grid.",
      "Nighttime Grid Import & Billing Settlement: At night, when solar generation stops, your home draws grid electricity normally. On your monthly bill, the DISCOM calculates Net Billed Units = (Imported Units - Exported Units).",
      "Energy Banking Cycles: If monthly export exceeds import, surplus exported units are credited and carried forward to offset power consumption in subsequent billing cycles as per state regulations.",
      "Net Metering Approval Workflow: Net metering requires technical application filing, feasibility approval, site inspection, safety test report submission, and DISCOM meter installation."
    ]
  },
  {
    slug: "how-to-choose-right-solar-inverter",
    category: "Hardware Guide",
    title: "How to Choose the Right Solar Inverter",
    excerpt: "String inverters vs hybrid inverters, MPPT channels, efficiency ratings, weather protection, and mobile app tracking.",
    date: "18 March 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1000&q=80",
    content: [
      "The Central Role of Solar Inverters: Solar panels generate DC electricity. The solar inverter converts DC energy into regulated 230V/415V AC electricity suitable for home appliances and grid export.",
      "Matching Inverter kW to Panel Array Wp: Select an inverter whose kW rating and DC voltage window match your solar panel array's cumulative peak capacity.",
      "MPPT Efficiency Ratings: Premium inverters feature high-efficiency Maximum Power Point Tracking (MPPT) algorithms (98%+ efficiency) to optimize power extraction during overcast sky conditions.",
      "Single-Phase vs Three-Phase Systems: Residential systems up to 3 kW or 5 kW typically use single-phase inverters. Larger residential or commercial systems require three-phase inverters for phase balance.",
      "IP Outdoor Rating & App Monitoring: Choose inverters with IP65 weather protection and built-in Wi-Fi logging for real-time mobile app tracking of daily unit generation and system health."
    ]
  }
];

export const faqs = [
  {
    q: "How much can I actually save with a solar system?",
    a: "Most residential customers reduce their electricity bill by 70–90%. A 3 kW system in Uttar Pradesh generates roughly 360–420 units a month, which typically covers an average household's consumption.",
  },
  {
    q: "How much roof area do I need?",
    a: "Plan for about 80–100 sq.ft of shadow-free area per kW. A 5 kW system therefore needs roughly 450–500 sq.ft of usable roof.",
  },
  {
    q: "What government subsidy is available?",
    a: "Residential rooftop consumers can receive up to ₹1,08,000 in central financial assistance. We handle registration, vendor mapping and claim submission for you.",
  },
  {
    q: "How long does installation take?",
    a: "A typical residential installation takes 7–10 working days after the site survey. Commercial plants range from 4 to 12 weeks depending on capacity.",
  },
  {
    q: "What warranty do you provide?",
    a: "Panels carry a 25-year linear performance warranty, inverters 5–10 years, structures 15 years, and our workmanship warranty covers 5 years.",
  },
  {
    q: "Will solar work during power cuts?",
    a: "Standard on-grid systems shut down during outages for safety. Add a hybrid inverter with battery backup and your essential loads keep running seamlessly.",
  },
  {
    q: "Do you offer EMI or financing?",
    a: "Yes. We partner with leading banks and NBFCs for green loans and zero-cost EMI plans at up to 7% interest with tenures up to 7 years.",
  },
  {
    q: "How much maintenance does a solar plant need?",
    a: "Panels need cleaning every 2–4 weeks and an annual electrical health check. Our AMC packages cover cleaning cycles, thermal scans and performance reporting.",
  },
  {
    q: "What is net metering and how does it help?",
    a: "Net metering exports surplus generation back to the grid and credits it against your consumption, so daytime excess offsets your night-time usage.",
  },
  {
    q: "What is the payback period on a solar investment?",
    a: "Residential systems typically pay back in 3.5–5 years, commercial in 3–4 years. After that you enjoy 20+ years of nearly free electricity.",
  },
];

export const galleryImages = [
  { src: "/reference/WhatsApp Image 2026-08-12 at 1.15.05 AM (1).jpeg", alt: "Rooftop Solar Panel Installation Project", category: "Residential" },
  { src: "/reference/WhatsApp Image 2026-08-12 at 1.15.05 AM.jpeg", alt: "Commercial Solar Power Installation", category: "Commercial" },
  { src: "/reference/WhatsApp Image 2026-08-12 at 1.15.04 AM (2).jpeg", alt: "Rooftop Solar Array & Inverter Setup", category: "Residential" },
  { src: "/reference/WhatsApp Image 2026-08-12 at 1.15.04 AM (1).jpeg", alt: "Solar Panel Mounting & Wiring Setup", category: "Maintenance" },
  { src: "/reference/WhatsApp Image 2026-08-12 at 1.15.04 AM.jpeg", alt: "Solar Rooftop Project Site Inspection", category: "Commercial" },
  { src: "/reference/WhatsApp Image 2026-08-12 at 1.15.03 AM (1).jpeg", alt: "High Efficiency Mono PERC Solar Panels", category: "Products" },
  { src: "/reference/WhatsApp Image 2026-08-12 at 1.15.03 AM.jpeg", alt: "On-Grid Hybrid Solar Inverter System", category: "Products" },
  { src: "/reference/WhatsApp Image 2026-08-12 at 1.15.02 AM (3).jpeg", alt: "Residential Rooftop Solar Plant Commissioning", category: "Residential" },
  { src: "/reference/WhatsApp Image 2026-08-12 at 1.15.02 AM (2).jpeg", alt: "Solar Panel Cleaning & Maintenance Visit", category: "Maintenance" },
  { src: "/reference/WhatsApp Image 2026-08-12 at 1.15.02 AM (1).jpeg", alt: "Commercial Rooftop Array", category: "Commercial" },
  { src: "/reference/WhatsApp Image 2026-08-12 at 1.15.02 AM.jpeg", alt: "Solar Power Project Site Overview", category: "Residential" },
  { src: "/reference/WhatsApp Image 2026-08-12 at 1.15.01 AM (2).jpeg", alt: "Completed Rooftop Solar System", category: "Residential" },
  { src: "/reference/WhatsApp Image 2026-08-12 at 1.15.01 AM (1).jpeg", alt: "Commercial Solar Plant", category: "Commercial" },
  { src: "/reference/WhatsApp Image 2026-08-12 at 1.15.01 AM.jpeg", alt: "Solar Panels & Net Metering Setup", category: "Products" },
  { src: "/reference/WhatsApp Image 2026-08-12 at 1.15.00 AM (2).jpeg", alt: "Rooftop Solar Plant Commissioning", category: "Residential" },
  { src: "/reference/WhatsApp Image 2026-08-12 at 1.14.59 AM (3).jpeg", alt: "Engineers Performing Site Inspection", category: "Maintenance" },
  { src: "/reference/WhatsApp Image 2026-08-12 at 1.14.59 AM (2).jpeg", alt: "Rooftop Solar Modules Grid Setup", category: "Commercial" },
  { src: "/reference/WhatsApp Image 2026-08-12 at 1.14.59 AM (1).jpeg", alt: "Residential Solar Power System", category: "Residential" },
  { src: "/reference/WhatsApp Image 2026-08-12 at 1.14.59 AM.jpeg", alt: "Solar Control Box & DC Protection", category: "Products" },
  { src: "/reference/WhatsApp Image 2026-08-12 at 1.14.58 AM (2).jpeg", alt: "Rooftop Solar Panels Installation", category: "Residential" },
  { src: "/reference/WhatsApp Image 2026-08-12 at 1.14.58 AM (1).jpeg", alt: "Commercial Building Solar Array", category: "Commercial" },
  { src: "/reference/WhatsApp Image 2026-08-12 at 1.14.58 AM.jpeg", alt: "Solar Panel Maintenance & Inspection", category: "Maintenance" },
  { src: "/reference/WhatsApp Image 2026-08-12 at 1.14.57 AM (1).jpeg", alt: "SSR Solar Team Installation Fieldwork", category: "Maintenance" },
  { src: "/reference/WhatsApp Image 2026-08-12 at 1.14.57 AM.jpeg", alt: "Completed Home Rooftop Solar System", category: "Residential" },
];

export const ecoIcon = Leaf;









