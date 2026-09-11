import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type MediaKind = "reel" | "post" | "igtv" | "story" | "unknown";

export type AnalyzeResult = {
  kind: MediaKind;
  creator: string;
  creatorName: string;
  caption: string | null;
  thumbnail: string | null;
  videoUrl: string;
  duration: number | null;

  likes: number | null;
  comments: number | null;
  postedAt: string | null;
};

const inputSchema = z.object({ url: z.string().trim().min(5).max(500) });

export function detectKind(url: string): MediaKind {
  const u = url.toLowerCase();
  if (u.includes("/stories/")) return "story";
  if (u.includes("/reel/") || u.includes("/reels/")) return "reel";
  if (u.includes("/tv/")) return "igtv";
  if (u.includes("/p/")) return "post";
  return "unknown";
}

function normalizeUrl(raw: string): string {
  let link = raw.trim();
  if (!/^https?:\/\//i.test(link)) link = `https://${link}`;
  const parsed = new URL(link);
  parsed.search = "";
  parsed.hash = "";
  parsed.hostname = "www.instagram.com";
  if (!parsed.pathname.endsWith("/")) parsed.pathname += "/";
  return parsed.toString();
}

function decodeEntities(value: string): string {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)));
}

/** Read the duration out of the MP4 header (mvhd atom) without downloading the file. */
async function readDuration(mediaUrl: string): Promise<number | null> {
  try {
    const res = await fetch(mediaUrl, {
      headers: {
        range: "bytes=0-262143",
        "user-agent": "Mozilla/5.0",
        referer: "https://www.instagram.com/",
      },
    });
    if (!res.ok) return null;
    const view = new DataView(await res.arrayBuffer());
    for (let i = 0; i < view.byteLength - 32; i++) {
      if (
        view.getUint8(i) === 0x6d &&
        view.getUint8(i + 1) === 0x76 &&
        view.getUint8(i + 2) === 0x68 &&
        view.getUint8(i + 3) === 0x64
      ) {
        const version = view.getUint8(i + 4);
        const offset = i + 8 + (version === 0 ? 8 : 16);
        const scale = view.getUint32(offset);
        const units = version === 0 ? view.getUint32(offset + 4) : Number(view.getBigUint64(offset + 4));
        if (scale > 0 && units > 0) return units / scale;
        return null;
      }
    }
    return null;
  } catch {
    return null;
  }
}


function metaTag(html: string, property: string): string | null {
  const re = new RegExp(`<meta[^>]+property="${property}"[^>]+content="([^"]*)"`, "i");
  const match = re.exec(html);
  return match?.[1] ? decodeEntities(match[1]) : null;
}

function parseCount(value: string | undefined): number | null {
  if (!value) return null;
  const clean = value.replace(/,/g, "").toUpperCase();
  const num = parseFloat(clean);
  if (Number.isNaN(num)) return null;
  if (clean.includes("K")) return Math.round(num * 1000);
  if (clean.includes("M")) return Math.round(num * 1_000_000);
  return Math.round(num);
}

/** Scrape the public page for creator, caption and engagement details. */
async function fetchPageDetails(link: string) {
  const details: {
    creator: string | null;
    creatorName: string | null;
    caption: string | null;
    thumbnail: string | null;
    likes: number | null;
    comments: number | null;
    postedAt: string | null;
  } = {
    creator: null,
    creatorName: null,
    caption: null,
    thumbnail: null,
    likes: null,
    comments: null,
    postedAt: null,
  };

  try {
    const res = await fetch(link, {
      headers: {
        "user-agent": "facebookexternalhit/1.1",
        "accept-language": "en-US,en;q=0.9",
      },
    });
    if (!res.ok) return details;
    const html = await res.text();

    const title = metaTag(html, "og:title");
    const description = metaTag(html, "og:description");
    details.thumbnail = metaTag(html, "og:image");

    const ogUrl = metaTag(html, "og:url");
    const fromUrl = ogUrl ? /instagram\.com\/([^/]+)\/(reel|p|tv)\//.exec(ogUrl) : null;
    if (fromUrl?.[1]) details.creator = fromUrl[1];

    if (title) {
      const named = /^(.*?)\s+on Instagram/.exec(title);
      if (named?.[1]) details.creatorName = named[1].trim();
      const quoted = /:\s*"([\s\S]*)"?$/.exec(title);
      if (quoted?.[1]) details.caption = quoted[1].replace(/"$/, "").trim();
    }

    if (description) {
      const stats = /^([\d.,KM]+)\s+likes?,\s+([\d.,KM]+)\s+comments?\s+-\s+([^\s]+)\s+on\s+([^:]+):/i.exec(
        description,
      );
      if (stats) {
        details.likes = parseCount(stats[1]);
        details.comments = parseCount(stats[2]);
        if (!details.creator) details.creator = stats[3] ?? null;
        details.postedAt = stats[4]?.trim() ?? null;
      }
      if (!details.caption) {
        const capt = /:\s*"([\s\S]*)"?$/.exec(description);
        if (capt?.[1]) details.caption = capt[1].replace(/"$/, "").trim();
      }
    }
  } catch {
    // metadata is best-effort; the download still works without it
  }

  return details;
}

export const analyzeLink = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<AnalyzeResult> => {
    const key = process.env["RAPIDAPI_KEY"];
    const host =
      process.env["RAPIDAPI_HOST"] ||
      "instagram-downloader-scraper-reels-igtv-posts-stories.p.rapidapi.com";
    if (!key) throw new Error("The download service is not configured yet.");

    let link: string;
    try {
      link = normalizeUrl(data.url);
    } catch {
      throw new Error("That doesn't look like a valid link.");
    }
    if (!/(^|\.)instagram\.com$/i.test(new URL(link).hostname)) {
      throw new Error("Please paste a full Instagram link.");
    }

    const kind = detectKind(link);

    const endpoint = `https://${host}/scraper?url=${encodeURIComponent(link)}`;
    const res = await fetch(endpoint, {
      headers: { "x-rapidapi-key": key, "x-rapidapi-host": host },
    });
    const text = await res.text();

    let payload: { data?: Array<{ media?: string; thumb?: string; isVideo?: boolean }>; message?: unknown };
    try {
      payload = JSON.parse(text) as typeof payload;
    } catch {
      throw new Error("The media service returned an unexpected response. Please try again.");
    }

    if (!res.ok) {
      const raw = Array.isArray(payload.message) ? payload.message.join(", ") : String(payload.message ?? "");
      if (/private/i.test(raw)) {
        throw new Error(
          "This post is private, expired or unavailable. Only public reels, posts, IGTV and stories can be fetched.",
        );
      }
      throw new Error(raw || "The media service could not read that link.");
    }

    const items = payload.data ?? [];
    const video = items.find((item) => item.isVideo && item.media) ?? items.find((item) => item.media);
    if (!video?.media) {
      throw new Error("No video found at that link — it may be a photo-only post.");
    }
    if (!video.isVideo) {
      throw new Error("That link is a photo, not a video.");
    }

    const [details, duration] = await Promise.all([
      fetchPageDetails(link),
      readDuration(video.media),
    ]);

    return {
      kind,
      creator: details.creator ?? "instagram",
      creatorName: details.creatorName ?? details.creator ?? "Unknown creator",
      caption: details.caption,
      thumbnail: video.thumb ?? details.thumbnail ?? null,
      videoUrl: video.media,
      duration,
      likes: details.likes,

      comments: details.comments,
      postedAt: details.postedAt,
    };
  });
