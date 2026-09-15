import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  CheckCircle2,
  Download,
  ExternalLink,
  Film,
  Image as ImageIcon,
  Loader2,
  Lock,
  Menu,
  Shield,
  Smartphone,
  Sparkles,
  Video,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  analyzeMedia,
  downloadMedia,
  triggerBrowserDownload,
  type AnalyzeSuccessResponse,
} from "@/lib/publicMediaApi";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StealReel – Instagram Reel Downloader" },
      {
        name: "description",
        content:
          "Download supported public Instagram Reels, videos and photos quickly with StealReel. No Instagram login required.",
      },
      { property: "og:title", content: "StealReel – Instagram Reel Downloader" },
      {
        property: "og:description",
        content:
          "Download supported public Instagram Reels, videos and photos quickly with StealReel. No Instagram login required.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/og-image.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "StealReel – Instagram Reel Downloader" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "StealReel – Instagram Reel Downloader" },
      {
        name: "twitter:description",
        content:
          "Download supported public Instagram Reels, videos and photos quickly with StealReel. No Instagram login required.",
      },
      { name: "twitter:image", content: "/og-image.png" },
    ],
  }),
  component: HomePage,
});

function getMediaLabel(type?: string | null): string {
  if (!type) return "Instagram Reel";
  switch (type.toLowerCase()) {
    case "reel":
      return "Instagram Reel";
    case "story":
      return "Instagram Story";
    case "post":
    case "photo":
    case "image":
      return "Instagram Post / Photo";
    case "video":
      return "Instagram Video";
    default:
      return `Instagram ${type.charAt(0).toUpperCase() + type.slice(1)}`;
  }
}

function HomePage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeSuccessResponse | null>(null);
  const [selectedQuality, setSelectedQuality] = useState("Original");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  function validateInstagramUrl(input: string): boolean {
    try {
      const parsed = new URL(input.startsWith("http") ? input : `https://${input}`);
      return /(^|\.)instagram\.com$/i.test(parsed.hostname);
    } catch {
      return false;
    }
  }

  async function handlePaste() {
    try {
      const clipText = await navigator.clipboard.readText();
      if (clipText) {
        setUrl(clipText.trim());
        setError(null);
        toast.success("Link pasted from clipboard");
        inputRef.current?.focus();
      }
    } catch {
      inputRef.current?.focus();
    }
  }

  // STEP 2 & 3: Analyze action only (does NOT immediately download)
  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    const cleanUrl = url.trim();

    if (!cleanUrl) {
      setError("Please enter a valid Instagram link.");
      return;
    }

    if (!validateInstagramUrl(cleanUrl)) {
      setError("Please enter a valid Instagram link (e.g. https://www.instagram.com/reel/...).");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setImageError(false);

    try {
      const data = await analyzeMedia(cleanUrl);
      setResult(data);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Unable to analyze this Reel. Please check the link and try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  // STEP 4: Download action with quality/resolution selection
  async function handleDownload(qualityToDownload?: string) {
    if (!result || downloading) return;
    setDownloading(true);

    const mediaType = (result?.type || "").toLowerCase();
    const isVideo = mediaType !== "post" && mediaType !== "photo" && mediaType !== "image";
    const quality = qualityToDownload || selectedQuality || "Original";

    try {
      const downloadData = await downloadMedia(url.trim(), quality);

      const rawUrl =
        downloadData?.downloadUrl ||
        (downloadData as any)?.download_url ||
        (downloadData as any)?.url ||
        (downloadData as any)?.data?.downloadUrl ||
        (downloadData as any)?.data?.url ||
        "";

      let finalFilename: string =
        downloadData?.filename ||
        (downloadData as any)?.fileName ||
        (downloadData as any)?.file_name ||
        (downloadData as any)?.data?.filename ||
        (isVideo ? `instagram-reel-${quality}.mp4` : "instagram-photo.jpg");

      if (
        isVideo &&
        quality &&
        typeof finalFilename === "string" &&
        !finalFilename.toLowerCase().includes(quality.toLowerCase())
      ) {
        finalFilename = finalFilename.replace(/(\.[\w\d]+)$/i, `_${quality}$1`);
      }

      if (!rawUrl) {
        throw new Error("No download stream URL was returned from the server.");
      }

      await triggerBrowserDownload(rawUrl, finalFilename);

      toast.success(
        isVideo ? `${quality} Reel download started` : "Photo download started"
      );
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to download media. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setDownloading(false);
    }
  }

  function handleReset() {
    setUrl("");
    setResult(null);
    setError(null);
    setImageError(false);
    inputRef.current?.focus();
  }

  function scrollToSection(id: string) {
    setMobileMenuOpen(false);
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white flex flex-col selection:bg-[#6366F1]/30 selection:text-white">
      {/* 2. NAVBAR */}
      <header className="sticky top-0 z-40 w-full border-b border-[#27272A] bg-[#0B0B0D]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-2.5 text-white transition hover:opacity-90"
            aria-label="StealReel Home"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#141416] border border-[#27272A] text-[#6366F1]">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 fill-none stroke-current stroke-[2]"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="3" rx="4" />
                <path d="M12 8v8" />
                <path d="m8 12 4 4 4-4" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-white">StealReel</span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#A1A1AA]">
            <button
              onClick={() => scrollToSection("downloader")}
              className="transition hover:text-white"
            >
              Reels
            </button>
            <button
              onClick={() => scrollToSection("downloader")}
              className="transition hover:text-white"
            >
              Videos
            </button>
            <button
              onClick={() => scrollToSection("downloader")}
              className="transition hover:text-white"
            >
              Photos
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="transition hover:text-white"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="transition hover:text-white"
            >
              FAQ
            </button>
          </nav>

          {/* Right Action */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              onClick={() => {
                scrollToSection("downloader");
                inputRef.current?.focus();
              }}
              className="h-10 px-5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-sm font-semibold transition"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden h-10 w-10 items-center justify-center rounded-lg border border-[#27272A] bg-[#141416] text-[#A1A1AA] hover:text-white"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="border-b border-[#27272A] bg-[#141416] px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-3 text-sm font-medium text-[#A1A1AA]">
              <button
                onClick={() => scrollToSection("downloader")}
                className="text-left py-2 hover:text-white"
              >
                Reels Downloader
              </button>
              <button
                onClick={() => scrollToSection("downloader")}
                className="text-left py-2 hover:text-white"
              >
                Videos
              </button>
              <button
                onClick={() => scrollToSection("downloader")}
                className="text-left py-2 hover:text-white"
              >
                Photos
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-left py-2 hover:text-white"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="text-left py-2 hover:text-white"
              >
                FAQ
              </button>
              <div className="pt-2 border-t border-[#27272A] flex flex-col gap-2">
                <Button
                  onClick={() => {
                    scrollToSection("downloader");
                    inputRef.current?.focus();
                  }}
                  className="w-full h-11 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold"
                >
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* 3. HERO & DOWNLOADER CARD */}
      <section id="downloader" className="relative py-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
            Instagram Reels.
            <br />
            Saved in seconds.
          </h1>

          {/* Supporting line */}
          <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg text-[#A1A1AA] leading-relaxed">
            Paste an Instagram link and download your favorite public reels quickly and easily.
          </p>

          {/* Downloader Card: Initial state has input + "Analyze Link" */}
          <div className="mt-8 rounded-2xl border border-[#27272A] bg-[#141416] p-4 sm:p-6 shadow-2xl text-left">
            <label
              htmlFor="insta-url"
              className="block text-xs font-semibold uppercase tracking-wider text-[#A1A1AA] mb-2.5"
            >
              Paste Instagram URL
            </label>

            <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  id="insta-url"
                  ref={inputRef}
                  type="text"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="🔗 Paste Instagram link here..."
                  aria-label="Instagram post or reel URL"
                  className="w-full h-[52px] rounded-xl border border-[#27272A] bg-[#0B0B0D] px-4 pr-10 text-sm sm:text-base text-white placeholder:text-[#A1A1AA]/60 outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition"
                />
                {url ? (
                  <button
                    type="button"
                    onClick={() => setUrl("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#A1A1AA] hover:text-white"
                    title="Clear input"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePaste}
                    className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-1 text-xs text-[#A1A1AA] hover:text-white px-2 py-1 rounded bg-[#1A1A1D] border border-[#27272A]"
                    title="Paste from clipboard"
                  >
                    Paste
                  </button>
                )}
              </div>

              {/* Primary Initial CTA Button: "Analyze Link" */}
              <button
                type="submit"
                disabled={loading}
                className="h-[52px] px-8 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold text-base transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Analyzing Reel...</span>
                  </>
                ) : (
                  <span>Analyze Link</span>
                )}
              </button>
            </form>

            {/* Error state */}
            {error && (
              <div className="mt-3.5 flex items-start gap-2.5 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-xs sm:text-sm text-red-400">
                <span className="mt-0.5 font-bold">✕</span>
                <div className="flex-1 leading-relaxed">
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Subtle microcopy */}
            <div className="mt-4 flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-[#A1A1AA]">
              <span>✓ No Instagram login required</span>
              <span>✓ Public content only</span>
              <span>✓ Fast &amp; simple</span>
            </div>
          </div>

          {/* 5. DOWNLOAD RESULT / PREVIEW CARD (Appears only AFTER successful analysis) */}
          {result && (
            <div
              ref={resultRef}
              className="mt-8 animate-fade-in rounded-2xl border border-[#27272A] bg-[#141416] p-5 sm:p-7 text-left shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[#27272A] pb-4 mb-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#10B981]">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>
                    {result.type?.toLowerCase() === "post" ? "Photo found" : "Reel found"}
                  </span>
                </div>
                <span className="text-xs text-[#A1A1AA] bg-[#1A1A1D] px-2.5 py-1 rounded-md border border-[#27272A]">
                  Public Instagram content
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[minmax(0,280px)_1fr] gap-6 items-start">
                {/* LARGE VIDEO / IMAGE THUMBNAIL */}
                <div className="relative aspect-[9/16] max-h-[380px] w-full rounded-xl overflow-hidden bg-[#0B0B0D] border border-[#27272A] flex items-center justify-center group">
                  {!imageError && result.thumbnail ? (
                    <>
                      <img
                        src={result.thumbnail}
                        alt={result.title || "Instagram media preview"}
                        onError={() => setImageError(true)}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                      {result.type?.toLowerCase() !== "post" && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <div className="h-12 w-12 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white shadow-lg">
                            <Film className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <Film className="h-8 w-8 text-[#A1A1AA] mx-auto mb-2 opacity-50" />
                      <p className="text-xs text-[#A1A1AA]">Preview unavailable</p>
                    </div>
                  )}
                </div>

                {/* Info and Download Options */}
                <div className="flex flex-col justify-between h-full space-y-5">
                  <div className="space-y-2.5">
                    <h3 className="text-base font-bold text-white leading-snug line-clamp-3">
                      {result.title || "Public Instagram Reel"}
                    </h3>

                    <p className="text-sm font-medium text-[#A1A1AA]">
                      {getMediaLabel(result.type)} · Ready for instant download
                    </p>

                    {result.available && (
                      <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Media verified &amp; available</span>
                      </div>
                    )}
                  </div>

                  {/* Quality & Resolution Picker */}
                  {result.type?.toLowerCase() !== "post" ? (
                    <div className="space-y-2.5 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider block">
                          Choose Video Resolution
                        </label>
                        <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-medium">
                          Selected: {selectedQuality}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {[
                          { id: "Original", label: "Original Quality", badge: "Source", desc: "Direct stream" },
                          { id: "1080p", label: "1080p Full HD", badge: "HD", desc: "Best quality" },
                          { id: "720p", label: "720p HD", badge: "Fast", desc: "Balanced size" },
                        ].map((q) => {
                          const isSelected = selectedQuality === q.id;
                          return (
                            <button
                              key={q.id}
                              type="button"
                              onClick={() => setSelectedQuality(q.id)}
                              className={`flex flex-col items-start p-3 rounded-xl border text-left transition ${
                                isSelected
                                  ? "bg-[#6366F1]/15 border-[#6366F1] ring-1 ring-[#6366F1] text-white shadow-sm"
                                  : "bg-[#1A1A1D] border-[#27272A] text-[#A1A1AA] hover:border-[#3F3F46] hover:text-white"
                              }`}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span className="text-xs font-bold text-white">{q.label}</span>
                                <span
                                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                                    isSelected
                                      ? "bg-[#6366F1] text-white"
                                      : "bg-[#27272A] text-[#A1A1AA]"
                                  }`}
                                >
                                  {q.badge}
                                </span>
                              </div>
                              <span className="text-[11px] text-[#71717A] mt-1">{q.desc}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 pt-2">
                      <label className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider block">
                        Photo Resolution
                      </label>
                      <div className="flex items-center justify-between p-3 rounded-xl border border-[#27272A] bg-[#1A1A1D]">
                        <span className="text-xs font-bold text-white">Full Resolution Image</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Original Quality
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Primary Download Button: "Download Reel" (appears ONLY in result card) */}
                  <div className="pt-2 space-y-2.5">
                    <button
                      onClick={() => handleDownload(selectedQuality)}
                      disabled={downloading}
                      className="w-full h-[52px] rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold text-base transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-60"
                    >
                      {downloading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>
                            Preparing {result.type?.toLowerCase() === "post" ? "Photo" : selectedQuality} download...
                          </span>
                        </>
                      ) : (
                        <>
                          <Download className="h-5 w-5" />
                          <span>
                            {result.type?.toLowerCase() === "post"
                              ? "Download High-Res Photo"
                              : `Download Reel (${selectedQuality})`}
                          </span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-full h-11 rounded-xl border border-[#27272A] bg-[#1A1A1D] hover:bg-[#27272A] text-xs font-semibold text-[#A1A1AA] hover:text-white transition"
                    >
                      Try another link
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 6. SUPPORTED CONTENT TYPES */}
      <section className="py-16 sm:py-20 border-t border-[#27272A] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              More than just Reels.
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#A1A1AA]">
              Download supported public Instagram content from one simple place.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Film,
                title: "REELS",
                desc: "Download public Instagram Reels.",
              },
              {
                icon: Video,
                title: "VIDEOS",
                desc: "Save public Instagram videos.",
              },
              {
                icon: ImageIcon,
                title: "PHOTOS",
                desc: "Download public Instagram photos.",
              },
              {
                icon: Sparkles,
                title: "STORIES",
                desc: "Download supported public Instagram Stories.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="clean-card p-6 flex flex-col justify-between hover:border-[#3F3F46] transition group"
              >
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1A1A1D] border border-[#27272A] text-[#6366F1] group-hover:border-[#6366F1]/50 transition">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-mono text-xs font-bold tracking-wider text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-[#A1A1AA] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. HOW IT WORKS */}
      <section id="how-it-works" className="py-16 sm:py-20 border-t border-[#27272A] px-4 sm:px-6 lg:px-8 bg-[#0E0E11]">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              How StealReel works
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#A1A1AA]">
              Three simple steps. That's it.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "Step 01",
                title: "Copy",
                desc: "Copy the link to the public Instagram post or Reel.",
              },
              {
                step: "Step 02",
                title: "Paste",
                desc: "Paste the link into StealReel.",
              },
              {
                step: "Step 03",
                title: "Download",
                desc: "Preview your media and download it.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="clean-card p-6 flex flex-col justify-between text-left"
              >
                <div>
                  <span className="font-mono text-xs font-bold text-[#6366F1]">{item.step}</span>
                  <h3 className="mt-2 text-xl font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-[#A1A1AA] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. WHY STEALREEL (Simple by design) */}
      <section className="py-16 sm:py-20 border-t border-[#27272A] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Simple by design.
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Zap,
                title: "FAST",
                desc: "Get to your download without unnecessary steps.",
              },
              {
                icon: Lock,
                title: "NO LOGIN",
                desc: "We never ask for your Instagram password.",
              },
              {
                icon: Shield,
                title: "HIGH QUALITY",
                desc: "Download available media in the best supported quality.",
              },
              {
                icon: Smartphone,
                title: "MOBILE FRIENDLY",
                desc: "Designed to work smoothly on phones, tablets and desktops.",
              },
            ].map((item) => (
              <div key={item.title} className="clean-card p-6 text-left">
                <item.icon className="h-5 w-5 text-[#6366F1]" />
                <h3 className="mt-4 font-mono text-xs font-bold tracking-wider text-white">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-[#A1A1AA] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. TRUST / PRIVACY SECTION */}
      <section className="py-16 sm:py-20 border-t border-[#27272A] px-4 sm:px-6 lg:px-8 bg-[#0E0E11]">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#27272A] bg-[#141416] px-3.5 py-1 text-xs font-medium text-[#A1A1AA] mb-4">
            <Shield className="h-3.5 w-3.5 text-[#10B981]" />
            <span>Public content only.</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Your Instagram password is never needed.
          </h2>

          <p className="mt-4 text-sm sm:text-base text-[#A1A1AA] leading-relaxed">
            StealReel works with public Instagram links. We do not ask you to log in to Instagram to
            use the downloader.
          </p>

          <p className="mt-3 text-xs sm:text-sm text-[#A1A1AA]/80 leading-relaxed">
            Links are processed only as needed to provide the download and are not intentionally
            stored as a personal media library.
          </p>
        </div>
      </section>

      {/* 10. FAQ SECTION */}
      <section id="faq" className="py-16 sm:py-20 border-t border-[#27272A] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {[
              {
                q: "1. What is StealReel?",
                a: "StealReel is a simple tool for downloading supported media from public Instagram links.",
              },
              {
                q: "2. Do I need to log in to Instagram?",
                a: "No. StealReel does not require your Instagram username or password.",
              },
              {
                q: "3. What can I download?",
                a: "You can download supported public Instagram Reels, videos, photos and Stories.",
              },
              {
                q: "4. Can I download private Instagram content?",
                a: "No. StealReel is designed for publicly accessible content and does not provide access to private accounts.",
              },
              {
                q: "5. Is StealReel free?",
                a: "Yes, the basic downloader is free to use.",
              },
              {
                q: "6. Why isn't my link working?",
                a: "Make sure you're using a valid, publicly accessible Instagram URL. Some content may not be supported or may be unavailable.",
              },
              {
                q: "7. Where are downloaded files saved?",
                a: "They are saved to your device according to your browser's normal download settings.",
              },
              {
                q: "8. Does StealReel store my Instagram password?",
                a: "No. StealReel does not require your Instagram password.",
              },
            ].map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="rounded-xl border border-[#27272A] bg-[#141416] px-5 overflow-hidden"
              >
                <AccordionTrigger className="text-sm sm:text-base font-semibold text-white hover:no-underline py-4 text-left">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-[#A1A1AA] pb-4 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* 11. RESPONSIBLE USE */}
      <div className="border-t border-[#27272A] px-4 py-8 bg-[#0E0E11]">
        <p className="mx-auto max-w-4xl text-center text-xs text-[#A1A1AA]/80 leading-relaxed">
          StealReel is intended for downloading publicly available content that you have permission
          to save or use. Please respect creators' rights, Instagram's terms, and applicable
          copyright laws.
        </p>
      </div>

      {/* 12. FOOTER */}
      <footer className="border-t border-[#27272A] bg-[#0B0B0D] py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-8 pb-12">
            {/* Brand Left */}
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#141416] border border-[#27272A] text-[#6366F1]">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 fill-none stroke-current stroke-[2]"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="4" />
                    <path d="M12 8v8" />
                    <path d="m8 12 4 4 4-4" />
                  </svg>
                </div>
                <span className="text-base font-bold text-white">StealReel</span>
              </div>
              <p className="mt-3 font-semibold text-sm text-white">"Your reels. Your vault."</p>
              <p className="mt-1 text-xs text-[#A1A1AA] leading-relaxed max-w-xs">
                A simple downloader for supported public Instagram content.
              </p>
            </div>

            {/* Column 1: Tools */}
            <div>
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white mb-3">
                Tools
              </h4>
              <ul className="space-y-2 text-xs text-[#A1A1AA]">
                <li>
                  <button onClick={() => scrollToSection("downloader")} className="hover:text-white transition">
                    Instagram Reels
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("downloader")} className="hover:text-white transition">
                    Instagram Videos
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("downloader")} className="hover:text-white transition">
                    Instagram Photos
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("downloader")} className="hover:text-white transition">
                    Instagram Stories
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 2: Company */}
            <div>
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white mb-3">
                Company
              </h4>
              <ul className="space-y-2 text-xs text-[#A1A1AA]">
                <li>
                  <button onClick={() => scrollToSection("downloader")} className="hover:text-white transition">
                    About
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("how-it-works")} className="hover:text-white transition">
                    How It Works
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("faq")} className="hover:text-white transition">
                    FAQ
                  </button>
                </li>
                <li>
                  <a href="#faq" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Legal */}
            <div>
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white mb-3">
                Legal
              </h4>
              <ul className="space-y-2 text-xs text-[#A1A1AA]">
                <li>
                  <a href="#privacy" className="hover:text-white transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#terms" className="hover:text-white transition">
                    Terms of Use
                  </a>
                </li>
                <li>
                  <a href="#responsible-use" className="hover:text-white transition">
                    Responsible Use
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#27272A] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A1A1AA]">
            <span>© 2026 StealReel. All rights reserved.</span>
            <span>Fast, clean, consumer utility.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
