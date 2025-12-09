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
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency } from "../../utils/formatCurrency"; // ✅ import global

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
      alert("✅ Recibo eliminado!");
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
      console.error("Erro ao baixar recibo PDF:", err);
      alert("Erro ao baixar PDF do recibo.");
    }
  };

  // ---------- EXPORTAÇÕES ----------
  const exportCSV = () => {
    const header = ["ID", "Número", "Data", "Proprietário", "Valor"];
    const rows = filteredRecibos.map((r) => [
      r.id,
      r.numero,
      r.data || r.dataEmissao
        ? dayjs(r.data || r.dataEmissao).format("DD/MM/YYYY")
        : "-",
      r.pagamento?.proprietario?.nome || "-",
      r.pagamento ? formatCurrency(Number(r.pagamento.valor)) : "-", // ✅ formatCurrency
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
      Valor: r.pagamento ? formatCurrency(Number(r.pagamento.valor)) : "-", // ✅ formatCurrency
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
        r.pagamento ? formatCurrency(Number(r.pagamento.valor)) : "-", // ✅ formatCurrency
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
          <title>Relatório de Recibos</title>
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
    <div className="bg-white p-4 rounded-lg shadow flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <h2 className="text-lg font-semibold text-gray-700">Lista de Recibos</h2>
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <input
            type="text"
            placeholder="Pesquisar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded p-2 w-full md:w-64 text-gray-700"
          />
          <button
            onClick={() => navigate("/recibos/novo")}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm"
          >
            <FileText size={16} /> Novo Recibo
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
              <th className="p-2">Número</th>
              <th className="p-2">Data</th>
              <th className="p-2">Proprietário</th>
              <th className="p-2">Valor</th>
              <th className="p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecibos.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50 border-b last:border-none">
                <td className="p-2 whitespace-nowrap">{r.id}</td>
                <td className="p-2">{r.numero}</td>
                <td className="p-2">
                  {r.data || r.dataEmissao
                    ? dayjs(r.data || r.dataEmissao).format("DD/MM/YYYY")
                    : "-"}
                </td>
                <td className="p-2">{r.pagamento?.proprietario?.nome || "-"}</td>
                <td className="p-2">
                  {r.pagamento
                    ? formatCurrency(Number(r.pagamento.valor)) // ✅ formatCurrency na tabela
                    : "-"}
                </td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => navigate(`/recibos/${r.id}/editar`)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Editar"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => navigate(`/recibos/${r.id}/detalhe`)}
                    className="text-green-600 hover:text-green-800"
                    title="Ver Detalhe"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => handleDownloadPDF(r.id)}
                    className="text-gray-600 hover:text-gray-800"
                    title="Baixar PDF"
                  >
                    <Download size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className={`text-red-600 hover:text-red-800 ${
                      deletingId === r.id ? "opacity-50 pointer-events-none" : ""
                    }`}
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredRecibos.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  Nenhum recibo encontrado.
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

export default ReciboList;