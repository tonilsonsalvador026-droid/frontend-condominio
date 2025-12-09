import React, { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function SetPasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://192.168.1.238:5000/users/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao definir senha.");
        setLoading(false);
        return;
      }

      setMessage("Senha definida com sucesso! Redirecionando para o login...");
      setLoading(false);

      // ⏳ Espera 2 segundos e redireciona
      setTimeout(() => navigate("/login"), 2000);

    } catch (err) {
      console.error(err);
      setError("Erro ao conectar com o servidor.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Definir Senha</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          placeholder="Nova Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          disabled={loading}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Aguarde..." : "Definir Senha"}
        </Button>
      </form>

      {message && <p className="mt-3 text-green-600 text-center">{message}</p>}
      {error && <p className="mt-3 text-red-500 text-center">{error}</p>}
    </div>
  );
}