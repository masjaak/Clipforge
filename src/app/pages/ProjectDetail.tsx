import { useState } from "react";
import { Link, useParams } from "react-router";
import {
  Play, Pause, Volume2, Maximize2, ChevronLeft, Scissors,
  Zap, TrendingUp, Clock, Download, SkipBack, SkipForward,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ScrollArea } from "../components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { cn } from "../components/ui/utils";

const projectData: Record<string, {
  title: string; duration: string; clips: Clip[]; segments: Segment[]; transcript: TranscriptWord[];
}> = {
  "proj-1": {
    title: "Founder story — from 0 to $1M ARR",
    duration: "32:14",
    segments: [
      { id: "s1", start: "0:42", end: "2:10", score: 92, category: "hook", reason: "Compelling origin story opener", hook: "I was rejected by 47 VCs before we hit $1M ARR", transcript_text: "I was rejected by 47 VCs before we hit $1M ARR. Every single one said the market was too small. They were wrong." },
      { id: "s2", start: "5:18", end: "7:34", score: 87, category: "conflict", reason: "High emotional tension, relatable struggle", hook: "We almost ran out of money with 8 employees on payroll", transcript_text: "We almost ran out of money with 8 employees on payroll. I had to call every customer personally and ask for prepayment." },
      { id: "s3", start: "12:44", end: "14:22", score: 81, category: "education", reason: "Actionable pricing insight", hook: "The $9 to $99 pricing change that doubled our revenue overnight", transcript_text: "The $9 to $99 pricing change that doubled our revenue overnight. Price anchoring works even in B2B SaaS." },
      { id: "s4", start: "18:05", end: "19:55", score: 76, category: "story", reason: "Emotional customer win moment", hook: "Our first enterprise customer cried on the demo call", transcript_text: "Our first enterprise customer cried on the demo call. They said we solved a problem they'd had for six years." },
      { id: "s5", start: "24:11", end: "26:30", score: 94, category: "surprise", reason: "Unexpected revenue milestone reveal", hook: "We crossed $83K MRR on a Tuesday with zero marketing spend", transcript_text: "We crossed $83K MRR on a Tuesday with zero marketing spend. Just word of mouth from people who genuinely loved the product." },
    ],
    clips: [
      { id: "clip-1", title: "47 VCs said no — then we hit $1M", duration: "1:28", virality: 92, hook: 88, retention: 85, status: "ready", thumb: "from-violet-900/60 to-violet-950/80" },
      { id: "clip-2", title: "8 employees, zero runway", duration: "2:16", virality: 87, hook: 82, retention: 79, status: "ready", thumb: "from-rose-900/60 to-rose-950/80" },
      { id: "clip-3", title: "Pricing hack that 2× revenue", duration: "1:38", virality: 81, hook: 78, retention: 74, status: "ready", thumb: "from-amber-900/60 to-amber-950/80" },
      { id: "clip-4", title: "Enterprise customer cried on demo", duration: "1:50", virality: 76, hook: 71, retention: 68, status: "rendering", thumb: "from-blue-900/60 to-blue-950/80" },
      { id: "clip-5", title: "$83K MRR with zero marketing", duration: "2:19", virality: 94, hook: 91, retention: 88, status: "ready", thumb: "from-emerald-900/60 to-emerald-950/80" },
    ],
    transcript: generateTranscript(),
  },
};

function generateTranscript(): TranscriptWord[] {
  const words = [
    "I", "was", "rejected", "by", "47", "VCs", "before", "we", "hit", "$1M", "ARR.", "Every", "single", "one", "said", "the", "market", "was", "too", "small.", "They", "were", "wrong.", "It", "started", "in", "2021,", "when", "my", "co-founder", "and", "I", "were", "working", "out", "of", "a", "WeWork", "in", "Austin,", "Texas.", "We", "had", "a", "simple", "idea:", "make", "video", "editing", "accessible", "to", "everyone.", "Sounds", "naive,", "right?", "But", "we", "believed", "in", "it.", "We", "almost", "ran", "out", "of", "money", "with", "8", "employees", "on", "payroll.", "I", "had", "to", "call", "every", "single", "customer", "personally", "and", "ask", "for", "prepayment.", "Most", "of", "them", "said", "yes.", "That's", "when", "I", "knew", "we", "had", "something.", "The", "$9", "to", "$99", "pricing", "change", "that", "doubled", "our", "revenue", "overnight.",
  ];
  let time = 42;
  return words.map((word, i) => {
    const start = time;
    time += 0.3 + Math.random() * 0.4;
    return { id: `w${i}`, word, start, end: time, highlight: i >= 0 && i <= 22 };
  });
}

type TranscriptWord = { id: string; word: string; start: number; end: number; highlight: boolean };
type Segment = { id: string; start: string; end: string; score: number; category: string; reason: string; hook: string; transcript_text: string };
type Clip = { id: string; title: string; duration: string; virality: number; hook: number; retention: number; status: string; thumb: string };

const categoryColors: Record<string, string> = {
  hook: "text-violet-400 bg-violet-400/10 border-violet-400/20",
  conflict: "text-rose-400 bg-rose-400/10 border-rose-400/20",
  education: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  story: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  surprise: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
};

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 90 ? "text-emerald-400" : score >= 80 ? "text-amber-400" : "text-muted-foreground";
  return <span className={cn("font-mono text-xs font-semibold", color)}>{score}</span>;
}

export default function ProjectDetail() {
  const { id = "proj-1" } = useParams();
  const project = projectData[id] || projectData["proj-1"];
  const [playing, setPlaying] = useState(false);
  const [activeSegment, setActiveSegment] = useState<string | null>(null);
  const [selectedClip, setSelectedClip] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)]">
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border/50 shrink-0">
        <Link to="/projects">
          <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-muted-foreground hover:text-foreground text-xs">
            <ChevronLeft className="size-3.5" /> Projects
          </Button>
        </Link>
        <div className="h-4 w-px bg-border/50" />
        <h1 className="text-sm font-medium truncate flex-1">{project.title}</h1>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="secondary" className="text-[10px] bg-muted text-muted-foreground h-5">
            <Clock className="size-2.5 mr-1" /> {project.duration}
          </Badge>
          <Button size="sm" className="h-7 gap-1.5 text-xs bg-primary hover:bg-primary/90 text-white">
            <Download className="size-3" /> Export all
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-[30%] min-w-60 border-r border-border/50 flex flex-col">
          <div className="bg-black/60 aspect-video flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-950/40 to-black/60 flex items-center justify-center">
              <button
                onClick={() => setPlaying(!playing)}
                className="size-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur flex items-center justify-center transition-all border border-white/10"
              >
                {playing ? <Pause className="size-5 text-white" /> : <Play className="size-5 text-white ml-0.5" />}
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
              <div className="h-1 bg-white/20 rounded-full mb-2">
                <div className="h-full w-[22%] bg-primary rounded-full" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button onClick={() => setPlaying(!playing)} className="text-white/70 hover:text-white">
                    {playing ? <Pause className="size-3" /> : <Play className="size-3" />}
                  </button>
                  <button className="text-white/70 hover:text-white"><SkipBack className="size-3" /></button>
                  <button className="text-white/70 hover:text-white"><SkipForward className="size-3" /></button>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-white/60 font-mono">7:08 / {project.duration}</span>
                  <button className="text-white/70 hover:text-white"><Volume2 className="size-3" /></button>
                  <button className="text-white/70 hover:text-white"><Maximize2 className="size-3" /></button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 border-b border-border/50">
            <p className="text-[11px] text-muted-foreground mb-2">AI Segments ({project.segments.length})</p>
            <ScrollArea className="h-[calc(100vh-26rem)]">
              <div className="space-y-1.5 pr-2">
                {project.segments.map((seg) => (
                  <button
                    key={seg.id}
                    onClick={() => setActiveSegment(activeSegment === seg.id ? null : seg.id)}
                    className={cn(
                      "w-full text-left rounded-lg border p-2.5 transition-all",
                      activeSegment === seg.id
                        ? "bg-primary/10 border-primary/30"
                        : "bg-card border-border/50 hover:border-border"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={cn("text-[9px] px-1.5 py-0.5 rounded-full border capitalize font-medium", categoryColors[seg.category])}>
                        {seg.category}
                      </span>
                      <ScoreBadge score={seg.score} />
                    </div>
                    <p className="text-[11px] text-foreground/80 line-clamp-2 leading-relaxed">{seg.hook}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                      <Clock className="size-2.5" /> {seg.start} – {seg.end}
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <div className="flex-1 border-r border-border/50 flex flex-col overflow-hidden">
          <Tabs defaultValue="transcript" className="flex flex-col h-full">
            <TabsList className="rounded-none border-b border-border/50 bg-transparent h-10 px-4 gap-4 justify-start shrink-0">
              <TabsTrigger value="transcript" className="text-xs data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-2 pt-2">
                Transcript
              </TabsTrigger>
              <TabsTrigger value="segments" className="text-xs data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-2 pt-2">
                Segment analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transcript" className="flex-1 overflow-hidden m-0">
              <ScrollArea className="h-full">
                <div className="p-5 leading-[2] text-sm">
                  {project.transcript.map((w) => (
                    <span
                      key={w.id}
                      className={cn(
                        "cursor-pointer hover:text-foreground transition-colors mr-0.5 rounded px-0.5",
                        w.highlight
                          ? "bg-primary/20 text-primary"
                          : "text-muted-foreground"
                      )}
                      title={`${w.start.toFixed(1)}s`}
                    >
                      {w.word}
                    </span>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="segments" className="flex-1 overflow-hidden m-0">
              <ScrollArea className="h-full">
                <div className="p-5 space-y-3">
                  {project.segments.map((seg) => (
                    <div key={seg.id} className="bg-card border border-border/60 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <span className={cn("text-[10px] px-2 py-0.5 rounded-full border capitalize font-medium", categoryColors[seg.category])}>
                            {seg.category}
                          </span>
                          <span className="text-[11px] text-muted-foreground">{seg.start} – {seg.end}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="size-3 text-muted-foreground" />
                          <ScoreBadge score={seg.score} />
                        </div>
                      </div>
                      <p className="text-xs font-medium text-primary mb-1">"{seg.hook}"</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{seg.transcript_text}</p>
                      <p className="text-[11px] text-muted-foreground/70 mt-1.5 italic">{seg.reason}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        <div className="w-[28%] min-w-56 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-border/50 flex items-center justify-between shrink-0">
            <span className="text-[11px] text-muted-foreground">Clips ({project.clips.length})</span>
            <Button size="sm" variant="ghost" className="h-6 text-[10px] gap-1 text-primary hover:text-primary hover:bg-primary/10">
              <Scissors className="size-2.5" /> Create clip
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-2">
              {project.clips.map((clip) => (
                <Link key={clip.id} to={`/clips/${clip.id}`}>
                  <div
                    className={cn(
                      "rounded-xl border overflow-hidden cursor-pointer transition-all hover:border-primary/40",
                      selectedClip === clip.id ? "border-primary/40 bg-primary/5" : "border-border/60 bg-card"
                    )}
                    onClick={() => setSelectedClip(clip.id)}
                  >
                    <div className={cn("h-20 bg-gradient-to-br flex items-center justify-center relative", clip.thumb)}>
                      <Play className="size-5 text-white/30" />
                      {clip.status === "rendering" && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="size-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                        </div>
                      )}
                    </div>
                    <div className="p-2.5">
                      <p className="text-[11px] font-medium leading-snug line-clamp-2 mb-1.5">{clip.title}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Zap className="size-2.5 text-primary" />
                          <span className="font-mono text-[10px] text-primary font-semibold">{clip.virality}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="size-2.5 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">{clip.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
