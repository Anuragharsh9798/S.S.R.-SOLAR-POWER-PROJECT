import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface QuoteNotificationData {
  quoteNumber: string;
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  houseNumber?: string;
  area?: string;
  city: string;
  district?: string;
  state: string;
  pincode?: string;
  monthlyBillAmount?: number;
  solarType: string;
  message?: string;
  submissionDate: string;
  googleMapsUrl?: string;
}

export interface EmailSendResult {
  sent: boolean;
  status: 'sent' | 'failed' | 'skipped';
  error?: string;
  reason?: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly configService: ConfigService) {}

  /**
   * Retrieves EmailJS configuration from environment variables.
   * Supports standard EMAILJS_* as well as VITE_EMAILJS_* aliases.
   */
  private getEmailConfig() {
    const serviceId =
      this.configService.get<string>('EMAILJS_SERVICE_ID') ||
      this.configService.get<string>('VITE_EMAILJS_SERVICE_ID') ||
      process.env.EMAILJS_SERVICE_ID ||
      process.env.VITE_EMAILJS_SERVICE_ID;

    const templateId =
      this.configService.get<string>('EMAILJS_TEMPLATE_ID') ||
      this.configService.get<string>('VITE_EMAILJS_TEMPLATE_ID') ||
      process.env.EMAILJS_TEMPLATE_ID ||
      process.env.VITE_EMAILJS_TEMPLATE_ID;

    const publicKey =
      this.configService.get<string>('EMAILJS_PUBLIC_KEY') ||
      this.configService.get<string>('VITE_EMAILJS_PUBLIC_KEY') ||
      this.configService.get<string>('EMAILJS_USER_ID') ||
      process.env.EMAILJS_PUBLIC_KEY ||
      process.env.VITE_EMAILJS_PUBLIC_KEY ||
      process.env.EMAILJS_USER_ID;

    const privateKey =
      this.configService.get<string>('EMAILJS_PRIVATE_KEY') ||
      this.configService.get<string>('EMAILJS_ACCESS_TOKEN') ||
      process.env.EMAILJS_PRIVATE_KEY ||
      process.env.EMAILJS_ACCESS_TOKEN;

    const adminEmail =
      this.configService.get<string>('ADMIN_NOTIFICATION_EMAIL') ||
      process.env.ADMIN_NOTIFICATION_EMAIL ||
      'info@ssrsolarpower.com';

    const origin =
      this.configService.get<string>('CORS_ORIGIN') ||
      process.env.CORS_ORIGIN ||
      'https://ssrsolarpower.com';

    return {
      serviceId: serviceId?.trim(),
      templateId: templateId?.trim(),
      publicKey: publicKey?.trim(),
      privateKey: privateKey?.trim(),
      adminEmail: adminEmail?.trim(),
      origin: origin?.trim(),
      isConfigured: Boolean(serviceId && templateId && publicKey),
    };
  }

  /**
   * Sends an admin notification email for a newly created quotation enquiry.
   * Never throws exceptions; returns an EmailSendResult so quotation persistence is not blocked.
   * Logs success/failure without logging customer PII or secret credentials.
   */
  async sendQuoteEnquiryNotification(
    data: QuoteNotificationData,
  ): Promise<EmailSendResult> {
    const config = this.getEmailConfig();

    if (!config.isConfigured) {
      const missing: string[] = [];
      if (!config.serviceId) missing.push('EMAILJS_SERVICE_ID');
      if (!config.templateId) missing.push('EMAILJS_TEMPLATE_ID');
      if (!config.publicKey) missing.push('EMAILJS_PUBLIC_KEY');

      const reason = `Email notification skipped: missing configuration (${missing.join(', ')})`;
      this.logger.warn(
        `Admin quotation notification email skipped for quote ${data.quoteNumber}: credentials not configured (${missing.join(', ')})`,
      );

      return {
        sent: false,
        status: 'skipped',
        reason,
      };
    }

    try {
      const templateParams: Record<string, unknown> = {
        to_email: config.adminEmail,
        company_name: 'SSR Solar Power',
        email_subject: `New Solar Quote Enquiry – ${data.fullName}`,
        client_name: data.fullName,
        client_phone: data.phone,
        client_email: data.email?.trim() || 'Not provided',
        complete_address: data.address,
        house_number: data.houseNumber?.trim() || 'Not provided',
        area_locality: data.area?.trim() || 'Not provided',
        city: data.city?.trim() || 'Mau',
        district: data.district?.trim() || 'Not provided',
        state: data.state?.trim() || 'Uttar Pradesh',
        pincode: data.pincode?.trim() || 'Not provided',
        monthly_bill: data.monthlyBillAmount
          ? `₹${data.monthlyBillAmount}`
          : 'Not provided',
        solar_type: data.solarType?.trim() || 'On-Grid Solar',
        client_message: data.message?.trim() || 'Not provided',
        quote_number: data.quoteNumber,
        submission_date: data.submissionDate,
        google_maps_url: data.googleMapsUrl?.trim() || 'Not provided',
        from_name: data.fullName,
        reply_to: data.email?.trim() || config.adminEmail,
        message:
          data.message?.trim() ||
          `New solar quote enquiry from ${data.fullName} (Phone: ${data.phone})`,
      };

      const requestBody: Record<string, unknown> = {
        service_id: config.serviceId,
        template_id: config.templateId,
        user_id: config.publicKey,
        template_params: templateParams,
      };

      if (config.privateKey) {
        requestBody.accessToken = config.privateKey;
      }

      // EmailJS REST API requires origin header when called from server environments
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          origin: config.origin,
          'User-Agent': 'SSR-Solar-Backend/1.0',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        const safeError = errorText || `HTTP ${response.status} ${response.statusText}`;
        this.logger.error(
          `Admin quotation notification email delivery failed for quote ${data.quoteNumber}: ${safeError}`,
        );
        return {
          sent: false,
          status: 'failed',
          error: safeError,
        };
      }

      this.logger.log(
        `Admin quotation notification email sent successfully for quote ${data.quoteNumber} to ${config.adminEmail}`,
      );

      return {
        sent: true,
        status: 'sent',
      };
    } catch (err: any) {
      const safeError = err?.message || 'Network error communicating with EmailJS API';
      this.logger.error(
        `Admin quotation notification email delivery failed for quote ${data.quoteNumber}: ${safeError}`,
      );
      return {
        sent: false,
        status: 'failed',
        error: safeError,
      };
    }
  }
}
