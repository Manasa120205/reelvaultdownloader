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

        const allowed = /(^|\.)(cdninstagram\.com|fbcdn\.net|instagram\.com)$/i;
        if (parsed.protocol !== "https:" || !allowed.test(parsed.hostname)) {
          return new Response("Host not allowed", { status: 400 });
        }

        const upstream = await fetch(parsed.toString(), {
          headers: { "user-agent": "Mozilla/5.0", referer: "https://www.instagram.com/" },
        });

        if (!upstream.ok || !upstream.body) {
          return new Response("Could not fetch the video", { status: 502 });
        }

        const inline = requestUrl.searchParams.get("mode") === "inline";

        return new Response(upstream.body, {
          status: 200,
          headers: {
            "content-type": upstream.headers.get("content-type") || "video/mp4",
            "content-disposition": inline
              ? "inline"
              : `attachment; filename="${name}.mp4"`,
            "cache-control": "no-store",
          },
        });

      },
    },
  },
});
