import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

const EventosPage = () => {
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    data: "",
    local: "",
  });

  const [eventos, setEventos] = useState([]);

  // Carregar lista de eventos
  const fetchEventos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/eventos");
      setEventos(res.data);
    } catch (err) {
      console.error("Erro ao carregar eventos:", err);
      toast.error("Erro ao carregar eventos");
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  // Submeter formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/eventos", formData);
      toast.success("✅ Evento criado com sucesso!");
      setFormData({ titulo: "", descricao: "", data: "", local: "" });
      fetchEventos();
    } catch (err) {
      console.error("Erro ao criar evento:", err);
      toast.error("Erro ao criar evento");
    }
  };

  // Eliminar evento
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja eliminar este evento?")) return;
    try {
      await axios.delete(`http://localhost:4000/eventos/${id}`);
      toast.success("🗑️ Evento eliminado com sucesso!");
      fetchEventos();
    } catch (err) {
      console.error("Erro ao eliminar evento:", err);
      toast.error("Erro ao eliminar evento");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">📅 Gestão de Eventos</h2>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Título</label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Local</label>
            <input
              type="text"
              value={formData.local}
              onChange={(e) => setFormData({ ...formData, local: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
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
            <label className="block font-medium">Descrição</label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className="w-full border p-2 rounded"
              rows={3}
            ></textarea>
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          ➕ Adicionar Evento
        </button>
      </form>

      {/* Lista de eventos */}
      <h3 className="text-xl font-semibold mb-4">📋 Lista de Eventos</h3>
      <table className="w-full border-collapse bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3 border">Título</th>
            <th className="p-3 border">Local</th>
            <th className="p-3 border">Data</th>
            <th className="p-3 border">Descrição</th>
            <th className="p-3 border">Ações</th>
          </tr>
        </thead>
        <tbody>
          {eventos.map((ev) => (
            <tr key={ev.id} className="hover:bg-gray-50">
              <td className="p-3 border">{ev.titulo}</td>
              <td className="p-3 border">{ev.local}</td>
              <td className="p-3 border">{new Date(ev.data).toLocaleDateString()}</td>
              <td className="p-3 border">{ev.descricao}</td>
              <td className="p-3 border">
                <button
                  onClick={() => handleDelete(ev.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  🗑️ Eliminar
                </button>
              </td>
            </tr>
          ))}
          {eventos.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center p-4 text-gray-500">
                Nenhum evento registado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EventosPage;