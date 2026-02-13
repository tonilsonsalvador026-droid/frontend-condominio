// src/components/inquilinos/InquilinoPage.js
import React, { useState } from "react";
import { PlusCircle, ArrowLeft } from "lucide-react";

import CardContainer from "../ui/CardContainer";
import PageHeader from "../ui/PageHeader";

import InquilinoForm from "./InquilinoForm";
import InquilinoList from "./InquilinoList";

const InquilinoPage = () => {
  const [view, setView] = useState("menu");

  return (
    <div className="w-full px-4 md:px-8 lg:px-16 xl:px-20 mt-6">

      {/* ===== MENU PRINCIPAL ===== */}
      {view === "menu" && (
        <div className="space-y-8">

          <PageHeader
            title="Gestão de Inquilinos"
            subtitle="Gerencie os inquilinos do sistema"
          />

          {/* Card — Novo Inquilino */}
          <CardContainer>
            <div
              onClick={() => setView("form")}
              className="cursor-pointer flex items-center gap-4 hover:bg-gray-50 rounded-xl p-4 transition"
            >
              <PlusCircle className="w-10 h-10 text-blue-600" />

              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Novo Inquilino
                </h3>
                <p className="text-sm text-gray-500">
                  Adicionar um novo inquilino ao sistema
                </p>
              </div>
            </div>
          </CardContainer>

          {/* Lista */}
          <InquilinoList />

        </div>
      )}

      {/* ===== FORMULÁRIO ===== */}
      {view === "form" && (
        <div className="space-y-6">

          <div className="flex items-center gap-3">

            <button
              onClick={() => setView("menu")}
              className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Voltar
            </button>

            <h2 className="text-xl font-semibold text-gray-800">
              Novo Inquilino
            </h2>

          </div>

          <InquilinoForm onSuccess={() => setView("menu")} />

        </div>
      )}

    </div>
  );
};

export default InquilinoPage;


