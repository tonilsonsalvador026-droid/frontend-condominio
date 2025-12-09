// src/components/inquilinos/InquilinoForm.js
import React, { useState, useEffect } from "react";
import api from "../../api"; // ✅ usa api com baseURL e token
import { toast } from "sonner";

const InquilinoForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    nif: "",
    fracaoId: "", // ligação com a fração
  });

  const [fracoes, setFracoes] = useState([]);

  // 🔄 Buscar frações vagas ao carregar
  useEffect(() => {
    const fetchFracoes = async () => {
      try {
        const res = await api.get("/fracoes/vagas");
        setFracoes(res.data);
      } catch (err) {
        console.error("Erro ao carregar frações vagas:", err);
        toast.error("Erro ao carregar frações disponíveis.");
      }
    };
    fetchFracoes();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 👇 converte fracaoId para número antes de enviar
      await api.post("/inquilinos", {
        ...formData,
        fracaoId: formData.fracaoId ? Number(formData.fracaoId) : null,
      });

      toast.success("✅ Inquilino cadastrado com sucesso!");
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        nif: "",
        fracaoId: "",
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Erro ao cadastrar inquilino:", err);
      toast.error("❌ Erro ao cadastrar inquilino.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-md border mb-6"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Novo Inquilino
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

        {/* Select de fração */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Fração
          </label>
          <select
            name="fracaoId"
            value={formData.fracaoId}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full text-gray-700 focus:ring focus:ring-blue-200"
            required
          >
            <option value="">Selecione uma Fração</option>
            {fracoes.map((f) => (
              <option key={f.id} value={f.id}>
                {f.numero} - {f.edificio?.nome || "Sem Edifício"}
              </option>
            ))}
          </select>
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

export default InquilinoForm;