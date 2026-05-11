// src/components/contacorrente/MovimentoForm.js
import React, { useEffect, useState } from "react";
import api from "../../api";
import { toast } from "sonner";
import { formatCurrency } from "../../utils/formatCurrency";
import { Calendar, FileText, User, ChevronLeft, Save } from "lucide-react";

const MovimentoForm = ({ onSuccess, onCancel }) => {
  const [proprietarios, setProprietarios] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    proprietarioId: "",
    contaCorrenteId: "",
    data: "",
    descricao: "",
    tipo: "DEBITO",
    valor: "",
  });

  useEffect(() => {
    const fetchProprietarios = async () => {
      try {
        const res = await api.get("/proprietarios");
        setProprietarios(res.data || []);
      } catch (error) {
        toast.error("Erro ao carregar proprietários.");
      }
    };
    fetchProprietarios();
  }, []);

  const handleSelectProprietario = async (e) => {
    const proprietarioId = e.target.value;
    setForm((prev) => ({ ...prev, proprietarioId, contaCorrenteId: "" }));

    if (!proprietarioId) return;

    try {
      const res = await api.get(`/contas-correntes/proprietario/${proprietarioId}`);
      if (res.data?.id) {
        setForm((prev) => ({ ...prev, contaCorrenteId: res.data.id }));
        toast.success(`Conta encontrada para ${res.data.proprietario?.nome || ""}`);
      } else {
        toast.error("Este proprietário não possui conta.");
      }
    } catch {
      toast.error("Erro ao buscar conta.");
    }
  };

  const normalizarValor = (valor) => {
    if (!valor) return 0;
    return parseFloat(valor.toString().replace(/\s/g, "").replace(/\./g, "").replace(",", "."));
  };

  const handleChangeValor = (e) => {
    let valor = e.target.value.replace(/[^\d,]/g, "");
    setForm((prev) => ({ ...prev, valor }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.contaCorrenteId) {
      toast.error("Selecione um proprietário com conta.");
      return;
    }

    if (!form.valor || normalizarValor(form.valor) <= 0) {
      toast.error("Valor inválido.");
      return;
    }

    setLoading(true);

try {
  const payload = {
    descricao: form.descricao,
    tipo: form.tipo.toLowerCase(),
    valor: normalizarValor(form.valor),
    data: form.data || new Date().toISOString(),
  };

  await api.post(`/contas-correntes/${form.contaCorrenteId}/movimentos`, payload);

  toast.success("Movimento registrado!");

  setForm({
    proprietarioId: "",
    contaCorrenteId: "",
    data: "",
    descricao: "",
    tipo: "DEBITO",
    valor: "",
  });

  onSuccess?.();

} catch (error) {

  const mensagem =
    error?.response?.data?.error ||
    "Erro ao registrar movimento.";

  toast.error(mensagem);

} finally {
  setLoading(false);
}
  };

  return (
    <div className="w-full max-w-4xl mx-auto">

      <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-slate-200/40 shadow-2xl">

        {/* HEADER AZUL (CORRIGIDO) */}
        <div className="flex items-center gap-4 mb-10 pb-8 border-b border-slate-200/30">
          <div className="p-4 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl border border-blue-200/50">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>

          <div>
            <h2 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
              Novo Movimento
            </h2>
            <p className="text-xl text-slate-600 font-semibold mt-1">
              Registre um débito ou crédito
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Proprietário */}
            <div className="space-y-3">
              <label className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <User className="w-5 h-5" />
                Proprietário
              </label>
              <select
                name="proprietarioId"
                value={form.proprietarioId}
                onChange={handleSelectProprietario}
                required
                className="w-full px-6 py-5 bg-white/60 border rounded-2xl shadow-xl"
              >
                <option value="">Selecione...</option>
                {proprietarios.map((p) => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
            </div>

            {/* Data */}
            <div className="space-y-3">
              <label className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Data
              </label>
              <input
                type="date"
                name="data"
                value={form.data}
                onChange={handleChange}
                required
                className="w-full px-6 py-5 bg-white/60 border rounded-2xl shadow-xl"
              />
            </div>

            {/* Descrição */}
            <div className="lg:col-span-2 space-y-3">
              <label className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Descrição
              </label>
              <input
                type="text"
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                required
                className="w-full px-6 py-5 bg-white/60 border rounded-2xl shadow-xl"
              />
            </div>

            {/* Tipo */}
            <div className="space-y-3">
              <label className="font-bold text-lg text-slate-800">Tipo</label>
              <select
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                className="w-full px-6 py-5 bg-white/60 border rounded-2xl shadow-xl"
              >
                <option value="DEBITO">Débito</option>
                <option value="CREDITO">Crédito</option>
              </select>
            </div>

            {/* Valor */}
            <div className="space-y-3">
              <label className="font-bold text-lg text-slate-800">Valor (Kz)</label>
              <input
                type="text"
                name="valor"
                value={form.valor ? formatCurrency(normalizarValor(form.valor)).replace("Kz","").trim() : ""}
                onChange={handleChangeValor}
                required
                className="w-full px-6 py-5 bg-white/60 border rounded-2xl shadow-xl text-right"
              />
            </div>

          </div>

          {/* BOTÕES */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-200/30">

            <button
              type="button"
              onClick={onCancel} // ✅ AGORA FUNCIONA
              className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-slate-100/80 to-slate-200/80 rounded-2xl shadow-xl hover:-translate-y-1 transition font-bold"
            >
              <ChevronLeft className="w-5 h-5" />
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`flex-1 flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-bold ${
                loading
                  ? "bg-gray-400"
                  : "bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:-translate-y-1"
              }`}
            >
              {loading ? "Salvando..." : (
                <>
                  <Save className="w-5 h-5" />
                  Salvar Movimento
                </>
              )}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default MovimentoForm;
