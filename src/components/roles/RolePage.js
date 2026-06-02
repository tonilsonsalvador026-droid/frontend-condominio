import React, { useEffect, useState } from "react";
import api from "../../api";

import {
  ShieldCheck,
  Plus,
  Pencil,
  Trash2,
  FileSpreadsheet,
  FileText,
  Printer,
  Download,
  Search,
  Save,
  X,
} from "lucide-react";

import { format } from "date-fns";

import * as XLSX from "xlsx";

import jsPDF from "jspdf";

import autoTable from "jspdf-autotable";

export default function RolesPage() {

  const [roles, setRoles] = useState([]);

  const [nome, setNome] = useState("");

  const [descricao, setDescricao] = useState("");

  const [pesquisa, setPesquisa] = useState("");

  const [loading, setLoading] = useState(false);

  const [editingRole, setEditingRole] = useState(null);

  // -----------------------------------
  // BUSCAR ROLES
  // -----------------------------------
  const fetchRoles = async () => {

    try {

      const res = await api.get("/roles");

      setRoles(res.data);

    } catch (error) {

      console.error(
        "Erro ao carregar funções:",
        error
      );
    }
  };

  useEffect(() => {

    fetchRoles();

  }, []);

  // -----------------------------------
  // FORMATAR DATA
  // -----------------------------------
  const formatDate = (date) => {

    if (!date) return "—";

    try {

      return format(
        new Date(date),
        "dd/MM/yyyy HH:mm"
      );

    } catch {

      return "—";
    }
  };

  // -----------------------------------
  // SUBMIT
  // -----------------------------------
  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      if (editingRole) {

        await api.put(
          `/roles/${editingRole.id}`,
          {
            nome,
            descricao,
          }
        );

      } else {

        await api.post("/roles", {
          nome,
          descricao,
        });
      }

      setNome("");

      setDescricao("");

      setEditingRole(null);

      fetchRoles();

    } catch (error) {

      console.error(
        "Erro ao salvar função:",
        error
      );

    } finally {

      setLoading(false);
    }
  };

  // -----------------------------------
  // EDITAR
  // -----------------------------------
  const handleEdit = (role) => {

    setEditingRole(role);

    setNome(role.nome);

    setDescricao(role.descricao || "");
  };

  // -----------------------------------
  // CANCELAR EDIÇÃO
  // -----------------------------------
  const cancelarEdicao = () => {

    setEditingRole(null);

    setNome("");

    setDescricao("");
  };

  // -----------------------------------
  // ELIMINAR
  // -----------------------------------
  const handleDelete = async (id) => {

    const confirmar = window.confirm(
      "Tens certeza que queres eliminar esta função?"
    );

    if (!confirmar) return;

    try {

      await api.delete(`/roles/${id}`);

      fetchRoles();

    } catch (error) {

      console.error(
        "Erro ao eliminar função:",
        error
      );
    }
  };

  // -----------------------------------
  // PESQUISA
  // -----------------------------------
  const filteredRoles = roles.filter((role) =>
    role.nome
      ?.toLowerCase()
      .includes(
        pesquisa.toLowerCase()
      )
  );

  // -----------------------------------
  // EXPORTAR CSV
  // -----------------------------------
  const exportToCSV = () => {

    const csvData = filteredRoles.map((r) => ({
      Nome: r.nome,
      Descrição: r.descricao,
      Criado: formatDate(r.createdAt),
    }));

    const worksheet =
      XLSX.utils.json_to_sheet(csvData);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Funções"
    );

    XLSX.writeFile(
      workbook,
      "funcoes.csv"
    );
  };

  // -----------------------------------
  // EXPORTAR EXCEL
  // -----------------------------------
  const exportToExcel = () => {

    const worksheet =
      XLSX.utils.json_to_sheet(

        filteredRoles.map((r) => ({
          Nome: r.nome,
          Descrição: r.descricao,
          Criado: formatDate(r.createdAt),
        }))
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Funções"
    );

    XLSX.writeFile(
      workbook,
      "funcoes.xlsx"
    );
  };

  // -----------------------------------
  // EXPORTAR PDF
  // -----------------------------------
  const exportToPDF = () => {

    const doc = new jsPDF();

    doc.text(
      "Lista de Funções",
      14,
      15
    );

    autoTable(doc, {

      startY: 25,

      head: [[
        "Nome",
        "Descrição",
        "Criado em",
      ]],

      body: filteredRoles.map((r) => [

        r.nome,

        r.descricao || "-",

        formatDate(r.createdAt),
      ]),
    });

    doc.save("funcoes.pdf");
  };

  // -----------------------------------
  // IMPRIMIR
  // -----------------------------------
  const printTable = () => {

    const content =
      document.getElementById(
        "roles-table"
      ).outerHTML;

    const printWindow =
      window.open(
        "",
        "_blank"
      );

    printWindow.document.write(`
      <html>
        <head>
          <title>Lista de Funções</title>
        </head>

        <body>
          <h2>Lista de Funções</h2>
          ${content}
        </body>
      </html>
    `);

    printWindow.document.close();

    printWindow.print();
  };

  return (

    <div className="space-y-8 p-6">

      {/* HEADER */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-slate-200 shadow-xl p-8">

        <div className="flex items-center gap-4">

          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg">

            <ShieldCheck className="text-white" size={30} />

          </div>

          <div>

            <h1 className="text-3xl font-black text-slate-800">
              Gestão de Funções
            </h1>

            <p className="text-slate-500 font-medium mt-1">
              Gerencie papéis e permissões do sistema.
            </p>

          </div>

        </div>

      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200 shadow-xl p-8"
      >

        <div className="flex items-center justify-between mb-8">

          <h2 className="text-2xl font-bold text-slate-800">

            {editingRole
              ? "Editar Função"
              : "Nova Função"}

          </h2>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* NOME */}
          <div>

            <label className="block text-sm font-bold text-slate-700 mb-2">

              Nome da Função

            </label>

            <input
              type="text"
              value={nome}
              onChange={(e) =>
                setNome(e.target.value)
              }
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-200"
              placeholder="Ex: Administrador"
              required
            />

          </div>

          {/* DESCRIÇÃO */}
          <div>

            <label className="block text-sm font-bold text-slate-700 mb-2">

              Descrição

            </label>

            <textarea
              value={descricao}
              onChange={(e) =>
                setDescricao(e.target.value)
              }
              rows="4"
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-200 resize-none"
              placeholder="Descrição da função..."
            />

          </div>

        </div>

        {/* BOTÕES */}
        <div className="flex flex-wrap gap-4 mt-8">

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold flex items-center gap-2 hover:scale-105 transition-all"
          >

            <Save size={18} />

            {loading
              ? "Salvando..."
              : editingRole
              ? "Atualizar Função"
              : "Salvar Função"}

          </button>

          {editingRole && (

            <button
              type="button"
              onClick={cancelarEdicao}
              className="px-6 py-4 rounded-2xl bg-slate-200 text-slate-700 font-bold flex items-center gap-2 hover:bg-slate-300 transition-all"
            >

              <X size={18} />

              Cancelar

            </button>
          )}

        </div>

      </form>

      {/* PESQUISA */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200 shadow-xl p-6">

        <div className="relative">

          <Search
            className="absolute left-4 top-4 text-slate-400"
            size={20}
          />

          <input
            type="text"
            placeholder="Pesquisar função..."
            value={pesquisa}
            onChange={(e) =>
              setPesquisa(e.target.value)
            }
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-200"
          />

        </div>

      </div>

      {/* TABELA */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200 shadow-xl overflow-hidden">

        <div className="overflow-x-auto">

          <table
            id="roles-table"
            className="w-full"
          >

            <thead className="bg-slate-100">

              <tr>

                <th className="p-4 text-left">
                  #
                </th>

                <th className="p-4 text-left">
                  Nome
                </th>

                <th className="p-4 text-left">
                  Descrição
                </th>

                <th className="p-4 text-left">
                  Criado em
                </th>

                <th className="p-4 text-center">
                  Ações
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredRoles.length > 0 ? (

                filteredRoles.map((role, index) => (

                  <tr
                    key={role.id}
                    className="border-t hover:bg-slate-50 transition-all"
                  >

                    <td className="p-4">
                      {index + 1}
                    </td>

                    <td className="p-4 font-semibold text-slate-800">
                      {role.nome}
                    </td>

                    <td className="p-4 text-slate-600">
                      {role.descricao || "—"}
                    </td>

                    <td className="p-4 text-slate-600">
                      {formatDate(role.createdAt)}
                    </td>

                    <td className="p-4">

                      <div className="flex items-center justify-center gap-3">

                        <button
                          onClick={() =>
                            handleEdit(role)
                          }
                          className="text-blue-600 hover:scale-110 transition"
                        >

                          <Pencil size={18} />

                        </button>

                        <button
                          onClick={() =>
                            handleDelete(role.id)
                          }
                          className="text-red-600 hover:scale-110 transition"
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
                    colSpan="5"
                    className="p-10 text-center text-slate-400"
                  >

                    Nenhuma função encontrada.

                  </td>

                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* EXPORTAÇÕES */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200 shadow-xl p-6">

        <div className="flex flex-wrap gap-4 justify-center">

          <button
            onClick={exportToCSV}
            className="px-5 py-3 rounded-2xl bg-blue-600 text-white font-bold flex items-center gap-2 hover:scale-105 transition-all"
          >

            <FileText size={18} />

            CSV

          </button>

          <button
            onClick={exportToExcel}
            className="px-5 py-3 rounded-2xl bg-emerald-600 text-white font-bold flex items-center gap-2 hover:scale-105 transition-all"
          >

            <FileSpreadsheet size={18} />

            Excel

          </button>

          <button
            onClick={exportToPDF}
            className="px-5 py-3 rounded-2xl bg-red-600 text-white font-bold flex items-center gap-2 hover:scale-105 transition-all"
          >

            <Download size={18} />

            PDF

          </button>

          <button
            onClick={printTable}
            className="px-5 py-3 rounded-2xl bg-slate-700 text-white font-bold flex items-center gap-2 hover:scale-105 transition-all"
          >

            <Printer size={18} />

            Imprimir

          </button>

        </div>

      </div>

    </div>
  );
}
