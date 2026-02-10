// src/components/edificios/EdificioForm.js
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

  useEffect(() => {
    api.get("/condominios").then((res) => setCondominios(res.data));
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    }
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 md:p-8"
      >
        {/* Título padrão */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Novo Edifício
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Preencha os dados abaixo para cadastrar um novo edifício.
          </p>
        </div>

        {/* Campos no grid padrão */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome */}
          <div className="flex flex-col">
            <label
              htmlFor="nome"
              className="text-sm font-medium text-gray-600 mb-2"
            >
              Nome do Edifício
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              placeholder="Ex: Edifício Sol Nascente"
              value={formData.nome}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          {/* Endereço */}
          <div className="flex flex-col">
            <label
              htmlFor="endereco"
              className="text-sm font-medium text-gray-600 mb-2"
            >
              Endereço
            </label>
            <input
              type="text"
              id="endereco"
              name="endereco"
              placeholder="Ex: Rua Principal, Talatona"
              value={formData.endereco}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          {/* Número de Andares */}
          <div className="flex flex-col">
            <label
              htmlFor="numeroAndares"
              className="text-sm font-medium text-gray-600 mb-2"
            >
              Número de Andares
            </label>
            <input
              type="number"
              id="numeroAndares"
              name="numeroAndares"
              placeholder="Ex: 10"
              value={formData.numeroAndares}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Número de Apartamentos */}
          <div className="flex flex-col">
            <label
              htmlFor="numeroApartamentos"
              className="text-sm font-medium text-gray-600 mb-2"
            >
              Número de Apartamentos
            </label>
            <input
              type="number"
              id="numeroApartamentos"
              name="numeroApartamentos"
              placeholder="Ex: 40"
              value={formData.numeroApartamentos}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Condomínio (linha inteira) */}
          <div className="flex flex-col md:col-span-2">
            <label
              htmlFor="condominioId"
              className="text-sm font-medium text-gray-600 mb-2"
            >
              Condomínio
            </label>
            <select
              id="condominioId"
              name="condominioId"
              value={formData.condominioId}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            >
              <option value="">Selecione o condomínio</option>
              {condominios.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Botão padrão */}
        <div className="mt-8 flex justify-start">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-2.5 rounded-lg transition duration-200"
          >
            Salvar Edifício
          </button>
        </div>
      </form>
    </div>
  );
};

export default EdificioForm;
