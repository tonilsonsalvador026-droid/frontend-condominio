import React, { useEffect, useState } from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import api from "../../api";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notificacoes, setNotificacoes] = useState([]);

  const carregarNotificacoes = async () => {
    try {
      const res = await api.get("/notificacoes");
      setNotificacoes(res.data);
    } catch (err) {
      console.error("Erro ao carregar notificações:", err);
    }
  };

  useEffect(() => {
    carregarNotificacoes();

    const intervalo = setInterval(() => {
      carregarNotificacoes();
    }, 30000);

    return () => clearInterval(intervalo);
  }, []);

  const naoLidas = notificacoes.filter((n) => !n.lida).length;

  const marcarComoLida = async (id) => {
    try {
      await api.put(`/notificacoes/${id}/lida`);
      carregarNotificacoes();
    } catch (err) {
      console.error(err);
    }
  };

  const marcarTodas = async () => {
    try {
      await api.put("/notificacoes/lidas");
      carregarNotificacoes();
    } catch (err) {
      console.error(err);
    }
  };

  const eliminar = async (id) => {
    try {
      await api.delete(`/notificacoes/${id}`);
      carregarNotificacoes();
    } catch (err) {
      console.error(err);
    }
  };

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
        <Bell size={22} />

        {naoLidas > 0 && (
          <span
            className="
              absolute
              -top-1
              -right-1
              bg-red-600
              text-white
              text-[10px]
              rounded-full
              min-w-[18px]
              h-[18px]
              flex
              items-center
              justify-center
              font-bold
            "
          >
            {naoLidas}
          </span>
        )}
      </button>

      {open && (
        <div
          className="
            absolute
            right-0
            mt-3
            w-[380px]
            max-h-[500px]
            overflow-y-auto
            bg-white
            rounded-2xl
            shadow-2xl
            border
            border-slate-200
            z-50
          "
        >
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-bold text-slate-800">
              Notificações
            </h3>

            {notificacoes.length > 0 && (
              <button
                onClick={marcarTodas}
                className="
                  text-xs
                  text-indigo-600
                  hover:text-indigo-800
                "
              >
                Marcar todas
              </button>
            )}
          </div>

          {notificacoes.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              Nenhuma notificação.
            </div>
          ) : (
            notificacoes.map((n) => (
              <div
                key={n.id}
                className={`
                  p-4
                  border-b
                  hover:bg-slate-50
                  transition
                  ${!n.lida ? "bg-blue-50" : ""}
                `}
              >
                <div className="flex justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800">
                      {n.titulo}
                    </h4>

                    {n.descricao && (
                      <p className="text-sm text-slate-500 mt-1">
                        {n.descricao}
                      </p>
                    )}

                    <span className="text-xs text-slate-400">
                      {new Date(
                        n.criadoEm
                      ).toLocaleString("pt-PT")}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {!n.lida && (
                      <button
                        onClick={() =>
                          marcarComoLida(n.id)
                        }
                        className="text-green-600"
                      >
                        <Check size={18} />
                      </button>
                    )}

                    <button
                      onClick={() =>
                        eliminar(n.id)
                      }
                      className="text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
