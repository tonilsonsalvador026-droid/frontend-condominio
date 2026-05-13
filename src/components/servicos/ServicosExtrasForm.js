// src/components/servicos/ServicosExtrasForm.js
import React, { useState, useEffect } from "react";
import api from "../../api";
import { toast } from "sonner";
import { Plus, Save, ChevronLeft, FileText, DollarSign } from "lucide-react";

const ServicosExtrasForm = ({ onSuccess, onCancel, servicoEditando }) => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    valor: "",
  });

  useEffect(() => {
    if (servicoEditando) {
      setFormData({
        nome: servicoEditando.nome || "",
        descricao: servicoEditando.descricao || "",
        valor: servicoEditando.valor || "",
      });
    } else {
      setFormData({
        nome: "",
        descricao: "",
        valor: "",
      });
    }
  }, [servicoEditando]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        valor: Number(formData.valor) || 0,
      };

      if (servicoEditando?.id) {
        await api.put(`/servicos-extras/${servicoEditando.id}`, payload);
        toast.success("Serviço atualizado com sucesso!");
      } else {
        await api.post("/servicos-extras", payload);
        toast.success("Serviço criado com sucesso!");
      }

      setFormData({
        nome: "",
        descricao: "",
        valor: "",
      });

      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar serviço.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-slate-200/40 shadow-2xl">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-10 pb-8 border-b border-slate-200/30">
          <div className="p-4 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl border border-blue-200/50">
            <Plus className="w-8 h-8 text-blue-600" />
          </div>

          <div>
            <h2 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
              {servicoEditando ? "Editar Serviço Extra" : "Novo Serviço Extra"}
            </h2>
            <p className="text-xl text-slate-600 font-semibold mt-1">
              Preencha os dados do serviço
            </p>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Nome */}
            <div className="space-y-3">
              <label className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Nome
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className="w-full px-6 py-5 bg-white/60 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 shadow-xl"
                required
              />
            </div>

            {/* Valor */}
            <div className="space-y-3">
              <label className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Valor (Kz)
              </label>
              <input
                type="number"
                name="valor"
                value={formData.valor}
                onChange={handleChange}
                className="w-full px-6 py-5 bg-white/60 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 shadow-xl"
                required
              />
            </div>

            {/* Descrição */}
            <div className="lg:col-span-2 space-y-3">
              <label className="font-bold text-lg text-slate-800">
                Descrição
              </label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows="4"
                className="w-full px-6 py-5 bg-white/60 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 shadow-xl"
              />
            </div>

          </div>

          {/* BOTÕES */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-200/30">

            <button
              type="button"
              onClick={onCancel}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-slate-200 rounded-2xl font-bold hover:bg-slate-300 transition"
            >
              <ChevronLeft />
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-white transition ${
                loading
                  ? "bg-gray-400"
                  : "bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
              }`}
            >
              <Save />
              {loading ? "Salvando..." : "Salvar Serviço"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default ServicosExtrasForm;
