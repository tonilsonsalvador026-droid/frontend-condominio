// src/components/proprietarios/ProprietarioForm.js
import React, { useState } from "react";
import api from "../../api";
import { toast } from "sonner";
import { User, Mail, Phone, Hash, Save } from "lucide-react";

const ProprietarioForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    nome: "", email: "", telefone: "", nif: ""
  });

  // TUA LÓGICA 100% IGUAL
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/proprietarios", formData);
      toast.success("✅ Proprietário cadastrado com sucesso!");
      setFormData({ nome: "", email: "", telefone: "", nif: "" });
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Erro ao cadastrar proprietário:", err);
      toast.error("❌ Erro ao cadastrar proprietário.");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Form Glass ÚNICO (padrão Edifícios - 1 camada azul) */}
      <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-xl rounded-3xl p-10 lg:p-12 border border-slate-200/50 shadow-2xl space-y-10">
        
        {/* Grid Inputs Glass AZUL */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Nome */}
          <div className="space-y-3">
            <label className="font-bold text-xl text-slate-800">
              Nome Completo
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="w-full px-6 py-5 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl focus:ring-4 focus:ring-blue-200/70 focus:border-blue-300/80 shadow-lg hover:shadow-xl transition-all duration-300 text-lg placeholder-slate-400"
              placeholder="Ex: João Silva Santos"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-3">
            <label className="font-bold text-xl text-slate-800">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-6 py-5 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl focus:ring-4 focus:ring-emerald-200/70 focus:border-emerald-300/80 shadow-lg hover:shadow-xl transition-all duration-300 text-lg placeholder-slate-400"
              placeholder="Ex: joao.silva@email.com"
            />
          </div>

          {/* Telefone */}
          <div className="space-y-3">
            <label className="font-bold text-xl text-slate-800">
              Telefone
            </label>
            <input
              type="tel"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              className="w-full px-6 py-5 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl focus:ring-4 focus:ring-blue-200/70 focus:border-blue-300/80 shadow-lg hover:shadow-xl transition-all duration-300 text-lg placeholder-slate-400"
              placeholder="Ex: 923 456 789"
            />
          </div>

          {/* NIF */}
          <div className="space-y-3">
            <label className="font-bold text-xl text-slate-800">
              NIF
            </label>
            <input
              type="text"
              name="nif"
              value={formData.nif}
              onChange={handleChange}
              className="w-full px-6 py-5 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl focus:ring-4 focus:ring-purple-200/70 focus:border-purple-300/80 shadow-lg hover:shadow-xl transition-all duration-300 text-lg placeholder-slate-400 font-mono tracking-widest"
              placeholder="Ex: 123456789"
            />
          </div>
        </div>

        {/* Botão Salvar CENTRALIZADO XL AZUL (padrão) */}
        <div className="pt-10 border-t border-slate-200/40 flex justify-center">
          <button
            type="submit"
            className="px-16 py-7 rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-500 text-xl font-black w-full max-w-md mx-auto bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white flex items-center justify-center gap-3"
          >
            <Save className="w-7 h-7" />
            Salvar Proprietário
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProprietarioForm;
