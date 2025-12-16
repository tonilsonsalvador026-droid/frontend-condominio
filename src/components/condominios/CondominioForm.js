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
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-md border mb-6"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Novo Condomínio
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nome */}
        <div className="flex flex-col">
          <label
            htmlFor="nome"
            className="text-sm font-medium text-gray-600 mb-1"
          >
            Nome
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            placeholder="Digite o nome"
            value={formData.nome}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full text-gray-700 focus:ring focus:ring-blue-200"
            required
          />
        </div>

        {/* Localização */}
        <div className="flex flex-col">
          <label
            htmlFor="localizacao"
            className="text-sm font-medium text-gray-600 mb-1"
          >
            Localização
          </label>
          <input
            type="text"
            id="localizacao"
            name="localizacao"
            placeholder="Digite a localização"
            value={formData.localizacao}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full text-gray-700 focus:ring focus:ring-blue-200"
            required
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition duration-200"
        >
          Salvar
        </button>
      </div>
    </form>
  );
};


export default CondominioForm;

