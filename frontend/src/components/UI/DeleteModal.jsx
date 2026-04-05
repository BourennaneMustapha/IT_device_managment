import React from "react";
import Button from "./Button";
import { X, AlertTriangle, Trash2, Loader2 } from "lucide-react";

export default function DeleteModal({
  onclose,
  message,
  deleteLoading,
  handledelet,
  icon,
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn">
      {/* Modal Container */}
      <div className="relative w-[450px] bg-white rounded-3xl shadow-2xl p-8 transform transition-all font-mono overflow-hidden">
        {/* Top Danger Accent Bar */}
        {/*<div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>*/}

        {/* Close Button */}
        <button
          data-analytics=""
          data-cta=""
          onClick={onclose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Content Section */}
        <div className="text-center mt-4">
          {/* Warning Icon Container */}
          <div className="inline-flex p-4 bg-red-50 rounded-2xl text-red-500 mb-6 border border-red-100">
            {(icon || <Trash2 size={32} strokeWidth={2.5} />)}
          </div>

          <h2 className="text-2xl font-black text-gray-800 mb-2">! Confirm</h2>

          <p className="text-gray-500 text-sm mb-8 px-4 leading-relaxed">
            {message ||
              "Are you sure you want to remove this item? This action is permanent and cannot be undone."}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="secondary"
              onClick={onclose}
              disabled={deleteLoading}
              className="flex-1 py-3 rounded-2xl border-2 border-gray-100 hover:bg-gray-50 text-gray-600 font-bold"
            >
              Non
            </Button>

            <Button
              onClick={handledelet}
              disabled={deleteLoading}
              variant="danger"
              className="flex-1 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black shadow-lg shadow-red-200 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {deleteLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Removing...
                </>
              ) : (
                "Oui, je suis sûr"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
