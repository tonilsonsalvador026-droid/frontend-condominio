// src/components/ui/Button.js
import React from 'react';

const Button = ({
  children,
  onClick,
  className = '',
  disabled,
  type = 'button',
  variant = 'default'
}) => {
  const baseStyle = "font-bold py-2 px-4 rounded";
  const variants = {
    default: "bg-blue-500 text-white",
    outline: "border border-blue-500 text-blue-500 bg-white hover:bg-blue-100",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;