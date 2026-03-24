// src/components/edificios/EdificioForm.js
import React, { useState, useEffect } from "react";
import api from "../../api";
import { toast } from "sonner";
import { Save } from "lucide-react";

const EdificioForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    nome: "", endereco: "", numeroAndares: "", numeroApartamentos: "", condominioId: ""
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
      setFormData({ nome: "", endereco: "", numeroAndares: "", numeroApartamentos: "", condominioId: "" });
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
      {/* ✅ SÓ 1 CAMADA GLASS BRANCA (sem header cinza) */}
      <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-xl rounded-3xl p-12 border border-slate-200/50 shadow-2xl space-y-10">
        
        {/* Grid Inputs (sem ícones, só texto limpo) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Nome */}
          <div className="space-y-3">
            <label className="font-bold text-xl text-slate-800">
              Nome do Edifício
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              placeholder="Ex: Edifício Atlântico"
              value={formData.nome}
              onChange={handleChange}
              className="w-full px-6 py-5 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl focus:ring-4 focus:ring-blue-200/70 focus:border-blue-300/80 shadow-lg hover:shadow-xl transition-all duration-300 text-lg placeholder-slate-400"
              required
            />
          </div>

          {/* Endereço */}
          <div className="space-y-3">
            <label className="font-bold text-xl text-slate-800">
              Endereço
            </label>
            <input
              type="text"
              id="endereco"
              name="endereco"
              placeholder="Ex: Rua Principal, Talatona"
              value={formData.endereco}
              onChange={handleChange}
              className="w-full px-6 py-5 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl focus:ring-4 focus:ring-blue-200/70 focus:border-blue-300/80 shadow-lg hover:shadow-xl transition-all duration-300 text-lg placeholder-slate-400"
              required
            />
          </div>

          {/* Andares */}
          <div className="space-y-3">
            <label className="font-bold text-xl text-slate-800">
              Número de Andares
            </label>
            <input
              type="number"
              id="numeroAndares"
              name="numeroAndares"
              min="1"
              value={formData.numeroAndares}
              onChange={handleChange}
              className="w-full px-6 py-5 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl focus:ring-4 focus:ring-emerald-200/70 focus:border-emerald-300/80 shadow-lg hover:shadow-xl transition-all duration-300 text-lg placeholder-slate-400"
            />
          </div>

          {/* Apartamentos */}
          <div className="space-y-3">
            <label className="font-bold text-xl text-slate-800">
              Número de Apartamentos
            </label>
            <input
              type="number"
              id="numeroApartamentos"
              name="numeroApartamentos"
              min="1"
              value={formData.numeroApartamentos}
              onChange={handleChange}
              className="w-full px-6 py-5 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl focus:ring-4 focus:ring-emerald-200/70 focus:border-emerald-300/80 shadow-lg hover:shadow-xl transition-all duration-300 text-lg placeholder-slate-400"
            />
          </div>
        </div>

        {/* Select Condomínio */}
        <div className="space-y-3">
          <label className="font-bold text-xl text-slate-800">
            Condomínio
          </label>
          <select
            id="condominioId"
            name="condominioId"
            value={formData.condominioId}
            onChange={handleChange}
            className="w-full px-6 py-5 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl focus:ring-4 focus:ring-purple-200/70 focus:border-purple-300/80 shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
            required
          >
            <option value="">Selecione um condomínio</option>
            {condominios.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Botão Salvar (GRANDE + CENTRALIZADO) */}
        <div className="pt-10 border-t border-slate-200/40 flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className={`px-16 py-7 rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-500 text-xl font-black w-full max-w-md mx-auto ${
              loading
                ? "bg-slate-400/90 backdrop-blur-sm cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white"
            }`}
          >
            {loading ? (
              <>
                <div className="w-7 h-7 border-3 border-white/20 border-t-white rounded-full animate-spin inline-block mr-3" />
                Salvando...
              </>
            ) : (
              "Salvar Edifício"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EdificioForm;
