// src/components/permissoes/PermissoesPage.js
import React, { useEffect, useState } from "react";
import api from "../../api";
import { Shield, FileSpreadsheet, Download, Printer, Save } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function PermissoesPage() {
  const [roles, setRoles] = useState([]);
  const [roleId, setRoleId] = useState("");
  const [permissoes, setPermissoes] = useState({});

  const modulos = [
    "Utilizadores",
    "Condomínios",
    "Edifícios",
    "Frações",
    "Proprietários",
    "Inquilinos",
    "Pagamentos",
    "Recibos",
    "Conta Corrente",
    "Serviços Extras",
    "Serviços Agendados",
    "Eventos",
    "Funções",
    "Permissões",
    "Atribuir Papéis",
  ];

  // 🔹 Buscar papéis
  const fetchRoles = async () => {
    try {
      const res = await api.get("/roles");
      setRoles(res.data);
    } catch (error) {
      console.error("Erro ao carregar funções:", error);
    }
  };

  // 🔹 Buscar permissões da role selecionada
  const fetchPermissoesDaRole = async (roleId) => {
    try {
      const res = await api.get(`/roles/${roleId}`);
      const dados = {};

      res.data.permissoes.forEach((rp) => {
        const [acao, ...moduloParts] = rp.permissao.nome.split("_");
        const modulo = moduloParts
          .map((w) => w[0].toUpperCase() + w.slice(1))
          .join(" "); // transforma "pagamentos" -> "Pagamentos"

        if (!dados[modulo]) dados[modulo] = {};
        dados[modulo][acao] = true;
      });

      setPermissoes((prev) => ({ ...prev, [roleId]: dados }));
    } catch (err) {
      console.error("Erro ao buscar permissões da role:", err);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // 🔹 Alternar checkbox
  const togglePermissao = (modulo, acao) => {
    setPermissoes((prev) => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [modulo]: {
          ...prev[roleId]?.[modulo],
          [acao]: !prev[roleId]?.[modulo]?.[acao],
        },
      },
    }));
  };

  // 🔹 Salvar permissões
  const handleSalvarPermissoes = async () => {
    if (!roleId) return alert("Selecione uma função primeiro!");
    const permissoesDaRole = permissoes[roleId] || {};

    const permissoesNomes = [];
    Object.entries(permissoesDaRole).forEach(([modulo, acoes]) => {
      Object.entries(acoes).forEach(([acao, ativo]) => {
        if (ativo) {
          permissoesNomes.push(`${acao}_${modulo.toLowerCase().replace(/\s/g, "_")}`);
        }
      });
    });

    try {
      const todas = await api.get("/permissoes");
      const idsSelecionados = todas.data
        .filter((p) => permissoesNomes.includes(p.nome))
        .map((p) => p.id);

      await api.post(`/roles/${roleId}/permissoes`, {
        permissaoIds: idsSelecionados,
      });

      alert("Permissões salvas com sucesso!");
      fetchPermissoesDaRole(roleId);
    } catch (error) {
      console.error("Erro ao salvar permissões:", error);
      alert("Erro ao salvar permissões. Verifique o backend.");
    }
  };

  // 🔹 Exportar Excel
  const exportToExcel = () => {
    if (!roleId) return alert("Selecione uma função!");
    const permissoesDaRole = permissoes[roleId] || {};
    const data = Object.entries(permissoesDaRole).map(([mod, acoes]) => ({
      Módulo: mod,
      Visualizar: acoes.visualizar ? "Sim" : "Não",
      Criar: acoes.criar ? "Sim" : "Não",
      Editar: acoes.editar ? "Sim" : "Não",
      Eliminar: acoes.eliminar ? "Sim" : "Não",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Permissões");
    XLSX.writeFile(wb, "permissoes.xlsx");
  };

  // 🔹 Exportar PDF
  const exportToPDF = () => {
    if (!roleId) return alert("Selecione uma função!");
    const permissoesDaRole = permissoes[roleId] || {};
    const doc = new jsPDF();
    doc.text("Permissões da Função", 14, 10);
    doc.autoTable({
      head: [["Módulo", "Visualizar", "Criar", "Editar", "Eliminar"]],
      body: Object.entries(permissoesDaRole).map(([mod, acoes]) => [
        mod,
        acoes.visualizar ? "Sim" : "Não",
        acoes.criar ? "Sim" : "Não",
        acoes.editar ? "Sim" : "Não",
        acoes.eliminar ? "Sim" : "Não",
      ]),
    });
    doc.save("permissoes.pdf");
  };

  // 🔹 Imprimir tabela
  const printTable = () => {
    const content = document.getElementById("permissoes-table").outerHTML;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head><title>Impressão - Permissões</title></head>
        <body>
          <h2>Permissões</h2>
          ${content}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <Shield size={24} /> Gestão de Permissões
      </h2>

      {/* Seleção de Função */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6 w-full md:w-2/3">
        <label className="block text-sm font-medium mb-1">Função</label>
        <select
          value={roleId}
          onChange={async (e) => {
            const id = e.target.value;
            setRoleId(id);
            await fetchPermissoesDaRole(id);
          }}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
        >
          <option value="">Selecione uma função</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nome}
            </option>
          ))}
        </select>
      </div>

      {roleId && (
        <>
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-4">
            <table id="permissoes-table" className="min-w-full border border-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border text-left">Módulo</th>
                  <th className="px-4 py-2 border text-center">Visualizar</th>
                  <th className="px-4 py-2 border text-center">Criar</th>
                  <th className="px-4 py-2 border text-center">Editar</th>
                  <th className="px-4 py-2 border text-center">Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {modulos.map((modulo) => {
                  const acoes = permissoes[roleId]?.[modulo] || {};
                  return (
                    <tr key={modulo} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">{modulo}</td>
                      {["visualizar", "criar", "editar", "eliminar"].map((acao) => (
                        <td key={acao} className="px-4 py-2 border text-center">
                          <input
                            type="checkbox"
                            checked={acoes[acao] || false}
                            onChange={() => togglePermissao(modulo, acao)}
                          />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Botões */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSalvarPermissoes}
              className="flex items-center bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm"
            >
              <Save size={16} className="mr-2" /> Salvar Permissões
            </button>
            <button
              onClick={exportToExcel}
              className="flex items-center bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 text-sm"
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
        </>
      )}
    </div>
  );
}