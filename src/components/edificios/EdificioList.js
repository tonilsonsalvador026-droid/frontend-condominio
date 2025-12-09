// src/components/edificios/EdificioList.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import {
  FileText,
  FileSpreadsheet,
  FileDown,
  Printer,
  Eye,
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const EdificioList = () => {
  const [edificios, setEdificios] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

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

  // 🔎 Filtro por nome
  const filteredEdificios = edificios.filter((e) =>
    e.nome.toLowerCase().includes(search.toLowerCase())
  );

  // 📤 Exportar CSV
  const exportCSV = () => {
    const header = [
      "ID",
      "Nome",
      "Endereço",
      "Andares",
      "Apartamentos",
      "Condomínio",
    ];
    const rows = filteredEdificios.map((e) => [
      e.id,
      e.nome,
      e.endereco,
      e.numeroAndares,
      e.numeroApartamentos,
      e.condominio?.nome || "-",
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

  // 📤 Exportar Excel
  const exportExcel = () => {
    const data = filteredEdificios.map((e) => ({
      ID: e.id,
      Nome: e.nome,
      Endereço: e.endereco,
      Andares: e.numeroAndares,
      Apartamentos: e.numeroApartamentos,
      Condomínio: e.condominio?.nome || "-",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Edifícios");
    XLSX.writeFile(wb, "edificios.xlsx");
  };

  // 📤 Exportar PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Relatório de Edifícios", 14, 15);
    autoTable(doc, {
      startY: 25,
      head: [["ID", "Nome", "Endereço", "Andares", "Apartamentos", "Condomínio"]],
      body: filteredEdificios.map((e) => [
        e.id,
        e.nome,
        e.endereco,
        e.numeroAndares,
        e.numeroApartamentos,
        e.condominio?.nome || "-",
      ]),
    });
    doc.save("edificios.pdf");
  };

  // 📤 Impressão
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
    <div className="bg-white p-4 rounded-lg shadow">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <h2 className="text-lg font-semibold text-gray-700">
          Lista de Edifícios
        </h2>
        <input
          type="text"
          placeholder="Pesquisar por nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded p-2 w-full md:w-64 text-gray-700"
        />
      </div>

      {/* Mensagem de erro */}
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
              <th className="p-2">Nome</th>
              <th className="p-2">Endereço</th>
              <th className="p-2">Andares</th>
              <th className="p-2">Apartamentos</th>
              <th className="p-2">Condomínio</th>
              <th className="p-2 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredEdificios.map((e) => (
              <tr key={e.id} className="hover:bg-gray-50 border-b last:border-none">
                <td className="p-2">{e.id}</td>
                <td className="p-2">{e.nome}</td>
                <td className="p-2">{e.endereco}</td>
                <td className="p-2">{e.numeroAndares}</td>
                <td className="p-2">{e.numeroApartamentos}</td>
                <td className="p-2">{e.condominio?.nome || "-"}</td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => navigate(`/edificios/${e.id}`)}
                    className="text-green-600 hover:text-green-800"
                    title="Ver Detalhes"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredEdificios.length === 0 && (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
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