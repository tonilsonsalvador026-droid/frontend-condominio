// src/components/pagamentos/PagamentoForm.js
import React, { useState, useEffect } from "react";
import api from "../../api";
import { toast } from "sonner";
import { formatCurrency } from "../../utils/formatCurrency";
import { Save, ChevronLeft, DollarSign } from "lucide-react";

const PagamentoForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    valor: "",
    descricao: "",
    estado: "PENDENTE",
    data: new Date().toISOString().split("T")[0],
    vencimento: "",
    userId: "",
    fracaoId: "",
    proprietarioId: "",
    inquilinoId: "",
  });

  const [users, setUsers] = useState([]);
  const [fracoes, setFracoes] = useState([]);
  const [proprietarios, setProprietarios] = useState([]);
  const [inquilinos, setInquilinos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, fracoesRes, proprietariosRes, inquilinosRes] =
          await Promise.all([
            api.get("/users"),
            api.get("/fracoes"),
            api.get("/proprietarios"),
            api.get("/inquilinos"),
          ]);

        setUsers(usersRes.data);
        setFracoes(fracoesRes.data);
        setProprietarios(proprietariosRes.data);
        setInquilinos(inquilinosRes.data);
      } catch (error) {
        toast.error("Erro ao carregar dados.");
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "valor") {
      const apenasNumeros = value.replace(/\D/g, "");
      const numero = apenasNumeros ? parseInt(apenasNumeros, 10) / 100 : 0;
      setFormData({ ...formData, valor: formatCurrency(numero) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const valorConvertido = Number(
        formData.valor.replace(/[^0-9,-]+/g, "").replace(",", ".")
      );

      await api.post("/pagamentos", {
        ...formData,
        valor: valorConvertido,
        data: new Date(formData.data),
        vencimento: formData.vencimento ? new Date(formData.vencimento) : null,
        proprietarioId: formData.proprietarioId
          ? parseInt(formData.proprietarioId)
          : null,
        inquilinoId: formData.inquilinoId
          ? parseInt(formData.inquilinoId)
          : null,
      });

      toast.success("Pagamento registado com sucesso!");

      setFormData({
        valor: "",
        descricao: "",
        estado: "PENDENTE",
        data: new Date().toISOString().split("T")[0],
        vencimento: "",
        userId: "",
        fracaoId: "",
        proprietarioId: "",
        inquilinoId: "",
      });

      onSuccess?.();
    } catch (error) {
      toast.error("Erro ao registar pagamento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-slate-200/40 shadow-2xl">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-10 pb-8 border-b border-slate-200/30">
          <div className="p-4 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 rounded-2xl border border-blue-200/50">
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>

          <div>
            <h2 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
              Novo Pagamento
            </h2>
            <p className="text-xl text-slate-600 font-semibold mt-1">
              Registar novo pagamento no sistema
            </p>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Valor */}
            <div className="space-y-3">
              <label className="font-bold text-lg text-slate-800">Valor</label>
              <input
                type="text"
                name="valor"
                value={formData.valor}
                onChange={handleChange}
                className="w-full px-6 py-5 bg-white/60 border rounded-2xl focus:ring-4 focus:ring-blue-200 shadow-xl"
                placeholder="Ex: 150 000 Kz"
                required
              />
            </div>

            {/* Descrição */}
            <div className="space-y-3">
              <label className="font-bold text-lg text-slate-800">Descrição</label>
              <input
                type="text"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                className="w-full px-6 py-5 bg-white/60 border rounded-2xl focus:ring-4 focus:ring-blue-200 shadow-xl"
              />
            </div>

            {/* Data */}
            <div className="space-y-3">
              <label className="font-bold text-lg text-slate-800">Data</label>
              <input
                type="date"
                name="data"
                value={formData.data}
                onChange={handleChange}
                className="w-full px-6 py-5 bg-white/60 border rounded-2xl focus:ring-4 focus:ring-blue-200 shadow-xl"
              />
            </div>

            {/* Vencimento */}
            <div className="space-y-3">
              <label className="font-bold text-lg text-slate-800">Vencimento</label>
              <input
                type="date"
                name="vencimento"
                value={formData.vencimento}
                onChange={handleChange}
                className="w-full px-6 py-5 bg-white/60 border rounded-2xl focus:ring-4 focus:ring-blue-200 shadow-xl"
              />
            </div>

            {/* Estado */}
            <div className="space-y-3">
              <label className="font-bold text-lg text-slate-800">Estado</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full px-6 py-5 bg-white/60 border rounded-2xl focus:ring-4 focus:ring-blue-200 shadow-xl"
              >
                <option value="PENDENTE">Pendente</option>
                <option value="PAGO">Pago</option>
                <option value="ATRASADO">Atrasado</option>
              </select>
            </div>

            {/* Utilizador */}
            <div className="space-y-3">
              <label className="font-bold text-lg text-slate-800">Utilizador</label>
              <select
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                className="w-full px-6 py-5 bg-white/60 border rounded-2xl focus:ring-4 focus:ring-blue-200 shadow-xl"
              >
                <option value="">Selecione</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Fração */}
            <div className="space-y-3">
              <label className="font-bold text-lg text-slate-800">Fração</label>
              <select
                name="fracaoId"
                value={formData.fracaoId}
                onChange={handleChange}
                className="w-full px-6 py-5 bg-white/60 border rounded-2xl focus:ring-4 focus:ring-blue-200 shadow-xl"
              >
                <option value="">Nenhuma</option>
                {fracoes.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.numero}
                  </option>
                ))}
              </select>
            </div>

            {/* Proprietário */}
            <div className="space-y-3">
              <label className="font-bold text-lg text-slate-800">Proprietário</label>
              <select
                name="proprietarioId"
                value={formData.proprietarioId}
                onChange={handleChange}
                className="w-full px-6 py-5 bg-white/60 border rounded-2xl focus:ring-4 focus:ring-blue-200 shadow-xl"
              >
                <option value="">Nenhum</option>
                {proprietarios.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Inquilino */}
            <div className="space-y-3">
              <label className="font-bold text-lg text-slate-800">Inquilino</label>
              <select
                name="inquilinoId"
                value={formData.inquilinoId}
                onChange={handleChange}
                className="w-full px-6 py-5 bg-white/60 border rounded-2xl focus:ring-4 focus:ring-blue-200 shadow-xl"
              >
                <option value="">Nenhum</option>
                {inquilinos.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.nome}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* BOTÕES */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t">

            <button
              type="button"
              onClick={onSuccess}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-slate-200 rounded-2xl font-bold"
            >
              <ChevronLeft /> Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-white ${
                loading
                  ? "bg-gray-400"
                  : "bg-gradient-to-r from-blue-600 to-emerald-600"
              }`}
            >
              <Save />
              {loading ? "Salvando..." : "Salvar Pagamento"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default PagamentoForm;
