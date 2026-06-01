import { useState } from "react";
import { Camera, AlertTriangle, Save, Trash2, Key, Globe, Bell } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Switch } from "../components/ui/switch";
import { Separator } from "../components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../components/ui/select";
import { cn } from "../components/ui/utils";
import { toast } from "sonner";

function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
      <div>
        <h3 className="text-sm font-medium">{title}</h3>
        {desc && <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{desc}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
}

export default function Settings() {
  const [displayName, setDisplayName] = useState("Jamie Doe");
  const [email, setEmail] = useState("jamie@studio.io");
  const [bio, setBio] = useState("Founder & content creator. Building in public.");
  const [language, setLanguage] = useState("en");
  const [notifications, setNotifications] = useState({ processing: true, exports: true, digest: false });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    toast.success("Settings saved");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-10">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your account and workspace preferences.</p>
      </div>

      <Section title="Profile" desc="Your public-facing information.">
        <div className="bg-card border border-border/60 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="size-14 rounded-xl">
                <AvatarImage src="https://api.dicebear.com/7.x/shapes/svg?seed=clipforge" />
                <AvatarFallback className="rounded-xl bg-primary/20 text-primary">JD</AvatarFallback>
              </Avatar>
              <button className="absolute -bottom-1 -right-1 size-5 rounded-full bg-primary flex items-center justify-center shadow">
                <Camera className="size-2.5 text-white" />
              </button>
            </div>
            <div>
              <p className="text-sm font-medium">Jamie Doe</p>
              <p className="text-xs text-muted-foreground">Pro plan · Member since May 2026</p>
            </div>
          </div>
          <Separator className="bg-border/50" />
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Display name</Label>
              <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="h-9 bg-muted/40 border-border/50 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Email address</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="h-9 bg-muted/40 border-border/50 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Bio</Label>
              <Textarea value={bio} onChange={(e) => setBio(e.target.value)} className="bg-muted/40 border-border/50 text-sm resize-none h-20" />
            </div>
          </div>
        </div>
      </Section>

      <Separator className="bg-border/40" />

      <Section title="Defaults" desc="Applied to all new projects and clips.">
        <div className="bg-card border border-border/60 rounded-xl p-5 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground flex items-center gap-1.5"><Globe className="size-3" /> Transcript language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="h-9 bg-muted/40 border-border/50 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="pt">Portuguese</SelectItem>
                <SelectItem value="ja">Japanese</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Default clip aspect ratio</Label>
            <div className="flex items-center gap-2">
              {["9:16", "1:1", "16:9"].map((r) => (
                <button
                  key={r}
                  className={cn(
                    "flex-1 py-2 text-xs rounded-lg border transition-all",
                    r === "9:16" ? "border-primary/50 bg-primary/10 text-primary" : "border-border/60 bg-muted/40 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Default caption style</Label>
            <Select defaultValue="modern">
              <SelectTrigger className="h-9 bg-muted/40 border-border/50 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="podcast">Podcast</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
                <SelectItem value="hormozi">Hormozi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Section>

      <Separator className="bg-border/40" />

      <Section title="Notifications" desc="Control when ClipForge sends you emails.">
        <div className="bg-card border border-border/60 rounded-xl divide-y divide-border/50">
          {[
            { key: "processing", label: "Processing complete", desc: "When a video finishes transcription and analysis" },
            { key: "exports", label: "Export ready", desc: "When a clip finishes rendering" },
            { key: "digest", label: "Weekly digest", desc: "Summary of clips created and export stats" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
              <Switch
                checked={notifications[item.key as keyof typeof notifications]}
                onCheckedChange={(v) => setNotifications((prev) => ({ ...prev, [item.key]: v }))}
              />
            </div>
          ))}
        </div>
      </Section>

      <Separator className="bg-border/40" />

      <Section title="API keys" desc="Manage access tokens for integrations.">
        <div className="bg-card border border-border/60 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Key className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium">Personal API key</span>
            </div>
            <Button size="sm" variant="outline" className="h-7 text-xs border-border/60">
              Generate key
            </Button>
          </div>
          <div className="h-9 bg-muted/40 border border-border/50 rounded-lg flex items-center px-3 gap-2">
            <span className="text-xs text-muted-foreground font-mono flex-1">cf_live_••••••••••••••••••••••••••••••</span>
            <button className="text-xs text-primary hover:underline">Reveal</button>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">Used to authenticate requests to the ClipForge API.</p>
        </div>
      </Section>

      <div className="flex justify-between items-center pt-2">
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-white gap-2" disabled={saving}>
          {saving ? <span className="size-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <Save className="size-4" />}
          Save changes
        </Button>
      </div>

      <Separator className="bg-border/40" />

      <Section title="Danger zone" desc="Irreversible actions. Proceed with care.">
        <div className="bg-destructive/5 border border-destructive/20 rounded-xl divide-y divide-destructive/10">
          <div className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-destructive-foreground">Delete all projects</p>
              <p className="text-xs text-muted-foreground mt-0.5">Permanently delete all videos, clips, and exports</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs border-destructive/40 text-destructive hover:bg-destructive/10"
              onClick={() => toast.error("This action is permanent. Are you sure?", { action: { label: "Delete all", onClick: () => toast.success("Done") } })}
            >
              <Trash2 className="size-3 mr-1" /> Delete all
            </Button>
          </div>
          <div className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-destructive-foreground">Delete account</p>
              <p className="text-xs text-muted-foreground mt-0.5">Permanently close your account and erase all data</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs border-destructive/40 text-destructive hover:bg-destructive/10"
              onClick={() => toast.error("Account deletion requires email confirmation")}
            >
              <AlertTriangle className="size-3 mr-1" /> Delete account
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
}
