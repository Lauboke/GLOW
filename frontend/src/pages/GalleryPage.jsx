import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Gallery = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const navigate = useNavigate();

  const handleBookLook = (photo) => {
    localStorage.setItem("selectedLookID", photo.id);
    localStorage.setItem("selectedLookTitle", photo.title);
    localStorage.setItem("selectedLookPrice", photo.price);
    localStorage.setItem("selectedCategory", photo.category);
    navigate("/booking");
  };

  // --- NEW ADDITION 1: The Save Logic ---
  const handleSaveLook = async (photo) => {
    const token = localStorage.getItem("userToken"); // Matches your login token

    if (!token) {
      toast.error("Please Sign In to save looks!");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:5001/api/profile/save-look", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: photo.title,
          imageUrl: photo.url,
          serviceCategory: photo.category,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
      } else {
        toast.error(data.message); // Shows "You already saved this look!"
      }
    } catch (error) {
      console.error("Error saving look:", error);
    }
  };
  // --------------------------------------

  const allPhotos = [
    // --- HAIR COLLECTION ---
    {
      id: "STYLE-HAIR-01",
      category: "Hair",
      title: "Luxury Knotless Braids",
      price: "4500",
      url: "https://res.cloudinary.com/drp3nfd83/image/upload/v1773226311/photo_2026-03-11_13-30-30_k7s6wm.jpg",
    },
    {
      id: "STYLE-HAIR-02",
      category: "Hair",
      title: "Sleek Ponytail",
      price: "2500",
      url: "https://res.cloudinary.com/drp3nfd83/image/upload/v1773226363/photo_2026-03-11_13-30-38_spdxxi.jpg",
    },
    {
      id: "STYLE-HAIR-03",
      category: "Hair",
      title: "Boho Curls",
      price: "3000",
      url: "https://res.cloudinary.com/drp3nfd83/image/upload/v1773226406/photo_2026-03-11_13-30-46_keptqb.jpg",
    },
    {
      id: "STYLE-HAIR-04",
      category: "Hair",
      title: "Goddess Locs",
      price: "5500",
      url: "https://res.cloudinary.com/drp3nfd83/image/upload/v1773226456/photo_2026-03-11_13-30-50_vtwnra.jpg",
    },
    {
      id: "STYLE-HAIR-05",
      category: "Hair",
      title: "Bridal Updo",
      price: "6000",
      url: "https://res.cloudinary.com/drp3nfd83/image/upload/v1773226258/photo_2026-03-11_13-30-23_xfjcjb.jpg",
    },
    {
      id: "STYLE-HAIR-06",
      category: "Hair",
      title: "Soft Waves",
      price: "2000",
      url: "https://res.cloudinary.com/drp3nfd83/image/upload/v1773225220/photo_2026-03-11_13-30-16_occqjf.jpg",
    },

    // --- NAILS COLLECTION ---
    {
      id: "STYLE-NAIL-01",
      category: "Nails",
      title: "Square Nails",
      price: "1500",
      url: "https://res.cloudinary.com/drp3nfd83/image/upload/v1773234744/photo_2026-03-11_16-07-17_o0ao1x.jpg",
    },
    {
      id: "STYLE-NAIL-02",
      category: "Nails",
      title: "Stiletto Nails",
      price: "1800",
      url: "https://res.cloudinary.com/drp3nfd83/image/upload/v1773234818/photo_2026-03-11_16-07-15_lwugwz.jpg",
    },
    {
      id: "STYLE-NAIL-03",
      category: "Nails",
      title: "Coffin Nails",
      price: "2000",
      url: "https://res.cloudinary.com/drp3nfd83/image/upload/v1773234848/photo_2026-03-11_16-07-11_ntgom8.jpg",
    },
    {
      id: "STYLE-NAIL-04",
      category: "Nails",
      title: "Almond Nails",
      price: "1500",
      url: "https://res.cloudinary.com/drp3nfd83/image/upload/v1773234905/photo_2026-03-11_16-07-06_gz9zwz.jpg",
    },
    {
      id: "STYLE-NAIL-05",
      category: "Nails",
      title: "Toe Nails",
      price: "1000",
      url: "https://res.cloudinary.com/drp3nfd83/image/upload/v1773234923/photo_2026-03-11_16-07-01_dtqrmw.jpg",
    },

    // --- SKIN/MAKEUP COLLECTION ---
    {
      id: "STYLE-SKIN-01",
      category: "Skin",
      title: "Natural Makeup",
      price: "2500",
      url: "https://res.cloudinary.com/drp3nfd83/image/upload/v1773235682/photo_2026-03-11_16-26-28_f69f5b.jpg",
    },
    {
      id: "STYLE-SKIN-02",
      category: "Skin",
      title: "Soft Glam",
      price: "3500",
      url: "https://res.cloudinary.com/drp3nfd83/image/upload/v1773235668/photo_2026-03-11_16-26-25_sm4xrg.jpg",
    },
    {
      id: "STYLE-SKIN-03",
      category: "Skin",
      title: "Full Glam",
      price: "4500",
      url: "https://res.cloudinary.com/drp3nfd83/image/upload/v1773235701/photo_2026-03-11_16-26-33_s1xfoe.jpg",
    },
    {
      id: "STYLE-SKIN-04",
      category: "Skin",
      title: "Siren Makeup",
      price: "4000",
      url: "https://res.cloudinary.com/drp3nfd83/image/upload/v1773235647/photo_2026-03-11_16-26-22_h264fd.jpg",
    },
  ];

  // 2. SYNC SEARCH WITH URL PARAMETERS
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filterParam = params.get("filter");
    if (filterParam) {
      setSearchQuery(filterParam);
    } else {
      setSearchQuery("");
    }
  }, [location]);

  // 3. FILTERING LOGIC
  const filteredPhotos = allPhotos.filter(
    (photo) =>
      photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-white text-black">
      {/* --- NAVIGATION --- */}
      <nav className="p-6 flex justify-between items-center bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <Link
          to="/"
          className="text-xl font-black italic uppercase tracking-tighter"
        >
          Boke Glow
        </Link>
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-[10px] font-bold uppercase tracking-widest hover:text-pink-500 transition-all"
          >
            Home
          </Link>
          <Link
            to="/booking"
            className="bg-black text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-pink-500 transition-all shadow-lg"
          >
            Book Now
          </Link>
        </div>
      </nav>

      {/* --- SEARCH HEADER --- */}
      <header className="py-20 px-6 text-center max-w-3xl mx-auto">
        <span className="text-pink-500 font-black uppercase tracking-[0.4em] text-[10px]">
          The Art Wall
        </span>
        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mt-4 mb-8">
          Visual Mastery
        </h1>

        <div className="relative group">
          <input
            type="text"
            placeholder="Search styles (e.g. 'Braids', 'Nails')..."
            className="w-full bg-gray-50 border-2 border-gray-100 px-8 py-5 rounded-2xl outline-none focus:border-pink-300 transition-all font-medium text-lg shadow-sm group-hover:shadow-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold uppercase text-[10px] hover:text-black p-2"
            >
              Clear
            </button>
          )}
        </div>
      </header>

      {/* --- MASONRY GALLERY --- */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        {filteredPhotos.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-6 space-y-6">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                className="relative group overflow-hidden rounded-[2.5rem] break-inside-avoid shadow-xl border border-gray-50 bg-gray-100"
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />

                {/* --- The Heart Button --- */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveLook(photo);
                  }}
                  className="absolute top-6 right-6 w-10 h-10 bg-black/45 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 hover:bg-pink-500 hover:text-white text-white z-10 cursor-pointer shadow-lg"
                  title="Save to Profile"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>

                {/* Information Overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent p-6 pt-16">
                  <div className="text-white transition-transform duration-500 group-hover:-translate-y-1">
                    <span className="text-[9px] uppercase tracking-[0.3em] font-black text-pink-400">
                      {photo.category}
                    </span>

                    <p className="font-bold uppercase tracking-[0.15em] text-xs mt-2 leading-relaxed">
                      {photo.title}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      <p className="text-[11px] text-gray-200 font-black">
                        KES {photo.price}
                      </p>

                      <button
                        onClick={() => handleBookLook(photo)}
                        className="px-4 py-2 rounded-full bg-white text-black text-[9px] font-black uppercase tracking-widest hover:bg-pink-500 hover:text-white transition-all cursor-pointer shadow-md"
                      >
                        Book Look
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-gray-400 italic font-medium">
              No masterpieces found matching "{searchQuery}"
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 text-pink-500 font-black uppercase text-[10px] tracking-widest border-b border-pink-500"
            >
              View All Looks
            </button>
          </div>
        )}
      </section>

      {/* --- SMALL FOOTER --- */}
      <footer className="py-12 border-t border-gray-100 text-center">
        <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.4em]">
          © 2026 Boke Beauty Salon
        </p>
      </footer>
    </div>
  );
};

export default Gallery;
