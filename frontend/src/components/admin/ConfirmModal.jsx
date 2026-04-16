import React from "react";

const ConfirmModal = ({
  isOpen,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onClose,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-8">
        <h3 className="text-2xl font-black uppercase italic text-gray-900 mb-3">
          {title}
        </h3>

        <p className="text-sm text-gray-500 leading-relaxed mb-8">
          {message}
        </p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 rounded-xl bg-gray-50 text-gray-500 font-black uppercase text-[10px] tracking-widest hover:bg-gray-100 transition-all"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-6 py-3 rounded-xl bg-black text-white font-black uppercase text-[10px] tracking-widest hover:bg-red-500 transition-all disabled:opacity-50"
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;