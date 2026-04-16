import React from "react";
import UpcomingAppointments from "./UpcomingAppointments";
import TopServices from "./TopServices";
import EmployeeStats from "./EmployeeStats";

const DashboardTab = ({
  safeBookings,
  totalRevenue,
  clientCount,
  reviews,
  setActiveTab,
  setClientTab,
}) => {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center text-pink-500 text-lg">
              📅
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-gray-900">
              {safeBookings.length}
            </h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              Total Appointments
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center text-pink-500 text-lg">
              💳
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-gray-900">
              KES {totalRevenue.toLocaleString()}
            </h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              Total Revenue
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-[2rem] shadow-xl border border-gray-800 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-pink-500/20 blur-3xl rounded-full group-hover:bg-pink-500/30 transition-all"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white border border-gray-700">
              ✨
            </div>
            <button
              onClick={() => {
                setActiveTab("clients");
                setClientTab("registered");
              }}
              className="text-[9px] font-black text-white hover:text-pink-400 uppercase tracking-widest transition-colors border-b border-gray-700 hover:border-pink-400 pb-0.5"
            >
              View All
            </button>
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl font-black text-white">{clientCount}</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              Registered Clients
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center text-pink-500 text-lg">
              💬
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-gray-900">
              {reviews.length}
            </h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              Total Reviews
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <UpcomingAppointments
          bookings={safeBookings}
          onViewAll={() => setActiveTab("appointments")}
        />
        <TopServices bookings={safeBookings} />
        <EmployeeStats />
      </div>
    </div>
  );
};

export default DashboardTab;