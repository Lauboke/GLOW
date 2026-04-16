import React, { useState } from "react";
import toast from "react-hot-toast";

const SettingsTab = () => {
  const [settings, setSettings] = useState({
    businessName: "Glow Beauty",
    businessEmail: "your-email@example.com",
    businessPhone: "+254 7XX XXX XXX",
    location: "Nairobi, Kenya",
    mpesaPaybill: "",
    openingTime: "08:00",
    closingTime: "18:00",
  });

  const handleSave = (e) => {
    e.preventDefault();
    toast.success("Settings saved.");
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
            className="w-full rounded-[1.4rem] border border-gray-100 bg-gray-50 p-4 text-sm font-medium text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-pink-300"
            value={settings.businessName}
            onChange={(e) =>
              setSettings({ ...settings, businessName: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Business Email"
            className="w-full rounded-[1.4rem] border border-gray-100 bg-gray-50 p-4 text-sm font-medium text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-pink-300"
            value={settings.businessEmail}
            onChange={(e) =>
              setSettings({ ...settings, businessEmail: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Business Phone"
            className="w-full rounded-[1.4rem] border border-gray-100 bg-gray-50 p-4 text-sm font-medium text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-pink-300"
            value={settings.businessPhone}
            onChange={(e) =>
              setSettings({ ...settings, businessPhone: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Location"
            className="w-full rounded-[1.4rem] border border-gray-100 bg-gray-50 p-4 text-sm font-medium text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-pink-300"
            value={settings.location}
            onChange={(e) =>
              setSettings({ ...settings, location: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="M-Pesa Paybill / Till"
            className="w-full rounded-[1.4rem] border border-gray-100 bg-gray-50 p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-pink-300 md:col-span-2"
            value={settings.mpesaPaybill}
            onChange={(e) =>
              setSettings({ ...settings, mpesaPaybill: e.target.value })
            }
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:col-span-2">
            <input
              type="time"
              className="w-full rounded-[1.4rem] border border-gray-100 bg-gray-50 p-4 text-sm font-medium text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-pink-300"
              value={settings.openingTime}
              onChange={(e) =>
                setSettings({ ...settings, openingTime: e.target.value })
              }
            />

            <input
              type="time"
              className="w-full rounded-[1.4rem] border border-gray-100 bg-gray-50 p-4 text-sm font-medium text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-pink-300"
              value={settings.closingTime}
              onChange={(e) =>
                setSettings({ ...settings, closingTime: e.target.value })
              }
            />
          </div>

          <div className="pt-2 md:col-span-2 md:flex md:justify-end">
            <button
              type="submit"
              className="w-full rounded-xl bg-black px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-pink-500 md:w-auto"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsTab;