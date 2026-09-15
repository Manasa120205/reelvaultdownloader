import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Mail, MessageSquare, Send, CheckCircle2, Clock, HelpCircle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us – StealReel" },
      {
        name: "description",
        content: "Reach out to the StealReel team for support, feature requests, business inquiries, or general questions.",
      },
      { property: "og:title", content: "Contact Us – StealReel" },
      { property: "og:description", content: "Get in touch with StealReel support and team." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("support");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all fields before submitting.");
      return;
    }

    setLoading(true);
    // Simulate sending message
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Thank you! Your message has been sent to our team.");
    }, 600);
  }

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
        <div className="mx-auto max-w-4xl">
          {/* Header Badge & Title */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#27272A] bg-[#141416] px-3.5 py-1 text-xs font-medium text-[#6366F1] mb-4">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Reach Out to Us</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Get in Touch
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-sm sm:text-base text-[#A1A1AA] leading-relaxed">
              Have a question, encountered an issue, or have feedback for StealReel? We're here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8">
            {/* Contact Form */}
            <div className="rounded-2xl border border-[#27272A] bg-[#141416] p-6 sm:p-8 text-left shadow-xl">
              {submitted ? (
                <div className="py-12 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] mb-4">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Message Dispatched!</h3>
                  <p className="mt-2 text-xs sm:text-sm text-[#A1A1AA] max-w-sm mx-auto leading-relaxed">
                    Thank you for contacting StealReel. Our team has received your inquiry and will respond to <span className="text-white font-medium">{email}</span> as soon as possible.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setMessage("");
                    }}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[#27272A] bg-[#1A1A1D] px-5 py-2.5 text-xs font-semibold text-[#A1A1AA] hover:text-white transition"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-bold uppercase tracking-wider text-[#A1A1AA] mb-1.5">
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Smith"
                      className="w-full h-11 rounded-xl border border-[#27272A] bg-[#0B0B0D] px-4 text-sm text-white placeholder:text-[#A1A1AA]/50 outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-bold uppercase tracking-wider text-[#A1A1AA] mb-1.5">
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. alex@example.com"
                      className="w-full h-11 rounded-xl border border-[#27272A] bg-[#0B0B0D] px-4 text-sm text-white placeholder:text-[#A1A1AA]/50 outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-topic" className="block text-xs font-bold uppercase tracking-wider text-[#A1A1AA] mb-1.5">
                      Inquiry Category
                    </label>
                    <select
                      id="contact-topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full h-11 rounded-xl border border-[#27272A] bg-[#0B0B0D] px-4 text-sm text-white outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition"
                    >
                      <option value="support" className="bg-[#141416]">Technical Support &amp; Link Issue</option>
                      <option value="feature" className="bg-[#141416]">Feature Request or Suggestion</option>
                      <option value="legal" className="bg-[#141416]">Copyright / DMCA Inquiries</option>
                      <option value="business" className="bg-[#141416]">Partnership &amp; Business Inquiries</option>
                      <option value="other" className="bg-[#141416]">General Question</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-bold uppercase tracking-wider text-[#A1A1AA] mb-1.5">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we help you today? Please include any relevant details or links if applicable..."
                      className="w-full rounded-xl border border-[#27272A] bg-[#0B0B0D] p-4 text-sm text-white placeholder:text-[#A1A1AA]/50 outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#4F46E5] hover:to-[#7C3AED] text-white font-semibold text-sm transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span>Sending message...</span>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Information Cards */}
            <div className="flex flex-col gap-4 text-left">
              <div className="rounded-2xl border border-[#27272A] bg-[#141416] p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1A1A1D] border border-[#27272A] text-[#6366F1]">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Direct Email Support</h3>
                    <p className="text-xs text-[#A1A1AA]">For direct inquiries and support</p>
                  </div>
                </div>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  You can email us directly anytime at:
                </p>
                <a
                  href="mailto:info@stealreel.com"
                  className="mt-2 inline-flex items-center gap-2 rounded-lg bg-[#0B0B0D] hover:bg-[#1A1A24] border border-[#27272A] hover:border-[#6366F1]/50 px-3.5 py-2 font-mono text-xs text-[#6366F1] hover:text-[#818CF8] transition"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>info@stealreel.com</span>
                </a>
              </div>

              <div className="rounded-2xl border border-[#27272A] bg-[#141416] p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1A1A1D] border border-[#27272A] text-[#10B981]">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Response Turnaround</h3>
                    <p className="text-xs text-[#A1A1AA]">Prompt, dedicated assistance</p>
                  </div>
                </div>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  Our team reviews inquiries daily. We aim to respond within 24 to 48 business hours. For urgent link resolution issues, our automated backend systems monitor service health 24/7.
                </p>
              </div>

              <div className="rounded-2xl border border-[#27272A] bg-[#141416] p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1A1A1D] border border-[#27272A] text-[#EAB308]">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Quick Answers</h3>
                    <p className="text-xs text-[#A1A1AA]">Instant resolutions</p>
                  </div>
                </div>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  Before reaching out, you may find instant answers to common questions regarding downloads, supported media types, and private accounts in our FAQ.
                </p>
                <div className="mt-3">
                  <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6366F1] hover:underline"
                  >
                    <span>View Frequently Asked Questions</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
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
            <Link to="/responsible-use" className="hover:text-white transition">Responsible Use</Link>
            <Link to="/contact" className="hover:text-white transition text-white font-medium">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
