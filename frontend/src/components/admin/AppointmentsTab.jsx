import React from "react";
import useStaffData from "./useStaffData";

const TIME_SLOTS = [
  "08:00",
  "10:00",
  "12:00",
  "14:00",
  "16:00",
  "18:00",
];

const AppointmentsTab = ({
  todayDate,
  todayCount,
  safeBookings,
  newEntry,
  setNewEntry,
  handleAddBooking,
  searchTerm,
  setSearchTerm,
  filter,
  setFilter,
  filteredBookings,
  handleUpdatePaymentStatus,
  handleToggleComplete,
  handleDelete,
}) => {
  const { staffMembers } = useStaffData();
  const occupiedTimesForSelectedDate = safeBookings
    .filter((booking) => booking.date === newEntry.date)
    .map((booking) => booking.time);

  const isSlotOccupied = (time) => occupiedTimesForSelectedDate.includes(time);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <p className="text-[9px] font-black uppercase text-gray-400">
            Today's Load
          </p>
          <h3 className="text-2xl font-black text-pink-500">
            {todayCount}/5
          </h3>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <p className="text-[9px] font-black uppercase text-gray-400">
            Active Bookings
          </p>
          <h3 className="text-2xl font-black">{safeBookings.length}</h3>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <h3 className="text-[10px] font-black uppercase tracking-widest mb-6 text-gray-400">
          Add Walk-In
        </h3>

        <form
          onSubmit={handleAddBooking}
          className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-3"
        >
          <input
            type="text"
            placeholder="Name"
            required
            className="p-3 bg-gray-50 rounded-xl border-none text-sm outline-none focus:ring-1 focus:ring-pink-300"
            value={newEntry.name}
            onChange={(e) =>
              setNewEntry({ ...newEntry, name: e.target.value })
            }
          />

          <input
            type="tel"
            placeholder="Phone"
            required
            className="p-3 bg-gray-50 rounded-xl border-none text-sm outline-none focus:ring-1 focus:ring-pink-300"
            value={newEntry.phone}
            onChange={(e) =>
              setNewEntry({ ...newEntry, phone: e.target.value })
            }
          />

          <input
            type="date"
            required
            min={todayDate}
            className="p-3 bg-gray-50 rounded-xl border-none text-sm outline-none"
            value={newEntry.date}
            onChange={(e) =>
              setNewEntry({ ...newEntry, date: e.target.value, time: "" })
            }
          />

          <select
            required
            className="p-3 bg-gray-50 rounded-xl border-none text-sm outline-none"
            value={newEntry.time}
            onChange={(e) =>
              setNewEntry({ ...newEntry, time: e.target.value })
            }
            disabled={!newEntry.date}
          >
            <option value="">Select Time</option>
            {TIME_SLOTS.map((time) => (
              <option key={time} value={time} disabled={isSlotOccupied(time)}>
                {isSlotOccupied(time) ? `${time} - Occupied` : time}
              </option>
            ))}
          </select>

          <select
            required
            className="p-3 bg-gray-50 rounded-xl border-none text-sm outline-none"
            value={newEntry.stylist}
            onChange={(e) =>
              setNewEntry({ ...newEntry, stylist: e.target.value })
            }
          >
            <option value="">Select Stylist</option>
            {staffMembers.map((staff) => (
  <option key={staff._id} value={staff.name}>
    {staff.name} ({staff.role})
  </option>
))}

          </select>

          <input
            type="number"
            placeholder="Price (KES)"
            required
            className="p-3 bg-gray-50 rounded-xl border-none text-sm outline-none focus:ring-1 focus:ring-pink-300"
            value={newEntry.price}
            onChange={(e) =>
              setNewEntry({ ...newEntry, price: e.target.value })
            }
          />

          <select
  required
  className="p-3 bg-gray-50 rounded-xl border-none text-sm outline-none"
  value={newEntry.paymentMethod}
  onChange={(e) =>
    setNewEntry({
      ...newEntry,
      paymentMethod: e.target.value,
      mpesaCode: e.target.value === "cash" ? "" : newEntry.mpesaCode,
    })
  }
>
  <option value="cash">Cash</option>
  <option value="mpesa">M-Pesa</option>
</select>

{newEntry.paymentMethod === "mpesa" && (
  <input
    type="text"
    placeholder="M-Pesa Code"
    required
    className="p-3 bg-gray-50 rounded-xl border-none text-sm outline-none focus:ring-1 focus:ring-pink-300"
    value={newEntry.mpesaCode}
    onChange={(e) =>
      setNewEntry({ ...newEntry, mpesaCode: e.target.value.toUpperCase() })
    }
  />
)}

          <select
            required
            className="p-3 bg-gray-50 rounded-xl border-none text-sm outline-none"
            value={newEntry.service}
            onChange={(e) =>
              setNewEntry({ ...newEntry, service: e.target.value })
            }
          >
            <option value="">Select Service</option>
            <option value="Nails">Nails</option>
            <option value="Facial">Facial</option>
            <option value="Makeup">Makeup</option>
            <option value="Hair Styling">Hair Styling</option>
          </select>

          <button
            type="submit"
            className="bg-black text-white p-3 rounded-xl font-black uppercase text-[10px] tracking-widest"
          >
            Add
          </button>
        </form>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-50 flex flex-wrap gap-4 justify-between items-center bg-gray-50/30">
          <input
            type="text"
            placeholder="Search..."
            className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-xs outline-none w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="flex bg-white p-1 rounded-xl border border-gray-200 gap-1">
            {["all", "pending", "completed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${
                  filter === f
                    ? "bg-black text-white"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="p-6 text-[10px] font-black uppercase text-gray-400">
                Status
              </th>
              <th className="p-6 text-[10px] font-black uppercase text-gray-400">
                Client
              </th>
              <th className="p-6 text-[10px] font-black uppercase text-gray-400">
                Payment info
              </th>
              <th className="p-6 text-[10px] font-black uppercase text-gray-400">
                Time
              </th>
              <th className="p-6 text-[10px] font-black uppercase text-gray-400">
                Service
              </th>
              <th className="p-6 text-[10px] font-black uppercase text-gray-400 text-right">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredBookings.map((apt) => (
              <tr
                key={apt._id}
                className="border-t border-gray-50 hover:bg-gray-50/30 transition"
              >
                <td className="p-6">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      apt.paymentMethod === "cash" || apt.paymentStatus === "confirmed"
  ? "bg-green-500"
  : "bg-pink-500 animate-pulse"
                    }`}
                  />
                  <span className="text-[8px] font-black uppercase block mt-1">
                    {apt.paymentMethod === "cash" || apt.paymentStatus === "confirmed"
  ? "VERIFIED"
  : (apt.paymentStatus?.replace("_", " ") || "PENDING").toUpperCase()}
                  </span>
                </td>

                <td className="p-6">
                  <div className="flex flex-col">
                    <span className="font-black text-gray-900 uppercase tracking-tighter">
                      {apt.name}
                    </span>
                    <span className="text-[11px] text-pink-400 font-bold">
                      {apt.phone}
                    </span>
                  </div>
                </td>

                <td className="p-6">
                  <div className="flex flex-col">
                    <span className="px-3 py-1 bg-pink-50 text-pink-600 rounded-lg text-[10px] font-black tracking-widest uppercase w-fit">
                      {apt.paymentMethod === "mpesa" ? apt.mpesaCode || "MPESA" : "CASH"}
                    </span>
                  </div>
                </td>

                <td className="p-6 text-sm font-bold">
                  {apt.date} <br />
                  <span className="text-xs text-gray-400 uppercase font-black italic">
                    {apt.time}
                  </span>
                </td>

                <td className="p-6">
                  <span className="px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {apt.service}
                  </span>
                  <p className="text-[10px] font-black text-gray-900 mt-1">
                    KES {Number(apt.price).toLocaleString() || "0"}
                  </p>
                  {apt.stylist && (
                    <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">
                      Stylist: {apt.stylist}
                    </p>
                  )}
                </td>

                <td className="p-6 text-right space-x-2">
                  {apt.paymentStatus !== "confirmed" && apt.mpesaCode && (
                    <button
                      onClick={() =>
                        handleUpdatePaymentStatus(apt._id, "confirmed")
                      }
                      className="px-3 py-2 bg-black text-white rounded-xl text-[9px] font-black uppercase hover:bg-green-600 transition-all shadow-md"
                    >
                      Verify Pay
                    </button>
                  )}

                  <button
                    onClick={() => handleToggleComplete(apt._id, apt.completed)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase ${
                      apt.completed
                        ? "bg-gray-100 text-gray-400"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {apt.completed ? "Done" : "Complete"}
                  </button>

                  <button
                    onClick={() => handleDelete(apt._id)}
                    className="px-4 py-2 bg-gray-100 text-gray-400 rounded-xl text-[10px] font-black uppercase hover:text-red-500 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentsTab;