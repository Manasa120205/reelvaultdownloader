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
} from "lucide-react";

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
      const file = new File([blob], `${fileName}.mp4`, { type: "video/mp4" });

      const shareData: ShareData = { files: [file] };
      const canShare =
        typeof navigator !== "undefined" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare(shareData);

      if (canShare) {
        await navigator.share(shareData);
      } else {
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = objectUrl;
        a.download = `${fileName}.mp4`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(objectUrl), 4000);
      }
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
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 pb-20 pt-10 sm:px-8">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="bg-gradient-brand flex size-9 items-center justify-center rounded-xl">
            <Instagram className="size-5 text-primary-foreground" />
          </span>
          <span className="font-display text-lg font-semibold">ReelVault</span>
        </div>
        <span className="glass-panel hidden items-center gap-2 rounded-full px-3.5 py-1.5 text-xs text-muted-foreground sm:flex">
          <ShieldCheck className="size-3.5 text-accent" /> No login, no watermark
        </span>
      </header>

      <section className="mt-14 text-center sm:mt-20">
        <span className="glass-panel inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground">
          <Sparkles className="size-3.5 text-accent" /> Reels · Posts · IGTV · Stories
        </span>
        <h1 className="mt-6 text-4xl font-bold leading-[1.08] sm:text-6xl">
          Save any Instagram video
          <br />
          <span className="text-gradient">in one elegant tap.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground">
          Paste a link — we reveal the creator, the duration and the media type, then hand you the
          full-quality file.
        </p>

        <form onSubmit={onAnalyze} className="glass-panel mx-auto mt-9 rounded-2xl p-2 sm:max-w-2xl">
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
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="bg-gradient-brand inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Zap className="size-4" />}
              {loading ? "Analyzing" : "Analyze link"}
            </button>
          </div>
        </form>

        {error && (
          <p className="animate-rise mx-auto mt-5 max-w-xl rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-foreground">
            {error}
          </p>
        )}
      </section>

      {result && (
        <section
          ref={resultRef}
          className="animate-rise glass-panel mx-auto mt-12 w-full overflow-hidden rounded-3xl sm:mt-16"
        >
          <div className="grid gap-0 md:grid-cols-[minmax(0,300px)_1fr]">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-secondary md:aspect-auto md:min-h-[420px]">
              <video
                key={result.videoUrl}
                src={proxyUrl(result.videoUrl, "preview", true)}
                poster={result.thumbnail ?? undefined}
                controls
                playsInline
                preload="metadata"
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                className="size-full bg-black object-cover"
              />
              <span className="bg-gradient-brand pointer-events-none absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold text-primary-foreground">
                {kindLabel[result.kind]}
              </span>
            </div>

            <div className="flex flex-col gap-6 p-6 text-left sm:p-8">
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

              <dl className="grid grid-cols-3 gap-3">
                {[
                  { icon: Clock, label: "Duration", value: formatDuration(duration ?? result.duration) },
                  { icon: Heart, label: "Likes", value: formatCount(result.likes) },
                  { icon: MessageCircle, label: "Comments", value: formatCount(result.comments) },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-border bg-secondary/50 p-4">
                    <stat.icon className="size-4 text-accent" />
                    <dd className="font-display mt-2 text-lg font-semibold">{stat.value}</dd>
                    <dt className="text-xs text-muted-foreground">{stat.label}</dt>
                  </div>
                ))}
              </dl>

              <div className="mt-auto flex flex-col gap-3">
                <button
                  onClick={onDownload}
                  disabled={downloading}
                  className="bg-gradient-brand inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
                >
                  {downloading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Download className="size-4" />
                  )}
                  {downloading ? "Preparing your video…" : "Download video"}
                </button>
                {saved && (
                  <p className="text-center text-xs text-accent">
                    Done. On phones, pick “Save to photos” if a share sheet appears.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="mt-20 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Zap, title: "Instant read", text: "Creator, duration and type in seconds." },
          { icon: Download, title: "Full quality", text: "Original file, no watermark added." },
          { icon: ShieldCheck, title: "Nothing stored", text: "Links are never saved on our side." },
        ].map((item) => (
          <div key={item.title} className="glass-panel rounded-2xl p-6">
            <item.icon className="size-5 text-accent" />
            <h2 className="font-display mt-3 text-base font-semibold">{item.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
          </div>
        ))}
      </section>

      <footer className="mt-16 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        Only download content you have the right to use
        <ArrowRight className="size-3" />
      </footer>
    </main>
  );
}
