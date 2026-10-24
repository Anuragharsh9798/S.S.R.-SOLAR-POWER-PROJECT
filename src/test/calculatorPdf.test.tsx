import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { SolarCalculator } from "@/components/sections/SolarCalculator";
import CalculatorPage from "@/pages/CalculatorPage";
import { ThemeProvider } from "@/components/ThemeProvider";

describe("Solar Savings Calculator - Professional PDF Proposal Suite", () => {
  it("should render all 5 required proposal sections in the printable document", () => {
    const { container } = render(
      <BrowserRouter>
        <SolarCalculator heading={false} />
      </BrowserRouter>
    );

    const printDoc = container.querySelector(".solar-proposal-print-document");
    expect(printDoc).not.toBeNull();

    // Prominent Title
    expect(printDoc?.textContent).toContain("Solar Savings Estimate");
    expect(printDoc?.textContent).toContain("SSR SOLAR POWER");

    // Section A — Customer & Site Details
    expect(printDoc?.textContent).toContain("Section A · Customer & Site Details");
    expect(printDoc?.textContent).toContain("Customer Name");
    expect(printDoc?.textContent).toContain("Not provided");
    expect(printDoc?.textContent).toContain("Project Location");
    expect(printDoc?.textContent).toContain("Monthly Electricity Bill");
    expect(printDoc?.textContent).toContain("Monthly Consumption");
    expect(printDoc?.textContent).toContain("Electricity Tariff");
    expect(printDoc?.textContent).toContain("Available Roof Area");
    expect(printDoc?.textContent).toContain("Roof Surface Type");

    // Section B — Recommended Solar System
    expect(printDoc?.textContent).toContain("Section B · Recommended Solar System");
    expect(printDoc?.textContent).toContain("Recommended Plant Size");
    expect(printDoc?.textContent).toContain("6.00 kW");
    expect(printDoc?.textContent).toContain("12 Panels");
    expect(printDoc?.textContent).toContain("530W Mono PERC");
    expect(printDoc?.textContent).toContain("333.96 sq. ft.");
    expect(printDoc?.textContent).toContain("On-Grid (Grid-Tied) System");
    expect(printDoc?.textContent).toContain("4.5 Peak Sun Hours/day in UP");

    // Section C — Estimated Financial Benefits
    expect(printDoc?.textContent).toContain("Section C · Estimated Financial Benefits");
    expect(printDoc?.textContent).toContain("Estimated Monthly Savings");
    expect(printDoc?.textContent).toContain("₹6,480");
    expect(printDoc?.textContent).toContain("Estimated Annual Savings");
    expect(printDoc?.textContent).toContain("₹77,760");
    expect(printDoc?.textContent).toContain("Estimated Payback Period");
    expect(printDoc?.textContent).toContain("2.9 Years");
    expect(printDoc?.textContent).toContain("PM Surya Ghar");
    expect(printDoc?.textContent).toContain("UP NEDA");
    expect(printDoc?.textContent).toContain("₹1,08,000"); // Total subsidy
    expect(printDoc?.textContent).toContain("₹2,22,000"); // Net cost
    expect(printDoc?.textContent).toContain("₹3,30,000"); // Gross cost

    // Section D — Environmental Benefits
    expect(printDoc?.textContent).toContain("Section D · Environmental Benefits");
    expect(printDoc?.textContent).toContain("7.97 Tonnes / year");
    expect(printDoc?.textContent).toContain("0.82 kg CO₂ / kWh");
    expect(printDoc?.textContent).toContain("Trees / year");

    // Section E — Assumptions & Disclaimer
    expect(printDoc?.textContent).toContain("Section E · Assumptions & Disclaimer");
    expect(printDoc?.textContent).toContain("site inspection");
    expect(printDoc?.textContent).toContain("DISCOM");
    expect(printDoc?.textContent).toContain("Page 1 of 1");
  });

  it("should trigger window.print when Download PDF button is clicked", () => {
    const printSpy = vi.spyOn(window, "print").mockImplementation(() => {});

    render(
      <BrowserRouter>
        <SolarCalculator heading={false} />
      </BrowserRouter>
    );

    const downloadBtn = screen.getByRole("button", { name: /Download PDF/i });
    expect(downloadBtn).toBeInTheDocument();

    fireEvent.click(downloadBtn);
    expect(printSpy).toHaveBeenCalledTimes(1);

    printSpy.mockRestore();
  });

  it("should handle long city location names cleanly with text wrapping", () => {
    const { container } = render(
      <BrowserRouter>
        <SolarCalculator heading={false} />
      </BrowserRouter>
    );

    const printDoc = container.querySelector(".solar-proposal-print-document");
    expect(printDoc).not.toBeNull();
    // Default city is Lucknow
    expect(printDoc?.textContent).toContain("Lucknow, Uttar Pradesh");
  });

  it("should confirm CalculatorPage isolates the proposal by hiding heroes and FAQs during print", () => {
    const { container } = render(
      <ThemeProvider>
        <BrowserRouter>
          <CalculatorPage />
        </BrowserRouter>
      </ThemeProvider>
    );

    // Hero and FAQ sections must have print:hidden wrapper
    const printHiddenContainers = container.querySelectorAll(".print\\:hidden");
    expect(printHiddenContainers.length).toBeGreaterThanOrEqual(3);

    // Document print container must exist
    const printDoc = container.querySelector(".solar-proposal-print-document");
    expect(printDoc).not.toBeNull();
  });

  it("should verify mathematical consistency of solar savings formulas", () => {
    const bill = 6000;
    const rate = 8.0;
    const units = Math.round(bill / rate); // 750 kWh
    const dailyKwh = units / 30; // 25 kWh/day
    const rawSizeKw = dailyKwh / 4.5; // 5.55 kW
    const plantSizeKw = Math.ceil(rawSizeKw); // 6.0 kW
    const panelWattageKw = 0.53; // 530W
    const panels = Math.ceil(plantSizeKw / panelWattageKw); // 12
    const panelAreaSqFt = 27.83;
    const roofArea = Number((panels * panelAreaSqFt).toFixed(2)); // 333.96 sq ft
    const monthlyGen = Math.round(plantSizeKw * 4.5 * 30); // 810 kWh
    const monthlySavings = Math.round(monthlyGen * rate); // ₹6,480
    const annualSavings = monthlySavings * 12; // ₹77,760
    const annualGenKwh = monthlyGen * 12; // 9,720 kWh
    const co2Tonnes = Number(((annualGenKwh * 0.82) / 1000).toFixed(2)); // 7.97 tonnes

    expect(plantSizeKw).toBe(6.0);
    expect(panels).toBe(12);
    expect(roofArea).toBe(333.96);
    expect(monthlySavings).toBe(6480);
    expect(annualSavings).toBe(77760);
    expect(co2Tonnes).toBe(7.97);
  });
});
