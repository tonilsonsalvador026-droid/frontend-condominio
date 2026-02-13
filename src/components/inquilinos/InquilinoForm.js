import React, { useState, useEffect } from "react";
import api from "../../api";
import { toast } from "sonner";

const InquilinoForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    nif: "",
    fracaoId: "",
  });

  const [fracoes, setFracoes] = useState([]);

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
      await api.post("/inquilinos", {
        ...formData,
        fracaoId: formData.fracaoId ? Number(formData.fracaoId) : null,
      });
      toast.success("Inquilino cadastrado com sucesso!");
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        nif: "",
        fracaoId: "",
      });
      onSuccess?.();
    } catch (err) {
      console.error("Erro ao cadastrar inquilino:", err);
      toast.error("Erro ao cadastrar inquilino.");
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
            Novo Inquilino
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Preencha os dados abaixo para cadastrar um novo inquilino.
          </p>
        </div>

        {/* Campos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2">Nome</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2">Telefone</label>
            <input
              type="text"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2">NIF</label>
            <input
              type="text"
              name="nif"
              value={formData.nif}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div className="md:col-span-2 flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2">Fração</label>
            <select
              name="fracaoId"
              value={formData.fracaoId}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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

        <div className="mt-8 flex justify-start">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-2.5 rounded-lg transition duration-200"
          >
            Salvar Inquilino
          </button>
        </div>
      </form>
    </div>
  );
};

export default InquilinoForm;
