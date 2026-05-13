import React, { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

import ServicoExtraTable from "./ServicoExtraTable";
import ServicoExtraFormModal from "./ServicoExtraFormModal";

import {
  listarServicosExtras,
  criarServicoExtra,
  editarServicoExtra,
  eliminarServicoExtra,
} from "./servicos.api";

const ServicosExtrasPage = () => {

  const [servicos, setServicos] = useState([]);
  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);

  const [servicoEditando, setServicoEditando] = useState(null);

  // =========================
  // LISTAR
  // =========================
  const fetchServicos = async () => {
    try {
      const data = await listarServicosExtras();
      setServicos(data || []);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar serviços.");
    }
  };

  useEffect(() => {
    fetchServicos();
  }, []);

  // =========================
  // CRIAR / EDITAR
  // =========================
  const handleSubmit = async (dados) => {

    try {

      // EDITAR
      if (servicoEditando) {

        await editarServicoExtra(
          servicoEditando.id,
          dados
        );

        toast.success("Serviço atualizado com sucesso!");

      } else {

        // CRIAR
        await criarServicoExtra(dados);

        toast.success("Serviço criado com sucesso!");
      }

      setOpenModal(false);
      setServicoEditando(null);

      fetchServicos();

    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar serviço.");
    }
  };

  // =========================
  // ELIMINAR
  // =========================
  const handleDelete = async (id) => {

    if (
      !window.confirm(
        "Tem certeza que deseja eliminar este serviço?"
      )
    ) return;

    try {

      await eliminarServicoExtra(id);

      toast.success("Serviço eliminado!");

      fetchServicos();

    } catch (error) {
      console.error(error);
      toast.error("Erro ao eliminar serviço.");
    }
  };

  // =========================
  // EDITAR
  // =========================
  const handleEdit = (servico) => {
    setServicoEditando(servico);
    setOpenModal(true);
  };

  // =========================
  // NOVO
  // =========================
  const handleNovo = () => {
    setServicoEditando(null);
    setOpenModal(true);
  };

  // =========================
  // PESQUISA
  // =========================
  const filteredServicos = servicos.filter((srv) => {

    const q = search.toLowerCase();

    return (
      String(srv.nome || "")
        .toLowerCase()
        .includes(q)

      ||

      String(srv.descricao || "")
        .toLowerCase()
        .includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-8">

      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-slate-200/50 shadow-2xl">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            {/* TITULO */}
            <div>

              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
                Serviços Extras
              </h1>

              <p className="text-slate-600 mt-3 text-lg">
                Gestão completa de serviços adicionais do sistema.
              </p>

            </div>

            {/* AÇÕES */}
            <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">

              {/* PESQUISA */}
              <div className="relative w-full md:w-[320px]">

                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />

                <input
                  type="text"
                  placeholder="Pesquisar serviço..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="w-full pl-11 pr-4 py-4 rounded-2xl border border-slate-200 bg-white/80 focus:outline-none focus:ring-4 focus:ring-blue-100"
                />

              </div>

              {/* BOTÃO NOVO */}
              <button
                onClick={handleNovo}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-bold flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] transition"
              >
                <Plus size={20} />
                Novo Serviço
              </button>

            </div>

          </div>

        </div>

        {/* TABELA */}
        <ServicoExtraTable
          servicos={filteredServicos}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />

      </div>

      {/* MODAL */}
      <ServicoExtraFormModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setServicoEditando(null);
        }}
        onSubmit={handleSubmit}
        servicoEditando={servicoEditando}
      />

    </div>
  );
};

export default ServicosExtrasPage;
