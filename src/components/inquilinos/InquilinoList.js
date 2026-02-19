// src/components/inquilinos/InquilinoList.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const InquilinoList = () => {
  const navigate = useNavigate();

  const [inquilinos, setInquilinos] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const res = await api.get("/inquilinos");
      setInquilinos(res.data);
    } catch (err) {
      setError("Não foi possível carregar os inquilinos");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = inquilinos.filter(
    (i) =>
      i.nome.toLowerCase().includes(search.toLowerCase()) ||
      (i.fracao?.numero || "")
        .toString()
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const header = ["ID", "Nome", "Email", "Telefone", "NIF", "Fração", "Edifício"];
    const rows = filtered.map((i) => [
      i.id,
      i.nome,
      i.email || "-",
      i.telefone || "-",
      i.nif || "-",
      i.fracao?.numero || "-",
      i.fracao?.edificio?.nome || "-",
    ]);

    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv]);
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "inquilinos.csv";
    a.click();
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtered);
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
      body: filtered.map((i) => [
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

  const print = () => window.print();

  return (
    <div className="bg-white rounded-2xl shadow-md border p-6">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between gap-4 mb-6">

        <div>
          <h2 className="text-2xl font-semibold">
            Lista de Inquilinos
          </h2>
          <p className="text-gray-500 text-sm">
            Visualize e exporte os dados
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-3">

          <input
            placeholder="Pesquisar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full lg:w-64"
          />

          <button
            onClick={() => navigate("/inquilinos/novo")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            + Novo
          </button>

        </div>

      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Export buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button onClick={exportCSV} className="btn">CSV</button>
        <button onClick={exportExcel} className="btn">Excel</button>
        <button onClick={exportPDF} className="btn">PDF</button>
        <button onClick={print} className="btn">Imprimir</button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">

          <thead className="bg-gray-50">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Nome</th>
              <th className="p-3">Email</th>
              <th className="p-3">Telefone</th>
              <th className="p-3">NIF</th>
              <th className="p-3">Fração</th>
              <th className="p-3">Edifício</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((i) => (
              <tr key={i.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{i.id}</td>
                <td className="p-3">{i.nome}</td>
                <td className="p-3">{i.email || "-"}</td>
                <td className="p-3">{i.telefone || "-"}</td>
                <td className="p-3">{i.nif || "-"}</td>
                <td className="p-3">{i.fracao?.numero || "-"}</td>
                <td className="p-3">{i.fracao?.edificio?.nome || "-"}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
};

export default InquilinoList;
