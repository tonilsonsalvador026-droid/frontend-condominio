import React, { useEffect, useState } from "react";

import {
  ShieldCheck,
  Save,
  X,
  FileText,
} from "lucide-react";

const RoleForm = ({
  onSubmit,
  loading,
  editingRole,
  onCancel,
}) => {

  const [nome, setNome] =
    useState("");

  const [descricao, setDescricao] =
    useState("");

  useEffect(() => {

    if (editingRole) {

      setNome(
        editingRole.nome || ""
      );

      setDescricao(
        editingRole.descricao || ""
      );

    } else {

      setNome("");
      setDescricao("");

    }

  }, [editingRole]);

  const handleSubmit = (e) => {

    e.preventDefault();

    onSubmit({
      nome,
      descricao,
    });

  };

  return (

    <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-xl overflow-hidden">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 p-6 text-white">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-lg">

              <ShieldCheck size={28} />

            </div>

            <div>

              <h2 className="text-2xl font-bold">

                {editingRole
                  ? "Editar Função"
                  : "Nova Função"}

              </h2>

              <p className="text-sm text-blue-100 mt-1">

                Gestão premium de papéis e acessos.

              </p>

            </div>

          </div>

          {editingRole && (

            <button
              onClick={onCancel}
              className="w-11 h-11 rounded-2xl bg-white/20 hover:bg-red-500 transition-all duration-300 flex items-center justify-center"
            >

              <X size={20} />

            </button>

          )}

        </div>

      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="p-8 space-y-8"
      >

        {/* NOME */}
        <div>

          <label className="block text-sm font-bold text-slate-700 mb-3">

            Nome da Função

          </label>

          <input
            type="text"
            value={nome}
            onChange={(e) =>
              setNome(e.target.value)
            }
            placeholder="Ex: Administrador"
            className="w-full h-14 rounded-2xl border border-slate-200 bg-white px-5 text-slate-700 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300"
            required
          />

        </div>

        {/* DESCRIÇÃO */}
        <div>

          <label className="block text-sm font-bold text-slate-700 mb-3">

            Descrição

          </label>

          <div className="relative">

            <FileText
              size={18}
              className="absolute top-5 left-4 text-slate-400"
            />

            <textarea
              rows="5"
              value={descricao}
              onChange={(e) =>
                setDescricao(e.target.value)
              }
              placeholder="Descreva as responsabilidades desta função..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-slate-700 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300 resize-none"
            />

          </div>

        </div>

        {/* BOTÃO */}
        <div className="flex justify-end">

          <button
            type="submit"
            disabled={loading}
            className="h-14 px-8 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-3"
          >

            <Save size={18} />

            {loading
              ? "A guardar..."
              : editingRole
              ? "Atualizar Função"
              : "Salvar Função"}

          </button>

        </div>

      </form>

    </div>

  );

};

export default RoleForm;
