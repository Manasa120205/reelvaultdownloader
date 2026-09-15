import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, Lock, EyeOff, Database, Mail } from "lucide-react";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy – StealReel" },
      {
        name: "description",
        content: "Learn how StealReel protects your privacy. We never ask for Instagram credentials and process public links ephemerally.",
      },
      { property: "og:title", content: "Privacy Policy – StealReel" },
      { property: "og:description", content: "StealReel Privacy Policy - Zero login required, no media storage." },
    ],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
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
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>User Data Protection</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Privacy Policy
            </h1>
            <p className="mt-2 text-sm text-[#A1A1AA]">
              Last updated: September 15, 2026 • Effective immediately
            </p>
          </div>

          {/* Quick Key Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
            <div className="rounded-xl border border-[#27272A] bg-[#141416] p-4 text-left">
              <Lock className="h-5 w-5 text-[#10B981] mb-2" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">No Login Ever</h3>
              <p className="mt-1 text-xs text-[#A1A1AA] leading-relaxed">
                We never ask for or store Instagram usernames, passwords, or session tokens.
              </p>
            </div>

            <div className="rounded-xl border border-[#27272A] bg-[#141416] p-4 text-left">
              <EyeOff className="h-5 w-5 text-[#6366F1] mb-2" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Ephemeral Processing</h3>
              <p className="mt-1 text-xs text-[#A1A1AA] leading-relaxed">
                Links you paste are resolved in real-time and not kept in a user activity profile.
              </p>
            </div>

            <div className="rounded-xl border border-[#27272A] bg-[#141416] p-4 text-left">
              <Database className="h-5 w-5 text-[#EC4899] mb-2" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">No Media Archiving</h3>
              <p className="mt-1 text-xs text-[#A1A1AA] leading-relaxed">
                Videos and photos are saved directly to your device, not hosted in our database.
              </p>
            </div>
          </div>

          {/* Policy Body */}
          <div className="space-y-8 text-sm leading-relaxed text-[#A1A1AA] border-t border-[#27272A] pt-8">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                1. Overview &amp; Commitment
              </h2>
              <p>
                At StealReel (accessible via <span className="text-white font-mono">stealreel.com</span>), we value your privacy and transparency above all else. This Privacy Policy details how we handle information when you access or interact with our public Instagram downloader service.
              </p>
              <p>
                StealReel is built strictly as a client-side utility for accessing publicly available content. We do not operate user accounts, do not require registration, and do not track browsing activities across the web.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                2. Information We Do NOT Collect
              </h2>
              <ul className="list-disc pl-5 space-y-1.5 text-[#A1A1AA]">
                <li><strong className="text-white">Instagram Credentials:</strong> We never request, collect, or store your Instagram password, two-factor authentication codes, or session cookies.</li>
                <li><strong className="text-white">Personal Identifiable Information (PII):</strong> We do not ask for your real name, physical address, phone number, or payment details.</li>
                <li><strong className="text-white">Downloaded Files:</strong> Videos, Reels, audio, or images you download are transferred directly to your local device storage and are not maintained in any permanent repository on our servers.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                3. Information We Process Automatically
              </h2>
              <p>
                To successfully fulfill your request to analyze and download a public post or reel, our backend microservice receives:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-[#A1A1AA]">
                <li><strong className="text-white">The Submitted URL:</strong> The Instagram web address you paste into the input field to locate public video/photo streams.</li>
                <li><strong className="text-white">Standard Server Telemetry:</strong> Standard diagnostic data transmitted by your browser, such as IP address, browser type, device operating system, referring URL, and timestamp. This data is utilized solely for rate limiting, DDoS defense, and infrastructure stability.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                4. Cookies &amp; Local Storage
              </h2>
              <p>
                StealReel does not employ persistent tracking cookies or commercial ad-tracking pixels. We may use standard browser local storage solely to retain your client-side preferences (such as preferred resolution option) locally on your device.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                5. Third-Party Infrastructure &amp; Hosting
              </h2>
              <p>
                Our services are deployed across industry-standard cloud providers, including Vercel (frontend edge hosting) and Render (backend media parsing). These providers manage network security and transport encryption (TLS/HTTPS) according to their respective privacy and compliance standards.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                6. Children's Privacy
              </h2>
              <p>
                StealReel is not targeted at children under the age of 13. We do not knowingly collect or solicit personal data from children. If you believe any minor has provided us with personal information, please contact us immediately.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                7. Updates to This Policy
              </h2>
              <p>
                We may periodically update our Privacy Policy to reflect technical improvements or legal requirements. Any modifications will be posted directly to this page with a revised "Last updated" date.
              </p>
            </section>

            <section className="space-y-3 rounded-2xl border border-[#27272A] bg-[#141416] p-6">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#6366F1]" />
                8. Contact Us
              </h2>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                If you have questions, feedback, or concerns regarding our privacy practices, you can reach out directly via our dedicated contact page.
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
            <Link to="/privacy-policy" className="hover:text-white transition text-white font-medium">Privacy Policy</Link>
            <Link to="/terms-of-use" className="hover:text-white transition">Terms of Use</Link>
            <Link to="/responsible-use" className="hover:text-white transition">Responsible Use</Link>
            <Link to="/contact" className="hover:text-white transition">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
