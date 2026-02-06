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
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Novo Edifício
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Preencha os dados abaixo para cadastrar um novo edifício.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2">
              Nome do Edifício
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2">
              Endereço
            </label>
            <input
              type="text"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2">
              Número de Andares
            </label>
            <input
              type="number"
              name="numeroAndares"
              value={formData.numeroAndares}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2.5"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2">
              Número de Apartamentos
            </label>
            <input
              type="number"
              name="numeroApartamentos"
              value={formData.numeroApartamentos}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2.5"
            />
          </div>

          <div className="flex flex-col md:col-span-2">
            <label className="text-sm font-medium text-gray-600 mb-2">
              Condomínio
            </label>
            <select
              name="condominioId"
              value={formData.condominioId}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2.5"
              required
            >
              <option value="">Selecione</option>
              {condominios.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8 flex justify-start">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg">
            Salvar Edifício
          </button>
        </div>
      </form>
    </div>
  );
};

export default EdificioForm;
