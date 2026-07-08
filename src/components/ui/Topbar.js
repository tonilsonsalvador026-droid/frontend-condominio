// src/components/ui/Topbar.js
import React from "react";
import { Menu } from "lucide-react";

import SearchBar from "./topbar/SearchBar";
import NotificationBell from "./topbar/NotificationBell";
import Languageselector from "./topbar/Languageselector";
import UserMenu from "./topbar/UserMenu";

const Topbar = ({ onToggleSidebar }) => {
  return (
    <header
      className="
        fixed
        top-0
        left-0
        md:left-72
        right-0
        h-16
        bg-indigo-700
        text-white
        flex
        items-center
        justify-between
        px-4
        md:px-6
        shadow-md
        z-40
      "
    >
      {/* Lado esquerdo */}
      <div className="flex items-center gap-4">
        {/* Botão menu */}
        <button
          onClick={onToggleSidebar}
          className="
            p-2
            rounded-xl
            hover:bg-indigo-600
            transition
          "
        >
          <Menu size={22} />
        </button>

        <span className="font-semibold text-lg hidden sm:block">
          Painel Principal
        </span>

        {/* Pesquisa */}
        <div className="hidden lg:block">
          <SearchBar />
        </div>
      </div>

      {/* Lado direito */}
      <div className="flex items-center gap-3">
        <Languageselector />

        <NotificationBell />

        <UserMenu />
      </div>
    </header>
  );
};

export default Topbar;
