import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import emailjs from "@emailjs/browser";
import {
  getEmailJsConfig,
  sendQuoteEnquiryEmail,
  SolarQuoteEnquiryEmailData,
} from "../lib/emailService";

vi.mock("@emailjs/browser", () => ({
  default: {
    send: vi.fn(),
  },
  send: vi.fn(),
}));

describe("EmailJS Notification Service", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  const sampleData: SolarQuoteEnquiryEmailData = {
    client_name: "Ramesh Verma",
    client_phone: "9876543210",
    client_email: "ramesh@example.com",
    complete_address: "Station Road, Mau, UP",
    house_number: "Flat 4B",
    area_locality: "Civil Lines",
    city: "Mau",
    district: "Mau",
    state: "Uttar Pradesh",
    pincode: "221602",
    monthly_bill: "₹4,500",
    solar_type: "On-Grid",
    client_message: "Need 5kW rooftop system with subsidy assistance",
    quote_number: "SSR-Q-2026-0042",
    submission_date: "20 Oct 2026, 11:00 AM",
    google_maps_url: "https://www.google.com/maps?q=25.94,83.52",
  };

  it("1. Gracefully handles missing EmailJS environment variables without throwing", async () => {
    vi.stubEnv("VITE_EMAILJS_SERVICE_ID", "");
    vi.stubEnv("VITE_EMAILJS_TEMPLATE_ID", "");
    vi.stubEnv("VITE_EMAILJS_PUBLIC_KEY", "");

    const config = getEmailJsConfig();
    expect(config.isConfigured).toBe(false);

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const result = await sendQuoteEnquiryEmail(sampleData);

    expect(result.success).toBe(false);
    expect(result.skipped).toBe(true);
    expect(result.error).toContain("Missing EmailJS configuration");
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("Missing EmailJS configuration")
    );
    expect(emailjs.send).not.toHaveBeenCalled();

    vi.unstubAllEnvs();
  });

  it("2. Dispatches EmailJS notification with fixed recipient info@ssrsolarpower.com and all fields when configured", async () => {
    vi.stubEnv("VITE_EMAILJS_SERVICE_ID", "service_ssr_test");
    vi.stubEnv("VITE_EMAILJS_TEMPLATE_ID", "template_ssr_quote");
    vi.stubEnv("VITE_EMAILJS_PUBLIC_KEY", "pub_key_test_123");

    const emailSendSpy = vi.mocked(emailjs.send).mockResolvedValue({
      status: 200,
      text: "OK",
    });

    const result = await sendQuoteEnquiryEmail(sampleData);

    expect(result.success).toBe(true);
    expect(emailSendSpy).toHaveBeenCalledTimes(1);
    expect(emailSendSpy).toHaveBeenCalledWith(
      "service_ssr_test",
      "template_ssr_quote",
      expect.objectContaining({
        to_email: "info@ssrsolarpower.com",
        company_name: "SSR Solar Power",
        client_name: "Ramesh Verma",
        client_phone: "9876543210",
        client_email: "ramesh@example.com",
        complete_address: "Station Road, Mau, UP",
        house_number: "Flat 4B",
        area_locality: "Civil Lines",
        city: "Mau",
        district: "Mau",
        state: "Uttar Pradesh",
        pincode: "221602",
        monthly_bill: "₹4,500",
        solar_type: "On-Grid",
        client_message: "Need 5kW rooftop system with subsidy assistance",
        quote_number: "SSR-Q-2026-0042",
        submission_date: "20 Oct 2026, 11:00 AM",
        google_maps_url: "https://www.google.com/maps?q=25.94,83.52",
        email_subject: "New Solar Quote Enquiry – Ramesh Verma",
      }),
      "pub_key_test_123"
    );

    vi.unstubAllEnvs();
  });

  it("3. Handles EmailJS rejection cleanly and returns error object without crashing", async () => {
    vi.stubEnv("VITE_EMAILJS_SERVICE_ID", "service_ssr_test");
    vi.stubEnv("VITE_EMAILJS_TEMPLATE_ID", "template_ssr_quote");
    vi.stubEnv("VITE_EMAILJS_PUBLIC_KEY", "pub_key_test_123");

    vi.mocked(emailjs.send).mockRejectedValue(new Error("EmailJS API rate limit exceeded"));
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await sendQuoteEnquiryEmail(sampleData);

    expect(result.success).toBe(false);
    expect(result.error).toBe("EmailJS API rate limit exceeded");
    expect(errorSpy).toHaveBeenCalled();

    vi.unstubAllEnvs();
  });

  it("4. Accurately applies 'Not provided' fallbacks for all optional fields when omitted", async () => {
    vi.stubEnv("VITE_EMAILJS_SERVICE_ID", "service_ssr_test");
    vi.stubEnv("VITE_EMAILJS_TEMPLATE_ID", "template_ssr_quote");
    vi.stubEnv("VITE_EMAILJS_PUBLIC_KEY", "pub_key_test_123");

    const emailSendSpy = vi.mocked(emailjs.send).mockResolvedValue({
      status: 200,
      text: "OK",
    });

    const minimalData: SolarQuoteEnquiryEmailData = {
      client_name: "Amit Kumar",
      client_phone: "9876543210",
      complete_address: "Mau Main Market",
      city: "",
      state: "",
      solar_type: "On-Grid",
      submission_date: "21 Oct 2026, 02:30 PM",
    };

    const result = await sendQuoteEnquiryEmail(minimalData);

    expect(result.success).toBe(true);
    expect(emailSendSpy).toHaveBeenCalledWith(
      "service_ssr_test",
      "template_ssr_quote",
      expect.objectContaining({
        to_email: "info@ssrsolarpower.com",
        client_name: "Amit Kumar",
        client_phone: "9876543210",
        client_email: "Not provided",
        complete_address: "Mau Main Market",
        house_number: "Not provided",
        area_locality: "Not provided",
        city: "Mau",
        district: "Not provided",
        state: "Uttar Pradesh",
        pincode: "Not provided",
        monthly_bill: "Not provided",
        solar_type: "On-Grid",
        client_message: "Not provided",
        quote_number: "Pending / Not Generated",
        submission_date: "21 Oct 2026, 02:30 PM",
        google_maps_url: "Not provided",
      }),
      "pub_key_test_123"
    );

    vi.unstubAllEnvs();
  });
});
