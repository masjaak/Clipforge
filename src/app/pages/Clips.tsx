import { useState } from "react";
import { Link } from "react-router";
import { Play, Download, Search, Zap, Clock, Filter, ArrowUpDown, SlidersHorizontal } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { ScrollArea } from "../components/ui/scroll-area";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../components/ui/select";
import { cn } from "../components/ui/utils";
import { toast } from "sonner";

const allClips = [
  { id: "clip-1", title: "47 VCs said no — then we hit $1M", duration: "1:28", virality: 92, hook: 88, retention: 85, project: "Founder story", status: "ready", aspect: "9:16", style: "Hormozi", thumb: "from-violet-900/60 to-violet-950/80" },
  { id: "clip-2", title: "8 employees, zero runway", duration: "2:16", virality: 87, hook: 82, retention: 79, project: "Founder story", status: "ready", aspect: "9:16", style: "Modern", thumb: "from-rose-900/60 to-rose-950/80" },
  { id: "clip-3", title: "Pricing hack that 2× revenue overnight", duration: "1:38", virality: 81, hook: 78, retention: 74, project: "Founder story", status: "ready", aspect: "9:16", style: "Bold", thumb: "from-amber-900/60 to-amber-950/80" },
  { id: "clip-4", title: "Enterprise customer cried on the demo", duration: "1:50", virality: 76, hook: 71, retention: 68, project: "Founder story", status: "rendering", aspect: "1:1", style: "Minimal", thumb: "from-blue-900/60 to-blue-950/80" },
  { id: "clip-5", title: "$83K MRR with zero marketing budget", duration: "2:19", virality: 94, hook: 91, retention: 88, project: "Founder story", status: "ready", aspect: "9:16", style: "Hormozi", thumb: "from-emerald-900/60 to-emerald-950/80" },
  { id: "clip-6", title: "AI will replace 80% of design jobs by 2028", duration: "0:58", virality: 89, hook: 86, retention: 83, project: "TED-style talk: AI in design", status: "ready", aspect: "9:16", style: "Modern", thumb: "from-cyan-900/60 to-cyan-950/80" },
  { id: "clip-7", title: "The Figma moment that changed everything", duration: "1:12", virality: 84, hook: 80, retention: 77, project: "TED-style talk: AI in design", status: "ready", aspect: "9:16", style: "Podcast", thumb: "from-sky-900/60 to-sky-950/80" },
  { id: "clip-8", title: "Cold email subject line that got 74% open rate", duration: "1:44", virality: 91, hook: 89, retention: 85, project: "Podcast ep. 41", status: "ready", aspect: "9:16", style: "Hormozi", thumb: "from-orange-900/60 to-orange-950/80" },
  { id: "clip-9", title: "The 3-sentence cold email formula", duration: "2:05", virality: 86, hook: 83, retention: 80, project: "Podcast ep. 41", status: "ready", aspect: "9:16", style: "Bold", thumb: "from-indigo-900/60 to-indigo-950/80" },
  { id: "clip-10", title: "Why personalization at scale is a myth", duration: "1:31", virality: 79, hook: 75, retention: 72, project: "Podcast ep. 41", status: "ready", aspect: "1:1", style: "Minimal", thumb: "from-purple-900/60 to-purple-950/80" },
  { id: "clip-11", title: "Email deliverability: the SPF trap nobody talks about", duration: "2:22", virality: 88, hook: 85, retention: 81, project: "Webinar: email deliverability", status: "ready", aspect: "9:16", style: "Modern", thumb: "from-teal-900/60 to-teal-950/80" },
  { id: "clip-12", title: "Inbox placement dropped 40% — here's why", duration: "1:55", virality: 82, hook: 79, retention: 76, project: "Webinar: email deliverability", status: "ready", aspect: "9:16", style: "Podcast", thumb: "from-fuchsia-900/60 to-fuchsia-950/80" },
];

function ViralityRing({ score, size = 52 }: { score: number; size?: number }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 90 ? "oklch(0.75 0.17 160)" : score >= 80 ? "oklch(0.68 0.22 295)" : "oklch(0.72 0.15 200)";
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth="5" className="text-white/10" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth="5"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono text-xs font-semibold" style={{ color }}>{score}</span>
      </div>
    </div>
  );
}

export default function Clips() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("virality");
  const [aspectFilter, setAspectFilter] = useState("all");

  const filtered = allClips
    .filter((c) => {
      const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.project.toLowerCase().includes(search.toLowerCase());
      const matchAspect = aspectFilter === "all" || c.aspect === aspectFilter;
      return matchSearch && matchAspect;
    })
    .sort((a, b) => {
      if (sort === "virality") return b.virality - a.virality;
      if (sort === "hook") return b.hook - a.hook;
      if (sort === "retention") return b.retention - a.retention;
      return 0;
    });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Clips</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{allClips.length} clips across {new Set(allClips.map((c) => c.project)).size} projects</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs border-border/60"
          onClick={() => toast.info("Batch export ready in the Export Center")}
        >
          <Download className="size-3.5" /> Batch export
        </Button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search clips or projects…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-sm bg-muted/40 border-border/50"
          />
        </div>
        <Select value={aspectFilter} onValueChange={setAspectFilter}>
          <SelectTrigger className="w-32 h-8 text-xs bg-muted/40 border-border/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border-border text-sm">
            <SelectItem value="all">All aspects</SelectItem>
            <SelectItem value="9:16">9:16 vertical</SelectItem>
            <SelectItem value="1:1">1:1 square</SelectItem>
            <SelectItem value="16:9">16:9 wide</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-36 h-8 text-xs bg-muted/40 border-border/50">
            <ArrowUpDown className="size-3 mr-1.5" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border-border text-sm">
            <SelectItem value="virality">Virality score</SelectItem>
            <SelectItem value="hook">Hook score</SelectItem>
            <SelectItem value="retention">Retention score</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filtered.map((clip) => (
          <Link key={clip.id} to={`/clips/${clip.id}`}>
            <div className="bg-card border border-border/60 rounded-xl overflow-hidden hover:border-primary/40 transition-all group cursor-pointer">
              <div className={cn("h-32 bg-gradient-to-br flex items-center justify-center relative", clip.thumb)}>
                <div className="size-10 rounded-full bg-black/30 flex items-center justify-center border border-white/10 backdrop-blur group-hover:bg-black/40 transition-colors">
                  <Play className="size-4 text-white ml-0.5" />
                </div>
                <div className="absolute top-2 right-2">
                  <ViralityRing score={clip.virality} size={44} />
                </div>
                <span className="absolute bottom-2 left-2 text-[9px] bg-black/60 text-white/70 px-1.5 py-0.5 rounded backdrop-blur">
                  {clip.aspect} · {clip.duration}
                </span>
                {clip.status === "rendering" && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="size-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  </div>
                )}
              </div>
              <div className="p-2.5">
                <p className="text-[11px] font-medium line-clamp-2 leading-snug mb-1.5 group-hover:text-primary transition-colors">
                  {clip.title}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">{clip.project}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{clip.style}</span>
                  <button
                    onClick={(e) => { e.preventDefault(); toast.success(`Downloading ${clip.title}`); }}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Download className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
