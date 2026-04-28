// src/components/contacorrente/ContaCorrentePage.js
import React, { useState } from "react";
import ContaCorrenteList from "./ContaCorrenteList";
import ContaCorrenteForm from "./ContaCorrenteForm";
import MovimentoList from "./MovimentoList";

const ContaCorrentePage = () => {
  const [view, setView] = useState("list"); 
  // "list" | "form" | "movimentos"

  const [selectedConta, setSelectedConta] = useState(null);
  const [editingConta, setEditingConta] = useState(null);

  // 🔵 abrir formulário novo
  const handleNew = () => {
    setEditingConta(null);
    setView("form");
  };

  // 🟡 editar conta
  const handleEdit = (conta) => {
    setEditingConta(conta);
    setView("form");
  };

  // 🔵 ver movimentos
  const handleViewMovimentos = (conta) => {
    setSelectedConta(conta);
    setView("movimentos");
  };

  // 🔙 voltar para lista
  const handleBack = () => {
    setSelectedConta(null);
    setEditingConta(null);
    setView("list");
  };

  return (
    <div className="w-full">

      {/* 🟣 LISTA DE CONTAS */}
      {view === "list" && (
        <ContaCorrenteList
          onNew={handleNew}
          onEdit={handleEdit}
          onViewMovimentos={handleViewMovimentos}
        />
      )}

      {/* 🟢 FORMULÁRIO (CRIAR / EDITAR) */}
      {view === "form" && (
        <ContaCorrenteForm
          editingConta={editingConta}
          onSuccess={handleBack}
          onCancel={handleBack}
        />
      )}

      {/* 🔵 MOVIMENTOS (EXTRATO) */}
      {view === "movimentos" && (
        <MovimentoList
          conta={selectedConta}
          onBack={handleBack}
        />
      )}

    </div>
  );
};

export default ContaCorrentePage;
