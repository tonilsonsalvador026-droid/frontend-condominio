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

      {/* Menu Dropdown - Corrigido com os espaços corretos e novas bordas */}
      <div
        className="
          absolute
          right-0
          mt-2
          w-48
          bg-white
          rounded-xl
          shadow-xl
          border
          border-slate-200
          overflow-hidden
          opacity-0
          invisible
          group-hover:opacity-100
          group-hover:visible
          transition-all
          z-50
        "
      >
        {/* Botão Português */}
        <button
          onClick={() => mudarIdioma("pt")}
          className="
            w-full
            px-4
            py-3
            text-left
            text-slate-700
            hover:bg-slate-100
            transition
          "
        >
          🇦🇴 Português
        </button>

        {/* Botão Kimbundu */}
        <button
          onClick={() => mudarIdioma("kmb")}
          className="
            w-full
            px-4
            py-3
            text-left
            text-slate-700
            hover:bg-slate-100
            transition
          "
        >
          🇦🇴 Kimbundu
        </button>

        {/* Botão Umbundu */}
        <button
          onClick={() => mudarIdioma("umb")}
          className="
            w-full
            px-4
            py-3
            text-left
            text-slate-700
            hover:bg-slate-100
            transition
          "
        >
          🇦🇴 Umbundu
        </button>
      </div>
    </div>
  );
};

export default Languageselector;
