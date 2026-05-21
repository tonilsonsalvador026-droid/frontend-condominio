import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

const ServicosAgendadosPage = () => {
  const [formData, setFormData] = useState({
    data: "",
    observacoes: "",
    servicoExtraId: "",
  });

  const [agendamentos, setAgendamentos] = useState([]);
  const [servicosExtras, setServicosExtras] = useState([]);

  const fetchServicosExtras = async () => {
    try {
      const res = await axios.get("http://localhost:4000/servicos-extras");
      setServicosExtras(res.data);
    } catch (err) {
      console.error("Erro ao carregar serviços extras:", err);
      toast.error("Erro ao carregar serviços extras");
    }
  };

  const fetchAgendamentos = async () => {
    try {
      const res = await axios.get("http://localhost:4000/servicos-agendados");
      setAgendamentos(res.data);
    } catch (err) {
      console.error("Erro ao carregar agendamentos:", err);
      toast.error("Erro ao carregar agendamentos");
    }
  };

  useEffect(() => {
    fetchServicosExtras();
    fetchAgendamentos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.servicoExtraId) {
      toast.error("Selecione um serviço extra!");
      return;
    }

    try {
      await axios.post("http://localhost:4000/servicos-agendados", {
        ...formData,
        servicoExtraId: parseInt(formData.servicoExtraId, 10),
      });

      toast.success("Serviço agendado com sucesso!");

      setFormData({ data: "", observacoes: "", servicoExtraId: "" });
      fetchAgendamentos();
    } catch (err) {
      console.error("Erro ao agendar serviço:", err);
      toast.error("Erro ao agendar serviço");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja eliminar este agendamento?"))
      return;

    try {
      await axios.delete(`http://localhost:4000/servicos-agendados/${id}`);
      toast.success("Agendamento eliminado com sucesso!");
      fetchAgendamentos();
    } catch (err) {
      console.error("Erro ao eliminar agendamento:", err);
      toast.error("Erro ao eliminar agendamento");
    }
  };

  return (
    <div className="space-y-8">

      {/* HEADER PREMIUM */}
      <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/40 shadow-2xl">
        <h2 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
          Serviços Agendados
        </h2>

        <p className="text-slate-600 mt-2">
          Gestão de agendamentos de serviços extras.
        </p>
      </div>

      {/* FORM CARD */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Serviço Extra */}
            <div>
              <label className="block font-semibold text-slate-700 mb-2">
                Serviço Extra
              </label>

              <select
                value={formData.servicoExtraId}
                onChange={(e) =>
                  setFormData({ ...formData, servicoExtraId: e.target.value })
                }
                className="w-full px-4 py-3 rounded-2xl border bg-white/70 shadow focus:ring-4 focus:ring-blue-200"
                required
              >
                <option value="">-- Selecione --</option>
                {servicosExtras.map((srv) => (
                  <option key={srv.id} value={srv.id}>
                    {srv.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Data */}
            <div>
              <label className="block font-semibold text-slate-700 mb-2">
                Data
              </label>

              <input
                type="date"
                value={formData.data}
                onChange={(e) =>
                  setFormData({ ...formData, data: e.target.value })
                }
                className="w-full px-4 py-3 rounded-2xl border bg-white/70 shadow focus:ring-4 focus:ring-blue-200"
                required
              />
            </div>

            {/* Observações */}
            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-2">
                Observações
              </label>

              <textarea
                value={formData.observacoes}
                onChange={(e) =>
                  setFormData({ ...formData, observacoes: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-3 rounded-2xl border bg-white/70 shadow focus:ring-4 focus:ring-blue-200"
              />
            </div>

          </div>

          <button
            type="submit"
            className="px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl transition"
          >
            ➕ Agendar Serviço
          </button>

        </form>
      </div>

      {/* LISTA CARD */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border shadow-xl overflow-x-auto">

        <h3 className="text-2xl font-bold text-slate-800 mb-6">
          Lista de Serviços Agendados
        </h3>

        <table className="w-full text-sm md:text-base">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="p-3 text-left">Serviço</th>
              <th className="p-3 text-left">Data</th>
              <th className="p-3 text-left">Observações</th>
              <th className="p-3 text-center">Ações</th>
            </tr>
          </thead>

          <tbody>
            {agendamentos.map((ag) => (
              <tr key={ag.id} className="border-t hover:bg-slate-50 transition">

                <td className="p-3 font-semibold">
                  {ag.servicoExtra?.nome}
                </td>

                <td className="p-3">
                  {new Date(ag.data).toLocaleDateString("pt-PT")}
                </td>

                <td className="p-3 text-slate-600">
                  {ag.observacoes}
                </td>

                <td className="p-3 text-center">
                  <button
                    onClick={() => handleDelete(ag.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition"
                  >
                    🗑️ Eliminar
                  </button>
                </td>

              </tr>
            ))}

            {agendamentos.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-6 text-slate-400">
                  Nenhum agendamento registado.
                </td>
              </tr>
            )}
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default ServicosAgendadosPage;
