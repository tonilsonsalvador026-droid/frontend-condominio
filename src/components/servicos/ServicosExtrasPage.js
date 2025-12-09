import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

const ServicosExtrasPage = () => {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    valor: "",
  });

  const [servicos, setServicos] = useState([]);

  // Carregar lista de serviços extras
  const fetchServicos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/servicos-extras");
      setServicos(res.data);
    } catch (err) {
      console.error("Erro ao carregar serviços extras:", err);
      toast.error("Erro ao carregar serviços extras");
    }
  };

  useEffect(() => {
    fetchServicos();
  }, []);

  // Submeter formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/servicos-extras", {
        ...formData,
        valor: parseFloat(formData.valor),
      });
      toast.success("✅ Serviço extra adicionado com sucesso!");
      setFormData({ nome: "", descricao: "", valor: "" });
      fetchServicos();
    } catch (err) {
      console.error("Erro ao adicionar serviço extra:", err);
      toast.error("Erro ao adicionar serviço extra");
    }
  };

  // Eliminar serviço
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja eliminar este serviço?")) return;
    try {
      await axios.delete(`http://localhost:4000/servicos-extras/${id}`);
      toast.success("🗑️ Serviço extra eliminado com sucesso!");
      fetchServicos();
    } catch (err) {
      console.error("Erro ao eliminar serviço extra:", err);
      toast.error("Erro ao eliminar serviço extra");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">⚙️ Gestão de Serviços Extras</h2>

      {/* Formulário */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 mb-8"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Nome</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) =>
                setFormData({ ...formData, nome: e.target.value })
              }
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Valor (€)</label>
            <input
              type="number"
              step="0.01"
              value={formData.valor}
              onChange={(e) =>
                setFormData({ ...formData, valor: e.target.value })
              }
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="col-span-2">
            <label className="block font-medium">Descrição</label>
            <textarea
              value={formData.descricao}
              onChange={(e) =>
                setFormData({ ...formData, descricao: e.target.value })
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
          ➕ Adicionar Serviço
        </button>
      </form>

      {/* Lista de serviços */}
      <h3 className="text-xl font-semibold mb-4">📋 Lista de Serviços Extras</h3>
      <table className="w-full border-collapse bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3 border">Nome</th>
            <th className="p-3 border">Valor</th>
            <th className="p-3 border">Descrição</th>
            <th className="p-3 border">Ações</th>
          </tr>
        </thead>
        <tbody>
          {servicos.map((srv) => (
            <tr key={srv.id} className="hover:bg-gray-50">
              <td className="p-3 border">{srv.nome}</td>
              <td className="p-3 border">
                {srv.valor.toLocaleString("pt-PT", {
                  style: "currency",
                  currency: "EUR",
                })}
              </td>
              <td className="p-3 border">{srv.descricao}</td>
              <td className="p-3 border">
                <button
                  onClick={() => handleDelete(srv.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  🗑️ Eliminar
                </button>
              </td>
            </tr>
          ))}
          {servicos.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center p-4 text-gray-500">
                Nenhum serviço extra registado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ServicosExtrasPage;