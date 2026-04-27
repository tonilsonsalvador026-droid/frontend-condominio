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
  Search,
  Plus,
  Wallet
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency } from "../../utils/formatCurrency";

const ContaCorrenteList = ({ onEdit, onViewMovimentos, onNew }) => {
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

  // 🔍 FILTRO (SEM ALTERAR LÓGICA BASE)
  const filtered = contas.filter(
    (c) =>
      c.proprietario?.nome?.toLowerCase().includes(search.toLowerCase())
  );

  // ---------------- EXPORTAÇÕES ----------------

  const exportCSV = () => {
    const csvRows = [];
    const headers = ["ID", "Proprietário", "Saldo Inicial", "Saldo Atual", "Data de Criação"];
    csvRows.push(headers.join(","));
    filtered.forEach((conta) => {
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
      filtered.map((conta) => ({
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
      startY: 25,
      head: [["ID", "Proprietário", "Saldo Inicial", "Saldo Atual", "Data de Criação"]],
      body: filtered.map((conta) => [
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
    const content = document.getElementById("printAreaContaCorrente").innerHTML;
    const win = window.open("", "", "width=900,height=650");
    win.document.write(`<html><body>${content}</body></html>`);
    win.document.close();
    win.print();
  };

  // ---------------- RENDER ----------------

  return (
    <div className="space-y-8 w-full">

      {/* HEADER PREMIUM */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/40 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">

          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent mb-2">
              Contas Correntes
            </h1>
            <p className="text-xl text-slate-600 font-semibold">
              {filtered.length} de {contas.length} encontradas
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">

            {/* PESQUISA */}
            <div className="relative flex-1 lg:w-96">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Pesquisar por proprietário..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white/70 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 shadow-lg"
              />
            </div>

            {/* BOTÃO NOVO */}
            <button
              onClick={onNew}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-2xl shadow-xl hover:-translate-y-1 transition flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nova Conta
            </button>

          </div>
        </div>
      </div>

      {/* TABELA */}
      <div id="printAreaContaCorrente" className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border shadow-xl overflow-x-auto">
        <table className="w-full text-sm md:text-base">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Proprietário</th>
              <th className="p-3 text-left">Saldo Inicial</th>
              <th className="p-3 text-left">Saldo Atual</th>
              <th className="p-3 text-left">Data</th>
              <th className="p-3 text-center">Ações</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length > 0 ? (
              filtered.map((conta) => (
                <tr key={conta.id} className="border-t hover:bg-slate-50 transition">
                  <td className="p-3">{conta.id}</td>
                  <td className="p-3">{conta.proprietario?.nome || "-"}</td>
                  <td className="p-3">{formatCurrency(conta.saldoInicial)}</td>

                  <td className={`p-3 font-bold ${conta.saldoAtual < 0 ? "text-red-600" : "text-emerald-600"}`}>
                    {formatCurrency(conta.saldoAtual)}
                  </td>

                  <td className="p-3">
                    {dayjs(conta.criadoEm).format("DD/MM/YYYY")}
                  </td>

                  <td className="p-3">
                    <div className="flex justify-center gap-4">
                      <button onClick={() => onEdit(conta)} className="text-blue-600 hover:scale-110 transition">
                        <Pencil size={18} />
                      </button>

                      <button onClick={() => onViewMovimentos(conta)} className="text-green-600 hover:scale-110 transition">
                        <Eye size={18} />
                      </button>

                      <button onClick={() => handleDelete(conta.id)} className="text-red-600 hover:scale-110 transition">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-6 text-slate-400">
                  Nenhuma conta encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* EXPORTS PREMIUM */}
      {filtered.length > 0 && (
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border shadow-xl">
          <div className="flex flex-wrap gap-3 justify-center">

            <button onClick={exportCSV} className="group px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-lg hover:-translate-y-1 transition flex items-center gap-2">
              <FileText size={16} /> CSV
            </button>

            <button onClick={exportExcel} className="group px-6 py-3 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg hover:-translate-y-1 transition flex items-center gap-2">
              <FileSpreadsheet size={16} /> Excel
            </button>

            <button onClick={exportPDF} className="group px-6 py-3 bg-red-600 text-white font-bold rounded-2xl shadow-lg hover:-translate-y-1 transition flex items-center gap-2">
              <FileDown size={16} /> PDF
            </button>

            <button onClick={handlePrint} className="group px-6 py-3 bg-slate-600 text-white font-bold rounded-2xl shadow-lg hover:-translate-y-1 transition flex items-center gap-2">
              <Printer size={16} /> Imprimir
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default ContaCorrenteList;
