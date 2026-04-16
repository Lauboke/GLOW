import React, { useState } from "react";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const numbersOnly = value.replace(/[^0-9+]/g, "");
      const maxLength = numbersOnly.startsWith("+") ? 13 : 10;

      if (numbersOnly.length <= maxLength) {
        setFormData({ ...formData, [name]: numbersOnly });
      }
      return; // Exit early so we don't run the default setter for phone numbers
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // ========== FRONTEND VALIDATIONS ==========
    if (!isLogin) {
      // 1. Phone Restriction: Must be a valid Kenyan number (+254 or 07/01 followed by 8 digits)
      const phoneRegex = /^(?:\+254|0)[17]\d{8}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
        setErrorMessage(
          "Please enter a valid phone number (e.g., 0712345678 or +254712345678)",
        );
        return; // Stops the form from submitting!
      }

      // 2. UPDATED PASSWORD RESTRICTIONS
      const password = formData.password;
      if (password.length < 8) {
        setErrorMessage("Password must be at least 8 characters long.");
        return;
      }
      if (!/[A-Z]/.test(password)) {
        setErrorMessage("Password needs at least one uppercase letter (A-Z).");
        return;
      }
      if (!/\d/.test(password)) {
        setErrorMessage("Password needs at least one number (0-9).");
        return;
      }
    }

    // 3. Email Restriction: Basic format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    // ==========================================

    setIsLoading(true);

    // Determine if we are hitting the login or register route
    const endpoint = isLogin ? "/api/users/login" : "/api/users/register";
    const API_BASE = "http://localhost:5001"; // Update if your port is different

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
  localStorage.setItem("userToken", data.token);
  localStorage.setItem("userName", data.name || formData.name);
  localStorage.setItem("userRole", data.role || "user");

  if (data.role === "admin") {
    localStorage.setItem("adminToken", data.token);
    window.location.href = "/admin";
  } else {
    window.location.href = "/booking";
  }
} else { 
        setErrorMessage(
          data.error || "Authentication failed. Please try again.",
        );
      }
    } catch (error) {
      setErrorMessage("Server connection error. Is the backend running?");
    } finally {
      setIsLoading(false);
    }
  };

return (
    <div className="min-h-screen bg-pink-50/30 py-12 px-4 flex items-center justify-center">
      {/* 1. Added 'relative' and 'overflow-hidden' to this container */}
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl border border-pink-100 p-8 md:p-10 animate-in fade-in zoom-in duration-500 relative overflow-hidden">
        
        {/* 2. THE NEW LUXURY LOADING OVERLAY */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-in fade-in duration-300">
            <div className="w-12 h-12 border-4 border-pink-100 border-t-pink-500 rounded-full animate-spin mb-4 shadow-sm"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-pink-500 animate-pulse">
              {isLogin ? "Authenticating..." : "Creating account..."}
            </p>
          </div>
        )}

        {/* Logo / Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mb-4 border-2 border-pink-200">
            <span className="text-2xl">✨</span>
          </div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900 text-center">
            {isLogin ? "Welcome" : "Join Glow"}
          </h2>
          <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">
            {isLogin
              ? "Sign in to book & pay"
              : "Create an account to secure your spot"}
          </p>
        </div>

        {/* The Toggle Switch */}
        <div className="flex bg-gray-50 rounded-full p-1 mb-8 border border-gray-100 shadow-inner">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setErrorMessage("");
            }}
            className={`flex-1 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
              isLogin
                ? "bg-white text-pink-600 shadow-md"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setErrorMessage("");
            }}
            className={`flex-1 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
              !isLogin
                ? "bg-white text-pink-600 shadow-md"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Only show Name and Phone if they are Registering */}
          {!isLogin && (
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-pink-400 ml-4">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required={!isLogin}
                  placeholder="Lauryin Boke"
                  className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-pink-300 text-sm font-medium"
                  onChange={handleChange}
                  value={formData.name}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-pink-400 ml-4">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  required={!isLogin}
                  placeholder="e.g 07xxxxxxxx"
                  className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-pink-300 text-sm font-medium"
                  onChange={handleChange}
                  value={formData.phone}
                />
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-pink-400 ml-4">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="email@example.com"
              className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-pink-300 text-sm font-medium"
              onChange={handleChange}
              value={formData.email}
            />
          </div>

          <div className="space-y-1 relative">
            <label className="text-[10px] font-black uppercase text-pink-400 ml-4">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="••••••••"
                className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-pink-300 text-sm font-medium pr-12"
                onChange={handleChange}
                value={formData.password}
              />
              {/* THE EYE TOGGLE */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-600 transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="bg-red-50 text-red-600 p-3 rounded-2xl text-[11px] font-bold text-center animate-pulse">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-neutral-800 shadow-xl mt-6 transition-all active:scale-95 disabled:opacity-50 flex justify-center items-center cursor-pointer"
          >
            {isLoading
              ? "Processing..."
              : isLogin
                ? "Access Account"
                : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
