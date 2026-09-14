import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/download")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const requestUrl = new URL(request.url);
        const target = requestUrl.searchParams.get("url");
        const name = (requestUrl.searchParams.get("name") || "instagram-video").replace(
          /[^a-zA-Z0-9._-]/g,
          "_",
        );

        if (!target) return new Response("Missing url", { status: 400 });

        let parsed: URL;
        try {
          parsed = new URL(target);
        } catch {
          return new Response("Invalid url", { status: 400 });
        }

        const allowed = /(^|\.)(cdninstagram\.com|fbcdn\.net|instagram\.com|akamaihd\.net|rapidapi\.com)$/i;
        if (parsed.protocol !== "https:" || !allowed.test(parsed.hostname)) {
          return new Response("Host not allowed", { status: 400 });
        }

        const rangeHeader = request.headers.get("range");
        const fetchHeaders: Record<string, string> = {
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          referer: "https://www.instagram.com/",
        };
        if (rangeHeader) {
          fetchHeaders["range"] = rangeHeader;
        }

        const upstream = await fetch(parsed.toString(), {
          headers: fetchHeaders,
        });

        if (!upstream.ok || !upstream.body) {
          return new Response("Could not fetch the video", { status: upstream.status || 502 });
        }

        const inline = requestUrl.searchParams.get("mode") === "inline";
        const contentType = upstream.headers.get("content-type") || "video/mp4";
        const isImage =
          requestUrl.searchParams.get("type") === "image" ||
          contentType.startsWith("image/");
        const ext = isImage ? "jpg" : "mp4";

        const responseHeaders: Record<string, string> = {
          "content-type": contentType,
          "content-disposition": inline
            ? "inline"
            : `attachment; filename="${name}.${ext}"`,
          "cache-control": "no-store",
          "accept-ranges": "bytes",
        };

        const contentRange = upstream.headers.get("content-range");
        if (contentRange) responseHeaders["content-range"] = contentRange;
        const contentLength = upstream.headers.get("content-length");
        if (contentLength) responseHeaders["content-length"] = contentLength;

        return new Response(upstream.body, {
          status: upstream.status,
          headers: responseHeaders,
        });

      },
    },
  },
});
