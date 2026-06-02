import { useRef, useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import { Button } from "../components/ui/button";
import * as store from "../lib/videoStore";

export default function ProjectDetail() {
  const { id } = useParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [record, setRecord] = useState(store.get(id || ""));
  const [playing, setPlaying] = useState(false);

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

  const handleDownload = () => {
    if (!record) return;
    const a = document.createElement("a");
    a.href = record.url;
    a.download = record.name;
    a.click();
  };

  if (!record) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border/50">
          <Link to="/projects">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
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
    <div className="flex flex-col min-h-screen">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border/50 shrink-0">
        <Link to="/projects">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            Projects
          </Button>
        </Link>
        <div className="h-4 w-px bg-border/50" />
        <h1 className="text-sm font-medium truncate flex-1">{record.name}</h1>
        <Button
          size="sm"
          className="bg-primary hover:bg-primary/90 text-white"
          onClick={handleDownload}
        >
          Download
        </Button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="flex-1 bg-black flex items-center justify-center p-4 min-h-0">
          <video
            ref={videoRef}
            src={record.url}
            className="max-w-full max-h-full rounded-lg shadow-2xl"
            controls
            onClick={togglePlay}
            style={{ maxHeight: "calc(100vh - 12rem)" }}
          />
        </div>

        <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-border/50 p-6 space-y-6 shrink-0">
          <div>
            <h2 className="text-xs text-muted-foreground uppercase tracking-widest mb-1">File name</h2>
            <p className="text-sm font-medium break-all">{record.name}</p>
          </div>
          <div>
            <h2 className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Uploaded</h2>
            <p className="text-sm">{record.date}</p>
          </div>
          <div>
            <h2 className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Size</h2>
            <p className="text-sm">
              {record.size > 1024 * 1024
                ? `${(record.size / 1024 / 1024).toFixed(1)} MB`
                : `${(record.size / 1024).toFixed(1)} KB`}
            </p>
          </div>

          <div className="border-t border-border/50 pt-6">
            <h2 className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Actions</h2>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start border-border/60"
                onClick={handleDownload}
              >
                Download original file
              </Button>
              <Link to="/projects" className="block">
                <Button variant="outline" className="w-full justify-start border-border/60">
                  Back to projects
                </Button>
              </Link>
            </div>
          </div>

          <div className="border-t border-border/50 pt-6">
            <h2 className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Coming soon</h2>
            <ul className="space-y-2 text-xs text-muted-foreground/70">
              <li>AI transcript generation</li>
              <li>Smart clip detection</li>
              <li>Caption overlay styles</li>
              <li>Multi-format export</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
