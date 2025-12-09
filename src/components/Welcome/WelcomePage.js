import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import WelcomeActionsPage from "./WelcomeActionsPage";

export default function WelcomePage() {
  const [user, setUser] = useState(null);
  const [dailyMessage, setDailyMessage] = useState("");
  const [showActions, setShowActions] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    // Se não houver token ou utilizador guardado → redirecionar
    if (!token || !storedUser) {
      navigate("/", { replace: true });
      return;
    }

    try {
      const userObj = JSON.parse(storedUser);
      setUser(userObj);
    } catch (err) {
      console.error("Erro ao carregar utilizador:", err);
      navigate("/", { replace: true });
    }

    // 🔹 Mensagem do dia
    const today = new Date();
    const dayOfWeek = today.getDay();

    const motivationalMessages = t("motivational.monday", { returnObjects: true });
    const learningMessages = t("learning.week", { returnObjects: true });

    const selectedMessage =
      dayOfWeek === 1
        ? motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
        : learningMessages[Math.floor(Math.random() * learningMessages.length)];

    setDailyMessage(selectedMessage);

    // 🔹 Reduzir tempo de leitura de 90s → 30s
    const timer = setTimeout(() => setShowActions(true), 30000);
    return () => clearTimeout(timer);
  }, [navigate, t]);

  if (!user) return null;

  if (showActions) return <WelcomeActionsPage user={user} />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-gray-200 p-6 text-center">
      <div className="max-w-6xl w-full p-14 bg-white shadow-2xl rounded-2xl border border-gray-200 min-h-[600px]">
        <h1 className="text-5xl font-extrabold mb-6 text-indigo-700">
          {t("welcome.hello")},{" "}
          {user.role === "admin"
            ? t("welcome.admin")
            : user.nome || t("welcome.user")}
          !
        </h1>

        <p className="text-lg mb-6 text-gray-800">✨ {t("welcome.aiRecognized")}</p>

        <p className="text-2xl font-semibold mb-8 text-green-600 italic">
          {dailyMessage}
        </p>

        <p className="text-base text-gray-700 mb-20">
          {t("welcome.readMessage")}{" "}
          <span className="font-bold text-red-500">{t("welcome.timeNotice")}</span>{" "}
          {t("welcome.accessOptions")}.
        </p>

        <button
          onClick={() => setShowActions(true)}
          className="mt-2 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-xl shadow hover:bg-indigo-700 transition-all"
        >
          {t("welcome.button")} →
        </button>
      </div>
    </div>
  );
}