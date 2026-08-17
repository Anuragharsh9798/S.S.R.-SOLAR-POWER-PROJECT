import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Seo } from "@/components/Seo";
import { SectionHeading } from "@/components/SectionHeading";
import { MotionSection } from "@/components/motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api } from "@/lib/api";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Gift,
  Globe,
  Heart,
  HelpCircle,
  Leaf,
  Loader2,
  MessageSquare,
  PhoneCall,
  PiggyBank,
  Send,
  Share2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Sun,
  Trophy,
  Users,
  Zap,
  AlertCircle,
} from "lucide-react";

export const ReferAndEarn = () => {
  const [formData, setFormData] = useState({
    yourName: "",
    yourMobile: "",
    friendName: "",
    friendMobile: "",
    friendCity: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [claimData, setClaimData] = useState<{
    claimNumber: string;
    status: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await api.post<any>("/api/v1/referrals", {
        referrerName: formData.yourName,
        referrerPhone: formData.yourMobile,
        friendName: formData.friendName,
        friendPhone: formData.friendMobile,
        friendCity: formData.friendCity,
      });

      if (response && response.claimNumber) {
        setClaimData({
          claimNumber: response.claimNumber,
          status: response.status || "PENDING",
        });
        toast.success("Referral Submitted Successfully!", {
          description: `Claim #${response.claimNumber} registered. Pending admin verification.`,
        });
      }
    } catch (err: any) {
      console.error("Failed to submit referral:", err);
      const errMsg = err.message || "Failed to submit referral claim. Please try again.";
      setError(errMsg);
      toast.error("Referral Submission Failed", {
        description: errMsg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setClaimData(null);
    setError(null);
    setFormData({
      yourName: "",
      yourMobile: "",
      friendName: "",
      friendMobile: "",
      friendCity: "",
    });
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      "Hi! I recommend installing solar rooftop panels with SSR Solar Power to save up to 90% on electricity bills and claim up to ₹1,08,000 government subsidy. Check them out here: " +
        window.location.origin
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <Layout>
      <Seo
        title="Refer & Earn up to ₹5,000 per Solar Installation | SSR Solar Power"
        description="Help your friends go solar and earn ₹5,000 for every successful installation! Join India's top solar champions community today."
        path="/refer-and-earn"
      />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/92 to-background" aria-hidden />
        <div className="blob -left-20 top-10 h-72 w-72 bg-primary/25" aria-hidden />
        <div className="blob -right-10 top-24 h-64 w-64 bg-amber-500/20" aria-hidden />

        <div className="container-wide relative">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-center">
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <span className="eyebrow">
                <Gift className="h-3.5 w-3.5 text-primary" /> SSR Solar Referral Rewards Program
              </span>

              <h1 className="text-4xl leading-[1.08] font-bold text-balance md:text-5xl lg:text-6xl">
                Refer & Earn up to <br />
                <span className="text-gradient">₹5,000 Cash Reward!</span>
              </h1>

              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg mx-auto lg:mx-0">
                Help your friends, family, and neighbors switch to clean solar energy and get rewarded up to ₹5,000 directly for every successful rooftop solar installation.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Button
                  onClick={() => document.getElementById("refer-form")?.scrollIntoView({ behavior: "smooth" })}
                  className="btn-premium rounded-full bg-gradient-brand px-8 h-12 font-bold text-primary-foreground shadow-glow"
                >
                  Refer Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  onClick={handleWhatsAppShare}
                  variant="outline"
                  className="rounded-full border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 px-7 h-12 font-bold"
                >
                  <Share2 className="mr-2 h-4 w-4" /> Invite via WhatsApp
                </Button>
              </div>
            </div>

            {/* Right Column: Interactive Referral Card Form */}
            <div className="lg:col-span-5" id="refer-form">
              <div className="calc-card-glow group relative transition-all duration-500">
                <div className="calc-card-gradient-border relative overflow-hidden rounded-3xl bg-card p-7 shadow-card space-y-5">
                  <div className="text-center space-y-1">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
                      <Sparkles className="h-3.5 w-3.5" /> Direct Cash Reward
                    </span>
                    <h3 className="text-2xl font-bold text-foreground">Submit Your Referral</h3>
                    <p className="text-xs text-muted-foreground">
                      Fill in your friend's details below to start earning
                    </p>
                  </div>

                  {claimData ? (
                    <div className="py-8 text-center space-y-4">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                        <CheckCircle2 className="h-8 w-8" />
                      </div>
                      <div className="space-y-1.5">
                        <span className="inline-block rounded-full bg-amber-500/10 px-3.5 py-1 text-xs font-extrabold text-amber-500 uppercase tracking-wider">
                          Status: {claimData.status}
                        </span>
                        <h4 className="text-xl font-bold text-foreground pt-1">Referral Received!</h4>
                        <div className="mx-auto inline-block rounded-xl border border-border bg-muted/60 px-4 py-2 font-mono text-sm font-bold text-primary">
                          Claim Number: {claimData.claimNumber}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
                        Referral submitted successfully. Your claim is pending admin verification.
                      </p>
                      <Button
                        onClick={resetForm}
                        variant="outline"
                        className="rounded-full px-6 font-semibold"
                      >
                        Submit Another Referral
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {error && (
                        <div className="flex items-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          <span>{error}</span>
                        </div>
                      )}

                      <div className="space-y-1">
                        <Label htmlFor="yourName" className="text-xs font-semibold text-foreground">
                          Your Name *
                        </Label>
                        <Input
                          id="yourName"
                          required
                          placeholder="e.g. Rahul Sharma"
                          value={formData.yourName}
                          onChange={(e) => setFormData({ ...formData, yourName: e.target.value })}
                          className="h-10 rounded-xl"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="yourMobile" className="text-xs font-semibold text-foreground">
                          Your Mobile Number *
                        </Label>
                        <Input
                          id="yourMobile"
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={formData.yourMobile}
                          onChange={(e) => setFormData({ ...formData, yourMobile: e.target.value })}
                          className="h-10 rounded-xl"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="friendName" className="text-xs font-semibold text-foreground">
                          Friend's Name *
                        </Label>
                        <Input
                          id="friendName"
                          required
                          placeholder="e.g. Amit Verma"
                          value={formData.friendName}
                          onChange={(e) => setFormData({ ...formData, friendName: e.target.value })}
                          className="h-10 rounded-xl"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="friendMobile" className="text-xs font-semibold text-foreground">
                          Friend's Mobile Number *
                        </Label>
                        <Input
                          id="friendMobile"
                          type="tel"
                          required
                          placeholder="+91 98765 00000"
                          value={formData.friendMobile}
                          onChange={(e) => setFormData({ ...formData, friendMobile: e.target.value })}
                          className="h-10 rounded-xl"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="friendCity" className="text-xs font-semibold text-foreground">
                          Friend's City *
                        </Label>
                        <Input
                          id="friendCity"
                          required
                          placeholder="e.g. Mau, Lucknow, Varanasi"
                          value={formData.friendCity}
                          onChange={(e) => setFormData({ ...formData, friendCity: e.target.value })}
                          className="h-10 rounded-xl"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-premium w-full h-11 rounded-full bg-gradient-brand font-semibold text-primary-foreground shadow-glow"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                          </span>
                        ) : (
                          "Submit Referral & Claim up to ₹5,000"
                        )}
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. REFERRAL PROGRAM FAQS */}
      <MotionSection animation="fadeUp" className="section">
        <div className="container-wide max-w-4xl">
          <SectionHeading
            eyebrow="Got Questions?"
            title={<>Referral Program <span className="text-gradient">FAQs</span></>}
          />

          <div className="mt-10">
            <Accordion type="single" collapsible className="w-full space-y-3">
              <AccordionItem value="item-1" className="calc-card-gradient-border relative rounded-2xl bg-card px-5 border-none shadow-soft overflow-hidden">
                <AccordionTrigger className="text-base font-semibold py-4">How does the SSR Solar referral program work?</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  Simply share your friend's contact details via the form above or send them your referral link via WhatsApp. Our solar engineers will contact them for a free site evaluation. When they install an SSR Solar rooftop system, you earn up to ₹5,000!
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="calc-card-gradient-border relative rounded-2xl bg-card px-5 border-none shadow-soft overflow-hidden">
                <AccordionTrigger className="text-base font-semibold py-4">How much can I earn per referral?</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  You earn up to ₹5,000 direct cash reward for every successful rooftop solar installation completed by your referred friends or family members.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="calc-card-gradient-border relative rounded-2xl bg-card px-5 border-none shadow-soft overflow-hidden">
                <AccordionTrigger className="text-base font-semibold py-4">Is there any limit to how many people I can refer?</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  No! There is zero cap on referrals. You can refer as many friends, neighbors, or business associates as you like and earn unlimited rewards.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="calc-card-gradient-border relative rounded-2xl bg-card px-5 border-none shadow-soft overflow-hidden">
                <AccordionTrigger className="text-base font-semibold py-4">When and how will I receive my referral reward?</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  Once your referred friend's solar system installation is commissioned, the ₹5,000 reward is transferred directly to your bank account or UPI ID within 7 business days.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </MotionSection>
    </Layout>
  );
};

export default ReferAndEarn;
