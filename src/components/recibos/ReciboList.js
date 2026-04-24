// src/components/recibos/ReciboList.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import dayjs from "dayjs";
import {
  FileText,
  FileSpreadsheet,
  FileDown,
  Printer,
  Trash2,
  Pencil,
  Eye,
  Download,
  Search,
  Plus,
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency } from "../../utils/formatCurrency";

const ReciboList = () => {
  const [recibos, setRecibos] = useState([]);
  const [search, setSearch] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [deletingId, setDeletingId] = useState(null);

  const itensPorPagina = 10;
  const navigate = useNavigate();

  const fetchData = async (page = 1) => {
    try {
      const res = await api.get(`/recibos?page=${page}&limit=${itensPorPagina}`);
      const { data, totalPages } = res.data;
      setRecibos(Array.isArray(data) ? data : []);
      setTotalPaginas(totalPages || 1);
    } catch (err) {
      console.error("Erro ao carregar recibos:", err);
      setRecibos([]);
    }
  };

  useEffect(() => {
    fetchData(paginaAtual);
  }, [paginaAtual]);

  const filteredRecibos = recibos.filter((r) => {
    const q = (search || "").trim().toLowerCase();
    const numero = String(r.numero || "").toLowerCase();
    const proprietario = String(r.pagamento?.proprietario?.nome || "").toLowerCase();
    return !q || numero.includes(q) || proprietario.includes(q);
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Tens certeza que queres eliminar este recibo?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/recibos/${id}`);
      setRecibos((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
      alert("Erro ao eliminar recibo.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownloadPDF = async (id) => {
    try {
      const res = await api.get(`/recibos/${id}/pdf`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `recibo_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Erro ao baixar PDF.");
    }
  };

  // EXPORTS
  const exportCSV = () => {
    const header = ["ID", "Número", "Data", "Proprietário", "Valor"];
    const rows = filteredRecibos.map((r) => [
      r.id,
      r.numero,
      r.data || r.dataEmissao
        ? dayjs(r.data || r.dataEmissao).format("DD/MM/YYYY")
        : "-",
      r.pagamento?.proprietario?.nome || "-",
      r.pagamento ? formatCurrency(Number(r.pagamento.valor)) : "-",
    ]);

    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "recibos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportExcel = () => {
    const data = filteredRecibos.map((r) => ({
      ID: r.id,
      Número: r.numero,
      Data: r.data || r.dataEmissao
        ? dayjs(r.data || r.dataEmissao).format("DD/MM/YYYY")
        : "-",
      Proprietário: r.pagamento?.proprietario?.nome || "-",
      Valor: r.pagamento ? formatCurrency(Number(r.pagamento.valor)) : "-",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Recibos");
    XLSX.writeFile(wb, "recibos.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Relatório de Recibos", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [["ID", "Número", "Data", "Proprietário", "Valor"]],
      body: filteredRecibos.map((r) => [
        r.id,
        r.numero,
        r.data || r.dataEmissao
          ? dayjs(r.data || r.dataEmissao).format("DD/MM/YYYY")
          : "-",
        r.pagamento?.proprietario?.nome || "-",
        r.pagamento ? formatCurrency(Number(r.pagamento.valor)) : "-",
      ]),
    });

    doc.save("recibos.pdf");
  };

  const handlePrint = () => {
    const content = document.getElementById("printArea").innerHTML;
    const win = window.open("", "", "width=900,height=650");

    win.document.write(`
      <html>
        <head>
          <title>Recibos</title>
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

  return (
    <div className="space-y-8 w-full">

      {/* HEADER (estilo Edifícios) */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/40 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">

          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent mb-2">
              Recibos
            </h1>
            <p className="text-xl text-slate-600 font-semibold">
              {filteredRecibos.length} resultados encontrados
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">

            {/* SEARCH */}
            <div className="relative flex-1 lg:w-96">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Pesquisar recibo ou proprietário..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-2xl focus:ring-4 focus:ring-blue-200/50 outline-none shadow-lg"
              />
            </div>

            {/* BUTTON */}
            <button
              onClick={() => navigate("/recibos/novo")}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-2xl shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Novo Recibo
            </button>

          </div>
        </div>
      </div>

      {/* EXPORTS */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/40 shadow-xl">
        <div className="flex flex-wrap gap-3 justify-center">

          <button onClick={exportCSV} className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold">
            <FileText className="w-4 h-4 inline mr-2" /> CSV
          </button>

          <button onClick={exportExcel} className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold">
            <FileSpreadsheet className="w-4 h-4 inline mr-2" /> Excel
          </button>

          <button onClick={exportPDF} className="px-6 py-3 bg-red-600 text-white rounded-2xl font-bold">
            <FileDown className="w-4 h-4 inline mr-2" /> PDF
          </button>

          <button onClick={handlePrint} className="px-6 py-3 bg-slate-600 text-white rounded-2xl font-bold">
            <Printer className="w-4 h-4 inline mr-2" /> Imprimir
          </button>

        </div>
      </div>

      {/* TABLE */}
      <div id="printArea" className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl overflow-x-auto">

        <table className="w-full text-sm md:text-base">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Número</th>
              <th className="p-3">Data</th>
              <th className="p-3">Proprietário</th>
              <th className="p-3">Valor</th>
              <th className="p-3">Ações</th>
            </tr>
          </thead>

          <tbody>
            {filteredRecibos.map((r) => (
              <tr key={r.id} className="border-b hover:bg-slate-50">

                <td className="p-3">{r.id}</td>
                <td className="p-3">{r.numero}</td>

                <td className="p-3">
                  {r.data || r.dataEmissao
                    ? dayjs(r.data || r.dataEmissao).format("DD/MM/YYYY")
                    : "-"}
                </td>

                <td className="p-3">{r.pagamento?.proprietario?.nome || "-"}</td>

                <td className="p-3">
                  {r.pagamento ? formatCurrency(Number(r.pagamento.valor)) : "-"}
                </td>

                <td className="p-3 flex gap-2">

                  <button onClick={() => navigate(`/recibos/${r.id}/editar`)}>
                    <Pencil className="text-blue-600" />
                  </button>

                  <button onClick={() => navigate(`/recibos/${r.id}/detalhe`)}>
                    <Eye className="text-green-600" />
                  </button>

                  <button onClick={() => handleDownloadPDF(r.id)}>
                    <Download className="text-gray-600" />
                  </button>

                  <button
                    onClick={() => handleDelete(r.id)}
                    className={deletingId === r.id ? "opacity-50" : ""}
                  >
                    <Trash2 className="text-red-600" />
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => setPaginaAtual((p) => Math.max(p - 1, 1))}
          className="px-4 py-2 bg-gray-200 rounded-xl"
        >
          Anterior
        </button>

        <span>
          Página {paginaAtual} de {totalPaginas}
        </span>

        <button
          onClick={() => setPaginaAtual((p) => Math.min(p + 1, totalPaginas))}
          className="px-4 py-2 bg-gray-200 rounded-xl"
        >
          Próxima
        </button>
      </div>

    </div>
  );
};

export default ReciboList;
