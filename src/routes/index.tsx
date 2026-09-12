import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useRef, useState } from "react";
import {
  ArrowRight,
  Clock,
  Download,
  Heart,
  Instagram,
  Link2,
  Loader2,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Zap,
  Check,
  Cpu,
  Gauge,
  LockKeyhole,
  Video,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { analyzeLink, type AnalyzeResult, type MediaKind } from "@/lib/instagram.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ReelVault — Download Instagram Reels, Posts, IGTV & Stories" },
      {
        name: "description",
        content:
          "Paste an Instagram link to instantly see the creator, duration and media type, then save the video straight to your device.",
      },
      { property: "og:title", content: "ReelVault — Instagram Video Downloader" },
      {
        property: "og:description",
        content: "Analyze any Instagram link and download the video in one tap.",
      },
    ],
  }),
  component: Home,
});

const kindLabel: Record<MediaKind, string> = {
  reel: "Reel",
  post: "Post video",
  igtv: "IGTV",
  story: "Story",
  unknown: "Video",
};

function proxyUrl(videoUrl: string, name: string, inline: boolean) {
  return `/api/public/download?name=${encodeURIComponent(name)}&url=${encodeURIComponent(videoUrl)}${
    inline ? "&mode=inline" : ""
  }`;
}

function formatDuration(seconds: number | null) {
  if (!seconds || !Number.isFinite(seconds) || seconds <= 0) return "—";
  const total = Math.round(seconds);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

function formatCount(n: number | null) {
  if (n === null || n === undefined) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function Home() {
  const analyze = useServerFn(analyzeLink);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [saved, setSaved] = useState(false);
  const resultRef = useRef<HTMLElement | null>(null);

  async function onAnalyze(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setDuration(null);
    setSaved(false);
    try {
      const data = await analyze({ data: { url: url.trim() } });
      setResult(data);
      setDuration(data.duration);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : "We couldn't read that link. Please try another one.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function onDownload() {
    if (!result || downloading) return;
    setDownloading(true);
    setError(null);
    try {
      const fileName = `${result.creator}-${result.kind}`;
      const res = await fetch(proxyUrl(result.videoUrl, fileName, false));
      if (!res.ok) throw new Error("The video could not be fetched. Try analyzing the link again.");
      const blob = await res.blob();

      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = `${fileName}.mp4`;
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
      setSaved(true);
    } catch (err) {
      if ((err as Error)?.name !== "AbortError") {
        setError(err instanceof Error ? err.message : "Download failed. Please try again.");
      }
    } finally {
      setDownloading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col overflow-x-hidden px-4 pb-16 sm:px-8">
      <header className="flex h-16 items-center justify-between border-b border-border">
        <div className="flex items-center gap-2.5">
          <span className="bg-gradient-brand flex size-8 items-center justify-center rounded-md">
            <Instagram className="size-5 text-primary-foreground" />
          </span>
          <span className="font-display text-lg font-semibold">ReelVault</span>
        </div>
        <span className="hidden items-center gap-2 font-mono text-[10px] uppercase text-muted-foreground sm:flex">
          <span className="size-1.5 animate-pulse rounded-full bg-accent" /> System live · 24/7
        </span>
      </header>

      <section className="grid items-center gap-10 border-b border-border py-10 sm:py-16 lg:grid-cols-[1.1fr_.9fr] lg:py-24">
        <div className="text-left">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1.5 font-mono text-[10px] uppercase text-muted-foreground">
          <Sparkles className="size-3 text-accent" /> Reels · Posts · IGTV · Stories
        </span>
        <h1 className="mt-6 max-w-3xl text-3xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">
          Instagram media,
          <span className="block text-accent">decoded and downloaded.</span>
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
          Paste a link, analyze it, and save the original video with the creator, duration, and
          media type clearly identified.
        </p>

        <form onSubmit={onAnalyze} className="glass-panel mt-9 rounded-xl p-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-3 px-4 py-3">
              <Link2 className="size-4 shrink-0 text-muted-foreground" />
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                inputMode="url"
                placeholder="https://www.instagram.com/reel/..."
                aria-label="Instagram link"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !url.trim()}
              className="bg-gradient-brand inline-flex items-center justify-center gap-2 rounded-md px-6 py-3.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Zap className="size-4" />}
              {loading ? "Analyzing" : "Analyze link"}
            </Button>
          </div>
        </form>

        <p className="mt-3 flex items-center gap-2 pl-2 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5 text-accent" /> Public media only. Links are processed in memory and never stored.
        </p>
        {error && (
          <p className="animate-rise mx-auto mt-5 max-w-xl rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-foreground">
            {error}
          </p>
        )}
        </div>
        <div className="grid grid-cols-2 gap-3" aria-label="Service highlights">
          {[
            { icon: Gauge, label: "Resolution", value: "Source quality", wide: true },
            { icon: Cpu, label: "Processing", value: "Instant analysis" },
            { icon: LockKeyhole, label: "Privacy", value: "Nothing stored" },
            { icon: Video, label: "Formats", value: "Reels · Posts · Stories", wide: true },
          ].map((item) => (
            <div key={item.label} className={`glass-panel min-h-32 rounded-lg p-5 ${item.wide ? "col-span-2" : ""}`}>
              <item.icon className="size-5 text-accent" />
              <p className="mt-7 font-mono text-[10px] uppercase text-muted-foreground">{item.label}</p>
              <p className="mt-1 font-display text-lg font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {result && (
        <section
          ref={resultRef}
          className="animate-rise glass-panel mx-auto my-8 w-full max-w-full overflow-hidden rounded-lg sm:my-12"
        >
          <div className="grid grid-cols-1 gap-0 md:grid-cols-[minmax(0,300px)_minmax(0,1fr)]">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-secondary md:aspect-auto md:min-h-[420px]">
              <video
                key={result.videoUrl}
                src={proxyUrl(result.videoUrl, "preview", true)}
                poster={result.thumbnail ?? undefined}
                controls
                playsInline
                preload="metadata"
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                className="size-full bg-background object-cover"
              />
              <span className="bg-gradient-brand pointer-events-none absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold text-primary-foreground">
                {kindLabel[result.kind]}
              </span>
            </div>

            <div className="flex min-w-0 flex-col gap-5 p-4 text-left sm:gap-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="bg-gradient-brand flex size-12 shrink-0 items-center justify-center rounded-full text-lg font-semibold text-primary-foreground">
                  {result.creator.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="font-display truncate text-lg font-semibold">{result.creatorName}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    @{result.creator}
                    {result.postedAt ? ` · ${result.postedAt}` : ""}
                  </p>
                </div>
              </div>

              {result.caption && (
                <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {result.caption}
                </p>
              )}

              <dl className="grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  { icon: Clock, label: "Duration", value: formatDuration(duration ?? result.duration) },
                  { icon: Heart, label: "Likes", value: formatCount(result.likes) },
                  { icon: MessageCircle, label: "Comments", value: formatCount(result.comments) },
                ].map((stat) => (
                  <div key={stat.label} className="min-w-0 rounded-xl border border-border bg-secondary/50 p-3 sm:rounded-2xl sm:p-4">
                    <stat.icon className="size-4 text-accent" />
                    <dd className="font-display mt-2 truncate text-base font-semibold sm:text-lg">{stat.value}</dd>
                    <dt className="truncate text-[11px] text-muted-foreground sm:text-xs">{stat.label}</dt>
                  </div>
                ))}
              </dl>

              <div className="mt-auto flex flex-col gap-3">
                 <Button
                  onClick={onDownload}
                  disabled={downloading}
                   className="bg-gradient-brand inline-flex items-center justify-center gap-2 rounded-md px-6 py-4 text-sm font-semibold text-primary-foreground transition hover:brightness-110 disabled:opacity-60"
                >
                  {downloading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Download className="size-4" />
                  )}
                  {downloading ? "Preparing your video…" : "Download video"}
                 </Button>
                {saved && (
                  <p className="text-center text-xs text-accent">
                    Saved. Check your downloads or gallery.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-16">
        <p className="font-mono text-[10px] uppercase text-accent">Pipeline</p>
        <h2 className="mt-3 text-3xl font-semibold">Three steps, start to file</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Link2, title: "Copy the link", text: "Share the reel, post, IGTV, or story and choose Copy link." },
          { icon: Zap, title: "Analyze the link", text: "Paste it above to resolve the creator, duration, and media type." },
          { icon: Download, title: "Download the video", text: "Review the preview, then save the source-quality MP4." },
        ].map((item) => (
          <div key={item.title} className="glass-panel rounded-lg p-6">
            <div className="flex items-center justify-between"><item.icon className="size-5 text-accent" /><Check className="size-3.5 text-muted-foreground" /></div>
            <h2 className="font-display mt-3 text-base font-semibold">{item.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
          </div>
        ))}
        </div>
      </section>

      <footer className="flex items-center justify-between border-t border-border py-7 font-mono text-[10px] uppercase text-muted-foreground">
        <span>ReelVault // stable build</span><span className="flex items-center gap-2">Only download content you have the right to use
        <ArrowRight className="size-3" />
        </span>
      </footer>
    </main>
  );
}
