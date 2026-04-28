// src/components/contacorrente/MovimentoList.js
import React, { useEffect, useState, useCallback } from "react";
import api from "../../api";
import dayjs from "dayjs";
import {
  Pencil,
  Trash2,
  Eye,
  ArrowLeft,
  Plus,
  FileText,
  FileSpreadsheet,
  FileDown,
  Printer,
  Search
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency } from "../../utils/formatCurrency";

const MovimentoList = ({ conta, onBack, onNew, onEdit }) => {
  const [movimentos, setMovimentos] = useState([]);
  const [erro, setErro] = useState(null);
  const [search, setSearch] = useState("");

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

  // 🔍 FILTRO
  const filtered = movimentos.filter((mov) =>
    mov.descricao?.toLowerCase().includes(search.toLowerCase())
  );

  const calcularSaldo = () => {
    let saldo = conta?.saldoInicial || 0;
    return filtered.map((mov) => {
      const valor = mov.valor || 0;
      if (mov.tipo.toLowerCase() === "debito") saldo -= valor;
      else saldo += valor;
      return { ...mov, saldoAcumulado: saldo };
    });
  };

  const movimentosComSaldo = calcularSaldo();

  const calcularTotais = () => {
    let totalDebito = 0;
    let totalCredito = 0;

    filtered.forEach((mov) => {
      if (mov.tipo.toLowerCase() === "debito") totalDebito += mov.valor || 0;
      else totalCredito += mov.valor || 0;
    });

    const saldoAtual = (conta?.saldoInicial || 0) + totalCredito - totalDebito;

    return { totalDebito, totalCredito, saldoAtual };
  };

  const { totalDebito, totalCredito, saldoAtual } = calcularTotais();

  // ---------------- EXPORTS ----------------

  const exportCSV = () => {
    const csvRows = [];
    const headers = ["Data", "Descrição", "Tipo", "Valor", "Saldo"];
    csvRows.push(headers.join(","));

    movimentosComSaldo.forEach((mov) => {
      csvRows.push([
        dayjs(mov.data).format("DD/MM/YYYY"),
        mov.descricao,
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
    const ws = XLSX.utils.json_to_sheet(movimentosComSaldo);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Movimentos");
    XLSX.writeFile(wb, "movimentos.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Movimentos", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [["Data", "Descrição", "Tipo", "Valor", "Saldo"]],
      body: movimentosComSaldo.map((mov) => [
        dayjs(mov.data).format("DD/MM/YYYY"),
        mov.descricao,
        mov.tipo,
        formatCurrency(mov.valor),
        formatCurrency(mov.saldoAcumulado),
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
    await api.delete(`/movimentos/${id}`);
    fetchMovimentos();
  };

  if (erro) {
    return <div className="text-red-600 p-4">{erro}</div>;
  }

  return (
    <div className="space-y-8 w-full">

      {/* HEADER */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">

          <div>
            <h1 className="text-4xl font-black">
              Movimentos
            </h1>
            <p className="text-lg text-slate-600">
              {filtered.length} registos
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">

            {/* PESQUISA */}
            <div className="relative flex-1 lg:w-80">
              <Search className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Pesquisar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border rounded-xl"
              />
            </div>

            {/* BOTÕES */}
            {onBack && (
              <button onClick={onBack} className="px-4 py-3 bg-slate-200 rounded-xl flex items-center gap-2">
                <ArrowLeft size={16} /> Voltar
              </button>
            )}

            {onNew && (
              <button onClick={onNew} className="px-6 py-3 bg-blue-600 text-white rounded-xl flex items-center gap-2">
                <Plus size={16} /> Novo
              </button>
            )}

          </div>
        </div>
      </div>

      {/* TABELA */}
      <div id="printAreaMovimentos" className="bg-white rounded-3xl p-6 shadow-xl overflow-x-auto">

        <table className="w-full">
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Débito</th>
              <th>Crédito</th>
              <th>Saldo</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {movimentosComSaldo.map((mov) => (
              <tr key={mov.id}>
                <td>{dayjs(mov.data).format("DD/MM/YYYY")}</td>
                <td>{mov.descricao}</td>

                <td className="text-red-600">
                  {mov.tipo === "debito" && formatCurrency(mov.valor)}
                </td>

                <td className="text-green-600">
                  {mov.tipo === "credito" && formatCurrency(mov.valor)}
                </td>

                <td>{formatCurrency(mov.saldoAcumulado)}</td>

                <td className="flex gap-2">
                  <Eye size={16} />
                  {onEdit && <Pencil size={16} onClick={() => onEdit(mov)} />}
                  <Trash2 size={16} onClick={() => handleDelete(mov.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* TOTAIS */}
        <div className="mt-6 flex gap-4">
          <div>Débito: {formatCurrency(totalDebito)}</div>
          <div>Crédito: {formatCurrency(totalCredito)}</div>
          <div>Saldo: {formatCurrency(saldoAtual)}</div>
        </div>
      </div>

      {/* EXPORTS */}
      {filtered.length > 0 && (
        <div className="bg-white/60 p-6 rounded-3xl flex gap-3 justify-center">
          <button onClick={exportCSV}><FileText /> CSV</button>
          <button onClick={exportExcel}><FileSpreadsheet /> Excel</button>
          <button onClick={exportPDF}><FileDown /> PDF</button>
          <button onClick={handlePrint}><Printer /> Print</button>
        </div>
      )}

    </div>
  );
};

export default MovimentoList;
