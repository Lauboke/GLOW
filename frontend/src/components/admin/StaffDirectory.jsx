import React, { useState } from "react";
import useStaffData from "./useStaffData";
import EditStaffModal from "./EditStaffModal";
import ConfirmModal from "./ConfirmModal";
import AddStaffModal from "./AddStaffModal";
import toast from "react-hot-toast";

const StaffDirectory = ({ onAddStaff, onViewStaff }) => {
  // 1. FUNCTIONALITY: A robust state to hold staff details
  const {
    staffMembers,
    loadingStaff,
    staffError,
    fetchStaff,
    deleteStaff,
    updateStaff,
    createStaff,
  } = useStaffData();

  // 2. FUNCTIONALITY: Working Search Bar
  const [searchTerm, setSearchTerm] = useState("");

  const [editingStaff, setEditingStaff] = useState(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const [deletingStaff, setDeletingStaff] = useState(null);
  const [isDeletingStaff, setIsDeletingStaff] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSavingAdd, setIsSavingAdd] = useState(false);

  const filteredStaff = staffMembers.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDeleteStaffConfirm = async () => {
    if (!deletingStaff) return;

    try {
      setIsDeletingStaff(true);

      const res = await deleteStaff(deletingStaff._id);

      if (res.ok) {
        await fetchStaff();
        setDeletingStaff(null);
      } else {
        toast.error("Failed to delete staff member.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Delete failed.");
    } finally {
      setIsDeletingStaff(false);
    }
  };

  const handleEditStaffSave = async (payload) => {
    if (!editingStaff) return;

    try {
      setIsSavingEdit(true);

      const res = await updateStaff(editingStaff._id, payload);

      if (res.ok) {
        await fetchStaff();
        setEditingStaff(null);
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Failed to update staff member.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Update failed.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleAddStaffSave = async (payload) => {
  try {
    setIsSavingAdd(true);

    const res = await createStaff(payload);

    if (res.ok) {
      await fetchStaff();
      setIsAddModalOpen(false);
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || "Failed to create staff member.");
    }
  } catch (error) {
    console.error(error);
    toast.error("Create failed.");
  } finally {
    setIsSavingAdd(false);
  }
};

  if (loadingStaff) {
    return (
      <div className="animate-in fade-in duration-500">
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Loading staff...
          </p>
        </div>
      </div>
    );
  }

  if (staffError) {
    return (
      <div className="animate-in fade-in duration-500">
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-red-500">
            {staffError}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      {/* Top Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-gray-900 uppercase italic">
            Manage Staff
          </h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
            Showing all staff members
          </p>
        </div>
        <div className="flex gap-4">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search staff..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-700 outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 w-64 transition-all shadow-sm"
          />
          {/* Add Staff Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-pink-400 hover:bg-pink-500 text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-colors shadow-md cursor-pointer"
          >
            + Add Staff Member
          </button>
        </div>
      </div>

      {/* The Table Section */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="p-6 text-xs font-black text-gray-900 uppercase tracking-widest">
                Photo
              </th>
              <th className="p-6 text-xs font-black text-gray-900 uppercase tracking-widest">
                Name & Role
              </th>
              <th className="p-6 text-xs font-black text-gray-900 uppercase tracking-widest">
                Assigned Services
              </th>
              <th className="p-6 text-xs font-black text-gray-900 uppercase tracking-widest">
                Phone
              </th>
              <th className="p-6 text-xs font-black text-gray-900 uppercase tracking-widest text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredStaff.length > 0 ? (
              filteredStaff.map((staff) => (
                <tr
                  key={staff.id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="p-6">
                    <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center font-black text-lg group-hover:bg-pink-500 transition-colors shadow-sm">
                      {staff.name.charAt(0)}
                    </div>
                  </td>
                  <td className="p-6">
                    <p className="text-sm font-black text-gray-900">
                      {staff.name}
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                      {staff.role}
                    </p>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-wrap gap-2">
                      {staff.services.map((service, idx) => (
                        <span
                          key={idx}
                          className="bg-white border border-gray-100 text-gray-600 text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wide shadow-sm"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-6 text-sm font-bold text-gray-600">
                    {staff.phone}
                  </td>
                  <td className="p-6">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => setEditingStaff(staff)}
                        className="text-[10px] font-black text-gray-400 hover:text-pink-500 uppercase tracking-widest bg-gray-50 hover:bg-pink-50 px-3 py-1.5 rounded-lg transition-all border border-gray-100 hover:border-pink-200 cursor-pointer"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => setDeletingStaff(staff)}
                        className="text-[10px] font-black text-gray-400 hover:text-red-500 uppercase tracking-widest bg-gray-50 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all border border-gray-100 hover:border-red-200 cursor-pointer"
                      >
                        Delete
                      </button>

                      <button
                        onClick={() => onViewStaff(staff.name)}
                        className="text-[10px] font-black text-white bg-gray-900 hover:bg-pink-500 uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all shadow-sm cursor-pointer"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="p-12 text-center text-gray-400 text-xs font-bold uppercase tracking-widest"
                >
                  No staff members found matching "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <EditStaffModal
        isOpen={!!editingStaff}
        staff={editingStaff}
        onClose={() => setEditingStaff(null)}
        onSave={handleEditStaffSave}
        isSaving={isSavingEdit}
      />

      <ConfirmModal
        isOpen={!!deletingStaff}
        title="Delete Staff Member?"
        message={
          deletingStaff
            ? `This will remove ${deletingStaff.name} from the active staff list.`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteStaffConfirm}
        onClose={() => setDeletingStaff(null)}
        isLoading={isDeletingStaff}
      />

      <AddStaffModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddStaffSave}
        isSaving={isSavingAdd}
      />
    </div>
  );
};

export default StaffDirectory;
