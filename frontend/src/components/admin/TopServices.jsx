import React from "react";

const TopServices = ({ bookings = [] }) => {
  // 1. Tally up how many times each service was booked
  const serviceCounts = {};
  bookings.forEach((booking) => {
    const service = booking.service || "Other";
    serviceCounts[service] = (serviceCounts[service] || 0) + 1;
  });

  const totalBookings = bookings.length;
  const colors = ["bg-pink-500", "bg-purple-500", "bg-yellow-400", "bg-blue-400"];

  // 2. Convert to an array, calculate percentages, sort by highest, and grab the top 4
  const realServices = Object.keys(serviceCounts)
    .map((serviceName) => ({
      name: serviceName,
      count: serviceCounts[serviceName],
      percentage: totalBookings > 0 ? Math.round((serviceCounts[serviceName] / totalBookings) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4)
    .map((service, index) => ({
      ...service,
      color: colors[index] || "bg-gray-400",
    }));

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 h-full">
      <h3 className="text-lg font-black uppercase italic text-gray-900 mb-8">
        Top Services
      </h3>
      
      <div className="space-y-6">
        {realServices.length > 0 ? (
          realServices.map((service, index) => (
            <div key={index}>
              <div className="flex justify-between text-xs font-black text-gray-700 uppercase mb-2 tracking-wide">
                <span>{index + 1}. {service.name}</span>
                <span className="text-gray-400">{service.percentage}%</span>
              </div>
              <div className="w-full bg-gray-50 rounded-full h-3 overflow-hidden">
                <div
                  className={`${service.color} h-full rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${service.percentage}%` }}
                ></div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-400 font-bold uppercase text-center py-6">No data yet</p>
        )}
      </div>
    </div>
  );
};

export default TopServices;