import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      {/* Previous */}
      <button
 data-analytics="" data-cta=""
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-full border border-slate-300 p-2 text-sm text-slate-600 transition-all
        hover:bg-[#295e61] hover:text-white
        disabled:opacity-50 disabled:pointer-events-none"
      >
        <ArrowLeft size={18} />
      </button>

      {/* Info */}
      <p className="text-sm text-slate-600">
        Page{" "}
        <strong className="text-slate-800">{currentPage}</strong> of{" "}
        <strong className="text-slate-800">{totalPages}</strong>
      </p>

      {/* Next */}
      <button
 data-analytics="" data-cta=""
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-full border border-slate-300 p-2 text-sm text-slate-600 transition-all
        hover:bg-[#295e61] hover:text-white
        disabled:opacity-50 disabled:pointer-events-none"
      >
        <ArrowRight size={18} />
      </button>
    </div>
  );
}


{/* Page Number Buttons */}

      {/* Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    if (totalPages <= 3) return true; // Show all if few pages
                    if (page <= 2 || page > totalPages - 2) return true; // first & last 2
                    if (Math.abs(page - currentPage) <= 1) return true; // around current
                    return false;
                  })
                  .map((page, idx, arr) => {
                    const prev = arr[idx - 1];
                    const showEllipsis = prev && page - prev > 1;
                    return (
                      <React.Fragment key={page}>
                        {showEllipsis && (
                          <span className="px-2 text-gray-500">...</span>
                        )}
                        <button
                          data-analytics=""
                          data-cta=""
                          onClick={() => handlePageChange(page)}
                          className={`rounded-md border border-slate-300 px-3 py-1 text-sm font-medium transition-all shadow-sm hover:bg-[#295e61] hover:text-white ${
                            currentPage === page
                              ? "bg-gradient-to-r from-[#295e61]  via-[#409195] to-[#98a7a3] text-white"
                              : "text-slate-700 bg-white"
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  })*/}