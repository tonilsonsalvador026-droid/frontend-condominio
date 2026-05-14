// src/components/servicos/ServicosPage.js

import React, { useEffect, useState } from "react";
import api from "../../api";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import ServicosExtrasForm from "./ServicosExtrasForm";
import ServicosExtrasList from "./ServicosExtrasList";

const ServicosPage = () => {
  const [servicos, setServicos] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    valor: "",
  });

  // Buscar serviços
  const fetchServicos = async () => {
    try {
      const res = await api.get("/servicos-extras");
      setServicos(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar serviços.");
    }
  };

  useEffect(() => {
    fetchServicos();
  }, []);

  // Salvar serviço
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/servicos-extras", {
        ...formData,
        valor: Number(formData.valor),
      });

      toast.success("Serviço criado com sucesso!");

      setFormData({
        nome: "",
        descricao: "",
        valor: "",
      });

      setMostrarForm(false);

      fetchServicos();

    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar serviço.");
    }
  };

  // Eliminar serviço
  const handleDelete = async (id) => {
    if (!window.confirm("Deseja eliminar este serviço?")) return;

    try {
      await api.delete(`/servicos-extras/${id}`);

      toast.success("Serviço eliminado com sucesso!");

      fetchServicos();

    } catch (err) {
      console.error(err);
      toast.error("Erro ao eliminar serviço.");
    }
  };

 return (
  <div className="space-y-8">

    {/* HEADER PREMIUM */}
    <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/40 shadow-2xl">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
            Serviços Extras
          </h1>

          <p className="text-slate-600 mt-2">
            Gestão completa de serviços extras.
          </p>
        </div>

        {!mostrarForm && (
          <button
            onClick={() => setMostrarForm(true)}
            className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-bold"
          >
            <Plus size={20} />
            Novo Serviço
          </button>
        )}

      </div>

    </div>

        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
            Serviços Extras
          </h1>

          <p className="text-slate-600 mt-2">
            Gestão completa de serviços extras.
          </p>
        </div>

        {!mostrarForm && (
          <button
            onClick={() => setMostrarForm(true)}
            className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-bold"
          >
            <Plus size={20} />
            Novo Serviço
          </button>
        )}

      </div>

      {/* FORMULÁRIO */}
      {mostrarForm ? (
        <ServicosExtrasForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          onCancel={() => setMostrarForm(false)}
        />
      ) : (
        <ServicosExtrasList
          servicos={servicos}
          onDelete={handleDelete}
        />
      )}

    </div>
  );
};

export default ServicosPage;
