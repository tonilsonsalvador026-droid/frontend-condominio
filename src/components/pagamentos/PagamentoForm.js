// src/components/pagamentos/PagamentoForm.js
import React, { useState, useEffect } from "react";
import api from "../../api";
import { toast } from "sonner";
import { formatCurrency } from "../../utils/formatCurrency";

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
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados.");
      }
    };
    fetchData();
  }, []);

  // Atualiza valor formatado em tempo real
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

      toast.success("✅ Pagamento registado com sucesso!");
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
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("❌ Erro ao registar pagamento.");
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
        Novo Pagamento
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Valor */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Valor (AOA)
          </label>
          <input
            type="text"
            name="valor"
            value={formData.valor}
            onChange={handleChange}
            required
            className="border rounded-lg p-2 w-full text-gray-700 focus:ring focus:ring-blue-200"
            placeholder="Ex: 150 000,00 Kz"
          />
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Descrição
          </label>
          <input
            type="text"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full text-gray-700 focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Data */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Data
          </label>
          <input
            type="date"
            name="data"
            value={formData.data}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full text-gray-700 focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Vencimento */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Vencimento
          </label>
          <input
            type="date"
            name="vencimento"
            value={formData.vencimento}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full text-gray-700 focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Estado
          </label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full text-gray-700 focus:ring focus:ring-blue-200"
          >
            <option value="PENDENTE">Pendente</option>
            <option value="PAGO">Pago</option>
            <option value="ATRASADO">Atrasado</option>
          </select>
        </div>

        {/* Utilizador */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Utilizador
          </label>
          <select
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            required
            className="border rounded-lg p-2 w-full text-gray-700 focus:ring focus:ring-blue-200"
          >
            <option value="">Selecione o Utilizador</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nome} ({u.email})
              </option>
            ))}
          </select>
        </div>

        {/* Fração */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Fração
          </label>
          <select
            name="fracaoId"
            value={formData.fracaoId}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full text-gray-700 focus:ring focus:ring-blue-200"
          >
            <option value="">Nenhuma</option>
            {fracoes.map((f) => (
              <option key={f.id} value={f.id}>
                {f.numero} - {f.tipo}
              </option>
            ))}
          </select>
        </div>

        {/* Proprietário */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Proprietário
          </label>
          <select
            name="proprietarioId"
            value={formData.proprietarioId}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full text-gray-700 focus:ring focus:ring-blue-200"
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
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Inquilino
          </label>
          <select
            name="inquilinoId"
            value={formData.inquilinoId}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full text-gray-700 focus:ring focus:ring-blue-200"
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

      {/* Botão */}
      <div className="mt-5">
        <button
          type="submit"
          disabled={loading}
          className={`px-5 py-2 rounded-lg transition text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
};

export default PagamentoForm;