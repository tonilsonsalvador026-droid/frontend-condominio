// src/components/fracoes/FracoesPage.js
import React, { useState } from "react";
import { PlusCircle, ArrowLeft } from "lucide-react";
import FracaoForm from "./FracaoForm";
import FracaoList from "./FracaoList";

const FracoesPage = () => {
  const [view, setView] = useState("list"); // list | form

  return (
    <div className="w-full px-6 lg:px-12 mt-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Gestão de Frações
        </h1>

        {view === "list" ? (
          <button
            onClick={() => setView("form")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          >
            <PlusCircle size={18} />
            Nova Fração
          </button>
        ) : (
          <button
            onClick={() => setView("list")}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>
        )}
      </div>

      {/* CONTENT */}
      {view === "list" && <FracaoList />}
      {view === "form" && <FracaoForm onSuccess={() => setView("list")} />}
    </div>
  );
};

export default FracoesPage;
