// src/components/condominios/CondominioList.js
import React, { useEffect, useState } from "react";
import api from "../../api";
import {
  FileText,
  FileSpreadsheet,
  FileDown,
  Printer,
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const CondominioList = () => {
  const [condominios, setCondominios] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const res = await api.get("/condominios");
      setCondominios(res.data);
    } catch (err) {
      console.error("Erro ao carregar condomínios:", err);
      setError("Não foi possível carregar os condomínios");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredCondominios = condominios.filter(
    (c) =>
      c.nome.toLowerCase().includes(search.toLowerCase()) ||
      c.localizacao.toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const header = ["ID", "Nome", "Localização", "Data Criação"];
    const rows = filteredCondominios.map((c) => [
      c.id,
      c.nome,
      c.localizacao,
      new Date(c.criadoEm).toLocaleDateString("pt-PT"),
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "condominios.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportExcel = () => {
    const data = filteredCondominios.map((c) => ({
      ID: c.id,
      Nome: c.nome,
      Localização: c.localizacao,
      "Data Criação": new Date(c.criadoEm).toLocaleDateString("pt-PT"),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Condomínios");
    XLSX.writeFile(wb, "condominios.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Relatório de Condomínios", 14, 15);
    autoTable(doc, {
      startY: 25,
      head: [["ID", "Nome", "Localização", "Data Criação"]],
      body: filteredCondominios.map((c) => [
        c.id,
        c.nome,
        c.localizacao,
        new Date(c.criadoEm).toLocaleDateString("pt-PT"),
      ]),
    });
    doc.save("condominios.pdf");
  };

  const handlePrint = () => {
    const content = document.getElementById("printArea").innerHTML;
    const win = window.open("", "", "width=900,height=650");
    win.document.write(`
      <html>
        <head>
          <title>Relatório de Condomínios</title>
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
          <h2 className="text-2xl font-semibold text-gray-800">
            Lista de Condomínios
          </h2>
          <p className="text-gray-500 text-sm">
            Visualize, pesquise e exporte os condomínios cadastrados
          </p>
        </div>

        <input
          type="text"
          placeholder="Pesquisar por nome ou localização..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full lg:w-80 focus:ring-2 focus:ring-blue-200 outline-none"
        />
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Botões */}
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
              <th className="p-3 text-left">Localização</th>
              <th className="p-3 text-left">Data Criação</th>
            </tr>
          </thead>
          <tbody>
            {filteredCondominios.map((c) => (
              <tr
                key={c.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-3">{c.id}</td>
                <td className="p-3 font-medium text-gray-800">{c.nome}</td>
                <td className="p-3 text-gray-600">{c.localizacao}</td>
                <td className="p-3 text-gray-600">
                  {new Date(c.criadoEm).toLocaleDateString("pt-PT")}
                </td>
              </tr>
            ))}
            {filteredCondominios.length === 0 && (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-400">
                  Nenhum condomínio encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CondominioList;
