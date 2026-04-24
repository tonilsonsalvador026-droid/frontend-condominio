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
  Wallet,
  User,
  Calendar
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
      head: [["ID", "Proprietário", "Saldo Inicial", "Saldo Atual", "Data"]],
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
    const content = document.getElementById("printArea").innerHTML;
    const win = window.open("", "", "width=900,height=650");
    win.document.write(`<html><body>${content}</body></html>`);
    win.document.close();
    win.print();
  };

  // ---------------- UI ----------------

  return (
    <div className="space-y-8 w-full">

      {/* HEADER */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/40 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">

          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent mb-2">
              Contas Correntes
            </h1>
            <p className="text-xl text-slate-600 font-semibold">
              {contas.length} contas encontradas
            </p>
          </div>

        </div>
      </div>

      {/* LISTA CARDS */}
      <div id="printArea" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {contas.length > 0 ? contas.map((conta) => (
          <div
            key={conta.id}
            className="group bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl hover:shadow-2xl border border-slate-200/40 hover:border-blue-200/60 hover:-translate-y-2 transition-all duration-500 flex flex-col"
          >

            {/* HEADER CARD */}
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Wallet className="text-blue-600" />
              </div>

              <span className="text-xs font-bold text-slate-500">
                #{conta.id}
              </span>
            </div>

            {/* NOME */}
            <h3 className="text-xl font-black text-slate-900 mb-2">
              <User className="inline w-4 h-4 mr-1" />
              {conta.proprietario?.nome || "Sem proprietário"}
            </h3>

            {/* SALDOS */}
            <div className="grid grid-cols-2 gap-3 my-4">

              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-500">Saldo Inicial</p>
                <p className="font-bold">
                  {formatCurrency(conta.saldoInicial)}
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-500">Saldo Atual</p>
                <p className={`font-bold ${
                  conta.saldoAtual < 0 ? "text-red-600" : "text-emerald-600"
                }`}>
                  {formatCurrency(conta.saldoAtual)}
                </p>
              </div>

            </div>

            {/* DATA */}
            <p className="text-sm text-slate-500 mb-4">
              <Calendar className="inline w-4 h-4 mr-1" />
              {dayjs(conta.criadoEm).format("DD/MM/YYYY")}
            </p>

            {/* ACTIONS */}
            <div className="flex justify-between pt-4 border-t">

              <div className="flex gap-3">
                <button onClick={() => onEdit(conta)}>
                  <Pencil className="text-blue-600" />
                </button>

                <button onClick={() => onViewMovimentos(conta)}>
                  <Eye className="text-green-600" />
                </button>

                <button onClick={() => handleDelete(conta.id)}>
                  <Trash2 className="text-red-600" />
                </button>
              </div>

            </div>

          </div>
        )) : (
          <p className="text-center text-slate-500 col-span-full">
            Nenhuma conta encontrada
          </p>
        )}

      </div>

      {/* EXPORTS */}
      {contas.length > 0 && (
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border shadow-xl">
          <div className="flex flex-wrap gap-3 justify-center">

            <button onClick={exportCSV} className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:-translate-y-1 transition">
              <FileText size={16} /> CSV
            </button>

            <button onClick={exportExcel} className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:-translate-y-1 transition">
              <FileSpreadsheet size={16} /> Excel
            </button>

            <button onClick={exportPDF} className="px-6 py-3 bg-red-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:-translate-y-1 transition">
              <FileDown size={16} /> PDF
            </button>

            <button onClick={handlePrint} className="px-6 py-3 bg-slate-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:-translate-y-1 transition">
              <Printer size={16} /> Imprimir
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default ContaCorrenteList;
