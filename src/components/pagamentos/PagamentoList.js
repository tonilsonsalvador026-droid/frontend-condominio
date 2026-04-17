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

// ✅ IMPORTAR FORM
import PagamentoFormPage from "./PagamentoFormPage";

const PagamentoList = () => {
  const [pagamentos, setPagamentos] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [search, setSearch] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [deletingId, setDeletingId] = useState(null);

  // ✅ NOVOS STATES
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const itensPorPagina = 10;
  const navigate = useNavigate();

  const fetchData = async (page = 1) => {
    try {
      const res = await api.get(`/pagamentos?page=${page}&limit=${itensPorPagina}`);
      const { data, totalPages } = res.data;

      setPagamentos(Array.isArray(data) ? data : []);
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
      const userId = parseInt(localStorage.getItem("userId"), 10);
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
        </head>
        <body>${content}</body>
      </html>
    `);

    win.document.close();
    win.print();
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border shadow-2xl">
        <div className="flex flex-col lg:flex-row justify-between gap-6">

          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
              Pagamentos
            </h1>
            <p className="text-xl text-slate-600 font-semibold">
              {filteredPagamentos.length} de {pagamentos.length} pagamentos
            </p>
          </div>

          <div className="flex gap-4 flex-wrap">

            <input
              type="text"
              placeholder="Pesquisar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-3 border rounded-2xl"
            />

            <button
              onClick={() => {
                setEditId(null);
                setShowForm(true);
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-2xl flex items-center gap-2"
            >
              <Plus size={18} /> Novo
            </button>

          </div>
        </div>
      </div>

      {/* ✅ FORM APARECE AQUI */}
      {showForm && (
        <PagamentoFormPage
          id={editId}
          onSuccess={() => {
            setShowForm(false);
            fetchData();
          }}
        />
      )}

      {/* TABELA */}
      <div id="printArea" className="bg-white rounded-3xl shadow-xl overflow-x-auto">
        <table className="w-full">
          <tbody>
            {filteredPagamentos.map((p) => (
              <tr key={p.id}>

                <td>{p.id}</td>
                <td>{formatCurrency(p.valor)}</td>

                <td>
                  <button
                    onClick={() => {
                      setEditId(p.id);
                      setShowForm(true);
                    }}
                  >
                    <Pencil size={18} />
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default PagamentoList;
