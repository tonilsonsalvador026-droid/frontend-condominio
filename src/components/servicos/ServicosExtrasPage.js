import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Sparkles,
  Plus,
  Trash2,
  Search,
  Wallet,
  FileText,
  BadgeInfo,
  CircleAlert,
} from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-slate-200/50 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 mb-4">
                <Sparkles size={16} />
                <span className="text-sm font-semibold">Serviços Extras</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
                Gestão de Serviços Extras
              </h1>
              <p className="text-slate-600 mt-3 text-lg">
                Crie, visualize e remova serviços adicionais do sistema.
              </p>
            </div>

            <div className="w-full lg:w-[420px]">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Pesquisar por nome, descrição ou valor..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-5 py-4 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl focus:ring-4 focus:ring-blue-200/70 focus:border-blue-300/80 outline-none shadow-lg hover:shadow-xl transition-all text-slate-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-slate-200/50 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
              <Plus className="text-white" size={20} />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800">
              Novo Serviço Extra
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="block font-semibold text-slate-700">
                Nome
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                className="w-full px-5 py-4 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl focus:ring-4 focus:ring-blue-200/70 focus:border-blue-300/80 outline-none shadow-lg hover:shadow-xl transition-all text-slate-700"
                placeholder="Ex: Limpeza Extra"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="block font-semibold text-slate-700">
                Valor (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.valor}
                onChange={(e) =>
                  setFormData({ ...formData, valor: e.target.value })
                }
                className="w-full px-5 py-4 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl focus:ring-4 focus:ring-emerald-200/70 focus:border-emerald-300/80 outline-none shadow-lg hover:shadow-xl transition-all text-slate-700"
                placeholder="Ex: 15.00"
                required
              />
            </div>

            <div className="lg:col-span-2 space-y-3">
              <label className="block font-semibold text-slate-700">
                Descrição
              </label>
              <textarea
                value={formData.descricao}
                onChange={(e) =>
                  setFormData({ ...formData, descricao: e.target.value })
                }
                className="w-full px-5 py-4 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl focus:ring-4 focus:ring-indigo-200/70 focus:border-indigo-300/80 outline-none shadow-lg hover:shadow-xl transition-all text-slate-700 min-h-[130px] resize-none"
                placeholder="Descreve o serviço extra..."
                rows={4}
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-bold flex items-center gap-3"
            >
              <Plus size={18} />
              Adicionar Serviço
            </button>
          </div>
        </form>

        {/* Lista */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-slate-200/50 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 shadow-lg">
              <FileText className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-800">
                Lista de Serviços Extras
              </h2>
              <p className="text-slate-600">
                {filteredServicos.length} serviço(s) encontrado(s)
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-200/50 shadow-lg">
            <table className="w-full min-w-[760px] text-sm md:text-base">
              <thead className="bg-slate-50">
                <tr className="text-left text-slate-700">
                  <th className="p-4 font-bold">Nome</th>
                  <th className="p-4 font-bold">Valor</th>
                  <th className="p-4 font-bold">Descrição</th>
                  <th className="p-4 font-bold">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {filteredServicos.map((srv) => (
                  <tr
                    key={srv.id}
                    className="border-t border-slate-100 hover:bg-blue-50/40 transition-colors"
                  >
                    <td className="p-4 font-semibold text-slate-800">
                      {srv.nome}
                    </td>
                    <td className="p-4 text-slate-700">
                      {Number(srv.valor || 0).toLocaleString("pt-PT", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </td>
                    <td className="p-4 text-slate-700">
                      {srv.descricao || "—"}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleDelete(srv.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 shadow-lg hover:shadow-xl transition-all"
                      >
                        <Trash2 size={16} />
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredServicos.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="p-10 text-center text-slate-500 bg-white"
                    >
                      Nenhum serviço extra registado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicosExtrasPage;
