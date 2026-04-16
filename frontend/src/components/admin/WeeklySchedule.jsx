import React, { useState, useEffect } from "react";

const WeeklySchedule = ({ selectedStaff }) => {
  const [scheduleData, setScheduleData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
  if (selectedStaff) {
    fetchSchedule(selectedStaff);
  }
}, [selectedStaff]);

  const fetchSchedule = async (name) => {
    if (!name) return;
    setLoading(true);
    setErrorMessage("");

    try {
      // NOTE: Make sure the port (5001) matches your actual backend server port!
      const response = await fetch(`http://localhost:5001/api/bookings/employee/${name}/weekly`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      
      const data = await response.json();
      setScheduleData(data);
    } catch (err) {
      setErrorMessage("Could not load schedule. Is the backend server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 max-w-md w-full">
      <h3 className="text-xl font-black italic uppercase text-gray-900 mb-4">
        Weekly Schedule
      </h3>
      
      <div className="w-full p-4 mb-6 bg-gray-50 rounded-2xl border-none text-sm font-medium">
  {selectedStaff}
</div>

      {/* Loading & Error States */}
      {loading && <p className="text-sm text-pink-500 font-bold animate-pulse text-center">Fetching schedule...</p>}
      {errorMessage && <p className="text-xs text-red-500 bg-red-50 p-3 rounded-xl font-bold text-center">{errorMessage}</p>}

      {/* The Results Dashboard */}
      {scheduleData && !loading && (
        <div className="animate-fade-in">
          
          {/* Summary Card */}
          <div className="flex justify-between items-center bg-pink-50 p-4 rounded-2xl mb-4 border border-pink-100">
            <div>
              <p className="text-[10px] font-black uppercase text-pink-400">This Week</p>
              <p className="text-xs font-bold text-gray-800">{scheduleData.weekRange}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase text-pink-400">Appointments</p>
              <p className="text-2xl font-black text-pink-600">{scheduleData.totalAppointments}</p>
            </div>
          </div>

          {/* List of Appointments */}
          {scheduleData.totalAppointments === 0 ? (
            <p className="text-sm font-medium text-gray-400 text-center py-6 border-2 border-dashed border-gray-100 rounded-2xl">
              No appointments scheduled for this week. ✨
            </p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {scheduleData.appointments.map((apt, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-pink-200 transition-colors">
                  <div>
                    <p className="text-sm font-black text-gray-900">{apt.time} - {apt.name}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">
                      {apt.service} • {apt.date}
                    </p>
                  </div>
                  <span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-xl ${
                    apt.completed ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {apt.completed ? 'Done' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WeeklySchedule;