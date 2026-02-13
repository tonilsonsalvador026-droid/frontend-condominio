import React from "react";

const CardContainer = ({ children }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 md:p-8">
      {children}
    </div>
  );
};

export default CardContainer;
