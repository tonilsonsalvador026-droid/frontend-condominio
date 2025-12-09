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
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency } from "../../utils/formatCurrency"; // ✅ Import adicionado

const MovimentoList = ({ conta, onBack }) => {
  const [movimentos, setMovimentos] = useState([]);
  const [erro, setErro] = useState(null);

  // buscar movimentos
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

  // calcular saldo acumulado
  const calcularSaldo = () => {
    let saldo = conta?.saldoInicial || 0;
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

  // calcular totais
  const calcularTotais = () => {
    let totalDebito = 0;
    let totalCredito = 0;

    movimentos.forEach((mov) => {
      if (mov.tipo.toLowerCase() === "debito") {
        totalDebito += mov.valor || 0;
      } else if (mov.tipo.toLowerCase() === "credito") {
        totalCredito += mov.valor || 0;
      }
    });

    const saldoAtual = (conta?.saldoInicial || 0) + totalCredito - totalDebito;
    return { totalDebito, totalCredito, saldoAtual };
  };
  const { totalDebito, totalCredito, saldoAtual } = calcularTotais();

  // ==== EXPORTAÇÕES ====
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
    doc.text("Relatório de Movimentos", 14, 10);
    autoTable(doc, {
      head: [["Data", "Proprietário", "Descrição", "Tipo", "Valor", "Saldo"]],
      body: movimentosComSaldo.map((mov) => [
        mov.data ? dayjs(mov.data).format("DD/MM/YYYY") : "-",
        mov.contaCorrente?.proprietario?.nome || "-",
        mov.descricao || "-",
        mov.tipo,
        formatCurrency(mov.valor || 0), // ✅ aplicado aqui
        formatCurrency(mov.saldoAcumulado || 0), // ✅ aplicado aqui
      ]),
    });
    doc.save("movimentos.pdf");
  };

  const handlePrint = () => {
    const printContent = document.getElementById("printAreaMovimentos").innerHTML;
    const w = window.open("", "", "width=900,height=650");
    w.document.write(printContent);
    w.document.close();
    w.print();
  };

  // ==== AÇÕES ====
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este movimento?")) return;
    try {
      await api.delete(`/movimentos/${id}`);
      fetchMovimentos();
    } catch (error) {
      console.error("Erro ao excluir movimento:", error);
      alert("Erro ao excluir movimento.");
    }
  };

  if (erro) {
    return (
      <div className="bg-red-50 border border-red-300 text-red-600 rounded-xl p-4 mt-6">
        {erro}
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 mt-6 flex flex-col h-full">
      {/* Título e botões */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <h2 className="text-lg font-semibold text-gray-700">
          {conta
            ? `Extrato da Conta Corrente – ${conta?.proprietario?.nome || "Desconhecido"}`
            : "Lista de Todos os Movimentos"}
        </h2>
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
          {onBack && (
            <button
              onClick={onBack}
              className="bg-gray-200 px-3 py-2 text-sm rounded hover:bg-gray-300"
            >
              Voltar
            </button>
          )}
        </div>
      </div>

      {/* Área de impressão */}
      <div id="printAreaMovimentos" className="overflow-x-auto flex-grow">
        <table className="w-full border-collapse text-sm md:text-base">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-700">
              <th className="px-4 py-2 border">Data</th>
              {!conta && <th className="px-4 py-2 border">Proprietário</th>}
              <th className="px-4 py-2 border">Descrição</th>
              <th className="px-4 py-2 border">Débito</th>
              <th className="px-4 py-2 border">Crédito</th>
              <th className="px-4 py-2 border">Saldo</th>
              <th className="px-4 py-2 border text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {movimentosComSaldo.length > 0 ? (
              movimentosComSaldo.map((mov) => (
                <tr key={mov.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">
                    {mov.data ? dayjs(mov.data).format("DD/MM/YYYY") : "-"}
                  </td>
                  {!conta && (
                    <td className="px-4 py-2 border">
                      {mov.contaCorrente?.proprietario?.nome || "-"}
                    </td>
                  )}
                  <td className="px-4 py-2 border">{mov.descricao || "-"}</td>
                  <td className="px-4 py-2 border text-red-600">
                    {mov.tipo.toLowerCase() === "debito"
                      ? formatCurrency(mov.valor)
                      : ""}
                  </td>
                  <td className="px-4 py-2 border text-green-600">
                    {mov.tipo.toLowerCase() === "credito"
                      ? formatCurrency(mov.valor)
                      : ""}
                  </td>
                  <td
                    className={`px-4 py-2 border font-semibold ${
                      mov.saldoAcumulado < 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {formatCurrency(mov.saldoAcumulado)}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <div className="flex gap-3 justify-center">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye size={18} />
                      </button>
                      <button className="text-yellow-600 hover:text-yellow-800">
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(mov.id)}
                        className="text-red-600 hover:text-red-800"
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
                  colSpan={conta ? 6 : 7}
                >
                  Nenhum movimento encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Totais dentro da área de impressão */}
        <div className="mt-6">
          <table className="w-full border-collapse text-sm md:text-base">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="px-4 py-2 border">Total Débito</th>
                <th className="px-4 py-2 border">Total Crédito</th>
                <th className="px-4 py-2 border">Saldo Atual</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border text-red-600 font-semibold">
                  {formatCurrency(totalDebito)}
                </td>
                <td className="px-4 py-2 border text-green-600 font-semibold">
                  {formatCurrency(totalCredito)}
                </td>
                <td
                  className={`px-4 py-2 border font-bold ${
                    saldoAtual < 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {formatCurrency(saldoAtual)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MovimentoList;