// src/components/contacorrente/ContaCorrentePage.js
import React, { useState } from "react";
import ContaCorrenteList from "./ContaCorrenteList";
import ContaCorrenteForm from "./ContaCorrenteForm";

const ContaCorrentePage = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="w-full">

      {!showForm ? (
        <ContaCorrenteList
          onNew={() => setShowForm(true)}
        />
      ) : (
        <ContaCorrenteForm
          onSuccess={() => setShowForm(false)}
        />
      )}

    </div>
  );
};

export default ContaCorrentePage;
