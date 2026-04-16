import React from "react";

// Notice we added 'onViewAll' as a prop
const UpcomingAppointments = ({ bookings, onViewAll }) => {
  const upcoming = bookings?.slice(0, 5) || [];

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-black uppercase italic text-gray-900">
          Upcoming Appointments
        </h3>
        {/* We attach the onClick handler here */}
        <button 
          onClick={onViewAll}
          className="text-[10px] font-black text-pink-500 uppercase tracking-widest cursor-pointer hover:text-pink-600 transition-colors bg-transparent border-none p-0"
        >
          View All
        </button>
      </div>

      <div className="space-y-4">
        {upcoming.length > 0 ? (
          upcoming.map((apt, index) => (
            <div key={index} className="flex justify-between items-center border-b border-gray-50 pb-4 last:border-0 last:pb-0 group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center text-pink-500 font-bold text-xs uppercase group-hover:bg-pink-500 group-hover:text-white transition-colors">
                  {apt.name ? apt.name.charAt(0) : "?"}
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900">{apt.name}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                    {apt.service} • {apt.employeeName || "Unassigned"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-gray-900">{apt.time}</p>
                <p className="text-[10px] font-bold text-pink-400 uppercase">{apt.date}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-xs font-bold uppercase text-center py-6">No upcoming bookings</p>
        )}
      </div>
    </div>
  );
};

export default UpcomingAppointments;