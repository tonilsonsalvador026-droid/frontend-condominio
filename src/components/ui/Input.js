import React from "react";

const Input = ({
  placeholder,
  value,
  onChange,
  type = "text",
  className = "",
  id,
}) => {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border border-gray-300 p-2 rounded ${className}`}
    />
  );
};

export default Input;