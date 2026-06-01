import { Link } from "react-router";
import { Zap, Play, ArrowRight, Scissors, Wand2, Download, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

const features = [
  {
    icon: Wand2,
    title: "AI Transcript Analysis",
    desc: "Gemini 2.5 Pro extracts word-timestamped transcripts from your audio with speaker diarization.",
  },
  {
    icon: Scissors,
    title: "Smart Clip Detection",
    desc: "Virality scoring across 8 factors: curiosity, emotion, conflict, surprise, story, education, retention, shareability.",
  },
  {
    icon: Play,
    title: "Browser-side Rendering",
    desc: "ffmpeg.wasm cuts, reframes, and burns captions entirely in-browser. No upload to render farms.",
  },
  {
    icon: Download,
    title: "Multi-format Export",
    desc: "Export MP4 clips, SRT/VTT subtitles, or plain-text transcripts. Batch ZIP supported.",
  },
];

const stats = [
  { value: "2.5 Pro", label: "Gemini model" },
  { value: "8×", label: "virality factors" },
  { value: "5", label: "caption presets" },
  { value: "0", label: "server-side render cost" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-border/40 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="size-7 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_20px_oklch(0.68_0.22_295/0.3)]">
            <Zap className="size-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-sm tracking-tight">ClipForge</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground text-sm">
              Sign in
            </Button>
          </Link>
          <Link to="/login">
            <Button className="bg-primary hover:bg-primary/90 text-white text-sm shadow-[0_0_20px_oklch(0.68_0.22_295/0.3)]">
              Get started free
            </Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8">
        <section className="pt-24 pb-20 text-center">
          <Badge variant="secondary" className="mb-6 px-3 py-1 text-xs bg-primary/10 text-primary border-primary/20">
            Powered by Gemini 2.5 Pro · ffmpeg.wasm
          </Badge>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-6 leading-[1.1]">
            Turn long videos into{" "}
            <span className="bg-gradient-to-r from-[oklch(0.68_0.22_295)] to-[oklch(0.72_0.15_200)] bg-clip-text text-transparent">
              viral clips
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            ClipForge analyzes your video with real AI, scores every moment for virality,
            and renders ready-to-post short clips — entirely in your browser.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/dashboard">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white px-8 gap-2 shadow-[0_0_30px_oklch(0.68_0.22_295/0.35)]"
              >
                Open app <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-border/60 text-foreground gap-2">
                <Play className="size-4" /> Watch demo
              </Button>
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-4 gap-px bg-border/40 rounded-2xl overflow-hidden border border-border/40">
            {stats.map((s) => (
              <div key={s.label} className="bg-card px-6 py-8 text-center">
                <div className="font-mono text-3xl font-semibold text-primary mb-1">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="pb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold tracking-tight mb-3">Everything you need</h2>
            <p className="text-muted-foreground">Real AI, real clips, no external render APIs.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-card border border-border/60 rounded-xl p-6 hover:border-primary/30 transition-colors group"
              >
                <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <f.icon className="size-4.5 text-primary" />
                </div>
                <h3 className="font-medium mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="pb-24 text-center border-t border-border/40 pt-16">
          <h2 className="text-3xl font-semibold tracking-tight mb-4">Ready to clip smarter?</h2>
          <p className="text-muted-foreground mb-8">Free to start. No credit card required.</p>
          <div className="flex items-center justify-center gap-4 mb-8">
            {["No render costs", "Real AI transcription", "Export to any format"].map((item) => (
              <div key={item} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <CheckCircle2 className="size-4 text-primary" />
                {item}
              </div>
            ))}
          </div>
          <Link to="/dashboard">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white px-10 shadow-[0_0_30px_oklch(0.68_0.22_295/0.35)]"
            >
              Start clipping for free
            </Button>
          </Link>
        </section>
      </main>

      <footer className="border-t border-border/40 py-8 text-center text-xs text-muted-foreground/60">
        © 2026 ClipForge · Built with Gemini + ffmpeg.wasm
      </footer>
    </div>
  );
}
