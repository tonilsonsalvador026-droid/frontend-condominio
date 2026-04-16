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
  Receipt,
} from "lucide-react";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const PagamentoList = () => {
  const [pagamentos, setPagamentos] = useState([]);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await api.get("/pagamentos");
      setPagamentos(res.data || []);
    } catch (err) {
      console.error("Erro ao carregar pagamentos:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 📌 Tipificação
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
      p.fracao?.numero?.toString().includes(q) ||
      p.proprietario?.nome?.toLowerCase().includes(q)
    );
  });

  // 🎨 Badge
  const getBadge = (p) => {
    const t = calcularTipificacao(p);

    if (t.startsWith("Pago"))
      return "bg-green-100 text-green-700";

    if (t.startsWith("Pendente") || t.includes("Vence"))
      return "bg-yellow-100 text-yellow-700";

    if (t.startsWith("Atrasado"))
      return "bg-red-100 text-red-700";

    return "bg-gray-100 text-gray-700";
  };

  // 🗑️ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Eliminar este pagamento?")) return;

    setDeletingId(id);

    try {
      const userId = parseInt(localStorage.getItem("userId"));
      await api.put(`/pagamentos/${id}/delete`, { userId });

      setPagamentos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert("Erro ao eliminar");
    } finally {
      setDeletingId(null);
    }
  };

  // 📤 EXPORTS (mantidos)
  const exportCSV = () => {
    const rows = filtered.map((p) => [
      p.id,
      formatCurrency(p.valor),
      p.descricao,
      calcularTipificacao(p),
    ]);

    const csv = [["ID", "Valor", "Descrição", "Estado"], ...rows]
      .map((r) => r.join(","))
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
      head: [["ID", "Valor", "Descrição"]],
      body: filtered.map((p) => [p.id, p.valor, p.descricao]),
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
            <p className="text-lg text-gray-600">
              {filtered.length} de {pagamentos.length} pagamentos
            </p>
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Pesquisar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border rounded-2xl"
              />
            </div>

            <button
              onClick={() => navigate("/pagamentos/eliminados")}
              className="bg-gray-700 text-white px-5 py-3 rounded-2xl"
            >
              Eliminados
            </button>
          </div>
        </div>
      </div>

      {/* LISTA */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {filtered.map((p) => (
          <div key={p.id} className="bg-white rounded-3xl p-6 shadow-xl flex flex-col gap-4">

            <div className="flex justify-between">
              <span className="font-bold">#{p.id}</span>
              <span className={`px-3 py-1 text-xs rounded-full ${getBadge(p)}`}>
                {calcularTipificacao(p)}
              </span>
            </div>

            <h3 className="text-xl font-bold">{formatCurrency(p.valor)}</h3>

            <p className="text-gray-600">{p.descricao || "-"}</p>

            <div className="text-sm space-y-1">
              <p><strong>Utilizador:</strong> {p.user?.nome || "-"}</p>
              <p><strong>Fração:</strong> {p.fracao?.numero || "-"}</p>
              <p><strong>Data:</strong> {dayjs(p.data).format("DD/MM/YYYY")}</p>
            </div>

            {/* AÇÕES */}
            <div className="flex justify-between pt-3 border-t">

              <div className="flex gap-3">
                <button onClick={() => navigate(`/pagamentos/${p.id}/editar`)}>
                  <Pencil size={18} />
                </button>

                <button onClick={() => navigate(`/pagamentos/${p.id}/detalhe`)}>
                  <Eye size={18} />
                </button>

                {/* Recibo */}
                {p.recibo ? (
                  <button onClick={() => navigate(`/recibos/${p.recibo.id}`)}>
                    <Receipt size={18} />
                  </button>
                ) : (
                  <button onClick={() => api.post("/recibos", { pagamentoId: p.id })}>
                    <Receipt size={18} />
                  </button>
                )}
              </div>

              <button
                onClick={() => handleDelete(p.id)}
                className="text-red-600"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

      </div>

      {/* EXPORT */}
      {filtered.length > 0 && (
        <div className="bg-white/60 rounded-3xl p-6 shadow-xl flex flex-wrap gap-3 justify-center">

          <button onClick={exportCSV} className="bg-blue-600 text-white px-5 py-3 rounded-2xl flex items-center gap-2">
            <FileText size={16} /> CSV
          </button>

          <button onClick={exportExcel} className="bg-green-600 text-white px-5 py-3 rounded-2xl flex items-center gap-2">
            <FileSpreadsheet size={16} /> Excel
          </button>

          <button onClick={exportPDF} className="bg-red-600 text-white px-5 py-3 rounded-2xl flex items-center gap-2">
            <FileDown size={16} /> PDF
          </button>

          <button onClick={handlePrint} className="bg-gray-600 text-white px-5 py-3 rounded-2xl flex items-center gap-2">
            <Printer size={16} /> Imprimir
          </button>

        </div>
      )}

    </div>
  );
};

export default PagamentoList;
