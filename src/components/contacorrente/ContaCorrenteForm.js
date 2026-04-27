
// src/components/contacorrente/ContaCorrenteForm.js
import React, { useEffect, useState } from "react";
import api from "../../api";
import { toast } from "sonner";
import { formatCurrency } from "../../utils/formatCurrency";
import { Building2, Wallet, User, Save, X, Sparkles } from "lucide-react";

const ContaCorrenteForm = ({ onSave, editingConta, onCancel }) => {
  const [proprietarios, setProprietarios] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    proprietarioId: "",
    saldoInicial: "",
  });

  useEffect(() => {
    const fetchProprietarios = async () => {
      try {
        const res = await api.get("/proprietarios");
        setProprietarios(res.data);
      } catch (error) {
        console.error("Erro ao buscar proprietários:", error);
        toast.error("❌ Erro ao carregar proprietários.");
      }
    };
    fetchProprietarios();
  }, []);

  useEffect(() => {
    if (editingConta) {
      setFormData({
        proprietarioId: editingConta.proprietarioId || "",
        saldoInicial:
          editingConta.saldoInicial !== undefined
            ? formatCurrency(editingConta.saldoInicial)
            : "",
      });
    }
  }, [editingConta]);

  const normalizarValor = (valor) => {
    if (!valor) return 0;
    return parseFloat(
      valor
        .toString()
        .replace(/[^\d,]/g, "")
        .replace(",", ".")
    );
  };

  const handleSelectProprietario = async (e) => {
    const proprietarioId = e.target.value;
    setFormData((prev) => ({ ...prev, proprietarioId }));

    if (!proprietarioId) return;

    try {
      const res = await api.get(`/proprietarios/${proprietarioId}/total-pagos`);
      const totalPago = res.data.total || 0;
      setFormData((prev) => ({
        ...prev,
        saldoInicial: formatCurrency(totalPago),
      }));
    } catch (error) {
      console.error("Erro ao buscar saldo inicial:", error);
      toast.error("❌ Erro ao carregar saldo inicial do proprietário.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dados = {
      proprietarioId: parseInt(formData.proprietarioId),
      saldoInicial: normalizarValor(formData.saldoInicial),
    };

    try {
      if (editingConta) {
        await api.put(`/contas-correntes/${editingConta.id}`, dados);
        toast.success("✅ Conta corrente atualizada com sucesso!");
      } else {
        await api.post("/contas-correntes", dados);
        toast.success("✅ Conta corrente criada com sucesso!");
      }

      if (onSave) onSave();
      setFormData({ proprietarioId: "", saldoInicial: "" });
    } catch (error) {
      console.error("Erro ao salvar conta corrente:", error);
      toast.error("❌ Erro ao salvar conta corrente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form
        id="printArea"
        onSubmit={handleSubmit}
        className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-slate-200/50 shadow-2xl"
      >
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 mb-4">
              <Sparkles size={16} />
              <span className="text-sm font-semibold">Conta Corrente</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
              {editingConta ? "Editar Conta Corrente" : "Nova Conta Corrente"}
            </h2>
            <p className="text-slate-600 mt-2">
              Preencha os dados do proprietário e o saldo inicial.
            </p>
          </div>

          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
            <Building2 className="text-white" size={24} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="flex items-center gap-2 font-semibold text-slate-700">
              <User size={16} className="text-blue-600" />
              Proprietário
            </label>
            <select
              name="proprietarioId"
              value={formData.proprietarioId}
              onChange={handleSelectProprietario}
              required
              className="w-full px-5 py-4 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl focus:ring-4 focus:ring-blue-200/70 focus:border-blue-300/80 outline-none shadow-lg hover:shadow-xl transition-all text-slate-700"
            >
              <option value="">Selecione um proprietário</option>
              {proprietarios.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 font-semibold text-slate-700">
              <Wallet size={16} className="text-emerald-600" />
              Saldo Inicial
            </label>
            <input
              type="text"
              name="saldoInicial"
              value={formData.saldoInicial}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl focus:ring-4 focus:ring-emerald-200/70 focus:border-emerald-300/80 outline-none shadow-lg hover:shadow-xl transition-all text-slate-700"
              placeholder="Ex: 15 000,00 Kz"
            />
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-200/50 flex flex-col sm:flex-row gap-4 justify-end">
          {editingConta && (
            <button
              type="button"
              onClick={onCancel}
              className="px-8 py-4 rounded-2xl transition-all font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <X size={18} />
              Cancelar
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`px-8 py-4 rounded-2xl transition-all font-bold text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2 ${
              loading
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
            }`}
          >
            <Save size={18} />
            {loading ? "Salvando..." : editingConta ? "Atualizar Conta" : "Salvar Conta"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContaCorrenteForm;
