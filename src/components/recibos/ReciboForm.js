// src/components/recibos/ReciboForm.js
import React, { useState, useEffect } from "react";
import api from "../../api";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";
import { FileText, ChevronLeft, Save } from "lucide-react";

const ReciboForm = ({ onSuccess }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    numero: "",
    pagamentoId: "",
  });

  const [pagamentos, setPagamentos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPagamentos = async () => {
      try {
        const res = await api.get("/pagamentos");
        const dataArray = Array.isArray(res.data.data)
          ? res.data.data
          : Array.isArray(res.data)
          ? res.data
          : [];

        const pagamentosComValor = dataArray.map((p) => ({
          ...p,
          valorFormatado: formatCurrency(p.valor),
        }));

        setPagamentos(pagamentosComValor);
      } catch (err) {
        console.error(err);
        toast.error("Erro ao carregar pagamentos.");
      }
    };

    fetchPagamentos();

    if (id) {
      api
        .get(`/recibos/${id}`)
        .then((res) => {
          const r = res.data;
          setFormData({
            numero: r.numero,
            pagamentoId: r.pagamentoId,
          });
        })
        .catch((err) => {
          console.error(err);
          toast.error("Erro ao carregar recibo.");
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        numero: formData.numero,
        pagamentoId: parseInt(formData.pagamentoId),
      };

      if (id) {
        await api.put(`/recibos/${id}`, payload);
        toast.success("✅ Recibo atualizado com sucesso!");
      } else {
        await api.post("/recibos", payload);
        toast.success("✅ Recibo criado com sucesso!");
      }

      if (onSuccess) onSuccess();
      navigate("/recibos");
    } catch (err) {
      console.error(err);
      toast.error("❌ Erro ao salvar recibo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* CONTAINER PRINCIPAL */}
      <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-slate-200/40 shadow-2xl">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-10 pb-8 border-b border-slate-200/30">
          <div className="p-4 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl border border-blue-200/50">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-3xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
              {id ? "Editar Recibo" : "Novo Recibo"}
            </h2>
            <p className="text-slate-600 font-semibold mt-1">
              Preencha os dados do recibo
            </p>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Número */}
            <div className="space-y-3">
              <label className="font-bold text-lg text-slate-800">
                Número do Recibo
              </label>
              <input
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                required
                placeholder="Ex: 001"
                className="w-full px-6 py-5 bg-white/60 backdrop-blur-xl border border-slate-200/50 rounded-2xl focus:ring-4 focus:ring-blue-200/60 shadow-xl transition-all text-lg"
              />
            </div>

            {/* Pagamento */}
            <div className="space-y-3">
              <label className="font-bold text-lg text-slate-800">
                Pagamento
              </label>
              <select
                name="pagamentoId"
                value={formData.pagamentoId}
                onChange={handleChange}
                required
                className="w-full px-6 py-5 bg-white/60 backdrop-blur-xl border border-slate-200/50 rounded-2xl focus:ring-4 focus:ring-emerald-200/60 shadow-xl transition-all text-lg"
              >
                <option value="">Selecione um pagamento</option>
                {pagamentos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.proprietario?.nome || "Sem proprietário"} —{" "}
                    {p.valorFormatado} ({p.data ? new Date(p.data).toLocaleDateString() : "-"})
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* BOTÕES */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-200/30">

            {/* CANCELAR */}
            <button
              type="button"
              onClick={() => navigate("/recibos")}
              className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-slate-100/80 to-slate-200/80 rounded-2xl shadow-xl hover:-translate-y-1 transition-all font-bold text-slate-800"
            >
              <ChevronLeft className="w-5 h-5" />
              Cancelar
            </button>

            {/* SALVAR */}
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 flex items-center justify-center gap-3 px-8 py-5 rounded-2xl shadow-2xl transition-all font-bold ${
                loading
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:-translate-y-1"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Salvar Recibo
                </>
              )}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default ReciboForm;
