// src/components/proprietarios/ProprietarioForm.js
import React, { useState } from "react";
import api from "../../api"; // ✅ usa api com baseURL e token
import { toast } from "sonner";

const ProprietarioForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    nif: "",
  });

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
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-md border mb-6"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Novo Proprietário
      </h2>

      {/* Layout responsivo em colunas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full text-gray-700 focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Telefone
          </label>
          <input
            type="text"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full text-gray-700 focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            NIF
          </label>
          <input
            type="text"
            name="nif"
            value={formData.nif}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full text-gray-700 focus:ring focus:ring-blue-200"
          />
        </div>
      </div>

      {/* Botão alinhado à esquerda */}
      <div className="mt-5">
        <button
          type="submit"
          className="px-5 py-2 rounded-lg transition text-white bg-blue-600 hover:bg-blue-700"
        >
          Salvar
        </button>
      </div>
    </form>
  );
};

export default ProprietarioForm;