import React, { useEffect, useState } from "react";
import { X, Save } from "lucide-react";
import { toast } from "sonner";

const ServicoExtraFormModal = ({
  open,
  onClose,
  onSubmit,
  servicoEditando,
}) => {

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    valor: "",
  });

  useEffect(() => {

    if (servicoEditando) {
      setFormData({
        nome: servicoEditando.nome || "",
        descricao: servicoEditando.descricao || "",
        valor: servicoEditando.valor || "",
      });
    } else {
      setFormData({
        nome: "",
        descricao: "",
        valor: "",
      });
    }

  }, [servicoEditando]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nome || !formData.valor) {
      toast.error("Preencha os campos obrigatórios.");
      return;
    }

    await onSubmit({
      ...formData,
      valor: Number(formData.valor),
    });

    setFormData({
      nome: "",
      descricao: "",
      valor: "",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

        {/* HEADER */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-200">

          <div>
            <h2 className="text-3xl font-black text-slate-800">
              {servicoEditando ? "Editar Serviço" : "Novo Serviço"}
            </h2>

            <p className="text-slate-500 mt-1">
              Preencha as informações do serviço
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-3 rounded-2xl hover:bg-slate-100 transition"
          >
            <X size={22} />
          </button>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="p-8 space-y-6"
        >

          {/* NOME */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Nome
            </label>

            <input
              type="text"
              value={formData.nome}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  nome: e.target.value,
                })
              }
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-100"
              placeholder="Nome do serviço"
              required
            />
          </div>

          {/* VALOR */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Valor
            </label>

            <input
              type="number"
              step="0.01"
              value={formData.valor}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  valor: e.target.value,
                })
              }
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-100"
              placeholder="Valor do serviço"
              required
            />
          </div>

          {/* DESCRIÇÃO */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Descrição
            </label>

            <textarea
              rows="4"
              value={formData.descricao}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  descricao: e.target.value,
                })
              }
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-100"
              placeholder="Descrição do serviço"
            />
          </div>

          {/* BOTÕES */}
          <div className="flex justify-end gap-4 pt-4">

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 font-bold transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-bold flex items-center gap-2 hover:scale-[1.02] transition"
            >
              <Save size={18} />
              Salvar
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default ServicoExtraFormModal;
