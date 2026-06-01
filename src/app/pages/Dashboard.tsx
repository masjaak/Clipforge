import { Link } from "react-router";
import {
  Video, Scissors, Clock, Download, TrendingUp, Plus,
  AlertCircle, CheckCircle2, Loader2, ArrowRight,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { cn } from "../components/ui/utils";

const stats = [
  { label: "Videos processed", value: "14", icon: Video, delta: "+3 this week" },
  { label: "Clips created", value: "87", icon: Scissors, delta: "+12 this week" },
  { label: "Hours analyzed", value: "6.4", icon: Clock, delta: "~27 min avg" },
  { label: "Exports", value: "156", icon: Download, delta: "+28 this week" },
];

const queue = [
  {
    id: "q1", title: "Product demo walkthrough.mp4", progress: 78,
    phase: "Analyzing segments", status: "processing",
  },
  {
    id: "q2", title: "Podcast ep. 42 — growth hacks.mp4", progress: 34,
    phase: "Transcribing audio", status: "processing",
  },
  {
    id: "q3", title: "Webinar recording — Q&A.mp4", progress: 100,
    phase: "Ready", status: "ready",
  },
];

const recentProjects = [
  {
    id: "proj-1", title: "Founder story — from 0 to $1M ARR",
    duration: "32:14", clips: 8, status: "ready", created: "2h ago",
    thumb: "from-violet-900/40 to-violet-950/60",
  },
  {
    id: "proj-2", title: "TED-style talk: future of AI in design",
    duration: "18:42", clips: 5, status: "ready", created: "1d ago",
    thumb: "from-cyan-900/40 to-cyan-950/60",
  },
  {
    id: "proj-3", title: "Podcast ep. 41 — cold email masterclass",
    duration: "54:07", clips: 12, status: "ready", created: "3d ago",
    thumb: "from-indigo-900/40 to-indigo-950/60",
  },
  {
    id: "proj-4", title: "SaaS demo: ClipForge walkthrough",
    duration: "22:30", clips: 6, status: "analyzing", created: "just now",
    thumb: "from-purple-900/40 to-purple-950/60",
  },
];

const statusConfig = {
  ready: { label: "Ready", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  analyzing: { label: "Analyzing", color: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
  transcribing: { label: "Transcribing", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  failed: { label: "Failed", color: "text-red-400 bg-red-400/10 border-red-400/20" },
};

export default function Dashboard() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Good morning, Jamie</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            You have 2 videos processing and 3 clips ready to export.
          </p>
        </div>
        <Link to="/projects">
          <Button className="bg-primary hover:bg-primary/90 text-white gap-2 shadow-[0_0_16px_oklch(0.68_0.22_295/0.25)]">
            <Plus className="size-4" /> New project
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-card border border-border/60 rounded-xl p-4 hover:border-border transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <s.icon className="size-3.5 text-primary" />
              </div>
            </div>
            <div className="font-mono text-2xl font-semibold text-foreground mb-0.5">{s.value}</div>
            <div className="text-[11px] text-muted-foreground flex items-center gap-1">
              <TrendingUp className="size-3 text-emerald-400" />
              {s.delta}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">Processing queue</h2>
            <span className="text-xs text-muted-foreground">2 active</span>
          </div>
          <div className="space-y-2">
            {queue.map((job) => (
              <div
                key={job.id}
                className="bg-card border border-border/60 rounded-xl p-4 flex items-center gap-4"
              >
                <div className="shrink-0">
                  {job.status === "ready" ? (
                    <CheckCircle2 className="size-4.5 text-emerald-400" />
                  ) : job.status === "failed" ? (
                    <AlertCircle className="size-4.5 text-red-400" />
                  ) : (
                    <Loader2 className="size-4.5 text-primary animate-spin" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate mb-1">{job.title}</div>
                  <div className="flex items-center gap-3">
                    <Progress
                      value={job.progress}
                      className="h-1.5 flex-1 bg-muted"
                    />
                    <span className="text-xs text-muted-foreground font-mono shrink-0">
                      {job.progress}%
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1">{job.phase}</div>
                </div>
                {job.status === "ready" && (
                  <Link to={`/projects/proj-3`}>
                    <Button size="sm" variant="ghost" className="shrink-0 h-7 text-xs gap-1 text-primary hover:text-primary">
                      View <ArrowRight className="size-3" />
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-medium">Quick actions</h2>
          <div className="space-y-2">
            {[
              { label: "Upload new video", desc: "Start a new project", icon: Plus, to: "/projects" },
              { label: "Browse clips", desc: "87 clips ready", icon: Scissors, to: "/clips" },
              { label: "Export center", desc: "Batch download", icon: Download, to: "/exports" },
            ].map((a) => (
              <Link key={a.label} to={a.to}>
                <div className="bg-card border border-border/60 rounded-xl p-3.5 flex items-center gap-3 hover:border-primary/30 transition-colors cursor-pointer group">
                  <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                    <a.icon className="size-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{a.label}</div>
                    <div className="text-[11px] text-muted-foreground">{a.desc}</div>
                  </div>
                  <ArrowRight className="size-3.5 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium">Recent projects</h2>
          <Link to="/projects" className="text-xs text-primary hover:underline">View all</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentProjects.map((p) => (
            <Link key={p.id} to={`/projects/${p.id}`}>
              <div className="bg-card border border-border/60 rounded-xl overflow-hidden hover:border-primary/30 transition-all group cursor-pointer">
                <div className={cn("h-28 bg-gradient-to-br flex items-center justify-center", p.thumb)}>
                  <Video className="size-8 text-white/20" />
                </div>
                <div className="p-3">
                  <div className="text-xs font-medium truncate mb-1.5 group-hover:text-primary transition-colors">
                    {p.title}
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded-full border font-medium",
                        statusConfig[p.status as keyof typeof statusConfig]?.color
                      )}
                    >
                      {statusConfig[p.status as keyof typeof statusConfig]?.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{p.created}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground">
                    <Clock className="size-2.5" /> {p.duration}
                    <span className="text-border">·</span>
                    <Scissors className="size-2.5" /> {p.clips} clips
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
