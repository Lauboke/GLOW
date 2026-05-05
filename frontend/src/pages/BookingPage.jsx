import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Added for navigation
import toast from "react-hot-toast"; // Added for notifications
import AuthRequiredModal from "../components/AuthRequiredModal";
import LoadingOverlay from "../components/LoadingOverlay";
import { getAutofillUser } from "../utils/getAutofillUser";

const BookingPage = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showPaymentUI, setShowPaymentUI] = useState(false);
  const [mpesaCode, setMpesaCode] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
const [paymentMessage, setPaymentMessage] = useState("");

const [paymentId, setPaymentId] = useState("");
const [paymentStatus, setPaymentStatus] = useState("");
const [paymentReceipt, setPaymentReceipt] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    lookId: "",
    date: "",
    time: "",
    employeeName: "",
    completed: false,
  });

  useEffect(() => {
  let isMounted = true;

  const autofillUser = async () => {
    const user = await getAutofillUser();

    if (!isMounted || !user) return;

    setFormData((prev) => ({
      ...prev,
      name: prev.name || user.name,
      email: prev.email || user.email,
      phone: prev.phone || user.phone,
    }));
  };

  autofillUser();

  return () => {
    isMounted = false;
  };
}, []);

  const [availability, setAvailability] = useState({
    slotsRemaining: 5,
    takenTimes: [],
    isFull: false,
  });

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (formData.date) {
      fetch(`http://localhost:5001/api/bookings/check?date=${formData.date}`)
        .then((res) => res.json())
        .then((data) => setAvailability(data))
        .catch((err) => console.error("Database connection failed:", err));
    }
  }, [formData.date]);

  useEffect(() => {
    const savedID = localStorage.getItem("selectedLookID");
    const savedTitle = localStorage.getItem("selectedLookTitle");
    const savedPrice = localStorage.getItem("selectedLookPrice");
    const savedCategory = localStorage.getItem("selectedCategory");

    if (savedID) {
      setFormData((prev) => ({
        ...prev,
        service: savedCategory,
        lookId: savedID,
      }));
      setSelectedTitle(savedTitle);
      setSelectedPrice(savedPrice);
    }
  }, []);

  useEffect(() => {
    const savedFormString = localStorage.getItem("savedFormData");
    if (savedFormString) {
      const parsedForm = JSON.parse(savedFormString);
      setFormData(parsedForm);
      const savedTitle = localStorage.getItem("savedSelectedTitle");
      const savedPrice = localStorage.getItem("savedSelectedPrice");
      if (savedTitle) setSelectedTitle(savedTitle);
      if (savedPrice) setSelectedPrice(savedPrice);
      localStorage.removeItem("savedFormData");
      localStorage.removeItem("savedSelectedTitle");
      localStorage.removeItem("savedSelectedPrice");
    }
  }, []);

const formatPhoneForMpesa = (phone) => {
  let cleaned = phone.replace(/\D/g, "");

  // Handles cases like +2540714749302
  if (cleaned.startsWith("2540")) {
    cleaned = `254${cleaned.slice(4)}`;
  }

  // Handles 0714749302
  if (cleaned.startsWith("0")) {
    cleaned = `254${cleaned.slice(1)}`;
  }

  // Handles 714749302
  if (cleaned.startsWith("7") || cleaned.startsWith("1")) {
    cleaned = `254${cleaned}`;
  }

  return cleaned;
};

const sendMpesaPrompt = async () => {
  try {
    setPaymentLoading(true);
    setPaymentMessage("");

    const formattedPhone = formatPhoneForMpesa(formData.phone);

    if (!/^254(7|1)\d{8}$/.test(formattedPhone)) {
      toast.error("Please enter a valid Safaricom number.");
      return false;
    }

    const res = await fetch("http://localhost:5001/api/mpesa/stk-push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: formattedPhone,
        amount: 1,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to send M-Pesa prompt.");
    }

    setPaymentId(data.paymentId);
setPaymentStatus("pending");

setPaymentMessage(
  "M-Pesa prompt sent. Please check your phone and enter your PIN."
);

toast.success("M-Pesa prompt sent to your phone.");
return data.paymentId;
  } catch (error) {
    console.error("M-Pesa payment error:", error);
    toast.error(error.message || "Failed to send M-Pesa prompt.");
    setPaymentMessage("Failed to send M-Pesa prompt. Please try again.");
    return false;
  } finally {
    setPaymentLoading(false);
  }
};

const checkPaymentStatus = async (id = paymentId) => {
  if (!id) return null;

  try {
    const res = await fetch(`http://localhost:5001/api/mpesa/status/${id}`);
    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to check payment status.");
    }

    setPaymentStatus(data.status);

    if (data.receipt) {
      setPaymentReceipt(data.receipt);
    }

    return data;
  } catch (error) {
    console.error("Payment status check error:", error);
    return null;
  }
};

const handleRetryPayment = async () => {
  setPaymentId("");
  setPaymentStatus("");
  setPaymentReceipt("");
  setPaymentMessage("Sending a new M-Pesa prompt...");

  const newPaymentId = await sendMpesaPrompt();

  if (newPaymentId) {
    setShowPaymentUI(true);
  }
};

const submitPaidBooking = async (receiptNumber) => {
  const userToken = localStorage.getItem("userToken");

  const finalBookingData = {
    ...formData,
    service: selectedTitle || formData.service,
    price: selectedPrice,
    mpesaCode: receiptNumber,
    paymentStatus: "paid",
    paymentId: paymentId,
  };

  try {
    const res = await fetch("http://localhost:5001/api/bookings/reserve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(finalBookingData),
    });

    if (res.ok) {
      toast.success("Payment confirmed. Booking completed successfully!");
      setSubmitted(true);
      localStorage.removeItem("selectedLookID");
    } else {
      const errorData = await res.json();
      toast.error(errorData.message || "Booking failed after payment.");
    }
  } catch (err) {
    toast.error("Server error while confirming booking.");
  }
};

useEffect(() => {
  if (!paymentId || paymentStatus !== "pending") return;

  const interval = setInterval(async () => {
    const payment = await checkPaymentStatus(paymentId);

    if (payment?.status === "paid") {
  clearInterval(interval);

  setPaymentMessage(
    `Payment confirmed successfully. Receipt: ${payment.receipt}`
  );

  toast.success("Payment confirmed automatically.");

  await submitPaidBooking(payment.receipt);
}

    if (payment?.status === "failed") {
      clearInterval(interval);
      setPaymentMessage("Payment failed. Please try again.");
      toast.error("Payment failed.");
    }

    if (payment?.status === "cancelled") {
      clearInterval(interval);
      setPaymentMessage("Payment was cancelled.");
      toast.error("Payment was cancelled.");
    }
  }, 3000);

  return () => clearInterval(interval);
}, [paymentId, paymentStatus]);

  // --- STEP 1: VALIDATION BEFORE PAYMENT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const userToken = localStorage.getItem("userToken");
    if (!userToken) {
      setShowAuthModal(true);
      return;
    }

    const hour = parseInt(formData.time.split(":")[0]);
    if (hour < 8 || hour >= 17) {
      setErrorMessage("Please select a time between 08:00 and 17:00. ✨");
      return;
    }

    if (
      availability.isFull ||
      availability.takenTimes.includes(formData.time)
    ) {
      setErrorMessage("This slot is no longer available. Please pick another!");
      return;
    }

        // If everything is valid, send STK Push first
    const newPaymentId = await sendMpesaPrompt();

if (newPaymentId) {
  setShowPaymentUI(true);
}
  };

  // --- STEP 2: FINAL SUBMISSION WITH MPESA CODE ---
  const handleFinalBooking = async () => {
    if (!mpesaCode) {
      toast.error("Please enter your M-Pesa transaction code.");
      return;
    }

    const userToken = localStorage.getItem("userToken");
    const finalBookingData = {
      ...formData,
      service: selectedTitle || formData.service,
      price: selectedPrice,
      mpesaCode: mpesaCode.toUpperCase(),
      paymentStatus: "pending_verification",
    };

    try {
      const res = await fetch("http://localhost:5001/api/bookings/reserve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(finalBookingData),
      });

      if (res.ok) {
        toast.success("Booking Received! We'll verify your payment shortly.");
        setSubmitted(true);
        // Clear sensitive local storage
        localStorage.removeItem("selectedLookID");
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Something went wrong.");
      }
    } catch (err) {
      toast.error("Server error. Please try again later.");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4 text-center">
        <div className="space-y-6">
          <h2 className="text-4xl font-black italic uppercase text-gray-900">
            You're all set!
          </h2>
          <p className="text-gray-500">
            We've received your booking and M-Pesa code. See you soon!
          </p>
          <button
            onClick={() => (window.location.href = "/profile")}
            className="mt-8 border-b-2 border-pink-500 font-bold uppercase text-xs text-pink-600"
          >
            View My Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcf8fb] px-4 py-10 md:px-6 md:py-14">
      <div className="max-w-2xl mx-auto w-full bg-white rounded-[3rem] shadow-[0_25px_80px_rgba(0,0,0,0.08)] border border-pink-100/70 p-8 md:p-12 lg:p-14 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-pink-100/40 via-transparent to-pink-100/30 pointer-events-none" />
<div className="absolute -top-12 -right-10 w-36 h-36 bg-pink-100/40 rounded-full blur-3xl pointer-events-none" />
<div className="absolute -bottom-16 -left-10 w-32 h-32 bg-black/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 text-center mb-10">
  <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-gray-900">
    Book Your Glow
  </h2>
  <p className="text-sm text-gray-400 font-medium mt-3">
    Secure your appointment in a few steps.
  </p>
</div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          {selectedTitle && (
  <div className="rounded-[2rem] border border-pink-100 bg-gradient-to-r from-pink-50 to-white p-5 md:p-6 shadow-sm">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-pink-500 mb-2">
          Selected Look
        </p>
        <h4 className="text-lg font-black uppercase italic tracking-tight text-gray-900">
          {selectedTitle}
        </h4>
        <p className="mt-2 text-sm font-bold text-gray-500">
          Estimated Price{" "}
          <span className="text-pink-600 font-black">KES {selectedPrice}</span>
        </p>
      </div>

      <button
        type="button"
        onClick={() => {
          setFormData({ ...formData, lookId: "", service: "" });
          setSelectedTitle("");
          setSelectedPrice("");
          localStorage.clear();
        }}
        className="shrink-0 rounded-xl border border-gray-200 bg-white px-4 py-2 text-[9px] font-black uppercase tracking-[0.18em] text-gray-500 transition-all hover:text-red-500 hover:border-red-200"
      >
        Change
      </button>
    </div>
  </div>
)}

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-[0.18em] text-pink-500/90 ml-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Lauryin Boke"
              required
              className="w-full px-5 py-4 bg-[#fcfbfd] rounded-[1.4rem] border border-gray-100/90 outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-100/70 text-sm font-semibold text-gray-800 shadow-sm transition-all"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              value={formData.name}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-pink-400 ml-4">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="lauryin@example.com"
                className="w-full px-5 py-4 bg-[#fcfbfd] rounded-[1.4rem] border border-gray-100/90 outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-100/70 text-sm font-semibold text-gray-800 shadow-sm transition-all"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                value={formData.email}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-pink-400 ml-4">
                Phone Number
              </label>
              <input
                type="tel"
                required
                placeholder="e.g 07xxxxxxxx"
                maxLength="13"
                pattern="\+254[0-9]{9}"
                className="w-full px-5 py-4 bg-[#fcfbfd] rounded-[1.4rem] border border-gray-100/90 outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-100/70 text-sm font-semibold text-gray-800 shadow-sm transition-all"
                onChange={(e) => {
                  let value = e.target.value;
                  if (!value.startsWith("+254") && value.length > 0) {
                    value = "+254" + value.replace(/\D/g, "");
                  }
                  setFormData({ ...formData, phone: value });
                }}
                value={formData.phone}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-pink-400 ml-4">
                Date
              </label>
              <input
                type="date"
                required
                min={today}
                className="w-full px-5 py-4 bg-[#fcfbfd] rounded-[1.4rem] border border-gray-100/90 text-sm font-semibold text-gray-800 outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-100/70 shadow-sm transition-all"
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                value={formData.date}
              />
            </div>

<div className="space-y-1 relative">
              <label className="text-[10px] font-black uppercase text-pink-400 ml-4">Time Slot</label>
              <div className="relative">
                <select
                  required
                  className="w-full px-5 py-4 bg-[#fcfbfd] rounded-[1.4rem] border border-gray-100/90 text-sm font-semibold text-gray-800 outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-100/70 appearance-none cursor-pointer pr-12 shadow-sm transition-all"
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  value={formData.time}
                >
                  <option value="" disabled hidden>Pick a time...</option>
                  {["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"].map((slot) => (
                    <option key={slot} value={slot} disabled={availability.takenTimes.includes(slot)}>
                      {slot} {availability.takenTimes.includes(slot) ? "— 🚫 FULL" : "— ✨ AVAILABLE"}
                    </option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-pink-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-pink-400 ml-4">
              Glow Professionals
            </label>
            <select
              required
              className="w-full px-5 py-4 bg-[#fcfbfd] rounded-[1.4rem] border border-gray-100/90 text-sm font-semibold text-gray-800 outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-100/70 shadow-sm transition-all"
              onChange={(e) =>
                setFormData({ ...formData, employeeName: e.target.value })
              }
              value={formData.employeeName}
            >
              <option value="" disabled hidden>
                Choose your stylist...
              </option>
              <option value="Sarah">Sarah (Hair Specialist)</option>
              <option value="Jane">Jane (Nail Artist)</option>
              <option value="Joy">Joy (Makeup Artist)</option>
            </select>
          </div>

          {errorMessage && (
  <div className="rounded-[1.5rem] border border-red-100 bg-red-50 px-5 py-4 text-center text-xs font-bold text-red-600 shadow-sm">
    {errorMessage}
  </div>
)}

          <div className="mt-10 border-t border-gray-100 pt-8">
            {!showPaymentUI ? (
              <button
  type="submit"
  disabled={paymentLoading}
  className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-pink-500 transition-all shadow-lg disabled:opacity-60"
>
  {paymentLoading
    ? "Sending M-Pesa Prompt..."
    : `Confirm & Pay KES ${selectedPrice || "0"}`}
</button>
            ) : (
              <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                <div className="bg-pink-50 p-6 rounded-[2rem] border border-pink-100">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-pink-600 mb-4 text-center">
                    M-Pesa Pochi La Biashara
                  </h4>
                  <div className="text-center space-y-1 mb-6">
                    <p className="text-xs font-bold text-gray-500 uppercase">
                      Lipa na Pochi La Biashara to:
                    </p>
                    <p className="text-xl font-black text-gray-900">
                      0714 749 302
                    </p>
                    <p className="text-[10px] font-black text-pink-400 uppercase tracking-tighter">
                      (Lauryin Boke)
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 text-center">
  <p className="text-xs font-bold text-gray-600">
    {paymentMessage || "Waiting for M-Pesa confirmation..."}
  </p>

  {paymentStatus && (
    <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-pink-500">
      Status: {paymentStatus}
    </p>
  )}

  {paymentReceipt && (
    <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-green-600">
      Receipt: {paymentReceipt}
    </p>
  )}
</div>
                </div>

                <button
  type="button"
  onClick={
    paymentStatus === "cancelled" || paymentStatus === "failed"
      ? handleRetryPayment
      : () => checkPaymentStatus(paymentId)
  }
  disabled={paymentLoading || paymentStatus === "paid"}
  className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-pink-500 transition-all shadow-lg disabled:opacity-60"
>
  {paymentLoading
    ? "Sending M-Pesa Prompt..."
    : paymentStatus === "paid"
    ? "Booking Confirmed ✨"
    : paymentStatus === "cancelled" || paymentStatus === "failed"
    ? "Retry M-Pesa Payment"
    : "Check Payment Status"}
</button>
              </div>
            )}
          </div>
        </form>
      </div>

      {showAuthModal && (
        <AuthRequiredModal
          onClose={() => setShowAuthModal(false)}
          onLoginRedirect={() => {
            localStorage.setItem("savedFormData", JSON.stringify(formData));
            localStorage.setItem("savedSelectedTitle", selectedTitle);
            localStorage.setItem("savedSelectedPrice", selectedPrice);
            setShowAuthModal(false);
            setIsRedirecting(true);
            setTimeout(() => (window.location.href = "/login"), 900);
          }}
        />
      )}

      {isRedirecting && <LoadingOverlay />}
    </div>
  );
};

export default BookingPage;
