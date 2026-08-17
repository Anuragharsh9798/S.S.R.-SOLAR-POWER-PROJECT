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
   * Domain AI Knowledge Engine for SSR Solar Power
   */
  private async generateSolarAssistantResponse(prompt: string): Promise<string> {
    const lower = prompt.toLowerCase();

    // Check if query is subsidy-related
    if (
      lower.includes('subsidy') ||
      lower.includes('pm surya ghar') ||
      lower.includes('yojana') ||
      lower.includes('cfa') ||
      lower.includes('up state')
    ) {
      return await this.handleSubsidyQuery(lower, prompt);
    }

    if (lower.includes('panel') || lower.includes('530w') || lower.includes('space') || lower.includes('roof')) {
      return (
        'SSR Solar Power utilizes high-efficiency 530W Mono-PERC / TopCon panels (0.53 kW rating per panel, ' +
        'dimensions: 7.48 × 3.72 ft, area ~27.83 sq.ft.). A standard 3 kW plant requires approximately 6 panels and ' +
        '~167 sq.ft. of shadow-free rooftop space.'
      );
    }

    if (lower.includes('cost') || lower.includes('price') || lower.includes('investment') || lower.includes('rate')) {
      return (
        'Benchmark rooftop solar plant costs start around ₹55,000 per kW. ' +
        'Request a free site inspection and custom quotation on our website for authoritative net investment calculations.'
      );
    }

    if (lower.includes('contact') || lower.includes('phone') || lower.includes('mau') || lower.includes('office') || lower.includes('address')) {
      return (
        'SSR Solar Power head office is located in Kutubpur, Bahadurpur, Mau, Uttar Pradesh (Pincode: 221602). ' +
        'You can request a free rooftop site inspection and custom quotation directly on our website or call our solar advisors!'
      );
    }

    return (
      'Hello! I am the SSR Solar Power Virtual Assistant. I can assist you with rooftop solar sizing, 530W panel specs, ' +
      'verified PM Surya Ghar government subsidies, and estimated ROI for your home or business in Uttar Pradesh. ' +
      'How can I help you today?'
    );
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

    if (!verifiedStats || verifiedStats.length === 0) {
      return 'Notice: Verified government subsidy data is currently unavailable from the server. Please verify subsidy amounts on official government portals.';
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
      if (centralStat && stateStat) {
        const dateStr = centralStat.lastVerifiedAt
          ? new Date(centralStat.lastVerifiedAt).toISOString().split('T')[0]
          : centralStat.effectiveDate || 'Recent';
        return (
          `Notice: Unverified or exaggerated subsidy amounts are not supported by verified government statistics. ` +
          `According to verified data from ${centralStat.source} (Last Verified: ${dateStr}), ` +
          `the maximum Central Financial Assistance (CFA) is ₹${centralStat.value} and UP State subsidy maximum is ₹${stateStat.value}. ` +
          `Please rely strictly on official government benchmarks.`
        );
      }
      return 'Notice: The queried subsidy figure could not be verified against official backend government statistics. Please rely only on verified benchmarks.';
    }

    // 2. Combined Subsidy Question
    if (lower.includes('combined') || lower.includes('both') || lower.includes('total')) {
      if (centralStat && stateStat) {
        const centralVal = parseInt(centralStat.value.replace(/,/g, ''), 10) || 78000;
        const stateVal = parseInt(stateStat.value.replace(/,/g, ''), 10) || 30000;
        const totalVal = centralVal + stateVal;
        const formattedTotal = totalVal.toLocaleString('en-IN');
        const dateStr = centralStat.lastVerifiedAt
          ? new Date(centralStat.lastVerifiedAt).toISOString().split('T')[0]
          : centralStat.effectiveDate || 'Recent';

        return (
          `Based on verified data from ${centralStat.source} and ${stateStat.source} (Last Verified: ${dateStr}), ` +
          `eligible residential households in Uttar Pradesh can receive up to ₹${centralStat.value} Central CFA ` +
          `plus up to ₹${stateStat.value} UP State Subsidy, combining for up to ₹${formattedTotal} in total applicable subsidy.`
        );
      } else {
        return 'Combined subsidy amounts could not be verified because full Central and State data is currently unavailable.';
      }
    }

    // 3. UP State Subsidy Question
    if (lower.includes('up state') || lower.includes('uttar pradesh') || lower.includes('state subsidy')) {
      if (stateStat) {
        const dateStr = stateStat.lastVerifiedAt
          ? new Date(stateStat.lastVerifiedAt).toISOString().split('T')[0]
          : stateStat.effectiveDate || 'Recent';
        return (
          `According to verified data from ${stateStat.source} (Last Verified: ${dateStr}), ` +
          `the Uttar Pradesh State Solar Subsidy maximum benchmark is ₹${stateStat.value} for eligible residential rooftop installations.`
        );
      } else {
        return 'UP State subsidy amount could not be verified from backend government statistics at this time.';
      }
    }

    // 4. Central / PM Surya Ghar Subsidy Question (Default)
    if (centralStat) {
      const dateStr = centralStat.lastVerifiedAt
        ? new Date(centralStat.lastVerifiedAt).toISOString().split('T')[0]
        : centralStat.effectiveDate || 'Recent';
      return (
        `According to verified data from ${centralStat.source} (Last Verified: ${dateStr}), ` +
        `the Maximum Central Financial Assistance (CFA) under PM Surya Ghar Muft Bijli Yojana is ₹${centralStat.value} for eligible residential households.`
      );
    }

    return 'Government subsidy amounts could not be verified from current backend statistics at this time.';
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
}
