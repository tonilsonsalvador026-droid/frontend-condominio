import React, { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  User,
  Settings,
  Power,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Avatar from "./Avatar";

const UserMenu = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const menuRef = useRef(null);

  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/", {
      replace: true,
    });
  };

  return (
    <div
      ref={menuRef}
      className="relative"
    >
      <button
        onClick={() => setOpen(!open)}
        className="
        flex
        items-center
        gap-3
        px-3
        py-2
        rounded-xl
        hover:bg-indigo-600
        transition
        "
      >
        <Avatar
          nome={user.nome}
          foto={user.foto}
          size={42}
        />

        <div className="hidden md:flex flex-col items-start leading-tight">
          <span className="font-semibold text-sm">
            {user.nome || "Utilizador"}
          </span>

          <span className="text-xs text-indigo-100">
            {user.role || "Sem Função"}
          </span>
        </div>

        <ChevronDown
          size={18}
        />
      </button>

      {open && (
        <div
          className="
          absolute
          right-0
          mt-3
          w-72
          bg-white text-slate-800
          rounded-2xl
          shadow-2xl
          overflow-hidden
          border
          border-slate-200
          "
        >
          <div className="p-5 border-b">
            <div className="flex gap-3 items-center">
              <Avatar
                nome={user.nome}
                foto={user.foto}
                size={54}
              />

              <div>
                <h3 className="font-bold text-slate-800">
                  {user.nome}
                </h3>

                <p className="text-sm text-slate-500">
                  {user.email}
                </p>

                <span className="text-xs text-indigo-600 font-semibold">
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/perfil")}
            className="
w-full
flex
items-center
gap-3
px-5
py-3
text-slate-700
hover:bg-slate-100
transition
"
          >
            <User size={18} />
            Perfil
          </button>

          <button
            className="
w-full
flex
items-center
gap-3
px-5
py-3
text-slate-700
hover:bg-slate-100
transition
"
          >
            <Settings size={18} />
            Configurações
          </button>

          <div className="border-t" />

          <button
            onClick={logout}
            className="
            w-full
            flex
            items-center
            gap-3
            px-5
            py-3
            text-red-600
            hover:bg-red-50
            transition
            "
          >
            <Power size={18} />
            Terminar Sessão
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
