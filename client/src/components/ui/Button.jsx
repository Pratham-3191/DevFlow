import React from "react";

export default function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg",
    secondary:
      "bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-lg",
    outline:
      "border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50",
    ghost: "text-gray-700 hover:bg-gray-100",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-md",
  };

  const sizes = {
    sm: "px-3 py-1.5 gap-1.5",
    md: "px-4 py-2.5 gap-2",
    lg: "px-6 py-3 gap-2",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
