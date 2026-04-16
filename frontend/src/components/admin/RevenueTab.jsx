import React from "react";

const RevenueTab = ({
  totalRevenue,
  todayRevenue,
  safeBookings,
  generateReport,
}) => {
  const completedBookings = safeBookings.filter((b) => b.completed);
  const pendingBookings = safeBookings.filter((b) => !b.completed);
  const verifiedPayments = safeBookings.filter(
  (b) =>
    b.paymentStatus === "confirmed" ||
    b.paymentMethod === "cash"
).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Total Revenue
          </p>
          <h3 className="text-3xl font-black text-gray-900 mt-2">
            KES {totalRevenue.toLocaleString()}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Today&apos;s Revenue
          </p>
          <h3 className="text-3xl font-black text-pink-600 mt-2">
            KES {todayRevenue.toLocaleString()}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Completed Jobs
          </p>
          <h3 className="text-3xl font-black text-gray-900 mt-2">
            {completedBookings.length}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Verified Payments
          </p>
          <h3 className="text-3xl font-black text-gray-900 mt-2">
            {verifiedPayments}
          </h3>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-xl font-black uppercase italic text-gray-900">
              Revenue Report
            </h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
              Export completed bookings as CSV
            </p>
          </div>

          <button
            onClick={generateReport}
            className="bg-black text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-pink-500 transition-all shadow-lg"
          >
            Download Report
          </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <h3 className="text-lg font-black uppercase italic text-gray-900 mb-6">
          Revenue Snapshot
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Pending Jobs
            </p>
            <p className="text-3xl font-black text-gray-900 mt-2">
              {pendingBookings.length}
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Average Ticket
            </p>
            <p className="text-3xl font-black text-gray-900 mt-2">
              KES{" "}
              {completedBookings.length > 0
                ? Math.round(totalRevenue / completedBookings.length).toLocaleString()
                : "0"}
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Total Bookings
            </p>
            <p className="text-3xl font-black text-gray-900 mt-2">
              {safeBookings.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueTab;