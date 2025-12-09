// src/components/contacorrente/ContaCorrenteList.js
import React, { useEffect, useState } from "react";
import api from "../../api";
import dayjs from "dayjs";
import {
  Pencil,
  Eye,
  Trash2,
  FileText,
  FileSpreadsheet,
  FileDown,
  Printer,
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency } from "../../utils/formatCurrency";

const ContaCorrenteList = ({ onEdit, onViewMovimentos }) => {
  const [contas, setContas] = useState([]);

  const fetchContas = async () => {
    try {
      const res = await api.get("/contas-correntes");
      setContas(res.data);
    } catch (error) {
      console.error("Erro ao buscar contas correntes:", error);
    }
  };

  useEffect(() => {
    fetchContas();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta conta corrente?")) return;
    try {
      await api.delete(`/contas-correntes/${id}`);
      fetchContas();
    } catch (error) {
      console.error("Erro ao excluir conta corrente:", error);
    }
  };

  // ---------------- EXPORTAÇÕES ----------------

  const exportCSV = () => {
    const csvRows = [];
    const headers = ["ID", "Proprietário", "Saldo Inicial", "Saldo Atual", "Data de Criação"];
    csvRows.push(headers.join(","));
    contas.forEach((conta) => {
      csvRows.push([
        conta.id,
        conta.proprietario?.nome || "-",
        formatCurrency(conta.saldoInicial),
        formatCurrency(conta.saldoAtual),
        dayjs(conta.criadoEm).format("DD/MM/YYYY"),
      ].join(","));
    });
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contas_correntes.csv";
    a.click();
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      contas.map((conta) => ({
        ID: conta.id,
        Proprietário: conta.proprietario?.nome || "-",
        "Saldo Inicial": formatCurrency(conta.saldoInicial),
        "Saldo Atual": formatCurrency(conta.saldoAtual),
        "Data de Criação": dayjs(conta.criadoEm).format("DD/MM/YYYY"),
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Contas Correntes");
    XLSX.writeFile(wb, "contas_correntes.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Lista de Contas Correntes", 14, 10);
    autoTable(doc, {
      head: [["ID", "Proprietário", "Saldo Inicial", "Saldo Atual", "Data de Criação"]],
      body: contas.map((conta) => [
        conta.id,
        conta.proprietario?.nome || "-",
        formatCurrency(conta.saldoInicial),
        formatCurrency(conta.saldoAtual),
        dayjs(conta.criadoEm).format("DD/MM/YYYY"),
      ]),
    });
    doc.save("contas_correntes.pdf");
  };

  const handlePrint = () => {
    const printContent = document.getElementById("printAreaContaCorrente").innerHTML;
    const w = window.open("", "", "width=900,height=650");
    w.document.write(printContent);
    w.document.close();
    w.print();
  };

  // ---------------- RENDER ----------------

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 mt-6 flex flex-col h-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <h2 className="text-lg font-semibold text-gray-700">Lista de Contas Correntes</h2>
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 text-sm rounded hover:bg-blue-700 transition"
          >
            <FileText size={16} /> CSV
          </button>
          <button
            onClick={exportExcel}
            className="flex items-center gap-1 bg-green-600 text-white px-3 py-2 text-sm rounded hover:bg-green-700 transition"
          >
            <FileSpreadsheet size={16} /> Excel
          </button>
          <button
            onClick={exportPDF}
            className="flex items-center gap-1 bg-red-600 text-white px-3 py-2 text-sm rounded hover:bg-red-700 transition"
          >
            <FileDown size={16} /> PDF
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1 bg-gray-600 text-white px-3 py-2 text-sm rounded hover:bg-gray-700 transition"
          >
            <Printer size={16} /> Imprimir
          </button>
        </div>
      </div>

      <div id="printAreaContaCorrente" className="overflow-x-auto flex-grow">
        <table className="w-full border-collapse text-sm md:text-base">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-700">
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Proprietário</th>
              <th className="px-4 py-2 border">Saldo Inicial</th>
              <th className="px-4 py-2 border">Saldo Atual</th>
              <th className="px-4 py-2 border">Data de Criação</th>
              <th className="px-4 py-2 border text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {contas.length > 0 ? (
              contas.map((conta) => (
                <tr key={conta.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{conta.id}</td>
                  <td className="px-4 py-2 border">{conta.proprietario?.nome || "-"}</td>
                  <td className="px-4 py-2 border">{formatCurrency(conta.saldoInicial)}</td>
                  <td
                    className={`px-4 py-2 border font-semibold ${
                      conta.saldoAtual < 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {formatCurrency(conta.saldoAtual)}
                  </td>
                  <td className="px-4 py-2 border">
                    {dayjs(conta.criadoEm).format("DD/MM/YYYY")}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => onEdit(conta)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Editar"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => onViewMovimentos(conta)}
                        className="text-green-600 hover:text-green-800"
                        title="Ver Movimentos"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(conta.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="px-4 py-2 border text-center text-gray-500"
                  colSpan="6"
                >
                  Nenhuma conta corrente encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContaCorrenteList;