import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
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

        <footer className="bg-black/90 backdrop-blur-xl text-white py-20 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Column 1: Brand */}
            <div className="col-span-1 md:col-span-1">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4">
                Glow
              </h2>
              <p className="text-gray-400 text-xs leading-relaxed uppercase tracking-widest">
                Redefining beauty standards through luxury artistry and a
                passion for the glow.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div className="flex flex-col space-y-4">
              <span className="text-pink-500 font-black uppercase text-[10px] tracking-widest mb-2">
                Navigation
              </span>
              <Link
                to="/booking"
                className="text-xs uppercase font-bold hover:text-pink-400 transition-colors"
              >
                Book Now
              </Link>
              <Link
                to="/gallery"
                className="text-xs uppercase font-bold hover:text-pink-400 transition-colors"
              >
                Our Gallery
              </Link>
              <Link
                to="/admin"
                className="text-gray-600 text-xs uppercase font-bold hover:text-white transition-colors"
              >
                Staff Login
              </Link>
            </div>

            {/* Column 3: Hours */}
            <div className="flex flex-col space-y-2">
              <span className="text-pink-500 font-black uppercase text-[10px] tracking-widest mb-2">
                Hours
              </span>
              <p className="text-xs text-gray-400 uppercase font-bold">
                Mon - Fri: 08:00 - 17:00
              </p>
              <p className="text-xs text-gray-400 uppercase font-bold">
                Sat: 09:00 - 15:00
              </p>
              <p className="text-xs text-gray-600 uppercase font-bold italic">
                Sun: Closed
              </p>
            </div>

            {/* Column 4: Contact */}
            <div className="flex flex-col space-y-4">
              <span className="text-pink-500 font-black uppercase text-[10px] tracking-widest mb-2">
                Location
              </span>
              <p className="text-xs text-gray-400 uppercase font-bold leading-relaxed">
                Nakuru, Kenya
                <br />
                Luxury Suites, 2nd Floor
              </p>
              <div className="flex space-x-4 pt-2">
                <a
                  href="#"
                  className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                >
                  IG
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                >
                  WA
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[9px] text-gray-600 uppercase font-bold tracking-[0.3em]">
              © 2026 Boke Beauty Salon. All rights reserved.
            </p>
            <p className="text-[9px] text-gray-600 uppercase font-bold tracking-[0.3em]">
              Crafted with Glow
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
