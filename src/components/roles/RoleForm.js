// src/components/roles/RoleForm.js

import React, { useState, useEffect } from "react";
import api from "../../api";
import { toast } from "sonner";

import {
  ShieldCheck,
  Save,
  ChevronLeft,
  FileText,
} from "lucide-react";

const RoleForm = ({
  onSuccess,
  onCancel,
  roleEditando,
}) => {

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
  });

  useEffect(() => {
    if (roleEditando) {
      setFormData({
        nome: roleEditando.nome || "",
        descricao: roleEditando.descricao || "",
      });
    } else {
      setFormData({
        nome: "",
        descricao: "",
      });
    }
  }, [roleEditando]);

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

      if (roleEditando?.id) {

        await api.put(
          `/roles/${roleEditando.id}`,
          formData
        );

        toast.success("Função atualizada com sucesso!");

      } else {

        await api.post("/roles", formData);

        toast.success("Função criada com sucesso!");
      }

      onSuccess?.();

    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar função.");
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
            <ShieldCheck className="w-8 h-8 text-blue-600" />
          </div>

          <div>
            <h2 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
              {roleEditando
                ? "Editar Função"
                : "Nova Função"}
            </h2>

            <p className="text-xl text-slate-600 font-semibold mt-1">
              Preencha os dados da função
            </p>
          </div>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* NOME */}
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

            {/* DESCRIÇÃO */}
            <div className="space-y-3">

              <label className="font-bold text-lg text-slate-800">
                Descrição
              </label>

              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows="5"
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

              {loading
                ? "Salvando..."
                : "Salvar Função"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default RoleForm;
