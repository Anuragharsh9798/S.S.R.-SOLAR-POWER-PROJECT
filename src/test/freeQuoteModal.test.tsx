import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { FreeQuoteModal, openFreeQuoteModal } from "../components/FreeQuoteModal";
import { api } from "../lib/api";
import * as emailService from "../lib/emailService";
import { toast } from "sonner";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("FreeQuoteModal - Quotation & EmailJS Notification Flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const fillRequiredFields = () => {
    const nameInput = screen.getByLabelText(/Full Name/i);
    const mobileInput = screen.getByLabelText(/Mobile Number/i);
    const addressInput = screen.getByLabelText(/Complete Address/i);

    fireEvent.change(nameInput, { target: { value: "Anurag Sharma" } });
    fireEvent.change(mobileInput, { target: { value: "9876543210" } });
    fireEvent.change(addressInput, { target: { value: "Mau, Uttar Pradesh" } });
  };

  it("1. Triggers EXACTLY ONE quotation API request and sends notification email on successful submission", async () => {
    const postSpy = vi.spyOn(api, "post").mockResolvedValue({
      quoteNumber: "SSR-TEST-001",
      calculation: {
        recommendedPlantSizeKw: 3,
        panelSpecs: { requiredPanels: 6, requiredRoofAreaSqFt: 180 },
      },
    });

    const emailSpy = vi.spyOn(emailService, "sendQuoteEnquiryEmail").mockResolvedValue({
      success: true,
    });

    render(<FreeQuoteModal />);

    act(() => {
      openFreeQuoteModal();
    });

    await waitFor(() => {
      expect(screen.getByText("Request a Custom Solar Estimate")).toBeInTheDocument();
    });

    fillRequiredFields();

    const submitBtn = screen.getByRole("button", { name: /Request Free Quote/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(postSpy).toHaveBeenCalledTimes(1);
    });

    expect(postSpy).toHaveBeenCalledWith(
      "/api/v1/quotations",
      expect.objectContaining({
        fullName: "Anurag Sharma",
        phone: "9876543210",
        address: "Mau, Uttar Pradesh",
      })
    );

    await waitFor(() => {
      expect(emailSpy).toHaveBeenCalledTimes(1);
      expect(emailSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          client_name: "Anurag Sharma",
          client_phone: "9876543210",
          complete_address: "Mau, Uttar Pradesh",
          quote_number: "SSR-TEST-001",
        })
      );
    });
  });

  it("2. Successfully displays quotation reference and completes submission flow", async () => {
    const postSpy = vi.spyOn(api, "post").mockResolvedValue({
      quoteNumber: "SSR-TEST-999",
      calculation: {
        recommendedPlantSizeKw: 5,
        panelSpecs: { requiredPanels: 10, requiredRoofAreaSqFt: 300 },
      },
    });

    vi.spyOn(emailService, "sendQuoteEnquiryEmail").mockResolvedValue({
      success: true,
    });

    render(<FreeQuoteModal />);

    act(() => {
      openFreeQuoteModal();
    });

    await waitFor(() => {
      expect(screen.getByText("Request a Custom Solar Estimate")).toBeInTheDocument();
    });

    fillRequiredFields();

    const submitBtn = screen.getByRole("button", { name: /Request Free Quote/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(postSpy).toHaveBeenCalledTimes(1);
      expect(toast.success).toHaveBeenCalledWith(
        "Quote request received successfully!",
        expect.objectContaining({ description: "Reference Code: SSR-TEST-999" })
      );
    });
  });

  it("3. Backend failure does NOT send EmailJS notification and resets loading state", async () => {
    const postSpy = vi.spyOn(api, "post").mockRejectedValue(new Error("Network connection timeout"));
    const emailSpy = vi.spyOn(emailService, "sendQuoteEnquiryEmail").mockResolvedValue({ success: true });

    render(<FreeQuoteModal />);

    act(() => {
      openFreeQuoteModal();
    });

    await waitFor(() => {
      expect(screen.getByText("Request a Custom Solar Estimate")).toBeInTheDocument();
    });

    fillRequiredFields();

    const submitBtn = screen.getByRole("button", { name: /Request Free Quote/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(postSpy).toHaveBeenCalledTimes(1);
      expect(toast.error).toHaveBeenCalledWith("Network connection timeout");
    });

    // CRITICAL: EmailJS must NEVER be called when backend submission fails
    expect(emailSpy).toHaveBeenCalledTimes(0);

    // Verify submit button is re-enabled and not stuck in disabled loading state
    await waitFor(() => {
      expect(submitBtn).not.toBeDisabled();
      expect(screen.getByText("Request Free Quote")).toBeInTheDocument();
    });
  });

  it("4. Prevents duplicate submissions and blocks repeated clicks while submission is in progress", async () => {
    let resolveApiPromise: (value: any) => void;
    const delayedPromise = new Promise((resolve) => {
      resolveApiPromise = resolve;
    });

    const postSpy = vi.spyOn(api, "post").mockImplementation(() => delayedPromise);
    const emailSpy = vi.spyOn(emailService, "sendQuoteEnquiryEmail").mockResolvedValue({ success: true });

    render(<FreeQuoteModal />);

    act(() => {
      openFreeQuoteModal();
    });

    await waitFor(() => {
      expect(screen.getByText("Request a Custom Solar Estimate")).toBeInTheDocument();
    });

    fillRequiredFields();

    const submitBtn = screen.getByRole("button", { name: /Request Free Quote/i });

    // Initial click
    fireEvent.click(submitBtn);
    expect(postSpy).toHaveBeenCalledTimes(1);

    // Repeated rapid clicks while request is pending
    fireEvent.click(submitBtn);
    fireEvent.click(submitBtn);
    fireEvent.click(submitBtn);

    // Assert that subsequent clicks were blocked and post was called strictly ONCE
    expect(postSpy).toHaveBeenCalledTimes(1);

    // Verify button shows loading state and is disabled
    expect(submitBtn).toBeDisabled();
    expect(screen.getByText(/Requesting Quote.../i)).toBeInTheDocument();

    // Now resolve the promise
    act(() => {
      resolveApiPromise!({ quoteNumber: "SSR-TEST-BLOCK" });
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
      expect(emailSpy).toHaveBeenCalledTimes(1);
    });
  });

  it("5. EmailJS failure does NOT create a second quotation and informs user that quote was saved", async () => {
    const postSpy = vi.spyOn(api, "post").mockResolvedValue({
      quoteNumber: "SSR-TEST-EMAIL-FAIL",
    });

    const emailSpy = vi.spyOn(emailService, "sendQuoteEnquiryEmail").mockResolvedValue({
      success: false,
      error: "EmailJS delivery failed",
    });

    render(<FreeQuoteModal />);

    act(() => {
      openFreeQuoteModal();
    });

    await waitFor(() => {
      expect(screen.getByText("Request a Custom Solar Estimate")).toBeInTheDocument();
    });

    fillRequiredFields();

    const submitBtn = screen.getByRole("button", { name: /Request Free Quote/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      // Backend request MUST be called only once
      expect(postSpy).toHaveBeenCalledTimes(1);
      // EmailJS was attempted
      expect(emailSpy).toHaveBeenCalledTimes(1);
      // Success toast for quote reference
      expect(toast.success).toHaveBeenCalledWith(
        "Quote request received successfully!",
        expect.objectContaining({ description: "Reference Code: SSR-TEST-EMAIL-FAIL" })
      );
      // Clear error message informing that email notification failed
      expect(toast.error).toHaveBeenCalledWith(
        "Quote was saved, but the email notification to our team could not be sent."
      );
    });
  });

  it("6. Missing EmailJS configuration is handled gracefully without crashing quotation flow", async () => {
    const postSpy = vi.spyOn(api, "post").mockResolvedValue({
      quoteNumber: "SSR-TEST-UNCONFIGURED",
    });

    const emailSpy = vi.spyOn(emailService, "sendQuoteEnquiryEmail").mockResolvedValue({
      success: false,
      skipped: true,
      error: "Missing EmailJS configuration",
    });

    render(<FreeQuoteModal />);

    act(() => {
      openFreeQuoteModal();
    });

    await waitFor(() => {
      expect(screen.getByText("Request a Custom Solar Estimate")).toBeInTheDocument();
    });

    fillRequiredFields();

    const submitBtn = screen.getByRole("button", { name: /Request Free Quote/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(postSpy).toHaveBeenCalledTimes(1);
      expect(emailSpy).toHaveBeenCalledTimes(1);
      expect(toast.success).toHaveBeenCalledWith(
        "Quote request received successfully!",
        expect.objectContaining({ description: "Reference Code: SSR-TEST-UNCONFIGURED" })
      );
    });
  });

  it("7. Validates mobile number format before submitting to backend or EmailJS", async () => {
    const postSpy = vi.spyOn(api, "post");
    const emailSpy = vi.spyOn(emailService, "sendQuoteEnquiryEmail");

    render(<FreeQuoteModal />);

    act(() => {
      openFreeQuoteModal();
    });

    await waitFor(() => {
      expect(screen.getByText("Request a Custom Solar Estimate")).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/Full Name/i);
    const mobileInput = screen.getByLabelText(/Mobile Number/i);
    const addressInput = screen.getByLabelText(/Complete Address/i);

    fireEvent.change(nameInput, { target: { value: "Anurag Sharma" } });
    fireEvent.change(mobileInput, { target: { value: "12345" } }); // Invalid mobile
    fireEvent.change(addressInput, { target: { value: "Mau, Uttar Pradesh" } });

    const submitBtn = screen.getByRole("button", { name: /Request Free Quote/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Please enter a valid 10-digit Indian mobile number");
      expect(postSpy).not.toHaveBeenCalled();
      expect(emailSpy).not.toHaveBeenCalled();
    });
  });

  it("8. The Solar System Type field is visible with On-Grid Solar and Hybrid Solar options", async () => {
    render(<FreeQuoteModal />);

    act(() => {
      openFreeQuoteModal();
    });

    await waitFor(() => {
      expect(screen.getByText("Request a Custom Solar Estimate")).toBeInTheDocument();
    });

    const solarTypeSelect = screen.getByLabelText(/Solar System Type/i);
    expect(solarTypeSelect).toBeInTheDocument();

    const onGridOption = screen.getByRole("option", { name: "On-Grid Solar" });
    const hybridOption = screen.getByRole("option", { name: "Hybrid Solar" });

    expect(onGridOption).toBeInTheDocument();
    expect(hybridOption).toBeInTheDocument();
    expect(solarTypeSelect).toHaveValue("On-Grid Solar");
  });

  it("9. On-Grid Solar can be selected and submitted to backend and EmailJS", async () => {
    const postSpy = vi.spyOn(api, "post").mockResolvedValue({
      quoteNumber: "SSR-ONGRID-001",
    });
    const emailSpy = vi.spyOn(emailService, "sendQuoteEnquiryEmail").mockResolvedValue({
      success: true,
    });

    render(<FreeQuoteModal />);

    act(() => {
      openFreeQuoteModal();
    });

    await waitFor(() => {
      expect(screen.getByText("Request a Custom Solar Estimate")).toBeInTheDocument();
    });

    fillRequiredFields();

    const solarTypeSelect = screen.getByLabelText(/Solar System Type/i);
    fireEvent.change(solarTypeSelect, { target: { value: "On-Grid Solar" } });
    expect(solarTypeSelect).toHaveValue("On-Grid Solar");

    const submitBtn = screen.getByRole("button", { name: /Request Free Quote/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(postSpy).toHaveBeenCalledTimes(1);
    });

    expect(postSpy).toHaveBeenCalledWith(
      "/api/v1/quotations",
      expect.objectContaining({
        fullName: "Anurag Sharma",
        phone: "9876543210",
        address: "Mau, Uttar Pradesh",
        solarType: "On-Grid Solar",
      })
    );

    await waitFor(() => {
      expect(emailSpy).toHaveBeenCalledTimes(1);
      expect(emailSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          client_name: "Anurag Sharma",
          solar_type: "On-Grid Solar",
        })
      );
    });
  });

  it("10. Hybrid Solar can be selected and submitted to backend and EmailJS without being silently reverted", async () => {
    const postSpy = vi.spyOn(api, "post").mockResolvedValue({
      quoteNumber: "SSR-HYBRID-002",
    });
    const emailSpy = vi.spyOn(emailService, "sendQuoteEnquiryEmail").mockResolvedValue({
      success: true,
    });

    render(<FreeQuoteModal />);

    act(() => {
      openFreeQuoteModal();
    });

    await waitFor(() => {
      expect(screen.getByText("Request a Custom Solar Estimate")).toBeInTheDocument();
    });

    fillRequiredFields();

    const solarTypeSelect = screen.getByLabelText(/Solar System Type/i);
    fireEvent.change(solarTypeSelect, { target: { value: "Hybrid Solar" } });
    expect(solarTypeSelect).toHaveValue("Hybrid Solar");

    const submitBtn = screen.getByRole("button", { name: /Request Free Quote/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(postSpy).toHaveBeenCalledTimes(1);
    });

    // Verifying value reaches backend as "Hybrid Solar" and is not silently reverted to "On-Grid Solar"
    expect(postSpy).toHaveBeenCalledWith(
      "/api/v1/quotations",
      expect.objectContaining({
        fullName: "Anurag Sharma",
        phone: "9876543210",
        address: "Mau, Uttar Pradesh",
        solarType: "Hybrid Solar",
      })
    );
    expect(postSpy).not.toHaveBeenCalledWith(
      "/api/v1/quotations",
      expect.objectContaining({
        solarType: "On-Grid Solar",
      })
    );

    // Verifying value reaches EmailJS as "Hybrid Solar" and is not silently reverted to "On-Grid Solar"
    await waitFor(() => {
      expect(emailSpy).toHaveBeenCalledTimes(1);
      expect(emailSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          client_name: "Anurag Sharma",
          solar_type: "Hybrid Solar",
        })
      );
      expect(emailSpy).not.toHaveBeenCalledWith(
        expect.objectContaining({
          solar_type: "On-Grid Solar",
        })
      );
    });
  });
});
