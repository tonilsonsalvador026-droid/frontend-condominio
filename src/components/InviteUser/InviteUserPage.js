// src/components/InviteUser/InviteUserPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { toast } from "sonner";

export default function InviteUserPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!nome.trim() || !email.trim()) {
      toast.error("⚠️ Informe o nome e o email do novo usuário.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("⚠️ Você precisa estar logado como admin.");
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:5000/users/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome, email }),
      });

      // ⚠️ Tratamento para diferentes erros
      if (res.status === 409) {
        toast.error("⚠️ Este email já está registado ou já recebeu convite.");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "❌ Erro ao enviar convite.");
        setLoading(false);
        return;
      }

      // ✅ Notificação estilizada de sucesso
      toast.success(`Convite enviado com sucesso para ${email}! 🎉`, {
        duration: 4000,
      });

      // limpar inputs
      setNome("");
      setEmail("");
    } catch (err) {
      toast.error("❌ Erro ao conectar com o servidor.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6">Convidar Novo Usuário</h1>

      <form
        onSubmit={handleInvite}
        className="flex flex-col gap-4 w-full max-w-md bg-white shadow-md rounded-2xl p-6"
      >
        <Input
          type="text"
          placeholder="Nome do novo usuário"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Email do novo usuário"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? "Enviando convite..." : "Enviar Convite"}
        </Button>
      </form>

      <Button
        onClick={() => navigate("/Welcome")}
        className="mt-6 bg-gray-600 hover:bg-gray-700 text-white"
      >
        Voltar
      </Button>
    </div>
  );
}