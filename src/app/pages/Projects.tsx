import { useState } from "react";
import { Link } from "react-router";
import {
  Plus, Search, Video, Scissors, Clock, MoreHorizontal,
  Upload, Filter, SortDesc,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { cn } from "../components/ui/utils";
import { toast } from "sonner";

const projects = [
  {
    id: "proj-1", title: "Founder story — from 0 to $1M ARR",
    duration: "32:14", clips: 8, segments: 14, status: "ready",
    language: "en", created: "2026-05-30", source: "youtube",
    thumb: "from-violet-900/50 to-violet-950/70",
  },
  {
    id: "proj-2", title: "TED-style talk: future of AI in design",
    duration: "18:42", clips: 5, segments: 9, status: "ready",
    language: "en", created: "2026-05-29", source: "upload",
    thumb: "from-cyan-900/50 to-cyan-950/70",
  },
  {
    id: "proj-3", title: "Podcast ep. 41 — cold email masterclass",
    duration: "54:07", clips: 12, segments: 23, status: "ready",
    language: "en", created: "2026-05-27", source: "upload",
    thumb: "from-indigo-900/50 to-indigo-950/70",
  },
  {
    id: "proj-4", title: "SaaS demo: ClipForge product walkthrough",
    duration: "22:30", clips: 0, segments: 0, status: "analyzing",
    language: "en", created: "2026-06-01", source: "upload",
    thumb: "from-purple-900/50 to-purple-950/70",
  },
  {
    id: "proj-5", title: "Interview: scaling B2B SaaS to $10M ARR",
    duration: "44:18", clips: 0, segments: 0, status: "transcribing",
    language: "en", created: "2026-06-01", source: "upload",
    thumb: "from-fuchsia-900/50 to-fuchsia-950/70",
  },
  {
    id: "proj-6", title: "Webinar: email deliverability deep-dive",
    duration: "1:02:33", clips: 18, segments: 28, status: "ready",
    language: "en", created: "2026-05-22", source: "upload",
    thumb: "from-blue-900/50 to-blue-950/70",
  },
];

const statusConfig = {
  ready: { label: "Ready", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  analyzing: { label: "Analyzing…", color: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
  transcribing: { label: "Transcribing…", color: "text-sky-400 bg-sky-400/10 border-sky-400/20" },
  uploading: { label: "Uploading", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  failed: { label: "Failed", color: "text-red-400 bg-red-400/10 border-red-400/20" },
};

const filters = ["All", "Ready", "Processing", "Failed"];

export default function Projects() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showUpload, setShowUpload] = useState(false);

  const filtered = projects.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "All" ||
      (filter === "Ready" && p.status === "ready") ||
      (filter === "Processing" && ["analyzing", "transcribing", "uploading"].includes(p.status)) ||
      (filter === "Failed" && p.status === "failed");
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{projects.length} videos · {projects.reduce((a, p) => a + p.clips, 0)} clips generated</p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 text-white gap-2 shadow-[0_0_16px_oklch(0.68_0.22_295/0.25)]"
          onClick={() => {
            setShowUpload(true);
            toast.info("Upload dialog coming in v2 — drag & drop or paste a URL");
          }}
        >
          <Plus className="size-4" /> New project
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search projects…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-sm bg-muted/40 border-border/50"
          />
        </div>
        <div className="flex items-center gap-1.5 bg-muted/40 border border-border/50 rounded-lg p-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1 text-xs rounded-md transition-all",
                filter === f
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground text-xs">
          <SortDesc className="size-3.5" /> Sort
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Video className="size-6 text-primary" />
          </div>
          <h3 className="font-medium mb-2">No projects found</h3>
          <p className="text-sm text-muted-foreground">Try a different search or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => {
            const sc = statusConfig[p.status as keyof typeof statusConfig];
            return (
              <Link key={p.id} to={`/projects/${p.id}`}>
                <div className="bg-card border border-border/60 rounded-xl overflow-hidden hover:border-primary/30 transition-all group">
                  <div className={cn("h-36 bg-gradient-to-br flex items-center justify-center relative", p.thumb)}>
                    <Video className="size-10 text-white/15" />
                    <span
                      className={cn(
                        "absolute top-2.5 right-2.5 text-[10px] px-2 py-0.5 rounded-full border font-medium",
                        sc?.color
                      )}
                    >
                      {sc?.label}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="text-sm font-medium leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {p.title}
                      </h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-6 shrink-0 text-muted-foreground hover:text-foreground"
                            onClick={(e) => e.preventDefault()}
                          >
                            <MoreHorizontal className="size-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card border-border text-sm">
                          <DropdownMenuItem>Rename</DropdownMenuItem>
                          <DropdownMenuItem>Download source</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="size-2.5" /> {p.duration}</span>
                      <span className="flex items-center gap-1"><Scissors className="size-2.5" /> {p.clips} clips</span>
                      <span className="flex items-center gap-1"><Filter className="size-2.5" /> {p.segments} segments</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground/60 mt-1.5">{p.created}</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
