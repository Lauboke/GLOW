import React from "react";

// Notice we added 'onLoginRedirect' here
const AuthRequiredModal = ({ onClose, onLoginRedirect }) => {
  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-[2rem] shadow-2xl max-w-sm w-full p-8 animate-fade-in text-center border border-pink-100">
        <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
          ✨
        </div>
        <h3 className="text-2xl font-black italic uppercase text-gray-900 mb-2">
          Almost There!
        </h3>
        <p className="text-sm font-medium text-gray-500 mb-8">
          Create an account or log in to secure your time slot and complete your booking.
        </p>

        <div className="space-y-3">
          {/* We now trigger the custom function when they click this button */}
          <button
            onClick={onLoginRedirect}
            className="w-full bg-pink-500 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-pink-600 shadow-md transition-all"
          >
            Log In / Sign Up
          </button>
          
          <button
            onClick={onClose}
            className="w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs text-gray-400 hover:text-red-500 bg-white transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthRequiredModal;