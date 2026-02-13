import React from "react";

const CardContainer = ({ children }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
      {children}
    </div>
  );
};

export default CardContainer;
