import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UserPlus, KeyRound, Home } from "lucide-react";
import Button from "../ui/Button";

export default function WelcomeActionsPage({ user }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const goToDashboard = () => navigate("/dashboard", { replace: true });
  const goToInviteUser = () => navigate("/invite-user", { replace: true });
  const goToRecoverPassword = () => navigate("/recuperar-senha", { replace: true });

  if (!user) return null;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md flex flex-col items-center text-center">
        <h2 className="text-4xl font-semibold text-gray-800 mb-4">
          {t("welcome.greeting")},{" "}
          <span className="text-blue-600">
            {user.role === "admin"
              ? t("welcome.admin")
              : user.nome || t("welcome.user")}
          </span>
          !
        </h2>

        <p className="text-gray-500 mb-8">{t("welcome.chooseOption")}</p>

        {/* Ações específicas para o administrador */}
        {user.role === "admin" && (
          <div className="flex flex-col gap-4 w-full mb-6">
            <Button
              onClick={goToInviteUser}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
            >
              <UserPlus size={18} />
              {t("welcome.inviteUser")}
            </Button>

            <Button
              onClick={goToRecoverPassword}
              className="w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 rounded-lg transition"
            >
              <KeyRound size={18} />
              {t("welcome.recoverPassword")}
            </Button>
          </div>
        )}

        {/* Botão comum para todos os utilizadores */}
        <Button
          onClick={goToDashboard}
          className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
        >
          <Home size={18} />
          {t("welcome.goToMainPage")}
        </Button>
      </div>
    </div>
  );
}