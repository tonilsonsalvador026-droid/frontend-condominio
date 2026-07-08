import React, { useState } from "react";
import { Bell } from "lucide-react";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);

  // temporário
  const notificacoes = [];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="
          relative
          p-2
          rounded-xl
          hover:bg-indigo-600
          transition
        "
      >
        <Bell size={20} />

        {notificacoes.length > 0 && (
          <span
            className="
              absolute
              -top-1
              -right-1
              w-5
              h-5
              rounded-full
              bg-red-500
              text-white
              text-xs
              flex
              items-center
              justify-center
            "
          >
            {notificacoes.length}
          </span>
        )}
      </button>

      {open && (
        <div
          className="
            absolute
            right-0
            mt-2
            w-80
            bg-white
            rounded-2xl
            shadow-2xl
            border
            border-slate-200
            overflow-hidden
            z-50
          "
        >
          <div className="p-4 border-b">
            <h3 className="font-bold text-slate-800">
              Notificações
            </h3>
          </div>

          {notificacoes.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              Não existem notificações.
            </div>
          ) : (
            <div>
              {/* notificações virão aqui */}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
