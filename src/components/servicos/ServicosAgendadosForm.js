// src/components/servicos/ServicosAgendadosForm.js

import React, { useState, useEffect } from "react";
import api from "../../api";
import { toast } from "sonner";

import {
  CalendarPlus,
  Save,
  ChevronLeft,
  CalendarDays,
  FileText,
  ClipboardList,
} from "lucide-react";

const ServicosAgendadosForm = ({
  onSuccess,
  onCancel,
  agendamentoEditando,
}) => {

  const [loading, setLoading] = useState(false);

  const [servicosExtras, setServicosExtras] = useState([]);

  const [formData, setFormData] = useState({
    data: "",
    observacoes: "",
    servicoExtraId: "",
  });

  // BUSCAR SERVIÇOS EXTRAS
  const fetchServicosExtras = async () => {

    try {

const res = await api.get(
  "/servicos-extras"
);

      setServicosExtras(res.data);

    } catch (err) {

      console.error(err);

      toast.error("Erro ao carregar serviços extras.");
    }
  };

  useEffect(() => {
    fetchServicosExtras();
  }, []);

  // PREENCHER AO EDITAR
  useEffect(() => {

    if (agendamentoEditando) {

      setFormData({
        data: agendamentoEditando.data
          ? agendamentoEditando.data.split("T")[0]
          : "",

        observacoes:
          agendamentoEditando.observacoes || "",

        servicoExtraId:
          agendamentoEditando.servicoExtraId?.toString() || "",
      });

    } else {

      setFormData({
        data: "",
        observacoes: "",
        servicoExtraId: "",
      });
    }

  }, [agendamentoEditando]);

  // ALTERAR CAMPOS
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // SUBMIT
  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!formData.servicoExtraId) {
      toast.error("Selecione um serviço extra.");
      return;
    }

    setLoading(true);

    try {

      const payload = {
        ...formData,
        servicoExtraId: parseInt(
          formData.servicoExtraId,
          10
        ),
      };

      // EDITAR
      if (agendamentoEditando) {

await api.put(
  `/servicos-agendados/${agendamentoEditando.id}`,
  payload
);

        toast.success(
          "Agendamento atualizado com sucesso!"
        );

      }

      // NOVO
      else {

await api.post(
  "/servicos-agendados",
  payload
);

        toast.success(
          "Serviço agendado com sucesso!"
        );
      }

      setFormData({
        data: "",
        observacoes: "",
        servicoExtraId: "",
      });

      onSuccess?.();

    } catch (err) {

      console.error(err);

      toast.error("Erro ao salvar agendamento.");

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

              {agendamentoEditando
                ? "Editar Serviço Agendado"
                : "Novo Serviço Agendado"}

            </h2>

            <p className="text-xl text-slate-600 font-semibold mt-1">
              Preencha os dados do agendamento
            </p>

          </div>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* SERVIÇO EXTRA */}
            <div className="space-y-3">

              <label className="font-bold text-lg text-slate-800 flex items-center gap-2">

                <ClipboardList className="w-5 h-5" />

                Serviço Extra

              </label>

              <select
                name="servicoExtraId"
                value={formData.servicoExtraId}
                onChange={handleChange}
                className="w-full px-6 py-5 bg-white/60 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 shadow-xl"
                required
              >

                <option value="">
                  Selecione um serviço
                </option>

                {servicosExtras.map((srv) => (

                  <option
                    key={srv.id}
                    value={srv.id}
                  >
                    {srv.nome}
                  </option>

                ))}

              </select>

            </div>

            {/* DATA */}
            <div className="space-y-3">

              <label className="font-bold text-lg text-slate-800 flex items-center gap-2">

                <CalendarDays className="w-5 h-5" />

                Data do Serviço

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

            {/* OBSERVAÇÕES */}
            <div className="lg:col-span-2 space-y-3">

              <label className="font-bold text-lg text-slate-800 flex items-center gap-2">

                <FileText className="w-5 h-5" />

                Observações

              </label>

              <textarea
                name="observacoes"
                value={formData.observacoes}
                onChange={handleChange}
                rows="5"
                placeholder="Digite observações do agendamento..."
                className="w-full px-6 py-5 bg-white/60 border border-slate-200 rounded-2xl resize-none focus:ring-4 focus:ring-blue-200 shadow-xl"
              />

            </div>

          </div>

          {/* BOTÕES */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-200/30">

            {/* CANCELAR */}
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-slate-200 rounded-2xl font-bold hover:bg-slate-300 transition"
            >

              <ChevronLeft />

              Cancelar

            </button>

            {/* SALVAR */}
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
                : agendamentoEditando
                ? "Atualizar Agendamento"
                : "Salvar Agendamento"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default ServicosAgendadosForm;
