import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";

interface VideoEntry {
  id: string;
  name: string;
  url: string;
  date: string;
}

export default function Clips() {
  const [search, setSearch] = useState("");
  const [videos, setVideos] = useState<VideoEntry[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("clipforge_videos");
    if (stored) {
      try {
        setVideos(JSON.parse(stored));
      } catch {}
    }
  }, []);

  const filtered = videos.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Clips</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {videos.length > 0 ? `${videos.length} video${videos.length > 1 ? "s" : ""} available` : "No clips yet"}
          </p>
        </div>
      </div>

      <div className="relative flex-1 max-w-sm">
        <Input
          placeholder="Search videos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 text-sm bg-muted/40 border-border/50"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 text-primary text-xl font-semibold">
            -
          </div>
          <h3 className="font-medium mb-2">No clips found</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            {search ? "Try a different search." : "Upload a video to create clips."}
          </p>
          {!search && (
            <Link to="/projects">
              <Button className="bg-primary hover:bg-primary/90 text-white">
                Upload a video
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((v) => (
            <Link key={v.id} to={`/projects/${v.id}`} state={{ videoUrl: v.url, videoName: v.name }}>
              <div className="bg-card border border-border/60 rounded-xl overflow-hidden hover:border-primary/40 transition-all group cursor-pointer">
                <div className="h-32 bg-muted flex items-center justify-center relative">
                  <video
                    src={v.url}
                    className="size-full object-cover"
                    preload="metadata"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="size-10 rounded-full bg-black/30 flex items-center justify-center border border-white/10 backdrop-blur group-hover:bg-black/40 transition-colors">
                      <span className="text-white ml-0.5">▶</span>
                    </div>
                  </div>
                </div>
                <div className="p-2.5">
                  <p className="text-[11px] font-medium line-clamp-2 leading-snug mb-1.5 group-hover:text-primary transition-colors">
                    {v.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{v.date}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
