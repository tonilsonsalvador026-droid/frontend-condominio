// src/components/inquilinos/InquilinoForm.js
import React, { useState, useEffect } from "react";
import api from "../../api";
import { toast } from "sonner";
import { User, Home, Save, ChevronLeft } from "lucide-react";

const InquilinoForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    nif: "",
    fracaoId: "",
  });

  const [fracoes, setFracoes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFracoes = async () => {
      try {
        const res = await api.get("/fracoes/vagas");
        setFracoes(res.data);
      } catch (err) {
        toast.error("Erro ao carregar frações disponíveis.");
      }
    };
    fetchFracoes();
  }, []);

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
      await api.post("/inquilinos", {
        ...formData,
        fracaoId: formData.fracaoId ? Number(formData.fracaoId) : null,
      });

      toast.success("Inquilino cadastrado com sucesso!");

      setFormData({
        nome: "",
        email: "",
        telefone: "",
        nif: "",
        fracaoId: "",
      });

      onSuccess?.();
    } catch (err) {
      toast.error("Erro ao cadastrar inquilino.");
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
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
              Novo Inquilino
            </h2>
            <p className="text-xl text-slate-600 font-semibold mt-1">
              Preencha os dados para cadastrar
            </p>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Nome */}
            <div className="space-y-3">
              <label className="font-bold text-lg text-slate-800">
                Nome Completo
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

            {/* Email */}
            <div className="space-y-3">
              <label className="font-bold text-lg text-slate-800">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-6 py-5 bg-white/60 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 shadow-xl"
              />
            </div>

            {/* Telefone */}
            <div className="space-y-3">
              <label className="font-bold text-lg text-slate-800">
                Telefone
              </label>
              <input
                type="text"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                className="w-full px-6 py-5 bg-white/60 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 shadow-xl"
              />
            </div>

            {/* NIF */}
            <div className="space-y-3">
              <label className="font-bold text-lg text-slate-800">
                NIF
              </label>
              <input
                type="text"
                name="nif"
                value={formData.nif}
                onChange={handleChange}
                className="w-full px-6 py-5 bg-white/60 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 shadow-xl"
              />
            </div>

            {/* Fração */}
            <div className="lg:col-span-2 space-y-3">
              <label className="font-bold text-lg text-slate-800">
                Fração
              </label>
              <select
                name="fracaoId"
                value={formData.fracaoId}
                onChange={handleChange}
                className="w-full px-6 py-5 bg-white/60 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 shadow-xl"
                required
              >
                <option value="">Selecione</option>
                {fracoes.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.numero} - {f.edificio?.nome || "Sem Edifício"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* BOTÕES */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t">
            
            <button
              type="button"
              onClick={onSuccess}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-slate-200 rounded-2xl font-bold"
            >
              <ChevronLeft /> Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-white ${
                loading
                  ? "bg-gray-400"
                  : "bg-gradient-to-r from-blue-600 to-emerald-600"
              }`}
            >
              <Save />
              {loading ? "Salvando..." : "Salvar Inquilino"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default InquilinoForm;
