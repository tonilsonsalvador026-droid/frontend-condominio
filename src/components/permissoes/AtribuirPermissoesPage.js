import React, { useEffect, useState } from "react";
import api from "../../api";
import { CheckCircle2, Save } from "lucide-react";
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

  // Quando seleciona um papel, carregar as permissões já associadas
  const handleSelectRole = async (roleId) => {
    setSelectedRole(roleId);
    setSelectedPermissoes([]);

    try {
      const res = await api.get(`/roles/${roleId}`);
      const permissoesAtuais = res.data.permissoes.map((rp) => rp.permissaoId);
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

  // Guardar permissões do papel
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

      // Atualizar a lista de roles com permissões para exibir na tabela
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
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Atribuir Permissões a Papéis</h2>

      {/* Selecção do papel */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6 w-full md:w-1/2">
        <label className="block text-sm font-medium mb-2">Selecionar Papel</label>
        <select
          value={selectedRole || ""}
          onChange={(e) => handleSelectRole(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
        >
          <option value="">-- Selecione --</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nome}
            </option>
          ))}
        </select>
      </div>

      {/* Lista de permissões para atribuir */}
      {selectedRole && (
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-3">Permissões Disponíveis</h3>
          {loading ? (
            <p>Carregando permissões...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {permissoes.map((perm) => (
                <label
                  key={perm.id}
                  className={`flex items-center gap-2 border rounded px-3 py-2 cursor-pointer transition ${
                    selectedPermissoes.includes(perm.id)
                      ? "bg-blue-50 border-blue-500"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedPermissoes.includes(perm.id)}
                    onChange={() => togglePermissao(perm.id)}
                  />
                  <span>{perm.nome}</span>
                </label>
              ))}
            </div>
          )}

          {/* Botão salvar */}
          <div className="mt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <Save size={18} />
              {saving ? "A Guardar..." : "Guardar Permissões"}
            </button>
          </div>
        </div>
      )}

      {/* Lista de permissões atribuídas - usando o componente separado */}
      <div className="mt-6">
        <PermissoesList />
      </div>

      {/* Indicação quando nenhum papel estiver selecionado */}
      {!selectedRole && (
        <div className="text-gray-600 mt-4">
          <CheckCircle2 className="inline mr-2 text-blue-500" />
          Selecione um papel acima para ver e alterar as permissões.
        </div>
      )}
    </div>
  );
}