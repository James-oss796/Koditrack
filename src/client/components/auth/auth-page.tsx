import { useState } from "react";
import { useApp } from "@/context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";

interface AuthPageProps {
  initialMode?: "login" | "register";
  onSuccess?: () => void;
}

export function AuthPage({ initialMode = "login", onSuccess }: AuthPageProps) {
  const { login, register, needsSetup } = useApp();
  const [isRegister, setIsRegister] = useState(initialMode === "register" || needsSetup);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-700 text-white shadow-md">
            <Building2 className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
            KodiTrack
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Rental management for Kenyan landlords & property managers
          </p>
        </div>

        {/* Auth form card */}
        <Card className="p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              {needsSetup
                ? "Welcome! Create your landlord account"
                : isRegister
                ? "Create your landlord account"
                : "Sign in to your dashboard"}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {needsSetup
                ? "Set up the primary administrator account to secure your rental portfolio."
                : isRegister
                ? "Start managing your properties, rent collections, and tenants in one place."
                : "Enter your credentials to access your properties and rent ledger."}
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-md border border-destructive/20 bg-destructive-tint p-3 text-xs font-medium text-destructive">
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
                    placeholder="e.g. James Mwangi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number (M-Pesa)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="e.g. 0712 345 678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </>
            )}

            <div>
              <Label htmlFor="email">Email address</Label>
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
                placeholder={isRegister ? "At least 6 characters" : "••••••••"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full bg-teal-700 hover:bg-teal-800"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isRegister ? "Creating account…" : "Signing in…"}
                </>
              ) : (
                <>
                  {isRegister ? "Create Account" : "Sign In"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {!needsSetup && (
            <div className="mt-6 border-t pt-4 text-center text-xs text-muted-foreground">
              {isRegister ? (
                <span>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegister(false);
                      setError(null);
                    }}
                    className="font-medium text-teal-700 hover:underline"
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
                    className="font-medium text-teal-700 hover:underline"
                  >
                    Create an account
                  </button>
                </span>
              )}
            </div>
          )}
        </Card>

        {/* Security badge footer */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-teal-700" />
          <span>Encrypted sessions · Isolated landlord data</span>
        </div>
      </div>
    </div>
  );
}
