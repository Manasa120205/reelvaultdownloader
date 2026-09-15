export interface QuotaInfo {
  limit: number;
  used?: number;
  remaining: number;
  totalRequests?: number;
  successfulRequests?: number;
  failedRequests?: number;
  resetAt?: string;
  enabled?: boolean;
}

export interface AnalyzeSuccessResponse {
  success: true;
  requestId?: string;
  platform: string;
  type: "reel" | "video" | "post" | string;
  title: string;
  thumbnail: string;
  available: boolean;
}

export interface DownloadSuccessResponse {
  success: true;
  requestId?: string;
  downloadUrl: string;
  filename: string;
  type: "reel" | "video" | "post" | string;
  quota?: QuotaInfo;
}

export interface ApiRawErrorResponse {
  success: false;
  requestId?: string;
  error?: string | {
    code?: string;
    message?: string;
  };
  code?: string;
  message?: string;
}

export class PublicMediaApiError extends Error {
  code: string;
  status?: number | undefined;

  constructor(message: string, code: string = "UNKNOWN_ERROR", status?: number | undefined) {
    super(message);
    this.name = "PublicMediaApiError";
    this.code = code;
    this.status = status;
  }
}

/**
 * Returns the base URL for the PublicMedia backend API.
 * Configured via VITE_API_URL or defaults to http://localhost:3000
 */
export function getApiBaseUrl(): string {
  const envUrl =
    typeof import.meta !== "undefined" && import.meta.env
      ? (import.meta.env["VITE_API_URL"] as string | undefined)
      : undefined;
  if (envUrl) {
    return envUrl.trim().replace(/\/+$/, "");
  }
  return "https://public-media-api.onrender.com";
}

/**
 * Maps API error codes to user-friendly UI explanations.
 */
export function formatUserErrorMessage(code?: string, rawMessage?: string): string {
  switch (code) {
    case "INVALID_URL":
      return "Please enter a valid Instagram URL (e.g., https://www.instagram.com/reel/...).";
    case "UNSUPPORTED_DOMAIN":
      return "Only public Instagram URLs are supported. Please paste an Instagram link.";
    case "PRIVATE_CONTENT":
      return "This Reel or Post is from a private account. Only public media can be analyzed and downloaded.";
    case "MONTHLY_LIMIT_REACHED":
      return "The free monthly download limit (5,000) has been reached. Please check back next month.";
    case "RATE_LIMITED":
      return "Too many requests. Please wait a moment and try again.";
    case "MEDIA_UNAVAILABLE":
      return "Unable to extract media from this Instagram link. The content may be deleted, restricted, or private.";
    default:
      if (rawMessage && !rawMessage.toLowerCase().includes("failed to fetch")) {
        return rawMessage;
      }
      return "Unable to connect to the media server. Please ensure the backend is running and try again.";
  }
}

/**
 * Fetches the current monthly quota status from the backend.
 */
export async function fetchQuota(): Promise<QuotaInfo | null> {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/media/quota`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    if (data && data.success && data.quota) {
      return data.quota as QuotaInfo;
    }
    return null;
  } catch (err) {
    console.warn("Could not fetch API quota from backend:", err);
    return null;
  }
}

/**
 * Analyzes a public Instagram media URL and returns preview metadata.
 */
export async function analyzeMedia(url: string): Promise<AnalyzeSuccessResponse> {
  const baseUrl = getApiBaseUrl();
  let res: Response;

  try {
    res = await fetch(`${baseUrl}/api/media/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ url: url.trim() }),
    });
  } catch (err) {
    throw new PublicMediaApiError(
      "Unable to connect to backend media server. Please ensure http://localhost:3000 is active.",
      "NETWORK_ERROR"
    );
  }

  let data: any;
  try {
    data = await res.json();
  } catch {
    throw new PublicMediaApiError("Received an invalid response from media server.", "INVALID_RESPONSE", res.status);
  }

  if (!res.ok || !data.success) {
    const rawError = data?.error;
    const code =
      data?.code ||
      (typeof rawError === "object" && rawError?.code) ||
      (res.status === 429 ? "RATE_LIMITED" : "MEDIA_UNAVAILABLE");
    const message =
      (typeof rawError === "string" ? rawError : rawError?.message) ||
      data?.message ||
      formatUserErrorMessage(code);

    throw new PublicMediaApiError(formatUserErrorMessage(code, message), code, res.status);
  }

  return data as AnalyzeSuccessResponse;
}

/**
 * Generates the media stream download URL and decrements quota.
 */
export async function downloadMedia(url: string, quality?: string): Promise<DownloadSuccessResponse> {
  const baseUrl = getApiBaseUrl();
  let res: Response;

  const payload: { url: string; quality?: string } = { url: url.trim() };
  if (quality) payload.quality = quality;

  try {
    res = await fetch(`${baseUrl}/api/media/download`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    throw new PublicMediaApiError(
      "Unable to connect to backend media server to prepare download.",
      "NETWORK_ERROR"
    );
  }

  let data: any;
  try {
    data = await res.json();
  } catch {
    throw new PublicMediaApiError("Received an invalid response from media server.", "INVALID_RESPONSE", res.status);
  }

  if (!res.ok || !data || !data.success) {
    const rawError = data?.error;
    const code =
      data?.code ||
      (typeof rawError === "object" && rawError?.code) ||
      (res.status === 429 ? "RATE_LIMITED" : "MEDIA_UNAVAILABLE");
    const message =
      (typeof rawError === "string" ? rawError : rawError?.message) ||
      data?.message ||
      formatUserErrorMessage(code);

    throw new PublicMediaApiError(formatUserErrorMessage(code, message), code, res.status);
  }

  const normalized: DownloadSuccessResponse = {
    success: true,
    requestId: data.requestId || data.data?.requestId,
    downloadUrl:
      data.downloadUrl ||
      data.download_url ||
      data.url ||
      data.data?.downloadUrl ||
      data.data?.url ||
      "",
    filename:
      data.filename ||
      data.fileName ||
      data.file_name ||
      data.data?.filename ||
      "instagram-media.mp4",
    type: data.type || data.mediaType || data.data?.type || "reel",
    quota: data.quota || data.data?.quota,
  };

  return normalized;
}

/**
 * Forces the browser to immediately download the media file to the user's
 * computer without opening or playing the video in the browser player.
 */
export async function triggerBrowserDownload(downloadUrl: string, filename?: string): Promise<void> {
  if (!downloadUrl) return;
  const safeFilename = filename || "instagram-media.mp4";
  const isImage = safeFilename.endsWith(".jpg") || safeFilename.endsWith(".jpeg") || safeFilename.endsWith(".png");
  const cleanBaseName = safeFilename.replace(/\.[a-zA-Z0-9]+$/, "");

  // Strategy 1: Client-side fetch as a Blob
  // Because blob URLs are same-origin (blob:http://localhost:8080/...), the HTML5 download attribute
  // is strictly enforced by Chrome/Edge/Safari, which instantly saves the file to disk without playing.
  try {
    const res = await fetch(downloadUrl);
    if (res.ok) {
      const blob = await res.blob();
      const downloadBlob = new Blob([blob], {
        type: isImage ? (blob.type || "image/jpeg") : "application/octet-stream",
      });
      const blobUrl = URL.createObjectURL(downloadBlob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = safeFilename;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
        link.remove();
      }, 15000);
      return;
    }
  } catch (err) {
    console.warn("Direct blob download restricted by CORS, falling back to attachment proxy:", err);
  }

  // Strategy 2: Same-origin streaming proxy with Content-Disposition: attachment
  // Sends Content-Disposition: attachment & Content-Type: application/octet-stream
  // The browser CANNOT play this inline; it is forced to save directly to the Downloads folder.
  const proxyEndpoint = `/api/public/download?url=${encodeURIComponent(downloadUrl)}&name=${encodeURIComponent(cleanBaseName)}${isImage ? "&type=image" : ""}`;
  const proxyLink = document.createElement("a");
  proxyLink.href = proxyEndpoint;
  proxyLink.download = safeFilename;
  proxyLink.style.display = "none";
  document.body.appendChild(proxyLink);
  proxyLink.click();
  setTimeout(() => proxyLink.remove(), 2000);
}
