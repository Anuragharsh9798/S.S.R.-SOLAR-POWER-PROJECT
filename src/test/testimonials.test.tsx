import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import {
  testimonials,
  verifiedTestimonials,
  sampleTestimonialDrafts,
} from "@/data/site";
import { Testimonials } from "@/components/sections/Testimonials";

describe("SSR Solar Power - Verified Customer Reviews Suite", () => {
  it("should confirm all 9 reviews are verified with confirmed ratings and locations", () => {
    expect(verifiedTestimonials.length).toBe(9);
    expect(sampleTestimonialDrafts.length).toBe(0);
    expect(testimonials.length).toBe(9);
  });

  it("should confirm none of the previous duplicate reviewer names exist in the dataset", () => {
    const displayedNames = testimonials.map((t) => t.name.toLowerCase());
    const oldReviewerNames = [
      "rajesh kumar singh",
      "sunil rai",
      "virendra verma",
      "anil kumar yadav",
      "deepak maurya",
      "manoj tiwari",
      "satish chandra sharma",
      "rahul singh",
      "amit kumar",
      "pankaj yadav",
      "ravi verma",
      "sandeep maurya",
      "neha sharma",
      "vivek patel",
      "manoj chauhan",
      "priya singh",
      "deepak yadav",
    ];

    for (const oldName of oldReviewerNames) {
      expect(displayedNames).not.toContain(oldName);
    }
  });

  it("should confirm all 9 verified reviews have confirmed 5-star ratings and locations", () => {
    const names = verifiedTestimonials.map((d) => d.name);
    expect(names).toEqual([
      "Harish Chandra Mishra",
      "Pooja Agarwal",
      "Arvind Gupta",
      "Sunita Tripathi",
      "Vikram Singhania",
      "Meera Srivastava",
      "Rakesh Pandey",
      "Ananya Roy",
      "Pradeep Shukla",
    ]);

    for (const item of verifiedTestimonials) {
      expect(item.isVerified).toBe(true);
      expect(item.status).toBe("verified");
      expect(item.rating).toBe(5);
      expect(item.locationConfirmed).toBe(true);
      expect(typeof item.location).toBe("string");
      expect(item.location!.length).toBeGreaterThan(0);
      expect(item.quote.length).toBeGreaterThan(60);
      const sentenceCount = item.quote.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
      expect(sentenceCount).toBeGreaterThanOrEqual(2);
      expect(sentenceCount).toBeLessThanOrEqual(4);
    }
  });

  it("should confirm confirmed locations across Uttar Pradesh are present", () => {
    const locations = verifiedTestimonials.map((d) => d.location);
    expect(locations).toContain("Sodhanpur, Uttar Pradesh");
    expect(locations).toContain("Farsara Buzurg, Uttar Pradesh");
    expect(locations).toContain("Chandan Patti, Uttar Pradesh");
    expect(locations).toContain("Belthara Road, Uttar Pradesh");
    expect(locations).toContain("Itora, Uttar Pradesh");
    expect(locations).toContain("Madhuban, Uttar Pradesh");
  });

  it("should render the component cleanly with verified reviews header and zero pending text", () => {
    render(
      <BrowserRouter>
        <Testimonials />
      </BrowserRouter>
    );

    expect(screen.getByText(/Verified Customer Reviews/i)).toBeInTheDocument();
    expect(screen.queryByText(/Rating pending/i)).toBeNull();
    expect(screen.queryByText(/Location pending/i)).toBeNull();
    expect(screen.queryByText(/Sample Draft/i)).toBeNull();
  });
});
