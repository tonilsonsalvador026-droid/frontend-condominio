import React, { useEffect, useState } from "react";
import api from "../../api";
import { toast } from "sonner";

import {
  Plus,
  Search,
} from "lucide-react";

import EventosForm from "./EventosForm";
import EventosList from "./EventosList";

const EventosPage = () => {

  const [eventos, setEventos] = useState([]);

  const [mostrarForm, setMostrarForm] =
    useState(false);

  const [search, setSearch] = useState("");

  const [eventoEditando, setEventoEditando] =
    useState(null);

  // ---------------- FETCH ----------------
  const fetchEventos = async () => {

    try {

      const res = await api.get("/eventos");

      setEventos(res.data);

    } catch (err) {

      console.error(err);

      toast.error(
        "Erro ao carregar eventos."
      );
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  // ---------------- FILTRO ----------------
  const eventosFiltrados = eventos.filter(
    (ev) =>
      ev.titulo
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  // ---------------- SUCCESS ----------------
  const handleSuccess = () => {

    setMostrarForm(false);

    setEventoEditando(null);

    fetchEventos();
  };

  // ---------------- NOVO ----------------
  const handleNovo = () => {

    setEventoEditando(null);

    setMostrarForm(true);
  };

  // ---------------- EDIT ----------------
  const handleEdit = (evento) => {

    setEventoEditando(evento);

    setMostrarForm(true);
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (id) => {

    if (
      !window.confirm(
        "Deseja eliminar este evento?"
      )
    ) {
      return;
    }

    try {

      await api.delete(`/eventos/${id}`);

      toast.success(
        "Evento eliminado com sucesso!"
      );

      fetchEventos();

    } catch (err) {

      console.error(err);

      toast.error(
        "Erro ao eliminar evento."
      );
    }
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/40 shadow-2xl">

        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

          {/* ESQUERDA */}
          <div>

            <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
              Eventos
            </h1>

            <p className="text-slate-600 mt-2">
              Gestão completa de eventos.
            </p>

            {!mostrarForm && (
              <p className="text-sm text-slate-500 mt-3 font-medium">
                {eventosFiltrados.length} registos encontrados
              </p>
            )}

          </div>

          {/* DIREITA */}
          {!mostrarForm && (

            <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">

              {/* PESQUISA */}
              <div className="relative w-full xl:w-80">

                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  placeholder="Pesquisar evento..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="w-full pl-12 pr-4 py-4 bg-white/70 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 shadow-lg"
                />

              </div>

              {/* BOTÃO */}
              <button
                onClick={handleNovo}
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-xl"
              >

                <Plus size={20} />

                Novo Evento

              </button>

            </div>
          )}

        </div>

      </div>

      {/* FORM */}
      {mostrarForm ? (

        <EventosForm
          eventoEditando={eventoEditando}
          onSuccess={handleSuccess}
          onCancel={() => {
            setMostrarForm(false);
            setEventoEditando(null);
          }}
        />

      ) : (

        <EventosList
          eventos={eventosFiltrados}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />

      )}

    </div>
  );
};

export default EventosPage;
