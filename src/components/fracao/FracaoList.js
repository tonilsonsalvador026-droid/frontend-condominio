// src/components/fracoes/FracaoList.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import {
  FileText,
  FileSpreadsheet,
  FileDown,
  Printer,
  Pencil,
  Trash2,
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

const FracaoList = () => {
  const [fracoes, setFracoes] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await api.get("/fracoes");
      setFracoes(res.data);
    } catch (err) {
      setError("Não foi possível carregar as frações");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredFracoes = fracoes.filter((f) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      String(f.numero || "").toLowerCase().includes(q) ||
      String(f.tipo || "").toLowerCase().includes(q) ||
      String(f.proprietario?.nome || "").toLowerCase().includes(q) ||
      String(f.inquilino?.nome || "").toLowerCase().includes(q)
    );
  });

  const handleEdit = (id) => navigate(`/fracoes/editar/${id}`);

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja eliminar esta fração?")) return;
    try {
      await api.delete(`/fracoes/${id}`);
      toast.success("Fração eliminada com sucesso!");
      fetchData();
    } catch {
      toast.error("Erro ao eliminar fração.");
    }
  };

  // EXPORTAÇÕES (mantidas)
  const exportCSV = () => {
    const header = ["ID","Número","Tipo","Estado","Edifício","Proprietário","Inquilino"];
    const rows = filteredFracoes.map((f) => [
      f.id,
      f.numero,
      f.tipo || "-",
      f.estado || "-",
      f.edificio?.nome || "-",
      f.proprietario?.nome || "-",
      f.inquilino?.nome || "-",
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "fracoes.csv";
    link.click();
  };

  const exportExcel = () => {
    const data = filteredFracoes.map((f) => ({
      ID: f.id,
      Número: f.numero,
      Tipo: f.tipo || "-",
      Estado: f.estado || "-",
      Edifício: f.edificio?.nome || "-",
      Proprietário: f.proprietario?.nome || "-",
      Inquilino: f.inquilino?.nome || "-",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Frações");
    XLSX.writeFile(wb, "fracoes.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Relatório de Frações", 14, 15);
    autoTable(doc, {
      startY: 25,
      head: [["ID","Número","Tipo","Estado","Edifício","Proprietário","Inquilino"]],
      body: filteredFracoes.map((f) => [
        f.id,
        f.numero,
        f.tipo || "-",
        f.estado || "-",
        f.edificio?.nome || "-",
        f.proprietario?.nome || "-",
        f.inquilino?.nome || "-",
      ]),
    });
    doc.save("fracoes.pdf");
  };

  const handlePrint = () => {
    const content = document.getElementById("printArea").innerHTML;
    const win = window.open("", "", "width=900,height=650");
    win.document.write(`
      <html>
        <head>
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
    <div className="bg-white rounded-2xl shadow-md border p-6">
      {/* Cabeçalho IGUAL ao CondominioList */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Lista de Frações
          </h2>
          <p className="text-gray-500 text-sm">
            Visualize, pesquise, edite e exporte as frações cadastradas
          </p>
        </div>

        <input
          type="text"
          placeholder="Pesquisar por número, tipo, proprietário ou inquilino..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full lg:w-80 focus:ring-2 focus:ring-blue-200 outline-none"
        />
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Botões IGUAIS */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button onClick={exportCSV} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
          <FileText size={16} /> CSV
        </button>
        <button onClick={exportExcel} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm">
          <FileSpreadsheet size={16} /> Excel
        </button>
        <button onClick={exportPDF} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm">
          <FileDown size={16} /> PDF
        </button>
        <button onClick={handlePrint} className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm">
          <Printer size={16} /> Imprimir
        </button>
      </div>

      {/* Tabela IGUAL */}
      <div id="printArea" className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm md:text-base">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Número</th>
              <th className="p-3 text-left">Tipo</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-left">Edifício</th>
              <th className="p-3 text-left">Proprietário</th>
              <th className="p-3 text-left">Inquilino</th>
              <th className="p-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredFracoes.map((f) => (
              <tr key={f.id} className="border-t hover:bg-gray-50 transition">
                <td className="p-3">{f.id}</td>
                <td className="p-3 font-medium text-gray-800">{f.numero}</td>
                <td className="p-3">{f.tipo || "-"}</td>
                <td className="p-3">{f.estado || "-"}</td>
                <td className="p-3">{f.edificio?.nome || "-"}</td>
                <td className="p-3">{f.proprietario?.nome || "-"}</td>
                <td className="p-3">{f.inquilino?.nome || "-"}</td>
                <td className="p-3 flex gap-3">
                  <button onClick={() => handleEdit(f.id)} className="text-blue-600 hover:text-blue-800">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(f.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredFracoes.length === 0 && (
              <tr>
                <td colSpan="8" className="p-6 text-center text-gray-400">
                  Nenhuma fração encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FracaoList;
