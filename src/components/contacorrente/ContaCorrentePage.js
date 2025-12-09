// src/components/contacorrente/ContaCorrentePage.js
import React, { useState } from "react";
import { PlusCircle, ArrowLeft } from "lucide-react";
import ContaCorrenteForm from "./ContaCorrenteForm";
import ContaCorrenteList from "./ContaCorrenteList";
import MovimentoForm from "./MovimentoForm";
import MovimentoList from "./MovimentoList";

const ContaCorrentePage = () => {
  const [view, setView] = useState("menu"); // "menu" = lista geral | "contaForm" = novo conta | "movimentoForm" = novo movimento

  return (
    <div className="w-full px-4 md:px-8 lg:px-16 xl:px-20">
      {/* === VISUALIZAÇÃO PRINCIPAL === */}
      {view === "menu" && (
        <div className="space-y-10 mt-10">
          {/* Cabeçalho */}
          <div className="flex items-center space-x-2 mb-4">
            <h1 className="text-4xl font-bold text-gray-800">
              Gestão de Conta Corrente
            </h1>
          </div>

          {/* Bloco: Nova Conta Corrente */}
          <div
            onClick={() => setView("contaForm")}
            className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6 flex items-center space-x-4 border border-gray-100 hover:border-blue-400"
          >
            <PlusCircle className="w-10 h-10 text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Nova Conta Corrente
              </h2>
              <p className="text-sm text-gray-500">
                Registar uma nova conta corrente de proprietário
              </p>
            </div>
          </div>

          {/* Lista de Contas Correntes */}
          <ContaCorrenteList />

          {/* Bloco: Novo Movimento */}
          <div
            onClick={() => setView("movimentoForm")}
            className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6 flex items-center space-x-4 border border-gray-100 hover:border-green-400"
          >
            <PlusCircle className="w-10 h-10 text-green-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Novo Movimento
              </h2>
              <p className="text-sm text-gray-500">
                Adicionar um novo movimento à conta corrente
              </p>
            </div>
          </div>

          {/* Lista de Movimentos */}
          <MovimentoList />
        </div>
      )}

      {/* === FORMULÁRIO NOVA CONTA CORRENTE === */}
      {view === "contaForm" && (
        <div className="w-full mt-5">
          <div className="flex items-center mb-6 space-x-3">
            <button
              onClick={() => setView("menu")}
              className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Voltar
            </button>
            <h2 className="text-xl font-semibold text-gray-800">
              Nova Conta Corrente
            </h2>
          </div>

          <ContaCorrenteForm onSave={() => setView("menu")} />
        </div>
      )}

      {/* === FORMULÁRIO NOVO MOVIMENTO === */}
      {view === "movimentoForm" && (
        <div className="w-full mt-5">
          <div className="flex items-center mb-6 space-x-3">
            <button
              onClick={() => setView("menu")}
              className="flex items-center text-sm text-gray-600 hover:text-green-600 transition"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Voltar
            </button>
            <h2 className="text-xl font-semibold text-gray-800">
              Novo Movimento
            </h2>
          </div>

          <MovimentoForm onSave={() => setView("menu")} />
        </div>
      )}
    </div>
  );
};

export default ContaCorrentePage;