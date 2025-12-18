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

    if (!token || !storedUser) {
      navigate("/", { replace: true });
      return;
    }

    try {
      const userObj = JSON.parse(storedUser);
      setUser(userObj);
    } catch (err) {
      navigate("/", { replace: true });
    }

    const today = new Date();
    const dayOfWeek = today.getDay();

    const motivationalMessages = t("motivational.monday", {
      returnObjects: true,
    });
    const learningMessages = t("learning.week", { returnObjects: true });

    const selectedMessage =
      dayOfWeek === 1
        ? motivationalMessages[
            Math.floor(Math.random() * motivationalMessages.length)
          ]
        : learningMessages[
            Math.floor(Math.random() * learningMessages.length)
          ];

    setDailyMessage(selectedMessage);

    const timer = setTimeout(() => setShowActions(true), 30000);
    return () => clearTimeout(timer);
  }, [navigate, t]);

  if (!user) return null;
  if (showActions) return <WelcomeActionsPage user={user} />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-gray-200 px-4 sm:px-6">
      <div
        className="
          w-full
          max-w-3xl
          lg:max-w-5xl
          bg-white
          shadow-2xl
          rounded-2xl
          border border-gray-200
          px-6 py-8
          sm:px-10 sm:py-12
          lg:px-14 lg:py-14
          text-center
        "
      >
        {/* TÍTULO */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold mb-5 text-indigo-700 leading-tight">
          {t("welcome.hello")},{" "}
          {user.role === "admin"
            ? t("welcome.admin")
            : user.nome || t("welcome.user")}
          !
        </h1>

        {/* SUBTEXTO */}
        <p className="text-sm sm:text-base lg:text-lg mb-6 text-gray-800">
          ✨ {t("welcome.aiRecognized")}
        </p>

        {/* MENSAGEM DO DIA */}
        <p className="text-lg sm:text-xl lg:text-2xl font-semibold mb-8 text-green-600 italic leading-relaxed">
          {dailyMessage}
        </p>

        {/* INSTRUÇÃO */}
        <p className="text-sm sm:text-base text-gray-700 mb-12 sm:mb-16">
          {t("welcome.readMessage")}{" "}
          <span className="font-bold text-red-500">
            {t("welcome.timeNotice")}
          </span>{" "}
          {t("welcome.accessOptions")}.
        </p>

        {/* BOTÃO */}
        <button
          onClick={() => setShowActions(true)}
          className="
            inline-flex items-center justify-center
            px-6 py-2.5
            sm:px-8 sm:py-3
            bg-indigo-600
            text-white
            text-sm sm:text-base
            font-semibold
            rounded-xl
            shadow
            hover:bg-indigo-700
            transition-all
          "
        >
          {t("welcome.button")} →
        </button>
      </div>
    </div>
  );
}
