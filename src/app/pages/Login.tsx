import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    toast.success(mode === "login" ? "Welcome back!" : "Account created!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="size-8 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-white text-sm font-bold">C</span>
            </div>
            <span className="font-semibold tracking-tight">ClipForge</span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight mb-1">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {mode === "login" ? "Sign in to your workspace" : "Start clipping in minutes"}
          </p>
        </div>

        <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-xl shadow-black/20">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Email address</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-muted/40 border-border/50 h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Password</Label>
              <Input
                type="password"
                placeholder=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-muted/40 border-border/50 h-9 text-sm"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="size-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  {mode === "login" ? "Signing in..." : "Creating account..."}
                </span>
              ) : (
                mode === "login" ? "Sign in" : "Create account"
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-5">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-primary hover:underline"
            >
              {mode === "login" ? "Sign up free" : "Sign in"}
            </button>
          </p>
        </div>

        <p className="text-center text-[11px] text-muted-foreground/50 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
