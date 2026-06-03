import { useRef, useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { cn } from "../components/ui/utils";
import * as store from "../lib/videoStore";
import { toast } from "sonner";

interface Highlight {
  start: number;
  end: number;
  score: number;
}

interface Clip {
  id: string;
  name: string;
  start: number;
  end: number;
  score: number;
}

interface Caption {
  id: string;
  text: string;
  time: number;
}

const captionStyles = [
  { id: "minimal", name: "Minimal", className: "font-light tracking-wide text-white drop-shadow" },
  { id: "modern", name: "Modern", className: "font-semibold text-white drop-shadow-lg" },
  { id: "podcast", name: "Podcast", className: "font-medium bg-black/60 px-3 py-1 rounded-full backdrop-blur text-white" },
  { id: "bold", name: "Bold", className: "font-black uppercase tracking-tight text-white" },
  { id: "hormozi", name: "Hormozi", className: "font-black text-white bg-yellow-400/30 px-1" },
];

function fmt(t: number) {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function fmtHms(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toFixed(3).padStart(6, "0")}`;
}

function parseTs(str: string): number {
  const p = str.split(":").map(Number);
  return p.length === 2 ? p[0] * 60 + p[1] : p[0] * 3600 + p[1] * 60 + p[2];
}

function smooth(arr: number[], n: number): number[] {
  const r: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    let s = 0, c = 0;
    for (let j = Math.max(0, i - n); j <= Math.min(arr.length - 1, i + n); j++) { s += arr[j]; c++; }
    r.push(s / c);
  }
  return r;
}

function detectHighlights(peaks: number[], windowSize: number): Highlight[] {
  const sorted = [...peaks].sort((a, b) => b - a);
  const threshold = sorted[Math.min(Math.floor(sorted.length * 0.2), sorted.length - 1)];

  const segs: { start: number; end: number; peak: number }[] = [];
  let inClip = false, startIdx = 0, peak = 0;
  for (let i = 0; i < peaks.length; i++) {
    if (peaks[i] > threshold && !inClip) { inClip = true; startIdx = i; peak = peaks[i]; }
    else if (inClip) {
      if (peaks[i] > peak) peak = peaks[i];
      if (peaks[i] <= threshold) {
        let dur = (i - startIdx) * windowSize;
        if (dur >= 8) {
          segs.push({ start: startIdx * windowSize, end: i * windowSize, peak });
        }
        inClip = false;
      }
    }
  }
  if (inClip) {
    let dur = (peaks.length - startIdx) * windowSize;
    if (dur >= 8) segs.push({ start: startIdx * windowSize, end: peaks.length * windowSize, peak });
  }

  const merged: Highlight[] = [];
  for (const s of segs) {
    const padStart = Math.max(0, s.start - 3);
    const padEnd = s.end + 3;
    if (merged.length > 0 && padStart - merged[merged.length - 1].end < 5) {
      merged[merged.length - 1].end = padEnd;
      merged[merged.length - 1].score = Math.max(merged[merged.length - 1].score, s.peak);
    } else {
      merged.push({ start: padStart, end: padEnd, score: s.peak });
    }
  }

  return merged.sort((a, b) => b.score - a.score);
}

async function analyzeVideo(url: string): Promise<Highlight[]> {
  try {
    const ctx = new AudioContext();
    const res = await fetch(url);
    const buf = await res.arrayBuffer();
    const audio = await ctx.decodeAudioData(buf);
    const ch = audio.getChannelData(0);
    const windowSize = 0.5;
    const sw = Math.floor(audio.sampleRate * windowSize);
    const energies: number[] = [];
    for (let i = 0; i < ch.length; i += sw) {
      let sum = 0, cnt = 0;
      for (let j = 0; j < sw && i + j < ch.length; j++) { sum += ch[i + j] ** 2; cnt++; }
      energies.push(Math.sqrt(sum / cnt));
    }
    ctx.close();
    const sm = smooth(energies, 4);
    return detectHighlights(sm, windowSize);
  } catch {
    return [];
  }
}

export default function ProjectDetail() {
  const { id } = useParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [record, setRecord] = useState(store.get(id || ""));
  const [analyzing, setAnalyzing] = useState(true);
  const [clips, setClips] = useState<Clip[]>([]);
  const [selectedClip, setSelectedClip] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [captionInput, setCaptionInput] = useState({ time: "0:00", text: "" });
  const [activeStyle, setActiveStyle] = useState("modern");
  const [exporting, setExporting] = useState<string | null>(null);

  useEffect(() => {
    store.init().then(async () => {
      const r = store.get(id || "");
      setRecord(r);
      if (r) {
        const highlights = await analyzeVideo(r.url);
        const autoClips: Clip[] = highlights.map((h, i) => ({
          id: `clip-${Date.now()}-${i}`,
          name: `Highlight ${i + 1}`,
          start: h.start,
          end: h.end,
          score: h.score,
        }));
        setClips(autoClips);
        setAnalyzing(false);
        if (autoClips.length > 0) {
          toast.success(`${autoClips.length} highlights detected!`);
        } else {
          toast.info("No highlights detected. Try a different video.");
        }
      } else {
        setAnalyzing(false);
      }
    });
  }, [id]);

  const exportClip = async (clip: Clip) => {
    const video = videoRef.current;
    if (!video) return;
    setExporting(clip.id);
    try {
      const stream = (video as any).captureStream();
      const mr = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9,opus" });
      const chunks: Blob[] = [];
      mr.ondataavailable = (e) => chunks.push(e.data);
      const blob = await new Promise<Blob>((resolve, reject) => {
        mr.onstop = () => resolve(new Blob(chunks, { type: "video/webm" }));
        mr.onerror = () => reject(new Error("Recording failed"));
        mr.start();
        video.currentTime = clip.start;
        video.play();
        setTimeout(() => { video.pause(); mr.stop(); }, (clip.end - clip.start) * 1000);
      });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${clip.name.replace(/\s+/g, "_")}.webm`;
      a.click();
      toast.success(`"${clip.name}" downloaded`);
    } catch (e: any) {
      toast.error(`Export failed: ${e.message}. Use Chrome.`);
    }
    setExporting(null);
  };

  const addCaption = () => {
    const t = parseTs(captionInput.time);
    if (!captionInput.text.trim()) return;
    setCaptions([...captions, { id: `c-${Date.now()}`, text: captionInput.text.trim(), time: t }].sort((a, b) => a.time - b.time));
    setCaptionInput({ ...captionInput, text: "" });
  };

  const exportSrt = () => {
    if (!captions.length) { toast.error("No captions"); return; }
    const lines = captions.map((c, i) => {
      const next = i < captions.length - 1 ? captions[i + 1].time : c.time + 3;
      return `${i + 1}\n${fmtHms(c.time)} --> ${fmtHms(next)}\n${c.text}`;
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([lines.join("\n\n")], { type: "text/plain" }));
    a.download = `${record?.name.replace(/\.[^.]+$/, "") || "captions"}.srt`;
    a.click();
    toast.success("SRT downloaded");
  };

  if (!record) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border/50">
          <Link to="/projects"><Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Back</Button></Link>
        </div>
        <div className="flex-1 flex items-center justify-center text-muted-foreground">Video not found</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="flex items-center gap-3 px-6 py-3 border-b border-border/50 shrink-0 bg-card">
        <Link to="/projects"><Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-xs">Projects</Button></Link>
        <div className="h-4 w-px bg-border/50" />
        <h1 className="text-sm font-medium truncate">{record.name}</h1>
      </header>

      <div className="flex-1 flex flex-col xl:flex-row overflow-hidden">
        <div className="flex-1 flex flex-col bg-black min-h-0">
          <div className="flex-1 flex items-center justify-center p-4">
            <video
              ref={videoRef}
              src={record.url}
              className="max-w-full max-h-full rounded-lg shadow-2xl"
              controls
              onTimeUpdate={() => videoRef.current && setCurrentTime(videoRef.current.currentTime)}
              style={{ maxHeight: "calc(100vh - 10rem)" }}
            />
          </div>
          <div className="flex items-center gap-3 px-6 py-2 bg-black/80 border-t border-white/10">
            <span className="text-xs text-white/50 font-mono">{fmt(currentTime)}</span>
            <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(currentTime / (videoRef.current?.duration || 1)) * 100}%` }} />
            </div>
            <span className="text-xs text-white/50 font-mono">{fmt(videoRef.current?.duration || 0)}</span>
            {clips.length > 0 && (
              <span className="text-[10px] text-primary/80 font-medium ml-2">{clips.length} highlights</span>
            )}
          </div>
        </div>

        <div className="w-full xl:w-96 border-t xl:border-t-0 xl:border-l border-border/50 flex flex-col bg-card overflow-hidden">
          <Tabs defaultValue="clips" className="flex flex-col h-full">
            <TabsList className="rounded-none border-b border-border/50 bg-transparent h-10 px-3 gap-0 justify-start shrink-0">
              <TabsTrigger value="clips" className="text-xs data-[state=active]:text-primary rounded-none pb-2 pt-2 px-3">Highlights</TabsTrigger>
              <TabsTrigger value="captions" className="text-xs data-[state=active]:text-primary rounded-none pb-2 pt-2 px-3">Captions</TabsTrigger>
              <TabsTrigger value="info" className="text-xs data-[state=active]:text-primary rounded-none pb-2 pt-2 px-3">Info</TabsTrigger>
            </TabsList>

            <TabsContent value="clips" className="flex-1 overflow-auto m-0 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {analyzing ? "Analyzing audio..." : clips.length > 0 ? `${clips.length} highlight${clips.length > 1 ? "s" : ""} detected` : "No highlights found"}
                </p>
                {analyzing && <span className="size-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />}
              </div>

              {analyzing && (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
                  ))}
                </div>
              )}

              {!analyzing && clips.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-sm text-muted-foreground">No highlights detected</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Try uploading a Mobile Legends gameplay video with audio</p>
                </div>
              )}

              {!analyzing && clips.map((clip) => (
                <div
                  key={clip.id}
                  className={cn(
                    "rounded-xl border overflow-hidden transition-all cursor-pointer",
                    selectedClip === clip.id ? "border-primary/50 bg-primary/5" : "border-border/60 bg-card hover:border-border"
                  )}
                  onClick={() => setSelectedClip(clip.id === selectedClip ? null : clip.id)}
                >
                  <div className="p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium">{clip.name}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {fmt(clip.start)} - {fmt(clip.end)}
                          <span className="ml-2">({(clip.end - clip.start).toFixed(0)}s)</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-mono text-primary font-semibold">{Math.round(clip.score * 100)}</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(clip.score * 100, 100)}%` }} />
                    </div>
                  </div>
                  {selectedClip === clip.id && (
                    <div className="px-3 pb-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 h-7 text-[10px] border-border/60"
                        onClick={() => { if (videoRef.current) videoRef.current.currentTime = clip.start; }}
                      >
                        Jump to start
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 h-7 text-[10px] bg-primary hover:bg-primary/90 text-white"
                        onClick={() => exportClip(clip)}
                        disabled={exporting === clip.id}
                      >
                        {exporting === clip.id ? "..." : "Download"}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </TabsContent>

            <TabsContent value="captions" className="flex-1 overflow-auto m-0 p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    value={captionInput.time}
                    onChange={(e) => setCaptionInput({ ...captionInput, time: e.target.value })}
                    className="w-20 h-8 text-xs bg-muted/40 border border-border/50 rounded-lg px-2 font-mono"
                    placeholder="0:00"
                  />
                  <input
                    value={captionInput.text}
                    onChange={(e) => setCaptionInput({ ...captionInput, text: e.target.value })}
                    className="flex-1 h-8 text-xs bg-muted/40 border border-border/50 rounded-lg px-2"
                    placeholder="Caption text"
                    onKeyDown={(e) => e.key === "Enter" && addCaption()}
                  />
                  <Button size="sm" className="h-8 text-xs bg-primary hover:bg-primary/90 text-white" onClick={addCaption}>Add</Button>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">Style</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {captionStyles.map((s) => (
                    <button key={s.id} onClick={() => setActiveStyle(s.id)}
                      className={cn("p-1.5 rounded-lg border text-[10px] text-left transition-all", activeStyle === s.id ? "border-primary/50 bg-primary/10" : "border-border/60 bg-card hover:border-border")}>
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>

              {captions.length > 0 && videoRef.current && (
                <div className="relative bg-black rounded-lg overflow-hidden" style={{ height: 72 }}>
                  <div className="absolute inset-0 flex items-end justify-center pb-3 px-2">
                    {captions.filter((c, i) => {
                      const next = captions[i + 1];
                      return currentTime >= c.time && (!next || currentTime < next.time);
                    }).map((c) => (
                      <span key={c.id} className={cn("text-center text-sm leading-tight", captionStyles.find(s => s.id === activeStyle)?.className)}>{c.text}</span>
                    ))}
                  </div>
                </div>
              )}

              {captions.length > 0 && (
                <div className="space-y-1 max-h-40 overflow-auto">
                  {captions.map((c) => (
                    <div key={c.id} className="flex items-center justify-between bg-card border border-border/60 rounded-lg p-2">
                      <div>
                        <span className="text-[10px] text-muted-foreground font-mono">{fmt(c.time)}</span>
                        <p className="text-xs">{c.text}</p>
                      </div>
                      <button onClick={() => setCaptions(captions.filter(x => x.id !== c.id))} className="text-[10px] text-muted-foreground hover:text-destructive">X</button>
                    </div>
                  ))}
                  <Button size="sm" variant="outline" className="w-full h-7 text-[10px] border-border/60 mt-2" onClick={exportSrt}>
                    Download SRT
                  </Button>
                </div>
              )}

              {captions.length === 0 && (
                <div className="text-center py-8"><p className="text-xs text-muted-foreground">No captions</p></div>
              )}
            </TabsContent>

            <TabsContent value="info" className="flex-1 overflow-auto m-0 p-4 space-y-4">
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="bg-card border border-border/60 rounded-xl p-4 space-y-2.5">
                  <InfoRow label="File" value={record.name} />
                  <InfoRow label="Size" value={record.size > 1048576 ? `${(record.size / 1048576).toFixed(1)} MB` : `${(record.size / 1024).toFixed(1)} KB`} />
                  <InfoRow label="Duration" value={fmt(videoRef.current?.duration || 0)} />
                  <InfoRow label="Uploaded" value={record.date} />
                  <InfoRow label="Highlights" value={`${clips.length}`} />
                  <InfoRow label="Captions" value={`${captions.length}`} />
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start text-xs border-border/60 h-9"
                  onClick={() => { const a = document.createElement("a"); a.href = record.url; a.download = record.name; a.click(); }}
                >
                  Download original video
                </Button>
                {clips.length > 0 && (
                  <Button
                    variant="outline"
                    className="w-full justify-start text-xs border-border/60 h-9"
                    onClick={() => exportClip(clips[0])}
                    disabled={exporting !== null}
                  >
                    Download best highlight
                  </Button>
                )}
                {captions.length > 0 && (
                  <Button variant="outline" className="w-full justify-start text-xs border-border/60 h-9" onClick={exportSrt}>
                    Download SRT captions
                  </Button>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground/70">{label}</span>
      <span className="text-foreground font-mono text-[11px] truncate ml-4">{value}</span>
    </div>
  );
}
