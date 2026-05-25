// src/components/servicos/ServicosAgendadosPage.js

import React, { useEffect, useState } from "react";
import api from "../../api";
import { toast } from "sonner";

import {
  Plus,
  Search,
} from "lucide-react";

import ServicosAgendadosForm from "./ServicosAgendadosForm";
import ServicosAgendadosList from "./ServicosAgendadosList";

const ServicosAgendadosPage = () => {

  const [agendamentos, setAgendamentos] = useState([]);

  const [mostrarForm, setMostrarForm] = useState(false);

  const [search, setSearch] = useState("");

  const [agendamentoEditando, setAgendamentoEditando] =
    useState(null);

  // ---------------- BUSCAR AGENDAMENTOS ----------------
  const fetchAgendamentos = async () => {

    try {

const res = await api.get(
  "/servicos-agendados"
);

      setAgendamentos(res.data);

    } catch (err) {

      console.error(err);

      toast.error(
        "Erro ao carregar serviços agendados."
      );
    }
  };

  useEffect(() => {
    fetchAgendamentos();
  }, []);

  // ---------------- FILTRO PESQUISA ----------------
  const agendamentosFiltrados =
    agendamentos.filter((ag) =>
      ag.servico?.nome
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

  // ---------------- SUCESSO ----------------
  const handleSuccess = () => {

    setMostrarForm(false);

    setAgendamentoEditando(null);

    fetchAgendamentos();
  };

  // ---------------- NOVO ----------------
  const handleNovoAgendamento = () => {

    setAgendamentoEditando(null);

    setMostrarForm(true);
  };

  // ---------------- EDITAR ----------------
  const handleEdit = (agendamento) => {

    setAgendamentoEditando(agendamento);

    setMostrarForm(true);
  };

  // ---------------- ELIMINAR ----------------
  const handleDelete = async (id) => {

    if (
      !window.confirm(
        "Deseja eliminar este agendamento?"
      )
    ) {
      return;
    }

    try {

await api.delete(
  `/servicos-agendados/${id}`
);

      toast.success(
        "Agendamento eliminado com sucesso!"
      );

      fetchAgendamentos();

    } catch (err) {

      console.error(err);

      toast.error(
        "Erro ao eliminar agendamento."
      );
    }
  };

  return (

    <div className="space-y-8">

      {/* HEADER PREMIUM */}
      <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/40 shadow-2xl">

        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

          {/* ESQUERDA */}
          <div>

            <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">

              Serviços Agendados

            </h1>

            <p className="text-slate-600 mt-2">
              Gestão completa de serviços agendados.
            </p>

            {!mostrarForm && (

              <p className="text-sm text-slate-500 mt-3 font-medium">

                {agendamentosFiltrados.length} registos encontrados

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
                  placeholder="Pesquisar agendamento..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="w-full pl-12 pr-4 py-4 bg-white/70 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 shadow-lg"
                />

              </div>

              {/* BOTÃO */}
              <button
                onClick={handleNovoAgendamento}
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-xl"
              >

                <Plus size={20} />

                Novo Agendamento

              </button>

            </div>

          )}

        </div>

      </div>

      {/* FORMULÁRIO */}
      {mostrarForm ? (

        <ServicosAgendadosForm
          agendamentoEditando={agendamentoEditando}
          onSuccess={handleSuccess}
          onCancel={() => {
            setMostrarForm(false);
            setAgendamentoEditando(null);
          }}
        />

      ) : (

        <ServicosAgendadosList
          agendamentos={agendamentosFiltrados}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />

      )}

    </div>
  );
};

export default ServicosAgendadosPage;
