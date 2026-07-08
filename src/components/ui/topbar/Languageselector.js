import React from "react";
import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

const Languageselector = () => {
  const { i18n } = useTranslation();

  const mudarIdioma = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("idioma", lng);
  };

  return (
    <div className="relative group">
      <button
        className="
          p-2
          rounded-xl
          hover:bg-indigo-600
          transition
        "
      >
        <Languages size={20} />
      </button>

      <div
        className="
          absolute
          right-0
          mt-2
          w-44
          bg-white
          rounded-xl
          shadow-xl
          opacity-0
          invisible
          group-hover:opacity-100
          group-hover:visible
          transition-all
          z-50
        "
      >
        <button
          onClick={() => mudarIdioma("pt")}
          className="w-full text-left px-4 py-3 hover:bg-gray-100"
        >
          🇦🇴 Português
        </button>

        <button
          onClick={() => mudarIdioma("kmb")}
          className="w-full text-left px-4 py-3 hover:bg-gray-100"
        >
          🇦🇴 Kimbundu
        </button>

        <button
          onClick={() => mudarIdioma("umb")}
          className="w-full text-left px-4 py-3 hover:bg-gray-100"
        >
          🇦🇴 Umbundu
        </button>
      </div>
    </div>
  );
};

export default Languageselector;
