// src/components/permissoes/PermissoesPage.js
import React, { useEffect, useState } from "react";
import api from "../../api";
import {
  Shield,
  FileSpreadsheet,
  Download,
  Printer,
  Save,
  Loader2,
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function PermissoesPage() {
  const [roles, setRoles] = useState([]);
  const [roleId, setRoleId] = useState("");
  const [permissoes, setPermissoes] = useState({});
  const [loading, setLoading] = useState(false);

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

  // 🔹 Roles
  const fetchRoles = async () => {
    try {
      const res = await api.get("/roles");
      setRoles(res.data);
    } catch (error) {
      console.error("Erro ao carregar funções:", error);
    }
  };

  // 🔹 Permissões da role
  const fetchPermissoesDaRole = async (roleId) => {
    try {
      setLoading(true);
      const res = await api.get(`/roles/${roleId}`);
      const dados = {};

      res.data.permissoes.forEach((rp) => {
        const [acao, ...moduloParts] = rp.permissao.nome.split("_");
        const modulo = moduloParts
          .map((w) => w[0].toUpperCase() + w.slice(1))
          .join(" ");

        if (!dados[modulo]) dados[modulo] = {};
        dados[modulo][acao] = true;
      });

      setPermissoes((prev) => ({ ...prev, [roleId]: dados }));
    } catch (err) {
      console.error("Erro ao buscar permissões da role:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // 🔹 Toggle checkbox
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

  // 🔹 Guardar
  const handleSalvarPermissoes = async () => {
    if (!roleId) return alert("Selecione uma função primeiro!");

    const permissoesDaRole = permissoes[roleId] || {};

    const permissoesNomes = [];
    Object.entries(permissoesDaRole).forEach(([modulo, acoes]) => {
      Object.entries(acoes).forEach(([acao, ativo]) => {
        if (ativo) {
          permissoesNomes.push(
            `${acao}_${modulo.toLowerCase().replace(/\s/g, "_")}`
          );
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
      alert("Erro ao salvar permissões.");
    }
  };

  // 🔹 Export Excel
  const exportToExcel = () => {
    if (!roleId) return alert("Selecione uma função!");
    const data = Object.entries(permissoes[roleId] || {}).map(
      ([mod, acoes]) => ({
        Módulo: mod,
        Visualizar: acoes.visualizar ? "Sim" : "Não",
        Criar: acoes.criar ? "Sim" : "Não",
        Editar: acoes.editar ? "Sim" : "Não",
        Eliminar: acoes.eliminar ? "Não",
      })
    );

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Permissões");
    XLSX.writeFile(wb, "permissoes.xlsx");
  };

  // 🔹 Export PDF
  const exportToPDF = () => {
    if (!roleId) return alert("Selecione uma função!");
    const doc = new jsPDF();

    doc.text("Permissões da Função", 14, 10);

    doc.autoTable({
      head: [["Módulo", "Visualizar", "Criar", "Editar", "Eliminar"]],
      body: Object.entries(permissoes[roleId] || {}).map(([mod, acoes]) => [
        mod,
        acoes.visualizar ? "Sim" : "Não",
        acoes.criar ? "Sim" : "Não",
        acoes.editar ? "Sim" : "Não",
        acoes.eliminar ? "Sim" : "Não",
      ]),
    });

    doc.save("permissoes.pdf");
  };

  // 🔹 Print
  const printTable = () => {
    const content = document.getElementById("permissoes-table").outerHTML;
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head><title>Permissões</title></head>
        <body>
          <h2>Permissões</h2>
          ${content}
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div className="space-y-8">

      {/* HEADER PREMIUM */}
      <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/40 shadow-2xl">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
            Gestão de Permissões
          </h1>

          <p className="text-slate-600 mt-2">
            Configure permissões por função do sistema.
          </p>
        </div>
      </div>

      {/* SELECT ROLE */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/40 shadow-2xl w-full md:w-2/3">
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          Função
        </label>

        <select
          value={roleId}
          onChange={async (e) => {
            const id = e.target.value;
            setRoleId(id);
            await fetchPermissoesDaRole(id);
          }}
          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-lg focus:ring-4 focus:ring-blue-200"
        >
          <option value="">Selecione uma função</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nome}
            </option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      {roleId && (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/40 shadow-2xl overflow-x-auto">

          {loading ? (
            <div className="flex items-center gap-3 text-slate-500 py-10">
              <Loader2 className="animate-spin" />
              <span>Carregando permissões...</span>
            </div>
          ) : (
            <table
              id="permissoes-table"
              className="min-w-full text-sm"
            >
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="p-4 text-left">Módulo</th>
                  <th className="p-4 text-center">Visualizar</th>
                  <th className="p-4 text-center">Criar</th>
                  <th className="p-4 text-center">Editar</th>
                  <th className="p-4 text-center">Eliminar</th>
                </tr>
              </thead>

              <tbody>
                {modulos.map((modulo) => {
                  const acoes =
                    permissoes[roleId]?.[modulo] || {};

                  return (
                    <tr
                      key={modulo}
                      className="border-t hover:bg-slate-50 transition"
                    >
                      <td className="p-4 font-medium">
                        {modulo}
                      </td>

                      {["visualizar", "criar", "editar", "eliminar"].map(
                        (acao) => (
                          <td
                            key={acao}
                            className="p-4 text-center"
                          >
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
          )}

          {/* BOTÕES */}
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={handleSalvarPermissoes}
              className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-2xl shadow-lg"
            >
              <Save size={16} />
              Salvar
            </button>

            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 px-5 py-3 bg-green-600 text-white rounded-2xl shadow-lg"
            >
              <FileSpreadsheet size={16} />
              Excel
            </button>

            <button
              onClick={exportToPDF}
              className="flex items-center gap-2 px-5 py-3 bg-red-600 text-white rounded-2xl shadow-lg"
            >
              <Download size={16} />
              PDF
            </button>

            <button
              onClick={printTable}
              className="flex items-center gap-2 px-5 py-3 bg-gray-600 text-white rounded-2xl shadow-lg"
            >
              <Printer size={16} />
              Imprimir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
