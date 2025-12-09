// src/components/users/UsersPage.js
import React, { useState } from "react";
import UserForm from "./UserForm";
import UserList from "./UserList";

const UsersPage = () => {
  const [editingUser, setEditingUser] = useState(null);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gestão de Utilizadores</h1>

      <UserForm
        editingUser={editingUser}
        onSave={() => {
          setEditingUser(null);
          window.location.reload();
        }}
      />

      <UserList onEdit={setEditingUser} />
    </div>
  );
};

export default UsersPage;