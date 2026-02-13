import React from "react";

const PageHeader = ({
  title,
  subtitle,
  search,
  setSearch,
  placeholder = "Pesquisar..."
}) => {
  return (
    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-6">

      <div>
        <h2 className="text-2xl font-semibold text-gray-800">
          {title}
        </h2>
        <p className="text-sm text-gray-500">
          {subtitle}
        </p>
      </div>

      {setSearch && (
        <div className="w-full xl:w-80">
          <input
            type="text"
            placeholder={placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200 outline-none"
          />
        </div>
      )}

    </div>
  );
};

export default PageHeader;
