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

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", data.user?.role || "");
      localStorage.setItem(
        "permissoes",
        JSON.stringify(data.user?.permissoes || [])
      );

      navigate("/welcome", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Credenciais inválidas. Tente novamente."
      );
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundImage: "url('/predios1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/60" />

      {/* CARD */}
      <Card className="relative z-10 w-full max-w-md rounded-2xl bg-white/20 backdrop-blur-xl shadow-2xl">
        <CardContent className="p-6 sm:p-8">
          {/* LOGO */}
          <div className="flex justify-center items-center gap-3 mb-8">
            <span className="text-4xl sm:text-5xl font-extrabold text-white">
              M
            </span>
            <div className="text-white leading-tight">
              <p className="text-lg sm:text-xl font-bold">
                {t("system.gestao")}
              </p>
              <p className="text-sm opacity-90">
                {t("system.condominio")}
              </p>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-white font-medium">
                {t("email")}
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label className="text-sm text-white font-medium">
                  {t("password")}
                </label>
                <a
                  href="/recuperar-senha"
                  className="text-xs text-white/80 hover:text-white"
                >
                  {t("forgotPassword")}
                </a>
              </div>

              <div className="relative mt-1">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 pr-10 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-center text-sm text-red-300">{error}</p>
            )}

            <Button className="w-full py-2 text-sm font-semibold rounded-lg">
              {t("login")}
            </Button>
          </form>

          {/* IDIOMAS */}
          <div className="mt-6 flex justify-center gap-2 text-xs">
            <button
              onClick={() => i18n.changeLanguage("pt")}
              className="px-3 py-1 rounded-full bg-white/20 text-white"
            >
              PT
            </button>
            <button
              onClick={() => i18n.changeLanguage("kmb")}
              className="px-3 py-1 rounded-full bg-white/20 text-white"
            >
              KMB
            </button>
            <button
              onClick={() => i18n.changeLanguage("umb")}
              className="px-3 py-1 rounded-full bg-white/20 text-white"
            >
              UMB
            </button>
          </div>

          {/* COPYRIGHT */}
          <p className="mt-5 text-center text-[11px] text-white/70">
            © 2025 {t("system.gestao")} {t("system.condominio")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
