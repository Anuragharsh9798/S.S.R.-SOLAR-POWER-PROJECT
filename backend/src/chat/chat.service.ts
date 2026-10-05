import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GovernmentStatisticsService } from '../government-statistics/government-statistics.service';
import { SendChatMessageDto } from './dto/send-chat-message.dto';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private inMemoryConversations: Map<string, any[]> = new Map();

  constructor(
    private readonly prisma: PrismaService,
    private readonly govtStatsService: GovernmentStatisticsService,
  ) {}

  /**
   * Processes user chat message securely with prompt injection protection & response sanitization.
   */
  async processMessage(dto: SendChatMessageDto, clientIp: string) {
    const rawMessage = dto.message.trim();

    // 1. Prompt Injection Defense Pipeline
    this.detectPromptInjection(rawMessage);

    const conversationId =
      dto.conversationId || `conv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    // 2. Generate Domain-Specific Solar Assistant Response using Verified Government Data
    const responseText = await this.generateSolarAssistantResponse(rawMessage);

    // 3. Sensitive Data Exposure Sanitization (Post-generation check)
    const sanitizedResponse = this.sanitizeAIOutput(responseText);

    // 4. Record Message & Conversation in Database / Cache
    const history = this.inMemoryConversations.get(conversationId) || [];
    history.push({ role: 'USER', message: rawMessage, timestamp: new Date() });
    history.push({ role: 'ASSISTANT', message: sanitizedResponse, timestamp: new Date() });
    this.inMemoryConversations.set(conversationId, history);

    try {
      let conv = await this.prisma.chatConversation.findUnique({
        where: { sessionId: conversationId },
      });

      if (!conv) {
        conv = await this.prisma.chatConversation.create({
          data: { sessionId: conversationId, status: 'ACTIVE' },
        });
      }

      await this.prisma.chatMessage.createMany({
        data: [
          { conversationId: conv.id, senderType: 'USER', message: rawMessage },
          { conversationId: conv.id, senderType: 'BOT', message: sanitizedResponse },
        ],
      });
    } catch (err) {
      this.logger.warn(`Chat saved in memory cache. DB notice: ${err.message}`);
    }

    return {
      conversationId,
      reply: sanitizedResponse,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Scans input prompt for jailbreak and prompt injection patterns.
   */
  private detectPromptInjection(input: string) {
    const injectionPatterns = [
      /ignore\s+(all\s+)?(previous|above|security)?\s*(instructions|rules)/i,
      /reveal\s+(system\s+prompt|api\s+key|passwords?|secrets?|jwt)/i,
      /show\s+(me\s+)?(env|environment|database\s+credentials|api\s+key|jwt|password)/i,
      /tell\s+me\s+(the\s+)?(jwt\s+secret|api\s+key|database\s+password|passwords?|secrets?)/i,
      /give\s+me\s+(the\s+)?(database\s+password|api\s+key|jwt\s+secret|admin\s+access)/i,
      /execute\s+(this\s+)?(sql|shell|command|script)/i,
      /select\s+.*\s+from\s+/i,
      /drop\s+table/i,
      /pretend\s+i\s+am\s+(an\s+)?admin/i,
      /you\s+are\s+now\s+in\s+dan\s+mode/i,
      /jailbreak/i,
      /bypass\s+security/i,
    ];

    for (const pattern of injectionPatterns) {
      if (pattern.test(input)) {
        this.logger.warn(`PROMPT INJECTION ATTEMPT DETECTED: "${input}"`);
        throw new BadRequestException(
          'Security policy violation: Malicious or restricted prompt patterns detected.',
        );
      }
    }
  }

  /**
   * Domain AI Knowledge Engine for SSR Solar Power.
   * Handles all solar queries with accurate domain intelligence, practical troubleshooting,
   * subsidy verification, sizing formulas, and polite non-solar redirection.
   */
  private async generateSolarAssistantResponse(prompt: string): Promise<string> {
    const rawPrompt = prompt.trim();
    const lower = rawPrompt.toLowerCase();

    // 1. Greetings & Pleasantries
    if (/^(hi|hello|hey|namaste|good\s*(morning|afternoon|evening)|hola|greeting)/i.test(lower) && lower.split(/\s+/).length <= 4) {
      return (
        'Hello! I am your SSR Solar AI Assistant. I can help you with:\n' +
        '• PM Surya Ghar subsidies (up to ₹1,08,000 in UP)\n' +
        '• Solar system sizing & electricity bill savings\n' +
        '• On-grid, off-grid & hybrid solar solutions\n' +
        '• 530W panel specs, roof space & inverter basics\n' +
        '• Solar troubleshooting, maintenance & cleaning\n' +
        '• SSR Solar Power site survey & contact in Mau, UP\n\n' +
        'How can I assist you with your solar journey today?'
      );
    }

    // 2. Unrelated / Non-solar Query Filtering
    if (this.isNonSolarQuery(lower)) {
      return (
        'I am the SSR Solar AI Assistant, dedicated specifically to solar energy systems, rooftop solar sizing, ' +
        'PM Surya Ghar subsidies, and SSR Solar Power services.\n\n' +
        'I am unable to answer general questions outside of solar energy. Feel free to ask me about:\n' +
        '• Sizing a solar system for your home or business\n' +
        '• PM Surya Ghar Muft Bijli Yojana & UP State subsidies\n' +
        '• On-grid vs. off-grid vs. hybrid solar setups\n' +
        '• Solar panel specifications (530W TopCon/Mono-PERC)\n' +
        '• Solar cleaning, maintenance & inverter troubleshooting\n' +
        '• SSR Solar Power services in Mau, Uttar Pradesh\n\n' +
        'What solar-related question can I answer for you?'
      );
    }

    // 3. Subsidy / PM Surya Ghar / Government Schemes
    if (
      lower.includes('subsidy') ||
      lower.includes('pm surya ghar') ||
      lower.includes('surya ghar') ||
      lower.includes('muft bijli') ||
      lower.includes('yojana') ||
      lower.includes('cfa') ||
      lower.includes('up state') ||
      lower.includes('upneda') ||
      lower.includes('government scheme') ||
      lower.includes('sarkari subsidy')
    ) {
      return await this.handleSubsidyQuery(lower, rawPrompt);
    }

    // 4. Solar Faults / Inverter Troubleshooting / Diagnostics
    if (
      lower.includes('troubleshoot') ||
      lower.includes('fault') ||
      lower.includes('error') ||
      lower.includes('red light') ||
      lower.includes('not working') ||
      lower.includes('low generation') ||
      lower.includes('less generation') ||
      lower.includes('not producing') ||
      lower.includes('not turning on') ||
      lower.includes('tripped') ||
      lower.includes('bill high') ||
      lower.includes('high bill') ||
      lower.includes('battery drain') ||
      lower.includes('not charging')
    ) {
      return this.handleTroubleshootingQuery(lower);
    }

    // 5. Solar Panel Cleaning & Maintenance
    if (
      lower.includes('clean') ||
      lower.includes('wash') ||
      lower.includes('dust') ||
      lower.includes('dirt') ||
      lower.includes('maintain') ||
      lower.includes('maintenance') ||
      lower.includes('service')
    ) {
      return this.handleMaintenanceCleaningQuery(lower);
    }

    // 6. Net Metering & Grid Export
    if (
      lower.includes('net meter') ||
      lower.includes('net-meter') ||
      lower.includes('bi-directional') ||
      lower.includes('bidirectional') ||
      lower.includes('grid export') ||
      lower.includes('discom') ||
      lower.includes('uppcl')
    ) {
      return this.handleNetMeteringQuery(lower);
    }

    // 7. Solar System Sizing, Bill Reduction & Savings Calculation
    if (
      lower.includes('sizing') ||
      lower.includes('how much kw') ||
      lower.includes('how many kw') ||
      lower.includes('how much solar') ||
      lower.includes('how many panel') ||
      lower.includes('capacity need') ||
      lower.includes('bill') ||
      lower.includes('saving') ||
      lower.includes('units') ||
      lower.includes('payback') ||
      lower.includes('roi') ||
      lower.includes('calculate') ||
      lower.includes('calculator') ||
      /\b\d+\s*(kw|kwh|units?|rs|inr|rupees?)\b/i.test(lower)
    ) {
      return this.handleSizingAndSavingsQuery(lower);
    }

    // 8. Solar Panel Generation & Daily Units
    if (
      lower.includes('generation') ||
      lower.includes('produce') ||
      lower.includes('generate') ||
      lower.includes('output') ||
      lower.includes('daily unit') ||
      lower.includes('per day') ||
      lower.includes('kwh per day')
    ) {
      return this.handleGenerationQuery(lower);
    }

    // 9. Roof Space & Rooftop Area Requirements
    if (
      lower.includes('roof') ||
      lower.includes('space') ||
      lower.includes('area') ||
      lower.includes('sq ft') ||
      lower.includes('sqft') ||
      lower.includes('square feet') ||
      lower.includes('chhat')
    ) {
      return this.handleRoofSpaceQuery(lower);
    }

    // 10. On-Grid vs Off-Grid vs Hybrid Solar Systems
    if (
      lower.includes('on-grid') ||
      lower.includes('ongrid') ||
      lower.includes('grid-tied') ||
      lower.includes('grid tied') ||
      lower.includes('off-grid') ||
      lower.includes('offgrid') ||
      lower.includes('hybrid') ||
      lower.includes('difference between') ||
      lower.includes('which system') ||
      lower.includes('types of solar')
    ) {
      return this.handleSystemTypesQuery(lower);
    }

    // 11. Inverter & Battery Basics
    if (
      lower.includes('inverter') ||
      lower.includes('battery') ||
      lower.includes('batteries') ||
      lower.includes('lithium') ||
      lower.includes('tubular') ||
      lower.includes('lifepo4') ||
      lower.includes('backup') ||
      lower.includes('mppt')
    ) {
      return this.handleInverterBatteryQuery(lower);
    }

    // 12. Solar Panels Technical Specs (530W, Mono-PERC, TopCon, Bifacial)
    if (
      lower.includes('panel') ||
      lower.includes('530w') ||
      lower.includes('monocrystalline') ||
      lower.includes('mono-perc') ||
      lower.includes('topcon') ||
      lower.includes('bifacial') ||
      lower.includes('efficiency') ||
      lower.includes('degradation') ||
      lower.includes('warranty')
    ) {
      return this.handlePanelSpecsQuery(lower);
    }

    // 13. Solar Installation, Structure & Safety
    if (
      lower.includes('installation') ||
      lower.includes('install') ||
      lower.includes('structure') ||
      lower.includes('mounting') ||
      lower.includes('gi') ||
      lower.includes('earthing') ||
      lower.includes('lightning') ||
      lower.includes('safety') ||
      lower.includes('acdb') ||
      lower.includes('dcdb')
    ) {
      return this.handleInstallationQuery(lower);
    }

    // 14. Residential vs Commercial / Industrial Solar
    if (
      lower.includes('commercial') ||
      lower.includes('industrial') ||
      lower.includes('factory') ||
      lower.includes('business') ||
      lower.includes('residential') ||
      lower.includes('home') ||
      lower.includes('depreciation')
    ) {
      return this.handleResidentialCommercialQuery(lower);
    }

    // 15. SSR Solar Power Company Info, Services, Pricing & Contact
    if (
      lower.includes('ssr solar') ||
      lower.includes('company') ||
      lower.includes('contact') ||
      lower.includes('phone') ||
      lower.includes('email') ||
      lower.includes('mau') ||
      lower.includes('office') ||
      lower.includes('address') ||
      lower.includes('location') ||
      lower.includes('cost') ||
      lower.includes('price') ||
      lower.includes('rate') ||
      lower.includes('quotation') ||
      lower.includes('site survey') ||
      lower.includes('inspection')
    ) {
      return this.handleCompanyAndContactQuery(lower);
    }

    // Fallback for general solar queries
    return (
      'I am your SSR Solar AI Assistant. I can help you with:\n' +
      '• PM Surya Ghar rooftop solar subsidies (up to ₹1,08,000 in UP)\n' +
      '• System sizing, generation units, and electricity bill savings\n' +
      '• On-grid, off-grid, and hybrid solar system architectures\n' +
      '• 530W Mono-PERC / TopCon panel specs and roof space calculations\n' +
      '• Solar cleaning, maintenance, and inverter fault troubleshooting\n\n' +
      'Could you please specify your question, monthly electricity bill, or the solar topic you would like to explore?'
    );
  }

  /**
   * Checks if user prompt is unrelated to solar energy or SSR Solar services.
   */
  private isNonSolarQuery(lower: string): boolean {
    const hasSolarContext =
      lower.includes('solar') ||
      lower.includes('sun') ||
      lower.includes('panel') ||
      lower.includes('inverter') ||
      lower.includes('subsidy') ||
      lower.includes('surya') ||
      lower.includes('bijli') ||
      lower.includes('photovoltaic') ||
      lower.includes('pv') ||
      lower.includes('net meter') ||
      lower.includes('net-meter') ||
      lower.includes('rooftop') ||
      lower.includes('ssr') ||
      lower.includes('battery') ||
      lower.includes('batteries') ||
      lower.includes('electricity') ||
      lower.includes('power') ||
      lower.includes('kw') ||
      lower.includes('kwh') ||
      lower.includes('units') ||
      lower.includes('tariff') ||
      lower.includes('discom') ||
      lower.includes('uppcl') ||
      lower.includes('watt') ||
      lower.includes('530w') ||
      lower.includes('voltage') ||
      lower.includes('earthing') ||
      lower.includes('plant') ||
      lower.includes('quote') ||
      lower.includes('quotation') ||
      lower.includes('mau') ||
      lower.includes('clean') ||
      lower.includes('maintenance') ||
      lower.includes('troubleshoot') ||
      lower.includes('grid') ||
      lower.includes('cfa') ||
      lower.includes('upneda') ||
      lower.includes('mono-perc') ||
      lower.includes('topcon') ||
      lower.includes('bifacial') ||
      lower.includes('monocrystalline') ||
      lower.includes('polycrystalline') ||
      lower.includes('acdb') ||
      lower.includes('dcdb') ||
      lower.includes('roof') ||
      lower.includes('shade') ||
      lower.includes('shading') ||
      lower.includes('generation') ||
      lower.includes('saving') ||
      lower.includes('bill');

    if (hasSolarContext) return false;

    return true;
  }

  /**
   * Dynamically constructs subsidy responses strictly using backend verified government-statistics.
   */
  private async handleSubsidyQuery(lower: string, originalPrompt: string): Promise<string> {
    let verifiedStats: any[] = [];
    try {
      verifiedStats = await this.govtStatsService.findAll();
    } catch {
      verifiedStats = [];
    }

    const centralStat = verifiedStats.find(
      (s) =>
        s.id === 'stat-max-central-subsidy' ||
        (s.metric && s.metric.toLowerCase().includes('central')) ||
        (s.metric && s.metric.toLowerCase().includes('cfa')),
    );

    const stateStat = verifiedStats.find(
      (s) =>
        s.id === 'stat-up-state-subsidy' ||
        (s.metric && s.metric.toLowerCase().includes('uttar pradesh')) ||
        (s.metric && s.metric.toLowerCase().includes('state')),
    );

    const centralVal = centralStat?.value || '78,000';
    const stateVal = stateStat?.value || '30,000';

    // 1. Check for Fake / Outdated / Exaggerated Subsidy figures in user query
    const hasFakeOrUnverifiedNumbers =
      /\b([4-9]\d{5,}|[1-9]\d{6,}|500000|5\s*lakh|10\s*lakh|90%|100%)\b/i.test(originalPrompt) &&
      !lower.includes('78,000') &&
      !lower.includes('78000') &&
      !lower.includes('30,000') &&
      !lower.includes('30000') &&
      !lower.includes('1,08,000') &&
      !lower.includes('108000');

    if (hasFakeOrUnverifiedNumbers) {
      return (
        `Notice: Exaggerated or unverified subsidy figures are not supported by official government policies.\n\n` +
        `Under the official PM Surya Ghar Muft Bijli Yojana:\n` +
        `• 1 kW System: ₹30,000 Central CFA\n` +
        `• 2 kW System: ₹60,000 Central CFA + ₹30,000 UP State Subsidy\n` +
        `• 3 kW & Above: ₹78,000 Central CFA + ₹30,000 UP State Subsidy (Total: up to ₹1,08,000 in Uttar Pradesh)\n\n` +
        `Subsidies apply strictly to residential grid-connected rooftops and are credited via Direct Benefit Transfer (DBT) through pmsuryaghar.gov.in.`
      );
    }

    // 2. Specific System Capacity Queries
    if (lower.includes('1kw') || lower.includes('1 kw')) {
      return (
        'PM Surya Ghar Subsidy for a 1 kW Rooftop Solar System:\n' +
        '• Central CFA Subsidy: ₹30,000\n' +
        '• UP State Subsidy: ₹15,000\n' +
        '• Total Applicable Subsidy in UP: ₹45,000\n\n' +
        'A 1 kW system generates ~4-4.5 units per day (~120-135 units/month). Would you like to know the rooftop space required or check your eligibility?'
      );
    }

    if (lower.includes('2kw') || lower.includes('2 kw')) {
      return (
        'PM Surya Ghar Subsidy for a 2 kW Rooftop Solar System:\n' +
        '• Central CFA Subsidy: ₹60,000\n' +
        '• UP State Subsidy: ₹30,000\n' +
        '• Total Applicable Subsidy in UP: ₹90,000\n\n' +
        'A 2 kW system generates ~8-9 units per day (~240-270 units/month). Would you like to check if your roof has the ~112 sq.ft. space needed?'
      );
    }

    if (lower.includes('3kw') || lower.includes('3 kw') || lower.includes('5kw') || lower.includes('5 kw') || lower.includes('10kw') || lower.includes('10 kw')) {
      return (
        `PM Surya Ghar Subsidy for 3 kW and Above Rooftop Solar Systems:\n` +
        `• Central Financial Assistance (CFA): ₹${centralVal} (maximum central cap for residential)\n` +
        `• Uttar Pradesh State Subsidy: ₹${stateVal} (max state cap)\n` +
        `• Total Combined Subsidy in UP: up to ₹1,08,000\n\n` +
        `Systems larger than 3 kW (e.g. 5 kW or 10 kW) receive the capped maximum residential subsidy of ₹1,08,000. ` +
        `What is your average monthly electricity bill so we can size the optimal system for you?`
      );
    }

    // 3. How to Apply / Process Query
    if (lower.includes('apply') || lower.includes('process') || lower.includes('portal') || lower.includes('registration') || lower.includes('documents')) {
      return (
        'PM Surya Ghar Subsidy Application Process:\n' +
        '1. Registration: Register on the National Portal (pmsuryaghar.gov.in) with your DISCOM consumer number and mobile number.\n' +
        '2. Feasibility Approval: Submit your rooftop solar application and receive DISCOM technical feasibility.\n' +
        '3. Installation by Empaneled Vendor: SSR Solar Power installs the MNRE-compliant system (530W panels & Tier-1 inverter).\n' +
        '4. Net Meter & Inspection: DISCOM inspects the plant and installs the bi-directional net meter.\n' +
        '5. Direct Subsidy Credit: Submit bank account details on the portal; the subsidy (up to ₹1,08,000) is credited directly via DBT into your account within 30 days.\n\n' +
        'SSR Solar Power handles the complete documentation and net metering liaisoning for you. Would you like a free site survey in Mau or nearby areas?'
      );
    }

    // 4. General / Combined Subsidy Overview
    return (
      `PM Surya Ghar Muft Bijli Yojana Subsidies (Residential Grid-Connected):\n` +
      `• 1 kW System: ₹30,000 Central + ₹15,000 UP State = ₹45,000\n` +
      `• 2 kW System: ₹60,000 Central + ₹30,000 UP State = ₹90,000\n` +
      `• 3 kW & Above: ₹${centralVal} Central + ₹${stateVal} UP State = up to ₹1,08,000 Total\n\n` +
      `Important Notes:\n` +
      `• Subsidies are applicable only for residential rooftop systems.\n` +
      `• Commercial & Industrial installations do not receive direct subsidies but qualify for 40% Accelerated Depreciation tax benefits.\n\n` +
      `What is your monthly electricity bill so we can determine your exact eligible capacity?`
    );
  }

  /**
   * Diagnostic & troubleshooting response engine
   */
  private handleTroubleshootingQuery(lower: string): string {
    // 1. Low solar generation / drop in output
    if (lower.includes('low generation') || lower.includes('less generation') || lower.includes('not producing') || lower.includes('drop')) {
      return (
        'Troubleshooting Low Solar Generation:\n' +
        '1. Check Panel Surface: Dust, bird droppings, or fallen leaves can reduce generation by 15-30%. Clean panels early morning with soft water.\n' +
        '2. Inspect Shading: Check if new tree branches, water tanks, or nearby constructions cast shadows across panels between 9 AM and 4 PM.\n' +
        '3. Weather Impact: Cloudy, overcast, or foggy weather naturally lowers daily solar irradiance.\n' +
        '4. Breakers & Fuses: Check if any DC string fuse in the DCDB or AC MCB in the ACDB has tripped.\n' +
        '5. Inverter String Readings: Check the inverter screen to see if all strings (PV1, PV2) show normal voltage and current.\n\n' +
        'What is your system capacity and how many units is your inverter generating daily right now?'
      );
    }

    // 2. Inverter red light / fault error code
    if (lower.includes('red light') || lower.includes('fault') || lower.includes('error') || lower.includes('tripped')) {
      return (
        'Troubleshooting Inverter Fault / Red Light:\n' +
        '1. Check Grid Availability: On-grid inverters turn red and shut down when DISCOM power is out (anti-islanding safety).\n' +
        '2. Grid Voltage Range: If grid voltage fluctuates below 190V or above 265V, the inverter safely trips. It will auto-restart when voltage normalizes.\n' +
        '3. Check Isolators: Ensure both the DC rotary switch on the inverter and the AC MCB in the ACDB are switched ON.\n' +
        '4. Safe Restart Sequence:\n' +
        '   - Turn OFF AC breaker in ACDB box.\n' +
        '   - Turn OFF DC rotary switch on inverter.\n' +
        '   - Wait 5 minutes for internal capacitors to discharge.\n' +
        '   - Turn ON DC switch, then turn ON AC breaker.\n' +
        '5. Insulation/Earth Fault: If an earth fault code appears, inspect DC cables for cuts or water in MC4 connectors.\n\n' +
        'What is the exact error code or text displayed on your inverter screen?'
      );
    }

    // 3. Inverter not turning on
    if (lower.includes('not turning on') || lower.includes('dead') || lower.includes('no display')) {
      return (
        'Troubleshooting Inverter Not Turning On:\n' +
        '1. Sunlight & Startup Voltage: Inverters require minimum startup DC voltage (~80V-120V) from the solar panels. They remain off before sunrise or in dense fog.\n' +
        '2. DC Rotary Switch: Ensure the DC isolator switch on the bottom/side of the inverter is turned to the "ON" position.\n' +
        '3. DCDB Fuse Check: Inspect the DC string fuses inside your DCDB box to verify they have not blown.\n' +
        '4. DC Polarity: Ensure DC cables from the rooftop array are firmly connected with correct polarity (+/-).\n\n' +
        'If the issue persists in bright daylight, contact SSR Solar support for an onsite technician inspection.'
      );
    }

    // 4. High electricity bill despite solar
    if (lower.includes('high bill') || lower.includes('bill high') || lower.includes('bill not reduced')) {
      return (
        'Troubleshooting High Electricity Bill After Solar Installation:\n' +
        '1. Net Meter Verification: Confirm that DISCOM has installed and activated the bi-directional Net Meter (not your old unidirectional meter).\n' +
        '2. Export Units on Bill: Check if your DISCOM electricity bill lists "Export Units" (kWh exported) subtracting from "Import Units".\n' +
        '3. High Nighttime Consumption: Solar generates power during daytime. Heavy nighttime loads (multiple ACs, water heaters) consume grid power unless covered by exported unit credits.\n' +
        '4. Billing Cycle Timing: Verify the billing period. If solar was commissioned mid-cycle, full savings reflect from the next complete billing cycle.\n\n' +
        'Do you see "Export Units" listed on your latest electricity bill?'
      );
    }

    // 5. Battery not charging or draining quickly
    if (lower.includes('battery') || lower.includes('drain') || lower.includes('not charging')) {
      return (
        'Troubleshooting Solar Battery Issues (Hybrid / Off-Grid):\n' +
        '1. Electrolyte Level (Tubular Batteries): Check water level indicator floats. Top up with distilled water if low.\n' +
        '2. Charging Settings: Ensure the hybrid inverter charge controller is set to the correct battery type (Lithium LiFePO4 vs. C10 Tubular) and correct cut-off voltages.\n' +
        '3. Overload During Outages: Running heavy inductive loads (heavy motors, multiple ACs) during power cuts will rapidly deplete battery storage.\n' +
        '4. Battery Age & Health: Lead-acid batteries typically last 4-6 years, while Lithium lasts 10-15 years. Check if battery voltage drops instantly under load.\n\n' +
        'What type of battery (Tubular or Lithium) and inverter model do you have installed?'
      );
    }

    return (
      'Solar System Troubleshooting Guide:\n' +
      '• Low Generation: Clean panels, check shadows, verify string voltages.\n' +
      '• Inverter Red Light: Check grid power availability, grid voltage (190V-265V), and DC/AC breakers.\n' +
      '• System Not Starting: Verify DC switch is ON and solar array receives adequate sunlight.\n' +
      '• High Bill: Verify bi-directional net meter is active and recording export units.\n\n' +
      'What specific symptom or error code are you currently experiencing?'
    );
  }

  /**
   * Solar panel cleaning and maintenance guidelines
   */
  private handleMaintenanceCleaningQuery(lower: string): string {
    return (
      'Solar Panel Cleaning & Maintenance Best Practices:\n\n' +
      '1. Cleaning Frequency:\n' +
      '• Clean every 15 to 30 days depending on local dust, pollution, and bird activity.\n\n' +
      '2. Best Time to Clean:\n' +
      '• Early Morning (before 8:00 AM) or Late Evening (after 5:30 PM).\n' +
      '• Never clean panels during peak afternoon sun when glass is hot; cold water on hot panels can cause thermal shock and glass micro-cracks.\n\n' +
      '3. Proper Cleaning Method:\n' +
      '• Use soft running water and a soft microfiber mop, sponge, or rubber squeegee.\n' +
      '• Do NOT use abrasive scrubbers, metal scrapers, or harsh chemical detergents.\n' +
      '• Avoid hard borewell water with high TDS to prevent mineral scaling on the anti-reflective glass coating.\n\n' +
      '4. Preventive Maintenance Checklist:\n' +
      '• Check mounting structure bolts and hot-dip galvanized GI coating annually.\n' +
      '• Inspect MC4 connectors and cable conduit for weather wear.\n' +
      '• Test earthing pit resistance (must remain under 5 ohms; keep pits moist in summer).\n' +
      '• Keep inverter air vents and cooling fans free of dust accumulation.\n\n' +
      'SSR Solar Power provides professional maintenance and cleaning packages in Mau and Eastern UP. Would you like to schedule a service visit?'
    );
  }

  /**
   * Net metering and DISCOM export guide
   */
  private handleNetMeteringQuery(lower: string): string {
    return (
      'How Net Metering Works in Uttar Pradesh (UPPCL / DISCOM):\n\n' +
      '1. Bi-Directional Meter:\n' +
      '• Replaces your traditional single-direction meter with a digital bi-directional meter provided by the DISCOM.\n' +
      '• It simultaneously records: (A) Electricity imported from grid, and (B) Surplus solar electricity exported to grid.\n\n' +
      '2. Monthly Billing Calculation:\n' +
      '• Net Units Billed = Import Units - Export Units.\n' +
      '• If you generate more solar units than consumed, the surplus credit rolls over to the next billing cycle.\n' +
      '• Annual settlement of excess energy credits is processed according to UPERC regulatory norms.\n\n' +
      '3. Application & Liaisoning:\n' +
      '• SSR Solar Power handles the complete net metering application, technical feasibility submission, testing, and meter installation with UPPCL.\n\n' +
      'What is your sanctioned electrical load (in kW) on your current electricity bill?'
    );
  }

  /**
   * Solar sizing, bill savings, and payback calculation
   */
  private handleSizingAndSavingsQuery(lower: string): string {
    // Check if user provided specific numbers in prompt
    const billMatch = lower.match(/(?:rs\.?|inr|₹|bill\s*(?:of)?)\s*(\d{3,6})/i) || lower.match(/(\d{3,6})\s*(?:rs|rupees|inr|\/\-)/i);
    const unitMatch = lower.match(/(\d{2,5})\s*(?:units?|kwh)/i);
    const kwMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:kw|kilowatt)/i);

    if (billMatch) {
      const billAmount = parseInt(billMatch[1], 10);
      const approxUnits = Math.round(billAmount / 7.5);
      const recommendedKw = Math.max(1, Math.ceil((approxUnits / 120) * 2) / 2);
      const dailyGen = Math.round(recommendedKw * 4.3 * 10) / 10;
      const monthlyGen = Math.round(dailyGen * 30);
      const monthlySavings = Math.round(monthlyGen * 7.5);
      const roofArea = Math.round(recommendedKw * 80);

      return (
        `Custom Solar Sizing for Monthly Bill of ₹${billAmount.toLocaleString('en-IN')}:\n\n` +
        `• Estimated Monthly Consumption: ~${approxUnits} units\n` +
        `• Recommended Solar System: ${recommendedKw} kW Rooftop Solar\n` +
        `• Expected Generation: ~${dailyGen} units/day (~${monthlyGen} units/month)\n` +
        `• Estimated Monthly Savings: ~₹${monthlySavings.toLocaleString('en-IN')} (up to 85-90% bill reduction)\n` +
        `• Required Roof Area: ~${roofArea} sq.ft. shadow-free space\n` +
        `• Applicable PM Surya Ghar Subsidy: ${recommendedKw >= 3 ? 'Up to ₹1,08,000' : recommendedKw >= 2 ? 'Up to ₹90,000' : 'Up to ₹45,000'} in UP\n` +
        `• Payback Period: ~3 to 3.5 years (enjoy free electricity for the remaining 22+ years!)\n\n` +
        `Would you like to book a free rooftop feasibility inspection by SSR Solar Power?`
      );
    }

    if (unitMatch) {
      const units = parseInt(unitMatch[1], 10);
      const recommendedKw = Math.max(1, Math.ceil((units / 120) * 2) / 2);
      const dailyGen = Math.round(recommendedKw * 4.3 * 10) / 10;
      const monthlyGen = Math.round(dailyGen * 30);
      const roofArea = Math.round(recommendedKw * 80);

      return (
        `Custom Solar Sizing for Consumption of ${units} Units/Month:\n\n` +
        `• Recommended Solar System: ${recommendedKw} kW Rooftop Solar\n` +
        `• Expected Generation: ~${dailyGen} units/day (~${monthlyGen} units/month)\n` +
        `• Shadow-Free Roof Area Needed: ~${roofArea} sq.ft.\n` +
        `• Applicable PM Surya Ghar Subsidy: ${recommendedKw >= 3 ? 'Up to ₹1,08,000' : recommendedKw >= 2 ? 'Up to ₹90,000' : 'Up to ₹45,000'} in UP\n` +
        `• Expected Bill Reduction: Up to 90%\n\n` +
        `Would you like to get a customized quotation for your rooftop?`
      );
    }

    if (kwMatch) {
      const kw = parseFloat(kwMatch[1]);
      const dailyGen = Math.round(kw * 4.3 * 10) / 10;
      const monthlyGen = Math.round(dailyGen * 30);
      const panelsNeeded = Math.ceil((kw * 1000) / 530);
      const roofArea = Math.round(panelsNeeded * 27.83 * 1.15);
      const subsidy = kw >= 3 ? 'Up to ₹1,08,000' : kw >= 2 ? 'Up to ₹90,000' : 'Up to ₹45,000';

      return (
        `${kw} kW Rooftop Solar System Overview:\n\n` +
        `• Daily Generation: ~${dailyGen} units/day (~${monthlyGen} units/month)\n` +
        `• Solar Panels: ~${panelsNeeded} panels (using high-efficiency 530W Mono-PERC / TopCon)\n` +
        `• Shadow-Free Roof Area: ~${roofArea} sq.ft.\n` +
        `• PM Surya Ghar Subsidy (Residential UP): ${subsidy}\n` +
        `• Ideal For: Homes/Offices with monthly consumption of ~${monthlyGen} units\n` +
        `• System Lifespan: 25+ years with 3-4 year ROI payback\n\n` +
        `What type of system (On-Grid with Net Metering, Off-Grid, or Hybrid with battery) are you planning?`
      );
    }

    return (
      'Solar System Sizing & Savings Guide:\n\n' +
      'Rule of Thumb Sizing Formula:\n' +
      '• Monthly Electricity Units ÷ 120 = Recommended System Capacity (in kW)\n\n' +
      'Standard Benchmarks:\n' +
      '• 1 kW Plant: Generates ~120-135 units/mo | Roof: ~80 sq.ft. | Subsidy: ₹45,000\n' +
      '• 2 kW Plant: Generates ~240-270 units/mo | Roof: ~160 sq.ft. | Subsidy: ₹90,000\n' +
      '• 3 kW Plant: Generates ~360-420 units/mo | Roof: ~200-240 sq.ft. | Subsidy: ₹1,08,000\n' +
      '• 5 kW Plant: Generates ~600-700 units/mo | Roof: ~350-400 sq.ft. | Subsidy: ₹1,08,000 (capped max)\n\n' +
      'What is your average monthly electricity bill (in ₹) or monthly unit consumption? I can give you an exact calculation!'
    );
  }

  /**
   * Generation units per day and solar output guide
   */
  private handleGenerationQuery(lower: string): string {
    return (
      'Solar Panel Generation Benchmarks (North India / Uttar Pradesh):\n\n' +
      '• 1 kW System: 4.0 – 4.5 units (kWh) per day (~120 – 135 units/month | ~1,500 units/year)\n' +
      '• 2 kW System: 8.0 – 9.0 units per day (~240 – 270 units/month)\n' +
      '• 3 kW System: 12.0 – 14.0 units per day (~360 – 420 units/month)\n' +
      '• 5 kW System: 20.0 – 22.5 units per day (~600 – 675 units/month)\n' +
      '• 10 kW System: 40.0 – 45.0 units per day (~1,200 – 1,350 units/month)\n\n' +
      'Key Factors Determining Generation:\n' +
      '1. Sunlight Hours: 4.5 to 5.5 peak sun hours per day average in UP.\n' +
      '2. Orientation & Tilt: True South-facing with a 25°-28° tilt maximizes annual output.\n' +
      '3. Cleanliness: Regular cleaning ensures 100% light transmission to cells.\n' +
      '4. Temperature: TopCon / Mono-PERC modules maintain higher efficiency during peak summer heat.\n\n' +
      'What system capacity or appliance load are you looking to power?'
    );
  }

  /**
   * Roof area requirements
   */
  private handleRoofSpaceQuery(lower: string): string {
    return (
      'Rooftop Area Requirements for Solar Installation:\n\n' +
      'General Rule: ~80 to 100 sq.ft. of shadow-free rooftop area per 1 kW system.\n\n' +
      'With SSR Solar 530W High-Efficiency Panels (Dimensions: 7.48 ft × 3.72 ft = ~27.83 sq.ft./panel):\n' +
      '• 1 kW System (~2 panels): ~56 sq.ft. (Recommend ~80 sq.ft. for spacing)\n' +
      '• 2 kW System (~4 panels): ~112 sq.ft. (Recommend ~150 sq.ft.)\n' +
      '• 3 kW System (~6 panels): ~167 sq.ft. (Recommend ~200-240 sq.ft.)\n' +
      '• 5 kW System (~10 panels): ~280 sq.ft. (Recommend ~350-400 sq.ft.)\n' +
      '• 10 kW System (~19-20 panels): ~550 sq.ft. (Recommend ~700 sq.ft. including walkways)\n\n' +
      'Roof Space Types Supported:\n' +
      '• Flat RCC Rooftop (Standard or elevated gazebo structures allowing usable roof space underneath)\n' +
      '• Tin / Metal Sheds (Direct mounting with aluminum clamps without roof drilling)\n' +
      '• Tiled / Sloped Roofs\n\n' +
      'How much approximate rooftop area (in sq.ft.) do you have available?'
    );
  }

  /**
   * On-Grid vs Off-Grid vs Hybrid Solar System Architectures
   */
  private handleSystemTypesQuery(lower: string): string {
    return (
      'Comparison of Solar System Types:\n\n' +
      '1. On-Grid Solar (Grid-Tied) - Most Popular & Cost-Effective:\n' +
      '• Connected to the DISCOM grid via a bi-directional net meter.\n' +
      '• No batteries required (lowest cost, 0 battery maintenance).\n' +
      '• Exports excess day generation to the grid for electricity bill credits.\n' +
      '• Eligible for full PM Surya Ghar subsidies (up to ₹1,08,000 in UP).\n' +
      '• Shuts down during power outages for lineman safety (anti-islanding).\n\n' +
      '2. Off-Grid Solar (Standalone with Battery):\n' +
      '• Independent of the electricity grid; stores energy in Tubular or Lithium batteries.\n' +
      '• Provides 24/7 power backup during load shedding and in remote areas.\n' +
      '• Higher initial cost; battery replacement needed every 5-10 years.\n\n' +
      '3. Hybrid Solar (Grid-Tied + Battery Backup) - Best of Both Worlds:\n' +
      '• Connected to the grid with net metering AND equipped with a battery bank.\n' +
      '• Automatically powers home loads, charges batteries, and exports surplus to the grid.\n' +
      '• Seamlessly supplies backup power during grid cuts day and night.\n\n' +
      'Do you experience frequent power cuts in your area, or is your main goal to eliminate your electricity bill?'
    );
  }

  /**
   * Inverters and batteries guide
   */
  private handleInverterBatteryQuery(lower: string): string {
    return (
      'Solar Inverters & Battery Storage Guide:\n\n' +
      '1. Solar Inverters:\n' +
      '• On-Grid String Inverters: Converts DC to AC with >98% efficiency, MPPT trackers, and WiFi monitoring (e.g. Growatt, Solis, Sungrow, Deye, Havells).\n' +
      '• Hybrid Inverters: Dual-function intelligent inverters that manage both grid export and battery charging/discharging.\n' +
      '• Microinverters: Module-level MPPT optimization for roofs with partial shade.\n\n' +
      '2. Battery Storage Options:\n' +
      '• Lithium Ferro Phosphate (LiFePO4): 10-15 year lifespan, 90% Depth of Discharge (DoD), compact wall-mount, zero maintenance, 4,000+ charge cycles.\n' +
      '• Solar Tubular Lead-Acid (C10): 4-6 year lifespan, 50-70% DoD, lower upfront cost, requires periodic distilled water topping.\n\n' +
      'Are you planning an On-Grid system (no batteries) or a Hybrid/Off-Grid system with battery backup?'
    );
  }

  /**
   * 530W Solar Panel specs, Mono-PERC / TopCon technology
   */
  private handlePanelSpecsQuery(lower: string): string {
    return (
      'SSR Solar 530W Panel Specifications & Technology:\n\n' +
      '• Rated Power Output: 530 Watts Peak (0.53 kW per panel)\n' +
      '• Cell Technology: Mono-PERC / TopCon (N-Type) High-Efficiency Half-Cut Cells\n' +
      '• Module Efficiency: ~21.5% to 22.3%\n' +
      '• Panel Dimensions: ~7.48 ft × 3.72 ft (2278 mm × 1134 mm)\n' +
      '• Surface Area: ~27.83 sq.ft. per module\n' +
      '• Temperature Coefficient: -0.30%/°C (Superior performance in extreme summer heat)\n' +
      '• Bifacial Option: Generates up to 10-20% additional power from rear-side reflected light\n' +
      '• Warranty & Degradation: 12-year product warranty & 25-30 year linear performance warranty (guaranteed >84% output at 25 years with <0.55%/year degradation)\n\n' +
      'How many panels or what total plant capacity are you considering?'
    );
  }

  /**
   * Installation, structural mounting and electrical safety
   */
  private handleInstallationQuery(lower: string): string {
    return (
      'Solar Installation, Structure & Safety Standards:\n\n' +
      '1. Mounting Structure:\n' +
      '• Hot-Dip Galvanized Iron (GI) or Anodized Aluminum with 80+ micron zinc coating for rust protection.\n' +
      '• Wind speed certified for up to 150+ km/h.\n' +
      '• Optimized South orientation with 25°-28° tilt angle.\n' +
      '• Elevated / Gazebo structures available to preserve usable rooftop space.\n\n' +
      '2. Electrical Protection (ACDB & DCDB):\n' +
      '• DC Distribution Box (DCDB): Type II Surge Protection Device (SPD) and DC MCB/fuses to protect against solar surges.\n' +
      '• AC Distribution Box (ACDB): AC SPD, MCB/Isolator for grid isolation.\n\n' +
      '3. Earthing & Lightning Protection:\n' +
      '• Dedicated Chemical Earthing Pits (Separate pits for AC, DC, and Lightning Arrestor).\n' +
      '• Copper-bonded earthing electrodes with low resistance (<5 ohms).\n' +
      '• Early Streamer Emission (ESE) / Conventional Class B/C Lightning Arrestor (LA).\n\n' +
      'Would you like SSR Solar Power engineers to conduct a free structural and electrical site assessment?'
    );
  }

  /**
   * Residential vs Commercial & Industrial Solar
   */
  private handleResidentialCommercialQuery(lower: string): string {
    return (
      'Residential vs Commercial & Industrial Solar Solutions:\n\n' +
      '1. Residential Solar:\n' +
      '• Capacities: Typically 1 kW to 10 kW.\n' +
      '• Subsidy: Eligible for PM Surya Ghar subsidy (up to ₹1,08,000 in UP).\n' +
      '• Benefit: Reduces household electricity bills by up to 90%.\n' +
      '• Payback: ~3 to 3.5 years.\n\n' +
      '2. Commercial & Industrial (C&I) Solar:\n' +
      '• Capacities: 10 kW to 500+ kW (factories, schools, hospitals, petrol pumps, warehouses).\n' +
      '• Subsidies: No direct capital subsidy, but qualifies for 40% Accelerated Depreciation (AD) tax benefits and GST input credit.\n' +
      '• Tariff Offset: Drastically reduces high commercial grid electricity tariffs (₹8-12/unit).\n' +
      '• Payback: ~2.5 to 3.5 years with substantial 25-year operational cost savings.\n\n' +
      'Is your installation for a home, apartment, commercial building, or factory?'
    );
  }

  /**
   * SSR Solar Power Company details, services and contact
   */
  private handleCompanyAndContactQuery(lower: string): string {
    return (
      'About SSR Solar Power & Contact Information:\n\n' +
      'SSR Solar Power is a premier solar EPC provider in Eastern Uttar Pradesh, specializing in complete turnkey rooftop solar installations, PM Surya Ghar subsidy processing, and net metering liaisoning.\n\n' +
      'Our Services:\n' +
      '• On-Grid, Off-Grid & Hybrid Solar EPC Installations\n' +
      '• End-to-End PM Surya Ghar Subsidy Liaisoning (up to ₹1,08,000)\n' +
      '• DISCOM Net Metering approvals with UPPCL\n' +
      '• Tier-1 530W Mono-PERC / TopCon solar panels & smart inverters\n' +
      '• Free rooftop feasibility survey & customized plant design\n' +
      '• System maintenance, cleaning & health monitoring\n\n' +
      'Head Office Location:\n' +
      'Kutubpur, Bahadurpur, Mau, Uttar Pradesh (Pincode: 221602)\n\n' +
      'Pricing & Quotation:\n' +
      '• Benchmark rooftop solar pricing starts around ₹50,000 - ₹58,000 per kW (before subsidy), depending on structure height and inverter configuration.\n' +
      '• You can calculate your exact investment using our online Solar Calculator or request a free site inspection!\n\n' +
      'Would you like to book a free site survey in Mau or nearby districts?'
    );
  }

  /**
   * Strips any accidental exposure of sensitive keys or credentials from AI output
   */
  private sanitizeAIOutput(output: string): string {
    const sensitivePatterns = [
      /DATABASE_URL/g,
      /JWT_SECRET/g,
      /postgres:\/\/[^\s]+/g,
      /Bearer\s+[A-Za-z0-9-_=.]+/g,
    ];

    let clean = output;
    for (const pattern of sensitivePatterns) {
      clean = clean.replace(pattern, '[REDACTED]');
    }
    return clean;
  }

  async findAllAdminConversations() {
    try {
      const conversations = await this.prisma.chatConversation.findMany({
        orderBy: { updatedAt: 'desc' },
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          _count: {
            select: { messages: true },
          },
        },
      });

      if (conversations && conversations.length > 0) {
        return conversations.map((c) => ({
          id: c.id,
          sessionId: c.sessionId,
          status: c.status,
          messageCount: c._count.messages,
          lastMessage: c.messages[0]?.message || 'No messages',
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,
        }));
      }
    } catch (err) {
      this.logger.warn(`ChatConversation DB lookup notice: ${err.message}`);
    }

    const list: any[] = [];
    for (const [sessionId, messages] of this.inMemoryConversations.entries()) {
      list.push({
        id: sessionId,
        sessionId,
        status: 'ACTIVE',
        messageCount: messages.length,
        lastMessage: messages[messages.length - 1]?.message || 'No messages',
        createdAt: messages[0]?.timestamp || new Date(),
        updatedAt: messages[messages.length - 1]?.timestamp || new Date(),
      });
    }
    return list;
  }

  async findConversationMessages(sessionId: string) {
    try {
      const conv = await this.prisma.chatConversation.findFirst({
        where: { OR: [{ id: sessionId }, { sessionId }] },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      if (conv) {
        return {
          id: conv.id,
          sessionId: conv.sessionId,
          status: conv.status,
          createdAt: conv.createdAt,
          messages: conv.messages.map((m) => ({
            id: m.id,
            senderType: m.senderType,
            message: this.sanitizeAIOutput(m.message),
            createdAt: m.createdAt,
          })),
        };
      }
    } catch (err) {
      this.logger.warn(`findConversationMessages DB notice: ${err.message}`);
    }

    const mem = this.inMemoryConversations.get(sessionId);
    if (!mem) {
      return { id: sessionId, sessionId, status: 'ACTIVE', messages: [] };
    }

    return {
      id: sessionId,
      sessionId,
      status: 'ACTIVE',
      messages: mem.map((m, idx) => ({
        id: `mem-${idx}`,
        senderType: m.role === 'USER' ? 'USER' : 'BOT',
        message: this.sanitizeAIOutput(m.message),
        createdAt: m.timestamp,
      })),
    };
  }
}
