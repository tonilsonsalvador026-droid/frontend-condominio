// src/components/contacorrente/MovimentoList.js
import React, { useEffect, useState, useCallback } from "react";
import api from "../../api";
import dayjs from "dayjs";
import {
  FileText,
  FileSpreadsheet,
  FileDown,
  Printer,
  Pencil,
  Trash2,
  Eye,
  ArrowLeft,
  Plus
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency } from "../../utils/formatCurrency";

const MovimentoList = ({ conta, onBack, onNew, onEdit }) => {

  const [movimentos, setMovimentos] = useState([]);
  const [erro, setErro] = useState(null);

  const fetchMovimentos = useCallback(async () => {
    try {
      let res;
      if (conta?.id) {
        res = await api.get(`/contas-correntes/${conta.id}/movimentos`);
      } else {
        res = await api.get(`/movimentos`);
      }
      setMovimentos(res.data || []);
    } catch (error) {
      console.error("Erro ao buscar movimentos:", error);
      setErro("Não foi possível carregar os movimentos.");
    }
  }, [conta?.id]);

  useEffect(() => {
    fetchMovimentos();
  }, [fetchMovimentos]);

const calcularSaldo = () => {
  let saldo = 0;

  return movimentos.map((mov) => {
    const valor = mov.valor || 0;

    if (mov.tipo.toLowerCase() === "debito") {
      saldo -= valor;
    } else if (mov.tipo.toLowerCase() === "credito") {
      saldo += valor;
    }

    return { ...mov, saldoAcumulado: saldo };
  });
};

  const movimentosComSaldo = calcularSaldo();

const totalDebito = movimentos
  .filter(mov => mov.tipo.toLowerCase() === "debito")
  .reduce((acc, mov) => acc + (mov.valor || 0), 0);

const totalCredito = movimentos
  .filter(mov => mov.tipo.toLowerCase() === "credito")
  .reduce((acc, mov) => acc + (mov.valor || 0), 0);

// 🔥 AGORA vem do backend
const saldoAtual = conta?.saldoAtual || 0;
};

  const { totalDebito, totalCredito, saldoAtual } = calcularTotais();

  // ================= EXPORTAÇÕES =================

  const exportCSV = () => {
    const csvRows = [];
    const headers = ["Data", "Proprietário", "Descrição", "Tipo", "Valor", "Saldo"];
    csvRows.push(headers.join(","));

    movimentosComSaldo.forEach((mov) => {
      csvRows.push([
        mov.data ? dayjs(mov.data).format("DD/MM/YYYY") : "-",
        mov.contaCorrente?.proprietario?.nome || "-",
        mov.descricao || "-",
        mov.tipo,
        mov.valor,
        mov.saldoAcumulado,
      ].join(","));
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "movimentos.csv";
    a.click();
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      movimentosComSaldo.map((mov) => ({
        Data: mov.data ? dayjs(mov.data).format("DD/MM/YYYY") : "-",
        Proprietário: mov.contaCorrente?.proprietario?.nome || "-",
        Descrição: mov.descricao || "-",
        Tipo: mov.tipo,
        Valor: mov.valor,
        Saldo: mov.saldoAcumulado,
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Movimentos");
    XLSX.writeFile(wb, "movimentos.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Relatório de Movimentos", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [["Data", "Proprietário", "Descrição", "Tipo", "Valor", "Saldo"]],
      body: movimentosComSaldo.map((mov) => [
        mov.data ? dayjs(mov.data).format("DD/MM/YYYY") : "-",
        mov.contaCorrente?.proprietario?.nome || "-",
        mov.descricao || "-",
        mov.tipo,
        formatCurrency(mov.valor || 0),
        formatCurrency(mov.saldoAcumulado || 0),
      ]),
    });

    doc.save("movimentos.pdf");
  };

  const handlePrint = () => {
    const content = document.getElementById("printAreaMovimentos").innerHTML;
    const win = window.open("", "", "width=900,height=650");
    win.document.write(`<html><body>${content}</body></html>`);
    win.document.close();
    win.print();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este movimento?")) return;
    try {
      await api.delete(`/movimentos/${id}`);
      fetchMovimentos();
    } catch {
      alert("Erro ao excluir movimento.");
    }
  };

  if (erro) {
    return (
      <div className="bg-red-50 border border-red-300 text-red-600 rounded-2xl p-4 mt-6">
        {erro}
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full">

      {/* HEADER PREMIUM (ALINHADO AO PADRÃO) */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/40 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">

          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent mb-2">
              Extrato de Movimentos
            </h1>
            <p className="text-xl text-slate-600 font-semibold">
              {movimentos.length} registos
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">

            {/* BOTÃO VOLTAR */}
            {onBack && (
              <button
                onClick={onBack}
                className="px-6 py-4 bg-slate-200 hover:bg-slate-300 rounded-2xl font-semibold flex items-center justify-center gap-2 transition hover:-translate-y-1"
              >
                <ArrowLeft size={16} /> Voltar
              </button>
            )}

            {/* BOTÃO NOVO */}
            {onNew && (
              <button
                onClick={onNew}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-2xl shadow-xl hover:-translate-y-1 transition flex items-center justify-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Novo Movimento
              </button>
            )}

          </div>
        </div>
      </div>

      {/* TABELA */}
      <div id="printAreaMovimentos" className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border shadow-xl overflow-x-auto">

        <table className="w-full text-sm md:text-base">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="p-3 text-left">Data</th>
              {!conta && <th className="p-3 text-left">Proprietário</th>}
              <th className="p-3 text-left">Descrição</th>
              <th className="p-3 text-left">Débito</th>
              <th className="p-3 text-left">Crédito</th>
              <th className="p-3 text-left">Saldo</th>
              <th className="p-3 text-center">Ações</th>
            </tr>
          </thead>

          <tbody>
            {movimentosComSaldo.length > 0 ? (
              movimentosComSaldo.map((mov) => (
                <tr key={mov.id} className="border-t hover:bg-slate-50 transition">

                  <td className="p-3">
                    {mov.data ? dayjs(mov.data).format("DD/MM/YYYY") : "-"}
                  </td>

                  {!conta && (
                    <td className="p-3">{mov.contaCorrente?.proprietario?.nome || "-"}</td>
                  )}

                  <td className="p-3">{mov.descricao || "-"}</td>

                  <td className="p-3 text-red-600">
                    {mov.tipo.toLowerCase() === "debito" ? formatCurrency(mov.valor) : ""}
                  </td>

                  <td className="p-3 text-emerald-600">
                    {mov.tipo.toLowerCase() === "credito" ? formatCurrency(mov.valor) : ""}
                  </td>

                  <td className={`p-3 font-bold ${mov.saldoAcumulado < 0 ? "text-red-600" : "text-emerald-600"}`}>
                    {formatCurrency(mov.saldoAcumulado)}
                  </td>

                  <td className="p-3">
                    <div className="flex justify-center gap-4">
                      <button className="text-blue-600 hover:scale-110 transition">
                        <Eye size={18} />
                      </button>

                      {onEdit && (
                        <button onClick={() => onEdit(mov)} className="text-yellow-600 hover:scale-110 transition">
                          <Pencil size={18} />
                        </button>
                      )}

                      <button onClick={() => handleDelete(mov.id)} className="text-red-600 hover:scale-110 transition">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-6 text-slate-400">
                  Nenhum movimento encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* TOTAIS */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-red-50 rounded-2xl font-bold text-red-600 shadow">
            Débito: {formatCurrency(totalDebito)}
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl font-bold text-emerald-600 shadow">
            Crédito: {formatCurrency(totalCredito)}
          </div>

          <div className="p-4 bg-slate-100 rounded-2xl font-bold shadow">
            Saldo: {formatCurrency(saldoAtual)}
          </div>
        </div>

      </div>

      {/* EXPORTS PREMIUM (IGUAL AO OUTRO COMPONENTE) */}
      {movimentos.length > 0 && (
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

export default MovimentoList;
