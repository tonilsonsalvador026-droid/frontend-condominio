// src/components/edificios/EdificioPage.js
import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import EdificioForm from "./EdificioForm";
import EdificioList from "./EdificioList";

const EdificioPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [reloadList, setReloadList] = useState(false);

  const handleSuccess = () => {
    setShowForm(false);
    setReloadList(!reloadList);
  };

  return (
    <div className="w-full px-4 md:px-8 lg:px-16 xl:px-20 mt-8 space-y-6">
      {/* Cabeçalho do Módulo */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Gestão de Edifícios
        </h1>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition text-sm"
        >
          <PlusCircle size={18} />
          {showForm ? "Fechar Formulário" : "Novo Edifício"}
        </button>
      </div>

      {/* Formulário */}
      {showForm && <EdificioForm onSuccess={handleSuccess} />}

      {/* Lista */}
      <EdificioList key={reloadList} />
    </div>
  );
};

export default EdificioPage;
