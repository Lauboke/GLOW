import React from "react";
import toast from "react-hot-toast";
import WeeklySchedule from "./WeeklySchedule";
import StaffDirectory from "./StaffDirectory";
import StaffPerformanceCard from "./StaffPerformanceCard";
import { STAFF_MEMBERS } from "./staffData";

const StaffTab = ({ selectedStaff, setSelectedStaff, bookings }) => {
  return (
    <div className="animate-in fade-in duration-500">
      {!selectedStaff ? (
        <StaffDirectory
          onAddStaff={() => toast("Add Staff form coming soon!")}
          onViewStaff={(name) => setSelectedStaff(name)}
        />
      ) : (
        <div className="animate-in slide-in-from-right-4 duration-300">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => setSelectedStaff(null)}
              className="w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center hover:bg-pink-50 hover:text-pink-500 transition-colors shadow-sm text-gray-400 cursor-pointer"
            >
              ←
            </button>

            <div>
              <h2 className="text-3xl font-black text-gray-900 uppercase italic">
                {selectedStaff}'s Dashboard
              </h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                Viewing schedule and performance
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <WeeklySchedule selectedStaff={selectedStaff} />
            </div>

            <StaffPerformanceCard
  selectedStaff={selectedStaff}
  bookings={bookings}
/>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffTab;