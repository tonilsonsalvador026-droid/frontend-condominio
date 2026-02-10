// src/components/edificios/EdificioList.js
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

const EdificioList = () => {
  const [edificios, setEdificios] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const res = await api.get("/edificios");
      setEdificios(res.data);
    } catch (err) {
      console.error("Erro ao carregar edifícios:", err);
      setError("Não foi possível carregar os edifícios");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = edificios.filter(
    (e) =>
      e.nome.toLowerCase().includes(search.toLowerCase()) ||
      e.endereco.toLowerCase().includes(search.toLowerCase()) ||
      e.condominio?.nome.toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const header = [
      "ID",
      "Nome",
      "Endereço",
      "Andares",
      "Apartamentos",
      "Condomínio",
    ];

    const rows = filtered.map((e) => [
      e.id,
      e.nome,
      e.endereco,
      e.numeroAndares,
      e.numeroApartamentos,
      e.condominio?.nome,
    ]);

    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "edificios.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportExcel = () => {
    const data = filtered.map((e) => ({
      ID: e.id,
      Nome: e.nome,
      Endereço: e.endereco,
      Andares: e.numeroAndares,
      Apartamentos: e.numeroApartamentos,
      Condomínio: e.condominio?.nome,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Edifícios");
    XLSX.writeFile(wb, "edificios.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Relatório de Edifícios", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [
        ["ID", "Nome", "Endereço", "Andares", "Apartamentos", "Condomínio"],
      ],
      body: filtered.map((e) => [
        e.id,
        e.nome,
        e.endereco,
        e.numeroAndares,
        e.numeroApartamentos,
        e.condominio?.nome,
      ]),
    });

    doc.save("edificios.pdf");
  };

  const handlePrint = () => {
    const content = document.getElementById("printArea").innerHTML;
    const win = window.open("", "", "width=900,height=650");
    win.document.write(`
      <html>
        <head>
          <title>Relatório de Edifícios</title>
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
            Lista de Edifícios
          </h2>
          <p className="text-gray-500 text-sm">
            Visualize, pesquise e exporte os edifícios cadastrados
          </p>
        </div>

        <input
          type="text"
          placeholder="Pesquisar por nome, endereço ou condomínio..."
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
              <th className="p-3 text-left">Endereço</th>
              <th className="p-3 text-left">Andares</th>
              <th className="p-3 text-left">Apartamentos</th>
              <th className="p-3 text-left">Condomínio</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.id} className="border-t hover:bg-gray-50 transition">
                <td className="p-3">{e.id}</td>
                <td className="p-3 font-medium text-gray-800">{e.nome}</td>
                <td className="p-3 text-gray-600">{e.endereco}</td>
                <td className="p-3 text-gray-600">{e.numeroAndares}</td>
                <td className="p-3 text-gray-600">{e.numeroApartamentos}</td>
                <td className="p-3 text-gray-600">{e.condominio?.nome}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-400">
                  Nenhum edifício encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EdificioList;

