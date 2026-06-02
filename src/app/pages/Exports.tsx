import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";

interface VideoEntry {
  id: string;
  name: string;
  url: string;
  date: string;
}

export default function Exports() {
  const [videos, setVideos] = useState<VideoEntry[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("clipforge_videos");
    if (stored) {
      try {
        setVideos(JSON.parse(stored));
      } catch {}
    }
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Export Center</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {videos.length > 0 ? `${videos.length} video${videos.length > 1 ? "s" : ""} available` : "No exports yet"}
          </p>
        </div>
      </div>

      {videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 text-primary text-xl font-semibold">
            E
          </div>
          <h3 className="font-medium mb-2">No exports yet</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            Upload and process a video first. Exports will appear here once clips are created.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="text-sm font-medium">Export history</h2>
          <div className="bg-card border border-border/60 rounded-xl overflow-hidden">
            <div className="grid grid-cols-[1fr_100px_100px] gap-4 px-4 py-2.5 text-[11px] text-muted-foreground border-b border-border/50">
              <span>Video</span><span>Date</span><span>Status</span>
            </div>
            {videos.map((v, i) => (
              <div
                key={v.id}
                className="grid grid-cols-[1fr_100px_100px] gap-4 px-4 py-3 text-sm items-center hover:bg-accent/30 transition-colors border-b border-border/40"
              >
                <p className="text-xs font-medium truncate">{v.name}</p>
                <span className="text-[11px] text-muted-foreground">{v.date}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20 w-fit text-xs">
                  Pending
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
