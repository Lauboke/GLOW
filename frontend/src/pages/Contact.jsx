import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getAutofillUser } from "../utils/getAutofillUser";

const MapPinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21s6-5.686 6-11a6 6 0 10-12 0c0 5.314 6 11 6 11z"
    />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M22 16.92v3a2 2 0 01-2.18 2 19.86 19.86 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.86 19.86 0 012.08 4.18 2 2 0 014.06 2h3a2 2 0 012 1.72c.12.9.33 1.78.63 2.62a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.46-1.18a2 2 0 012.11-.45c.84.3 1.72.51 2.62.63A2 2 0 0122 16.92z"
    />
  </svg>
);

const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 6h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M22 8l-10 7L2 8"
    />
  </svg>
);

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("idle");



  useEffect(() => {
  let isMounted = true;

  const autofillUser = async () => {
    const user = await getAutofillUser();

    if (!isMounted || !user) return;

    setFormData((prev) => ({
      ...prev,
      name: prev.name || user.name,
      email: prev.email || user.email,
      phone: prev.phone || user.phone,
    }));
  };

  autofillUser();

  return () => {
    isMounted = false;
  };
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("http://localhost:5001/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch (err) {
      console.error("Contact submission failed:", err);
      setStatus("idle");
    }
  };

  return (
    <div className="bg-[#fdfafb] min-h-screen p-8 lg:p-12 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-gray-900 mb-4">
            Get In{" "}
            <span className="text-pink-400 font-serif italic font-medium">
              Touch
            </span>
          </h2>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            We’d love to hear from you. Send us a message!
          </p>
          <button
            onClick={() => navigate("/profile")}
            className="mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-pink-400 hover:text-pink-600 transition-all group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">
              ←
            </span>
            Back to Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* LEFT: CONTACT DETAILS & MAP PLACEHOLDER */}
          <div className="space-y-8">
            <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-pink-50/50">
              <h3 className="text-2xl font-black text-gray-900 mb-6 uppercase italic">
                Contact Info
              </h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center shadow-sm">
                    <MapPinIcon />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Location
                    </p>
                    <p className="text-sm font-bold text-gray-700">
                      Egerton Gate, Njoro, Nakuru
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center shadow-sm">
                    <PhoneIcon />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Phone
                    </p>
                    <p className="text-sm font-bold text-gray-700">
                      +254714749302
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center shadow-sm">
                    <MailIcon />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Email
                    </p>
                    <p className="text-sm font-bold text-gray-700">
                      twinkleglow101@gmail.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* MAP PLACEHOLDER */}
            <div className="bg-gray-200 h-64 rounded-[2rem] overflow-hidden relative shadow-inner">
              <iframe
                title="Egerton Gate Njoro Map"
                src="https://www.google.com/maps?q=-0.3707,35.9323&z=16&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>

          {/* RIGHT: THE FORM */}
          <div className="bg-white p-10 rounded-[2rem] shadow-lg shadow-pink-100/20 border border-pink-50/50 relative overflow-hidden">
            {status === "success" && (
              <div className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
                <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl mb-4">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-gray-900">
                  Message Sent!
                </h3>
                <p className="text-xs font-bold text-gray-400 uppercase mt-2">
                  We will get back to you shortly.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  required
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  readOnly={!!localStorage.getItem("userToken")}
                  className={`w-full p-4 rounded-2xl ${localStorage.getItem("userToken") ? "bg-gray-100" : "bg-white"}`}
                />

                <input
                  required
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  readOnly={!!localStorage.getItem("userToken")}
                  className={`w-full p-4 rounded-2xl ${localStorage.getItem("userToken") ? "bg-gray-100" : "bg-white"}`}
                />
              </div>

              <input
                required
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                readOnly={!!localStorage.getItem("userToken")}
                className={`w-full p-4 rounded-2xl ${localStorage.getItem("userToken") ? "bg-gray-100" : "bg-white"}`}
              />
              <input
                required
                type="text"
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold outline-none focus:border-pink-300 transition-all"
              />
              <textarea
                required
                placeholder="How can we help?"
                rows="6"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold outline-none focus:border-pink-300 transition-all resize-none"
              ></textarea>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full bg-pink-400 hover:bg-pink-500 text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-md"
              >
                {status === "submitting" ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;