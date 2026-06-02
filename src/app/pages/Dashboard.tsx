import { Link } from "react-router";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import * as store from "../lib/videoStore";

export default function Dashboard() {
  const [videos, setVideos] = useState(store.list());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    store.init().then(() => {
      setVideos(store.list());
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {videos.length > 0
              ? `${videos.length} video${videos.length > 1 ? "s" : ""} uploaded`
              : "Upload your first video to get started"}
          </p>
        </div>
        <Link to="/projects">
          <Button className="bg-primary hover:bg-primary/90 text-white">
            Upload video
          </Button>
        </Link>
      </div>

      {videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 text-primary text-xl font-semibold">
            +
          </div>
          <h3 className="font-medium mb-2">No videos yet</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            Upload a video to start creating clips, generating transcripts, and exporting content.
          </p>
          <Link to="/projects">
            <Button className="bg-primary hover:bg-primary/90 text-white">
              Upload your first video
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((v) => (
            <Link key={v.id} to={`/projects/${v.id}`} state={{ videoUrl: v.url, videoName: v.name }}>
              <div className="bg-card border border-border/60 rounded-xl overflow-hidden hover:border-primary/30 transition-all group cursor-pointer">
                <div className="h-36 bg-muted flex items-center justify-center">
                  <video
                    src={v.url}
                    className="size-full object-cover"
                    preload="metadata"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                    {v.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{v.date}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
