// src/components/fracoes/FracaoEditPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import { toast } from "sonner";

const FracaoEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [edRes, prRes, inqRes, fracaoRes] = await Promise.all([
          api.get("/edificios"),
          api.get("/proprietarios"),
          api.get("/inquilinos"),
          api.get(`/fracoes/${id}`),
        ]);

        setEdificios(edRes.data);
        setProprietarios(prRes.data);
        setInquilinos(inqRes.data);

        setFormData({
          numero: fracaoRes.data.numero || "",
          tipo: fracaoRes.data.tipo || "",
          edificioId: fracaoRes.data.edificioId || "",
          proprietarioId: fracaoRes.data.proprietarioId || "",
          inquilinoId: fracaoRes.data.inquilinoId || "",
        });
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        toast.error("Erro ao carregar dados da fração.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ["edificioId", "proprietarioId", "inquilinoId"].includes(name)
        ? value ? parseInt(value) : ""
        : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Preparar payload garantindo null se vazio
      const payload = {
        numero: formData.numero,
        tipo: formData.tipo,
        edificioId: formData.edificioId || null,
        proprietarioId: formData.proprietarioId || null,
        inquilinoId: formData.inquilinoId || null,
      };

      await api.put(`/fracoes/${id}`, payload);
      toast.success("✅ Fração atualizada com sucesso!");
      navigate("/fracoes");
    } catch (err) {
      console.error("Erro ao atualizar fração:", err);
      toast.error("❌ Erro ao atualizar fração.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-gray-600 p-4">Carregando...</p>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Editar Fração #{id}
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div className="md:col-span-2 mt-4">
          <button
            type="submit"
            disabled={saving}
            className={`px-5 py-2 rounded-lg transition text-white ${
              saving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {saving ? "Salvando..." : "Atualizar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FracaoEditPage;