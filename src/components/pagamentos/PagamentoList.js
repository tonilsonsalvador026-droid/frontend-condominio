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
      setPagamentos(res.data.data || []);
      setTotalPaginas(res.data.totalPages || 1);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData(paginaAtual);
  }, [paginaAtual]);

  const calcularTipificacao = (p) => {
    if (p.estado === "PAGO") return "Pago";

    if (p.vencimento) {
      const hoje = dayjs();
      const venc = dayjs(p.vencimento);
      const diff = venc.diff(hoje, "day");

      if (diff > 0) return `Pendente (${diff} dias)`;
      if (diff === 0) return "Vence hoje";
      return `Atrasado (${Math.abs(diff)} dias)`;
    }

    return "Pendente";
  };

  const filtered = pagamentos.filter((p) =>
    (p.descricao || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Eliminar pagamento?")) return;

    setDeletingId(id);

    try {
      const userId = parseInt(localStorage.getItem("userId"), 10);
      await api.put(`/pagamentos/${id}/delete`, { userId });
      setPagamentos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert("Erro ao eliminar");
    } finally {
      setDeletingId(null);
    }
  };

  // EXPORTS PADRÃO
  const exportCSV = () => {
    const header = ["ID", "Valor", "Descrição", "Estado"];
    const rows = filtered.map((p) => [
      p.id,
      formatCurrency(p.valor),
      p.descricao,
      calcularTipificacao(p),
    ]);

    const csv = [header, ...rows].map(r => r.join(",")).join("\n");

    const blob = new Blob([csv]);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "pagamentos.csv";
    link.click();
  };

  const exportExcel = () => {
    const data = filtered.map((p) => ({
      ID: p.id,
      Valor: formatCurrency(p.valor),
      Descrição: p.descricao,
      Estado: calcularTipificacao(p),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pagamentos");
    XLSX.writeFile(wb, "pagamentos.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Pagamentos", 14, 15);

    autoTable(doc, {
      head: [["ID", "Valor", "Descrição", "Estado"]],
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
            <h1 className="text-4xl font-black text-slate-900">
              Pagamentos
            </h1>
            <p className="text-slate-600">
              {filtered.length} de {pagamentos.length}
            </p>
          </div>

          <div className="flex gap-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-3 border rounded-2xl"
                placeholder="Pesquisar..."
              />
            </div>

            <button
              onClick={() => navigate("/pagamentos/novo")}
              className="px-6 py-3 bg-blue-600 text-white rounded-2xl"
            >
              Novo
            </button>
          </div>

        </div>
      </div>

      {/* TABELA */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Valor</th>
              <th className="p-4 text-left">Descrição</th>
              <th className="p-4 text-left">Estado</th>
              <th className="p-4 text-left">Ações</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-t hover:bg-slate-50">

                <td className="p-4">{p.id}</td>
                <td className="p-4">{formatCurrency(p.valor)}</td>
                <td className="p-4">{p.descricao}</td>
                <td className="p-4">{calcularTipificacao(p)}</td>

                <td className="p-4 flex gap-3">
                  <button onClick={() => navigate(`/pagamentos/${p.id}/editar`)}>
                    <Pencil size={18} />
                  </button>

                  <button onClick={() => navigate(`/pagamentos/${p.id}`)}>
                    <Eye size={18} />
                  </button>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EXPORTS PADRÃO */}
      <div className="flex gap-4 justify-center">
        <button onClick={exportCSV} className="bg-blue-600 text-white px-6 py-3 rounded-2xl">
          CSV
        </button>
        <button onClick={exportExcel} className="bg-emerald-600 text-white px-6 py-3 rounded-2xl">
          Excel
        </button>
        <button onClick={exportPDF} className="bg-red-600 text-white px-6 py-3 rounded-2xl">
          PDF
        </button>
        <button onClick={handlePrint} className="bg-gray-600 text-white px-6 py-3 rounded-2xl">
          Print
        </button>
      </div>

    </div>
  );
};

export default PagamentoList;
