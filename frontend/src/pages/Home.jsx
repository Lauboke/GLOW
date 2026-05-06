import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {

const API_BASE = "http://localhost:5001";

const [siteSettings, setSiteSettings] = useState({
  businessName: "GLOW",
  location: "Nakuru, Kenya",
  addressLine: "Egerton Njoro, Gate",
  instagramUrl: "https://instagram.com/twinkle_glowbeauty",
  whatsappNumber: "254714749302",
  openingTime: "08:00",
  closingTime: "17:00",
  saturdayOpeningTime: "09:00",
  saturdayClosingTime: "15:00",
  footerTagline:
    "Redefining beauty standards through luxury artistry and a passion for the glow.",
});

useEffect(() => {
  const fetchSettings = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/settings`);
      const data = await response.json();

      if (response.ok && data.data) {
        setSiteSettings((prev) => ({
          ...prev,
          ...data.data,
        }));
      }
    } catch (error) {
      console.error("Failed to load site settings:", error);
    }
  };

  fetchSettings();
}, []);

const whatsappLink = siteSettings.whatsappNumber
  ? `https://wa.me/${siteSettings.whatsappNumber.replace(/\D/g, "")}`
  : "https://wa.me/254714749302";

  return (
    <div className="bg-white">
      {/* --- SECTION 1: THE STICKY VIDEO HERO --- */}
      {/* 'h-screen' makes it full height. 'sticky top-0' keeps it there while scrolling. */}
      <div className="relative sticky top-0 z-0 h-[100svh] bg-black overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center opacity-55 md:opacity-60"
        >
          <source
            src="https://res.cloudinary.com/drp3nfd83/video/upload/v1771416873/White_and_Green_Minimalist_Aesthetic_Beauty_Skincare_Presentation_gn1ytv.mp4"
            type="video/mp4"
          />
        </video>

        {/* Buttons Centered on Video */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-4 px-5 text-center md:gap-6">
          <div className="flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:w-auto md:gap-6">
            <Link
              to="/booking"
              className="bg-white/10 backdrop-blur-md border-2 border-white/40 text-white px-12 py-4 rounded-full font-bold shadow-xl hover:bg-white/20 transition transform hover:scale-110 text-center text-lg uppercase tracking-widest"
            >
              Book Appointment
            </Link>

            <Link
              to="/gallery"
              className="bg-white/10 backdrop-blur-md border-2 border-white/40 text-white px-12 py-4 rounded-full font-bold shadow-xl hover:bg-white/20 transition transform hover:scale-110 text-center text-lg uppercase tracking-widest"
            >
              View Gallery
            </Link>
          </div>
        </div>
      </div>

      {/* --- SECTION 2: THE CONTENT AREA (This slides OVER the video) --- */}

      <div className="relative z-10 min-h-screen">
        <div className="bg-white/70 backdrop-blur-md shadow-2xl pb-24 border-t border-white/10">
          <section className="py-32 px-6 text-center max-w-4xl mx-auto">
            <div className="bg-white/80 p-12 rounded-[4rem] shadow-xl inline-block border border-white/40">
              <span className="text-pink-600 font-black uppercase tracking-[0.3em] text-[10px]">
                The Luxury Experience
              </span>
              <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mt-4 mb-8 text-black">
                Artistry in every touch
              </h2>
              <p className="text-gray-900 leading-relaxed text-lg italic font-bold">
                "Your beauty is our passion. From high-fashion hair styling to
                precision nail art, we create looks that make you glow from
                within."
              </p>
            </div>
          </section>

          {/* --- SERVICE CATEGORIES SECTION --- */}
          <section className="max-w-7xl mx-auto py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Category 1: Hair */}
              <div className="group relative h-[500px] rounded-[3rem] overflow-hidden shadow-2xl transition-transform duration-500 hover:-translate-y-2">
                <img
                  src="https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?q=80&w=2070&auto=format&fit=crop"
                  alt="Hair Styling"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-10 flex flex-col justify-end">
                  <h3 className="text-white text-3xl font-black italic uppercase tracking-tighter mb-2">
                    Hair Artistry
                  </h3>
                  <p className="text-pink-100/80 text-sm mb-6 font-medium">
                    From luxury weaves to intricate braids.
                  </p>
                  <Link
                    to="/gallery?filter=Hair"
                    className="w-fit bg-white text-black px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-pink-500 hover:text-white transition-colors"
                  >
                    Explore Portfolio
                  </Link>
                </div>
              </div>

              {/* Category 2: Nails */}
              <div className="group relative h-[500px] rounded-[3rem] overflow-hidden shadow-2xl transition-transform duration-500 hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/drp3nfd83/image/upload/v1772710401/photo_2026-03-05_14-32-54_f9gbda.jpg"
                  alt="Nail Art"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-10 flex flex-col justify-end">
                  <h3 className="text-white text-3xl font-black italic uppercase tracking-tighter mb-2">
                    Nail Design
                  </h3>
                  <p className="text-pink-100/80 text-sm mb-6 font-medium">
                    Precision gel, acrylics, and custom art.
                  </p>
                  <Link
                    to="/gallery?filter=Nails"
                    className="w-fit bg-white text-black px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-pink-500 hover:text-white transition-colors"
                  >
                    Explore Art
                  </Link>
                </div>
              </div>

              {/* Category 3: Skin */}
              <div className="group relative h-[500px] rounded-[3rem] overflow-hidden shadow-2xl transition-transform duration-500 hover:-translate-y-2">
                <img
                  src="https://res.cloudinary.com/drp3nfd83/image/upload/v1772710538/photo_2026-02-12_06-20-05_b8wggl.jpg"
                  alt="Skin & Makeup"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-10 flex flex-col justify-end">
                  <h3 className="text-white text-3xl font-black italic uppercase tracking-tighter mb-2">
                    Skin & Glow
                  </h3>
                  <p className="text-pink-100/80 text-sm mb-6 font-medium">
                    Facials and professional makeup artistry.
                  </p>
                  <Link
                    to="/gallery?filter=Skin"
                    className="w-fit bg-white text-black px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-pink-500 hover:text-white transition-colors"
                  >
                    Explore Glow
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="h-[30vh] bg-transparent"></div>

        {/* --- 2. TESTIMONIALS SECTION --- */}
        <section className="py-24 bg-white/80 backdrop-blur-xl shadow-[0_-20px_50px_rgba(0,0,0,0.3)] rounded-none border-t border-white/20 z-20">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <span className="text-pink-600 font-black uppercase tracking-[0.4em] text-[10px]">
              What they say
            </span>
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mt-4 mb-16">
              The Glow Club
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Review 1 */}
              <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-pink-50 text-left hover:-translate-y-2 transition-transform">
                <div className="flex text-pink-400 mb-4 text-xs">★★★★★</div>
                <p className="text-gray-800 italic mb-6 leading-relaxed">
                  "The most luxury experience I've had in Nakuru. My hair has
                  never looked this healthy and sleek."
                </p>
                <div className="flex items-center gap-4 text-gray-400 font-black uppercase text-[10px] tracking-widest">
                  <div className="w-8 h-8 rounded-full bg-pink-100"></div>
                  <span>Cynthia N.</span>
                </div>
              </div>

              {/* Review 2 - Staggered */}
              <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-pink-50 text-left hover:-translate-y-2 transition-transform md:mt-12">
                <div className="flex text-pink-400 mb-4 text-xs">★★★★★</div>
                <p className="text-gray-800 italic mb-6 leading-relaxed">
                  "I booked the Glow Facial and I'm obsessed. The atmosphere is
                  so posh and relaxing."
                </p>
                <div className="flex items-center gap-4 text-gray-400 font-black uppercase text-[10px] tracking-widest">
                  <div className="w-8 h-8 rounded-full bg-pink-100"></div>
                  <span>Sarah W.</span>
                </div>
              </div>

              {/* Review 3 */}
              <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-pink-50 text-left hover:-translate-y-2 transition-transform">
                <div className="flex text-pink-400 mb-4 text-xs">★★★★★</div>
                <p className="text-gray-800 italic mb-6 leading-relaxed">
                  "The nail art here is on another level. I get compliments
                  every single day."
                </p>
                <div className="flex items-center gap-4 text-gray-400 font-black uppercase text-[10px] tracking-widest">
                  <div className="w-8 h-8 rounded-full bg-pink-100"></div>
                  <span>Anita K.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- FOOTER --- */}

        <footer className="relative overflow-hidden bg-[#030303] text-white border-t border-white/10">
          {/* Soft premium background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(236,72,153,0.10),transparent_30%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-[#050505] to-black" />

          <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14">
              {/* Brand */}
              <div className="space-y-5">
                <h2 className="text-4xl md:text-5xl font-black italic tracking-tight">
                  {siteSettings.businessName || "GLOW"}
                </h2>

                <p className="max-w-xs text-sm leading-7 tracking-[0.14em] uppercase text-zinc-400">
                  {siteSettings.footerTagline}
                </p>

                <a
                  href="/booking"
                  className="inline-flex rounded-full border border-pink-500/40 bg-pink-500/10 px-6 py-3 text-xs font-extrabold uppercase tracking-[0.18em] text-pink-300 transition-all duration-300 hover:bg-pink-500 hover:text-white hover:shadow-[0_0_24px_rgba(236,72,153,0.25)]"
                >
                  Book Appointment
                </a>
              </div>

              {/* Navigation */}
              <div className="space-y-5">
                <h3 className="text-xs font-extrabold uppercase tracking-[0.28em] text-pink-400">
                  Navigation
                </h3>

                <ul className="space-y-3">
                  <li>
                    <a href="/booking" className="footer-link">
                      Book Now
                    </a>
                  </li>
                  <li>
                    <a href="/gallery" className="footer-link">
                      Our Gallery
                    </a>
                  </li>
                  <li>
                    <a href="/reviews" className="footer-link">
                      Reviews
                    </a>
                  </li>
                </ul>
              </div>

              {/* Hours */}
              <div className="space-y-5">
                <h3 className="text-xs font-extrabold uppercase tracking-[0.28em] text-pink-400">
                  Hours
                </h3>

                <div className="space-y-3 text-sm font-bold uppercase tracking-wide">
                  <p>
                    <span className="text-white">Mon - Fri</span>
                    <span className="block mt-1 text-zinc-500">
                     {siteSettings.openingTime} - {siteSettings.closingTime}
                    </span>
                  </p>

                  <p>
                    <span className="text-white">Saturday</span>
                    <span className="block mt-1 text-zinc-500">
                      {siteSettings.saturdayOpeningTime} - {siteSettings.saturdayClosingTime}
                    </span>
                  </p>

                  <p>
                    <span className="text-white">Sunday</span>
                    <span className="block mt-1 italic text-zinc-600">
                      Closed
                    </span>
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-5">
                <h3 className="text-xs font-extrabold uppercase tracking-[0.28em] text-pink-400">
                  Location
                </h3>

                <div className="text-sm font-bold uppercase tracking-wide leading-7">
                  <p className="text-white">{siteSettings.location}</p>
                  <p className="text-zinc-500">{siteSettings.addressLine}</p>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  {/* Instagram */}
                  <a
                    href={siteSettings.instagramUrl || "https://instagram.com/twinkle_glowbeauty"}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-zinc-300 transition-all duration-300 hover:border-pink-400 hover:bg-pink-500/10 hover:text-pink-300"
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle
                        cx="17.5"
                        cy="6.5"
                        r="0.8"
                        fill="currentColor"
                        stroke="none"
                      />
                    </svg>
                  </a>

                  {/* WhatsApp / Message */}
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="WhatsApp"
                    className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-zinc-300 transition-all duration-300 hover:border-pink-400 hover:bg-pink-500/10 hover:text-pink-300"
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 11.6a8 8 0 0 1-11.8 7l-4.2 1.2 1.2-4a8 8 0 1 1 14.8-4.2Z" />
                      <path d="M9.5 8.8c.3 2.4 2 4.1 4.4 4.7" />
                      <path d="M9.4 8.7l.8-.8" />
                      <path d="M14 13.5l1-.9" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom */}
            <div className="mt-10 border-t border-white/10 pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <p className="text-[11px] tracking-[0.28em] text-zinc-600 uppercase">
                © 2026 Boke Beauty Salon. All rights reserved.
              </p>

              <p className="text-[11px] tracking-[0.24em] text-zinc-600 uppercase">
                Crafted for a modern luxury beauty experience.
              </p>
              <a
  href="/admin"
  className="text-[11px] font-bold uppercase tracking-[0.24em] text-zinc-700 transition hover:text-pink-400"
>
  Staff Portal
</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
