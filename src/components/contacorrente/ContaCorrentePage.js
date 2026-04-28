// src/components/contacorrente/ContaCorrentePage.js
import React, { useState } from "react";
import ContaCorrenteList from "./ContaCorrenteList";
import ContaCorrenteForm from "./ContaCorrenteForm";
import MovimentoList from "./MovimentoList";

const ContaCorrentePage = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedConta, setSelectedConta] = useState(null);

  return (
    <div className="w-full">

      {/* 🔵 1. VER MOVIMENTOS */}
      {selectedConta ? (
        <MovimentoList
          conta={selectedConta}
          onBack={() => setSelectedConta(null)}
        />
      ) : showForm ? (
        /* 🟢 2. FORMULÁRIO */
        <ContaCorrenteForm
          onSuccess={() => setShowForm(false)}
        />
      ) : (
        /* 🟣 3. LISTA DE CONTAS */
        <ContaCorrenteList
          onNew={() => setShowForm(true)}
          onViewMovimentos={(conta) => setSelectedConta(conta)}
        />
      )}

    </div>
  );
};

export default ContaCorrentePage;
