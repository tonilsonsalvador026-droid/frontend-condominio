import React, { useEffect, useState } from "react";
import { Plus, Save, X } from "lucide-react";

export default function RoleForm({
  onSubmit,
  editingRole,
  loading,
  onCancel,
}) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    if (editingRole) {
      setNome(editingRole.nome || "");
      setDescricao(editingRole.descricao || "");
    } else {
      setNome("");
      setDescricao("");
    }
  }, [editingRole]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ nome, descricao });
  };

  return (
    <div className="w-full bg-white/70 backdrop-blur-xl border border-slate-200 shadow-xl rounded-3xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          {editingRole ? "Editar Função" : "Nova Função"}
        </h2>

        {editingRole && (
          <button
            onClick={onCancel}
            className="text-slate-500 hover:text-red-500"
          >
            <X />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="font-semibold text-slate-700">Nome</label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full mt-2 px-4 py-3 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-200"
            required
          />
        </div>

        <div>
          <label className="font-semibold text-slate-700">Descrição</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full mt-2 px-4 py-3 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-200"
            rows={4}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-2xl font-bold hover:scale-[1.01] transition"
        >
          <Save size={18} />
          {loading ? "A guardar..." : editingRole ? "Atualizar" : "Criar"}
        </button>
      </form>
    </div>
  );
}
