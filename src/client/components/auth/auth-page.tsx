import { useState, useEffect } from "react";
import { useApp } from "@/context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Building2, ArrowRight, Loader2, Check, Sparkles } from "lucide-react";

interface AuthPageProps {
  initialMode?: "login" | "register";
  defaultPlan?: string;
  onSuccess?: () => void;
  onNavigateHome?: () => void;
}

const PLAN_INFO: Record<string, { name: string; price: string; units: string; badge: string }> = {
  free: {
    name: "Free Forever",
    price: "KSh 0",
    units: "1–3 Units",
    badge: "Free",
  },
  starter: {
    name: "Starter Plan",
    price: "KSh 500/mo",
    units: "Up to 15 Units",
    badge: "Starter",
  },
  plus: {
    name: "Landlord Plus",
    price: "KSh 1,000/mo",
    units: "Up to 50 Units",
    badge: "Popular",
  },
  manager: {
    name: "Property Manager",
    price: "KSh 2,500/mo",
    units: "Up to 200 Units",
    badge: "Manager",
  },
};

export function AuthPage({ initialMode = "login", defaultPlan = "free", onSuccess, onNavigateHome }: AuthPageProps) {
  const { login, register, needsSetup } = useApp();
  const [isRegister, setIsRegister] = useState(initialMode === "register" || needsSetup);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get("plan");
    if (p && PLAN_INFO[p]) return p;
    return defaultPlan;
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get("plan");
    if (p && PLAN_INFO[p]) {
      setSelectedPlan(p);
      setIsRegister(true);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (isRegister) {
        if (!name.trim()) throw new Error("Please enter your full name");
        if (password.length < 6) throw new Error("Password must be at least 6 characters");
        await register({
          email: email.trim(),
          password,
          name: name.trim(),
          phone: phone.trim() || null,
          plan: selectedPlan,
        });
      } else {
        await login(email.trim(), password);
      }
      onSuccess?.();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  const activePlanMeta = PLAN_INFO[selectedPlan] ?? PLAN_INFO.free;

  return (
    <div className="flex min-h-screen flex-col bg-muted px-4 py-8 text-foreground sm:py-12">
      <div className="mx-auto w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="flex flex-col items-center text-center">
          <button
            type="button"
            onClick={onNavigateHome}
            className="group flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand text-on-brand">
              <Building2 className="h-6 w-6" />
            </div>
            <div className="text-left">
              <span className="block text-xl font-semibold tracking-tight text-foreground">KodiTrack</span>
              <span className="text-xs text-muted-foreground">Property management</span>
            </div>
          </button>
          <p className="mt-3 text-sm text-muted-foreground">
            Smart rental management, arrears tracking, and M-Pesa receipts
          </p>
        </div>

        {/* Auth form card */}
        <Card className="border-border bg-card p-6 shadow-raised sm:p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                {needsSetup
                  ? "Welcome! Setup Admin Account"
                  : isRegister
                  ? "Create Landlord Account"
                  : "Sign In to KodiTrack"}
              </h2>
              {isRegister && (
                <Badge variant="outline" className="border-brand/30 bg-brand-tint text-brand-text text-[11px]">
                  {activePlanMeta.units}
                </Badge>
              )}
            </div>

            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {needsSetup
                ? "Setup your primary administrator account to secure your rental portfolio."
                : isRegister
                ? `${activePlanMeta.name} · ${activePlanMeta.price} · ${activePlanMeta.units}. Plans currently differ by unit capacity.`
                : "Enter your credentials to access your properties, rent ledger, and tenants."}
            </p>
          </div>

          {/* Plan Selector Pill when Registering */}
          {isRegister && (
            <div className="mb-5 rounded-md border border-border bg-muted p-3">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <Sparkles className="h-3.5 w-3.5" />
                  Selected Tier:
                </span>
                <span className="font-semibold text-foreground">
                  {activePlanMeta.name} ({activePlanMeta.price})
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
                {(["free", "starter", "plus", "manager"] as const).map((p) => {
                  const meta = PLAN_INFO[p];
                  const active = selectedPlan === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setSelectedPlan(p)}
                      className={`rounded-sm border px-1 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        active
                          ? "border-brand bg-brand-tint font-semibold text-brand-text"
                          : "border-border bg-card text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      <div className="truncate font-semibold">{meta.name.split(" ")[0]}</div>
                      <div className="text-[9px] opacity-80">{meta.units}</div>
                    </button>
                  );
                })}
              </div>

              {selectedPlan === "free" && (
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  <Check className="mr-1 inline h-3 w-3 text-brand" />
                  Includes up to 3 units. You can change plans later without deleting your records.
                </p>
              )}
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-md border border-destructive/30 bg-destructive-tint p-3 text-sm font-medium text-destructive" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    placeholder="e.g. Samuel Kimani"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number (optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="e.g. 0722 123 456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </>
            )}

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="landlord@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                placeholder={isRegister ? "Minimum 6 characters" : "••••••••"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isRegister ? "Creating account…" : "Signing in…"}
                </>
              ) : (
                <>
                  {isRegister
                    ? selectedPlan === "free"
                      ? "Start Free Tier (3 Units)"
                      : `Activate ${activePlanMeta.name}`
                    : "Sign In"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {!needsSetup && (
            <div className="mt-6 border-t border-border pt-4 text-center text-sm text-muted-foreground">
              {isRegister ? (
                <span>
                  Already have a landlord account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegister(false);
                      setError(null);
                    }}
                    className="font-medium text-brand-text underline underline-offset-4 hover:text-brand"
                  >
                    Sign in here
                  </button>
                </span>
              ) : (
                <span>
                  New landlord or manager?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegister(true);
                      setError(null);
                    }}
                    className="font-medium text-brand-text underline underline-offset-4 hover:text-brand"
                  >
                    Create an account (1–3 units free)
                  </button>
                </span>
              )}
            </div>
          )}
        </Card>

        <div className="text-center text-xs text-muted-foreground">
          <button
            type="button"
            onClick={onNavigateHome}
            className="rounded-sm px-2 py-1 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Back to KodiTrack
          </button>
        </div>
      </div>
    </div>
  );
}
