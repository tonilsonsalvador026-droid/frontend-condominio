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
        console.error("Erro ao carregar dados:", err);
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
      toast.success("✅ Fração cadastrada com sucesso!");
      setFormData({
        numero: "",
        tipo: "",
        edificioId: "",
        proprietarioId: "",
        inquilinoId: "",
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Erro ao cadastrar fração:", err);
      toast.error("❌ Erro ao cadastrar fração.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-md border mb-6"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Nova Fração</h2>

      {/* Layout em colunas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Número
          </label>
          <input
            type="text"
            name="numero"
            value={formData.numero}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full text-gray-700 focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Tipo
          </label>
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full text-gray-700 focus:ring focus:ring-blue-200"
            required
          >
            <option value="">Selecione o Tipo</option>
            <option value="apartamento">Apartamento</option>
            <option value="loja">Loja</option>
            <option value="garagem">Garagem</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Edifício
          </label>
          <select
            name="edificioId"
            value={formData.edificioId}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full text-gray-700 focus:ring focus:ring-blue-200"
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

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Proprietário
          </label>
          <select
            name="proprietarioId"
            value={formData.proprietarioId}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full text-gray-700 focus:ring focus:ring-blue-200"
          >
            <option value="">Selecione o Proprietário</option>
            {proprietarios.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Inquilino
          </label>
          <select
            name="inquilinoId"
            value={formData.inquilinoId}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full text-gray-700 focus:ring focus:ring-blue-200"
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

      {/* Estado automático (visual informativo apenas) */}
      <p className="text-sm text-gray-600 mt-3">
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

export default FracaoForm;