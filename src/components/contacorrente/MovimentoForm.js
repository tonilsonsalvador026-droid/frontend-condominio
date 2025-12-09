// src/components/contacorrente/MovimentoForm.js
import React, { useEffect, useState } from "react";
import api from "../../api";
import { toast } from "sonner";
import { formatCurrency } from "../../utils/formatCurrency"; // ✅ import da função

const MovimentoForm = ({ onSave }) => {
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

  // 🔹 Buscar lista de proprietários
  useEffect(() => {
    const fetchProprietarios = async () => {
      try {
        const res = await api.get("/proprietarios");
        setProprietarios(res.data || []);
      } catch (error) {
        console.error("Erro ao carregar proprietários:", error);
        toast.error("❌ Erro ao carregar proprietários.");
      }
    };
    fetchProprietarios();
  }, []);

  // 🔹 Selecionar proprietário → buscar conta corrente
  const handleSelectProprietario = async (e) => {
    const proprietarioId = e.target.value;
    setForm((prev) => ({ ...prev, proprietarioId, contaCorrenteId: "" }));

    if (!proprietarioId) return;

    try {
      const res = await api.get(`/contas-correntes/proprietario/${proprietarioId}`);
      if (res.data && res.data.id) {
        setForm((prev) => ({ ...prev, contaCorrenteId: res.data.id }));
        toast.success(
          `Conta corrente encontrada para ${res.data.proprietario?.nome || "este proprietário"}`
        );
      } else {
        toast.error("⚠️ Este proprietário não possui conta corrente ativa.");
      }
    } catch (error) {
      console.error("Erro ao buscar conta corrente:", error);
      toast.error("❌ Erro ao buscar conta corrente.");
    }
  };

  // 🔹 Normalizar valor → float
  const normalizarValor = (valor) => {
    if (!valor) return 0;
    return parseFloat(valor.toString().replace(/\s/g, "").replace(/\./g, "").replace(",", "."));
  };

  // 🔹 Atualizar valor e aplicar formatação visual
  const handleChangeValor = (e) => {
    let valor = e.target.value.replace(/[^\d,]/g, ""); // permite apenas dígitos e vírgula
    setForm((prev) => ({ ...prev, valor }));
  };

  // 🔹 Atualizar campos genéricos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Submeter formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.contaCorrenteId) {
      toast.error("⚠️ Selecione um proprietário com conta corrente ativa.");
      return;
    }
    if (!form.valor || normalizarValor(form.valor) <= 0) {
      toast.error("⚠️ Informe um valor válido para o movimento.");
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

      toast.success("✅ Movimento registrado com sucesso!");

      // Resetar formulário
      setForm({
        proprietarioId: "",
        contaCorrenteId: "",
        data: "",
        descricao: "",
        tipo: "DEBITO",
        valor: "",
      });

      if (onSave) onSave();
    } catch (error) {
      console.error("Erro ao registrar movimento:", error);
      toast.error("❌ Erro ao registrar movimento!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      id="printArea"
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-md border mb-6"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Registrar Novo Movimento</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Proprietário */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Proprietário</label>
          <select
            name="proprietarioId"
            value={form.proprietarioId}
            onChange={handleSelectProprietario}
            required
            className="border rounded-lg p-2 w-full text-gray-700 focus:ring focus:ring-blue-200"
          >
            <option value="">Selecione...</option>
            {proprietarios.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Data */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Data</label>
          <input
            type="date"
            name="data"
            value={form.data}
            onChange={handleChange}
            required
            className="border rounded-lg p-2 w-full text-gray-700 focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Descrição */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-600 mb-1">Descrição</label>
          <input
            type="text"
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            placeholder="Ex: Quota Mensal, Multa, Pagamento..."
            required
            className="border rounded-lg p-2 w-full text-gray-700 focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Tipo */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Tipo</label>
          <select
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full text-gray-700 focus:ring focus:ring-blue-200"
          >
            <option value="DEBITO">Débito</option>
            <option value="CREDITO">Crédito</option>
          </select>
        </div>

        {/* Valor */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Valor (Kz)</label>
          <input
            type="text"
            name="valor"
            value={form.valor ? formatCurrency(normalizarValor(form.valor)).replace("Kz", "").trim() : ""}
            onChange={handleChangeValor}
            required
            placeholder="Ex: 15 000,00 Kz"
            className="border rounded-lg p-2 w-full text-gray-700 focus:ring focus:ring-blue-200 text-right"
          />
        </div>
      </div>

      <div className="mt-5">
        <button
          type="submit"
          disabled={loading}
          className={`px-5 py-2 rounded-lg transition text-white ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Salvando..." : "Registrar Movimento"}
        </button>
      </div>
    </form>
  );
};

export default MovimentoForm;