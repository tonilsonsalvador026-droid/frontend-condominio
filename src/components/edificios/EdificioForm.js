// src/components/edificios/EdificioForm.js
import React, { useState, useEffect } from "react";
import api from "../../api";
import { toast } from "sonner";
import { Building2, MapPin, Home, ChevronLeft, Save } from "lucide-react";

const EdificioForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    nome: "",
    endereco: "",
    numeroAndares: "",
    numeroApartamentos: "",
    condominioId: "",
  });

  const [condominios, setCondominios] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCondominios = async () => {
      try {
        const res = await api.get("/condominios");
        setCondominios(res.data);
      } catch (err) {
        console.error("Erro ao carregar condomínios:", err);
        toast.error("Erro ao carregar condomínios.");
      }
    };
    fetchCondominios();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/edificios", formData);
      toast.success("Edifício cadastrado com sucesso!");
      setFormData({
        nome: "", endereco: "", numeroAndares: "", numeroApartamentos: "", condominioId: ""
      });
      onSuccess?.();
    } catch (err) {
      console.error("Erro ao cadastrar edifício:", err);
      toast.error("Erro ao cadastrar edifício.");
    } finally {
      setLoading(false);
    }
  };

 return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Container Glass Principal */}
      <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-slate-200/40 shadow-2xl">
        
        {/* Header Form */}
        <div className="flex items-center gap-4 mb-10 pb-8 border-b border-slate-200/30">
          <div className="p-4 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl border border-blue-200/50">
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
              Novo Edifício
            </h2>
            <p className="text-xl text-slate-600 font-semibold mt-1">
              Preencha os dados para cadastrar
            </p>
          </div>
        </div>

        {/* Form Glass */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Grid Inputs Glass */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Nome */}
            <div className="space-y-3">
              <label className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <span></span> Nome do Edifício
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                placeholder="Ex: Edifício Atlântico"
                value={formData.nome}
                onChange={handleChange}
                className="w-full px-6 py-5 bg-white/60 backdrop-blur-xl border border-slate-200/50 rounded-2xl focus:ring-4 focus:ring-blue-200/60 focus:border-blue-300/70 shadow-xl hover:shadow-2xl transition-all duration-300 text-lg placeholder-slate-400"
                required
              />
            </div>

            {/* Endereço */}
            <div className="space-y-3">
              <label className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-slate-500" />
                Endereço
              </label>
              <input
                type="text"
                id="endereco"
                name="endereco"
                placeholder="Ex: Rua Principal, Talatona"
                value={formData.endereco}
                onChange={handleChange}
                className="w-full px-6 py-5 bg-white/60 backdrop-blur-xl border border-slate-200/50 rounded-2xl focus:ring-4 focus:ring-blue-200/60 focus:border-blue-300/70 shadow-xl hover:shadow-2xl transition-all duration-300 text-lg placeholder-slate-400"
                required
              />
            </div>

            {/* Andares */}
            <div className="space-y-3">
              <label className="font-bold text-lg text-slate-800 flex items-center gap-2">
              
                <span>Nº de Andares</span>
              </label>
              <input
                type="number"
                id="numeroAndares"
                name="numeroAndares"
                min="1"
                value={formData.numeroAndares}
                onChange={handleChange}
                className="w-full px-6 py-5 bg-white/60 backdrop-blur-xl border border-slate-200/50 rounded-2xl focus:ring-4 focus:ring-emerald-200/60 focus:border-emerald-300/70 shadow-xl hover:shadow-2xl transition-all duration-300 text-lg placeholder-slate-400"
              />
            </div>

            {/* Apartamentos */}
            <div className="space-y-3">
              <label className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <Home className="w-6 h-6 text-slate-500" />
                Nº de Apartamentos
              </label>
              <input
                type="number"
                id="numeroApartamentos"
                name="numeroApartamentos"
                min="1"
                value={formData.numeroApartamentos}
                onChange={handleChange}
                className="w-full px-6 py-5 bg-white/60 backdrop-blur-xl border border-slate-200/50 rounded-2xl focus:ring-4 focus:ring-emerald-200/60 focus:border-emerald-300/70 shadow-xl hover:shadow-2xl transition-all duration-300 text-lg placeholder-slate-400"
              />
            </div>
          </div>

          {/* Select Condomínio */}
          <div className="space-y-3">
            <label className="font-bold text-lg text-slate-800 flex items-center gap-2">
               Condomínio
            </label>
            <select
              id="condominioId"
              name="condominioId"
              value={formData.condominioId}
              onChange={handleChange}
              className="w-full px-6 py-5 bg-white/60 backdrop-blur-xl border border-slate-200/50 rounded-2xl focus:ring-4 focus:ring-purple-200/60 focus:border-purple-300/70 shadow-xl hover:shadow-2xl transition-all duration-300 text-lg"
              required
            >
              <option value="">Selecione um condomínio</option>
              {condominios.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome} {c.localizacao ? `• ${c.localizacao}` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-200/30">
            <button
              type="button"
              onClick={onSuccess}
              className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-slate-100/80 to-slate-200/80 hover:from-slate-200/90 hover:to-slate-300/90 backdrop-blur-xl border border-slate-200/50 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-lg font-bold text-slate-800"
            >
              <ChevronLeft className="w-5 h-5" />
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 flex items-center justify-center gap-3 px-8 py-5 rounded-2xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 text-lg font-bold flex-shrink-0 ${
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
                  Salvar Edifício
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EdificioForm;
};

export default EdificioForm;
