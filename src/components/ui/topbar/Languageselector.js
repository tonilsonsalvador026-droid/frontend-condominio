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
  onClick={() => i18n.changeLanguage("pt")}
  className="
    w-full
    px-4
    py-3
    flex
    items-center
    gap-3
    text-slate-700
    hover:bg-slate-100
    transition
  "
>
  <img
    src="https://flagcdn.com/ao.svg"
    alt="Angola"
    className="w-5 h-5 rounded-full"
  />

  <span>Português</span>
</button>

        {/* Botão Kimbundu */}
<button
  onClick={() => i18n.changeLanguage("kmb")}
  className="
    w-full
    px-4
    py-3
    flex
    items-center
    gap-3
    text-slate-700
    hover:bg-slate-100
    transition
  "
>
  <img
    src="https://flagcdn.com/ao.svg"
    alt="Angola"
    className="w-5 h-5 rounded-full"
  />

  <span>Kimbundu</span>
</button>

        {/* Botão Umbundu */}
<button
  onClick={() => i18n.changeLanguage("umb")}
  className="
    w-full
    px-4
    py-3
    flex
    items-center
    gap-3
    text-slate-700
    hover:bg-slate-100
    transition
  "
>
  <img
    src="https://flagcdn.com/ao.svg"
    alt="Angola"
    className="w-5 h-5 rounded-full"
  />

  <span>Umbundu</span>
</button>
      </div>
    </div>
  );
};

export default Languageselector;
