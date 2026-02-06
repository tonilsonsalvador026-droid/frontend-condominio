import React, { useState } from "react";
import EdificioForm from "./EdificioForm";
import EdificioList from "./EdificioList";

const EdificioPage = () => {
  const [view, setView] = useState("list");

  return (
    <div className="space-y-8">
      {view === "list" && (
        <>
          <button
            onClick={() => setView("form")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Novo Edifício
          </button>
          <EdificioList />
        </>
      )}

      {view === "form" && (
        <EdificioForm onSuccess={() => setView("list")} />
      )}
    </div>
  );
};

export default EdificioPage;
