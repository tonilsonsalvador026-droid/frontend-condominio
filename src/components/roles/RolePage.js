import React, { useEffect, useState } from "react";
import api from "../../api";
import {
  Plus,
  Edit3,
  Trash2,
  FileSpreadsheet,
  FileText,
  Printer,
  Download,
} from "lucide-react";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  // Buscar funções
  const fetchRoles = async () => {
    try {
      const res = await api.get("/roles");
      setRoles(res.data);
    } catch (error) {
      console.error("Erro ao carregar funções:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Criar ou editar função
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingRole) {
        await api.put(`/roles/${editingRole.id}`, { nome, descricao });
      } else {
        await api.post("/roles", { nome, descricao });
      }
      setNome("");
      setDescricao("");
      setEditingRole(null);
      fetchRoles();
    } catch (error) {
      console.error("Erro ao salvar função:", error);
    } finally {
      setLoading(false);
    }
  };

  // Editar função
  const handleEdit = (role) => {
    setEditingRole(role);
    setNome(role.nome);
    setDescricao(role.descricao);
  };

  // Eliminar função
  const handleDelete = async (id) => {
    if (!window.confirm("Tens certeza que queres eliminar esta função?")) return;
    try {
      await api.delete(`/roles/${id}`);
      fetchRoles();
    } catch (error) {
      console.error("Erro ao eliminar função:", error);
    }
  };

  // Função auxiliar para formatação segura da data
  const formatDate = (date) => {
    if (!date) return "—";
    try {
      return format(new Date(date), "dd/MM/yyyy HH:mm");
    } catch {
      return "—";
    }
  };

  // Exportar CSV
  const exportToCSV = () => {
    const csvData = roles.map((r) => ({
      Nome: r.nome,
      Descrição: r.descricao,
      Criado: formatDate(r.createdAt),
    }));

    const worksheet = XLSX.utils.json_to_sheet(csvData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Funções");
    XLSX.writeFile(workbook, "funcoes.csv");
  };

  // Exportar Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      roles.map((r) => ({
        Nome: r.nome,
        Descrição: r.descricao,
        Criado: formatDate(r.createdAt),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Funções");
    XLSX.writeFile(workbook, "funcoes.xlsx");
  };

  // Exportar PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Lista de Funções (Roles)", 14, 10);
    doc.autoTable({
      head: [["Nome", "Descrição", "Criado"]],
      body: roles.map((r) => [r.nome, r.descricao, formatDate(r.createdAt)]),
    });
    doc.save("funcoes.pdf");
  };

  // Imprimir
  const printTable = () => {
    const content = document.getElementById("roles-table").outerHTML;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head><title>Impressão - Funções</title></head>
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
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Gestão de Funções (Roles)</h2>

      {/* Formulário */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-4 mb-6 w-full md:w-1/2"
      >
        <h3 className="text-lg font-semibold mb-3">
          {editingRole ? "Editar Função" : "Nova Função"}
        </h3>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Descrição</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            rows="3"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={18} />
          {editingRole ? "Atualizar" : "Salvar"}
        </button>
      </form>

      {/* Botões de exportação */}
      <div className="flex flex-wrap gap-3 mb-4">
        <button
          onClick={exportToCSV}
          className="flex items-center bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 text-sm"
        >
          <FileText size={16} className="mr-2" /> CSV
        </button>
        <button
          onClick={exportToExcel}
          className="flex items-center bg-emerald-600 text-white px-3 py-2 rounded hover:bg-emerald-700 text-sm"
        >
          <FileSpreadsheet size={16} className="mr-2" /> Excel
        </button>
        <button
          onClick={exportToPDF}
          className="flex items-center bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 text-sm"
        >
          <Download size={16} className="mr-2" /> PDF
        </button>
        <button
          onClick={printTable}
          className="flex items-center bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700 text-sm"
        >
          <Printer size={16} className="mr-2" /> Imprimir
        </button>
      </div>

      {/* Tabela */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table
          id="roles-table"
          className="min-w-full border border-gray-200 text-sm"
        >
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Nome</th>
              <th className="px-4 py-2 border">Descrição</th>
              <th className="px-4 py-2 border">Criado em</th>
              <th className="px-4 py-2 border text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {roles.length > 0 ? (
              roles.map((role, index) => (
                <tr key={role.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{role.nome}</td>
                  <td className="px-4 py-2 border">{role.descricao}</td>
                  <td className="px-4 py-2 border">{formatDate(role.createdAt)}</td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => handleEdit(role)}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(role.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-4 text-gray-500 border"
                >
                  Nenhuma função encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}