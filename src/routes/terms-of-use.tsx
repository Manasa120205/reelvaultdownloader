import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, Shield, Scale, Mail } from "lucide-react";

export const Route = createFileRoute("/terms-of-use")({
  head: () => ({
    meta: [
      { title: "Terms of Use – StealReel" },
      {
        name: "description",
        content: "Review the terms and conditions for using StealReel, the fast and clean public Instagram reel downloader.",
      },
      { property: "og:title", content: "Terms of Use – StealReel" },
      { property: "og:description", content: "Terms of Use for StealReel public Instagram media utility." },
    ],
  }),
  component: TermsOfUsePage,
});

function TermsOfUsePage() {
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
            <div className="inline-flex items-center gap-2 rounded-full border border-[#27272A] bg-[#141416] px-3 py-1 text-xs font-medium text-[#6366F1] mb-4">
              <FileText className="h-3.5 w-3.5" />
              <span>Legal Agreement</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Terms of Use
            </h1>
            <p className="mt-2 text-sm text-[#A1A1AA]">
              Last updated: September 15, 2026 • Please read carefully before using StealReel
            </p>
          </div>

          {/* Key Terms Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
            <div className="rounded-xl border border-[#27272A] bg-[#141416] p-4 text-left">
              <CheckCircle className="h-5 w-5 text-[#10B981] mb-2" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Public Content Only</h3>
              <p className="mt-1 text-xs text-[#A1A1AA] leading-relaxed">
                Our tool is designed solely to access and download publicly available links.
              </p>
            </div>

            <div className="rounded-xl border border-[#27272A] bg-[#141416] p-4 text-left">
              <Shield className="h-5 w-5 text-[#6366F1] mb-2" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Personal Fair Use</h3>
              <p className="mt-1 text-xs text-[#A1A1AA] leading-relaxed">
                Downloaded content is intended for personal offline archival, reference, or education.
              </p>
            </div>

            <div className="rounded-xl border border-[#27272A] bg-[#141416] p-4 text-left">
              <Scale className="h-5 w-5 text-[#EAB308] mb-2" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Creator Rights</h3>
              <p className="mt-1 text-xs text-[#A1A1AA] leading-relaxed">
                You must respect copyright and obtain creator consent before re-uploading media.
              </p>
            </div>
          </div>

          {/* Terms Content */}
          <div className="space-y-8 text-sm leading-relaxed text-[#A1A1AA] border-t border-[#27272A] pt-8">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">1. Acceptance of Terms</h2>
              <p>
                By accessing, browsing, or utilizing the StealReel website (<span className="text-white font-mono">stealreel.com</span>) or any related utilities, you explicitly agree to comply with and be bound by these Terms of Use, our Privacy Policy, and our Responsible Use Guidelines. If you do not agree to these terms, you must not use our service.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">2. Purpose &amp; Nature of Service</h2>
              <p>
                StealReel is an online technical utility engineered to extract streamable media endpoints from publicly accessible Instagram posts, reels, videos, stories, and images for offline personal viewing.
              </p>
              <p>
                StealReel does not bypass technical access controls or DRM protections, does not grant access to private profiles, and does not require or accept user authentication credentials.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">3. Permitted &amp; Prohibited Conduct</h2>
              <p>When utilizing StealReel, you agree that you will NOT:</p>
              <ul className="list-disc pl-5 space-y-2 text-[#A1A1AA]">
                <li>Attempt to scrape, brute-force, reverse engineer, or exploit our API or backend infrastructure.</li>
                <li>Conduct automated denial-of-service (DoS/DDoS) attacks or flood requests that impact system availability for other users.</li>
                <li>Download or redistribute copyright-protected media for commercial monetization, resale, or mass redistribution without express written permission from the copyright owner.</li>
                <li>Use the service to harvest or scrape personal media for stalking, harassment, defamation, or infringing upon any person's privacy.</li>
                <li>Misrepresent downloaded media or create unlawful deepfakes or malicious edits.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">4. Intellectual Property &amp; Non-Affiliation</h2>
              <p>
                "Instagram" is a registered trademark of Meta Platforms, Inc. StealReel is an independent technical utility and is neither affiliated with, endorsed by, authorized by, nor in any way officially connected with Meta Platforms, Inc. or Instagram.
              </p>
              <p>
                All copyrights, trademarks, logos, and creative media downloaded through StealReel remain the exclusive intellectual property of their respective creators and copyright owners.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">5. Disclaimer of Warranties</h2>
              <p>
                THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT ANY WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR UNINTERRUPTED AVAILABILITY.
              </p>
              <p>
                We do not warrant that all public Instagram links will successfully resolve at all times, as platform layouts, rate limits, and network conditions may change unexpectedly.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">6. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by applicable law, StealReel and its operators shall not be liable for any indirect, incidental, consequential, special, or punitive damages arising from your access to or inability to use the service, or any unauthorized use of downloaded content by end users.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">7. DMCA &amp; Content Takedown Requests</h2>
              <p>
                StealReel does not host, store, or index downloaded media on its servers. However, we strictly respect intellectual property rights. If you are a copyright owner and wish to submit an inquiry or request technical blocks for specific public URLs, please reach out via our contact page.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">8. Changes to These Terms</h2>
              <p>
                We reserve the right to revise these Terms of Use at our discretion. Continued use of StealReel following the posting of modifications indicates your acknowledgement and binding acceptance of the updated terms.
              </p>
            </section>

            <section className="space-y-3 rounded-2xl border border-[#27272A] bg-[#141416] p-6">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#6366F1]" />
                9. Questions or Concerns?
              </h2>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Have questions about our Terms of Use or need legal clarification? Feel free to contact our team.
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
            <Link to="/terms-of-use" className="hover:text-white transition text-white font-medium">Terms of Use</Link>
            <Link to="/responsible-use" className="hover:text-white transition">Responsible Use</Link>
            <Link to="/contact" className="hover:text-white transition">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
