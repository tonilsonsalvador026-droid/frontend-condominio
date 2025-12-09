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

  // Buscar lista de serviços extras
  const fetchServicosExtras = async () => {
    try {
      const res = await axios.get("http://localhost:4000/servicos-extras");
      setServicosExtras(res.data);
    } catch (err) {
      console.error("Erro ao carregar serviços extras:", err);
      toast.error("Erro ao carregar serviços extras");
    }
  };

  // Buscar lista de agendamentos
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

  // Submeter formulário
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
      toast.success("✅ Serviço agendado com sucesso!");
      setFormData({ data: "", observacoes: "", servicoExtraId: "" });
      fetchAgendamentos();
    } catch (err) {
      console.error("Erro ao agendar serviço:", err);
      toast.error("Erro ao agendar serviço");
    }
  };

  // Eliminar agendamento
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja eliminar este agendamento?"))
      return;
    try {
      await axios.delete(`http://localhost:4000/servicos-agendados/${id}`);
      toast.success("🗑️ Agendamento eliminado com sucesso!");
      fetchAgendamentos();
    } catch (err) {
      console.error("Erro ao eliminar agendamento:", err);
      toast.error("Erro ao eliminar agendamento");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">📅 Gestão de Serviços Agendados</h2>

      {/* Formulário */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 mb-8"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Serviço Extra</label>
            <select
              value={formData.servicoExtraId}
              onChange={(e) =>
                setFormData({ ...formData, servicoExtraId: e.target.value })
              }
              className="w-full border p-2 rounded"
              required
            >
              <option value="">-- Selecione --</option>
              {servicosExtras.map((srv) => (
                <option key={srv.id} value={srv.id}>
                  {srv.nome} ({srv.valor.toLocaleString("pt-PT", {
                    style: "currency",
                    currency: "EUR",
                  })})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium">Data</label>
            <input
              type="date"
              value={formData.data}
              onChange={(e) => setFormData({ ...formData, data: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="col-span-2">
            <label className="block font-medium">Observações</label>
            <textarea
              value={formData.observacoes}
              onChange={(e) =>
                setFormData({ ...formData, observacoes: e.target.value })
              }
              className="w-full border p-2 rounded"
              rows={3}
            ></textarea>
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          ➕ Agendar Serviço
        </button>
      </form>

      {/* Lista */}
      <h3 className="text-xl font-semibold mb-4">📋 Lista de Serviços Agendados</h3>
      <table className="w-full border-collapse bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3 border">Serviço</th>
            <th className="p-3 border">Data</th>
            <th className="p-3 border">Observações</th>
            <th className="p-3 border">Ações</th>
          </tr>
        </thead>
        <tbody>
          {agendamentos.map((ag) => (
            <tr key={ag.id} className="hover:bg-gray-50">
              <td className="p-3 border">{ag.servicoExtra?.nome}</td>
              <td className="p-3 border">
                {new Date(ag.data).toLocaleDateString("pt-PT")}
              </td>
              <td className="p-3 border">{ag.observacoes}</td>
              <td className="p-3 border">
                <button
                  onClick={() => handleDelete(ag.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  🗑️ Eliminar
                </button>
              </td>
            </tr>
          ))}
          {agendamentos.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center p-4 text-gray-500">
                Nenhum agendamento registado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ServicosAgendadosPage;