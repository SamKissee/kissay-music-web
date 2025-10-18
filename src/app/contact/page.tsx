"use client";

import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import PageHeader from "@/components/PageHeader";
import BackgroundImage from "@/components/BackgroundImage";
import { LINKS, CONTACT } from "@/constants/links";
import {
  FaSpotify,
  FaInstagram,
  FaFacebook,
  FaSoundcloud,
  FaTicketAlt,
  FaApple,
} from "react-icons/fa";
import { SiBandsintown } from "react-icons/si";

export default function Contact() {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);
  const [honeypot, setHoneypot] = useState("");

  // Sanitize user input - strip HTML tags and dangerous characters
  const sanitizeInput = (input: string): string => {
    return input
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/javascript:/gi, "") // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, "") // Remove event handlers like onclick=
      .replace(/<script[^>]*>.*?<\/script>/gi, "") // Remove script tags
      .replace(/eval\(/gi, "") // Remove eval
      .replace(/expression\(/gi, "") // Remove CSS expressions
      .trim();
  };

  // Validate input doesn't contain suspicious patterns
  const validateInput = (input: string): boolean => {
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /eval\(/i,
      /expression\(/i,
      /<iframe/i,
      /<object/i,
      /<embed/i,
    ];

    return !suspiciousPatterns.some((pattern) => pattern.test(input));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Prevent double submission
    if (isSubmitting) {
      return;
    }

    // Honeypot check - if filled, it's a bot
    if (honeypot) {
      console.log("Bot detected");
      return;
    }

    // Rate limiting - prevent spam (3 second cooldown between submissions)
    const now = Date.now();
    if (now - lastSubmitTime < 3000) {
      setStatus("error");
      return;
    }

    setIsSubmitting(true);
    setStatus("submitting");

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Get and sanitize all form fields
    const name = sanitizeInput(formData.get("name") as string);
    const email = sanitizeInput(formData.get("email") as string);
    const subject = sanitizeInput(formData.get("subject") as string);
    const message = sanitizeInput(formData.get("message") as string);

    // Validate inputs don't contain malicious code
    if (
      !validateInput(name) ||
      !validateInput(email) ||
      !validateInput(subject) ||
      !validateInput(message)
    ) {
      setStatus("error");
      setIsSubmitting(false);
      return;
    }

    // Create new sanitized FormData
    const sanitizedFormData = new FormData();
    sanitizedFormData.append("name", name);
    sanitizedFormData.append("email", email);
    sanitizedFormData.append("subject", subject);
    sanitizedFormData.append("message", message);

    try {
      const response = await fetch("https://formspree.io/f/xjkalzjk", {
        method: "POST",
        body: sanitizedFormData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setStatus("success");
        setLastSubmitTime(now);
        form.reset();
        setHoneypot("");
        // Reset status after 5 seconds
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundImage />

      <PageHeader title="Contact" />

      <main className="relative max-w-4xl mx-auto px-6 pb-32">
        <div className="space-y-12 mt-10">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form - No Card */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot field - hidden from users, only bots will fill it */}
                <input
                  type="text"
                  name="_gotcha"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  style={{ display: "none" }}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-white/80 mb-2"
                  >
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    minLength={2}
                    maxLength={100}
                    className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    placeholder="Your name"
                    required
                    disabled={status === "submitting"}
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-white/80 mb-2"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                    className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    placeholder="your@email.com"
                    required
                    disabled={status === "submitting"}
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-white/80 mb-2"
                  >
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    minLength={3}
                    maxLength={200}
                    className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    placeholder="What's this about?"
                    required
                    disabled={status === "submitting"}
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-white/80 mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    minLength={10}
                    maxLength={5000}
                    className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all resize-none"
                    placeholder="Your message..."
                    required
                    disabled={status === "submitting"}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full px-8 py-4 bg-white text-black rounded-2xl font-semibold hover:bg-white/90 transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {status === "submitting" ? "Sending..." : "Send Message"}
                </button>

                {/* Success Message */}
                {status === "success" && (
                  <div className="p-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-white text-center font-medium">
                    Message sent successfully! I&apos;ll get back to you soon.
                  </div>
                )}

                {/* Error Message */}
                {status === "error" && (
                  <div className="p-4 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-2xl text-white text-center font-medium">
                    Oops! Something went wrong. Please try again.
                  </div>
                )}
              </form>
            </div>

            {/* Contact Info & Social - No Cards */}
            <div className="space-y-8">
              {/* Contact Methods */}
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white">Contact Info</h2>
                <div className="space-y-4">
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/10 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-white"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-white/60">Email</div>
                      <div className="font-medium text-white">
                        {CONTACT.email}
                      </div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Social Media */}
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white">Follow Me</h2>
                <div className="flex flex-wrap gap-6">
                  <a
                    href={LINKS.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-white/70 transition-all duration-200 hover:scale-110 active:scale-95"
                    aria-label="Spotify"
                  >
                    <FaSpotify className="text-5xl" />
                  </a>
                  <a
                    href={LINKS.appleMusic}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-white/70 transition-all duration-200 hover:scale-110 active:scale-95"
                    aria-label="Apple Music"
                  >
                    <FaApple className="text-5xl" />
                  </a>
                  <a
                    href={LINKS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-white/70 transition-all duration-200 hover:scale-110 active:scale-95"
                    aria-label="Instagram"
                  >
                    <FaInstagram className="text-5xl" />
                  </a>
                  <a
                    href={LINKS.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-white/70 transition-all duration-200 hover:scale-110 active:scale-95"
                    aria-label="Facebook"
                  >
                    <FaFacebook className="text-5xl" />
                  </a>
                  <a
                    href={LINKS.soundcloud}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-white/70 transition-all duration-200 hover:scale-110 active:scale-95"
                    aria-label="SoundCloud"
                  >
                    <FaSoundcloud className="text-6xl" />
                  </a>
                  <a
                    href={LINKS.bandcamp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-white/70 transition-all duration-200 hover:scale-110 active:scale-95"
                    aria-label="Bandcamp"
                  >
                    <FaTicketAlt className="text-5xl" />
                  </a>
                  <a
                    href={LINKS.bandsintown}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-white/70 transition-all duration-200 hover:scale-110 active:scale-95"
                    aria-label="Bandsintown"
                  >
                    <SiBandsintown className="text-5xl" />
                  </a>
                </div>
              </div>

              {/* Booking Info */}
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-white">
                  Booking & Collaborations
                </h3>
                <p className="text-lg text-white/80">
                  For booking inquiries, collaborations, or music festival
                  consultations, please reach out via email or through the
                  contact form.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
