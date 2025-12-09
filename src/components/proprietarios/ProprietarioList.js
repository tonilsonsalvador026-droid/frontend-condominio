// src/components/proprietarios/ProprietarioList.js
import React, { useEffect, useState } from "react";
import api from "../../api";
import { FileText, FileSpreadsheet, FileDown, Printer } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ProprietarioList = () => {
  const [proprietarios, setProprietarios] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const res = await api.get("/proprietarios");
      setProprietarios(res.data);
    } catch (err) {
      console.error("Erro ao carregar proprietários:", err);
      setError("Não foi possível carregar os proprietários");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔎 Filtro por nome
  const filteredProprietarios = proprietarios.filter((p) =>
    p.nome.toLowerCase().includes(search.toLowerCase())
  );

  // 📤 Exportar CSV
  const exportCSV = () => {
    const header = ["ID", "Nome", "Email", "Telefone", "NIF"];
    const rows = filteredProprietarios.map((p) => [
      p.id,
      p.nome,
      p.email || "-",
      p.telefone || "-",
      p.nif || "-",
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "proprietarios.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 📤 Exportar Excel
  const exportExcel = () => {
    const data = filteredProprietarios.map((p) => ({
      ID: p.id,
      Nome: p.nome,
      Email: p.email || "-",
      Telefone: p.telefone || "-",
      NIF: p.nif || "-",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Proprietários");
    XLSX.writeFile(wb, "proprietarios.xlsx");
  };

  // 📤 Exportar PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Relatório de Proprietários", 14, 15);
    autoTable(doc, {
      startY: 25,
      head: [["ID", "Nome", "Email", "Telefone", "NIF"]],
      body: filteredProprietarios.map((p) => [
        p.id,
        p.nome,
        p.email || "-",
        p.telefone || "-",
        p.nif || "-",
      ]),
    });
    doc.save("proprietarios.pdf");
  };

  // 📤 Impressão
  const handlePrint = () => {
    const content = document.getElementById("printArea").innerHTML;
    const win = window.open("", "", "width=900,height=650");
    win.document.write(`
      <html>
        <head>
          <title>Relatório de Proprietários</title>
          <style>
            table { width: 100%; border-collapse: collapse; font-size: 14px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background: #f5f5f5; }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <h2 className="text-lg font-semibold text-gray-700">
          Lista de Proprietários
        </h2>
        <input
          type="text"
          placeholder="Pesquisar por nome..."
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

      {/* Tabela responsiva */}
      <div id="printArea" className="overflow-x-auto">
        <table className="w-full text-sm md:text-base border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="p-2">ID</th>
              <th className="p-2">Nome</th>
              <th className="p-2">Email</th>
              <th className="p-2">Telefone</th>
              <th className="p-2">NIF</th>
            </tr>
          </thead>
          <tbody>
            {filteredProprietarios.map((p) => (
              <tr
                key={p.id}
                className="hover:bg-gray-50 border-b last:border-none"
              >
                <td className="p-2">{p.id}</td>
                <td className="p-2">{p.nome}</td>
                <td className="p-2">{p.email || "-"}</td>
                <td className="p-2">{p.telefone || "-"}</td>
                <td className="p-2">{p.nif || "-"}</td>
              </tr>
            ))}
            {filteredProprietarios.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  Nenhum proprietário encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProprietarioList;