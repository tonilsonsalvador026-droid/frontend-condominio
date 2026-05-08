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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER LIMPO */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-slate-200/50 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div>
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
                Gestão de Serviços Extras
              </h1>

              <p className="text-slate-600 mt-3 text-lg">
                Crie, visualize e remova serviços adicionais do sistema.
              </p>
            </div>

            <div className="w-full lg:w-[420px]">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Pesquisar por nome, descrição ou valor..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-5 py-4 bg-white/80 border border-slate-200/60 rounded-2xl focus:ring-4 focus:ring-blue-200/70 outline-none"
                />
              </div>
            </div>

          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-slate-200/50 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600">
              <Plus className="text-white" size={20} />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800">
              Novo Serviço
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <input
              type="text"
              value={formData.nome}
              onChange={(e) =>
                setFormData({ ...formData, nome: e.target.value })
              }
              placeholder="Nome"
              className="w-full px-5 py-4 border rounded-2xl"
              required
            />

            <input
              type="number"
              step="0.01"
              value={formData.valor}
              onChange={(e) =>
                setFormData({ ...formData, valor: e.target.value })
              }
              placeholder="Valor"
              className="w-full px-5 py-4 border rounded-2xl"
              required
            />

            <textarea
              value={formData.descricao}
              onChange={(e) =>
                setFormData({ ...formData, descricao: e.target.value })
              }
              placeholder="Descrição"
              className="lg:col-span-2 w-full px-5 py-4 border rounded-2xl min-h-[120px]"
            />

          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-bold flex items-center gap-2"
            >
              <Plus size={18} />
              Adicionar Serviço
            </button>
          </div>
        </form>

        {/* LISTA */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-slate-200/50 shadow-2xl">

          <div className="flex items-center gap-3 mb-8">
            <FileText className="text-slate-800" size={20} />
            <h2 className="text-2xl md:text-3xl font-black text-slate-800">
              Lista de Serviços
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="text-left">
                  <th>Nome</th>
                  <th>Valor</th>
                  <th>Descrição</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {filteredServicos.map((srv) => (
                  <tr key={srv.id}>
                    <td>{srv.nome}</td>
                    <td>
                      {Number(srv.valor || 0).toLocaleString("pt-PT", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </td>
                    <td>{srv.descricao || "—"}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(srv.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-xl"
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
    </div>
  );
};

export default ServicosExtrasPage;
