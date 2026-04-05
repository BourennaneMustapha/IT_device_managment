import React from "react";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  icon: Icon,
  loading = false,
  disabled = false,
  fullWidth = false,
  className = "",
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200";
  const variants = {
    primary:
      "bg-green-500 text-white hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed",
    danger:
      "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed",
    outline:
      "border border-gray-400 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };
  return (
    <button
      data-analytics=""
      data-cta=""
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
    >
      {loading ? (
        <span className="animate-spin mr-2 border-2 border-t-transparent border-white rounded-full w-4 h-4"></span>
      ) : Icon ? (
        <Icon className="w-5 h-5 mr-2" />
      ) : null}

      {children}
    </button>
  );
}
