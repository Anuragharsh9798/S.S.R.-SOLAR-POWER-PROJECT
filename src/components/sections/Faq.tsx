import { faqs } from "@/data/site";
import { SectionHeading } from "@/components/SectionHeading";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MotionSection } from "@/components/motion";

export const FaqSection = ({ heading = true }: { heading?: boolean }) => (
  <MotionSection animation="fadeRight" className="section">
    <div className="container-narrow">
      {heading && (
        <SectionHeading
          eyebrow="FAQ"
          title={<>Answers before you <span className="text-gradient">commit</span></>}
          description="The questions our consultants hear most often, answered plainly."
        />
      )}

      <Accordion type="single" collapsible className="mt-12 space-y-3">
        {faqs.map((f, i) => (
          <AccordionItem
            key={f.q}
            value={`item-${i}`}
            className="rounded-2xl border bg-card px-5 shadow-soft transition-colors data-[state=open]:border-primary/40"
          >
            <AccordionTrigger className="text-left text-base font-medium hover:no-underline">{f.q}</AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </MotionSection>
);
