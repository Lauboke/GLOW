import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const API_BASE = "http://localhost:5001";

const GiveawaysManagerTab = () => {
  const [giveaways, setGiveaways] = useState([]);
  const [entriesModal, setEntriesModal] = useState(null);
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEntriesLoading, setIsEntriesLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    type: "promo",
    applicableCategory: "All",
    description: "",
    prize: "",
    promoCode: "",
    startDate: "",
    endDate: "",
    isActive: true,
  });

  const fetchGiveaways = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/giveaways/admin`);
      const data = await res.json();

      if (res.ok) {
        setGiveaways(data.data || []);
      } else {
        toast.error(data.message || "Failed to load giveaways.");
      }
    } catch (error) {
      toast.error("Could not connect to backend.");
    }
  };

  useEffect(() => {
    fetchGiveaways();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateGiveaway = async (e) => {
    e.preventDefault();

    if (!formData.endDate) {
      toast.error("Please select an end date.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/giveaways/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to create promo.");
        return;
      }

      toast.success(data.message || "Promo created successfully.");

      setFormData({
        title: "",
        type: "promo",
        applicableCategory: "All",
        description: "",
        prize: "",
        promoCode: "",
        startDate: "",
        endDate: "",
        isActive: true,
      });

      fetchGiveaways();
    } catch (error) {
      toast.error("Server error. Promo was not created.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGiveaway = async (giveawayId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this promo/giveaway?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_BASE}/api/giveaways/admin/${giveawayId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to delete promo.");
        return;
      }

      toast.success("Promo deleted successfully.");
      fetchGiveaways();
    } catch (error) {
      toast.error("Server error. Promo was not deleted.");
    }
  };

  const handleViewEntries = async (giveaway) => {
    setEntriesModal(giveaway);
    setEntries([]);
    setIsEntriesLoading(true);

    try {
      const res = await fetch(
        `${API_BASE}/api/giveaways/admin/${giveaway._id}/entries`
      );
      const data = await res.json();

      if (res.ok) {
        setEntries(data.data || []);
      } else {
        toast.error(data.message || "Failed to load entries.");
      }
    } catch (error) {
      toast.error("Could not load entries.");
    } finally {
      setIsEntriesLoading(false);
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "Not set";
    return new Date(dateValue).toLocaleDateString();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm md:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-black uppercase italic text-gray-900 md:text-3xl">
            Giveaways & Promos
          </h2>
          <p className="mt-2 text-[10px] font-black uppercase tracking-[0.22em] text-gray-400 md:text-xs md:tracking-widest">
            Create promos, giveaways, and view client claims
          </p>
        </div>

        <form
          onSubmit={handleCreateGiveaway}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <input
            type="text"
            placeholder="Title e.g. Launch Week Promo"
            className="settings-input"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
          />

          <select
            className="settings-input"
            value={formData.type}
            onChange={(e) => handleChange("type", e.target.value)}
          >
            <option value="promo">Promo</option>
            <option value="giveaway">Giveaway</option>
          </select>

          <select
            className="settings-input"
            value={formData.applicableCategory}
            onChange={(e) =>
              handleChange("applicableCategory", e.target.value)
            }
          >
            <option value="All">All Services</option>
            <option value="Hair">Hair</option>
            <option value="Nails">Nails</option>
            <option value="Skin">Skin</option>
            <option value="Makeup">Makeup</option>
            <option value="Lashes">Lashes</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="text"
            placeholder="Promo Code e.g. GLOW500"
            className="settings-input"
            value={formData.promoCode}
            onChange={(e) => handleChange("promoCode", e.target.value)}
          />

          <input
            type="text"
            placeholder="Prize / Offer e.g. KES 500 off"
            className="settings-input md:col-span-2"
            value={formData.prize}
            onChange={(e) => handleChange("prize", e.target.value)}
          />

          <textarea
            placeholder="Description"
            className="settings-input min-h-[110px] resize-none md:col-span-2"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            required
          />

          <div>
            <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-pink-400">
              Start Date
            </label>
            <input
              type="date"
              className="settings-input"
              value={formData.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-pink-400">
              End Date
            </label>
            <input
              type="date"
              className="settings-input"
              value={formData.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
              required
            />
          </div>

          <label className="flex items-center gap-3 rounded-[1.4rem] bg-gray-50 p-4 text-xs font-black uppercase tracking-widest text-gray-600 md:col-span-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => handleChange("isActive", e.target.checked)}
            />
            Active on client profile
          </label>

          <div className="md:col-span-2 md:flex md:justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-black px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-pink-500 disabled:opacity-60 md:w-auto"
            >
              {isLoading ? "Creating..." : "Create Promo / Giveaway"}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm md:p-8">
        <h3 className="mb-6 text-xl font-black uppercase italic text-gray-900">
          Current Promos & Giveaways
        </h3>

        {giveaways.length === 0 ? (
          <p className="text-sm font-bold text-gray-400">
            No promos or giveaways created yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {giveaways.map((item) => (
              <div
                key={item._id}
                className="rounded-[2rem] border border-gray-100 bg-gray-50 p-5"
              >
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-pink-50 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-pink-500">
                    {item.type}
                  </span>

                  <span className="rounded-full bg-white px-3 py-1 text-[9px] font-black uppercase tracking-widest text-gray-500">
                    {item.applicableCategory}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest ${
                      item.isActive
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-500"
                    }`}
                  >
                    {item.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <h4 className="text-sm font-black uppercase tracking-wide text-gray-900">
                  {item.title}
                </h4>

                <p className="mt-2 text-xs leading-5 text-gray-500">
                  {item.description}
                </p>

                {item.prize && (
                  <p className="mt-3 text-xs font-black text-pink-500">
                    {item.prize}
                  </p>
                )}

                {item.promoCode && (
                  <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Code: {item.promoCode}
                  </p>
                )}

                <div className="mt-4 grid grid-cols-2 gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  <p>Start: {formatDate(item.startDate)}</p>
                  <p>End: {formatDate(item.endDate)}</p>
                  <p>Claims: {item.entriesCount || 0}</p>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => handleViewEntries(item)}
                    className="flex-1 rounded-xl bg-black px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white transition hover:bg-pink-500"
                  >
                    View Entries
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteGiveaway(item._id)}
                    className="flex-1 rounded-xl bg-red-50 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 transition hover:bg-red-500 hover:text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {entriesModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-3xl rounded-[2rem] bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-black uppercase italic text-gray-900">
                  Claimed Entries
                </h3>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-gray-400">
                  {entriesModal.title}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEntriesModal(null)}
                className="rounded-full bg-gray-100 px-4 py-2 text-xs font-black text-gray-500 hover:bg-black hover:text-white"
              >
                ✕
              </button>
            </div>

            {isEntriesLoading ? (
              <p className="py-10 text-center text-sm font-bold text-gray-400">
                Loading entries...
              </p>
            ) : entries.length === 0 ? (
              <p className="py-10 text-center text-sm font-bold text-gray-400">
                No clients have claimed this yet.
              </p>
            ) : (
              <div className="max-h-[420px] overflow-y-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-[10px] uppercase tracking-widest text-gray-400">
                      <th className="py-3">Client</th>
                      <th className="py-3">Contact</th>
                      <th className="py-3">Code</th>
                      <th className="py-3">Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {entries.map((entry) => (
                      <tr
                        key={`${entry.userId}-${entry.enteredAt}`}
                        className="border-b border-gray-50"
                      >
                        <td className="py-4">
                          <p className="font-black text-gray-900">
                            {entry.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {entry.email}
                          </p>
                        </td>

                        <td className="py-4 text-xs font-bold text-gray-500">
                          {entry.phone || "No phone"}
                        </td>

                        <td className="py-4">
                          {entry.promoCode ? (
                            <span className="rounded-full bg-pink-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-pink-500">
                              {entry.promoCode}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>

                        <td className="py-4 text-xs font-bold text-gray-500">
                          {formatDate(entry.enteredAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GiveawaysManagerTab;