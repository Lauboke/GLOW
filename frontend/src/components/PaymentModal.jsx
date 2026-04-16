import React, { useState } from "react";
import toast from "react-hot-toast";

const PaymentModal = ({ amount, email, phone, onSuccess, onCancel }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);

    // Simulating a backend payment request taking 3 seconds
    try {
      console.log(`Processing payment of KES ${amount} for ${phone}...`);
      await new Promise((resolve) => setTimeout(resolve, 3000)); 
      
      onSuccess(); // Triggers the success screen on the Booking Page
    } catch (error) {
      console.error("Payment failed", error);
      setIsProcessing(false);
      toast.error("Payment failed. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-[2rem] shadow-2xl max-w-sm w-full p-8 animate-fade-in text-center border border-pink-100">
        <h3 className="text-2xl font-black italic uppercase text-gray-900 mb-2">
          Secure Your Slot
        </h3>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
          Deposit Required
        </p>

        <div className="bg-pink-50 rounded-2xl p-6 mb-8">
          <p className="text-sm font-medium text-gray-600 mb-1">Total to Pay</p>
          <p className="text-3xl font-black text-pink-500">KES {amount}</p>
          <p className="text-[10px] text-gray-400 mt-2">
            Payment link will be sent to {phone}
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs shadow-md transition-all ${
              isProcessing
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-pink-500 text-white hover:bg-pink-600"
            }`}
          >
            {isProcessing ? "Processing..." : "Pay Now"}
          </button>
          
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs text-gray-400 hover:text-red-500 bg-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;