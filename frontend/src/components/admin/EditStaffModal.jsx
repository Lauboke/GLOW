import React, { useEffect, useState } from "react";

const EditStaffModal = ({ isOpen, staff, onClose, onSave, isSaving = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    phone: "",
    services: "",
  });

  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.name || "",
        role: staff.role || "",
        phone: staff.phone || "",
        services: Array.isArray(staff.services) ? staff.services.join(", ") : "",
      });
    }
  }, [staff]);

  if (!isOpen || !staff) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      name: formData.name.trim(),
      role: formData.role.trim(),
      phone: formData.phone.trim(),
      services: formData.services
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-black uppercase italic text-gray-900">
              Edit Staff Member
            </h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">
              Update staff details
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-50 hover:bg-pink-50 text-gray-400 hover:text-pink-500 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            className="p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-pink-300 text-sm font-medium"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Role"
            className="p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-pink-300 text-sm font-medium"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Phone"
            className="p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-pink-300 text-sm font-medium"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />

          <input
            type="text"
            placeholder="Services (comma separated)"
            className="p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-pink-300 text-sm font-medium md:col-span-2"
            value={formData.services}
            onChange={(e) => setFormData({ ...formData, services: e.target.value })}
          />

          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl bg-gray-50 text-gray-500 font-black uppercase text-[10px] tracking-widest hover:bg-gray-100 transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 rounded-xl bg-black text-white font-black uppercase text-[10px] tracking-widest hover:bg-pink-500 transition-all disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStaffModal;