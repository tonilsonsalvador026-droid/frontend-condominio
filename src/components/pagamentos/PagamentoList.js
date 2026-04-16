// src/components/pagamentos/PagamentoList.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import dayjs from "dayjs";
import { formatCurrency } from "../../utils/formatCurrency";
import {
  FileText, FileSpreadsheet, FileDown, Printer,
  Search, Trash2, Pencil, Eye
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const PagamentoList = () => {
  const [pagamentos, setPagamentos] = useState([]);
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

  // 📌 Estado
  const calcularTipificacao = (p) => {
    if (!p) return "Desconhecido";
    if (p.estado === "Pago" || p.estado === "PAGO") return "Pago";

    if (p.vencimento) {
      const hoje = dayjs();
      const venc = dayjs(p.vencimento);
      const diff = venc.diff(hoje, "day");

      if (diff > 0) return `Pendente (${diff} dias)`;
      if (diff === 0) return "Vence hoje";
      return `Atrasado (${Math.abs(diff)} dias)`;
    }
    return p.estado || "Desconhecido";
  };

  // 🔎 Filtro
  const filtered = pagamentos.filter((p) => {
    const q = search.toLowerCase();

    return (
      p.descricao?.toLowerCase().includes(q) ||
      p.user?.nome?.toLowerCase().includes(q) ||
      p.proprietario?.nome?.toLowerCase().includes(q) ||
      p.inquilino?.nome?.toLowerCase().includes(q) ||
      String(p.fracao?.numero || "").includes(q)
    );
  });

  // 🗑️ Eliminar
  const handleDelete = async (id) => {
    if (!window.confirm("Eliminar este pagamento?")) return;

    setDeletingId(id);

    try {
      const userId = parseInt(localStorage.getItem("userId"), 10);
      await api.put(`/pagamentos/${id}/delete`, { userId });

      setPagamentos((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Erro ao eliminar");
    } finally {
      setDeletingId(null);
    }
  };

  // 📤 EXPORTS
  const exportCSV = () => {
    const rows = filtered.map((p) => [
      p.id,
      formatCurrency(p.valor),
      p.descricao,
      calcularTipificacao(p),
    ]);

    const csv = [["ID","Valor","Descrição","Estado"], ...rows]
      .map(r => r.join(","))
      .join("\n");

    const blob = new Blob([csv]);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "pagamentos.csv";
    link.click();
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtered);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pagamentos");
    XLSX.writeFile(wb, "pagamentos.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Pagamentos", 14, 15);

    autoTable(doc, {
      head: [["ID","Valor","Descrição","Estado"]],
      body: filtered.map((p) => [
        p.id,
        formatCurrency(p.valor),
        p.descricao,
        calcularTipificacao(p),
      ]),
    });

    doc.save("pagamentos.pdf");
  };

  const handlePrint = () => window.print();

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border shadow-2xl">
        <div className="flex flex-col lg:flex-row justify-between gap-6">

          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
              Pagamentos
            </h1>
            <p className="text-slate-600">
              {filtered.length} de {pagamentos.length}
            </p>
          </div>

          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Pesquisar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 p-3 border rounded-xl"
              />
            </div>

            <button
              onClick={() => navigate("/pagamentos/eliminados")}
              className="bg-gray-700 text-white px-6 py-3 rounded-xl"
            >
              Eliminados
            </button>
          </div>
        </div>
      </div>

      {/* CARDS */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white rounded-3xl p-6 shadow-xl flex flex-col">

            <h3 className="text-xl font-bold mb-2">
              {formatCurrency(p.valor)}
            </h3>

            <p className="text-gray-600 mb-3">{p.descricao}</p>

            <p className="text-sm mb-2">
              Estado: <strong>{calcularTipificacao(p)}</strong>
            </p>

            <p className="text-sm">Fração: {p.fracao?.numero || "-"}</p>

            {/* AÇÕES */}
            <div className="flex gap-3 mt-4">

              <Pencil onClick={() => navigate(`/pagamentos/${p.id}/editar`)} className="cursor-pointer text-blue-600" />

              <Eye onClick={() => navigate(`/pagamentos/${p.id}/detalhe`)} className="cursor-pointer text-green-600" />

              <FileText
                onClick={async () => {
                  const res = await api.post("/recibos", { pagamentoId: p.id });
                  navigate(`/recibos/${res.data.id}`);
                }}
                className="cursor-pointer text-purple-600"
              />

              <Trash2
                onClick={() => handleDelete(p.id)}
                className={`cursor-pointer text-red-600 ${deletingId === p.id && "opacity-50"}`}
              />

            </div>
          </div>
        ))}
      </div>

      {/* EXPORTS */}
      {filtered.length > 0 && (
        <div className="bg-white rounded-3xl p-6 shadow-xl flex justify-center gap-4 flex-wrap">

          <button onClick={exportCSV} className="bg-blue-600 text-white px-6 py-3 rounded-xl">
            <FileText /> CSV
          </button>

          <button onClick={exportExcel} className="bg-green-600 text-white px-6 py-3 rounded-xl">
            <FileSpreadsheet /> Excel
          </button>

          <button onClick={exportPDF} className="bg-red-600 text-white px-6 py-3 rounded-xl">
            <FileDown /> PDF
          </button>

          <button onClick={handlePrint} className="bg-gray-600 text-white px-6 py-3 rounded-xl">
            <Printer /> Imprimir
          </button>

        </div>
      )}

      {/* PAGINAÇÃO */}
      {totalPaginas > 1 && (
        <div className="flex justify-center gap-4">
          <button onClick={() => setPaginaAtual(paginaAtual - 1)}>Anterior</button>
          <span>{paginaAtual} / {totalPaginas}</span>
          <button onClick={() => setPaginaAtual(paginaAtual + 1)}>Próxima</button>
        </div>
      )}

    </div>
  );
};

export default PagamentoList;
