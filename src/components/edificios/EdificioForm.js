import React, { useState, useEffect } from "react";
import api from "../../api";
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

  useEffect(() => {
    const fetchCondominios = async () => {
      try {
        const res = await api.get("/condominios");
        setCondominios(res.data);
      } catch (err) {
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
        nome: "",
        endereco: "",
        numeroAndares: "",
        numeroApartamentos: "",
        condominioId: "",
      });
      onSuccess?.();
    } catch {
      toast.error("Erro ao cadastrar edifício.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border rounded-2xl shadow-sm p-6 md:p-8 mb-6"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Novo Edifício
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nome */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Nome do Edifício
          </label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Ex: Edifício Atlântico"
            className="border rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Endereço */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Endereço
          </label>
          <input
            type="text"
            name="endereco"
            value={formData.endereco}
            onChange={handleChange}
            placeholder="Rua, número, bairro..."
            className="border rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Andares */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Nº de Andares
          </label>
          <input
            type="number"
            name="numeroAndares"
            value={formData.numeroAndares}
            onChange={handleChange}
            min="1"
            className="border rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Apartamentos */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Nº de Apartamentos
          </label>
          <input
            type="number"
            name="numeroApartamentos"
            value={formData.numeroApartamentos}
            onChange={handleChange}
            min="1"
            className="border rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Condomínio */}
        <div className="flex flex-col md:col-span-2">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Condomínio
          </label>
          <select
            name="condominioId"
            value={formData.condominioId}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* Botão */}
      <div className="mt-8">
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-2 rounded-lg text-white font-medium transition ${
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
