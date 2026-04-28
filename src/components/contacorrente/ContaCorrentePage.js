// src/components/contacorrente/ContaCorrentePage.js
import React, { useState } from "react";
import ContaCorrenteList from "./ContaCorrenteList";
import ContaCorrenteForm from "./ContaCorrenteForm";
import MovimentoList from "./MovimentoList";
import MovimentoForm from "./MovimentoForm"; // ✅ ADICIONADO

const ContaCorrentePage = () => {
  const [view, setView] = useState("list");
  // "list" | "form" | "movimentos" | "movimentoForm"

  const [selectedConta, setSelectedConta] = useState(null);
  const [editingConta, setEditingConta] = useState(null);
  const [editingMovimento, setEditingMovimento] = useState(null);

  // 🔵 abrir formulário novo conta corrente
  const handleNew = () => {
    setEditingConta(null);
    setView("form");
  };

  // 🟡 editar conta corrente
  const handleEdit = (conta) => {
    setEditingConta(conta);
    setView("form");
  };

  // 🔵 ver movimentos
  const handleViewMovimentos = (conta) => {
    setSelectedConta(conta);
    setView("movimentos");
  };

  // 🟢 abrir novo movimento
  const handleNewMovimento = () => {
    setEditingMovimento(null);
    setView("movimentoForm");
  };

  // 🟡 editar movimento
  const handleEditMovimento = (movimento) => {
    setEditingMovimento(movimento);
    setView("movimentoForm");
  };

  // 🔙 voltar para lista de contas
  const handleBack = () => {
    setSelectedConta(null);
    setEditingConta(null);
    setEditingMovimento(null);
    setView("list");
  };

  // 🔙 voltar para movimentos
  const handleBackToMovimentos = () => {
    setEditingMovimento(null);
    setView("movimentos");
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

      {/* 🟢 FORM CONTA CORRENTE */}
      {view === "form" && (
        <ContaCorrenteForm
          editingConta={editingConta}
          onSuccess={handleBack}
          onCancel={handleBack}
        />
      )}

      {/* 🔵 LISTA MOVIMENTOS */}
      {view === "movimentos" && (
        <MovimentoList
          conta={selectedConta}
          onBack={handleBack}
          onNew={handleNewMovimento}              // ✅ ADICIONADO
          onEdit={handleEditMovimento}           // ✅ ADICIONADO
        />
      )}

      {/* 🟠 FORM MOVIMENTO (NOVO / EDITAR) */}
      {view === "movimentoForm" && (
        <MovimentoForm
          conta={selectedConta}
          editingMovimento={editingMovimento}
          onSuccess={handleBackToMovimentos}
          onCancel={handleBackToMovimentos}
        />
      )}

    </div>
  );
};

export default ContaCorrentePage;
