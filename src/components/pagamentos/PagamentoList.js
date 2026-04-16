// src/components/pagamentos/PagamentoList.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import dayjs from "dayjs";
import { formatCurrency } from "../../utils/formatCurrency";
import {
  FileText, FileSpreadsheet, FileDown, Printer, Trash2, Pencil, Eye,
  Search, Filter, ChevronLeft, ChevronRight, Loader2, User, Home
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const PagamentoList = () => {
  const [pagamentos, setPagamentos] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [search, setSearch] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const itensPorPagina = 10;
  const navigate = useNavigate();

  const fetchData = async (page = 1) => {
    try {
      setLoading(true);
      const res = await api.get(`/pagamentos?page=${page}&limit=${itensPorPagina}`);
      const { data, totalPages } = res.data;

      if (Array.isArray(data)) {
        setPagamentos(data);
      } else {
        setPagamentos([]);
      }

      setTotalPaginas(totalPages || 1);
    } catch (err) {
      console.error("Erro ao carregar pagamentos:", err);
      setPagamentos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(paginaAtual);
  }, [paginaAtual]);

  // 📌 Tipificação (mantida 100%)
  const calcularTipificacao = (p) => {
    if (!p) return "Desconhecido";
    if (p.estado === "Pago" || p.estado === "PAGO") return "Pago";

    if (p.vencimento) {
      const hoje = dayjs();
      const venc = dayjs(p.vencimento);
      const diff = venc.diff(hoje, "day");

      if (diff > 0) return `Pendente (faltam ${diff} dias)`;
      if (diff === 0) return "Pendente (vence hoje)";
      return `Atrasado (há ${Math.abs(diff)} dias)`;
    }
    return p.estado || "Desconhecido";
  };

  // 🔎 Filtro (mantido 100%)
  const filteredPagamentos = pagamentos.filter((p) => {
    const q = (search || "").trim().toLowerCase();
    const descricao = String(p.descricao || "").toLowerCase();
    const estado = String(calcularTipificacao(p) || "").toLowerCase();
    const utilizador = String(p.user?.nome || "").toLowerCase();
    const fracao = String(p.fracao?.numero || "").toLowerCase();
    const proprietario = String(p.proprietario?.nome || "").toLowerCase();
    const inquilino = String(p.inquilino?.nome || "").toLowerCase();

    const matchSearch =
      !q ||
      descricao.includes(q) ||
      estado.includes(q) ||
      utilizador.includes(q) ||
      fracao.includes(q) ||
      proprietario.includes(q) ||
      inquilino.includes(q);

    const matchEstado =
      !filtroEstado || (p.estado && p.estado.toUpperCase() === filtroEstado);

    return matchSearch && matchEstado;
  });

  // 🗑️ Eliminar (mantido 100%)
  const handleDelete = async (id) => {
    if (!window.confirm("Tens certeza que queres eliminar este pagamento?"))
      return;

    setDeletingId(id);

    try {
      const rawUserId = localStorage.getItem("userId");
      if (!rawUserId) {
        alert("Utilizador não identificado. Verifica se estás autenticado.");
        setDeletingId(null);
        return;
      }
      const userId = parseInt(rawUserId, 10);

      await api.put(`/pagamentos/${id}/delete`, { userId });

      setPagamentos((prev) => prev.filter((p) => p.id !== id));
      alert("✅ Pagamento movido para eliminados!");
    } catch (error) {
      console.error("Erro ao eliminar pagamento:", error);
      alert("Erro ao eliminar pagamento. Verifique o servidor.");
    } finally {
      setDeletingId(null);
    }
  };

  // 📤 Exportações (mantidas 100%)
  const exportCSV = () => {
    const header = [
      "ID", "Valor", "Descrição", "Estado", "Utilizador",
      "Proprietário", "Inquilino", "Fração", "Data", "Vencimento"
    ];
    const rows = filteredPagamentos.map((p) => [
      p.id,
      formatCurrency(p.valor),
      p.descricao || "-",
      calcularTipificacao(p),
      p.user?.nome || "-",
      p.proprietario?.nome || "-",
      p.inquilino?.nome || "-",
      p.fracao?.numero || "-",
      p.data ? dayjs(p.data).format("DD/MM/YYYY") : "-",
      p.vencimento ? dayjs(p.vencimento).format("DD/MM/YYYY") : "-",
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "pagamentos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportExcel = () => {
    const data = filteredPagamentos.map((p) => ({
      ID: p.id,
      valor: formatCurrency(p.valor),
      Descrição: p.descricao || "-",
      Estado: calcularTipificacao(p),
      Utilizador: p.user?.nome || "-",
      Proprietário: p.proprietario?.nome || "-",
      Inquilino: p.inquilino?.nome || "-",
      Fração: p.fracao?.numero || "-",
      Data: p.data ? dayjs(p.data).format("DD/MM/YYYY") : "-",
      Vencimento: p.vencimento ? dayjs(p.vencimento).format("DD/MM/YYYY") : "-",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pagamentos");
    XLSX.writeFile(wb, "pagamentos.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Relatório de Pagamentos", 14, 15);
    autoTable(doc, {
      startY: 25,
      head: [["ID", "Valor", "Descrição", "Estado", "Utilizador", "Proprietário", "Inquilino", "Fração", "Data", "Vencimento"]],
      body: filteredPagamentos.map((p) => [
        p.id,
        formatCurrency(p.valor),
        p.descricao || "-",
        calcularTipificacao(p),
        p.user?.nome || "-",
        p.proprietario?.nome || "-",
        p.inquilino?.nome || "-",
        p.fracao?.numero || "-",
        p.data ? dayjs(p.data).format("DD/MM/YYYY") : "-",
        p.vencimento ? dayjs(p.vencimento).format("DD/MM/YYYY") : "-",
      ]),
    });
    doc.save("pagamentos.pdf");
  };

  const handlePrint = () => {
    const content = document.getElementById("printArea").innerHTML;
    const win = window.open("", "", "width=900,height=650");
    win.document.write(`
      <html>
        <head>
          <title>Relatório de Pagamentos</title>
          <style>
            table { width: 100%; border-collapse: collapse; font-size: 14px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background: #f5f5f5; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  // 🎨 Glass Badges
  const renderEstadoBadge = (p) => {
    const tipificacao = calcularTipificacao(p);
    let classes = "px-4 py-2 rounded-2xl text-xs font-bold backdrop-blur-sm border border-white/30";
    
    if (tipificacao.startsWith("Pago")) {
      classes += " bg-green-500/20 text-green-100";
    } else if (tipificacao.startsWith("Pendente")) {
      classes += " bg-yellow-500/20 text-yellow-100";
    } else if (tipificacao.startsWith("Atrasado") || tipificacao.startsWith("Em atraso")) {
      classes += " bg-red-500/20 text-red-100";
    } else {
      classes += " bg-gray-500/20 text-gray-100";
    }
    return <span className={classes}>{tipificacao}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900/30 to-indigo-900 p-6 md:p-12">
      {/* Header Glass Card */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-2">
              Pagamentos
            </h1>
            <p className="text-blue-100/90 text-xl font-medium">Gerencie todos os pagamentos com filtros avançados</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/pagamentos/eliminados")}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600/80 to-gray-700/80 hover:from-gray-700/90 hover:to-gray-800/90 backdrop-blur-lg border border-white/20 rounded-2xl font-semibold text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <Trash2 size={20} /> Eliminados
            </button>
          </div>
        </div>

        {/* Search & Filters Glass */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 w-5 h-5" />
            <input
              type="text"
              placeholder="Pesquisar inquilino, fração, descrição..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-blue-200/80 focus:ring-4 ring-blue-500/30 focus:outline-none transition-all duration-300 font-medium"
            />
          </div>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:ring-4 ring-blue-500/30 focus:outline-none transition-all duration-300 font-medium"
          >
            <option value="">Todos os Estados</option>
            <option value="PAGO">Pagos</option>
            <option value="PENDENTE">Pendentes</option>
            <option value="ATRASADO">Atrasados</option>
          </select>
        </div>
      </div>

      {/* Export Buttons Glass */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8 shadow-2xl">
        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
          <button onClick={exportCSV} className="glass-btn group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500/80 to-blue-600/80 hover:from-blue-600/90 hover:to-blue-700/90">
            <FileText size={18} /> CSV
          </button>
          <button onClick={exportExcel} className="glass-btn group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500/80 to-emerald-600/80 hover:from-emerald-600/90 hover:to-emerald-700/90">
            <FileSpreadsheet size={18} /> Excel
          </button>
          <button onClick={exportPDF} className="glass-btn group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500/80 to-orange-600/80 hover:from-orange-600/90 hover:to-orange-700/90">
            <FileDown size={18} /> PDF
          </button>
          <button onClick={handlePrint} className="glass-btn group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600/80 to-gray-700/80 hover:from-gray-700/90 hover:to-gray-800/90">
            <Printer size={18} /> Imprimir
          </button>
        </div>
      </div>

      {/* Main Table Glass */}
      <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 shadow-3xl mb-8 overflow-hidden" id="printArea">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-16 h-16 text-blue-400 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm md:text-base">
              <thead className="bg-white/10 backdrop-blur-sm border-b border-white/20">
                <tr>
                  {["ID", "Valor", "Descrição", "Estado", "Utilizador", "Proprietário", "Inquilino", "Fração", "Data", "Vencimento", "Ações"].map((header) => (
                    <th key={header} className="px-4 py-6 text-left text-blue-100 font-bold text-lg first:rounded-l-3xl last:rounded-r-3xl">
                      {header === "Fração" ? <Home className="w-5 h-5 inline mr-2 text-blue-400" /> : null}
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredPagamentos.map((p) => (
                  <tr key={p.id} className="hover:bg-white/10 transition-all duration-200 glass-row">
                    <td className="px-4 py-6 font-bold text-blue-200 bg-gradient-to-r from-blue-500/10 to-transparent rounded-l-3xl">{p.id}</td>
                    <td className="px-4 py-6 font-bold text-2xl text-emerald-400">{formatCurrency(p.valor)}</td>
                    <td className="px-4 py-6 text-blue-200 max-w-xs truncate">{p.descricao || "-"}</td>
                    <td className="px-4 py-6">{renderEstadoBadge(p)}</td>
                    <td className="px-4 py-6 text-blue-100">{p.user?.nome || "-"}</td>
                    <td className="px-4 py-6 text-purple-100">{p.proprietario?.nome || "-"}</td>
                    <td className="px-4 py-6 text-emerald-100">{p.inquilino?.nome || "-"}</td>
                    <td className="px-4 py-6 text-indigo-100">{p.fracao?.numero || "-"}</td>
                    <td className="px-4 py-6 text-blue-200">{p.data ? dayjs(p.data).format("DD/MM/YYYY") : "-"}</td>
                    <td className="px-4 py-6 text-orange-200">{p.vencimento ? dayjs(p.vencimento).format("DD/MM/YYYY") : "-"}</td>
                    <td className="px-4 py-6 rounded-r-3xl">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/pagamentos/${p.id}/editar`)}
                          className="p-3 bg-blue-500/20 hover:bg-blue-500/40 backdrop-blur-sm border border-blue-500/30 rounded-2xl text-blue-100 hover:text-white hover:scale-110 transition-all duration-300"
                          title="Editar"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => navigate(`/pagamentos/${p.id}/detalhe`)}
                          className="p-3 bg-emerald-500/20 hover:bg-emerald-500/40 backdrop-blur-sm border border-emerald-500/30 rounded-2xl text-emerald-100 hover:text-white hover:scale-110 transition-all duration-300"
                          title="Ver Detalhe"
                        >
                          <Eye size={18} />
                        </button>
                        {p.recibo ? (
                          <button
                            onClick={() => navigate(`/recibos/${p.recibo.id}`)}
                            className="p-3 bg-purple-500/20 hover:bg-purple-500/40 backdrop-blur-sm border border-purple-500/30 rounded-2xl text-purple-100 hover:text-white hover:scale-110 transition-all duration-300"
                            title="Ver Recibo"
                          >
                            <FileText size={18} />
                          </button>
                        ) : (
                          <button
                            onClick={async () => {
                              try {
                                const res = await api.post("/recibos", { pagamentoId: p.id });
                                if (res.data?.id) {
                                  navigate(`/recibos/${res.data.id}`);
                                }
                              } catch (err) {
                                console.error("Erro ao gerar recibo:", err);
                                alert("Erro ao gerar recibo. Verifique o servidor.");
                              }
                            }}
                            className="p-3 bg-purple-500/20 hover:bg-purple-500/40 backdrop-blur-sm border border-purple-500/30 rounded-2xl text-purple-100 hover:text-white hover:scale-110 transition-all duration-300"
                            title="Gerar Recibo"
                          >
                            <FileText size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(p.id)}
                          className={`p-3 bg-red-500/20 hover:bg-red-500/40 backdrop-blur-sm border border-red-500/30 rounded-2xl text-red-100 hover:text-white hover:scale-110 transition-all duration-300 ${deletingId === p.id ? "opacity-50 cursor-not-allowed" : ""}`}
                          title="Eliminar"
                          disabled={deletingId === p.id}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredPagamentos.length === 0 && (
                  <tr>
                    <td colSpan="11" className="p-20 text-center">
                      <div className="text-blue-200 text-xl">Nenhum pagamento encontrado</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Glass */}
        {totalPaginas > 1 && (
          <div className="mt-12 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-wrap items-center justify-center gap-4">
            <span className="text-blue-200 font-bold text-lg">
              Página {paginaAtual} de {totalPaginas} • {filteredPagamentos.length} pagamentos
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPaginaAtual(paginaAtual - 1)}
                disabled={paginaAtual === 1}
                className="glass-btn flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-500/60 to-gray-600/60 disabled:from-gray-400/50 disabled:to-gray-500/50 hover:from-gray-600/80 hover:to-gray-700/80"
              >
                <ChevronLeft size={20} /> Anterior
              </button>
              <button
                onClick={() => setPaginaAtual(paginaAtual + 1)}
                disabled={paginaAtual === totalPaginas}
                className="glass-btn flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500/90 to-purple-600/90 hover:from-blue-600 hover:to-purple-700"
              >
                Próxima <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Estilos utilitários para glass buttons
const glassBtnStyles = `
  backdrop-blur-lg border border-white/20 rounded-2xl font-semibold text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300
`;

export default PagamentoList;
