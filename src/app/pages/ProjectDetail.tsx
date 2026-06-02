import { useRef, useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import { Button } from "../components/ui/button";
import * as store from "../lib/videoStore";

export default function ProjectDetail() {
  const { id } = useParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [record, setRecord] = useState(store.get(id || ""));

  useEffect(() => {
    store.init().then(() => {
      setRecord(store.get(id || ""));
    });
  }, [id]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  if (!record) {
    return (
      <div className="flex flex-col h-[calc(100vh-3rem)]">
        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border/50 shrink-0">
          <Link to="/projects">
            <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-muted-foreground hover:text-foreground text-xs">
              Projects
            </Button>
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Video not found</p>
            <Link to="/projects">
              <Button variant="outline" className="mt-4">Back to projects</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)]">
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border/50 shrink-0">
        <Link to="/projects">
          <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-muted-foreground hover:text-foreground text-xs">
            Projects
          </Button>
        </Link>
        <div className="h-4 w-px bg-border/50" />
        <h1 className="text-sm font-medium truncate flex-1">{record.name}</h1>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-[30%] min-w-60 border-r border-border/50 flex flex-col">
          <div className="bg-black aspect-video flex items-center justify-center relative">
            <video
              ref={videoRef}
              src={record.url}
              className="size-full object-contain"
              onClick={togglePlay}
            />
            {!playing && (
              <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="size-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur flex items-center justify-center border border-white/10">
                  <span className="text-white ml-0.5">▶</span>
                </div>
              </button>
            )}
          </div>

          <div className="p-3 border-b border-border/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] text-muted-foreground">AI Segments (0)</p>
            </div>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-xs text-muted-foreground">No segments detected</p>
              <p className="text-[11px] text-muted-foreground/60 mt-1">AI analysis is not yet available</p>
            </div>
          </div>
        </div>

        <div className="flex-1 border-r border-border/50 flex flex-col overflow-hidden">
          <div className="flex items-center gap-4 px-4 h-10 border-b border-border/50 shrink-0">
            <span className="text-xs font-medium text-foreground">Transcript</span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">No transcript generated</p>
              <p className="text-xs text-muted-foreground/60 mt-1">AI transcription is not yet available</p>
              <p className="text-[11px] text-muted-foreground/50 mt-4 max-w-xs">
                Future updates will add Gemini-powered transcription and AI segment analysis.
              </p>
            </div>
          </div>
        </div>

        <div className="w-[28%] min-w-56 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-border/50 flex items-center justify-between shrink-0">
            <span className="text-[11px] text-muted-foreground">Clips (0)</span>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">No clips created</p>
              <p className="text-[11px] text-muted-foreground/60 mt-1">Clip creation will be available soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
