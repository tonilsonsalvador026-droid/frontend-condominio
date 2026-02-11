// src/components/fracoes/FracaoForm.js
import React, { useState, useEffect } from "react";
import api from "../../api";
import { toast } from "sonner";

const FracaoForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    numero: "",
    tipo: "",
    edificioId: "",
    proprietarioId: "",
    inquilinoId: "",
  });

  const [edificios, setEdificios] = useState([]);
  const [proprietarios, setProprietarios] = useState([]);
  const [inquilinos, setInquilinos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [edRes, prRes, inqRes] = await Promise.all([
          api.get("/edificios"),
          api.get("/proprietarios"),
          api.get("/inquilinos"),
        ]);
        setEdificios(edRes.data);
        setProprietarios(prRes.data);
        setInquilinos(inqRes.data);
      } catch (err) {
        toast.error("Erro ao carregar dados.");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ["edificioId", "proprietarioId", "inquilinoId"].includes(name)
        ? parseInt(value) || ""
        : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/fracoes", formData);
      toast.success("Fração cadastrada com sucesso!");
      setFormData({
        numero: "",
        tipo: "",
        edificioId: "",
        proprietarioId: "",
        inquilinoId: "",
      });
      onSuccess?.();
    } catch (err) {
      toast.error("Erro ao cadastrar fração.");
    } finally {
      setLoading(false);
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
            Nova Fração
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Preencha os dados abaixo para cadastrar uma nova fração.
          </p>
        </div>

        {/* Campos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Número */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2">
              Número
            </label>
            <input
              type="text"
              name="numero"
              value={formData.numero}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          {/* Tipo */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2">
              Tipo
            </label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            >
              <option value="">Selecione o Tipo</option>
              <option value="apartamento">Apartamento</option>
              <option value="loja">Loja</option>
              <option value="garagem">Garagem</option>
            </select>
          </div>

          {/* Edifício */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2">
              Edifício
            </label>
            <select
              name="edificioId"
              value={formData.edificioId}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            >
              <option value="">Selecione o Edifício</option>
              {edificios.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Proprietário */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2">
              Proprietário
            </label>
            <select
              name="proprietarioId"
              value={formData.proprietarioId}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="">Selecione o Proprietário</option>
              {proprietarios.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Inquilino */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2">
              Inquilino
            </label>
            <select
              name="inquilinoId"
              value={formData.inquilinoId}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="">Selecione o Inquilino</option>
              {inquilinos.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Estado */}
        <p className="text-sm text-gray-600 mt-4">
          Estado atual:{" "}
          <span
            className={`font-semibold ${
              formData.inquilinoId ? "text-green-600" : "text-blue-600"
            }`}
          >
            {formData.inquilinoId ? "Ocupado" : "Vago"}
          </span>
        </p>

        {/* Botão */}
        <div className="mt-8 flex justify-start">
          <button
            type="submit"
            disabled={loading}
            className={`text-white font-medium px-8 py-2.5 rounded-lg transition duration-200 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Salvando..." : "Salvar Fração"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FracaoForm;
