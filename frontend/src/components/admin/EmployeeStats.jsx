import React, { useEffect, useState } from "react";

const EmployeeStats = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // NOTE: Change 5001 to 5000 if that is your backend port!
    fetch("http://localhost:5001/api/bookings/stats/employees-weekly")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching stats:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 h-full">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-lg font-black uppercase italic text-gray-900">
          Staff Performance
        </h3>
        <span className="bg-pink-50 text-pink-500 text-[9px] font-black px-3 py-1 rounded-full tracking-widest uppercase">
          This Week
        </span>
      </div>

      <div className="space-y-6">
        {loading ? (
          <p className="text-gray-400 text-xs animate-pulse font-bold uppercase">Loading stats...</p>
        ) : stats.length > 0 ? (
          stats.map((emp, index) => (
            <div key={index} className="flex items-center justify-between group">
              <div className="flex items-center gap-4">
                {/* Visual Avatar - uses first letter of name */}
                <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white font-black text-sm group-hover:bg-pink-500 transition-colors shadow-lg">
                  {emp._id ? emp._id.charAt(0) : "?"}
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900">
                    {emp._id || "Unassigned"}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                    Professional Stylist
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-gray-900 group-hover:text-pink-500 transition-colors">
                  {emp.count}
                </p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                  Bookings
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 border-2 border-dashed border-gray-50 rounded-[2rem]">
            <p className="text-gray-300 text-xs font-bold uppercase tracking-widest">
              No data for this week
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeStats;