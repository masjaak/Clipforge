import { CheckCircle2, Zap, TrendingUp, Video, Scissors, Download, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Separator } from "../components/ui/separator";
import { cn } from "../components/ui/utils";
import { toast } from "sonner";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "$0",
    period: "/month",
    desc: "For creators just getting started",
    current: false,
    features: [
      "5 projects / month",
      "30 clips total",
      "720p export",
      "Basic caption styles",
      "Community support",
    ],
    cta: "Downgrade",
    variant: "outline" as const,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    period: "/month",
    desc: "For active creators and small teams",
    current: true,
    features: [
      "Unlimited projects",
      "Unlimited clips",
      "1080p export",
      "All caption styles",
      "Batch export as ZIP",
      "AI metadata (titles, hooks)",
      "Priority processing",
      "Email support",
    ],
    cta: "Current plan",
    variant: "default" as const,
  },
  {
    id: "scale",
    name: "Scale",
    price: "$99",
    period: "/month",
    desc: "For studios and high-volume creators",
    current: false,
    features: [
      "Everything in Pro",
      "4K export",
      "Team workspaces (coming soon)",
      "API access",
      "Custom caption styles",
      "Dedicated processing queue",
      "Slack support",
    ],
    cta: "Upgrade",
    variant: "outline" as const,
  },
];

const usage = [
  { label: "Minutes processed", used: 384, limit: 600, unit: "min", icon: Video },
  { label: "Clips created", used: 87, limit: null, unit: "clips", icon: Scissors },
  { label: "Exports this month", used: 156, limit: null, unit: "exports", icon: Download },
  { label: "Storage used", used: 2.4, limit: 10, unit: "GB", icon: TrendingUp },
];

function UsageBar({ item }: { item: typeof usage[0] }) {
  const pct = item.limit ? Math.min((item.used / item.limit) * 100, 100) : null;
  const critical = pct != null && pct > 80;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <item.icon className="size-3.5 text-muted-foreground" />
          <span className="text-sm">{item.label}</span>
        </div>
        <span className="text-xs font-mono text-muted-foreground">
          {item.used} {item.unit}{item.limit ? ` / ${item.limit} ${item.unit}` : " (unlimited)"}
        </span>
      </div>
      {pct != null && (
        <Progress
          value={pct}
          className={cn("h-1.5", critical ? "[&>div]:bg-amber-400" : "[&>div]:bg-primary")}
        />
      )}
    </div>
  );
}

export default function Billing() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Billing</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your plan and monitor usage.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "bg-card border rounded-2xl p-5 flex flex-col transition-all",
              plan.current
                ? "border-primary/50 shadow-[0_0_24px_oklch(0.68_0.22_295/0.12)]"
                : "border-border/60"
            )}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">{plan.name}</span>
              {plan.current && (
                <Badge className="bg-primary/15 text-primary border-primary/20 text-[10px] h-5">
                  Active
                </Badge>
              )}
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-2xl font-semibold font-mono">{plan.price}</span>
              <span className="text-xs text-muted-foreground">{plan.period}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">{plan.desc}</p>
            <Separator className="bg-border/50 mb-4" />
            <ul className="space-y-2 flex-1 mb-5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="size-3.5 text-primary shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              variant={plan.current ? "default" : "outline"}
              className={cn(
                "w-full text-sm",
                plan.current
                  ? "bg-primary hover:bg-primary/90 text-white"
                  : "border-border/60"
              )}
              disabled={plan.current}
              onClick={() => !plan.current && toast.info("Billing integration coming soon — shape powered by real Stripe events")}
            >
              {plan.cta}
              {!plan.current && plan.id === "scale" && <ArrowRight className="size-3.5 ml-1.5" />}
            </Button>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-medium">Usage this month</h2>
        <div className="bg-card border border-border/60 rounded-2xl p-5 space-y-5">
          {usage.map((item) => (
            <UsageBar key={item.label} item={item} />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-medium">Billing history</h2>
        <div className="bg-card border border-border/60 rounded-xl overflow-hidden">
          <div className="grid grid-cols-[1fr_100px_100px_80px] gap-4 px-4 py-2.5 text-[11px] text-muted-foreground border-b border-border/50">
            <span>Description</span><span>Date</span><span>Amount</span><span>Status</span>
          </div>
          {[
            { desc: "Pro plan — June 2026", date: "Jun 1, 2026", amount: "$29.00", status: "Paid" },
            { desc: "Pro plan — May 2026", date: "May 1, 2026", amount: "$29.00", status: "Paid" },
            { desc: "Pro plan — April 2026", date: "Apr 1, 2026", amount: "$29.00", status: "Paid" },
          ].map((row, i, arr) => (
            <div
              key={row.date}
              className={cn(
                "grid grid-cols-[1fr_100px_100px_80px] gap-4 px-4 py-3 text-sm items-center",
                i < arr.length - 1 && "border-b border-border/40"
              )}
            >
              <span className="text-xs">{row.desc}</span>
              <span className="text-xs text-muted-foreground">{row.date}</span>
              <span className="text-xs font-mono">{row.amount}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 w-fit">
                {row.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-primary/15 flex items-center justify-center">
            <Zap className="size-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Next billing date</p>
            <p className="text-xs text-muted-foreground">July 1, 2026 · $29.00</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => toast.info("Payment method management coming soon")}>
          Update payment
        </Button>
      </div>
    </div>
  );
}
