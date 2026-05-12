import React, { useEffect, useState } from "react";
import {
  X,
  Save,
  FileText,
  DollarSign,
  ClipboardList,
} from "lucide-react";
import { toast } from "sonner";

const ServicoExtraFormModal = ({
  open,
  onClose,
  onSubmit,
  servicoEditando,
}) => {

  const [loading, setLoading] = useState(false);

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

    try {

      setLoading(true);

      await onSubmit({
        ...formData,
        valor: Number(formData.valor),
      });

      setFormData({
        nome: "",
        descricao: "",
        valor: "",
      });

    } catch (error) {
      toast.error("Erro ao salvar serviço.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">

      <div className="w-full max-w-4xl bg-white/40 backdrop-blur-xl rounded-3xl border border-slate-200/40 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

        {/* HEADER PREMIUM */}
        <div className="flex items-center justify-between gap-4 p-8 lg:p-10 border-b border-slate-200/30">

          <div className="flex items-center gap-4">

            <div className="p-4 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl border border-blue-200/50">
              <ClipboardList className="w-8 h-8 text-blue-600" />
            </div>

            <div>
              <h2 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
                {servicoEditando
                  ? "Editar Serviço"
                  : "Novo Serviço"}
              </h2>

              <p className="text-xl text-slate-600 font-semibold mt-1">
                Preencha as informações do serviço
              </p>
            </div>

          </div>

          <button
            onClick={onClose}
            className="p-4 rounded-2xl bg-white/60 hover:bg-white transition border border-slate-200/50 shadow-lg"
          >
            <X className="w-6 h-6 text-slate-700" />
          </button>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="p-8 lg:p-10 space-y-8"
        >

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* NOME */}
            <div className="space-y-3">

              <label className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Nome do Serviço
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
                placeholder="Digite o nome do serviço"
                className="w-full px-6 py-5 bg-white/60 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 shadow-xl outline-none"
                required
              />

            </div>

            {/* VALOR */}
            <div className="space-y-3">

              <label className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
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
                placeholder="0.00"
                className="w-full px-6 py-5 bg-white/60 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 shadow-xl outline-none"
                required
              />

            </div>

            {/* DESCRIÇÃO */}
            <div className="lg:col-span-2 space-y-3">

              <label className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <ClipboardList className="w-5 h-5" />
                Descrição
              </label>

              <textarea
                rows="5"
                value={formData.descricao}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    descricao: e.target.value,
                  })
                }
                placeholder="Descreva o serviço..."
                className="w-full px-6 py-5 bg-white/60 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 shadow-xl outline-none resize-none"
              />

            </div>

          </div>

          {/* BOTÕES */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-200/30">

            <button
              type="button"
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-slate-100/80 to-slate-200/80 rounded-2xl shadow-xl hover:-translate-y-1 transition font-bold"
            >
              <X className="w-5 h-5" />
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`flex-1 flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-bold text-white transition-all duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-emerald-600 hover:-translate-y-1 shadow-2xl"
              }`}
            >
              <Save className="w-5 h-5" />

              {loading
                ? "Salvando..."
                : servicoEditando
                  ? "Atualizar Serviço"
                  : "Salvar Serviço"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default ServicoExtraFormModal;
