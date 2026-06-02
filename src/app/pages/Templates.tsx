import { useState } from "react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import { Separator } from "../components/ui/separator";
import { cn } from "../components/ui/utils";
import { toast } from "sonner";

const templates = [
  {
    id: "minimal",
    name: "Minimal",
    desc: "Clean, lightweight captions.",
    preview: ["Clean text", "No background", "Thin weight"],
    sampleText: "Every rejection made us stronger.",
    textClass: "font-light tracking-wide text-white drop-shadow",
    locked: false,
    tag: null,
  },
  {
    id: "modern",
    name: "Modern",
    desc: "Bold typography with subtle drop shadow.",
    preview: ["Bold weight", "Drop shadow", "Auto contrast"],
    sampleText: "Every rejection made us stronger.",
    textClass: "font-semibold text-white drop-shadow-lg",
    locked: false,
    tag: "Popular",
  },
  {
    id: "podcast",
    name: "Podcast",
    desc: "Pill-shaped background. Centered text.",
    preview: ["Pill background", "Centered", "Color-coded speakers"],
    sampleText: "Every rejection made us stronger.",
    textClass: "font-medium text-white bg-black/70 px-3 py-1 rounded-full backdrop-blur",
    locked: false,
    tag: null,
  },
  {
    id: "bold",
    name: "Bold",
    desc: "Massive, punchy text. Built for TikTok and Reels.",
    preview: ["Ultra bold", "All caps", "Full screen width"],
    sampleText: "EVERY REJECTION MADE US STRONGER.",
    textClass: "font-black uppercase tracking-tight text-white",
    locked: false,
    tag: "High impact",
  },
  {
    id: "hormozi",
    name: "Hormozi",
    desc: "Yellow highlight on key words.",
    preview: ["Word highlights", "Key word emphasis", "Bold + yellow"],
    sampleText: null,
    textClass: "font-black text-white",
    locked: false,
    tag: "Trending",
  },
];

function HormoziPreview() {
  const words = ["Every", "rejection", "made", "us", "STRONGER."];
  const highlight = [1, 4];
  return (
    <div className="flex flex-wrap gap-1 justify-center">
      {words.map((w, i) => (
        <span
          key={i}
          className={cn(
            "font-black text-lg",
            highlight.includes(i) ? "bg-yellow-400 text-black px-1 rounded" : "text-white"
          )}
        >
          {w}
        </span>
      ))}
    </div>
  );
}

export default function Templates() {
  const [active, setActive] = useState("modern");
  const [wordHighlight, setWordHighlight] = useState(true);
  const [autoColor, setAutoColor] = useState(true);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Caption Templates</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Choose a style preset for clips.</p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 text-white"
          onClick={() => toast.success(`"${templates.find((t) => t.id === active)?.name}" set as default`)}
        >
          Save default
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((tmpl) => (
          <button
            key={tmpl.id}
            onClick={() => !tmpl.locked && setActive(tmpl.id)}
            className={cn(
              "text-left rounded-2xl border overflow-hidden transition-all",
              active === tmpl.id
                ? "border-primary/60"
                : "border-border/60 hover:border-border",
              tmpl.locked && "opacity-60 cursor-not-allowed"
            )}
          >
            <div className="h-32 bg-muted flex items-center justify-center px-4">
              {tmpl.id === "hormozi" ? (
                <HormoziPreview />
              ) : (
                <span className={cn("text-center leading-tight", tmpl.textClass)}>
                  {tmpl.sampleText}
                </span>
              )}
            </div>
            <div className="p-4 bg-card">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{tmpl.name}</span>
                  {tmpl.tag && (
                    <Badge variant="secondary" className="text-[9px] h-4 px-1.5 bg-primary/10 text-primary border-0">
                      {tmpl.tag}
                    </Badge>
                  )}
                </div>
                {active === tmpl.id && (
                  <div className="size-5 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{tmpl.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {tmpl.preview.map((p) => (
                  <span key={p} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>

      <Separator className="bg-border/50" />

      <div className="space-y-4">
        <h2 className="text-sm font-medium">Global options</h2>
        <div className="bg-card border border-border/60 rounded-xl divide-y divide-border/50">
          <div className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium">Word-by-word highlight</p>
              <p className="text-xs text-muted-foreground mt-0.5">Highlight the current spoken word as the video plays</p>
            </div>
            <Switch checked={wordHighlight} onCheckedChange={setWordHighlight} />
          </div>
          <div className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium">Auto-contrast text</p>
              <p className="text-xs text-muted-foreground mt-0.5">Automatically pick white or black text based on background</p>
            </div>
            <Switch checked={autoColor} onCheckedChange={setAutoColor} />
          </div>
          <div className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium">Default aspect ratio</p>
              <p className="text-xs text-muted-foreground mt-0.5">Used when creating clips from a project</p>
            </div>
            <div className="flex items-center gap-1 bg-muted/40 border border-border/50 rounded-lg p-1">
              {["9:16", "1:1", "16:9"].map((r) => (
                <button
                  key={r}
                  className={cn(
                    "px-2.5 py-1 text-xs rounded-md transition-all",
                    r === "9:16" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
