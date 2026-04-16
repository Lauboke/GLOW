import React from "react";
import useStaffData from "./useStaffData";

const StaffPerformanceCard = ({ selectedStaff, bookings = [] }) => {
  const { staffMembers } = useStaffData();
  const staffInfo = staffMembers.find((s) => s.name === selectedStaff);

  const staffBookings = bookings.filter(
    (b) => b.employeeName === selectedStaff
  );

  const completedBookings = staffBookings.filter((b) => b.completed);

  const totalRevenueGenerated = completedBookings.reduce(
    (sum, b) => sum + (Number(b.price) || 0),
    0
  );

  const staffEarnings = totalRevenueGenerated * 0.5;

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 h-full min-h-[400px]">
      <div className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          Staff Performance
        </p>
        <h3 className="text-2xl font-black text-gray-900 uppercase italic mt-2">
          {selectedStaff}
        </h3>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
          {staffInfo?.role || "Staff Member"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Total Bookings
          </p>
          <p className="text-3xl font-black text-gray-900 mt-2">
            {staffBookings.length}
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Completed Jobs
          </p>
          <p className="text-3xl font-black text-gray-900 mt-2">
            {completedBookings.length}
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Revenue Generated
          </p>
          <p className="text-3xl font-black text-gray-900 mt-2">
            KES {totalRevenueGenerated.toLocaleString()}
          </p>
        </div>

        <div className="bg-pink-50 rounded-2xl p-5 border border-pink-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-pink-500">
            Staff Earnings 
          </p>
          <p className="text-3xl font-black text-pink-600 mt-2">
            KES {staffEarnings.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StaffPerformanceCard;