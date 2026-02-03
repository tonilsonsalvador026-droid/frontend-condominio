// src/components/condominios/CondominioForm.js
import React, { useState } from "react";
import api from "../../api";
import { toast } from "sonner";

const CondominioForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    nome: "",
    localizacao: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const payload = JSON.parse(atob(token.split(".")[1]));
      const gestorId = payload.id;

      await api.post("/condominios", {
        ...formData,
        gestorId,
      });

      toast.success("Condomínio cadastrado com sucesso!");
      setFormData({ nome: "", localizacao: "" });
      onSuccess?.();
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(
        err.response?.data?.error || "Erro ao cadastrar condomínio."
      );
    }
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 md:p-8"
      >
        {/* Título */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Novo Condomínio
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Preencha os dados abaixo para cadastrar um novo condomínio.
          </p>
        </div>

        {/* Campos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome */}
          <div className="flex flex-col">
            <label
              htmlFor="nome"
              className="text-sm font-medium text-gray-600 mb-2"
            >
              Nome do Condomínio
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              placeholder="Ex: Condomínio Boa Vida"
              value={formData.nome}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          {/* Localização */}
          <div className="flex flex-col">
            <label
              htmlFor="localizacao"
              className="text-sm font-medium text-gray-600 mb-2"
            >
              Localização
            </label>
            <input
              type="text"
              id="localizacao"
              name="localizacao"
              placeholder="Ex: Talatona, Luanda"
              value={formData.localizacao}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>
        </div>

        {/* Botão */}
        <div className="mt-8 flex justify-start">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-2.5 rounded-lg transition duration-200"
          >
            Salvar Condomínio
          </button>
        </div>
      </form>
    </div>
  );
};

export default CondominioForm;
