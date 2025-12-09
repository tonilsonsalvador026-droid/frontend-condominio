// src/components/ui/Badge.js
import React from "react";
import classNames from "classnames";

const Badge = ({ children, variant = "default", className = "" }) => {
  const baseStyles = "inline-block px-2 py-0.5 text-xs font-medium rounded-full";

  const variants = {
    default: "bg-gray-200 text-gray-800",
    success: "bg-green-200 text-green-800",
    warning: "bg-yellow-200 text-yellow-800",
    danger: "bg-red-200 text-red-800",
    info: "bg-blue-200 text-blue-800",
  };

  return (
    <span className={classNames(baseStyles, variants[variant], className)}>
      {children}
    </span>
  );
};

export default Badge;