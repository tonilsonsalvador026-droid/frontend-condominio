// src/components/RecuperarPasswordPage.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast } from "sonner";

const RecuperarPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError(t("errors.emptyFields"));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t("errors.invalidEmail"));
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/auth/recuperar-password",
        { email }
      );

      toast.success(
        res.data?.message || t("recuperar.linkEnviado", { email })
      );
      setEmail(""); // limpar input
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) {
        toast.error(t("errors.userNotFound"));
      } else {
        toast.error(t("errors.serverError"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {t("recuperar.titulo")}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              {t("recuperar.email")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-gray-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-300"
              placeholder={t("recuperar.placeholder")}
              required
            />
          </div>

          {/* ERROS */}
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          {/* BOTÃO RECUPERAR */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 transition-transform text-white py-2 rounded-xl font-semibold shadow-md disabled:opacity-50"
          >
            {loading ? t("recuperar.processando") : t("recuperar.botao")}
          </button>
        </form>

        {/* LINK VOLTAR AO LOGIN */}
        <div className="text-center mt-6">
          <p className="text-sm text-white/80">
            {t("recuperar.lembrou")}{" "}
            <Link to="/" className="text-blue-300 hover:underline">
              {t("recuperar.loginLink")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecuperarPasswordPage;