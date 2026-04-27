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
  const [search, setSearch] = useState("");

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

  // ---------------- FILTER (NOVO - NÃO ALTERA LOGICA BASE) ----------------
  const filteredContas = contas.filter((c) =>
    c.proprietario?.nome?.toLowerCase().includes(search.toLowerCase())
  );

  // ---------------- EXPORTAÇÕES ----------------

  const exportCSV = () => {
    const csvRows = [];
    const headers = ["ID", "Proprietário", "Saldo Inicial", "Saldo Atual", "Data de Criação"];
    csvRows.push(headers.join(","));

    filteredContas.forEach((conta) => {
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
      filteredContas.map((conta) => ({
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
    doc.text("Lista de Contas Correntes", 14, 15);

    autoTable(doc, {
      head: [["ID", "Proprietário", "Saldo Inicial", "Saldo Atual", "Data"]],
      body: filteredContas.map((conta) => [
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

      {/* HEADER IGUAL EDIFÍCIOS (NOVO PADRÃO) */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/40 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

          {/* TITLE */}
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent mb-2">
              Contas Correntes
            </h1>

            <p className="text-xl text-slate-600 font-semibold">
              {filteredContas.length} de {contas.length} encontrados
            </p>
          </div>

          {/* SEARCH */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">

            <div className="relative flex-1 lg:w-96">
              <input
                type="text"
                placeholder="Pesquisar por proprietário..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-6 py-4 bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-2xl focus:ring-4 focus:ring-blue-200/50 focus:border-blue-300 outline-none transition-all shadow-lg hover:shadow-xl"
              />
            </div>

            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-2xl shadow-xl hover:-translate-y-1 transition-all">
              + Nova Conta
            </button>

          </div>

        </div>
      </div>

      {/* LISTA */}
      <div id="printArea" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {filteredContas.length > 0 ? filteredContas.map((conta) => (
          <div
            key={conta.id}
            className="group bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl hover:shadow-2xl border border-slate-200/40 hover:border-blue-200/60 hover:-translate-y-2 transition-all duration-500 flex flex-col"
          >

            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Wallet className="text-blue-600" />
              </div>
              <span className="text-xs font-bold text-slate-500">#{conta.id}</span>
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-3">
              <User className="inline w-4 h-4 mr-1" />
              {conta.proprietario?.nome || "Sem proprietário"}
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-4">

              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-500">Saldo Inicial</p>
                <p className="font-bold">{formatCurrency(conta.saldoInicial)}</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-500">Saldo Atual</p>
                <p className={`font-bold ${conta.saldoAtual < 0 ? "text-red-600" : "text-emerald-600"}`}>
                  {formatCurrency(conta.saldoAtual)}
                </p>
              </div>

            </div>

            <p className="text-sm text-slate-500 mb-4">
              <Calendar className="inline w-4 h-4 mr-1" />
              {dayjs(conta.criadoEm).format("DD/MM/YYYY")}
            </p>

            <div className="flex justify-between pt-4 border-t">

              <div className="flex gap-3">
                <button onClick={() => onEdit(conta)} className="hover:scale-110 transition">
                  <Pencil className="text-blue-600" />
                </button>

                <button onClick={() => onViewMovimentos(conta)} className="hover:scale-110 transition">
                  <Eye className="text-emerald-600" />
                </button>

                <button onClick={() => handleDelete(conta.id)} className="hover:scale-110 transition">
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
      {filteredContas.length > 0 && (
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border shadow-xl">
          <div className="flex flex-wrap gap-3 justify-center">

            <button onClick={exportCSV} className="group flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:-translate-y-1 transition-all">
              <FileText className="w-4 h-4" /> CSV
            </button>

            <button onClick={exportExcel} className="group flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold rounded-2xl hover:-translate-y-1 transition-all">
              <FileSpreadsheet className="w-4 h-4" /> Excel
            </button>

            <button onClick={exportPDF} className="group flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-bold rounded-2xl hover:-translate-y-1 transition-all">
              <FileDown className="w-4 h-4" /> PDF
            </button>

            <button onClick={handlePrint} className="group flex items-center gap-2 px-6 py-3 bg-slate-600 text-white font-bold rounded-2xl hover:-translate-y-1 transition-all">
              <Printer className="w-4 h-4" /> Imprimir
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default ContaCorrenteList;
