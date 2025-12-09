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
      console.error("Erro ao carregar frações:", err);
      setError("Não foi possível carregar as frações");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔎 Filtro
  const filteredFracoes = fracoes.filter((f) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    const numero = String(f.numero || "").toLowerCase();
    const tipo = String(f.tipo || "").toLowerCase();
    const proprietario = String(f.proprietario?.nome || "").toLowerCase();
    const inquilino = String(f.inquilino?.nome || "").toLowerCase();
    return (
      numero.includes(q) ||
      tipo.includes(q) ||
      proprietario.includes(q) ||
      inquilino.includes(q)
    );
  });

  // ✏️ Editar
  const handleEdit = (id) => {
    navigate(`/fracoes/editar/${id}`);
  };

  // 🗑️ Eliminar
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja eliminar esta fração?")) return;
    try {
      await api.delete(`/fracoes/${id}`);
      toast.success("Fração eliminada com sucesso!");
      fetchData();
    } catch (err) {
      console.error("Erro ao eliminar fração:", err);
      toast.error("Erro ao eliminar fração.");
    }
  };

  // 📤 Exportações
  const exportCSV = () => {
    const header = [
      "ID",
      "Número",
      "Tipo",
      "Estado",
      "Edifício",
      "Proprietário",
      "Inquilino",
    ];
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
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "fracoes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      head: [
        ["ID", "Número", "Tipo", "Estado", "Edifício", "Proprietário", "Inquilino"],
      ],
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
          <title>Relatório de Frações</title>
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
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <h2 className="text-lg font-semibold text-gray-700">
          Lista de Frações
        </h2>
        <input
          type="text"
          placeholder="Pesquisar por número, tipo, proprietário ou inquilino..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded p-2 w-full md:w-64 text-gray-700"
        />
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Botões de exportação */}
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
      <div id="printArea" className="overflow-x-auto">
        <table className="w-full text-sm md:text-base border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="p-2">ID</th>
              <th className="p-2">Número</th>
              <th className="p-2">Tipo</th>
              <th className="p-2">Estado</th>
              <th className="p-2">Edifício</th>
              <th className="p-2">Proprietário</th>
              <th className="p-2">Inquilino</th>
              <th className="p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredFracoes.map((f) => (
              <tr key={f.id} className="hover:bg-gray-50 border-b last:border-none">
                <td className="p-2">{f.id}</td>
                <td className="p-2">{f.numero}</td>
                <td className="p-2">{f.tipo || "-"}</td>
                <td className="p-2">{f.estado || "-"}</td>
                <td className="p-2">{f.edificio?.nome || "-"}</td>
                <td className="p-2">{f.proprietario?.nome || "-"}</td>
                <td className="p-2">{f.inquilino?.nome || "-"}</td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(f.id)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Editar"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(f.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredFracoes.length === 0 && (
              <tr>
                <td colSpan="8" className="p-4 text-center text-gray-500">
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