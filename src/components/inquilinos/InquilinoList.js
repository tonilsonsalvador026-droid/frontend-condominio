// src/components/inquilinos/InquilinoList.js
import React, { useEffect, useState } from "react";
import api from "../../api";

import CardContainer from "../ui/CardContainer";
import PageHeader from "../ui/PageHeader";
import ActionButtons from "../ui/ActionButtons";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const InquilinoList = () => {
  const [inquilinos, setInquilinos] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Carregar dados
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

  // Filtrar pesquisa
  const filteredInquilinos = inquilinos.filter(
    (i) =>
      i.nome.toLowerCase().includes(search.toLowerCase()) ||
      (i.fracao?.numero || "").toString().includes(search)
  );

  // Export CSV
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
    link.download = "inquilinos.csv";
    link.click();
  };

  // Export Excel
  const exportExcel = () => {
    const data = filteredInquilinos.map((i) => ({
      ID: i.id,
      Nome: i.nome,
      Email: i.email || "-",
      Telefone: i.telefone || "-",
      NIF: i.nif || "-",
      Fração: i.fracao?.numero || "-",
      Edifício: i.fracao?.edificio?.nome || "-",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inquilinos");
    XLSX.writeFile(wb, "inquilinos.xlsx");
  };

  // Export PDF
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

  // Print
  const handlePrint = () => {
    const content = document.getElementById("printArea").innerHTML;
    const win = window.open("", "", "width=900,height=650");
    win.document.write(`
      <html>
        <head>
          <title>Relatório de Inquilinos</title>
          <style>
            table { width:100%; border-collapse:collapse; font-size:14px }
            th, td { border:1px solid #ccc; padding:8px; text-align:left }
            th { background:#f5f5f5 }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <CardContainer>
      <PageHeader
        title="Lista de Inquilinos"
        subtitle="Visualize, pesquise e exporte os inquilinos"
        search={search}
        setSearch={setSearch}
        placeholder="Pesquisar por nome ou fração..."
      />

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <ActionButtons
        onCSV={exportCSV}
        onExcel={exportExcel}
        onPDF={exportPDF}
        onPrint={handlePrint}
      />

      <div id="printArea" className="overflow-x-auto rounded-xl border">
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
    </CardContainer>
  );
};

export default InquilinoList;

