import React, { useState } from "react";
import { PlusCircle, ArrowLeft } from "lucide-react";
import InquilinoForm from "./InquilinoForm";
import InquilinoList from "./InquilinoList";

const InquilinoPage = () => {
  const [view, setView] = useState("menu"); // menu = lista | form = formulário

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {view === "menu" && (
        <div className="space-y-10 mt-10">
          {/* Cabeçalho */}
          <div className="flex items-center space-x-2 mb-4">
            <h1 className="text-4xl font-bold text-gray-800">
              Gestão de Inquilinos
            </h1>
          </div>

          {/* Botão Novo Inquilino */}
          <div
            onClick={() => setView("form")}
            className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6 flex items-center space-x-4 border border-gray-100 hover:border-blue-400"
          >
            <PlusCircle className="w-10 h-10 text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Novo Inquilino</h2>
              <p className="text-sm text-gray-500">
                Adicionar um novo inquilino ao sistema
              </p>
            </div>
          </div>

          <InquilinoList />
        </div>
      )}

      {view === "form" && (
        <div className="w-full mt-5">
          {/* Cabeçalho com botão voltar */}
          <div className="flex items-center mb-6 space-x-3">
            <button
              onClick={() => setView("menu")}
              className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Voltar
            </button>
            <h2 className="text-xl font-semibold text-gray-800">Novo Inquilino</h2>
          </div>

          <InquilinoForm onSuccess={() => setView("menu")} />
        </div>
      )}
    </div>
  );
};

export default InquilinoPage;

