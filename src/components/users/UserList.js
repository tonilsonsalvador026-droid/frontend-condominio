// src/components/users/UserList.js
import React, { useEffect, useState } from "react";
import api from "../../api";
import dayjs from "dayjs";
import { Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";

const UserList = ({ onEdit }) => {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja eliminar este usuário?")) {
      try {
        await api.delete(`/users/${id}`);
        loadUsers();
      } catch (err) {
        console.error("Erro ao eliminar:", err);
      }
    }
  };

  return (
    <div className="mt-6 bg-white shadow rounded-xl p-4">
      <h2 className="text-xl font-semibold mb-4">Lista de Utilizadores</h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">#</th>
            <th className="p-2 border">Nome</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Função</th>
            <th className="p-2 border">Role ID</th>
            <th className="p-2 border">Ativo</th>
            <th className="p-2 border">Criado em</th>
            <th className="p-2 border text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={u.id} className="border-t hover:bg-gray-50">
              <td className="p-2 border">{i + 1}</td>
              <td className="p-2 border">{u.nome}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">{u.role || "—"}</td>
              <td className="p-2 border">{u.roleId || "—"}</td>
              <td className="p-2 border text-center">
                {u.isActive ? (
                  <CheckCircle className="text-green-600 inline" size={18} />
                ) : (
                  <XCircle className="text-red-500 inline" size={18} />
                )}
              </td>
              <td className="p-2 border">{dayjs(u.criadoEm).format("DD/MM/YYYY")}</td>
              <td className="p-2 border text-center space-x-2">
                <button
                  onClick={() => onEdit(u)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(u.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;