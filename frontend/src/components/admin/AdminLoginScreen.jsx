import React from "react";

const AdminLoginScreen = ({
  emailInput,
  setEmailInput,
  passwordInput,
  setPasswordInput,
  handleAdminLogin,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50/30 px-4">
      <form
        onSubmit={handleAdminLogin}
        className="bg-white p-12 rounded-[3rem] shadow-2xl text-center border border-pink-100 max-w-sm w-full"
      >
        <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-6 text-gray-900">
          Staff Access
        </h2>

        <input
          type="email"
          placeholder="Staff Email"
          className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-pink-300 mb-3 text-center font-bold text-sm"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-pink-300 mb-6 text-center font-bold text-sm"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-pink-500 transition-all shadow-lg"
        >
          Login to Dashboard
        </button>
      </form>
    </div>
  );
};

export default AdminLoginScreen;