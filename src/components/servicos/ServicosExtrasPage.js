import React, { useState, useEffect } from "react";
import api from "../../api";
import { toast } from "sonner";
import { Plus, Trash2, Search, FileText } from "lucide-react";

const ServicosExtrasPage = () => {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    valor: "",
  });

  const [servicos, setServicos] = useState([]);
  const [search, setSearch] = useState("");

  const fetchServicos = async () => {
    try {
      const res = await api.get("/servicos-extras");
      setServicos(res.data);
    } catch (err) {
      console.error("Erro ao carregar serviços extras:", err);
      toast.error("Erro ao carregar serviços extras");
    }
  };

  useEffect(() => {
    fetchServicos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/servicos-extras", {
        ...formData,
        valor: Number(formData.valor) || 0,
      });

      toast.success("Serviço extra adicionado com sucesso!");
      setFormData({ nome: "", descricao: "", valor: "" });
      fetchServicos();
    } catch (err) {
      console.error("Erro ao adicionar serviço extra:", err);
      toast.error("Erro ao adicionar serviço extra");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja eliminar este serviço?")) return;

    try {
      await api.delete(`/servicos-extras/${id}`);
      toast.success("Serviço extra eliminado com sucesso!");
      fetchServicos();
    } catch (err) {
      console.error("Erro ao eliminar serviço extra:", err);
      toast.error("Erro ao eliminar serviço extra");
    }
  };

  const filteredServicos = servicos.filter((srv) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;

    return (
      String(srv.nome || "").toLowerCase().includes(q) ||
      String(srv.descricao || "").toLowerCase().includes(q) ||
      String(srv.valor || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 w-full">

      {/* HEADER PREMIUM */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/40 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
              Serviços Extras
            </h1>
            <p className="text-slate-600 mt-2 text-lg font-medium">
              Gestão de serviços adicionais do sistema
            </p>
          </div>

          {/* SEARCH */}
          <div className="w-full lg:w-[420px] relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Pesquisar serviços..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-5 py-4 bg-white/80 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 outline-none"
            />
          </div>

        </div>
      </div>

      {/* FORM */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border shadow-2xl">

        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600">
            <Plus className="text-white" size={20} />
          </div>
          <h2 className="text-2xl font-black text-slate-800">
            Novo Serviço
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <input
            type="text"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            placeholder="Nome do serviço"
            className="w-full px-5 py-4 border border-slate-200 rounded-2xl bg-white/70"
            required
          />

          <input
            type="number"
            step="0.01"
            value={formData.valor}
            onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
            placeholder="Valor"
            className="w-full px-5 py-4 border border-slate-200 rounded-2xl bg-white/70"
            required
          />

          <textarea
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            placeholder="Descrição"
            className="lg:col-span-2 w-full px-5 py-4 border border-slate-200 rounded-2xl bg-white/70 min-h-[120px]"
          />

          <div className="lg:col-span-2 flex justify-end pt-4">
            <button
              type="submit"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-bold flex items-center gap-2 hover:-translate-y-1 transition"
            >
              <Plus size={18} />
              Adicionar Serviço
            </button>
          </div>

        </form>
      </div>

      {/* LISTA */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border shadow-2xl">

        <div className="flex items-center gap-3 mb-6">
          <FileText className="text-slate-800" size={20} />
          <h2 className="text-2xl font-black text-slate-800">
            Lista de Serviços
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">

            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="p-3 text-left">Nome</th>
                <th className="p-3 text-left">Valor</th>
                <th className="p-3 text-left">Descrição</th>
                <th className="p-3 text-center">Ações</th>
              </tr>
            </thead>

            <tbody>
              {filteredServicos.map((srv) => (
                <tr key={srv.id} className="border-t hover:bg-slate-50">

                  <td className="p-3 font-medium">{srv.nome}</td>

                  <td className="p-3">
                    {Number(srv.valor || 0).toLocaleString("pt-PT", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </td>

                  <td className="p-3 text-slate-600">
                    {srv.descricao || "—"}
                  </td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleDelete(srv.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-xl hover:scale-105 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>

    </div>
  );
};

export default ServicosExtrasPage;
