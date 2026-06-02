import { useRef, useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Separator } from "../components/ui/separator";
import { cn } from "../components/ui/utils";
import * as store from "../lib/videoStore";
import { toast } from "sonner";

interface Clip {
  id: string;
  name: string;
  start: number;
  end: number;
  blob?: Blob;
  url?: string;
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

function toTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function toTimeInput(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function parseTime(str: string): number {
  const parts = str.split(":").map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

function formatSrtTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toFixed(3).padStart(6, "0")}`;
}

async function analyzeAudio(videoUrl: string): Promise<{ time: number; energy: number }[]> {
  try {
    const ctx = new AudioContext();
    const res = await fetch(videoUrl);
    const buf = await res.arrayBuffer();
    const audio = await ctx.decodeAudioData(buf);
    const data = audio.getChannelData(0);
    const windowMs = 1;
    const samplesPerWindow = audio.sampleRate * windowMs;
    const peaks: { time: number; energy: number }[] = [];
    for (let i = 0; i < data.length; i += samplesPerWindow) {
      let sum = 0;
      for (let j = 0; j < samplesPerWindow && i + j < data.length; j++) {
        sum += Math.abs(data[i + j]);
      }
      peaks.push({ time: i / audio.sampleRate, energy: sum / samplesPerWindow });
    }
    ctx.close();
    return peaks;
  } catch {
    return [];
  }
}

function suggestClips(peaks: { time: number; energy: number }[], minDuration = 10): { start: number; end: number }[] {
  const threshold = peaks.reduce((a, p) => Math.max(a, p.energy), 0) * 0.4;
  const suggestions: { start: number; end: number }[] = [];
  let inClip = false;
  let clipStart = 0;
  for (const p of peaks) {
    if (p.energy > threshold && !inClip) {
      clipStart = p.time;
      inClip = true;
    } else if (p.energy <= threshold && inClip) {
      const dur = p.time - clipStart;
      if (dur >= minDuration) {
        suggestions.push({ start: Math.max(0, clipStart - 2), end: p.time + 2 });
      }
      inClip = false;
    }
  }
  if (inClip) {
    const last = peaks[peaks.length - 1];
    if (last.time - clipStart >= minDuration) {
      suggestions.push({ start: Math.max(0, clipStart - 2), end: last.time });
    }
  }
  return suggestions;
}

export default function ProjectDetail() {
  const { id } = useParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [record, setRecord] = useState(store.get(id || ""));
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const [clips, setClips] = useState<Clip[]>([]);
  const [clipStart, setClipStart] = useState<number | null>(null);
  const [clipEnd, setClipEnd] = useState<number | null>(null);
  const [clipName, setClipName] = useState("");
  const [exportingClip, setExportingClip] = useState<string | null>(null);
  const [smartClips, setSmartClips] = useState<{ start: number; end: number }[]>([]);

  const [captions, setCaptions] = useState<Caption[]>([]);
  const [captionText, setCaptionText] = useState("");
  const [captionTime, setCaptionTime] = useState("0:00");
  const [activeStyle, setActiveStyle] = useState("modern");

  useEffect(() => {
    store.init().then(() => {
      const r = store.get(id || "");
      setRecord(r);
      if (r) {
        analyzeAudio(r.url).then((peaks) => {
          const suggestions = suggestClips(peaks, 8);
          setSmartClips(suggestions);
        });
      }
    });
  }, [id]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleDownload = useCallback(() => {
    if (!record) return;
    const a = document.createElement("a");
    a.href = record.url;
    a.download = record.name;
    a.click();
  }, [record]);

  const markClipStart = () => {
    setClipStart(currentTime);
    setClipEnd(null);
    setClipName("");
    toast.info(`Start set at ${toTime(currentTime)}`);
  };

  const markClipEnd = () => {
    if (clipStart === null) {
      toast.error("Set start point first");
      return;
    }
    if (currentTime <= clipStart) {
      toast.error("End must be after start");
      return;
    }
    setClipEnd(currentTime);
    const name = clipName.trim() || `Clip ${clips.length + 1}`;
    const newClip: Clip = {
      id: `clip-${Date.now()}`,
      name,
      start: clipStart,
      end: currentTime,
    };
    setClips([...clips, newClip]);
    setClipStart(null);
    setClipEnd(null);
    setClipName("");
    toast.success(`Clip "${name}" created`);
  };

  const addSmartClip = async (s: { start: number; end: number }) => {
    const name = `Smart clip ${clips.length + 1}`;
    const newClip: Clip = { id: `clip-${Date.now()}`, name, start: s.start, end: s.end };
    setClips([...clips, newClip]);
    toast.success(`Smart clip created`);
  };

  const exportClip = async (clip: Clip) => {
    const video = videoRef.current;
    if (!video) return;
    setExportingClip(clip.id);
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
        const dur = (clip.end - clip.start) * 1000;
        setTimeout(() => {
          video.pause();
          mr.stop();
        }, dur);
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${clip.name.replace(/\s+/g, "_")}.webm`;
      a.click();
      toast.success(`Clip "${clip.name}" downloaded`);
    } catch (e: any) {
      toast.error(`Export failed: ${e.message}. Try a different browser (Chrome recommended).`);
    }
    setExportingClip(null);
  };

  const addCaption = () => {
    const time = parseTime(captionTime);
    if (!captionText.trim()) {
      toast.error("Enter caption text");
      return;
    }
    setCaptions([...captions, { id: `cap-${Date.now()}`, text: captionText.trim(), time }].sort((a, b) => a.time - b.time));
    setCaptionText("");
    toast.success("Caption added");
  };

  const exportSrt = () => {
    if (captions.length === 0) {
      toast.error("No captions to export");
      return;
    }
    const lines = captions.map((c, i) => {
      const nextTime = i < captions.length - 1 ? captions[i + 1].time : c.time + 3;
      return `${i + 1}\n${formatSrtTime(c.time)} --> ${formatSrtTime(nextTime)}\n${c.text}`;
    });
    const srt = lines.join("\n\n");
    const blob = new Blob([srt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${record?.name.replace(/\.[^.]+$/, "") || "captions"}.srt`;
    a.click();
    toast.success("SRT captions downloaded");
  };

  const deleteCaption = (id: string) => {
    setCaptions(captions.filter((c) => c.id !== id));
  };

  const deleteClip = (id: string) => {
    const clip = clips.find((c) => c.id === id);
    if (clip?.url) URL.revokeObjectURL(clip.url);
    setClips(clips.filter((c) => c.id !== id));
  };

  const seekTo = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  if (!record) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border/50">
          <Link to="/projects">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Projects</Button>
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Video not found</p>
            <Link to="/projects"><Button variant="outline" className="mt-4">Back to projects</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border/50 shrink-0">
        <Link to="/projects">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Projects</Button>
        </Link>
        <div className="h-4 w-px bg-border/50" />
        <h1 className="text-sm font-medium truncate flex-1">{record.name}</h1>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 flex flex-col bg-black min-h-0">
          <div className="flex-1 flex items-center justify-center p-4">
            <video
              ref={videoRef}
              src={record.url}
              className="max-w-full max-h-full rounded-lg shadow-2xl"
              controls
              onTimeUpdate={handleTimeUpdate}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              style={{ maxHeight: "calc(100vh - 16rem)" }}
            />
          </div>
          <div className="flex items-center gap-2 px-6 py-2 bg-black/80 border-t border-white/10">
            <span className="text-xs text-white/60 font-mono">{toTime(currentTime)}</span>
            <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${(currentTime / (videoRef.current?.duration || 1)) * 100}%` }}
              />
            </div>
            <span className="text-xs text-white/60 font-mono">{toTime(videoRef.current?.duration || 0)}</span>
          </div>
        </div>

        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-border/50 flex flex-col bg-background overflow-hidden">
          <Tabs defaultValue="clips" className="flex flex-col h-full">
            <TabsList className="rounded-none border-b border-border/50 bg-transparent h-10 px-3 gap-0 justify-start shrink-0">
              <TabsTrigger value="clips" className="text-xs data-[state=active]:text-primary rounded-none pb-2 pt-2 px-3">Clips</TabsTrigger>
              <TabsTrigger value="captions" className="text-xs data-[state=active]:text-primary rounded-none pb-2 pt-2 px-3">Captions</TabsTrigger>
              <TabsTrigger value="export" className="text-xs data-[state=active]:text-primary rounded-none pb-2 pt-2 px-3">Export</TabsTrigger>
            </TabsList>

            <TabsContent value="clips" className="flex-1 overflow-auto m-0 p-4 space-y-4">
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">Mark a section of the video and create a clip.</p>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="text-xs border-border/60" onClick={markClipStart} disabled={clipStart !== null}>
                    Mark start
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs border-border/60" onClick={markClipEnd}>
                    Mark end
                  </Button>
                </div>
                {clipStart !== null && (
                  <p className="text-xs text-primary">Start: {toTime(clipStart)}</p>
                )}
                <Input
                  placeholder="Clip name (optional)"
                  value={clipName}
                  onChange={(e) => setClipName(e.target.value)}
                  className="h-8 text-sm bg-muted/40 border-border/50"
                />
              </div>

              <Separator className="bg-border/50" />

              {smartClips.length > 0 && (
                <div>
                  <p className="text-xs font-medium mb-2">Suggested clips (based on audio)</p>
                  <div className="space-y-1.5">
                    {smartClips.map((s, i) => (
                      <div key={i} className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-lg p-2.5">
                        <span className="text-xs">{toTime(s.start)} - {toTime(s.end)} ({Math.round(s.end - s.start)}s)</span>
                        <Button size="sm" variant="ghost" className="h-6 text-[10px] text-primary" onClick={() => addSmartClip(s)}>
                          Add
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Separator className="bg-border/50 my-3" />
                </div>
              )}

              {clips.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-xs text-muted-foreground">No clips yet</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">Mark start/end points above to create one</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs font-medium">{clips.length} clip{clips.length > 1 ? "s" : ""}</p>
                  {clips.map((clip) => (
                    <div key={clip.id} className="bg-card border border-border/60 rounded-lg p-3 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-medium">{clip.name}</p>
                          <p className="text-[10px] text-muted-foreground">{toTime(clip.start)} - {toTime(clip.end)} ({(clip.end - clip.start).toFixed(1)}s)</p>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="h-6 text-[10px]" onClick={() => seekTo(clip.start)}>
                            Jump
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 text-[10px]" onClick={() => deleteClip(clip.id)}>
                            X
                          </Button>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="w-full h-7 text-xs bg-primary hover:bg-primary/90 text-white"
                        onClick={() => exportClip(clip)}
                        disabled={exportingClip === clip.id}
                      >
                        {exportingClip === clip.id ? "Exporting..." : "Download clip"}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="captions" className="flex-1 overflow-auto m-0 p-4 space-y-4">
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">Add timed captions to display on the video.</p>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label className="text-[10px] text-muted-foreground">Time (m:ss)</Label>
                    <Input value={captionTime} onChange={(e) => setCaptionTime(e.target.value)} className="h-8 text-sm bg-muted/40 border-border/50 mt-0.5" />
                  </div>
                  <div className="flex-[2]">
                    <Label className="text-[10px] text-muted-foreground">Text</Label>
                    <Input value={captionText} onChange={(e) => setCaptionText(e.target.value)} placeholder="Caption text" className="h-8 text-sm bg-muted/40 border-border/50 mt-0.5" onKeyDown={(e) => e.key === "Enter" && addCaption()} />
                  </div>
                </div>
                <Button size="sm" className="w-full h-7 text-xs bg-primary hover:bg-primary/90 text-white" onClick={addCaption}>
                  Add caption
                </Button>
              </div>

              <div>
                <p className="text-xs font-medium mb-2">Style</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {captionStyles.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setActiveStyle(s.id)}
                      className={cn(
                        "p-2 rounded-lg border text-[10px] text-left transition-all",
                        activeStyle === s.id ? "border-primary/50 bg-primary/10" : "border-border/60 bg-card hover:border-border"
                      )}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>

              {captions.length > 0 && (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium">{captions.length} caption{captions.length > 1 ? "s" : ""}</p>
                    <Button size="sm" variant="outline" className="h-6 text-[10px] border-border/60" onClick={exportSrt}>
                      Download SRT
                    </Button>
                  </div>
                  <div className="space-y-1.5 max-h-48 overflow-auto">
                    {captions.map((c) => (
                      <div key={c.id} className="flex items-start justify-between bg-card border border-border/60 rounded-lg p-2">
                        <div>
                          <span className="text-[10px] text-muted-foreground font-mono">{toTime(c.time)}</span>
                          <p className="text-xs">{c.text}</p>
                        </div>
                        <button onClick={() => deleteCaption(c.id)} className="text-[10px] text-muted-foreground hover:text-destructive">X</button>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {captions.length > 0 && videoRef.current && (
                <div className="relative bg-black rounded-lg overflow-hidden" style={{ height: 80 }}>
                  <div className="absolute inset-0 flex items-end justify-center pb-3 px-2">
                    {captions
                      .filter((c) => {
                        const idx = captions.indexOf(c);
                        const next = captions[idx + 1];
                        return currentTime >= c.time && (!next || currentTime < next.time);
                      })
                      .map((c) => (
                        <span key={c.id} className={cn("text-center text-sm leading-tight", captionStyles.find((s) => s.id === activeStyle)?.className)}>
                          {c.text}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {captions.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-xs text-muted-foreground">No captions yet</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="export" className="flex-1 overflow-auto m-0 p-4 space-y-4">
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">Download your video, clips, and captions.</p>

                <div className="bg-card border border-border/60 rounded-xl divide-y divide-border/50">
                  <button onClick={handleDownload} className="w-full text-left px-4 py-3 hover:bg-accent/30 transition-colors">
                    <p className="text-xs font-medium">Original video</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{record.name}</p>
                  </button>
                  {clips.length > 0 && (
                    <button onClick={() => exportClip(clips[clips.length - 1])} className="w-full text-left px-4 py-3 hover:bg-accent/30 transition-colors" disabled={exportingClip !== null}>
                      <p className="text-xs font-medium">Latest clip</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{clips[clips.length - 1].name} ({clips.length} total)</p>
                    </button>
                  )}
                  {captions.length > 0 && (
                    <button onClick={exportSrt} className="w-full text-left px-4 py-3 hover:bg-accent/30 transition-colors">
                      <p className="text-xs font-medium">SRT captions</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{captions.length} caption{captions.length > 1 ? "s" : ""}</p>
                    </button>
                  )}
                </div>

                <Separator className="bg-border/50" />

                <div>
                  <p className="text-xs font-medium mb-2">Video info</p>
                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    <p>Name: {record.name}</p>
                    <p>Size: {record.size > 1024 * 1024 ? `${(record.size / 1024 / 1024).toFixed(1)} MB` : `${(record.size / 1024).toFixed(1)} KB`}</p>
                    <p>Duration: {toTime(videoRef.current?.duration || 0)}</p>
                    <p>Uploaded: {record.date}</p>
                    <p>Clips: {clips.length}</p>
                    <p>Captions: {captions.length}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
