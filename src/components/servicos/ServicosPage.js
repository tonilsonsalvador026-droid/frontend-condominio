// src/components/servicos/ServicosPage.js
import React, { useEffect, useState } from "react";
import api from "../../api";
import { toast } from "sonner";

import ServicosExtrasForm from "./ServicosExtrasForm";
import ServicosExtrasList from "./ServicosExtrasList";

import { Plus } from "lucide-react";

const ServicosPage = () => {
  const [servicos, setServicos] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [servicoEditando, setServicoEditando] = useState(null);

  // LISTAR SERVIÇOS
  const fetchServicos = async () => {
    try {
      const res = await api.get("/servicos-extras");
      setServicos(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar serviços extras");
    }
  };

  useEffect(() => {
    fetchServicos();
  }, []);

  // CRIAR OU EDITAR
  const handleSubmit = async (data) => {
    try {
      if (servicoEditando?.id) {
        await api.put(`/servicos-extras/${servicoEditando.id}`, data);
        toast.success("Serviço atualizado com sucesso!");
      } else {
        await api.post("/servicos-extras", data);
        toast.success("Serviço criado com sucesso!");
      }

      setMostrarForm(false);
      setServicoEditando(null);
      fetchServicos();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar serviço");
    }
  };

  // ELIMINAR
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja eliminar este serviço?")) return;

    try {
      await api.delete(`/servicos-extras/${id}`);
      toast.success("Serviço eliminado com sucesso!");
      fetchServicos();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao eliminar serviço");
    }
  };

  // EDITAR
  const handleEdit = (servico) => {
    setServicoEditando(servico);
    setMostrarForm(true);
  };

  // NOVO
  const handleNovo = () => {
    setServicoEditando(null);
    setMostrarForm(true);
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">

      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/40 shadow-2xl flex items-center justify-between">

          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
              Serviços Extras
            </h1>
            <p className="text-slate-600 mt-2">
              Gestão completa de serviços adicionais
            </p>
          </div>

          <button
            onClick={handleNovo}
            className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-bold hover:scale-105 transition"
          >
            <Plus size={18} />
            Novo Serviço
          </button>

        </div>

        {/* FORM */}
        {mostrarForm && (
          <ServicosExtrasForm
            onSuccess={() => {
              setMostrarForm(false);
              setServicoEditando(null);
              fetchServicos();
            }}
            onCancel={() => {
              setMostrarForm(false);
              setServicoEditando(null);
            }}
            servicoEditando={servicoEditando}
          />
        )}

        {/* LISTA */}
        <ServicosExtrasList
          servicos={servicos}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />

      </div>
    </div>
  );
};

export default ServicosPage;
