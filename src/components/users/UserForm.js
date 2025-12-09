// src/components/users/UserForm.js
import React, { useEffect, useState } from "react";
import api from "../../api";

const UserForm = ({ onSave, editingUser }) => {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    password: "",
    role: "",
    roleId: "",
    isActive: false,
  });

  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (editingUser) {
      setForm({
        nome: editingUser.nome || "",
        email: editingUser.email || "",
        password: "",
        role: editingUser.role || "",
        roleId: editingUser.roleId || "",
        isActive: editingUser.isActive || false,
      });
    }
  }, [editingUser]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await api.get("/roles");
        setRoles(res.data);
      } catch (err) {
        console.error("Erro ao carregar roles:", err);
      }
    };
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, form);
      } else {
        await api.post("/users", form);
      }
      onSave?.();
      setForm({
        nome: "",
        email: "",
        password: "",
        role: "",
        roleId: "",
        isActive: false,
      });
    } catch (err) {
      console.error("Erro ao salvar usuário:", err);
      alert("Erro ao salvar usuário");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-xl shadow">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Nome</label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block font-medium">Palavra-passe</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder={editingUser ? "Deixe em branco para manter" : ""}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block font-medium">Função (Texto livre)</label>
          <input
            type="text"
            name="role"
            value={form.role}
            onChange={handleChange}
            placeholder="Ex: ADMIN, FUNCIONARIO"
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block font-medium">Role do Sistema</label>
          <select
            name="roleId"
            value={form.roleId}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="">-- Selecionar --</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2 mt-6">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
          />
          <label>Ativo</label>
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        {editingUser ? "Atualizar Usuário" : "Salvar Usuário"}
      </button>
    </form>
  );
};

export default UserForm;