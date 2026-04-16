import React from "react";

const AdminHeader = ({ activeTab }) => {
  return (
    <div className="flex justify-between items-center mb-10">
      <h1 className="text-4xl font-black italic uppercase tracking-tighter">
        {activeTab === "dashboard" && "Dashboard Overview"}
        {activeTab === "appointments" && "Live Bookings"}
        {activeTab === "revenue" && "Earnings"}
        {activeTab === "clients" && "Client Management"}
        {activeTab === "inquiries" && "Client Inquiries"}
        {activeTab === "reviews" && "Client Reviews"}
        {activeTab === "profile" && "My Profile"}
        {activeTab === "settings" && "Settings"}
      </h1>

      <a href="/" className="text-xs font-bold text-pink-600 hover:underline">
        Exit to Site
      </a>
    </div>
  );
};

export default AdminHeader;