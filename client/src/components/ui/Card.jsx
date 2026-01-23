import React from "react";

function Card({ children, className = "", hover = false }) {
  return (
    <div
      className={`
        bg-white rounded-xl shadow-sm border border-gray-200 
        ${hover ? "hover:shadow-lg transition-shadow duration-200" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default Card;
