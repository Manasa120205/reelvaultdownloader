import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, HeartHandshake, ShieldAlert, Sparkles, UserCheck, Copyright, Mail } from "lucide-react";

export const Route = createFileRoute("/responsible-use")({
  head: () => ({
    meta: [
      { title: "Responsible Use Guidelines – StealReel" },
      {
        name: "description",
        content: "Guidelines for ethical, legal, and responsible downloading of public Instagram reels and media.",
      },
      { property: "og:title", content: "Responsible Use Guidelines – StealReel" },
      { property: "og:description", content: "Best practices for ethical media downloading and respecting creator rights." },
    ],
  }),
  component: ResponsibleUsePage,
});

function ResponsibleUsePage() {
  return (
    <div className="min-h-screen bg-[#0B0B0E] text-[#FAFAFA] selection:bg-[#6366F1] selection:text-white flex flex-col font-sans">
      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-40 border-b border-[#27272A] bg-[#0B0B0E]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5 group" aria-label="StealReel Home">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#141416] border border-[#27272A] text-[#6366F1] group-hover:border-[#6366F1]/50 transition">
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
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#A1A1AA] hover:text-white transition py-2 px-3 rounded-lg hover:bg-[#141416] border border-transparent hover:border-[#27272A]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Downloader</span>
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Header Badge & Title */}
          <div className="mb-10 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#27272A] bg-[#141416] px-3 py-1 text-xs font-medium text-[#10B981] mb-4">
              <HeartHandshake className="h-3.5 w-3.5" />
              <span>Community Standards</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Responsible Use Guidelines
            </h1>
            <p className="mt-2 text-sm text-[#A1A1AA]">
              How to use StealReel ethically, respect creative work, and protect online privacy.
            </p>
          </div>

          {/* Quick Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
            <div className="rounded-xl border border-[#27272A] bg-[#141416] p-4 text-left">
              <UserCheck className="h-5 w-5 text-[#10B981] mb-2" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Credit the Creator</h3>
              <p className="mt-1 text-xs text-[#A1A1AA] leading-relaxed">
                Always attribute original authors if you share clips with friends or for reference.
              </p>
            </div>

            <div className="rounded-xl border border-[#27272A] bg-[#141416] p-4 text-left">
              <Sparkles className="h-5 w-5 text-[#6366F1] mb-2" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Personal Archiving</h3>
              <p className="mt-1 text-xs text-[#A1A1AA] leading-relaxed">
                Use StealReel for offline learning, fitness routines, recipes, and personal keepsakes.
              </p>
            </div>

            <div className="rounded-xl border border-[#27272A] bg-[#141416] p-4 text-left">
              <ShieldAlert className="h-5 w-5 text-[#EC4899] mb-2" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">No Commercial Resale</h3>
              <p className="mt-1 text-xs text-[#A1A1AA] leading-relaxed">
                Never monetize, resell, or distribute creators' video clips without their authorization.
              </p>
            </div>
          </div>

          {/* Body Sections */}
          <div className="space-y-8 text-sm leading-relaxed text-[#A1A1AA] border-t border-[#27272A] pt-8">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">1. Our Philosophy</h2>
              <p>
                StealReel was built to give everyday internet users a fast, clutter-free way to save publicly accessible videos for legitimate personal offline viewing — whether saving workout routines, travel spots, recipes for offline cooking, or backups of your own uploaded content.
              </p>
              <p>
                With powerful tools comes the shared responsibility to treat creators and online communities with honor and respect.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">2. Best Practices for Saving Content</h2>
              <div className="space-y-3">
                <div className="rounded-xl border border-[#27272A] bg-[#141416] p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">✓ What We Encourage</h4>
                  <ul className="mt-2 list-disc pl-5 space-y-1 text-xs text-[#A1A1AA]">
                    <li>Downloading public videos to view offline during flights, commutes, or low-connectivity zones.</li>
                    <li>Backing up high-definition copies of your own Reels, photos, and stories.</li>
                    <li>Saving instructional material, tutorials, study guides, and recipes for private educational reference.</li>
                    <li>Creating personal design inspiration moodboards and non-commercial mood archives.</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-red-400">✕ What is Strictly Prohibited</h4>
                  <ul className="mt-2 list-disc pl-5 space-y-1 text-xs text-[#A1A1AA]">
                    <li>Re-uploading creator videos to your own YouTube channel, TikTok, or Instagram accounts to earn ad revenue or gain followers without written permission.</li>
                    <li>Stripping creator watermarks, logos, or author credits from media files.</li>
                    <li>Using downloaded media to harass, defame, impersonate, or intimidate individuals.</li>
                    <li>Creating misleading AI deepfakes, deceptive edits, or abusive parodies.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">3. How to Credit Original Creators</h2>
              <p>
                If you reference or share a downloaded clip in a group chat, study session, or permissible fair-use project, make sure to:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-[#A1A1AA]">
                <li>Clearly mention the creator's Instagram username (e.g., <span className="text-white font-mono">@creator_handle</span>).</li>
                <li>Provide a direct link back to their original Instagram post or profile so viewers can follow and support them.</li>
                <li>Never claim ownership of someone else's creative footage, musical arrangement, or voiceover.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Copyright className="h-4 w-4 text-[#6366F1]" />
                4. For Creators &amp; Rights Holders
              </h2>
              <p>
                We hold immense admiration for the global community of creators whose work inspires millions daily. StealReel does not host any media files and only processes publicly viewable Instagram URLs upon direct user command.
              </p>
              <p>
                If you have questions, wish to request URL domain exclusions, or have inquiries regarding our utility, our support team is at your disposal.
              </p>
            </section>

            <section className="space-y-3 rounded-2xl border border-[#27272A] bg-[#141416] p-6">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#6366F1]" />
                5. Need Assistance?
              </h2>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Reach out to us anytime for community questions, content inquiries, or support requests.
              </p>
              <div className="pt-2">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-xl bg-[#6366F1] px-4 py-2 text-xs font-semibold text-white hover:bg-[#4F46E5] transition"
                >
                  Contact StealReel Team
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#27272A] bg-[#0B0B0D] py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A1A1AA]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">StealReel</span>
            <span>•</span>
            <span>© 2026 StealReel. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
            <Link to="/terms-of-use" className="hover:text-white transition">Terms of Use</Link>
            <Link to="/responsible-use" className="hover:text-white transition text-white font-medium">Responsible Use</Link>
            <Link to="/contact" className="hover:text-white transition">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
