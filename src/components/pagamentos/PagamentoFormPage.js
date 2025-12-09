// src/components/pagamentos/PagamentoFormPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import dayjs from "dayjs";
import { formatCurrency } from "../../utils/formatCurrency"; // ✅ import correto da tua função

const PagamentoFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [estado, setEstado] = useState("PENDENTE");
  const [userId, setUserId] = useState("");
  const [fracaoId, setFracaoId] = useState("");
  const [data, setData] = useState("");

  const [usuarios, setUsuarios] = useState([]);
  const [fracoes, setFracoes] = useState([]);

  // ✅ Formata o valor dinamicamente
  const handleValorChange = (e) => {
    const raw = e.target.value.replace(/[^\d]/g, ""); // remove tudo que não for número
    const numeric = parseFloat(raw) / 100;
    setValor(isNaN(numeric) ? "" : numeric.toFixed(2));
  };

  useEffect(() => {
    const fetchUsuariosEFracoes = async () => {
      try {
        const resUsuarios = await api.get("/users");
        setUsuarios(resUsuarios.data || []);

        const resFracoes = await api.get("/fracoes");
        setFracoes(resFracoes.data || []);
      } catch (err) {
        console.error("Erro ao carregar usuários ou frações:", err);
      }
    };

    const fetchPagamento = async () => {
      if (!id) return;
      try {
        const res = await api.get(`/pagamentos/${id}`);
        const p = res.data;

        setValor(p.valor || "");
        setDescricao(p.descricao || "");
        setEstado(p.estado || "PENDENTE");
        setUserId(p.user?.id || "");
        setFracaoId(p.fracao?.id || "");
        setData(p.data ? dayjs(p.data).format("YYYY-MM-DD") : "");
      } catch (err) {
        console.error("Erro ao carregar pagamento:", err);
      }
    };

    fetchUsuariosEFracoes();
    fetchPagamento();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      valor: parseFloat(valor) || 0,
      descricao,
      estado,
      userId,
      fracaoId,
      data,
    };

    try {
      if (id) {
        await api.put(`/pagamentos/${id}`, payload);
      } else {
        await api.post("/pagamentos", payload);
      }
      navigate("/pagamentos");
    } catch (err) {
      console.error("Erro ao salvar pagamento:", err);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow flex flex-col h-full">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        {id ? "Editar Pagamento" : "Novo Pagamento"}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Valor e Descrição */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Valor */}
          <div className="flex-1 flex flex-col">
            <label className="mb-1 font-semibold text-gray-600">Valor</label>
            <input
              type="text"
              value={valor ? formatCurrency(Number(valor)) : ""}
              onChange={handleValorChange}
              className="border rounded p-2"
              placeholder="Ex: 5.000,00 Kz"
              required
            />
          </div>

          {/* Descrição */}
          <div className="flex-1 flex flex-col">
            <label className="mb-1 font-semibold text-gray-600">Descrição</label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="border rounded p-2"
            />
          </div>
        </div>

        {/* Estado e Usuário */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Estado */}
          <div className="flex-1 flex flex-col">
            <label className="mb-1 font-semibold text-gray-600">Estado</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="border rounded p-2"
              required
            >
              <option value="PAGO">Pago</option>
              <option value="PENDENTE">Pendente</option>
              <option value="ATRASADO">Atrasado</option>
            </select>
          </div>

          {/* Usuário */}
          <div className="flex-1 flex flex-col">
            <label className="mb-1 font-semibold text-gray-600">Usuário</label>
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="border rounded p-2"
              required
            >
              <option value="">Selecione um usuário</option>
              {usuarios.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Fração e Data */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Fração */}
          <div className="flex-1 flex flex-col">
            <label className="mb-1 font-semibold text-gray-600">Fração</label>
            <select
              value={fracaoId}
              onChange={(e) => setFracaoId(e.target.value)}
              className="border rounded p-2"
              required
            >
              <option value="">Selecione uma fração</option>
              {fracoes.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.numero}
                </option>
              ))}
            </select>
          </div>

          {/* Data */}
          <div className="flex-1 flex flex-col">
            <label className="mb-1 font-semibold text-gray-600">Data</label>
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="border rounded p-2"
              required
            />
          </div>
        </div>

        {/* Botão de ação */}
        <div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {id ? "Salvar Alterações" : "Cadastrar Pagamento"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PagamentoFormPage;