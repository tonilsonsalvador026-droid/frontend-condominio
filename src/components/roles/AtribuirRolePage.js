import React, { useEffect, useState } from "react";

import api from "../../api";

import { toast } from "sonner";

import {
  ShieldCheck,
  Search,
  Loader2,
  UserCog,
} from "lucide-react";

const AtribuirRolePage = () => {

  const [users, setUsers] = useState([]);

  const [roles, setRoles] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(null);

  const [search, setSearch] = useState("");

  // BUSCAR DADOS
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

      console.error(err);

      toast.error("Erro ao carregar dados.");

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ATRIBUIR ROLE
  const handleRoleChange = async (userId, roleId) => {

    try {

      setSaving(userId);

      await api.put(`/users/${userId}/role`, {
        roleId: Number(roleId),
      });

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, roleId: Number(roleId) }
            : u
        )
      );

      toast.success("Papel atribuído com sucesso!");

    } catch (err) {

      console.error(err);

      toast.error("Erro ao atribuir papel.");

    } finally {

      setSaving(null);

    }
  };

  // FILTRO
  const filteredUsers = users.filter((user) =>
    user.nome?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">

      {/* HEADER PREMIUM */}
      <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/40 shadow-2xl">

        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

          <div>

            <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
              Atribuir Funções
            </h1>

            <p className="text-slate-600 mt-2">
              Gestão de permissões e papéis dos utilizadores.
            </p>

            <p className="text-sm text-slate-500 mt-3 font-medium">
              {filteredUsers.length} utilizadores encontrados
            </p>

          </div>

          {/* PESQUISA */}
          <div className="relative w-full xl:w-80">

            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Pesquisar utilizador..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/70 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 shadow-lg"
            />

          </div>

        </div>

      </div>

      {/* TABELA */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/40 shadow-2xl overflow-x-auto">

        {loading ? (

          <div className="flex items-center justify-center gap-3 py-20 text-slate-500">

            <Loader2 className="animate-spin" />

            <span>A carregar utilizadores...</span>

          </div>

        ) : (

          <table className="w-full text-sm md:text-base">

            <thead className="bg-slate-100 text-slate-700">

              <tr>

                <th className="p-4 text-left">
                  Utilizador
                </th>

                <th className="p-4 text-left">
                  Email
                </th>

                <th className="p-4 text-left">
                  Papel Atual
                </th>

                <th className="p-4 text-left">
                  Novo Papel
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredUsers.length > 0 ? (

                filteredUsers.map((user) => {

                  const roleAtual =
                    roles.find((r) => r.id === user.roleId)?.nome || "Sem papel";

                  return (

                    <tr
                      key={user.id}
                      className="border-t hover:bg-slate-50 transition-all duration-300"
                    >

                      <td className="p-4">

                        <div className="flex items-center gap-3">

                          <div className="p-2 bg-blue-100 rounded-xl">
                            <UserCog className="w-5 h-5 text-blue-600" />
                          </div>

                          <span className="font-semibold text-slate-800">
                            {user.nome}
                          </span>

                        </div>

                      </td>

                      <td className="p-4 text-slate-600">
                        {user.email}
                      </td>

                      <td className="p-4">

                        <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-700 font-semibold text-sm">
                          {roleAtual}
                        </span>

                      </td>

                      <td className="p-4">

                        <div className="flex items-center gap-3">

                          <select
                            value={user.roleId || ""}
                            onChange={(e) =>
                              handleRoleChange(user.id, e.target.value)
                            }
                            className="px-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-lg focus:ring-4 focus:ring-blue-200"
                          >

                            <option value="">
                              Selecionar papel
                            </option>

                            {roles.map((role) => (

                              <option
                                key={role.id}
                                value={role.id}
                              >
                                {role.nome}
                              </option>

                            ))}

                          </select>

                          {saving === user.id && (
                            <Loader2 className="animate-spin text-blue-600" />
                          )}

                        </div>

                      </td>

                    </tr>

                  );
                })

              ) : (

                <tr>

                  <td
                    colSpan="4"
                    className="text-center p-10 text-slate-400"
                  >
                    Nenhum utilizador encontrado.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        )}

      </div>

    </div>
  );
};

export default AtribuirRolePage;
