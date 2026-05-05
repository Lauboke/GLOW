import React from "react";

const RevenueTab = ({
  totalRevenue,
  todayRevenue,
  safeBookings,
  generateReport,
}) => {
  const revenueBookings = safeBookings.filter(
    (b) => b.paymentStatus === "paid" || b.paymentStatus === "confirmed"
  );

  const mpesaPaidBookings = safeBookings.filter(
    (b) => b.paymentStatus === "paid" && b.paymentMethod === "mpesa"
  );

  const completedBookings = safeBookings.filter((b) => b.completed);
  const pendingBookings = safeBookings.filter((b) => !b.completed);

  const verifiedPayments = revenueBookings.length;

  const calculatedTotalRevenue = revenueBookings.reduce(
    (sum, b) => sum + (Number(b.price) || 0),
    0
  );

  const today = new Date().toISOString().split("T")[0];

  const calculatedTodayRevenue = revenueBookings
    .filter((b) => {
      const createdDate = b.createdAt?.split("T")[0];
      return createdDate === today;
    })
    .reduce((sum, b) => sum + (Number(b.price) || 0), 0);

  const averageTicket =
    revenueBookings.length > 0
      ? Math.round(calculatedTotalRevenue / revenueBookings.length)
      : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Total Paid Revenue
          </p>
          <h3 className="text-3xl font-black text-gray-900 mt-2">
            KES {calculatedTotalRevenue.toLocaleString()}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Today&apos;s Paid Revenue
          </p>
          <h3 className="text-3xl font-black text-pink-600 mt-2">
            KES {calculatedTodayRevenue.toLocaleString()}
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
              Export paid and confirmed bookings as CSV
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
              Average Paid Ticket
            </p>
            <p className="text-3xl font-black text-gray-900 mt-2">
              KES {averageTicket.toLocaleString()}
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              M-Pesa Paid Bookings
            </p>
            <p className="text-3xl font-black text-gray-900 mt-2">
              {mpesaPaidBookings.length}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <h3 className="text-lg font-black uppercase italic text-gray-900 mb-6">
          Recent M-Pesa Payments
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Client
                </th>
                <th className="py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Service
                </th>
                <th className="py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Amount
                </th>
                <th className="py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Receipt
                </th>
                <th className="py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {mpesaPaidBookings.length > 0 ? (
                mpesaPaidBookings.slice(0, 8).map((booking) => (
                  <tr key={booking._id} className="border-b border-gray-50">
                    <td className="py-4 text-sm font-bold text-gray-800">
                      {booking.name}
                    </td>
                    <td className="py-4 text-sm text-gray-500">
                      {booking.service}
                    </td>
                    <td className="py-4 text-sm font-black text-gray-900">
                      KES {Number(booking.price || 0).toLocaleString()}
                    </td>
                    <td className="py-4 text-sm font-black text-pink-600">
                      {booking.mpesaCode || "—"}
                    </td>
                    <td className="py-4">
                      <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                        Paid
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="py-8 text-center text-sm font-bold text-gray-400"
                  >
                    No M-Pesa payments yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RevenueTab;