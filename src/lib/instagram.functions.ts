import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type MediaKind = "reel" | "post" | "igtv" | "story" | "unknown";

export type AnalyzeResult = {
  kind: MediaKind;
  creator: string;
  creatorName: string;
  avatar: string | null;
  duration: number | null;
  thumbnail: string | null;
  caption: string | null;
  videoUrl: string;
  likes: number | null;
  views: number | null;
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

/** Walk an unknown JSON payload and pick out the fields we need. */
function harvest(node: unknown, out: Record<string, unknown>, depth = 0): void {
  if (!node || depth > 8) return;
  if (Array.isArray(node)) {
    for (const item of node) harvest(item, out, depth + 1);
    return;
  }
  if (typeof node !== "object") return;
  const obj = node as Record<string, unknown>;

  for (const [key, value] of Object.entries(obj)) {
    const k = key.toLowerCase();
    if (
      typeof value === "string" &&
      !out["videoUrl"] &&
      (k === "video_url" || k === "videourl" || k === "download_url" || k === "play_url") &&
      value.startsWith("http")
    ) {
      out["videoUrl"] = value;
    }
    if (
      typeof value === "string" &&
      !out["thumbnail"] &&
      (k === "thumbnail_url" || k === "display_url" || k === "thumbnail_src" || k === "cover" || k === "cover_url") &&
      value.startsWith("http")
    ) {
      out["thumbnail"] = value;
    }
    if (
      typeof value === "number" &&
      !out["duration"] &&
      (k === "video_duration" || k === "duration" || k === "video_duration_ms")
    ) {
      out["duration"] = k === "video_duration_ms" ? value / 1000 : value;
    }
    if (typeof value === "string" && !out["username"] && k === "username") out["username"] = value;
    if (typeof value === "string" && !out["fullName"] && (k === "full_name" || k === "fullname")) {
      out["fullName"] = value;
    }
    if (
      typeof value === "string" &&
      !out["avatar"] &&
      (k === "profile_pic_url" || k === "profile_pic_url_hd" || k === "profile_picture") &&
      value.startsWith("http")
    ) {
      out["avatar"] = value;
    }
    if (typeof value === "string" && !out["caption"] && (k === "caption_text" || k === "text")) {
      out["caption"] = value;
    }
    if (typeof value === "number" && !out["likes"] && (k === "like_count" || k === "likes")) out["likes"] = value;
    if (typeof value === "number" && !out["views"] && (k === "play_count" || k === "view_count" || k === "views")) {
      out["views"] = value;
    }
    if (typeof value === "string" && !out["productType"] && (k === "product_type" || k === "media_name")) {
      out["productType"] = value;
    }
    if (value && typeof value === "object") harvest(value, out, depth + 1);
  }
}

async function callRapidApi(path: string, url: string, key: string, host: string) {
  const endpoint = `https://${host}${path}${encodeURIComponent(url)}`;
  const res = await fetch(endpoint, {
    headers: { "x-rapidapi-key": key, "x-rapidapi-host": host },
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Service responded ${res.status}. ${text.slice(0, 160)}`);
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error("Unexpected response from the media service.");
  }
}

export const analyzeLink = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<AnalyzeResult> => {
    const key = process.env["RAPIDAPI_KEY"];
    const host = process.env["RAPIDAPI_HOST"] || "instagram-scraper-api2.p.rapidapi.com";
    if (!key) throw new Error("The download service is not configured yet.");

    const link = data.url.trim();
    if (!/instagram\.com/i.test(link)) {
      throw new Error("Please paste a full Instagram link.");
    }

    const kind = detectKind(link);
    const paths =
      kind === "story"
        ? ["/v1/story_info?url=", "/v1/post_info?code_or_id_or_url="]
        : ["/v1/post_info?code_or_id_or_url=", "/v1/story_info?url="];

    let payload: unknown = null;
    let lastError: Error | null = null;
    for (const path of paths) {
      try {
        payload = await callRapidApi(path, link, key, host);
        const probe: Record<string, unknown> = {};
        harvest(payload, probe);
        if (probe["videoUrl"]) break;
      } catch (err) {
        lastError = err as Error;
      }
    }
    if (!payload && lastError) throw lastError;

    const found: Record<string, unknown> = {};
    harvest(payload, found);

    const videoUrl = found["videoUrl"] as string | undefined;
    if (!videoUrl) {
      throw new Error("No video found at that link. It may be private, deleted, or a photo-only post.");
    }

    const productType = String(found["productType"] ?? "").toLowerCase();
    let resolvedKind: MediaKind = kind;
    if (kind === "unknown") {
      if (productType.includes("clips") || productType.includes("reel")) resolvedKind = "reel";
      else if (productType.includes("igtv")) resolvedKind = "igtv";
      else if (productType.includes("story")) resolvedKind = "story";
      else resolvedKind = "post";
    }

    return {
      kind: resolvedKind,
      creator: (found["username"] as string) ?? "unknown",
      creatorName: (found["fullName"] as string) ?? (found["username"] as string) ?? "Unknown creator",
      avatar: (found["avatar"] as string) ?? null,
      duration: typeof found["duration"] === "number" ? (found["duration"] as number) : null,
      thumbnail: (found["thumbnail"] as string) ?? null,
      caption: (found["caption"] as string) ?? null,
      videoUrl,
      likes: typeof found["likes"] === "number" ? (found["likes"] as number) : null,
      views: typeof found["views"] === "number" ? (found["views"] as number) : null,
    };
  });
