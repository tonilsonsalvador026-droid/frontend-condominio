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

  // 🔥 LISTA DE CONDOMÍNIOS
  const [condominios, setCondominios] = useState([]);

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    data: "",
    condominioId: "",
  });

  // ---------------------------------------
  // BUSCAR CONDOMÍNIOS
  // ---------------------------------------
  const fetchCondominios = async () => {

    try {

      const res = await api.get("/condominios");

      setCondominios(res.data);

    } catch (err) {

      console.error(err);

      toast.error(
        "Erro ao carregar condomínios."
      );
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

    if (!formData.condominioId) {

      toast.error(
        "Selecione um condomínio."
      );

      return;
    }

    setLoading(true);

    try {

      const payload = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        data: formData.data,
        condominioId: Number(
          formData.condominioId
        ),
      };

      if (eventoEditando) {

        await api.put(
          `/eventos/${eventoEditando.id}`,
          payload
        );

        toast.success(
          "Evento atualizado com sucesso!"
        );

      } else {

        await api.post(
          "/eventos",
          payload
        );

        toast.success(
          "Evento criado com sucesso!"
        );
      }

      setFormData({
        titulo: "",
        descricao: "",
        data: "",
        condominioId: "",
      });

      onSuccess?.();

    } catch (err) {

      console.error(
        err.response?.data || err.message
      );

      toast.error(
        "Erro ao salvar evento."
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="w-full max-w-5xl mx-auto">

      <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-slate-200/40 shadow-2xl">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-10 pb-8 border-b border-slate-200/30">

          <div className="p-4 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl border border-blue-200/50">

            <CalendarPlus className="w-8 h-8 text-blue-600" />

          </div>

          <div>

            <h2 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">

              {eventoEditando
                ? "Editar Evento"
                : "Novo Evento"}

            </h2>

            <p className="text-xl text-slate-600 font-semibold mt-1">
              Preencha os dados do evento
            </p>

          </div>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* TITULO */}
            <div className="space-y-3">

              <label className="font-bold text-lg text-slate-800 flex items-center gap-2">

                <Type className="w-5 h-5" />

                Título

              </label>

              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                className="w-full px-6 py-5 bg-white/60 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 shadow-xl"
                required
              />

            </div>

            {/* CONDOMÍNIO */}
            <div className="space-y-3">

              <label className="font-bold text-lg text-slate-800 flex items-center gap-2">

                <Building2 className="w-5 h-5" />

                Condomínio

              </label>

              <select
                name="condominioId"
                value={formData.condominioId}
                onChange={handleChange}
                className="w-full px-6 py-5 bg-white/60 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 shadow-xl"
                required
              >

                <option value="">
                  Selecione o condomínio
                </option>

                {condominios.map((cond) => (

                  <option
                    key={cond.id}
                    value={cond.id}
                  >
                    {cond.nome}
                  </option>

                ))}

              </select>

            </div>

            {/* DATA */}
            <div className="space-y-3">

              <label className="font-bold text-lg text-slate-800 flex items-center gap-2">

                <CalendarDays className="w-5 h-5" />

                Data

              </label>

              <input
                type="date"
                name="data"
                value={formData.data}
                onChange={handleChange}
                className="w-full px-6 py-5 bg-white/60 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 shadow-xl"
                required
              />

            </div>

            {/* DESCRIÇÃO */}
            <div className="lg:col-span-2 space-y-3">

              <label className="font-bold text-lg text-slate-800 flex items-center gap-2">

                <FileText className="w-5 h-5" />

                Descrição

              </label>

              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows={5}
                placeholder="Ex: Evento no salão principal do edifício A às 18h"
                className="w-full px-6 py-5 bg-white/60 border border-slate-200 rounded-2xl resize-none focus:ring-4 focus:ring-blue-200 shadow-xl"
              />

            </div>

          </div>

          {/* BOTÕES */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-200/30">

            <button
              type="button"
              onClick={onCancel}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-slate-200 rounded-2xl font-bold hover:bg-slate-300 transition"
            >

              <ChevronLeft />

              Cancelar

            </button>

            <button
              type="submit"
              disabled={loading}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-white transition ${
                loading
                  ? "bg-gray-400"
                  : "bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
              }`}
            >

              <Save />

              {loading
                ? "Salvando..."
                : "Salvar Evento"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default EventosForm;
