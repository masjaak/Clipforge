
# ClipForge — Build Plan

A premium, dark, Linear/Vercel-grade SaaS that turns long videos into short vertical clips with real AI analysis and real exported MP4 files.

## Architecture overview

```text
Browser (TanStack Start + React 19)
  │
  ├─ Upload → Lovable Cloud Storage (videos bucket)
  ├─ ffmpeg.wasm worker: extract audio, cut clips, burn captions, reframe
  │
  ▼
Server Functions (TanStack createServerFn)
  ├─ transcribe()     → Lovable AI · google/gemini-2.5-pro (audio in)
  ├─ analyze()        → Lovable AI · google/gemini-3-flash-preview (JSON segments + scores)
  ├─ scoreVirality()  → Lovable AI (structured output)
  ├─ generateCaptions(), generateMetadata(), generateHooks()
  │
  ▼
Postgres (Lovable Cloud) — projects, transcripts, segments, clips,
                           captions, exports, profiles, user_roles
```

Why this stack:
- **Real AI**: Gemini 2.5 Pro natively accepts audio → real transcript, no extra vendor key. Gemini 3 Flash handles segmentation, scoring, captions, metadata via AI SDK structured output.
- **Real clip files**: ffmpeg.wasm renders MP4s in the browser. No external render farm or API keys needed. Cloudflare Workers can't run ffmpeg; offloading to the user's browser is the only zero-setup path.
- **TanStack Start** (existing template): server functions for AI calls, file routes for pages.

## Database schema (migration)

```text
profiles(id uuid PK → auth.users, display_name, avatar_url, created_at)
user_roles(id, user_id, role app_role) + has_role() definer
projects(id, user_id, title, source_url, source_path, duration_s,
         status: uploading|transcribing|analyzing|ready|failed,
         language, created_at)
transcripts(id, project_id, full_text, words jsonb, speakers jsonb)
segments(id, project_id, start_s, end_s, score int, category text,
         reason text, hook text, transcript_text)
clips(id, project_id, segment_id, title, length_s, aspect text,
      caption_style text, virality int, hook_score int,
      retention_score int, status: draft|rendering|ready,
      output_path text, thumb_path text, created_at)
clip_metadata(clip_id PK, titles jsonb, descriptions jsonb,
              captions jsonb, hashtags jsonb, keywords jsonb, hooks jsonb)
exports(id, clip_id, user_id, format mp4|srt|vtt|txt, path, created_at)
processing_jobs(id, project_id, kind, status, progress, error, started_at, finished_at)
```

Storage buckets: `videos` (private, owner read), `clips` (private), `thumbs` (public).
RLS on every table scoped to `auth.uid()`. GRANTs to authenticated; service_role on all.

## Pages / routes

```text
/                              Marketing-lite landing → CTA to /login
/login                         Email + Google (Lovable broker)
/_authenticated/
  dashboard                    Stats, queue, recent projects
  projects                     Grid + filters + new project
  projects/$id                 Player | Transcript | Clips (3-pane)
  clips                        All clips across projects
  clips/$id                    Clip review: scores, edit, export
  exports                      Download center, batch export
  templates                    Caption + clip presets (Minimal/Modern/Podcast/Bold/Hormozi)
  settings                     Profile, defaults, danger zone
  billing                      Plan + usage (stub w/ real data shape, no payments)
```

All routes wired into a collapsible Shadcn sidebar. `_authenticated` layout gates with `beforeLoad` + `supabase.auth.getUser()` so loaders have a session.

## AI pipeline (server functions)

1. **Upload** → client uploads to Storage, inserts `projects` row.
2. **Extract audio** in browser via ffmpeg.wasm (16kHz mono opus), upload to Storage.
3. `transcribeProject` server fn → Gemini 2.5 Pro with audio file URL, returns word-timestamped JSON via `Output.object` Zod schema.
4. `analyzeTranscript` → segments with `{start, end, score, category, reason, hook, transcript_text}` (10–25 per video).
5. `scoreVirality` per segment → curiosity/emotion/conflict/surprise/story/edu/retention/share factors, weighted total.
6. `generateClipPackage` per clip → 3× titles, descriptions, captions, hashtags, keywords, hook variations.
7. Persist everything; UI subscribes via TanStack Query polling on `projects.status` until `ready`.

Errors surfaced inline (429 rate, 402 credits) per Lovable AI guidelines.

## Browser video engine (ffmpeg.wasm)

A single `useVideoEngine` hook wrapping a Web Worker that handles:
- Audio extract for transcription
- Clip cut: `-ss start -to end -c copy` (fast) or re-encode when filters apply
- **Reframe** 9:16 / 1:1 / 16:9 via crop filter; speaker-tracking stub uses face-box from a lightweight in-browser detector (BlazeFace) when faces detected, else center-crop with motion-bias.
- **Caption burn-in**: generate ASS subtitle file from word timestamps + selected style preset, render with `subtitles` filter.
- **Silence/filler trim**: detect via `silencedetect` + word-list filter on transcript, build concat list.
- Output uploaded back to Storage; `clips.status` flips to `ready`.

Rendering progress reported via worker messages to a toast + clip card.

## UI / design

- **Dark by default**, OKLCH tokens in `src/styles.css`: near-black `#0a0a0c` bg, layered surfaces, single saturated accent (electric violet `oklch(0.68 0.22 295)`), soft cyan secondary, generous spacing, subtle grain.
- Typography: Geist Sans (body) + Geist Mono (numerics/scores). No Inter/Poppins.
- Components: built on shadcn but heavily restyled — pill nav, gradient virality rings, glassy command palette (⌘K), motion micro-interactions via Motion for React.
- 3-pane project detail with synchronized scroll: clicking transcript scrubs video; clicking clip loads preview.
- Clip review: large player, score rings (Virality / Hook / Retention), caption style picker with live preview, export drawer.

## Implementation order

1. Enable Lovable Cloud, write migration (profiles, roles, all tables, buckets, RLS, GRANTs).
2. Configure social auth (Google) + login/signup pages + `_authenticated` guard + root `onAuthStateChange`.
3. Design tokens + sidebar shell + dashboard skeleton with live counts.
4. Upload flow → Storage + `projects` row + audio extract worker.
5. Server fns: AI gateway helper, transcribe, analyze, score, package.
6. Project detail 3-pane with transcript scrubbing.
7. Clip rendering worker (cut + reframe + caption burn-in).
8. Clip review + export center (MP4/SRT/VTT/TXT) + batch ZIP.
9. Templates, Settings, Billing (read-only usage view).
10. Polish pass: empty states, loading skeletons, keyboard shortcuts, ⌘K.

## Out of scope for v1 (architecture-ready)

Thumbnail gen, translation/dubbing, voice clone, team workspaces, direct publish to TikTok/IG/YT, Stripe billing. Schema and route shape leave room for each without refactor.

## Open caveats

- ffmpeg.wasm renders are CPU/memory bound on the client; long videos (>30 min) will be slow. Acceptable for v1; a future render worker can be swapped behind the same `clips.render()` server fn.
- Gemini audio transcription is capped per request — long videos chunked into ≤20 min audio segments and stitched.
