import React from "react";
import { Search } from "lucide-react";

const SearchBar = () => {
  return (
    <div
      className="
        hidden
        lg:flex
        items-center
        bg-white/15
        border
        border-white/20
        rounded-2xl
        px-4
        py-2
        min-w-[300px]
        backdrop-blur-md
      "
    >
      <Search
        size={18}
        className="text-white/70 mr-3"
      />

      <input
        type="text"
        placeholder="Pesquisar..."
        className="
          bg-transparent
          outline-none
          border-none
          text-white
          placeholder:text-white/60
          w-full
        "
      />
    </div>
  );
};

export default SearchBar;
