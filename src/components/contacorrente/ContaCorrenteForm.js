// src/components/contacorrente/ContaCorrenteForm.js
import React, { useEffect, useState } from "react";
import api from "../../api";
import { toast } from "sonner";
import { formatCurrency } from "../../utils/formatCurrency";

const ContaCorrenteForm = ({ onSave, editingConta, onCancel }) => {
  const [proprietarios, setProprietarios] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    proprietarioId: "",
    saldoInicial: "",
  });

  // Buscar lista de proprietários
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

  // Preencher dados em caso de edição
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

  // Normalizar valor antes de salvar (remove formatação visual)
  const normalizarValor = (valor) => {
    if (!valor) return 0;
    return parseFloat(
      valor
        .toString()
        .replace(/[^\d,]/g, "") // remove tudo exceto números e vírgulas
        .replace(",", ".") // vírgula para ponto
    );
  };

  // Buscar saldo inicial baseado no proprietário
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

  // Handle mudança nos inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submeter formulário
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
    <form
      id="printArea"
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-md border mb-6"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {editingConta ? "Editar Conta Corrente" : "Nova Conta Corrente"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Proprietário */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Proprietário
          </label>
          <select
            name="proprietarioId"
            value={formData.proprietarioId}
            onChange={handleSelectProprietario}
            required
            className="border rounded-lg p-2 w-full text-gray-700 focus:ring focus:ring-blue-200"
          >
            <option value="">Selecione um proprietário</option>
            {proprietarios.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Saldo Inicial */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Saldo Inicial
          </label>
          <input
            type="text"
            name="saldoInicial"
            value={formData.saldoInicial}
            onChange={handleChange}
            required
            className="border rounded-lg p-2 w-full text-gray-700 focus:ring focus:ring-blue-200"
            placeholder="Ex: 15 000,00 Kz"
          />
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className={`px-5 py-2 rounded-lg transition text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading
            ? "Salvando..."
            : editingConta
            ? "Atualizar"
            : "Salvar"}
        </button>

        {editingConta && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 rounded-lg transition text-white bg-gray-500 hover:bg-gray-600"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default ContaCorrenteForm;