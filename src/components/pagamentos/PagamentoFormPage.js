// src/components/pagamentos/PagamentoFormPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import dayjs from "dayjs";
import { formatCurrency } from "../../utils/formatCurrency";
import { User, Save, ChevronLeft } from "lucide-react";

const PagamentoFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [estado, setEstado] = useState("PENDENTE");
  const [userId, setUserId] = useState("");
  const [fracaoId, setFracaoId] = useState("");
  const [data, setData] = useState("");

  const [proprietarioId, setProprietarioId] = useState("");
  const [inquilinoId, setInquilinoId] = useState("");
  const [vencimento, setVencimento] = useState("");

  const [usuarios, setUsuarios] = useState([]);
  const [fracoes, setFracoes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleValorChange = (e) => {
    const raw = e.target.value.replace(/[^\d]/g, "");
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
        setVencimento(p.vencimento ? dayjs(p.vencimento).format("YYYY-MM-DD") : "");

        // 🔥 IMPORTANTE
        setProprietarioId(p.proprietario?.id || "");
        setInquilinoId(p.inquilino?.id || "");

      } catch (err) {
        console.error("Erro ao carregar pagamento:", err);
      }
    };

    fetchUsuariosEFracoes();
    fetchPagamento();
  }, [id]);

  const handleFracaoChange = (e) => {
    const id = e.target.value;
    setFracaoId(id);

    const fracao = fracoes.find(f => f.id === parseInt(id));

    if (fracao) {
      setProprietarioId(fracao.proprietario?.id || "");
      setInquilinoId(fracao.inquilino?.id || "");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      valor: parseFloat(valor) || 0,
      descricao,
      estado,
      userId,
      fracaoId,
      data,
      vencimento,
      proprietarioId,
      inquilinoId
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
    } finally {
      setLoading(false);
    }
  };

  const fracaoSelecionada = fracoes.find(f => f.id === parseInt(fracaoId));

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-slate-200/40 shadow-2xl">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-10 pb-8 border-b border-slate-200/30">
          <div className="p-4 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl border border-blue-200/50">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
              {id ? "Editar Pagamento" : "Novo Pagamento"}
            </h2>
            <p className="text-xl text-slate-600 font-semibold mt-1">
              Preencha os dados do pagamento
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Valor */}
            <div>
              <label className="font-bold">Valor</label>
              <input
                type="text"
                value={valor ? formatCurrency(Number(valor)) : ""}
                onChange={handleValorChange}
                className="w-full px-4 py-3 border rounded-xl"
                required
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="font-bold">Descrição</label>
              <input
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl"
              />
            </div>

            {/* Estado */}
            <div>
              <label className="font-bold">Estado</label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl"
              >
                <option value="PAGO">Pago</option>
                <option value="PENDENTE">Pendente</option>
                <option value="ATRASADO">Atrasado</option>
              </select>
            </div>

            {/* Usuário */}
            <div>
              <label className="font-bold">Usuário</label>
              <select
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl"
              >
                <option value="">Selecione</option>
                {usuarios.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Fração */}
            <div>
              <label className="font-bold">Fração</label>
              <select
                value={fracaoId}
                onChange={handleFracaoChange}
                className="w-full px-4 py-3 border rounded-xl"
              >
                <option value="">Selecione</option>
                {fracoes.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.numero}
                  </option>
                ))}
              </select>
            </div>

            {/* Data */}
            <div>
              <label className="font-bold">Data</label>
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl"
              />
            </div>

          </div>

          {/* 🔥 RESPONSÁVEL */}
          {fracaoSelecionada && (
            <div className="bg-blue-50 p-4 rounded-xl border">
              <p className="text-sm text-gray-500">Responsável</p>
              <p className="font-bold">
                {fracaoSelecionada.proprietario?.nome || "Sem proprietário"}
              </p>
              <p className="text-sm">
                Inquilino: {fracaoSelecionada.inquilino?.nome || "-"}
              </p>
            </div>
          )}

          {/* Vencimento */}
          <div>
            <label className="font-bold">Vencimento</label>
            <input
              type="date"
              value={vencimento}
              onChange={(e) => setVencimento(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl"
            />
          </div>

          {/* BOTÕES */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t">

  <button
    type="button"
    onClick={() => navigate("/pagamentos")}
    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-slate-200 rounded-2xl font-bold hover:bg-slate-300 transition-all"
  >
    <ChevronLeft /> Cancelar
  </button>

  <button
    type="submit"
    disabled={loading}
    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-white transition-all ${
      loading
        ? "bg-gray-400"
        : "bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
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

export default PagamentoFormPage;
