// src/components/Dashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/", { replace: true });
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({
          name: payload.nome || "Admin",
          role: payload.role || "admin",
        });
      } catch {
        setUser({ name: "Admin" });
      } finally {
        setLoading(false);
      }
    }, 100);
  }, [navigate]);

  if (loading || !user) return null;

  return (
    <div className="p-4 md:p-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-2">
          Bem-vindo, {user.name} 👋
        </h2>
        <p className="text-gray-600">
          Este é o painel principal do sistema de gestão.
        </p>
      </div>
    </div>
  );
}


