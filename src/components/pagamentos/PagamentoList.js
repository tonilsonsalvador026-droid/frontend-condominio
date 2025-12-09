// src/components/pagamentos/PagamentoList.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import dayjs from "dayjs";
import { formatCurrency } from "../../utils/formatCurrency";
import {
  FileText,
  FileSpreadsheet,
  FileDown,
  Printer,
  Trash2,
  Pencil,
  Eye,
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

  const itensPorPagina = 10;
  const navigate = useNavigate();

  const fetchData = async (page = 1) => {
    try {
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
    }
  };

  useEffect(() => {
    fetchData(paginaAtual);
  }, [paginaAtual]);

  // 📌 Tipificação
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

  // 🔎 Filtro
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

  // 🗑️ Eliminar (soft delete)
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

  // 📤 Exportações
  const exportCSV = () => {
    const header = [
      "ID",
      "Valor",
      "Descrição",
      "Estado",
      "Utilizador",
      "Proprietário",
      "Inquilino",
      "Fração",
      "Data",
      "Vencimento",
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
      head: [
        [
          "ID",
          "Valor",
          "Descrição",
          "Estado",
          "Utilizador",
          "Proprietário",
          "Inquilino",
          "Fração",
          "Data",
          "Vencimento",
        ],
      ],
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

  // 🎨 Badge estado
  const renderEstadoBadge = (p) => {
    let classes = "px-3 py-1 rounded-full text-xs font-semibold ";
    const tipificacao = calcularTipificacao(p);
    if (tipificacao.startsWith("Pago")) {
      classes += "bg-green-100 text-green-700";
    } else if (tipificacao.startsWith("Pendente")) {
      classes += "bg-yellow-100 text-yellow-700";
    } else if (tipificacao.startsWith("Atrasado") || tipificacao.startsWith("Em atraso")) {
      classes += "bg-red-100 text-red-700";
    } else {
      classes += "bg-gray-100 text-gray-700";
    }
    return <span className={classes}>{tipificacao}</span>;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <h2 className="text-lg font-semibold text-gray-700">Lista de Pagamentos</h2>
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <input
            type="text"
            placeholder="Pesquisar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded p-2 w-full md:w-64 text-gray-700"
          />
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="border rounded p-2 text-gray-700"
          >
            <option value="">Todos</option>
            <option value="PAGO">Pagos</option>
            <option value="PENDENTE">Pendentes</option>
            <option value="ATRASADO">Atrasados</option>
          </select>
          <button
            onClick={() => navigate("/pagamentos/eliminados")}
            className="flex items-center gap-2 bg-gray-700 text-white px-3 py-2 rounded hover:bg-gray-800 text-sm"
          >
            <Trash2 size={16} /> Eliminados
          </button>
        </div>
      </div>

      {/* Botões exportação */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm"
        >
          <FileText size={16} /> CSV
        </button>
        <button
          onClick={exportExcel}
          className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 text-sm"
        >
          <FileSpreadsheet size={16} /> Excel
        </button>
        <button
          onClick={exportPDF}
          className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 text-sm"
        >
          <FileDown size={16} /> PDF
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700 text-sm"
        >
          <Printer size={16} /> Imprimir
        </button>
      </div>

      {/* Tabela */}
      <div id="printArea" className="overflow-x-auto flex-grow">
        <table className="w-full text-sm md:text-base border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="p-2">ID</th>
              <th className="p-2">Valor</th>
              <th className="p-2">Descrição</th>
              <th className="p-2">Estado</th>
              <th className="p-2">Utilizador</th>
              <th className="p-2">Proprietário</th>
              <th className="p-2">Inquilino</th>
              <th className="p-2">Fração</th>
              <th className="p-2">Data</th>
              <th className="p-2">Vencimento</th>
              <th className="p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredPagamentos.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 border-b last:border-none">
                <td className="p-2">{p.id}</td>
                <td className="p-2">{formatCurrency(p.valor)}</td>
                <td className="p-2">{p.descricao || "-"}</td>
                <td className="p-2">{renderEstadoBadge(p)}</td>
                <td className="p-2">{p.user?.nome || "-"}</td>
                <td className="p-2">{p.proprietario?.nome || "-"}</td>
                <td className="p-2">{p.inquilino?.nome || "-"}</td>
                <td className="p-2">{p.fracao?.numero || "-"}</td>
                <td className="p-2">
                  {p.data ? dayjs(p.data).format("DD/MM/YYYY") : "-"}
                </td>
                <td className="p-2">
                  {p.vencimento ? dayjs(p.vencimento).format("DD/MM/YYYY") : "-"}
                </td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => navigate(`/pagamentos/${p.id}/editar`)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Editar"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => navigate(`/pagamentos/${p.id}/detalhe`)}
                    className="text-green-600 hover:text-green-800"
                    title="Ver Detalhe"
                  >
                    <Eye size={18} />
                  </button>

                  {/* 📌 Botão Recibo */}
                  {p.recibo ? (
                    <button
                      onClick={() => navigate(`/recibos/${p.recibo.id}`)}
                      className="text-purple-600 hover:text-purple-800"
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
                      className="text-purple-600 hover:text-purple-800"
                      title="Gerar Recibo"
                    >
                      <FileText size={18} />
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(p.id)}
                    className={`text-red-600 hover:text-red-800 ${
                      deletingId === p.id ? "opacity-50 pointer-events-none" : ""
                    }`}
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredPagamentos.length === 0 && (
              <tr>
                <td colSpan="11" className="p-4 text-center text-gray-500">
                  Nenhum pagamento encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {totalPaginas > 1 && (
        <div className="flex justify-center items-center gap-3 mt-4">
          <button
            onClick={() => setPaginaAtual(paginaAtual - 1)}
            disabled={paginaAtual === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-gray-700">
            Página {paginaAtual} de {totalPaginas}
          </span>
          <button
            onClick={() => setPaginaAtual(paginaAtual + 1)}
            disabled={paginaAtual === totalPaginas}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
};

export default PagamentoList;