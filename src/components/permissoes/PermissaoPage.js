// src/components/permissoes/PermissoesPage.js
import React, { useEffect, useState } from "react";
import api from "../../api";
import {
  Shield,
  Save,
  FileSpreadsheet,
  Download,
  Printer,
} from "lucide-react";
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

  // =========================
  // LOAD ROLES
  // =========================
  const fetchRoles = async () => {
    try {
      const res = await api.get("/roles");
      setRoles(res.data);
    } catch (error) {
      console.error("Erro ao carregar funções:", error);
    }
  };

  // =========================
  // LOAD PERMISSIONS BY ROLE
  // =========================
  const fetchPermissoesDaRole = async (id) => {
    try {
      const res = await api.get(`/roles/${id}`);
      const dados = {};

      res.data.permissoes.forEach((rp) => {
        const [acao, ...moduloParts] = rp.permissao.nome.split("_");
        const modulo = moduloParts
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");

        if (!dados[modulo]) dados[modulo] = {};
        dados[modulo][acao] = true;
      });

      setPermissoes((prev) => ({ ...prev, [id]: dados }));
    } catch (error) {
      console.error("Erro ao carregar permissões:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // =========================
  // TOGGLE CHECKBOX
  // =========================
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

  // =========================
  // SAVE PERMISSIONS
  // =========================
  const handleSalvar = async () => {
    if (!roleId) return alert("Selecione uma função primeiro!");

    const permissoesDaRole = permissoes[roleId] || {};
    const nomes = [];

    Object.entries(permissoesDaRole).forEach(([modulo, acoes]) => {
      Object.entries(acoes).forEach(([acao, ativo]) => {
        if (ativo) {
          nomes.push(
            `${acao}_${modulo.toLowerCase().replace(/\s/g, "_")}`
          );
        }
      });
    });

    try {
      const all = await api.get("/permissoes");

      const ids = all.data
        .filter((p) => nomes.includes(p.nome))
        .map((p) => p.id);

      await api.post(`/roles/${roleId}/permissoes`, {
        permissaoIds: ids,
      });

      alert("Permissões salvas com sucesso!");
      fetchPermissoesDaRole(roleId);
    } catch (error) {
      console.error("Erro ao salvar permissões:", error);
      alert("Erro ao salvar permissões.");
    }
  };

  // =========================
  // EXPORTS
  // =========================
  const exportExcel = () => {
    if (!roleId) return alert("Selecione uma função!");
    const data = Object.entries(permissoes[roleId] || {}).map(
      ([mod, acoes]) => ({
        Módulo: mod,
        Visualizar: acoes.visualizar ? "Sim" : "Não",
        Criar: acoes.criar ? "Sim" : "Não",
        Editar: acoes.editar ? "Sim" : "Não",
        Eliminar: acoes.eliminar ? "Sim" : "Não",
      })
    );

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Permissões");
    XLSX.writeFile(wb, "permissoes.xlsx");
  };

  const exportPDF = () => {
    if (!roleId) return alert("Selecione uma função!");

    const doc = new jsPDF();
    doc.text("Permissões da Função", 14, 10);

    doc.autoTable({
      head: [["Módulo", "Visualizar", "Criar", "Editar", "Eliminar"]],
      body: Object.entries(permissoes[roleId] || {}).map(
        ([mod, acoes]) => [
          mod,
          acoes.visualizar ? "Sim" : "Não",
          acoes.criar ? "Sim" : "Não",
          acoes.editar ? "Sim" : "Não",
          acoes.eliminar ? "Sim" : "Não",
        ]
      ),
    });

    doc.save("permissoes.pdf");
  };

  const printTable = () => {
    const content = document.getElementById("table-permissoes").outerHTML;
    const win = window.open("", "_blank");

    win.document.write(`
      <html>
        <head>
          <title>Impressão</title>
          <style>
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; }
            th { background: #f3f4f6; }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `);

    win.document.close();
    win.print();
  };

  // =========================
  // UI PREMIUM
  // =========================
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER PREMIUM */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <div className="flex items-center gap-3">
          <Shield className="text-blue-600" />
          <h2 className="text-xl font-bold">
            Gestão Premium de Permissões
          </h2>
        </div>

        <p className="text-gray-500 text-sm mt-1">
          Configure permissões por módulo de forma rápida e segura.
        </p>
      </div>

      {/* SELECT ROLE CARD */}
      <div className="bg-white p-5 rounded-xl shadow mb-6 w-full md:w-1/2">
        <label className="text-sm font-medium text-gray-600">
          Selecionar Função
        </label>

        <select
          value={roleId}
          onChange={(e) => {
            setRoleId(e.target.value);
            fetchPermissoesDaRole(e.target.value);
          }}
          className="w-full mt-2 border rounded-lg p-2 focus:ring"
        >
          <option value="">-- Escolha --</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nome}
            </option>
          ))}
        </select>
      </div>

      {/* TABLE CARD */}
      {roleId && (
        <div className="bg-white p-5 rounded-xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-700">
              Permissões do Sistema
            </h3>

            {/* ACTIONS */}
            <div className="flex gap-2 flex-wrap">
              <button onClick={handleSalvar} className="btn-blue">
                <Save size={16} /> Guardar
              </button>
              <button onClick={exportExcel} className="btn-green">
                <FileSpreadsheet size={16} /> Excel
              </button>
              <button onClick={exportPDF} className="btn-red">
                <Download size={16} /> PDF
              </button>
              <button onClick={printTable} className="btn-gray">
                <Printer size={16} /> Imprimir
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table
              id="table-permissoes"
              className="w-full text-sm border"
            >
              <thead className="bg-gray-100">
                <tr>
                  <th>Módulo</th>
                  <th>Ver</th>
                  <th>Criar</th>
                  <th>Editar</th>
                  <th>Eliminar</th>
                </tr>
              </thead>

              <tbody>
                {modulos.map((modulo) => {
                  const acoes =
                    permissoes[roleId]?.[modulo] || {};

                  return (
                    <tr key={modulo} className="border-t">
                      <td className="p-2">{modulo}</td>

                      {["visualizar", "criar", "editar", "eliminar"].map(
                        (acao) => (
                          <td key={acao} className="text-center">
                            <input
                              type="checkbox"
                              checked={acoes[acao] || false}
                              onChange={() =>
                                togglePermissao(modulo, acao)
                              }
                            />
                          </td>
                        )
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
