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
      console.error("Erro ao baixar PDF:", err);
    }
  };

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
    win.document.write(`<html><body>${content}</body></html>`);
    win.document.close();
    win.print();
  };

  return (
    <div className="space-y-8 w-full">

      {/* HEADER */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">

          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
              Recibos
            </h1>
            <p className="text-xl text-slate-600 font-semibold">
              {filteredRecibos.length} de {recibos.length} encontrados
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">

            <div className="relative flex-1 lg:w-96">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquisar recibos..."
                className="w-full pl-12 pr-6 py-4 bg-white/70 border rounded-2xl shadow-lg"
              />
            </div>

            <button
              onClick={() => navigate("/recibos/novo")}
              className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Novo Recibo
            </button>

          </div>
        </div>
      </div>

      {/* TABLE */}
      <div id="printArea" className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl overflow-x-auto">

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th>ID</th>
              <th>Número</th>
              <th>Data</th>
              <th>Proprietário</th>
              <th>Valor</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {filteredRecibos.map((r) => (
              <tr key={r.id} className="border-b hover:bg-slate-50">

                <td>#{r.id}</td>
                <td>{r.numero}</td>
                <td>
                  {r.data || r.dataEmissao
                    ? dayjs(r.data || r.dataEmissao).format("DD/MM/YYYY")
                    : "-"}
                </td>
                <td>{r.pagamento?.proprietario?.nome || "-"}</td>
                <td className="font-bold text-emerald-600">
                  {r.pagamento ? formatCurrency(Number(r.pagamento.valor)) : "-"}
                </td>

                <td className="flex gap-2">
                  <button onClick={() => navigate(`/recibos/${r.id}/editar`)}>
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => navigate(`/recibos/${r.id}/detalhe`)}>
                    <Eye size={18} />
                  </button>
                  <button onClick={() => handleDownloadPDF(r.id)}>
                    <Download size={18} />
                  </button>
                  <button onClick={() => handleDelete(r.id)}>
                    <Trash2 size={18} />
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

export default ReciboList;
