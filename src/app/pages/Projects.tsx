import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import * as store from "../lib/videoStore";

export default function Projects() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [videos, setVideos] = useState(store.list());
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    store.init().then(() => {
      setVideos(store.list());
      setLoading(false);
    });
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (inputRef.current) inputRef.current.value = "";

    setUploading(true);
    const id = `video-${Date.now()}`;
    const url = await store.add(id, file.name, file);
    setVideos(store.list());
    setUploading(false);
    navigate(`/projects/${id}`, { state: { videoUrl: url, videoName: file.name } });
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {videos.length > 0 ? `${videos.length} video${videos.length > 1 ? "s" : ""}` : "Upload a video to get started"}
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleUpload}
        />
        <Button
          className="bg-primary hover:bg-primary/90 text-white"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? "Processing..." : "Upload video"}
        </Button>
      </div>

      {videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 text-primary text-xl font-semibold">
            +
          </div>
          <h3 className="font-medium mb-2">No projects yet</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            Upload a video file to create a new project. Your browser handles everything locally.
          </p>
          <Button
            className="bg-primary hover:bg-primary/90 text-white"
            onClick={() => inputRef.current?.click()}
          >
            Upload your first video
          </Button>
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
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">{v.date}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
