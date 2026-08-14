import { motion } from "framer-motion";
import { Clock, Mail, MapPin, Phone, ShieldAlert, Upload } from "lucide-react";
import { toast } from "sonner";
import { company } from "@/data/site";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MotionSection } from "@/components/motion";

export const ContactSection = ({ heading = true }: { heading?: boolean }) => (
  <MotionSection animation="fadeUp" className="section">
    <div className="container-wide">
      {heading && (
        <SectionHeading
          eyebrow="Contact Us"
          title={<>Get a free rooftop <span className="text-gradient">assessment</span></>}
          description="Share your latest bill and our engineers will revert within one working day with a sized proposal."
        />
      )}

      <div className="mt-14 grid gap-7 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.form
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Request received — our team will call you shortly.");
            (e.target as HTMLFormElement).reset();
          }}
          className="group contact-card-glow relative transition-all duration-500"
        >
          <div className="relative h-full w-full overflow-hidden rounded-3xl p-6 md:p-8 transition-all duration-500 contact-card-gradient-border">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" required placeholder="Your full name" className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" required placeholder="+91 00000 00000" className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required placeholder="you@email.com" className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" required placeholder="Mau" className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="monthly">Monthly Bill (₹)</Label>
                <Input id="monthly" type="number" min={0} placeholder="6000" className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="upload">Upload Electricity Bill</Label>
                <label
                  htmlFor="upload"
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border bg-muted/40 px-4 py-4 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <Upload className="h-4 w-4" />
                  PDF, JPG or PNG up to 10 MB
                </label>
                <Input id="upload" type="file" accept=".pdf,.jpg,.jpeg,.png" className="sr-only" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" rows={4} placeholder="Tell us about your roof, load and timelines…" className="rounded-xl" />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button type="submit" className="btn-premium h-12 rounded-full bg-gradient-brand px-7 font-semibold text-primary-foreground shadow-glow">
                Request Quote
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-full px-7 font-semibold"
                onClick={() => toast.success("Site visit request noted — we'll confirm a slot.")}
              >
                Schedule Site Visit
              </Button>
            </div>
          </div>
        </motion.form>

        <div className="space-y-6">
          <div className="overflow-hidden rounded-3xl border shadow-soft h-64 relative group/map">
            <iframe
              title="SSR Solar Power Office Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57545.92211566838!2d83.52355480572833!3d25.945899983173775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3991f868ad1104e7%3A0x6335198032c25bc!2sMau%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "grayscale(0.3) opacity(0.9)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="transition-all duration-500 group-hover/map:scale-105 group-hover/map:filter-none"
            />
          </div>

          <div className="group contact-card-glow relative transition-all duration-500">
            <div className="relative h-full w-full overflow-hidden rounded-3xl p-6 space-y-4 text-sm transition-all duration-500 contact-card-gradient-border">
              <div className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p className="text-muted-foreground">{company.address}</p>
              </div>
              <div className="flex gap-3">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <a href={`tel:${company.phone}`} className="text-muted-foreground hover:text-primary">{company.phone}</a>
              </div>
              <div className="flex gap-3">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <a href={`mailto:${company.email}`} className="text-muted-foreground hover:text-primary">{company.email}</a>
              </div>
              <div className="flex gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p className="text-muted-foreground">{company.hours}</p>
              </div>
              <div className="flex gap-3 rounded-2xl bg-destructive/10 p-3">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                <p className="text-muted-foreground">
                  Emergency support: <a href={`tel:${company.emergency}`} className="font-semibold text-destructive">{company.emergency}</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MotionSection>
);
