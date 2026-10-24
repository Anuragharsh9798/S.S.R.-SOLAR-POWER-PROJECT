import emailjs from "@emailjs/browser";

export interface SolarQuoteEnquiryEmailData {
  client_name: string;
  client_phone: string;
  client_email?: string;
  complete_address: string;
  house_number?: string;
  area_locality?: string;
  city: string;
  district?: string;
  state: string;
  pincode?: string;
  monthly_bill?: string;
  solar_type: string;
  client_message?: string;
  quote_number?: string;
  submission_date: string;
  google_maps_url?: string;
}

export interface EmailSendResult {
  success: boolean;
  error?: string;
  skipped?: boolean;
}

export interface EmailJsConfig {
  serviceId?: string;
  templateId?: string;
  publicKey?: string;
  isConfigured: boolean;
}

/**
 * Reads EmailJS configuration safely from Vite environment variables.
 * Never hardcodes or exposes secrets.
 */
export function getEmailJsConfig(): EmailJsConfig {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID?.trim();
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID?.trim();
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY?.trim();

  const isConfigured = Boolean(serviceId && templateId && publicKey);
  return {
    serviceId,
    templateId,
    publicKey,
    isConfigured,
  };
}

/**
 * Sends client quotation enquiry details to info@ssrsolarpower.com via EmailJS.
 * Recipient is fixed and cannot be modified or overridden by form users.
 */
export async function sendQuoteEnquiryEmail(
  data: SolarQuoteEnquiryEmailData
): Promise<EmailSendResult> {
  const config = getEmailJsConfig();

  if (!config.isConfigured) {
    const missing: string[] = [];
    if (!config.serviceId) missing.push("VITE_EMAILJS_SERVICE_ID");
    if (!config.templateId) missing.push("VITE_EMAILJS_TEMPLATE_ID");
    if (!config.publicKey) missing.push("VITE_EMAILJS_PUBLIC_KEY");

    const diagnostic = `Missing EmailJS configuration: ${missing.join(", ")}. Email notification skipped.`;
    // Safe diagnostic log without logging customer PII or any secret keys
    console.warn(`[EmailJS] ${diagnostic}`);

    return {
      success: false,
      skipped: true,
      error: diagnostic,
    };
  }

  try {
    const templateParams: Record<string, unknown> = {
      to_email: "info@ssrsolarpower.com",
      company_name: "SSR Solar Power",
      email_subject: `New Solar Quote Enquiry – ${data.client_name}`,
      client_name: data.client_name,
      client_phone: data.client_phone,
      client_email: data.client_email?.trim() || "Not provided",
      complete_address: data.complete_address,
      house_number: data.house_number?.trim() || "Not provided",
      area_locality: data.area_locality?.trim() || "Not provided",
      city: data.city?.trim() || "Mau",
      district: data.district?.trim() || "Not provided",
      state: data.state?.trim() || "Uttar Pradesh",
      pincode: data.pincode?.trim() || "Not provided",
      monthly_bill: data.monthly_bill?.trim() || "Not provided",
      solar_type: data.solar_type?.trim() || "On-Grid Solar",
      client_message: data.client_message?.trim() || "Not provided",
      quote_number: data.quote_number?.trim() || "Pending / Not Generated",
      submission_date: data.submission_date,
      google_maps_url: data.google_maps_url?.trim() || "Not provided",
      // EmailJS common default aliases
      from_name: data.client_name,
      reply_to: data.client_email?.trim() || "info@ssrsolarpower.com",
      message: data.client_message?.trim() || `New solar quote enquiry from ${data.client_name} (Phone: ${data.client_phone})`,
    };

    await emailjs.send(
      config.serviceId!,
      config.templateId!,
      templateParams,
      config.publicKey!
    );

    return { success: true };
  } catch (err: any) {
    const errMsg = err?.text || err?.message || "Failed to deliver email notification through EmailJS.";
    // Safe error log without printing customer PII
    console.error("[EmailJS] Delivery error:", errMsg);
    return {
      success: false,
      error: errMsg,
    };
  }
}
