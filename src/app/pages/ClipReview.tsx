import { useState } from "react";
import { Link, useParams } from "react-router";
import {
  Play, Pause, Volume2, Maximize2, ChevronLeft, Download,
  Copy, Share2, SkipBack, SkipForward, Hash, Type, FileText,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ScrollArea } from "../components/ui/scroll-area";
import { Separator } from "../components/ui/separator";
import { cn } from "../components/ui/utils";
import { toast } from "sonner";

const clipData: Record<string, any> = {
  "clip-1": {
    title: "47 VCs said no — then we hit $1M",
    project: "Founder story — from 0 to $1M ARR",
    projectId: "proj-1",
    duration: "1:28",
    aspect: "9:16",
    virality: 92, hook: 88, retention: 85,
    thumb: "from-violet-900/60 to-violet-950/80",
    captions: [
      { time: "0:00", text: "I was rejected by 47 VCs" },
      { time: "0:03", text: "before we hit $1M ARR." },
      { time: "0:06", text: "Every single one said" },
      { time: "0:09", text: "the market was too small." },
    ],
    metadata: {
      titles: [
        "47 VCs Said No — Then We Hit $1M ARR",
        "How I Got Rejected 47 Times Before Building a $1M Business",
        "The VC Rejection Story That Led to $1M ARR",
      ],
      descriptions: [
        "Every VC told me the market was too small. 47 rejections later, we proved them all wrong. Here's the story of how we hit $1M ARR without a single VC check.",
        "Rejected 47 times by VCs. Zero funding. $1M ARR anyway. If you're building without big-name backing, this one's for you.",
      ],
      hashtags: ["#startuplife", "#founderstory", "#bootstrapped", "#1MARR", "#venturecapital", "#startup", "#entrepreneurship", "#buildinpublic"],
      hooks: [
        "47 VCs said no. Then we hit $1M ARR.",
        "They all said the market was too small. They were wrong.",
        "No funding. No connections. Just $1M in revenue.",
      ],
    },
  },
  "clip-5": {
    title: "$83K MRR with zero marketing budget",
    project: "Founder story — from 0 to $1M ARR",
    projectId: "proj-1",
    duration: "2:19",
    aspect: "9:16",
    virality: 94, hook: 91, retention: 88,
    thumb: "from-emerald-900/60 to-emerald-950/80",
    captions: [],
    metadata: {
      titles: ["$83K MRR With Zero Marketing Spend"],
      descriptions: ["Pure word of mouth. No ads. No influencers."],
      hashtags: ["#MRR", "#SaaS", "#growth", "#wordofmouth"],
      hooks: ["$83K MRR. Zero marketing budget."],
    },
  },
};

const captionStyles = [
  { id: "minimal", name: "Minimal", preview: "Clean text, no background", className: "font-light tracking-wide" },
  { id: "modern", name: "Modern", preview: "Bold with drop shadow", className: "font-semibold drop-shadow-lg" },
  { id: "podcast", name: "Podcast", preview: "Pill background, centered", className: "font-medium bg-black/60 px-2 rounded" },
  { id: "bold", name: "Bold", preview: "Large, punchy typography", className: "font-black uppercase tracking-tight" },
  { id: "hormozi", name: "Hormozi", preview: "Yellow highlight on key words", className: "font-black" },
];

const exportFormats = [
  { id: "mp4", label: "MP4 Video", desc: "Ready to post", icon: Play },
  { id: "srt", label: "SRT Captions", desc: "For YouTube / Premiere", icon: FileText },
  { id: "vtt", label: "VTT Captions", desc: "For web players", icon: FileText },
  { id: "txt", label: "Plain text", desc: "Transcript only", icon: Type },
];

function ScoreRing({ score, label, color }: { score: number; label: string; color: string }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative size-20">
        <svg className="size-full -rotate-90" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r={r} fill="none" stroke="currentColor" strokeWidth="6" className="text-white/10" />
          <circle cx="44" cy="44" r={r} fill="none" stroke={color} strokeWidth="6"
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-lg font-semibold" style={{ color }}>{score}</span>
        </div>
      </div>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  );
}

export default function ClipReview() {
  const { id = "clip-1" } = useParams();
  const clip = clipData[id] || clipData["clip-1"];
  const [playing, setPlaying] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState("modern");
  const [selectedFormat, setSelectedFormat] = useState("mp4");
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    await new Promise((r) => setTimeout(r, 1800));
    setExporting(false);
    toast.success(`Exported ${clip.title}.${selectedFormat}`, { description: "Added to Export Center" });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)]">
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border/50 shrink-0">
        <Link to={`/projects/${clip.projectId}`}>
          <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-muted-foreground hover:text-foreground text-xs">
            <ChevronLeft className="size-3.5" /> {clip.project.substring(0, 28)}…
          </Button>
        </Link>
        <div className="h-4 w-px bg-border/50" />
        <h1 className="text-sm font-medium truncate flex-1">{clip.title}</h1>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs text-muted-foreground">
            <Share2 className="size-3.5" /> Share
          </Button>
          <Button
            size="sm"
            className="h-7 gap-1.5 text-xs bg-primary hover:bg-primary/90 text-white"
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting ? (
              <span className="size-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <Download className="size-3" />
            )}
            Export {selectedFormat.toUpperCase()}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 border-r border-border/50 flex flex-col p-6 gap-4 overflow-auto">
          <div className="flex gap-6 justify-center">
            <div
              className={cn(
                "relative bg-black rounded-2xl overflow-hidden flex-shrink-0 shadow-2xl shadow-black/60",
                clip.aspect === "9:16" ? "w-52 aspect-[9/16]" : "w-72 aspect-square"
              )}
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br", clip.thumb)} />
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 px-4">
                {clip.captions.map((c: any, i: number) => (
                  <div
                    key={i}
                    className={cn(
                      "text-white text-center mb-1",
                      captionStyles.find((s) => s.id === selectedStyle)?.className
                    )}
                    style={{ fontSize: "clamp(12px, 3.5vw, 16px)" }}
                  >
                    {c.text}
                  </div>
                ))}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
              <button
                onClick={() => setPlaying(!playing)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-white/10 flex items-center justify-center transition-all"
              >
                {playing ? <Pause className="size-5 text-white" /> : <Play className="size-5 text-white ml-0.5" />}
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <div className="h-0.5 bg-white/20 rounded-full">
                  <div className="h-full w-[38%] bg-primary rounded-full" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 justify-center">
              <div>
                <p className="text-xs text-muted-foreground mb-3 uppercase tracking-widest">Scores</p>
                <div className="flex gap-5">
                  <ScoreRing score={clip.virality} label="Virality" color="oklch(0.68 0.22 295)" />
                  <ScoreRing score={clip.hook} label="Hook" color="oklch(0.72 0.15 200)" />
                  <ScoreRing score={clip.retention} label="Retention" color="oklch(0.75 0.17 160)" />
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="secondary" className="text-[10px] bg-muted border-0">{clip.aspect}</Badge>
                <Badge variant="secondary" className="text-[10px] bg-muted border-0">{clip.duration}</Badge>
                <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                  Score {clip.virality}
                </Badge>
              </div>
            </div>
          </div>

          <Separator className="bg-border/50" />

          <div>
            <p className="text-xs text-muted-foreground mb-3 uppercase tracking-widest">Caption style</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {captionStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={cn(
                    "p-3 rounded-xl border text-left transition-all",
                    selectedStyle === style.id
                      ? "border-primary/50 bg-primary/10"
                      : "border-border/60 bg-card hover:border-border"
                  )}
                >
                  <p className="text-xs font-medium mb-0.5">{style.name}</p>
                  <p className="text-[10px] text-muted-foreground">{style.preview}</p>
                </button>
              ))}
            </div>
          </div>

          <Separator className="bg-border/50" />

          <div>
            <p className="text-xs text-muted-foreground mb-3 uppercase tracking-widest">Export format</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {exportFormats.map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => setSelectedFormat(fmt.id)}
                  className={cn(
                    "p-3 rounded-xl border text-left transition-all",
                    selectedFormat === fmt.id
                      ? "border-primary/50 bg-primary/10"
                      : "border-border/60 bg-card hover:border-border"
                  )}
                >
                  <fmt.icon className={cn("size-4 mb-1.5", selectedFormat === fmt.id ? "text-primary" : "text-muted-foreground")} />
                  <p className="text-xs font-medium">{fmt.label}</p>
                  <p className="text-[10px] text-muted-foreground">{fmt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="w-80 flex flex-col overflow-hidden">
          <Tabs defaultValue="titles" className="flex flex-col h-full">
            <TabsList className="rounded-none border-b border-border/50 bg-transparent h-10 px-3 gap-2 justify-start shrink-0">
              <TabsTrigger value="titles" className="text-xs data-[state=active]:text-primary rounded-none pb-2 pt-2">Titles</TabsTrigger>
              <TabsTrigger value="desc" className="text-xs data-[state=active]:text-primary rounded-none pb-2 pt-2">Descriptions</TabsTrigger>
              <TabsTrigger value="tags" className="text-xs data-[state=active]:text-primary rounded-none pb-2 pt-2">Tags</TabsTrigger>
            </TabsList>

            <TabsContent value="titles" className="flex-1 overflow-hidden m-0">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-2">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3">AI-generated titles</p>
                  {clip.metadata.titles.map((t: string, i: number) => (
                    <div key={i} className="bg-card border border-border/60 rounded-lg p-3 group">
                      <p className="text-xs leading-relaxed mb-2">{t}</p>
                      <button
                        onClick={() => { navigator.clipboard.writeText(t); toast.success("Copied!"); }}
                        className="text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                      >
                        <Copy className="size-2.5" /> Copy
                      </button>
                    </div>
                  ))}
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-4 mb-3">Hook variations</p>
                  {clip.metadata.hooks.map((h: string, i: number) => (
                    <div key={i} className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                      <p className="text-xs leading-relaxed text-primary mb-2">"{h}"</p>
                      <button
                        onClick={() => { navigator.clipboard.writeText(h); toast.success("Copied!"); }}
                        className="text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                      >
                        <Copy className="size-2.5" /> Copy
                      </button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="desc" className="flex-1 overflow-hidden m-0">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-2">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3">AI-generated descriptions</p>
                  {clip.metadata.descriptions.map((d: string, i: number) => (
                    <div key={i} className="bg-card border border-border/60 rounded-lg p-3">
                      <p className="text-xs leading-relaxed mb-2">{d}</p>
                      <button
                        onClick={() => { navigator.clipboard.writeText(d); toast.success("Copied!"); }}
                        className="text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                      >
                        <Copy className="size-2.5" /> Copy
                      </button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="tags" className="flex-1 overflow-hidden m-0">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3">Hashtags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {clip.metadata.hashtags.map((tag: string) => (
                      <button
                        key={tag}
                        onClick={() => { navigator.clipboard.writeText(tag); toast.success("Copied!"); }}
                        className="text-[11px] px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 transition-colors flex items-center gap-1"
                      >
                        <Hash className="size-2.5" /> {tag.slice(1)}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => { navigator.clipboard.writeText(clip.metadata.hashtags.join(" ")); toast.success("All hashtags copied!"); }}
                    className="mt-4 text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <Copy className="size-3" /> Copy all hashtags
                  </button>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
