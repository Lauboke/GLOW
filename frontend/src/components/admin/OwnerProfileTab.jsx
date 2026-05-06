import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const API_BASE = "http://localhost:5001";

const OwnerProfileTab = () => {
  const [account, setAccount] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });

  const [settings, setSettings] = useState({
    businessName: "Glow Beauty",
    businessEmail: "",
    businessPhone: "",
    location: "Nakuru, Kenya",
    addressLine: "Egerton Njoro, Gate",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [accountRes, settingsRes] = await Promise.all([
          fetch(`${API_BASE}/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API_BASE}/api/settings`),
        ]);

        const accountData = await accountRes.json();
        const settingsData = await settingsRes.json();

        if (accountRes.ok && accountData.user) {
          setAccount({
            name: accountData.user.name || "",
            email: accountData.user.email || "",
            phone: accountData.user.phone || "",
            role: accountData.user.role || "",
          });
        }

        if (settingsRes.ok && settingsData.data) {
          setSettings((prev) => ({
            ...prev,
            ...settingsData.data,
          }));
        }
      } catch (error) {
        toast.error("Failed to load profile.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [token]);

  const handleChange = (field, value) => {
    setAccount((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveAccount = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: account.name,
          email: account.email,
          phone: account.phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to update account.");
        return;
      }

      setAccount({
        name: data.user.name || "",
        email: data.user.email || "",
        phone: data.user.phone || "",
        role: data.user.role || "",
      });

      localStorage.setItem("userName", data.user.name || "");
      localStorage.setItem("userEmail", data.user.email || "");
      localStorage.setItem("userRole", data.user.role || "");

      toast.success("Admin profile updated successfully.");
    } catch (error) {
      toast.error("Server error. Profile was not updated.");
    } finally {
      setIsSaving(false);
    }
  };

  const initials =
    account.name
      ?.split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "GA";

  const displayRole =
    account.role === "admin"
      ? "Owner / Super Admin"
      : account.role === "staff"
        ? "Staff Member"
        : "Team Member";

  if (isLoading) {
    return (
      <div className="rounded-[2rem] bg-white p-8 text-center shadow-sm">
        <p className="text-xs font-black uppercase tracking-widest text-pink-400">
          Loading admin profile...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-500 md:space-y-8">
      <div className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-6">
          <div className="flex justify-center md:justify-start">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black text-2xl font-black text-white shadow-lg md:h-24 md:w-24 md:text-3xl">
              {initials}
            </div>
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-2xl font-black uppercase italic text-gray-900 md:text-3xl">
              {account.name || "Glow Admin"}
            </h2>

            <p className="mt-2 text-xs font-black uppercase tracking-[0.22em] text-pink-500 md:text-sm md:tracking-widest">
              {displayRole}
            </p>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-500 md:mx-0">
              Manages Glow Beauty operations, appointments, staff activity,
              client inquiries, promotions, services, and business performance.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm md:p-8">
        <div className="mb-6">
          <h3 className="text-xl font-black uppercase italic text-gray-900">
            Edit Account Profile
          </h3>
          <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
            Update the admin/staff account details used for login and dashboard identity
          </p>
        </div>

        <form
          onSubmit={handleSaveAccount}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <input
            type="text"
            placeholder="Full Name"
            className="settings-input"
            value={account.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Account Email"
            className="settings-input"
            value={account.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Phone Number"
            className="settings-input md:col-span-2"
            value={account.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />

          <div className="md:col-span-2 md:flex md:justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full rounded-xl bg-black px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-pink-500 disabled:opacity-60 md:w-auto"
            >
              {isSaving ? "Saving..." : "Save Account Profile"}
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        <div className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm md:p-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Account Email
          </p>
          <h3 className="mt-2 break-all text-lg font-black text-gray-900 md:text-xl">
            {account.email || "Not set"}
          </h3>
        </div>

        <div className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm md:p-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Account Role
          </p>
          <h3 className="mt-2 text-xl font-black capitalize text-gray-900 md:text-2xl">
            {account.role || "admin"}
          </h3>
        </div>

        <div className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm md:p-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Business Name
          </p>
          <h3 className="mt-2 text-xl font-black text-gray-900 md:text-2xl">
            {settings.businessName}
          </h3>
        </div>

        <div className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm md:p-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Business Location
          </p>
          <h3 className="mt-2 text-xl font-black text-gray-900 md:text-2xl">
            {settings.location}
          </h3>
          {settings.addressLine && (
            <p className="mt-2 text-sm font-bold text-gray-400">
              {settings.addressLine}
            </p>
          )}
        </div>

        <div className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm md:p-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Business Email
          </p>
          <h3 className="mt-2 break-all text-lg font-black text-gray-900 md:text-xl">
            {settings.businessEmail || "Not set"}
          </h3>
        </div>

        <div className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm md:p-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Business Phone
          </p>
          <h3 className="mt-2 text-xl font-black text-gray-900 md:text-2xl">
            {settings.businessPhone || "Not set"}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default OwnerProfileTab;