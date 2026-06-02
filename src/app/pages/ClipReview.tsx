import { useParams, useLocation, Link } from "react-router";
import { Button } from "../components/ui/button";
import { useState } from "react";

export default function ClipReview() {
  const { id } = useParams();
  const location = useLocation();
  const [selectedStyle, setSelectedStyle] = useState("modern");

  const videoUrl = (location.state as any)?.videoUrl || "";
  const videoName = (location.state as any)?.videoName || "Clip";

  const captionStyles = [
    { id: "minimal", name: "Minimal", preview: "Clean text, no background" },
    { id: "modern", name: "Modern", preview: "Bold with drop shadow" },
    { id: "podcast", name: "Podcast", preview: "Pill background, centered" },
    { id: "bold", name: "Bold", preview: "Large, punchy typography" },
    { id: "hormozi", name: "Hormozi", preview: "Yellow highlight on key words" },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)]">
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border/50 shrink-0">
        <Link to="/clips">
          <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-muted-foreground hover:text-foreground text-xs">
            Back to clips
          </Button>
        </Link>
        <div className="h-4 w-px bg-border/50" />
        <h1 className="text-sm font-medium truncate flex-1">{videoName}</h1>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 border-r border-border/50 flex flex-col p-6 gap-4 overflow-auto">
          <div className="flex gap-6 justify-center">
            {videoUrl ? (
              <video
                src={videoUrl}
                controls
                className="w-full max-w-lg rounded-2xl bg-black shadow-2xl shadow-black/60"
              />
            ) : (
              <div className="w-52 aspect-[9/16] bg-muted rounded-2xl flex items-center justify-center">
                <p className="text-muted-foreground text-sm">No video</p>
              </div>
            )}
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-3 uppercase tracking-widest">Caption style</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {captionStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedStyle === style.id
                      ? "border-primary/50 bg-primary/10"
                      : "border-border/60 bg-card hover:border-border"
                  }`}
                >
                  <p className="text-xs font-medium mb-0.5">{style.name}</p>
                  <p className="text-[10px] text-muted-foreground">{style.preview}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="w-80 flex flex-col overflow-hidden">
          <div className="flex items-center gap-3 px-4 h-10 border-b border-border/50 shrink-0">
            <span className="text-xs font-medium text-foreground">Metadata</span>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">AI metadata not available</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Titles, descriptions, and tags will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
