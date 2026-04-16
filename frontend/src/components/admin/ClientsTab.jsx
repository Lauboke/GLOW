import React from "react";

const ClientsTab = ({
  clientTab,
  setClientTab,
  clientCount,
  registeredUsers,
  handleDeleteUser,
  uniqueClients,
  handleDeleteClientHistory,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex bg-white p-1 rounded-2xl border border-gray-100 w-fit shadow-sm">
        <button
          onClick={() => setClientTab("registered")}
          className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            clientTab === "registered"
              ? "bg-black text-white shadow-md"
              : "text-gray-400 hover:text-gray-900"
          }`}
        >
          Registered Accounts
        </button>
        <button
          onClick={() => setClientTab("history")}
          className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            clientTab === "history"
              ? "bg-black text-white shadow-md"
              : "text-gray-400 hover:text-gray-900"
          }`}
        >
          Booking History & Value
        </button>
      </div>

      {clientTab === "registered" && (
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100 animate-in fade-in">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">
              Platform Users
            </h3>
            <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-[10px] font-black">
              {clientCount} Total
            </span>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="p-6 text-[10px] font-black uppercase text-gray-400">Name</th>
                <th className="p-6 text-[10px] font-black uppercase text-gray-400">Email</th>
                <th className="p-6 text-[10px] font-black uppercase text-gray-400">Phone</th>
                <th className="p-6 text-[10px] font-black uppercase text-gray-400">Joined</th>
                <th className="p-6 text-[10px] font-black uppercase text-gray-400">Account Status</th>
                <th className="p-6 text-[10px] font-black uppercase text-gray-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {registeredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-sm text-gray-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                registeredUsers.map((user, index) => (
                  <tr
                    key={user._id || index}
                    className="border-t border-gray-50 hover:bg-gray-50/30 transition"
                  >
                    <td className="p-6 font-black text-gray-900 uppercase tracking-tighter">
                      {user.name}
                    </td>
                    <td className="p-6 text-sm text-gray-500 font-medium">{user.email}</td>
                    <td className="p-6 text-sm font-bold text-pink-500">
                      {user.phone || "N/A"}
                    </td>
                    <td className="p-6 text-xs font-bold text-gray-400 uppercase whitespace-nowrap">
                      {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="p-6">
                      <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[9px] font-black uppercase">
                        Verified User
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="px-3 py-1.5 bg-gray-50 text-gray-400 rounded-xl text-[9px] font-black uppercase hover:text-red-500 border border-gray-100 transition-all"
                      >
                        Delete Account
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {clientTab === "history" && (
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100 animate-in fade-in">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="p-6 text-[10px] font-black uppercase text-gray-400">Customer</th>
                <th className="p-6 text-[10px] font-black uppercase text-gray-400 text-center">Visits</th>
                <th className="p-6 text-[10px] font-black uppercase text-gray-400">Total Revenue</th>
                <th className="p-6 text-[10px] font-black uppercase text-gray-400">Last Seen</th>
                <th className="p-6 text-[10px] font-black uppercase text-gray-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {uniqueClients.map((client, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-50 hover:bg-gray-50/30 transition"
                >
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="font-black text-gray-900 uppercase tracking-tighter">
                        {client.name}
                      </span>
                      <span className="text-[11px] text-pink-400 font-bold">
                        {client.phone}
                      </span>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-[10px] font-black">
                      {client.totalVisits}
                    </span>
                  </td>
                  <td className="p-6 font-black text-sm text-green-600 whitespace-nowrap">
                    KES {client.totalSpent.toLocaleString()}
                  </td>
                  <td className="p-6 text-xs font-bold text-gray-400 uppercase whitespace-nowrap">
                    {client.lastVisit}
                  </td>
                  <td className="p-6 text-right">
                    <button
                      onClick={() => handleDeleteClientHistory(client.phone)}
                      className="px-3 py-1.5 bg-gray-50 text-gray-400 rounded-xl text-[9px] font-black uppercase hover:text-red-600 border border-gray-100 transition-all"
                    >
                      Wipe History
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClientsTab;