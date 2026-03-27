// src/components/fracoes/FracaoForm.js
import React, { useState, useEffect } from "react";
import api from "../../api";
import { toast } from "sonner";
import { Home, Building2, User, Save, ChevronLeft } from "lucide-react";

const FracaoForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    numero: "",
    tipo: "",
    edificioId: "",
    proprietarioId: "",
    inquilinoId: "",
  });

  const [edificios, setEdificios] = useState([]);
  const [proprietarios, setProprietarios] = useState([]);
  const [inquilinos, setInquilinos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [edRes, prRes, inqRes] = await Promise.all([
          api.get("/edificios"),
          api.get("/proprietarios"),
          api.get("/inquilinos"),
        ]);
        setEdificios(edRes.data);
        setProprietarios(prRes.data);
        setInquilinos(inqRes.data);
      } catch {
        toast.error("Erro ao carregar dados.");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ["edificioId", "proprietarioId", "inquilinoId"].includes(name)
        ? parseInt(value) || ""
        : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/fracoes", formData);
      toast.success("Fração cadastrada com sucesso!");
      setFormData({
        numero: "",
        tipo: "",
        edificioId: "",
        proprietarioId: "",
        inquilinoId: "",
      });
      onSuccess?.();
    } catch {
      toast.error("Erro ao cadastrar fração.");
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
            <Home className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
              Nova Fração
            </h2>
            <p className="text-xl text-slate-600 font-semibold mt-1">
              Preencha os dados para cadastrar
            </p>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Número */}
            <div className="space-y-3">
              <label className="font-bold text-lg text-slate-800">
                Número da Fração
              </label>
              <input
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                className="w-full px-6 py-5 bg-white/60 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 shadow-xl"
                required
              />
            </div>

            {/* Tipo */}
            <div className="space-y-3">
              <label className="font-bold text-lg text-slate-800">
                Tipo
              </label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                className="w-full px-6 py-5 bg-white/60 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 shadow-xl"
                required
              >
                <option value="">Selecione</option>
                <option value="apartamento">Apartamento</option>
                <option value="loja">Loja</option>
                <option value="garagem">Garagem</option>
              </select>
            </div>

            {/* Edifício */}
            <div className="space-y-3">
              <label className="font-bold text-lg text-slate-800">
                Edifício
              </label>
              <select
                name="edificioId"
                value={formData.edificioId}
                onChange={handleChange}
                className="w-full px-6 py-5 bg-white/60 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 shadow-xl"
                required
              >
                <option value="">Selecione</option>
                {edificios.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Proprietário */}
            <div className="space-y-3">
              <label className="font-bold text-lg text-slate-800">
                Proprietário
              </label>
              <select
                name="proprietarioId"
                value={formData.proprietarioId}
                onChange={handleChange}
                className="w-full px-6 py-5 bg-white/60 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 shadow-xl"
              >
                <option value="">Selecione</option>
                {proprietarios.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Inquilino */}
            <div className="space-y-3">
              <label className="font-bold text-lg text-slate-800">
                Inquilino
              </label>
              <select
                name="inquilinoId"
                value={formData.inquilinoId}
                onChange={handleChange}
                className="w-full px-6 py-5 bg-white/60 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 shadow-xl"
              >
                <option value="">Selecione</option>
                {inquilinos.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Estado */}
          <p className="text-lg font-semibold text-slate-700">
            Estado:{" "}
            <span className={formData.inquilinoId ? "text-green-600" : "text-blue-600"}>
              {formData.inquilinoId ? "Ocupado" : "Vago"}
            </span>
          </p>

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
              {loading ? "Salvando..." : "Salvar Fração"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FracaoForm;
