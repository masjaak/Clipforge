import { useState } from "react";
import { Link } from "react-router";
import {
  Download, FileVideo, FileText, File, CheckCircle2,
  Clock, Package, Trash2, ExternalLink, FolderOpen,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Checkbox } from "../components/ui/checkbox";
import { Progress } from "../components/ui/progress";
import { Separator } from "../components/ui/separator";
import { cn } from "../components/ui/utils";
import { toast } from "sonner";

const exports = [
  { id: "e1", clip: "47 VCs said no — then we hit $1M", format: "mp4", size: "48.2 MB", status: "ready", created: "2026-06-01 09:42", project: "Founder story" },
  { id: "e2", clip: "$83K MRR with zero marketing", format: "mp4", size: "61.7 MB", status: "ready", created: "2026-06-01 09:40", project: "Founder story" },
  { id: "e3", clip: "47 VCs said no — then we hit $1M", format: "srt", size: "3.1 KB", status: "ready", created: "2026-06-01 09:43", project: "Founder story" },
  { id: "e4", clip: "Cold email subject line — 74% open rate", format: "mp4", size: "42.8 MB", status: "ready", created: "2026-05-31 18:20", project: "Podcast ep. 41" },
  { id: "e5", clip: "AI will replace 80% of design jobs", format: "mp4", size: "24.5 MB", status: "ready", created: "2026-05-31 11:15", project: "TED-style talk" },
  { id: "e6", clip: "The 3-sentence cold email formula", format: "vtt", size: "2.8 KB", status: "ready", created: "2026-05-31 10:05", project: "Podcast ep. 41" },
  { id: "e7", clip: "Enterprise customer cried on demo", format: "mp4", size: "53.1 MB", status: "processing", created: "2026-06-01 10:01", project: "Founder story" },
  { id: "e8", clip: "Inbox placement dropped 40%", format: "txt", size: "8.4 KB", status: "ready", created: "2026-05-30 15:30", project: "Webinar: deliverability" },
];

const batchClips = [
  { id: "clip-1", title: "47 VCs said no — then we hit $1M", virality: 92 },
  { id: "clip-2", title: "8 employees, zero runway", virality: 87 },
  { id: "clip-5", title: "$83K MRR with zero marketing", virality: 94 },
  { id: "clip-6", title: "AI will replace 80% of design jobs", virality: 89 },
  { id: "clip-8", title: "Cold email subject line — 74% open", virality: 91 },
];

const formatIcons = {
  mp4: FileVideo,
  srt: FileText,
  vtt: FileText,
  txt: File,
};

const formatColors = {
  mp4: "text-violet-400 bg-violet-400/10 border-violet-400/20",
  srt: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  vtt: "text-sky-400 bg-sky-400/10 border-sky-400/20",
  txt: "text-muted-foreground bg-muted/50 border-border/50",
};

export default function Exports() {
  const [selected, setSelected] = useState<string[]>([]);
  const [batchFormat, setBatchFormat] = useState("mp4");
  const [batchProgress, setBatchProgress] = useState(0);
  const [batching, setBatching] = useState(false);

  const toggleSelect = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const handleBatchExport = async () => {
    if (selected.length === 0) { toast.error("Select at least one clip"); return; }
    setBatching(true);
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((r) => setTimeout(r, 150));
      setBatchProgress(i);
    }
    setBatching(false);
    setBatchProgress(0);
    toast.success(`Batch export complete — ${selected.length} files zipped`);
    setSelected([]);
  };

  const totalSize = exports
    .filter((e) => e.status === "ready")
    .reduce((acc, e) => {
      const mb = parseFloat(e.size);
      return acc + (e.size.includes("KB") ? mb / 1024 : mb);
    }, 0);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Export Center</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {exports.filter((e) => e.status === "ready").length} files ready · {totalSize.toFixed(1)} MB total
          </p>
        </div>
      </div>

      <div className="bg-card border border-border/60 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Package className="size-4 text-primary" />
          <h2 className="text-sm font-medium">Batch export</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-4">Select clips below and export them all as a ZIP file.</p>

        <div className="space-y-2 mb-4">
          {batchClips.map((clip) => (
            <label
              key={clip.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                selected.includes(clip.id)
                  ? "border-primary/40 bg-primary/5"
                  : "border-border/50 bg-background/40 hover:border-border"
              )}
            >
              <Checkbox
                checked={selected.includes(clip.id)}
                onCheckedChange={() => toggleSelect(clip.id)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <span className="text-sm flex-1 truncate">{clip.title}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono">
                {clip.virality}
              </span>
            </label>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-muted/40 border border-border/50 rounded-lg p-1">
            {["mp4", "srt", "vtt", "txt"].map((f) => (
              <button
                key={f}
                onClick={() => setBatchFormat(f)}
                className={cn(
                  "px-3 py-1 text-xs rounded-md transition-all uppercase",
                  batchFormat === f ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <Button
            className="bg-primary hover:bg-primary/90 text-white gap-2 shadow-[0_0_12px_oklch(0.68_0.22_295/0.2)]"
            onClick={handleBatchExport}
            disabled={batching || selected.length === 0}
          >
            {batching ? (
              <>
                <span className="size-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Exporting…
              </>
            ) : (
              <>
                <Download className="size-3.5" />
                Export {selected.length > 0 ? `${selected.length} clips` : "selected"} as ZIP
              </>
            )}
          </Button>
        </div>

        {batching && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-muted-foreground">Rendering…</span>
              <span className="text-xs font-mono text-primary">{batchProgress}%</span>
            </div>
            <Progress value={batchProgress} className="h-1.5 bg-muted" />
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-medium">Export history</h2>
        <div className="bg-card border border-border/60 rounded-xl overflow-hidden">
          <div className="grid grid-cols-[1fr_100px_80px_100px_80px_40px] gap-4 px-4 py-2.5 text-[11px] text-muted-foreground border-b border-border/50">
            <span>Clip</span><span>Project</span><span>Format</span><span>Size</span><span>Status</span><span />
          </div>
          {exports.map((exp, i) => {
            const Icon = formatIcons[exp.format as keyof typeof formatIcons] || File;
            const fmtColor = formatColors[exp.format as keyof typeof formatColors];
            return (
              <div
                key={exp.id}
                className={cn(
                  "grid grid-cols-[1fr_100px_80px_100px_80px_40px] gap-4 px-4 py-3 text-sm items-center hover:bg-accent/30 transition-colors",
                  i < exports.length - 1 && "border-b border-border/40"
                )}
              >
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate">{exp.clip}</p>
                  <p className="text-[10px] text-muted-foreground">{exp.created}</p>
                </div>
                <span className="text-[11px] text-muted-foreground truncate">{exp.project}</span>
                <span className={cn("text-[10px] px-2 py-0.5 rounded-full border uppercase font-medium w-fit", fmtColor)}>
                  {exp.format}
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">{exp.size}</span>
                <span>
                  {exp.status === "ready" ? (
                    <CheckCircle2 className="size-3.5 text-emerald-400" />
                  ) : (
                    <Clock className="size-3.5 text-amber-400 animate-pulse" />
                  )}
                </span>
                <button
                  onClick={() => exp.status === "ready" && toast.success(`Downloading ${exp.clip}.${exp.format}`)}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  disabled={exp.status !== "ready"}
                >
                  <Download className="size-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
