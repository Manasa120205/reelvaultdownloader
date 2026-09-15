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
  return "http://localhost:3000";
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
export async function downloadMedia(url: string): Promise<DownloadSuccessResponse> {
  const baseUrl = getApiBaseUrl();
  let res: Response;

  try {
    res = await fetch(`${baseUrl}/api/media/download`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ url: url.trim() }),
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

  return data as DownloadSuccessResponse;
}

/**
 * Triggers the browser download for the given direct media stream URL.
 */
export function triggerBrowserDownload(downloadUrl: string, filename: string): void {
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = filename || "instagram-media.mp4";
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  link.remove();
}
