import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Globe,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Layout } from "@/components/Layout";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/PageHero";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { company } from "@/data/site";
import { api } from "@/lib/api";

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [responseInfo, setResponseInfo] = useState<any | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side Validation
    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!formData.message.trim()) {
      toast.error("Please enter your message.");
      return;
    }

    // Duplicate-submit prevention
    if (isSubmitting) return;

    setIsSubmitting(true);
    setApiError(null);

    const payload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone?.trim() || undefined,
      subject: formData.subject?.trim() || undefined,
      message: formData.message.trim(),
    };

    try {
      const res = await api.post<any>("/api/v1/contact", payload);
      setResponseInfo(res);
      setSubmitted(true);
      toast.success("Message sent successfully!", {
        description: "Our customer support team will respond within 24 hours.",
      });
    } catch (err: any) {
      console.error("Contact Form API Error:", err);
      
      // Handle Rate Limit (HTTP 429) & Validation Errors
      let errorMsg = "Failed to send message. Please try again.";
      if (err.statusCode === 429) {
        errorMsg = "Rate limit exceeded (Max 5 submissions per minute). Please wait 1 minute and try again.";
      } else if (err.message) {
        errorMsg = err.message;
      }

      setApiError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Seo
        title="Contact Us | SSR Solar Power Customer Support"
        description="Get in touch with SSR Solar Power in Mau, Uttar Pradesh. Ask about solar rooftop installation, DISCOM net metering, or subsidies."
        path="/contact"
      />

      <PageHero
        eyebrow="Contact Us"
        title="We're here to help power your solar journey"
        description="Have questions about plant sizing, DISCOM net metering, or PM Surya Ghar subsidies? Connect with our solar engineers."
        image="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
      />

      <section className="section py-16">
        <div className="container-wide">
          <div className="grid gap-10 lg:grid-cols-12 items-start">
            {/* Left Column: Direct Contact Info & Map */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
                  <Sparkles className="h-3.5 w-3.5" /> Direct Support
                </span>
                <h2 className="mt-3 text-2xl sm:text-3xl font-bold font-display text-foreground">
                  Get in touch with <span className="text-gradient">our team</span>
                </h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Visit our regional office in Mau, call our solar helpline, or submit the form to receive a prompt response.
                </p>
              </div>

              <div className="space-y-4">
                {/* Office Address */}
                <div className="flex items-start gap-4 rounded-2xl border border-border/80 bg-card p-5 shadow-soft">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Regional Headquarters</h4>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {company.address}
                    </p>
                  </div>
                </div>

                {/* Phone & Working Hours */}
                <div className="flex items-start gap-4 rounded-2xl border border-border/80 bg-card p-5 shadow-soft">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Solar Helpline & Phone</h4>
                    <a
                      href={`tel:${company.phone}`}
                      className="mt-1 block text-xs font-semibold text-primary hover:underline"
                    >
                      {company.phone}
                    </a>
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3 text-amber-500" /> Mon - Sat: 9:00 AM - 7:00 PM IST
                    </p>
                  </div>
                </div>

                {/* Email Support */}
                <div className="flex items-start gap-4 rounded-2xl border border-border/80 bg-card p-5 shadow-soft">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Email Support</h4>
                    <a
                      href={`mailto:${company.email}`}
                      className="mt-1 block text-xs font-semibold text-primary hover:underline"
                    >
                      {company.email}
                    </a>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      24-hour response guarantee
                    </p>
                  </div>
                </div>
              </div>

              {/* Embedded Google Maps Container */}
              <div className="overflow-hidden rounded-3xl border border-border/80 shadow-card h-52 relative group">
                <iframe
                  title="SSR Solar Power Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57545.92211566838!2d83.52355480572833!3d25.945899983173775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3991f868ad1104e7%3A0x6335198032c25bc!2sMau%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="transition-all duration-500 group-hover:scale-105"
                />
                <a
                  href="https://maps.google.com/?q=Kutubpur,+Bahadurpur,+Mau,+Uttar+Pradesh+221602"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 rounded-full bg-black/80 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur hover:bg-primary hover:text-slate-950 transition-all flex items-center gap-1.5 shadow-lg"
                >
                  <Globe className="h-3.5 w-3.5" /> Open Google Maps
                </a>
              </div>
            </div>

            {/* Right Column: Contact Form Card */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-border/80 bg-card p-6 md:p-10 shadow-card relative">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-foreground">
                    Send Us a <span className="text-gradient">Message</span>
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Fill in the form below and our customer support engineer will get back to you promptly.
                  </p>
                </div>

                {submitted ? (
                  <div className="py-12 text-center space-y-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 p-8">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h4 className="text-xl font-bold text-foreground">Message Sent Successfully!</h4>
                    <p className="max-w-md mx-auto text-xs text-muted-foreground leading-relaxed">
                      {responseInfo?.message ||
                        "Thank you for contacting SSR Solar Power. Your message has been received by our customer support team."}
                    </p>
                    {responseInfo?.contactId && (
                      <div className="inline-block rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-bold text-emerald-400">
                        Reference Ticket ID: {responseInfo.contactId}
                      </div>
                    )}
                    <div className="pt-3">
                      <Button
                        onClick={() => {
                          setSubmitted(false);
                          setResponseInfo(null);
                          setFormData({
                            fullName: "",
                            email: "",
                            phone: "",
                            subject: "",
                            message: "",
                          });
                        }}
                        variant="outline"
                        className="rounded-full px-6 text-xs font-semibold"
                      >
                        Send Another Message
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {apiError && (
                      <div className="flex items-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-xs text-destructive">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{apiError}</span>
                      </div>
                    )}

                    <div className="grid gap-5 md:grid-cols-2">
                      {/* Full Name */}
                      <div className="space-y-2">
                        <Label htmlFor="contact-fullName" className="text-xs font-bold text-foreground">
                          Full Name *
                        </Label>
                        <Input
                          id="contact-fullName"
                          type="text"
                          required
                          placeholder="e.g., Rajesh Sharma"
                          value={formData.fullName}
                          onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                          className="rounded-xl border-border bg-muted/40 text-sm"
                        />
                      </div>

                      {/* Email Address */}
                      <div className="space-y-2">
                        <Label htmlFor="contact-email" className="text-xs font-bold text-foreground">
                          Email Address *
                        </Label>
                        <Input
                          id="contact-email"
                          type="email"
                          required
                          placeholder="rajesh@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                          className="rounded-xl border-border bg-muted/40 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      {/* Mobile Phone */}
                      <div className="space-y-2">
                        <Label htmlFor="contact-phone" className="text-xs font-bold text-foreground">
                          Mobile Number (Optional)
                        </Label>
                        <Input
                          id="contact-phone"
                          type="tel"
                          placeholder="10-digit mobile number"
                          value={formData.phone}
                          onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                          className="rounded-xl border-border bg-muted/40 text-sm"
                        />
                      </div>

                      {/* Subject */}
                      <div className="space-y-2">
                        <Label htmlFor="contact-subject" className="text-xs font-bold text-foreground">
                          Subject (Optional)
                        </Label>
                        <Input
                          id="contact-subject"
                          type="text"
                          placeholder="Rooftop inquiry, Maintenance..."
                          value={formData.subject}
                          onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                          className="rounded-xl border-border bg-muted/40 text-sm"
                        />
                      </div>
                    </div>

                    {/* Message Textarea */}
                    <div className="space-y-2">
                      <Label htmlFor="contact-message" className="text-xs font-bold text-foreground">
                        Your Message *
                      </Label>
                      <Textarea
                        id="contact-message"
                        required
                        rows={4}
                        placeholder="Tell us about your rooftop area, electricity bill, or any specific questions..."
                        value={formData.message}
                        onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                        className="rounded-xl border-border bg-muted/40 text-sm"
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-xl bg-gradient-brand h-12 text-sm font-bold text-primary-foreground shadow-glow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" /> Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </Layout>
  );
};

export default Contact;
