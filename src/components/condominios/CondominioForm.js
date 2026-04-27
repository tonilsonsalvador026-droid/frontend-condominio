// src/components/condominios/CondominioForm.js
import React, { useState } from "react";
import api from "../../api";
import { toast } from "sonner";
import { Building2, MapPin, ChevronLeft, Save } from "lucide-react";

const CondominioForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    nome: "",
    localizacao: "",
  });

  const [loading, setLoading] = useState(false); // ✅ visual apenas

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // ✅ apenas visual
    try {
      const token = localStorage.getItem("token");
      const payload = JSON.parse(atob(token.split(".")[1]));
      const gestorId = payload.id;

      await api.post("/condominios", {
        ...formData,
        gestorId,
      });

      toast.success("Condomínio cadastrado com sucesso!");
      setFormData({ nome: "", localizacao: "" });
      onSuccess?.();
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(
        err.response?.data?.error || "Erro ao cadastrar condomínio."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Container Glass */}
      <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-slate-200/40 shadow-2xl">

        {/* Header */}
        <div className="flex items-center gap-4 mb-10 pb-8 border-b border-slate-200/30">
          <div className="p-4 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl border border-blue-200/50">
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>

          <div>
            <h2 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
              Novo Condomínio
            </h2>
            <p className="text-xl text-slate-600 font-semibold mt-1">
              Preencha os dados para cadastrar
            </p>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Nome */}
            <div className="space-y-3">
              <label className="font-bold text-lg text-slate-800">
                Nome do Condomínio
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Ex: Condomínio Boa Vida"
                className="w-full px-6 py-5 bg-white/60 backdrop-blur-xl border border-slate-200/50 rounded-2xl focus:ring-4 focus:ring-blue-200/60 focus:border-blue-300/70 shadow-xl hover:shadow-2xl transition-all duration-300 text-lg placeholder-slate-400"
                required
              />
            </div>

            {/* Localização */}
            <div className="space-y-3">
              <label className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-slate-500" />
                Localização
              </label>
              <input
                type="text"
                name="localizacao"
                value={formData.localizacao}
                onChange={handleChange}
                placeholder="Ex: Talatona, Luanda"
                className="w-full px-6 py-5 bg-white/60 backdrop-blur-xl border border-slate-200/50 rounded-2xl focus:ring-4 focus:ring-blue-200/60 focus:border-blue-300/70 shadow-xl hover:shadow-2xl transition-all duration-300 text-lg placeholder-slate-400"
                required
              />
            </div>
          </div>

          {/* BOTÕES */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-200/30">

            {/* Cancelar */}
            <button
              type="button"
              onClick={onSuccess}
              className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-slate-100/80 to-slate-200/80 hover:from-slate-200/90 hover:to-slate-300/90 backdrop-blur-xl border border-slate-200/50 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-lg font-bold text-slate-800"
            >
              <ChevronLeft className="w-5 h-5" />
              Cancelar
            </button>

            {/* Salvar */}
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 flex items-center justify-center gap-3 px-8 py-5 rounded-2xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 text-lg font-bold ${
                loading
                  ? "bg-slate-400/80 backdrop-blur-sm cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Salvar Condomínio
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CondominioForm;
