// src/components/common/LanguageSelector.js
import React from "react";
import i18n from "../../i18n";

const LanguageSelector = () => {
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="flex gap-2 items-center">
      <button onClick={() => changeLanguage("pt")}>🇦🇴 Português</button>
      <button onClick={() => changeLanguage("kmb")}>🗣️ Kimbundu</button>
      <button onClick={() => changeLanguage("umb")}>🗣️ Umbundu</button>
    </div>
  );
};

export default LanguageSelector;