import { describe, it, expect } from "vitest";
import { fetchFullSearchIndex, searchItems } from "@/lib/searchData";

describe("SSR Solar Power Search Engine", () => {
  it("should index comprehensive public website content", async () => {
    const items = await fetchFullSearchIndex();
    expect(items.length).toBeGreaterThan(20);

    // Verify all items have id, title, description, category, and href
    for (const item of items) {
      expect(item.id).toBeTruthy();
      expect(item.title).toBeTruthy();
      expect(item.description).toBeTruthy();
      expect(item.category).toBeTruthy();
      expect(item.href).toMatch(/^\/|http/);
    }
  });

  it("should return high relevance matches for 'solar'", async () => {
    const items = await fetchFullSearchIndex();
    const results = searchItems(items, "solar");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.title.toLowerCase().includes("solar"))).toBe(true);
  });

  it("should return panels and products for 'solar panel'", async () => {
    const items = await fetchFullSearchIndex();
    const results = searchItems(items, "solar panel");
    expect(results.length).toBeGreaterThan(0);
    const topResult = results[0];
    expect(
      topResult.title.toLowerCase().includes("solar panel") ||
      topResult.tags.some((t) => t.includes("solar panel"))
    ).toBe(true);
    expect(topResult.href).toContain("/products");
  });

  it("should return PM Surya Ghar Yojana information for 'subsidy'", async () => {
    const items = await fetchFullSearchIndex();
    const results = searchItems(items, "subsidy");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.category === "Subsidy" || r.title.toLowerCase().includes("subsidy"))).toBe(true);
    expect(results.some((r) => r.href.includes("/subsidy"))).toBe(true);
  });

  it("should return residential solutions and services for 'residential'", async () => {
    const items = await fetchFullSearchIndex();
    const results = searchItems(items, "residential");
    expect(results.length).toBeGreaterThan(0);
    expect(
      results.some((r) => r.title.toLowerCase().includes("residential") || r.tags.includes("residential"))
    ).toBe(true);
  });

  it("should return commercial solutions for 'commercial'", async () => {
    const items = await fetchFullSearchIndex();
    const results = searchItems(items, "commercial");
    expect(results.length).toBeGreaterThan(0);
    expect(
      results.some((r) => r.title.toLowerCase().includes("commercial") || r.tags.includes("commercial"))
    ).toBe(true);
  });

  it("should find specific project by name: 'Green Meadows'", async () => {
    const items = await fetchFullSearchIndex();
    const results = searchItems(items, "Green Meadows");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toContain("Green Meadows");
    expect(results[0].category).toBe("Projects");
    expect(results[0].href).toBe("/projects");
  });

  it("should find blog articles by technical keyword: 'TOPCon'", async () => {
    const items = await fetchFullSearchIndex();
    const results = searchItems(items, "TOPCon");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toContain("TOPCon");
    expect(results[0].category).toBe("Blog");
    expect(results[0].href).toContain("/blog/");
  });

  it("should return empty results for invalid or non-existent keyword: 'xyz123random'", async () => {
    const items = await fetchFullSearchIndex();
    const results = searchItems(items, "xyz123random");
    expect(results).toHaveLength(0);
  });

  it("should support case-insensitive and partial search matching", async () => {
    const items = await fetchFullSearchIndex();
    const lowerResults = searchItems(items, "inverter");
    const upperResults = searchItems(items, "INVERTER");
    const partialResults = searchItems(items, "invert");

    expect(lowerResults.length).toBeGreaterThan(0);
    expect(upperResults.length).toBe(lowerResults.length);
    expect(partialResults.length).toBeGreaterThan(0);
  });

  it("should filter results accurately by Category", async () => {
    const items = await fetchFullSearchIndex();
    const blogOnly = searchItems(items, "solar", "Blog");
    for (const item of blogOnly) {
      expect(item.category).toBe("Blog");
    }

    const productsOnly = searchItems(items, "solar", "Products");
    for (const item of productsOnly) {
      expect(item.category).toBe("Products");
    }
  });
});
