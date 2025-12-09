// src/components/gestaoacessos/AtribuirRolePage.js
import React, { useEffect, useState } from "react";
import api from "../../api";
import { UserCog, Save, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";

export default function AtribuirRolePage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(null);

  // Carregar utilizadores e roles
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersRes, rolesRes] = await Promise.all([
          api.get("/users"),
          api.get("/roles"),
        ]);
        setUsers(usersRes.data);
        setRoles(rolesRes.data);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        toast.error("Erro ao carregar utilizadores e papéis.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChangeRole = async (userId, roleId) => {
    try {
      setSaving(userId);
      await api.put(`/users/${userId}/role`, { roleId });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, roleId } : u))
      );
      toast.success("Papel atribuído com sucesso!");
    } catch (err) {
      console.error("Erro ao atribuir papel:", err);
      toast.error("Erro ao atribuir papel ao utilizador.");
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <UserCog className="text-blue-600" size={28} />
        <h2 className="text-2xl font-bold">Atribuir Papéis aos Utilizadores</h2>
      </div>

      {loading ? (
        <div className="text-gray-500 flex items-center gap-2">
          <RefreshCw className="animate-spin" size={20} />
          A carregar dados...
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-xl p-4 border">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3">Nome</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Papel Atual</th>
                <th className="text-left p-3">Atribuir Novo Papel</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const papelAtual = roles.find((r) => r.id === user.roleId)?.nome || "—";
                return (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{user.nome}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{papelAtual}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <select
                          className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
                          value={user.roleId || ""}
                          onChange={(e) =>
                            handleChangeRole(user.id, parseInt(e.target.value))
                          }
                        >
                          <option value="">Selecionar...</option>
                          {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.nome}
                            </option>
                          ))}
                        </select>
                        {saving === user.id && (
                          <Save
                            className="animate-spin text-green-600"
                            size={18}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}