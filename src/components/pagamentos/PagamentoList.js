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
  Search,
  Plus,
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

  const filteredPagamentos = pagamentos.filter((p) => {
    const q = (search || "").trim().toLowerCase();

    return (
      !q ||
      String(p.descricao || "").toLowerCase().includes(q) ||
      String(calcularTipificacao(p)).toLowerCase().includes(q) ||
      String(p.user?.nome || "").toLowerCase().includes(q) ||
      String(p.fracao?.numero || "").toLowerCase().includes(q)
    );
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Tens certeza que queres eliminar este pagamento?")) return;

    setDeletingId(id);

    try {
      const rawUserId = localStorage.getItem("userId");
      const userId = parseInt(rawUserId, 10);

      await api.put(`/pagamentos/${id}/delete`, { userId });

      setPagamentos((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Erro ao eliminar pagamento");
    } finally {
      setDeletingId(null);
    }
  };

  const exportCSV = () => {
    const header = ["ID", "Valor", "Descrição", "Estado"];
    const rows = filteredPagamentos.map((p) => [
      p.id,
      formatCurrency(p.valor),
      p.descricao || "-",
      calcularTipificacao(p),
    ]);

    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "pagamentos.csv";
    link.click();
  };

  const exportExcel = () => {
    const data = filteredPagamentos.map((p) => ({
      ID: p.id,
      Valor: formatCurrency(p.valor),
      Descrição: p.descricao || "-",
      Estado: calcularTipificacao(p),
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
      head: [["ID", "Valor", "Descrição", "Estado"]],
      body: filteredPagamentos.map((p) => [
        p.id,
        formatCurrency(p.valor),
        p.descricao || "-",
        calcularTipificacao(p),
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
            table { width:100%; border-collapse:collapse; font-size:14px; }
            th, td { border:1px solid #ccc; padding:8px; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);

    win.document.close();
    win.print();
  };

  return (
    <div className="space-y-8">

      {/* HEADER STYLE INQUILINO */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/40 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent mb-2">
              Pagamentos
            </h1>
            <p className="text-xl text-slate-600 font-semibold">
              {filteredPagamentos.length} de {pagamentos.length} pagamentos
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">

            <div className="relative flex-1 lg:w-96">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Pesquisar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white/50 border rounded-2xl focus:ring-4 focus:ring-blue-200 outline-none"
              />
            </div>

            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="px-4 py-4 border rounded-2xl bg-white/50"
            >
              <option value="">Todos</option>
              <option value="PAGO">Pagos</option>
              <option value="PENDENTE">Pendentes</option>
              <option value="ATRASADO">Atrasados</option>
            </select>

            <button
              onClick={() => navigate("/pagamentos/novo")}
              className="px-6 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2"
            >
              <Plus size={18} /> Novo
            </button>

            <button
              onClick={() => navigate("/pagamentos/eliminados")}
              className="px-6 py-4 bg-slate-700 text-white font-bold rounded-2xl"
            >
              Eliminados
            </button>

          </div>
        </div>
      </div>

      {/* EXPORTS STYLE INQUILINO */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/40 shadow-xl">
        <div className="flex flex-wrap gap-3 justify-center">

          <button onClick={exportCSV} className="group flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-lg hover:-translate-y-1 transition-all">
            <FileText className="w-4 h-4" /> CSV
          </button>

          <button onClick={exportExcel} className="group flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg hover:-translate-y-1 transition-all">
            <FileSpreadsheet className="w-4 h-4" /> Excel
          </button>

          <button onClick={exportPDF} className="group flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-bold rounded-2xl shadow-lg hover:-translate-y-1 transition-all">
            <FileDown className="w-4 h-4" /> PDF
          </button>

          <button onClick={handlePrint} className="group flex items-center gap-2 px-6 py-3 bg-slate-600 text-white font-bold rounded-2xl shadow-lg hover:-translate-y-1 transition-all">
            <Printer className="w-4 h-4" /> Imprimir
          </button>

        </div>
      </div>

      {/* TABELA (mantida tua lógica) */}
      <div id="printArea" className="bg-white/80 rounded-3xl shadow-xl overflow-x-auto">
        <table className="w-full text-sm md:text-base">
          <thead>
            <tr className="bg-slate-100 text-slate-700 text-left">
              <th className="p-4">ID</th>
              <th className="p-4">Valor</th>
              <th className="p-4">Descrição</th>
              <th className="p-4">Estado</th>
              <th className="p-4">Utilizador</th>
              <th className="p-4">Fração</th>
              <th className="p-4">Data</th>
              <th className="p-4">Vencimento</th>
              <th className="p-4">Ações</th>
            </tr>
          </thead>

          <tbody>
            {filteredPagamentos.map((p) => (
              <tr key={p.id} className="border-b hover:bg-slate-50">

                <td className="p-4">#{p.id}</td>
                <td className="p-4 font-semibold">{formatCurrency(p.valor)}</td>
                <td className="p-4">{p.descricao || "-"}</td>
                <td className="p-4">{calcularTipificacao(p)}</td>
                <td className="p-4">{p.user?.nome || "-"}</td>
                <td className="p-4">{p.fracao?.numero || "-"}</td>

                <td className="p-4">
                  {p.data ? dayjs(p.data).format("DD/MM/YYYY") : "-"}
                </td>

                <td className="p-4">
                  {p.vencimento ? dayjs(p.vencimento).format("DD/MM/YYYY") : "-"}
                </td>

                <td className="p-4 flex gap-3">
                  <button onClick={() => navigate(`/pagamentos/${p.id}/editar`)}>
                    <Pencil size={18} />
                  </button>

                  <button onClick={() => navigate(`/pagamentos/${p.id}/detalhe`)}>
                    <Eye size={18} />
                  </button>

                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={deletingId === p.id}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINAÇÃO */}
      {totalPaginas > 1 && (
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setPaginaAtual(paginaAtual - 1)}
            disabled={paginaAtual === 1}
            className="px-4 py-2 bg-gray-200 rounded-xl"
          >
            Anterior
          </button>

          <span>
            Página {paginaAtual} de {totalPaginas}
          </span>

          <button
            onClick={() => setPaginaAtual(paginaAtual + 1)}
            disabled={paginaAtual === totalPaginas}
            className="px-4 py-2 bg-gray-200 rounded-xl"
          >
            Próxima
          </button>
        </div>
      )}

    </div>
  );
};

export default PagamentoList;
