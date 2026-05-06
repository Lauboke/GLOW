import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Profile = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); // overview, looks, inbox
  const [activeGiveaways, setActiveGiveaways] = useState([]);
  const navigate = useNavigate();


useEffect(() => {
  const fetchActiveGiveaways = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/giveaways");
      const data = await res.json();

      if (res.ok) {
        setActiveGiveaways(data.data || []);
      }
    } catch (error) {
      console.error("Failed to load giveaways:", error);
    }
  };

  fetchActiveGiveaways();
}, []);

  // Calculate only truly "new" messages (replied by admin but not read by user)
  const unreadCount = data?.messages
    ? data.messages.filter((m) => m.reply && !m.read).length
    : 0;

  // --- UPDATED: CLEARS BADGE ON SERVER AND LOCALLY ---
  useEffect(() => {
    if (activeTab === "inbox" && unreadCount > 0) {
      const clearBadgePermanently = async () => {
        const token = localStorage.getItem("userToken");
        // 1. Tell the backend to mark them as read in the DB
        await fetch("http://localhost:5001/api/profile/read-messages", {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      };

      clearBadgePermanently();

      // 2. Update local state immediately so the UI is snappy
      const updatedMessages = data.messages.map((m) => ({ ...m, read: true }));
      setData((prev) => ({ ...prev, messages: updatedMessages }));
    }
  }, [activeTab, unreadCount]); // Added unreadCount as a dependency

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("userToken");

        // RESTORED YOUR ORIGINAL ENDPOINT HERE
        const res = await fetch("http://localhost:5001/api/profile/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const profileData = await res.json();
          console.log("DASHBOARD DATA:", profileData); // <--- ADD THIS LINE
          setData(profileData);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

const handleClaimGiveaway = async (promo) => {
  const token = localStorage.getItem("userToken");

  if (!token) {
    toast.error("Please sign in to claim this promo.");
    window.location.href = "/login";
    return;
  }

  try {
    const res = await fetch("http://localhost:5001/api/profile/enter-giveaway", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        giveawayId: promo._id,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      toast.error(result.message || "Could not claim this promo.");
      return;
    }

    toast.success(result.message || "Promo claimed successfully.");

    setData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        giveaways: [...(prev.profile.giveaways || []), result.entry],
      },
    }));
  } catch (error) {
    toast.error("Server error. Could not claim promo.");
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfafb] flex items-center justify-center">
        <div className="animate-pulse text-pink-400 font-black tracking-widest uppercase">
          Loading your glow...
        </div>
      </div>
    );
  }

  if (!data)
    return (
      <div className="text-center mt-20 font-bold text-gray-500">
        Please log in to view your profile.
      </div>
    );

  return (
    <div className="bg-[#fdfafb] min-h-screen p-8 lg:p-12 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
        {/* --- HEADER --- */}
        <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-pink-50/50 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center text-3xl font-black shadow-inner">
              {data.profile.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900">
                Welcome, {data.profile.name}!
              </h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                Member since {new Date(data.profile.memberSince).getFullYear()}
              </p>
            </div>
          </div>

          {/* TAB NAVIGATION WITH BADGE */}
          <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
            {["overview", "looks", "inbox"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === tab
                    ? "bg-white text-pink-500 shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab === "looks" ? "Saved Looks" : tab}

                {/* WHATSAPP STYLE BADGE */}
                {tab === "inbox" && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* --- TAB CONTENT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            {/* TAB 1: OVERVIEW (Bookings) */}
            {activeTab === "overview" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-black text-gray-900 mb-6 uppercase italic">
                  Upcoming Appointments
                </h3>
                {data.upcomingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {data.upcomingBookings.map((b) => (
                      <div
                        key={b._id}
                        className="bg-white p-6 rounded-[1.5rem] border border-pink-100 shadow-sm flex justify-between items-center border-l-4 border-l-pink-400"
                      >
                        <div>
                          <p className="font-black text-gray-900 uppercase">
                            {b.service}
                          </p>
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-tight">
                            {new Date(b.date).toLocaleDateString()} at {b.time}{" "}
                            with{" "}
                            <span className="text-pink-500">
                              {b.employeeName}
                            </span>
                          </p>
                        </div>
                        <span className="px-4 py-2 bg-pink-50 text-pink-500 text-[10px] font-black uppercase rounded-lg">
                          Confirmed
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-10 rounded-[2rem] border border-dashed border-gray-200 text-center">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      No upcoming appointments.
                    </p>
                    <button
                      onClick={() => navigate("/booking")}
                      className="mt-4 px-6 py-3 bg-gray-900 text-white text-[10px] font-black uppercase rounded-xl hover:bg-pink-500 transition-all cursor-pointer"
                    >
                      Book Now
                    </button>
                  </div>
                )}

                <h3 className="text-2xl font-black text-gray-900 mb-6 mt-12 uppercase italic">
                  Past Appointments
                </h3>
                {data.pastBookings.length > 0 ? (
                  <div className="space-y-4 opacity-75">
                    {data.pastBookings.map((b) => (
                      <div
                        key={b._id}
                        className="bg-white p-6 rounded-[1.5rem] border border-gray-100 flex justify-between items-center"
                      >
                        <div>
                          <p className="text-[12px] md:text-sm font-bold text-gray-600 uppercase tracking-wide mb-1">
                            {b.service}
                          </p>
                          <p className="text-[12px] md:text-sm font-bold text-gray-900 uppercase tracking-wide mb-1">
                            {new Date(b.date).toLocaleDateString()} at {b.time}{" "}
                            • Attended by {b.employeeName}
                          </p>
                          <p className="text-[12px] md:text-sm font-bold text-gray-600 uppercase tracking-wide mb-1">
                            Paid: KES {b.price}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <button
                            onClick={() =>
                              navigate("/review", {
                                state: {
                                  service: b.service,
                                  staffName: b.employeeName,
                                },
                              })
                            }
                            className="bg-pink-50 text-pink-500 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase hover:bg-pink-500 hover:text-white transition-all shadow-sm"
                          >
                            Leave Review
                          </button>

                          <button
                            onClick={() => navigate("/booking")}
                            className="text-pink-400 font-black uppercase text-[10px] tracking-widest transition-all duration-300 hover:text-pink-600 hover:drop-shadow-[0_0_12px_rgba(244,114,182,0.8)]"
                          >
                            Rebook
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    No past appointments yet.
                  </p>
                )}
              </div>
            )}

            {/* TAB 2 & 3: LOOKS AND INBOX REMAIN EXACTLY AS THEY WERE */}
            {activeTab === "looks" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-black text-gray-900 mb-6 uppercase italic">
                  Your Inspiration Board
                </h3>
                {data.profile.savedLooks &&
                data.profile.savedLooks.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {data.profile.savedLooks.map((look) => (
                      <div
                        key={look._id}
                        className="relative group rounded-2xl overflow-hidden aspect-[4/5] bg-gray-100"
                      >
                        <img
                          src={look.imageUrl}
                          alt={look.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                          <p className="text-white font-black text-sm">
                            {look.title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-10 rounded-[2rem] border border-dashed border-gray-200 text-center">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                      Your board is empty.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "inbox" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-black text-gray-900 mb-6 uppercase italic">
                  Studio Messages
                </h3>
                {data.messages.length > 0 ? (
                  <div className="space-y-6">
                    {data.messages.map((msg) => (
                      <div
                        key={msg._id}
                        className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm"
                      >
                        <div className="mb-4 pb-4 border-b border-gray-50">
                          <p className="text-[10px] font-black text-pink-400 uppercase tracking-widest mb-1">
                            Your Inquiry •{" "}
                            {new Date(msg.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600 font-medium">
                            "{msg.message}"
                          </p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-2xl">
                          <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-400 rounded-full"></span>{" "}
                            Reply from Glow Beauty
                          </p>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {msg.reply}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-10 rounded-[2rem] border border-dashed border-gray-200 text-center text-xs font-bold text-gray-400 uppercase">
                    You have no messages.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR REMAINS EXACTLY AS IT WAS */}
          <div className="space-y-6">
            <div className="bg-gray-900 p-8 rounded-[2rem] shadow-lg text-white">
  <h4 className="text-xl font-black uppercase italic mb-2">
    Giveaways & Promos
  </h4>

  <p className="text-xs text-gray-400 mb-6">
    Active offers, promos, and giveaway entries.
  </p>

  {activeGiveaways.length > 0 ? (
    <div className="space-y-4">
      {activeGiveaways.map((promo) => {
        const alreadyClaimed = data.profile.giveaways?.some(
          (entry) =>
            String(entry.giveawayId) === String(promo._id) ||
            entry.giveawayName === promo.title
        );

        return (
          <div
            key={promo._id}
            className="bg-white/10 p-4 rounded-2xl border border-white/10"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="w-full">
                <p className="text-[10px] font-black uppercase tracking-widest text-pink-400">
                  {promo.type} · {promo.applicableCategory}
                </p>

                <h5 className="mt-2 text-sm font-black uppercase tracking-wide text-white">
                  {promo.title}
                </h5>

                <p className="mt-2 text-xs leading-5 text-gray-400">
                  {promo.description}
                </p>

                {promo.prize && (
                  <p className="mt-3 text-xs font-bold text-pink-300">
                    {promo.prize}
                  </p>
                )}

                {promo.promoCode && (
                  <div className="mt-3 inline-flex rounded-full border border-pink-400/30 bg-pink-500/10 px-4 py-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-pink-300">
                      Code: {promo.promoCode}
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => handleClaimGiveaway(promo)}
                  disabled={alreadyClaimed}
                  className={`mt-4 w-full rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest transition ${
                    alreadyClaimed
                      ? "bg-white/10 text-gray-500 cursor-not-allowed"
                      : "bg-pink-500 text-white hover:bg-pink-600"
                  }`}
                >
                  {alreadyClaimed
                    ? promo.type === "promo"
                      ? "Promo Claimed"
                      : "Already Entered"
                    : promo.type === "promo"
                      ? "Claim Promo"
                      : "Enter Giveaway"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        No active promos right now.
      </p>
    </div>
  )}

  {data.profile.giveaways && data.profile.giveaways.length > 0 && (
    <div className="mt-6 border-t border-white/10 pt-5">
      <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-gray-500">
        Your Entries
      </p>

      <ul className="space-y-3">
        {data.profile.giveaways.map((g, index) => (
          <li
            key={g._id || g.giveawayId || `${g.giveawayName}-${index}`}
            className="flex items-center justify-between gap-3 bg-white/5 p-3 rounded-xl border border-white/5"
          >
            <div className="flex items-center gap-3">
              <span className="text-pink-400">🎟️</span>
              <span className="text-sm font-bold">{g.giveawayName}</span>
            </div>

            {g.promoCode && (
              <span className="rounded-full bg-pink-500/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-pink-300">
                {g.promoCode}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )}
</div>

            <div className="bg-pink-50 p-8 rounded-[2rem] border border-pink-100">
              <h4 className="font-black text-gray-900 uppercase italic mb-2">
                Need Help?
              </h4>
              <p className="text-xs text-gray-600 mb-4">
                Have questions about your bookings?
              </p>
              <button
                onClick={() => navigate("/contact")}
                className="w-full py-3 bg-white text-pink-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:shadow-md transition-all cursor-pointer"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
