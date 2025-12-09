// src/components/recibos/ReciboPage.js
import React, { useState } from "react";
import { PlusCircle, ArrowLeft } from "lucide-react";
import ReciboForm from "./ReciboForm";
import ReciboList from "./ReciboList";

const ReciboPage = () => {
  const [view, setView] = useState("menu"); // "menu" = lista | "form" = formulário

  return (
    <div className="w-full px-4 md:px-8 lg:px-16 xl:px-20">
      {/* === VISUALIZAÇÃO PRINCIPAL (LISTA + BOTÃO NOVO RECIBO) === */}
      {view === "menu" && (
        <div className="space-y-10 mt-10">
          {/* Cabeçalho */}
          <div className="flex items-center space-x-2 mb-4">
            <h1 className="text-4xl font-bold text-gray-800">
              Gestão de Recibos
            </h1>
          </div>

          {/* Botão Novo Recibo */}
          <div
            onClick={() => setView("form")}
            className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6 flex items-center space-x-4 border border-gray-100 hover:border-blue-400"
          >
            <PlusCircle className="w-10 h-10 text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Novo Recibo
              </h2>
              <p className="text-sm text-gray-500">
                Emitir um novo recibo de pagamento
              </p>
            </div>
          </div>

          {/* Lista de Recibos */}
          <ReciboList />
        </div>
      )}

      {/* === FORMULÁRIO NOVO RECIBO === */}
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
            <h2 className="text-xl font-semibold text-gray-800">
              Novo Recibo
            </h2>
          </div>

          {/* Formulário */}
          <ReciboForm onSuccess={() => setView("menu")} />
        </div>
      )}
    </div>
  );
};

export default ReciboPage;