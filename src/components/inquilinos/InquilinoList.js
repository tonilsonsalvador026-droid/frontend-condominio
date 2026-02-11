// src/components/inquilinos/InquilinoList.js
import React, { useEffect, useState } from "react";
import api from "../../api";
import { FileText, FileSpreadsheet, FileDown, Printer } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const InquilinoList = () => {
  const [inquilinos, setInquilinos] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const res = await api.get("/inquilinos");
      setInquilinos(res.data);
    } catch (err) {
      console.error("Erro ao carregar inquilinos:", err);
      setError("Não foi possível carregar os inquilinos");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredInquilinos = inquilinos.filter((i) =>
    i.nome.toLowerCase().includes(search.toLowerCase())
  );

  // Exportações
  const exportCSV = () => {
    const header = ["ID", "Nome", "Email", "Telefone", "NIF", "Fração", "Edifício"];
    const rows = filteredInquilinos.map((i) => [
      i.id,
      i.nome,
      i.email || "-",
      i.telefone || "-",
      i.nif || "-",
      i.fracao?.numero || "-",
      i.fracao?.edificio?.nome || "-",
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "inquilinos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportExcel = () => {
    const data = filteredInquilinos.map((i) => ({
      ID: i.id,
      Nome: i.nome,
      Email: i.email || "-",
      Telefone: i.telefone || "-",
      NIF: i.nif || "-",
      "Fração": i.fracao?.numero || "-",
      "Edifício": i.fracao?.edificio?.nome || "-",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inquilinos");
    XLSX.writeFile(wb, "inquilinos.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Relatório de Inquilinos", 14, 15);
    autoTable(doc, {
      startY: 25,
      head: [["ID", "Nome", "Email", "Telefone", "NIF", "Fração", "Edifício"]],
      body: filteredInquilinos.map((i) => [
        i.id,
        i.nome,
        i.email || "-",
        i.telefone || "-",
        i.nif || "-",
        i.fracao?.numero || "-",
        i.fracao?.edificio?.nome || "-",
      ]),
    });
    doc.save("inquilinos.pdf");
  };

  const handlePrint = () => {
    const content = document.getElementById("printArea").innerHTML;
    const win = window.open("", "", "width=900,height=650");
    win.document.write(`
      <html>
        <head>
          <title>Relatório de Inquilinos</title>
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
      {/* Cabeçalho */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Lista de Inquilinos</h2>
          <p className="text-gray-500 text-sm">
            Visualize, pesquise e exporte os inquilinos cadastrados
          </p>
        </div>
        <input
          type="text"
          placeholder="Pesquisar por nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full lg:w-80 focus:ring-2 focus:ring-blue-200 outline-none"
        />
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Botões de exportação */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
        >
          <FileText size={16} /> CSV
        </button>
        <button
          onClick={exportExcel}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
        >
          <FileSpreadsheet size={16} /> Excel
        </button>
        <button
          onClick={exportPDF}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
        >
          <FileDown size={16} /> PDF
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm"
        >
          <Printer size={16} /> Imprimir
        </button>
      </div>

      {/* Tabela */}
      <div id="printArea" className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm md:text-base">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Nome</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Telefone</th>
              <th className="p-3 text-left">NIF</th>
              <th className="p-3 text-left">Fração</th>
              <th className="p-3 text-left">Edifício</th>
            </tr>
          </thead>
          <tbody>
            {filteredInquilinos.map((i) => (
              <tr key={i.id} className="border-t hover:bg-gray-50 transition">
                <td className="p-3">{i.id}</td>
                <td className="p-3 font-medium text-gray-800">{i.nome}</td>
                <td className="p-3 text-gray-600">{i.email || "-"}</td>
                <td className="p-3 text-gray-600">{i.telefone || "-"}</td>
                <td className="p-3 text-gray-600">{i.nif || "-"}</td>
                <td className="p-3 text-gray-600">{i.fracao?.numero || "-"}</td>
                <td className="p-3 text-gray-600">{i.fracao?.edificio?.nome || "-"}</td>
              </tr>
            ))}
            {filteredInquilinos.length === 0 && (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-400">
                  Nenhum inquilino encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InquilinoList;
