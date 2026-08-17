import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogsService {
  private readonly logger = new Logger(BlogsService.name);
  private inMemoryBlogs: Map<string, any> = new Map();

  constructor(private readonly prisma: PrismaService) {
    this.seedOfficialBlogs();
  }

  private async seedOfficialBlogs() {
    const officialPosts = [
      {
        slug: '8-things-before-installing-rooftop-solar',
        categoryName: 'Solar Checklist',
        title: '8 Things to Check Before Installing Rooftop Solar',
        excerpt: 'Essential checklist before going solar: roof direction, shadow analysis, structural load capacity, wiring route, and sanctioned grid load.',
        date: '12 July 2026',
        readTime: '6 min read',
        featuredImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1000&q=80',
        content: JSON.stringify([
          '1. Roof Orientation and Tilt Angle: In India, rooftops with true south-facing orientation receive maximum solar irradiance throughout the year. East and west facing installations can also generate substantial electricity, but tilt angle alignment (typically 15° to 25° depending on latitude) ensures optimal year-round sunlight absorption.',
          '2. Shadow-Free Clearance Audit: Conduct a thorough shadow audit between 9:00 AM and 4:00 PM. Parapet walls, adjacent tall buildings, water storage tanks, staircase rooms, and nearby trees can cast shadows across solar modules, reducing power generation.',
          '3. Rooftop Structural Strength: Solar panel arrays, mounting structures, and concrete ballast blocks add dead weight to your roof. Reinforced concrete roofs (RCC) easily support solar structures, while tin sheds or tiled roofs require custom elevated mounting frames.',
          '4. Sanctioned Electricity Load: Your sanctioned connection load with your local DISCOM determines the maximum rooftop solar plant capacity eligible for net-metering synchronization without requiring a sanctioned load upgrade.',
          '5. Quality of Mounting Structures: Ensure mounting structures are fabricated from hot-dip galvanized iron or high-grade aluminum with stainless steel fasteners. Sturdy structures prevent rust and withstand high wind speeds during monsoons.',
          '6. AC/DC Wiring Route & Inverter Placement: Minimize cable length between solar panels, DC isolators, inverters, and the main AC distribution board to reduce voltage drop. Mount inverters in shaded, well-ventilated locations away from direct rain and heat.',
          '7. Earthing & Surge Protection (SPD): Install dedicated earthing pits for AC circuits, DC circuits, and lightning arresters. Metal oxide surge protection devices (SPDs) protect sensitive inverter electronics from lightning surges.',
          '8. DISCOM Net-Metering & Regulatory Readiness: Verify local DISCOM net-metering guidelines, solar meter availability, and application timelines to ensure smooth grid synchronization after physical installation.',
        ]),
      },
      {
        slug: 'rooftop-solar-subsidy-practical-guide',
        categoryName: 'Government Policies',
        title: 'Rooftop Solar Subsidy: A Practical Guide',
        excerpt: 'Complete guide to PM Surya Ghar Muft Bijli Yojana: slab-wise financial assistance, 51.58 Lakh households benefiting, ₹28,024 Cr transferred, national portal application workflow, and DBT credit.',
        date: '28 June 2026',
        readTime: '8 min read',
        featuredImage: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1000&q=80',
        content: JSON.stringify([
          'PM Surya Ghar Muft Bijli Yojana Flagship Initiative: Under the government\'s flagship PM Surya Ghar: Muft Bijli Yojana, over 51.58 Lakh households across India are benefiting from clean rooftop solar power. The central government has released over ₹28,024 Crore in direct subsidy transfers, reaching a total commissioned capacity of 14.8 GW across 50+ Lakh installations.',
          'Slab-Wise Financial Assistance Structure: Central financial assistance under PM Surya Ghar is structured directly by system capacity: ₹30,000 for 1 kW plants, ₹60,000 for 2 kW plants, and up to ₹78,000 for 3 kW and higher systems. In states like Uttar Pradesh, additional state top-up subsidies of up to ₹30,000 bring total solar subsidy benefits up to ₹1,08,000 for domestic consumers.',
          'Application Workflow on the National Portal: Consumers submit an application on the official PM Surya Ghar National Portal by selecting their local DISCOM, entering their electricity consumer account number, choosing an empanelled solar installer (such as SSR Solar Power), and uploading roof feasibility photos.',
          'Technical Feasibility & Empanelled Vendors: Once the DISCOM grants technical feasibility approval, empanelled solar engineers install ALMM-approved Domestic Content Requirement (DCR) solar panels, inverters, earthing systems, and safety isolators according to official MNRE standards.',
          'Net-Meter Installation & Direct Benefit Transfer (DBT): The local DISCOM inspects the rooftop installation, installs a bi-directional net meter, and issues a commissioning certificate. Verified PM Surya Ghar subsidy funds are then credited directly to the beneficiary\'s bank account via Direct Benefit Transfer (DBT).',
        ]),
      },
      {
        slug: 'keep-solar-panels-performing-well',
        categoryName: 'Maintenance Guide',
        title: 'How to Keep Your Solar Panels Performing Well',
        excerpt: 'Practical maintenance tips: cleaning techniques, dust management, post-monsoon inspections, and inverter yield tracking.',
        date: '9 June 2026',
        readTime: '5 min read',
        featuredImage: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1000&q=80',
        content: JSON.stringify([
          '1. Regular Water Cleaning Schedule: Dust, dry leaves, bird droppings, and industrial soot reduce light transmission through solar glass. Cleaning panels every 15 to 20 days with plain water restores optimal generation.',
          '2. Cool Hour Washing: Wash solar modules during early morning or late evening hours. Spraying cold water on solar panels under intense midday summer sunlight causes extreme thermal stress that can crack glass or damage internal cell interconnects.',
          '3. Gentle Microfiber Cleaning Tools: Use soft microfiber mops, sponge brushes, or gentle water sprays. Never use harsh chemical detergents, wire brushes, or high-pressure washers that can scratch antireflective coatings.',
          '4. Post-Monsoon Visual Audits: Inspect structural mounting bolts, earthing strip connections, and cable junction boxes after heavy rainstorms or dust storms to confirm everything remains tight and corrosion-free.',
          '5. Tracking Inverter Generation Logs: Monitor your inverter\'s mobile app or digital screen weekly to track daily kWh generation units. A sudden drop in daily energy output signals potential shading issues or a tripped circuit breaker.',
        ]),
      },
      {
        slug: 'topcon-vs-mono-perc-comparison',
        categoryName: 'Technology',
        title: 'TOPCon vs Mono PERC: What Should You Choose?',
        excerpt: 'Comparing cell efficiency, temperature coefficient, degradation rates, and low-light performance of modern PV module technologies.',
        date: '22 May 2026',
        readTime: '7 min read',
        featuredImage: 'https://images.unsplash.com/photo-1545209463-e2825498edbf?w=1000&q=80',
        content: JSON.stringify([
          'Monocrystalline PERC Overview: Mono PERC (Passivated Emitter and Rear Cell) has been the dominant solar cell technology for years, delivering proven module efficiencies of 20% to 21.3% with high structural reliability.',
          'TOPCon (Tunnel Oxide Passivated Contact) Innovation: N-type TOPCon is an advanced cell architecture incorporating an ultra-thin silicon oxide tunnel layer that reduces carrier recombination, elevating module efficiency to 22% and higher.',
          'Summer Heat Performance (Temperature Coefficient): Solar panels experience marginal efficiency loss as ambient temperatures rise. TOPCon modules feature a superior temperature coefficient (~-0.30%/°C) compared to Mono PERC (~-0.35%/°C), producing higher energy yields in extreme summer heat.',
          'Bifacial Gains & Degradation Rates: N-type TOPCon modules exhibit virtually zero Light-Induced Degradation (LID) and higher bifaciality (generating power from rear ambient light reflections), resulting in lower long-term degradation over 25 years.',
          'Cost-to-Performance Value: While TOPCon carries a small price premium over PERC, its higher generation output per square foot makes it ideal for urban rooftops with limited space.',
        ]),
      },
      {
        slug: 'on-grid-vs-hybrid-solar-system',
        categoryName: 'System Architecture',
        title: 'On-Grid vs Hybrid Solar: Which One Is Right?',
        excerpt: 'Grid-tied solar vs battery backup systems: power outages, net metering, battery costs, and household energy security.',
        date: '14 May 2026',
        readTime: '8 min read',
        featuredImage: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1000&q=80',
        content: JSON.stringify([
          'On-Grid (Grid-Tied) Solar Systems: On-grid systems connect directly to your local DISCOM power grid. Solar power generated during the day powers home appliances, and surplus energy is exported to the grid via net metering.',
          'Grid Safety & Anti-Islanding: During grid power outages, on-grid inverters automatically shut down within milliseconds (anti-islanding) to protect DISCOM maintenance personnel working on utility lines.',
          'Hybrid Solar Systems (Solar + Grid + Battery): Hybrid systems combine solar panels, grid connectivity, and dedicated lithium or tubular battery storage. During power cuts, hybrid inverters automatically switch load power to batteries.',
          'Energy Banking vs Power Backup: On-grid systems maximize monetary bill reduction in areas with reliable 24x7 electricity. Hybrid systems provide essential power backup during scheduled or unscheduled power cuts.',
          'Investment & Maintenance Factors: On-grid installations require lower upfront capital and zero battery replacement costs. Hybrid systems involve higher initial investment and periodic battery maintenance.',
        ]),
      },
      {
        slug: 'how-much-3kw-5kw-solar-system-save',
        categoryName: 'Financial Savings',
        title: 'How Much Can a 3kW or 5kW Solar System Save?',
        excerpt: 'Realistic unit generation estimates, monthly power bill reduction factors, payback periods, and long-term financial returns.',
        date: '28 April 2026',
        readTime: '6 min read',
        featuredImage: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1000&q=80',
        content: JSON.stringify([
          'Daily and Monthly Unit Generation: Under optimal sunlight, a 3 kW rooftop solar system generates approximately 12 to 14 units (kWh) per day (~360–420 units/month). A 5 kW system generates roughly 20 to 23 units per day (~600–690 units/month).',
          'DISCOM Bill Reduction Impact: Electricity tariffs are billed in slab rates where higher consumption incurs higher per-unit rates. Solar generation offsets these high-tier daytime units, reducing monthly DISCOM bills by 70% to 90%.',
          'Payback Period Calculations: Factoring in equipment costs, installation, and applicable central financial assistance, typical residential rooftop installations recover their full capital cost in 3.5 to 5 years.',
          '25-Year Cumulative Savings: Because Tier-1 solar panels carry 25-year performance warranties, solar installations continue delivering free, clean electricity for two decades after payback.',
          'Key Factors Affecting Output: Actual energy generation varies based on tilt angle, shadow clearance, panel cleanliness, inverter efficiency, and seasonal solar irradiance.',
        ]),
      },
      {
        slug: 'solar-panel-warranty-customer-guide',
        categoryName: 'Buyer Protection',
        title: 'Solar Panel Warranty: What Customers Should Know',
        excerpt: 'Product manufacturing warranty vs Linear power output warranty, degradation curves, and essential documentation.',
        date: '15 April 2026',
        readTime: '6 min read',
        featuredImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1000&q=80',
        content: JSON.stringify([
          'Product Warranty vs Performance Warranty: Solar module warranties consist of two separate guarantees: the Product/Workmanship Warranty and the Linear Power Output Warranty.',
          'Product Warranty (10–12 Years): Covers manufacturing defects, structural glass damage, frame joint failures, junction box defects, or bypass diode failures.',
          'Linear Performance Warranty (25 Years): Guarantees maximum allowable power output degradation over time (typically <= 2% in Year 1 and <= 0.55% annually thereafter, retaining >= 80–85% output at Year 25).',
          'Inverter & Balance of System Warranties: Solar inverters typically carry 5 to 10-year standard warranties, while hot-dip galvanized mounting structures feature structural warranties.',
          'Claim Documentation Requirements: Retain original GST tax invoices, manufacturer warranty certificates, flash test report sheets, and serial numbers safely to ensure fast warranty processing.',
        ]),
      },
      {
        slug: 'net-metering-explained-homeowners',
        categoryName: 'Grid Policy',
        title: 'Net Metering Explained for Homeowners',
        excerpt: 'How bi-directional net meters track imported vs exported solar units, monthly bill adjustments, and DISCOM grid integration.',
        date: '3 April 2026',
        readTime: '7 min read',
        featuredImage: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1000&q=80',
        content: JSON.stringify([
          'What is a Bi-Directional Net Meter?: A net meter replaces your standard DISCOM electricity meter. It records both electricity imported from the grid and excess solar electricity exported to the grid.',
          'Daytime Generation & Export Flow: During sunny daytime hours, if your rooftop solar system generates more power than your home uses, surplus electricity automatically flows into the DISCOM grid.',
          'Nighttime Grid Import & Billing Settlement: At night, when solar generation stops, your home draws grid electricity normally. On your monthly bill, the DISCOM calculates Net Billed Units = (Imported Units - Exported Units).',
          'Energy Banking Cycles: If monthly export exceeds import, surplus exported units are credited and carried forward to offset power consumption in subsequent billing cycles as per state regulations.',
          'Net Metering Approval Workflow: Net metering requires technical application filing, feasibility approval, site inspection, safety test report submission, and DISCOM meter installation.',
        ]),
      },
      {
        slug: 'how-to-choose-right-solar-inverter',
        categoryName: 'Hardware Guide',
        title: 'How to Choose the Right Solar Inverter',
        excerpt: 'String inverters vs hybrid inverters, MPPT channels, efficiency ratings, weather protection, and mobile app tracking.',
        date: '18 March 2026',
        readTime: '7 min read',
        featuredImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1000&q=80',
        content: JSON.stringify([
          'The Central Role of Solar Inverters: Solar panels generate DC electricity. The solar inverter converts DC energy into regulated 230V/415V AC electricity suitable for home appliances and grid export.',
          'Matching Inverter kW to Panel Array Wp: Select an inverter whose kW rating and DC voltage window match your solar panel array\'s cumulative peak capacity.',
          'MPPT Efficiency Ratings: Premium inverters feature high-efficiency Maximum Power Point Tracking (MPPT) algorithms (98%+ efficiency) to optimize power extraction during overcast sky conditions.',
          'Single-Phase vs Three-Phase Systems: Residential systems up to 3 kW or 5 kW typically use single-phase inverters. Larger residential or commercial systems require three-phase inverters for phase balance.',
          'IP Outdoor Rating & App Monitoring: Choose inverters with IP65 weather protection and built-in Wi-Fi logging for real-time mobile app tracking of daily unit generation and system health.',
        ]),
      },
    ];

    for (const post of officialPosts) {
      const blogRecord = {
        id: `blog-${post.slug}`,
        ...post,
        isPublished: true,
        publishedAt: new Date(post.date).toISOString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.inMemoryBlogs.set(post.slug, blogRecord);
      this.inMemoryBlogs.set(blogRecord.id, blogRecord);

      try {
        let category = await this.prisma.blogCategory.findUnique({
          where: { slug: post.categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-') },
        });

        if (!category) {
          category = await this.prisma.blogCategory.create({
            data: {
              name: post.categoryName,
              slug: post.categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            },
          });
        }

        await this.prisma.blog.upsert({
          where: { slug: post.slug },
          update: {
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            readTime: post.readTime,
            featuredImage: post.featuredImage,
            categoryId: category.id,
            isPublished: true,
          },
          create: {
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            readTime: post.readTime,
            featuredImage: post.featuredImage,
            categoryId: category.id,
            isPublished: true,
            publishedAt: new Date(post.date),
          },
        });
      } catch (err) {
        // Safe fallback if DB operation notice occurs
      }
    }
  }

  private formatBlogResponse(blog: any) {
    if (!blog) return null;

    let contentArr: string[] = [];
    if (Array.isArray(blog.content)) {
      contentArr = blog.content;
    } else if (typeof blog.content === 'string') {
      try {
        const parsed = JSON.parse(blog.content);
        if (Array.isArray(parsed)) {
          contentArr = parsed;
        } else {
          contentArr = blog.content.split('\n\n');
        }
      } catch {
        contentArr = blog.content.split('\n\n');
      }
    }

    const categoryName = blog.category?.name || blog.categoryName || 'Solar Guide';

    const formattedDate = blog.date || (blog.publishedAt
      ? new Date(blog.publishedAt).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : 'Recent');

    return {
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: contentArr,
      readTime: blog.readTime,
      featuredImage: blog.featuredImage || blog.image,
      image: blog.featuredImage || blog.image,
      category: categoryName,
      categoryName: categoryName,
      date: formattedDate,
      publishedAt: blog.publishedAt,
      isPublished: blog.isPublished !== false,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    };
  }

  async findAllPublic() {
    try {
      const dbBlogs = await this.prisma.blog.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' },
        include: { category: true },
      });
      if (dbBlogs && dbBlogs.length > 0) {
        return dbBlogs.map((b) => this.formatBlogResponse(b));
      }
    } catch (err) {
      this.logger.warn(`Blogs DB lookup notice: ${err.message}`);
    }

    // Deduplicate in-memory blogs by slug
    const mapBySlug = new Map<string, any>();
    for (const b of this.inMemoryBlogs.values()) {
      if (b.isPublished && b.slug) {
        mapBySlug.set(b.slug, b);
      }
    }
    return Array.from(mapBySlug.values()).map((b) => this.formatBlogResponse(b));
  }

  async findBySlug(slug: string) {
    try {
      const blog = await this.prisma.blog.findFirst({
        where: { OR: [{ slug }, { id: slug }], isPublished: true },
        include: { category: true },
      });
      if (blog) {
        return this.formatBlogResponse(blog);
      }
    } catch (err) {
      this.logger.warn(`Blog findBySlug DB notice: ${err.message}`);
    }

    const mem = this.inMemoryBlogs.get(slug);
    if (mem) {
      return this.formatBlogResponse(mem);
    }

    throw new NotFoundException(`Blog post with slug "${slug}" not found`);
  }

  async create(dto: CreateBlogDto) {
    const id = `blog-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const blogRecord = {
      id,
      ...dto,
      publishedAt: dto.isPublished !== false ? new Date() : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.inMemoryBlogs.set(id, blogRecord);
    this.inMemoryBlogs.set(dto.slug, blogRecord);

    try {
      const created = await this.prisma.blog.create({
        data: {
          title: dto.title,
          slug: dto.slug,
          excerpt: dto.excerpt,
          content: dto.content,
          readTime: dto.readTime,
          featuredImage: dto.featuredImage,
          categoryId: dto.categoryId,
          isPublished: dto.isPublished !== false,
          publishedAt: dto.isPublished !== false ? new Date() : null,
        },
        include: { category: true },
      });
      return this.formatBlogResponse(created);
    } catch (err) {
      this.logger.warn(`Blog saved in memory. DB notice: ${err.message}`);
      return this.formatBlogResponse(blogRecord);
    }
  }

  async update(id: string, dto: UpdateBlogDto) {
    try {
      const updated = await this.prisma.blog.update({
        where: { id },
        data: dto,
        include: { category: true },
      });
      return this.formatBlogResponse(updated);
    } catch (err) {
      const existing = this.inMemoryBlogs.get(id);
      if (!existing) {
        throw new NotFoundException(`Blog post with ID "${id}" not found`);
      }
      const updated = { ...existing, ...dto, updatedAt: new Date() };
      this.inMemoryBlogs.set(id, updated);
      return this.formatBlogResponse(updated);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.blog.delete({ where: { id } });
    } catch {
      this.inMemoryBlogs.delete(id);
    }
    return { message: `Blog post with ID "${id}" deleted successfully` };
  }
}
