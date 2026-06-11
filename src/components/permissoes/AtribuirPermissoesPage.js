import React, { useEffect, useState } from "react";
import api from "../../api";
import { CheckCircle2, Save, Loader2 } from "lucide-react";
import PermissaoList from "../../components/permissoes/PermissaoList";

export default function AtribuirPermissoesPage() {
  const [roles, setRoles] = useState([]);
  const [permissoes, setPermissoes] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedPermissoes, setSelectedPermissoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Buscar roles e permissões
  const fetchData = async () => {
    try {
      setLoading(true);
      const [rolesRes, permsRes] = await Promise.all([
        api.get("/roles"),
        api.get("/permissoes"),
      ]);
      setRoles(rolesRes.data);
      setPermissoes(permsRes.data);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Quando seleciona um papel
  const handleSelectRole = async (roleId) => {
    setSelectedRole(roleId);
    setSelectedPermissoes([]);

    try {
      const res = await api.get(`/roles/${roleId}`);
      const permissoesAtuais = res.data.permissoes.map(
        (rp) => rp.permissaoId
      );
      setSelectedPermissoes(permissoesAtuais);
    } catch (error) {
      console.error("Erro ao carregar permissões do papel:", error);
    }
  };

  // Alternar checkbox
  const togglePermissao = (id) => {
    setSelectedPermissoes((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // Guardar permissões
  const handleSave = async () => {
    if (!selectedRole) {
      alert("Por favor, selecione um papel.");
      return;
    }

    setSaving(true);
    try {
      await api.post(`/roles/${selectedRole}/permissoes`, {
        permissaoIds: selectedPermissoes,
      });

      alert("Permissões atualizadas com sucesso!");

      const updatedRoles = await api.get("/roles");
      setRoles(updatedRoles.data);
    } catch (error) {
      console.error("Erro ao atualizar permissões:", error);
      alert("Erro ao atualizar permissões.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">

      {/* HEADER PREMIUM */}
      <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/40 shadow-2xl">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
              Atribuir Permissões
            </h1>

            <p className="text-slate-600 mt-2">
              Gestão de permissões por papel do sistema.
            </p>
          </div>

        </div>
      </div>

      {/* SELEÇÃO DE ROLE */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/40 shadow-2xl w-full md:w-1/2">

        <label className="block text-sm font-semibold text-slate-700 mb-3">
          Selecionar Papel
        </label>

        <select
          value={selectedRole || ""}
          onChange={(e) => handleSelectRole(e.target.value)}
          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-lg focus:ring-4 focus:ring-blue-200"
        >
          <option value="">-- Selecione --</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nome}
            </option>
          ))}
        </select>
      </div>

      {/* PERMISSÕES */}
      {selectedRole && (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/40 shadow-2xl">

          <h3 className="text-xl font-bold text-slate-800 mb-4">
            Permissões Disponíveis
          </h3>

          {loading ? (
            <div className="flex items-center gap-3 text-slate-500 py-10">
              <Loader2 className="animate-spin" />
              <span>Carregando permissões...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {permissoes.map((perm) => (
                <label
                  key={perm.id}
                  className={`flex items-center gap-2 border rounded-2xl px-4 py-3 cursor-pointer transition-all duration-300 ${
                    selectedPermissoes.includes(perm.id)
                      ? "bg-blue-50 border-blue-500 shadow-md"
                      : "hover:bg-slate-50 border-slate-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedPermissoes.includes(perm.id)}
                    onChange={() => togglePermissao(perm.id)}
                  />
                  <span className="font-medium text-slate-700">
                    {perm.nome}
                  </span>
                </label>
              ))}
            </div>
          )}

          {/* BOTÃO SALVAR */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg transition-all"
            >
              <Save size={18} />
              {saving ? "A Guardar..." : "Guardar Permissões"}
            </button>
          </div>
        </div>
      )}

      {/* LISTA */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/40 shadow-2xl">
        <PermissaoList />
      </div>

      {/* SEM ROLE */}
      {!selectedRole && (
        <div className="flex items-center gap-2 text-slate-500">
          <CheckCircle2 className="text-blue-500" />
          Selecione um papel acima para ver e alterar as permissões.
        </div>
      )}
    </div>
  );
}
