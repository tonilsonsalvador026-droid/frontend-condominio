// src/components/servicos/ServicosAgendadosForm.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { CalendarPlus, Save, X } from "lucide-react";

const ServicosAgendadosForm = ({
  onSuccess,
  onCancel,
  agendamentoEditando,
}) => {
  const [servicosExtras, setServicosExtras] = useState([]);

  const [formData, setFormData] = useState({
    data: "",
    observacoes: "",
    servicoExtraId: "",
  });

  // Buscar serviços extras
  const fetchServicosExtras = async () => {
    try {
      const res = await axios.get("http://localhost:4000/servicos-extras");
      setServicosExtras(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar serviços extras.");
    }
  };

  useEffect(() => {
    fetchServicosExtras();
  }, []);

  // Preencher formulário ao editar
  useEffect(() => {
    if (agendamentoEditando) {
      setFormData({
        data: agendamentoEditando.data
          ? agendamentoEditando.data.split("T")[0]
          : "",
        observacoes: agendamentoEditando.observacoes || "",
        servicoExtraId:
          agendamentoEditando.servicoExtraId?.toString() || "",
      });
    }
  }, [agendamentoEditando]);

  // Alterar campos
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submeter formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.servicoExtraId) {
      toast.error("Selecione um serviço extra.");
      return;
    }

    try {
      const payload = {
        ...formData,
        servicoExtraId: parseInt(formData.servicoExtraId, 10),
      };

      // EDITAR
      if (agendamentoEditando) {
        await axios.put(
          `http://localhost:4000/servicos-agendados/${agendamentoEditando.id}`,
          payload
        );

        toast.success("Agendamento atualizado com sucesso!");
      }

      // NOVO
      else {
        await axios.post(
          "http://localhost:4000/servicos-agendados",
          payload
        );

        toast.success("Serviço agendado com sucesso!");
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
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-slate-200 shadow-2xl">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">

        <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
          <CalendarPlus className="text-blue-700" size={28} />
        </div>

        <div>
          <h2 className="text-3xl font-black text-slate-800">
            {agendamentoEditando
              ? "Editar Agendamento"
              : "Novo Agendamento"}
          </h2>

          <p className="text-slate-500 mt-1">
            Gestão completa de serviços agendados.
          </p>
        </div>

      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* SERVIÇO */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Serviço Extra
            </label>

            <select
              name="servicoExtraId"
              value={formData.servicoExtraId}
              onChange={handleChange}
              className="w-full px-4 py-4 rounded-2xl border border-slate-200 bg-white/80 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-200"
              required
            >
              <option value="">Selecione um serviço</option>

              {servicosExtras.map((srv) => (
                <option key={srv.id} value={srv.id}>
                  {srv.nome}
                </option>
              ))}
            </select>
          </div>

          {/* DATA */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Data do Serviço
            </label>

            <input
              type="date"
              name="data"
              value={formData.data}
              onChange={handleChange}
              className="w-full px-4 py-4 rounded-2xl border border-slate-200 bg-white/80 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-200"
              required
            />
          </div>

        </div>

        {/* OBSERVAÇÕES */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Observações
          </label>

          <textarea
            name="observacoes"
            value={formData.observacoes}
            onChange={handleChange}
            rows={5}
            placeholder="Digite observações do agendamento..."
            className="w-full px-4 py-4 rounded-2xl border border-slate-200 bg-white/80 shadow-sm resize-none focus:outline-none focus:ring-4 focus:ring-blue-200"
          />
        </div>

        {/* BOTÕES */}
        <div className="flex flex-wrap gap-4 pt-4">

          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xl transition"
          >
            <Save size={20} />

            {agendamentoEditando
              ? "Atualizar Agendamento"
              : "Guardar Agendamento"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition"
          >
            <X size={20} />
            Cancelar
          </button>

        </div>

      </form>

    </div>
  );
};

export default ServicosAgendadosForm;
