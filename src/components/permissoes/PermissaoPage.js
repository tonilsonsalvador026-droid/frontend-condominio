// src/components/permissoes/PermissoesPage.js
import React, { useEffect, useState } from "react";
import api from "../../api";
import {
  Shield,
  Save,
  FileSpreadsheet,
  Download,
  Printer,
  Search,
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function PermissoesPage() {
  const [roles, setRoles] = useState([]);
  const [roleId, setRoleId] = useState("");
  const [permissoes, setPermissoes] = useState({});
  const [search, setSearch] = useState("");

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
  // SAVE
  // =========================
  const handleSalvar = async () => {
    if (!roleId) return alert("Selecione uma função primeiro!");

    const permissoesDaRole = permissoes[roleId] || {};
    const nomes = [];

    Object.entries(permissoesDaRole).forEach(([modulo, acoes]) => {
      Object.entries(acoes).forEach(([acao, ativo]) => {
        if (ativo) {
          const moduloDB = modulo
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/\s/g, "_");

nomes.push(`${acao}_${moduloDB}`);
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
    const doc = new jsPDF();
    doc.text("Permissões da Função", 14, 10);

    autoTable(doc, {
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
    const win = window.open("", "", "width=1000,height=700");

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
        <body>${content}</body>
      </html>
    `);

    win.document.close();
    win.print();
  };

  // =========================
  // FILTER
  // =========================
  const filteredRoles = roles.filter((r) =>
    r.nome?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">

      {/* HEADER PREMIUM (igual RolesPage) */}
      <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/40 shadow-2xl">

        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
              Permissões do Sistema
            </h1>

            <p className="text-slate-600 mt-2">
              Gestão avançada de permissões por função.
            </p>

            {roleId && (
              <p className="text-sm text-slate-500 mt-3 font-medium">
                Função selecionada:{" "}
                <span className="text-blue-600 font-semibold">
                  {roles.find(r => r.id == roleId)?.nome}
                </span>
              </p>
            )}
          </div>

          {/* SEARCH */}
          <div className="relative w-full xl:w-80">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Pesquisar função..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/70 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 shadow-lg"
            />
          </div>

        </div>
      </div>

      {/* SELECT ROLE CARD */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/40 shadow-2xl">

        <label className="block text-sm font-semibold text-slate-700 mb-3">
          Selecionar Função
        </label>

        <select
          value={roleId}
          onChange={(e) => {
            setRoleId(e.target.value);
            fetchPermissoesDaRole(e.target.value);
          }}
          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-lg focus:ring-4 focus:ring-blue-200"
        >
          <option value="">-- Escolha --</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nome}
            </option>
          ))}
        </select>
      </div>

      {/* TABLE CARD PREMIUM */}
      {roleId && (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/40 shadow-2xl">

          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">
              Permissões por Módulo
            </h3>

            <div className="flex flex-wrap justify-center gap-4">
      <button
         onClick={handleSalvar}
      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300 text-white font-bold rounded-2xl shadow-xl flex items-center gap-2"
>
                <Save size={16} /> Guardar
              </button>

              <button
  onClick={exportExcel}
  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 hover:-translate-y-1 transition-all duration-300 text-white font-bold rounded-2xl shadow-xl flex items-center gap-2"
>
                <FileSpreadsheet size={16} /> Excel
              </button>

              <button
  onClick={exportPDF}
  className="px-6 py-3 bg-red-600 hover:bg-red-700 hover:-translate-y-1 transition-all duration-300 text-white font-bold rounded-2xl shadow-xl flex items-center gap-2"
>
                <Download size={16} /> PDF
              </button>

<button
  onClick={printTable}
  className="px-6 py-3 bg-slate-700 hover:bg-slate-800 hover:-translate-y-1 transition-all duration-300 text-white font-bold rounded-2xl shadow-xl flex items-center gap-2"
>
                <Printer size={16} /> Imprimir
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
           <table
  id="table-permissoes"
  className="w-full text-sm md:text-base"
>
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                 <th className="p-4 text-left">Módulo</th>
<th className="p-4 text-center">Ver</th>
<th className="p-4 text-center">Criar</th>
<th className="p-4 text-center">Editar</th>
<th className="p-4 text-center">Eliminar</th>
                </tr>
              </thead>

              <tbody>
                {modulos.map((modulo) => {
                  const acoes = permissoes[roleId]?.[modulo] || {};

                  return (
<tr
  key={modulo}
  className="border-t hover:bg-slate-50 transition-all duration-300"
>
                      <td className="p-2 font-semibold text-slate-800">
                        {modulo}
                      </td>

                      {["visualizar", "criar", "editar", "eliminar"].map((acao) => (
                        <td key={acao} className="text-center">
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

        </div>
      )}
    </div>
  );
}
