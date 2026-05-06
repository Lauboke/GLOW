import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const API_BASE = "http://localhost:5001";

const SettingsTab = () => {
  const [settings, setSettings] = useState({
    businessName: "Glow Beauty",
    businessEmail: "",
    businessPhone: "",
    whatsappNumber: "",
    instagramUrl: "https://instagram.com/twinkle_glowbeauty",
    location: "Nakuru, Kenya",
    addressLine: "Egerton Njoro, Gate",
    mpesaPaybill: "",
    openingTime: "08:00",
    closingTime: "17:00",
    saturdayOpeningTime: "09:00",
    saturdayClosingTime: "15:00",
    footerTagline:
      "Redefining beauty standards through luxury artistry and a passion for the glow.",
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/settings`);
        const data = await response.json();

        if (response.ok && data.data) {
          setSettings((prev) => ({
            ...prev,
            ...data.data,
            location: data.data.location || "Nakuru, Kenya",
            addressLine: data.data.addressLine || "Egerton Njoro, Gate",
          }));
        }
      } catch (error) {
        toast.error("Could not load settings.");
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to save settings.");
        return;
      }

      setSettings(data.data);
      toast.success("Settings saved successfully.");
    } catch (error) {
      toast.error("Server error. Settings were not saved.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-500 md:space-y-8">
      <div className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm md:p-8">
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl font-black uppercase italic text-gray-900 md:text-3xl">
            Settings
          </h2>
          <p className="mt-2 text-[10px] font-black uppercase tracking-[0.22em] text-gray-400 md:text-xs md:tracking-widest">
            Manage business configuration
          </p>
        </div>

        <form
          onSubmit={handleSave}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <input
            type="text"
            placeholder="Business Name"
            className="settings-input"
            value={settings.businessName}
            onChange={(e) => handleChange("businessName", e.target.value)}
          />

          <input
            type="email"
            placeholder="Business Email"
            className="settings-input"
            value={settings.businessEmail}
            onChange={(e) => handleChange("businessEmail", e.target.value)}
          />

          <input
            type="text"
            placeholder="Business Phone"
            className="settings-input"
            value={settings.businessPhone}
            onChange={(e) => handleChange("businessPhone", e.target.value)}
          />

          <input
            type="text"
            placeholder="WhatsApp Number e.g. 254712345678"
            className="settings-input"
            value={settings.whatsappNumber}
            onChange={(e) => handleChange("whatsappNumber", e.target.value)}
          />

          <input
            type="text"
            placeholder="Instagram URL"
            className="settings-input"
            value={settings.instagramUrl}
            onChange={(e) => handleChange("instagramUrl", e.target.value)}
          />

          <input
            type="text"
            placeholder="Location"
            className="settings-input"
            value={settings.location}
            onChange={(e) => handleChange("location", e.target.value)}
          />

          <input
            type="text"
            placeholder="Address Line"
            className="settings-input md:col-span-2"
            value={settings.addressLine}
            onChange={(e) => handleChange("addressLine", e.target.value)}
          />

          <input
            type="text"
            placeholder="M-Pesa Paybill / Till"
            className="settings-input md:col-span-2"
            value={settings.mpesaPaybill}
            onChange={(e) => handleChange("mpesaPaybill", e.target.value)}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:col-span-2">
            <input
              type="time"
              className="settings-input"
              value={settings.openingTime}
              onChange={(e) => handleChange("openingTime", e.target.value)}
            />

            <input
              type="time"
              className="settings-input"
              value={settings.closingTime}
              onChange={(e) => handleChange("closingTime", e.target.value)}
            />

            <input
              type="time"
              className="settings-input"
              value={settings.saturdayOpeningTime}
              onChange={(e) =>
                handleChange("saturdayOpeningTime", e.target.value)
              }
            />

            <input
              type="time"
              className="settings-input"
              value={settings.saturdayClosingTime}
              onChange={(e) =>
                handleChange("saturdayClosingTime", e.target.value)
              }
            />
          </div>

          <textarea
            placeholder="Footer Tagline"
            className="settings-input min-h-[120px] resize-none md:col-span-2"
            value={settings.footerTagline}
            onChange={(e) => handleChange("footerTagline", e.target.value)}
          />

          <div className="pt-2 md:col-span-2 md:flex md:justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-black px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-pink-500 disabled:opacity-60 md:w-auto"
            >
              {isLoading ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsTab;