import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MpesaCheckoutModal } from "./mpesa-checkout-modal";
import {
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Receipt,
  FileSpreadsheet,
  AlertTriangle,
  Smartphone,
  ChevronDown,
  ChevronUp,
  PhoneCall,
  Calendar,
  Layers,
  X,
  Loader2,
  Check,
  Menu,
  Wrench,
  Users,
  ArrowUpRight,
  Mail,
  Send,
} from "lucide-react";

/* ─── Props ─────────────────────────────────────────────────────────── */

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onSelectPlan?: (plan: string) => void;
  onNavigateContact?: () => void;
}

/* ─── Data ──────────────────────────────────────────────────────────── */

const PRICING = [
  {
    id: "free",
    name: "Free",
    price: "0",
    period: "forever",
    units: "1–3 Units",
    description: "Core KodiTrack tools for landlords managing up to 3 rental units.",
    features: [
      "Up to 3 rental units",
      "Properties, tenants, leases and rent ledger",
      "Record payments and issue receipts",
      "Maintenance tracking and financial reports",
      "CSV exports and mobile-friendly dashboard",
    ],
    cta: "Start Free",
    popular: false,
    note: "No credit card required",
  },
  {
    id: "starter",
    name: "Starter",
    price: "500",
    period: "/mo",
    units: "Up to 15",
    description: "The same KodiTrack tools with room for a larger portfolio.",
    features: [
      "Up to 15 rental units",
      "All current features included",
      "No additional workflow restrictions",
    ],
    cta: "Choose Starter",
    popular: false,
    note: "KSh 500/month",
  },
  {
    id: "plus",
    name: "Landlord Plus",
    price: "1,000",
    period: "/mo",
    units: "Up to 50",
    description: "More capacity for landlords managing multiple properties.",
    features: [
      "Up to 50 rental units",
      "All current features included",
      "No additional workflow restrictions",
    ],
    cta: "Choose Plus",
    popular: true,
    note: "Most popular plan",
  },
  {
    id: "manager",
    name: "Property Manager",
    price: "2,500",
    period: "/mo",
    units: "Up to 200",
    description: "The highest current unit allowance for larger portfolios.",
    features: [
      "Up to 200 rental units",
      "All current features included",
      "No additional workflow restrictions",
    ],
    cta: "Choose Manager",
    popular: false,
    note: "For agencies",
  },
];

const FAQS = [
  {
    q: "Is the Free Tier really free forever?",
    a: "Yes. If you manage 1, 2, or 3 rental units, KodiTrack is completely free with no time limit. You get the full digital rent ledger, tenant management, and receipt generator.",
  },
  {
    q: "Can I use KodiTrack on my phone?",
    a: "KodiTrack is a Progressive Web App. Add it to your Android or iPhone home screen and manage properties, record M-Pesa payments, and generate receipts on the go.",
  },
  {
    q: "How does M-Pesa payment tracking work?",
    a: "Enter the payment amount and M-Pesa transaction reference code. KodiTrack reconciles the tenant's ledger, adjusts the outstanding balance, and generates a printable receipt.",
  },
  {
    q: "Is my data private from other landlords?",
    a: "KodiTrack is designed around landlord accounts. Please do not include tenant personal details or financial records in demo and contact requests.",
  },
  {
    q: "Can I export reports for my accountant?",
    a: "KodiTrack includes 1-click CSV export for rent rolls, payment ledgers, and arrears reports compatible with Excel, Google Sheets, and accounting software.",
  },
  {
    q: "How do I upgrade my plan?",
    a: "Upgrade seamlessly from your account settings. Your units, tenants, and payment history remain intact when moving to a higher tier.",
  },
];

/* ─── Component ─────────────────────────────────────────────────────── */

export function LandingPage({
  onGetStarted,
  onSignIn,
  onSelectPlan,
  onNavigateContact,
}: LandingPageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoSubmitting, setDemoSubmitting] = useState(false);
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [demoError, setDemoError] = useState<string | null>(null);
  const [demoName, setDemoName] = useState("");
  const [demoEmail, setDemoEmail] = useState("");
  const [demoPhone, setDemoPhone] = useState("");
  const [demoUnits, setDemoUnits] = useState("10");
  const [demoLocation, setDemoLocation] = useState("Nairobi");
  const [demoNotes, setDemoNotes] = useState("");
  const [checkoutPlan, setCheckoutPlan] = useState<"starter" | "plus" | "manager" | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Track scroll for header background transition
  useEffect(() => {
    const container = scrollContainerRef.current;
    const checkScroll = () => {
      const top = (container ? container.scrollTop : 0) || window.scrollY || document.documentElement.scrollTop;
      setHeaderScrolled(top > 24);
    };
    if (container) {
      container.addEventListener("scroll", checkScroll, { passive: true });
    }
    window.addEventListener("scroll", checkScroll, { passive: true });
    return () => {
      if (container) container.removeEventListener("scroll", checkScroll);
      window.removeEventListener("scroll", checkScroll);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  function handlePlanClick(planId: string) {
    if (planId === "starter" || planId === "plus" || planId === "manager") {
      setCheckoutPlan(planId);
      return;
    }
    if (onSelectPlan) onSelectPlan(planId);
    else {
      window.history.pushState(null, "", `/register?plan=${planId}`);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  }

  function goContact() {
    if (onNavigateContact) onNavigateContact();
    else {
      window.history.pushState(null, "", "/contact");
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  }

  function scrollTo(id: string) {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleDemoSubmit(e: React.FormEvent) {
    e.preventDefault();
    setDemoError(null);
    setDemoSubmitting(true);
    try {
      const res = await fetch("/api/demo-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: demoName, email: demoEmail, phone: demoPhone,
          units: parseInt(demoUnits, 10) || 5, location: demoLocation, notes: demoNotes,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "Submission failed.");
      }
      setDemoSubmitted(true);
    } catch (err) { setDemoError((err as Error).message); }
    finally { setDemoSubmitting(false); }
  }

  /* ─── NAV LINKS ───────────────────────────────────────────────── */
  const navLinks = [
    { label: "Features", action: () => scrollTo("features") },
    { label: "How It Works", action: () => scrollTo("how-it-works") },
    { label: "Pricing", action: () => scrollTo("pricing") },
    { label: "FAQ", action: () => scrollTo("faq") },
    { label: "Contact", action: () => scrollTo("contact") },
  ];

  return (
    <div ref={scrollContainerRef} className="h-full overflow-y-auto scroll-smooth" style={{ scrollPaddingTop: "4.5rem" }}>
      {/* ════════════════════════════════════════════════════════════════
          HEADER — position: sticky, transparent → solid on scroll
         ════════════════════════════════════════════════════════════════ */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          headerScrolled
            ? "bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-5 sm:px-8">
          {/* Logo */}
          <button
            type="button"
            onClick={() => scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#155e4f] text-white">
              <Building2 className="h-[18px] w-[18px]" />
            </div>
            <span className={`text-[1.125rem] font-bold tracking-[-0.02em] transition-colors duration-300 ${
              headerScrolled ? "text-stone-900" : "text-white"
            }`}>
              KodiTrack
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={link.action}
                className={`px-3.5 py-2 text-[0.8125rem] font-medium rounded-lg transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  headerScrolled
                    ? "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              type="button"
              onClick={onSignIn}
              className={`px-3.5 py-2 text-[0.8125rem] font-medium rounded-lg transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                headerScrolled
                  ? "text-stone-700 hover:text-stone-900 hover:bg-stone-100"
                  : "text-white/90 hover:text-white hover:bg-white/10"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setDemoModalOpen(true)}
              className="h-9 px-4 text-[0.8125rem] font-semibold rounded-lg bg-[#155e4f] text-white hover:bg-[#0f4a3e] transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Book a Demo
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden flex h-10 w-10 items-center justify-center rounded-lg transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              headerScrolled ? "text-stone-700 hover:bg-stone-100" : "text-white hover:bg-white/10"
            }`}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-stone-200 shadow-lg">
            <div className="px-5 py-4 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={link.action}
                  className="block w-full text-left px-3 py-2.5 text-[0.9375rem] font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-50 rounded-lg transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-3 border-t border-stone-100 mt-3 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); onSignIn(); }}
                  className="w-full py-2.5 text-[0.9375rem] font-medium text-stone-700 hover:bg-stone-50 rounded-lg transition-colors"
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); setDemoModalOpen(true); }}
                  className="w-full py-2.5 text-[0.9375rem] font-semibold text-white bg-[#155e4f] hover:bg-[#0f4a3e] rounded-lg transition-colors"
                >
                  Book a Demo
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ════════════════════════════════════════════════════════════════
          HERO — Full-width architectural photograph with editorial layout
         ════════════════════════════════════════════════════════════════ */}
      <section className="relative -mt-[4.5rem] pt-[4.5rem] bg-[#0c2e25] overflow-hidden">
        {/* Background photograph */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1920&q=85')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c2e25]/95 via-[#0c2e25]/85 to-[#0c2e25]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c2e25] via-transparent to-transparent opacity-40" />

        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28 lg:py-36">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Messaging */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[0.75rem] font-medium text-emerald-200 mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Free for 1–3 rental units — no credit card
              </div>

              <h1 className="text-[2.25rem] sm:text-[3rem] lg:text-[3.5rem] font-extrabold tracking-[-0.03em] text-white leading-[1.08] mb-5">
                Effortless Property &
                <br className="hidden sm:block" />
                Rent Management.
              </h1>

              <p className="text-[1.0625rem] sm:text-lg text-stone-300 leading-relaxed mb-8 max-w-lg">
                Track rent collections, generate instant digital receipts, monitor arrears, and handle tenant requests — without the stress or spreadsheets.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <button
                  type="button"
                  onClick={onGetStarted}
                  className="inline-flex items-center justify-center h-12 px-6 text-[0.9375rem] font-semibold rounded-xl bg-white text-[#155e4f] hover:bg-stone-100 transition-colors duration-200 shadow-lg shadow-black/10 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Start Free (1–3 Units)
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDemoModalOpen(true)}
                  className="inline-flex items-center justify-center h-12 px-6 text-[0.9375rem] font-semibold rounded-xl border border-white/20 text-white hover:bg-white/10 transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Calendar className="mr-2 h-[18px] w-[18px]" />
                  Book a Demo
                </button>
                <button
                  type="button"
                  onClick={() => scrollTo("pricing")}
                  className="inline-flex items-center justify-center h-12 px-4 text-[0.875rem] font-medium text-stone-300 hover:text-white transition-colors duration-200 outline-none"
                >
                  View Pricing →
                </button>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-[0.8125rem] text-stone-400">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-400" />Free forever for 1–3 units</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-400" />Instant digital tenant receipts</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-400" />Property and rent management in one place</span>
              </div>
            </div>

            {/* Right: Product interface preview */}
            <div className="w-full max-w-lg mx-auto lg:max-w-none mt-10 lg:mt-0">
              <div className="relative">
                {/* Browser chrome */}
                <div className="rounded-2xl border border-white/10 bg-[#111614]/90 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden">
                  {/* Window bar */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8">
                    <div className="flex gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
                      <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
                      <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="px-4 py-1 rounded-md bg-white/5 text-[0.6875rem] text-stone-400 font-mono">
                        app.koditrack.co.ke/dashboard
                      </div>
                    </div>
                  </div>

                  {/* Dashboard content */}
                  <div className="p-5 space-y-4">
                    {/* Metrics row */}
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[0.8125rem] font-semibold text-white">Sunrise Apartments</span>
                      <span className="text-[0.6875rem] text-emerald-400 font-medium">Active Portfolio</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-xl bg-white/5 border border-white/8 p-3">
                        <div className="text-[0.625rem] text-stone-400 uppercase tracking-wider font-semibold">Occupancy</div>
                        <div className="text-xl font-bold text-white mt-0.5">96%</div>
                        <div className="text-[0.6875rem] text-emerald-400 mt-0.5">15/16 units</div>
                      </div>
                      <div className="rounded-xl bg-white/5 border border-white/8 p-3">
                        <div className="text-[0.625rem] text-stone-400 uppercase tracking-wider font-semibold">Collected</div>
                        <div className="text-xl font-bold text-white mt-0.5">KSh 745k</div>
                        <div className="text-[0.6875rem] text-stone-400 mt-0.5">This cycle</div>
                      </div>
                      <div className="rounded-xl bg-white/5 border border-white/8 p-3">
                        <div className="text-[0.625rem] text-stone-400 uppercase tracking-wider font-semibold">Arrears</div>
                        <div className="text-xl font-bold text-amber-300 mt-0.5">KSh 45k</div>
                        <div className="text-[0.6875rem] text-stone-400 mt-0.5">1 pending</div>
                      </div>
                    </div>

                    {/* Transactions */}
                    <div className="space-y-2">
                      <div className="text-[0.6875rem] text-stone-400 font-semibold uppercase tracking-wider">Recent Collections</div>
                      {[
                        { unit: "Unit 2A", tenant: "James Mwangi", amount: "55,000", ref: "Payment Reconciled", status: "Paid" },
                        { unit: "Unit 1B", tenant: "Sarah Atieno", amount: "45,000", ref: "Payment Reconciled", status: "Paid" },
                        { unit: "Unit 4C", tenant: "Grace Wanjiku", amount: "45,000", ref: "Due 5th", status: "Partial" },
                      ].map((tx) => (
                        <div key={tx.unit} className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.03] border border-white/5">
                          <div>
                            <div className="text-[0.8125rem] font-medium text-white">{tx.unit} · {tx.tenant}</div>
                            <div className="text-[0.6875rem] text-stone-400">KSh {tx.amount} · {tx.ref}</div>
                          </div>
                          <span className={`text-[0.625rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            tx.status === "Paid"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}>{tx.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          PROPERTY TYPES — Visual banner
         ════════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-stone-50 border-b border-stone-200/60">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="text-center mb-12">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-[#155e4f] mb-2">Works for every setup</p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-stone-900">
              From single rentals to multi-building portfolios
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80", title: "Apartment Blocks", desc: "Multi-story flats and apartments with unit-by-unit leases, utility billing, and automatic late fees." },
              { img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80", title: "Villas & Townhouses", desc: "Single family rentals, townhouses, and gated estate developments with individual tenant agreements." },
              { img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80", title: "Mixed Portfolios", desc: "Residential and commercial rental spaces managed under a single unified landlord account." },
            ].map((card) => (
              <div key={card.title} className="group rounded-xl overflow-hidden bg-white border border-stone-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="overflow-hidden h-44">
                  <img src={card.img} alt={card.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                </div>
                <div className="p-5">
                  <h3 className="text-[0.9375rem] font-bold text-stone-900">{card.title}</h3>
                  <p className="text-[0.8125rem] text-stone-500 mt-1 leading-relaxed">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          FEATURES — Alternating layout for visual interest
         ════════════════════════════════════════════════════════════════ */}
      <section id="features" className="py-20 sm:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-[#155e4f] mb-2">Core Capabilities</p>
            <h2 className="text-2xl sm:text-[2rem] font-bold tracking-[-0.02em] text-stone-900">
              Everything landlords need to stay in control
            </h2>
            <p className="text-[0.9375rem] text-stone-500 mt-3 leading-relaxed">
              Built for real-world rental operations — rent due dates, payment references, clear late fee policies, and maintenance coordination.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {[
              { icon: Receipt, title: "Instant Receipt Generation", desc: "Record payments with transaction references and generate official printable receipts showing tenant, unit, period, and remaining balance." },
              { icon: AlertTriangle, title: "Arrears & Late Fee Tracking", desc: "Identify unpaid or partial balances past the due date with automatic late fee calculation and clear arrears breakdowns." },
              { icon: FileSpreadsheet, title: "1-Click CSV Reports", desc: "Export monthly Rent Rolls, payment ledgers, and arrears to CSV for your accountant, tax returns, or bank reviews." },
              { icon: Layers, title: "Bulk Monthly Billing", desc: "Generate rent charges across all occupied units with one click. Idempotent billing prevents accidental double charges." },
              { icon: Wrench, title: "Maintenance Work Orders", desc: "Create, assign, and track repair requests. Manage a vendor directory of plumbers, electricians, and technicians." },
              { icon: ShieldCheck, title: "Private & Isolated Data", desc: "Every landlord's portfolio, tenants, leases, and financials are completely isolated to their authenticated account." },
            ].map((feat) => {
              const Icon = feat.icon;
              return (
                <div key={feat.title} className="group">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#155e4f]/8 text-[#155e4f] mb-4 group-hover:bg-[#155e4f]/12 transition-colors duration-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-[0.9375rem] font-bold text-stone-900 mb-1.5">{feat.title}</h3>
                  <p className="text-[0.8125rem] text-stone-500 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          HOW IT WORKS — Numbered steps
         ════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-stone-50 border-y border-stone-200/60">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-[#155e4f] mb-2">Getting Started</p>
            <h2 className="text-2xl sm:text-[2rem] font-bold tracking-[-0.02em] text-stone-900">
              Four steps from paper receipts to organized records
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Add your properties & units", desc: "Enter apartment blocks, unit numbers, monthly rent rates, and tenant contacts." },
              { step: "02", title: "Generate monthly charges", desc: "1-click billing across all occupied units on the 5th or your chosen due date." },
              { step: "03", title: "Record M-Pesa payments", desc: "Log each payment with the M-Pesa reference code. Balances update, receipts generate instantly." },
              { step: "04", title: "Track arrears & export reports", desc: "See overdue balances at a glance. Download CSV Rent Rolls for your accountant or KRA." },
            ].map((s) => (
              <div key={s.step} className="relative rounded-xl bg-white border border-stone-200 p-6 shadow-sm">
                <div className="text-[2rem] font-extrabold text-[#155e4f]/15 leading-none mb-3">{s.step}</div>
                <h3 className="text-[0.9375rem] font-bold text-stone-900 mb-2">{s.title}</h3>
                <p className="text-[0.8125rem] text-stone-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          PRICING — Clean 4-column grid
         ════════════════════════════════════════════════════════════════ */}
      <section id="pricing" className="py-20 sm:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-[#155e4f] mb-2">Transparent Pricing</p>
            <h2 className="text-2xl sm:text-[2rem] font-bold tracking-[-0.02em] text-stone-900">
              Start free. Upgrade when your portfolio grows.
            </h2>
            <p className="text-[0.9375rem] text-stone-500 mt-3">
              Start with up to 3 units at no charge and choose a higher limit as your portfolio grows.
            </p>
            <p className="text-sm text-stone-500 mt-2">
              All plans include the current feature set; paid tiers increase the unit allowance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
            {PRICING.map((tier) => (
              <div
                key={tier.id}
                className={`relative flex flex-col rounded-xl border p-6 transition-shadow duration-200 ${
                  tier.popular
                    ? "border-[#155e4f] ring-1 ring-[#155e4f] shadow-md bg-white"
                    : "border-stone-200 bg-white hover:shadow-sm"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#155e4f] px-3 py-0.5 text-[0.6875rem] font-bold text-white uppercase tracking-wider">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-bold text-stone-900">{tier.name}</h3>
                    <span className="text-[0.6875rem] font-semibold text-[#155e4f] bg-[#155e4f]/8 px-2 py-0.5 rounded-full">{tier.units}</span>
                  </div>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-[0.8125rem] text-stone-500">KSh</span>
                    <span className="text-[2rem] font-extrabold tracking-[-0.02em] text-stone-900">{tier.price}</span>
                    <span className="text-[0.8125rem] text-stone-500">{tier.period}</span>
                  </div>
                  <p className="text-[0.8125rem] text-stone-500 mt-2 leading-relaxed">{tier.description}</p>
                </div>

                <div className="flex-1 space-y-2.5 mb-6">
                  {tier.features.map((f) => (
                    <div key={f} className="flex items-start gap-2 text-[0.8125rem] text-stone-600">
                      <Check className="h-4 w-4 shrink-0 text-[#155e4f] mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handlePlanClick(tier.id)}
                  className={`w-full h-10 rounded-lg text-[0.8125rem] font-semibold transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    tier.popular
                      ? "bg-[#155e4f] text-white hover:bg-[#0f4a3e]"
                      : "bg-stone-900 text-white hover:bg-stone-800"
                  }`}
                >
                  {tier.cta}
                </button>
                <p className="text-[0.6875rem] text-center text-stone-400 mt-2">{tier.note}</p>
              </div>
            ))}
          </div>

          {/* Enterprise CTA */}
          <div className="mt-10 text-center rounded-xl border border-stone-200 bg-stone-50 p-6 max-w-xl mx-auto">
            <p className="text-[0.9375rem] font-semibold text-stone-900">Managing 200+ units?</p>
            <p className="text-[0.8125rem] text-stone-500 mt-1 mb-4">Custom enterprise plans with dedicated onboarding are available.</p>
            <div className="flex items-center justify-center gap-3">
              <button type="button" onClick={() => setDemoModalOpen(true)} className="text-[0.8125rem] font-medium text-stone-700 hover:text-stone-900 underline underline-offset-2 decoration-stone-300 hover:decoration-stone-500 transition-colors">
                Schedule a call
              </button>
              <span className="text-stone-300">|</span>
              <button type="button" onClick={goContact} className="text-[0.8125rem] font-medium text-[#155e4f] hover:underline transition-colors">
                Contact us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          FAQ — Clean accordion
         ════════════════════════════════════════════════════════════════ */}
      <section id="faq" className="py-20 sm:py-28 bg-stone-50 border-t border-stone-200/60">
        <div className="mx-auto max-w-2xl px-5 sm:px-8">
          <div className="text-center mb-12">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-[#155e4f] mb-2">FAQ</p>
            <h2 className="text-2xl sm:text-[2rem] font-bold tracking-[-0.02em] text-stone-900">
              Common questions
            </h2>
          </div>

          <div className="space-y-2">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="rounded-xl border border-stone-200 bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="flex w-full items-center justify-between p-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                >
                  <span className="text-[0.9375rem] font-semibold text-stone-900 pr-4">{faq.q}</span>
                  {openFaq === idx
                    ? <ChevronUp className="h-4 w-4 text-stone-400 shrink-0" />
                    : <ChevronDown className="h-4 w-4 text-stone-400 shrink-0" />
                  }
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-[0.8125rem] text-stone-500 leading-relaxed border-t border-stone-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          CONTACT & INQUIRIES SECTION
         ════════════════════════════════════════════════════════════════ */}
      <section id="contact" className="py-20 sm:py-28 bg-white border-t border-stone-200/60">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-[#155e4f] mb-2">Get In Touch</p>
            <h2 className="text-2xl sm:text-[2rem] font-bold tracking-[-0.02em] text-stone-900">
              Have questions or need assistance?
            </h2>
            <p className="text-[0.9375rem] text-stone-500 mt-2">
              Speak directly with our team. We are here to help you get your properties and units set up smoothly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
            <div className="md:col-span-2 rounded-2xl bg-stone-50 border border-stone-200/80 p-6 space-y-5">
              <div>
                <h3 className="text-base font-bold text-stone-900">Direct Contact</h3>
                <p className="text-xs text-stone-500 mt-1">For time-sensitive questions, contact us directly by email or phone.</p>
              </div>

              <div className="space-y-4 text-xs text-stone-600">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-[#155e4f]/10 text-[#155e4f] flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-stone-900">Email Us</div>
                    <a href="mailto:jamesbriandungu@gmail.com" className="text-[#155e4f] font-medium hover:underline">
                      jamesbriandungu@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-[#155e4f]/10 text-[#155e4f] flex items-center justify-center shrink-0">
                    <PhoneCall className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-stone-900">Direct Consultation</div>
                    <div>Schedule a 15-minute phone or WhatsApp walkthrough</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-[#155e4f]/10 text-[#155e4f] flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-stone-900">Confidentiality Guarantee</div>
                    <div>Your tenant directory and financials remain strictly private to you.</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-3 rounded-2xl bg-white border border-stone-200 p-6 shadow-sm">
              <form onSubmit={handleDemoSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactName" className="text-xs font-semibold text-stone-700">Full Name</Label>
                    <Input
                      id="contactName"
                      required
                      placeholder="e.g. Peter Njoroge"
                      value={demoName}
                      onChange={(e) => setDemoName(e.target.value)}
                      className="mt-1 text-xs"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactEmail" className="text-xs font-semibold text-stone-700">Email Address</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      required
                      placeholder="landlord@example.com"
                      value={demoEmail}
                      onChange={(e) => setDemoEmail(e.target.value)}
                      className="mt-1 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactPhone" className="text-xs font-semibold text-stone-700">Phone / WhatsApp</Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      required
                      placeholder="0712 345 678"
                      value={demoPhone}
                      onChange={(e) => setDemoPhone(e.target.value)}
                      className="mt-1 text-xs"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactUnits" className="text-xs font-semibold text-stone-700">Rental Units</Label>
                    <select
                      id="contactUnits"
                      value={demoUnits}
                      onChange={(e) => setDemoUnits(e.target.value)}
                      className="mt-1 w-full h-7 rounded-sm bg-card px-2 text-xs text-foreground shadow-edge outline-none focus:shadow-[inset_0_0_0_1px_var(--ring),0_0_0_3px_var(--brand-tint)]"
                    >
                      <option value="3">1–3 Units (Free Forever)</option>
                      <option value="15">4–15 Units (Starter)</option>
                      <option value="50">16–50 Units (Plus Pro)</option>
                      <option value="200">51–200 Units (Manager)</option>
                      <option value="500">200+ Units (Enterprise)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="contactNotes" className="text-xs font-semibold text-stone-700">Message or Inquiries</Label>
                  <textarea
                    id="contactNotes"
                    rows={3}
                    placeholder="Tell us about your rental properties or any questions you have..."
                    value={demoNotes}
                    onChange={(e) => setDemoNotes(e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-card p-3 text-xs text-foreground shadow-xs outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>

                {demoSubmitted ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                    <p className="text-xs font-bold text-emerald-900">Message Received!</p>
                    <p className="text-[11px] text-emerald-700 mt-0.5">Thank you, {demoName}. We will contact you at {demoPhone} shortly.</p>
                  </div>
                ) : (
                  <button
                    type="submit"
                    disabled={demoSubmitting}
                    className="w-full h-10 rounded-lg bg-[#155e4f] text-white font-semibold text-xs hover:bg-[#0f4a3e] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {demoSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    <span>Send Message</span>
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          FINAL CTA
         ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-24 bg-[#0c2e25] text-white">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 text-center">
          <h2 className="text-2xl sm:text-[2rem] font-bold tracking-[-0.02em] mb-4">
            Ready to organize your rental operations?
          </h2>
          <p className="text-[0.9375rem] text-stone-300 leading-relaxed mb-8 max-w-lg mx-auto">
            Start with 1–3 units free or schedule a 15-minute walkthrough with our Nairobi team.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setDemoModalOpen(true)}
              className="inline-flex items-center justify-center h-12 px-7 text-[0.9375rem] font-semibold rounded-xl bg-white text-[#155e4f] hover:bg-stone-100 transition-colors duration-200 shadow-lg shadow-black/10"
            >
              <PhoneCall className="mr-2 h-[18px] w-[18px]" />
              Book a Demo
            </button>
            <button
              type="button"
              onClick={() => handlePlanClick("free")}
              className="inline-flex items-center justify-center h-12 px-7 text-[0.9375rem] font-semibold rounded-xl border border-white/20 text-white hover:bg-white/10 transition-colors duration-200"
            >
              Start Free (1–3 Units)
            </button>
          </div>
          <p className="mt-6 text-[0.8125rem] text-stone-400">
            Questions? Email{" "}
            <a href="mailto:jamesbriandungu@gmail.com" className="text-emerald-300 hover:underline">jamesbriandungu@gmail.com</a>
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          FOOTER
         ════════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-stone-200 bg-white py-10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#155e4f] text-white">
                <Building2 className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[0.875rem] font-bold text-stone-900">KodiTrack</span>
                <span className="text-[0.75rem] text-stone-400 ml-2">Modern rental property management</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.8125rem] text-stone-500">
              <button type="button" onClick={() => scrollTo("features")} className="hover:text-stone-900 transition-colors">Features</button>
              <button type="button" onClick={() => scrollTo("pricing")} className="hover:text-stone-900 transition-colors">Pricing</button>
              <button type="button" onClick={() => scrollTo("faq")} className="hover:text-stone-900 transition-colors">FAQ</button>
              <button type="button" onClick={() => scrollTo("contact")} className="hover:text-stone-900 transition-colors">Contact</button>
              <button type="button" onClick={onSignIn} className="hover:text-stone-900 transition-colors">Sign In</button>
              <a href="mailto:jamesbriandungu@gmail.com" className="text-[#155e4f] font-medium hover:underline">jamesbriandungu@gmail.com</a>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-stone-100 text-[0.75rem] text-stone-400">
            © {new Date().getFullYear()} KodiTrack. Designed for modern landlords and property managers.
          </div>
        </div>
      </footer>

      {/* ════════════════════════════════════════════════════════════════
          DEMO MODAL
         ════════════════════════════════════════════════════════════════ */}
      {demoModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl text-stone-900 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => { setDemoModalOpen(false); setDemoSubmitted(false); }}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              <X className="h-5 w-5" />
            </button>

            {demoSubmitted ? (
              <div className="text-center py-6 space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#155e4f]/10 text-[#155e4f]">
                  <Check className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-stone-900">Demo Request Received</h3>
                <p className="text-[0.8125rem] text-stone-500 leading-relaxed">
                  Thank you, <strong className="text-stone-900">{demoName}</strong>. Your request has been saved. Please contact us directly if you need to arrange a time-sensitive demo.
                </p>
                <button
                  type="button"
                  onClick={() => { setDemoModalOpen(false); setDemoSubmitted(false); }}
                  className="w-full h-10 rounded-lg bg-[#155e4f] text-white font-semibold text-[0.8125rem] hover:bg-[#0f4a3e] transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#155e4f] text-white">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-900">Book a KodiTrack Demo</h3>
                    <p className="text-[0.6875rem] text-[#155e4f] font-semibold">15-minute walkthrough with our team</p>
                  </div>
                </div>

                {demoError && (
                  <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-2.5 text-[0.8125rem] text-red-700">{demoError}</div>
                )}

                <form onSubmit={handleDemoSubmit} className="space-y-3">
                  <div>
                    <Label htmlFor="demoName" className="text-[0.8125rem] font-semibold text-stone-700">Full Name</Label>
                    <Input id="demoName" required placeholder="Peter Njoroge" value={demoName} onChange={(e) => setDemoName(e.target.value)} className="mt-1 text-[0.8125rem]" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="demoPhone" className="text-[0.8125rem] font-semibold text-stone-700">Phone / WhatsApp</Label>
                      <Input id="demoPhone" required type="tel" placeholder="0712 345 678" value={demoPhone} onChange={(e) => setDemoPhone(e.target.value)} className="mt-1 text-[0.8125rem]" />
                    </div>
                    <div>
                      <Label htmlFor="demoUnits" className="text-[0.8125rem] font-semibold text-stone-700">Units</Label>
                      <select id="demoUnits" value={demoUnits} onChange={(e) => setDemoUnits(e.target.value)}
                        className="mt-1 w-full h-7 rounded-sm bg-card px-2 text-[0.8125rem] text-foreground shadow-edge outline-none focus:shadow-[inset_0_0_0_1px_var(--ring),0_0_0_3px_var(--brand-tint)]">
                        <option value="3">1–3 (Free)</option>
                        <option value="15">4–15 (Starter)</option>
                        <option value="50">16–50 (Plus)</option>
                        <option value="200">51–200 (Manager)</option>
                        <option value="500">200+ (Enterprise)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="demoEmail" className="text-[0.8125rem] font-semibold text-stone-700">Email</Label>
                    <Input id="demoEmail" required type="email" placeholder="landlord@example.com" value={demoEmail} onChange={(e) => setDemoEmail(e.target.value)} className="mt-1 text-[0.8125rem]" />
                  </div>
                  <div>
                    <Label htmlFor="demoLocation" className="text-[0.8125rem] font-semibold text-stone-700">Location</Label>
                    <Input id="demoLocation" placeholder="Kilimani, Nairobi" value={demoLocation} onChange={(e) => setDemoLocation(e.target.value)} className="mt-1 text-[0.8125rem]" />
                  </div>
                  <div>
                    <Label htmlFor="demoNotes" className="text-[0.8125rem] font-semibold text-stone-700">Pain point (optional)</Label>
                    <Input id="demoNotes" placeholder="e.g. Tracking partial rent payments" value={demoNotes} onChange={(e) => setDemoNotes(e.target.value)} className="mt-1 text-[0.8125rem]" />
                  </div>
                  <button
                    type="submit"
                    disabled={demoSubmitting}
                    className="w-full h-10 rounded-lg bg-[#155e4f] text-white font-semibold text-[0.8125rem] hover:bg-[#0f4a3e] transition-colors disabled:opacity-50 mt-1 flex items-center justify-center"
                  >
                    {demoSubmitting
                      ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting…</>
                      : "Confirm Demo Booking"
                    }
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* M-Pesa Checkout Modal for Plan Subscriptions */}
      {checkoutPlan && (
        <MpesaCheckoutModal
          isOpen={Boolean(checkoutPlan)}
          planId={checkoutPlan}
          onClose={() => setCheckoutPlan(null)}
          onSuccess={() => {
            setCheckoutPlan(null);
            window.location.href = "/dashboard";
          }}
        />
      )}
    </div>
  );
}
