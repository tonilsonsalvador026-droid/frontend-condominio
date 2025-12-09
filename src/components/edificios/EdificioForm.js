// src/components/edificios/EdificioForm.js
import React, { useState, useEffect } from "react";
import api from "../../api"; // ✅ axios configurado com baseURL e token
import { toast } from "sonner";

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

  // 🔄 Buscar condomínios ao carregar
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
      toast.success("✅ Edifício cadastrado com sucesso!");
      setFormData({
        nome: "",
        endereco: "",
        numeroAndares: "",
        numeroApartamentos: "",
        condominioId: "",
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Erro ao cadastrar edifício:", err);
      toast.error("❌ Erro ao cadastrar edifício.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
  onSubmit={handleSubmit}
  className="bg-white p-6 rounded-2xl shadow-md border mb-6 w-full"
>
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
         Novo Edifício
      </h2>

      {/* Layout responsivo em colunas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Nome
          </label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full text-gray-700 focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Endereço
          </label>
          <input
            type="text"
            name="endereco"
            value={formData.endereco}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full text-gray-700 focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Número de Andares
          </label>
          <input
            type="number"
            name="numeroAndares"
            value={formData.numeroAndares}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full text-gray-700 focus:ring focus:ring-blue-200"
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Número de Apartamentos
          </label>
          <input
            type="number"
            name="numeroApartamentos"
            value={formData.numeroApartamentos}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full text-gray-700 focus:ring focus:ring-blue-200"
            min="1"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Condomínio
          </label>
          <select
            name="condominioId"
            value={formData.condominioId}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full text-gray-700 focus:ring focus:ring-blue-200"
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
      </div>

      {/* Botão alinhado à esquerda */}
      <div className="mt-5">
        <button
          type="submit"
          disabled={loading}
          className={`px-5 py-2 rounded-lg transition text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
};

export default EdificioForm;