// src/pages/LoginPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import api from "../../api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError(t("errors.emptyFields"));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t("errors.invalidEmail"));
      return;
    }

    try {
      const res = await api.post("/login", { email, password });
      const data = res.data;

      if (!data || !data.user) {
        throw new Error("Resposta inválida do servidor.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role) {
        localStorage.setItem("role", data.user.role);
      }
      if (data.user.permissoes) {
        localStorage.setItem(
          "permissoes",
          JSON.stringify(data.user.permissoes)
        );
      }

      navigate("/welcome", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Credenciais inválidas ou erro no servidor. Tente novamente."
      );
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundImage: "url('/predios1.png')",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      {/* OVERLAY */}
      <div className="pointer-events-none absolute inset-0 bg-black/50" />

      {/* CARD */}
      <Card className="relative z-10 w-full max-w-md sm:max-w-lg rounded-2xl bg-white/15 backdrop-blur-xl shadow-2xl">
        <CardContent className="p-6 sm:p-8">
          {/* LOGO */}
          <div className="flex items-start justify-center mb-8 sm:mb-10">
            <span className="text-4xl sm:text-6xl font-extrabold text-white drop-shadow-lg mr-3">
              M
            </span>
            <div className="flex flex-col leading-none">
              <span className="text-xl sm:text-3xl font-bold text-white drop-shadow">
                {t("system.gestao")}
              </span>
              <span className="text-sm sm:text-lg text-white">
                {t("system.condominio")}
              </span>
              <span className="text-xs sm:text-sm text-white/70 italic">
                {t("system.slogan")}
              </span>
            </div>
          </div>

          {/* FORMULÁRIO */}
          <form onSubmit={handleSubmit}>
            {/* EMAIL */}
            <div className="flex flex-col gap-2 mb-5 sm:mb-6">
              <label className="text-white/90 text-sm font-semibold">
                {t("email")}
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("email")}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl
                           bg-white text-black placeholder-gray-500
                           border border-gray-300 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* PASSWORD */}
            <div className="flex flex-col gap-2 mb-5 sm:mb-6">
              <div className="flex justify-between items-center">
                <label className="text-white/90 text-sm font-semibold">
                  {t("password")}
                </label>
                <a
                  href="/recuperar-senha"
                  className="text-xs text-white/90 hover:text-white"
                >
                  {t("forgotPassword")}
                </a>
              </div>

              <div className="relative w-full">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("password")}
                  className="w-full px-3 sm:px-4 pr-10 py-2.5 sm:py-3 rounded-xl
                             bg-white text-black placeholder-gray-500
                             border border-gray-300 focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* ERROS */}
            {error && (
              <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
            )}

            {/* ENTRAR */}
            <Button
              type="submit"
              className="w-full py-2.5 sm:py-3 rounded-xl font-semibold
                         bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
            >
              {t("login")}
            </Button>
          </form>

          {/* BANDEIRA + IDIOMAS */}
          <div className="mt-6 sm:mt-8 flex flex-col items-center gap-3">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden ring-2 ring-white/80 shadow-lg">
              <img
                src="https://flagcdn.com/ao.svg"
                alt="Bandeira de Angola"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center gap-2 sm:gap-3 text-xs">
              <button
                onClick={() => i18n.changeLanguage("pt")}
                className="px-3 py-1 rounded-full bg-white/20 text-white hover:bg-white/30"
              >
                {t("language.portuguese")}
              </button>
              <button
                onClick={() => i18n.changeLanguage("kmb")}
                className="px-3 py-1 rounded-full bg-white/20 text-white hover:bg-white/30"
              >
                {t("language.kimbundu")}
              </button>
              <button
                onClick={() => i18n.changeLanguage("umb")}
                className="px-3 py-1 rounded-full bg-white/20 text-white hover:bg-white/30"
              >
                {t("language.umbundu")}
              </button>
            </div>
          </div>

          {/* COPYRIGHT */}
          <p className="text-center text-[11px] text-white/80 mt-5 sm:mt-6">
            © 2025 {t("system.gestao")} {t("system.condominio")}.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
