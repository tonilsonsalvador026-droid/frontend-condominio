import React, { useEffect, useState } from "react";
import api from "../../api";
import { toast } from "sonner";

import {
  CalendarPlus,
  Save,
  ChevronLeft,
  CalendarDays,
  FileText,
  Type,
  Building2,
} from "lucide-react";

const EventosForm = ({
  onSuccess,
  onCancel,
  eventoEditando,
}) => {

  const [loading, setLoading] = useState(false);
  const [condominios, setCondominios] = useState([]);

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    data: "",
    condominioId: "",
  });

  // ---------------- CARREGAR CONDOMÍNIOS ----------------
  const fetchCondominios = async () => {
    try {
      const res = await api.get("/condominios");
      setCondominios(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar condomínios.");
    }
  };

  useEffect(() => {
    fetchCondominios();
  }, []);

  // ---------------- EDIT ----------------
  useEffect(() => {

    if (eventoEditando) {

      setFormData({
        titulo: eventoEditando.titulo || "",
        descricao: eventoEditando.descricao || "",
        data: eventoEditando.data
          ? eventoEditando.data.split("T")[0]
          : "",
        condominioId:
          eventoEditando.condominioId?.toString() || "",
      });

    } else {

      setFormData({
        titulo: "",
        descricao: "",
        data: "",
        condominioId: "",
      });
    }

  }, [eventoEditando]);

  // ---------------- CHANGE ----------------
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true);

    try {

      const payload = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        data: formData.data,
        condominioId: Number(formData.condominioId),
      };

      if (eventoEditando) {
        await api.put(`/eventos/${eventoEditando.id}`, payload);
        toast.success("Evento atualizado com sucesso!");
      } else {
        await api.post("/eventos", payload);
        toast.success("Evento criado com sucesso!");
      }

      setFormData({
        titulo: "",
        descricao: "",
        data: "",
        condominioId: "",
      });

      onSuccess?.();

    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Erro ao salvar evento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">

      <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border shadow-2xl">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-10 pb-8 border-b">

          <div className="p-4 bg-blue-100 rounded-2xl">
            <CalendarPlus className="w-8 h-8 text-blue-600" />
          </div>

          <div>
            <h2 className="text-3xl font-black">
              {eventoEditando ? "Editar Evento" : "Novo Evento"}
            </h2>
            <p className="text-slate-600">
              Preencha os dados do evento
            </p>
          </div>

        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* TÍTULO */}
          <input
            type="text"
            name="titulo"
            placeholder="Título"
            value={formData.titulo}
            onChange={handleChange}
            className="w-full p-4 border rounded-xl"
            required
          />

          {/* DATA */}
          <input
            type="date"
            name="data"
            value={formData.data}
            onChange={handleChange}
            className="w-full p-4 border rounded-xl"
            required
          />

          {/* CONDOMÍNIO DINÂMICO */}
          <select
            name="condominioId"
            value={formData.condominioId}
            onChange={handleChange}
            className="w-full p-4 border rounded-xl"
            required
          >
            <option value="">Seleciona condomínio</option>

            {condominios.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>

          {/* DESCRIÇÃO */}
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            className="w-full p-4 border rounded-xl"
            rows={4}
            placeholder="Descrição do evento (podes incluir local aqui se quiseres)"
          />

          {/* BOTÕES */}
          <div className="flex gap-4">

            <button
              type="button"
              onClick={onCancel}
              className="flex-1 p-4 bg-gray-200 rounded-xl"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 p-4 bg-blue-600 text-white rounded-xl"
            >
              {loading ? "Salvando..." : "Salvar Evento"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default EventosForm;
