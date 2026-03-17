// src/components/edificios/EdificioPage.js
import React, { useState } from "react";
import { PlusCircle, ArrowLeft, ChevronLeft } from "lucide-react";
import EdificioForm from "./EdificioForm";
import EdificioList from "./EdificioList";

const EdificioPage = () => {
  const [view, setView] = useState("menu"); // "menu" = lista | "form" = formulário

  return (
    <div className="w-full space-y-12 py-8">
      {/* === LISTA PRINCIPAL === */}
      {view === "menu" && (
        <>
          {/* Header Glass */}
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/40 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl border border-blue-200/50">
                <ChevronLeft className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
                  Gestão de Edifícios
                </h1>
                <p className="text-xl text-slate-600 font-semibold mt-1">
                  Crie e gerencie edifícios de forma eficiente
                </p>
              </div>
            </div>
          </div>

          {/* Card "Novo Edifício" Glass */}
          <div
            onClick={() => setView("form")}
            className="group bg-white/70 backdrop-blur-xl hover:bg-white/90 rounded-3xl p-10 shadow-xl hover:shadow-2xl border border-slate-200/40 hover:border-blue-300/60 hover:-translate-y-2 transition-all duration-500 cursor-pointer h-32 flex items-center gap-6 xl:hover:scale-[1.02]"
          >
            <div className="p-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl shadow-2xl group-hover:rotate-3 transition-all w-24 h-24 flex items-center justify-center flex-shrink-0">
              <PlusCircle className="w-12 h-12 text-white drop-shadow-lg" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-3 group-hover:text-blue-900 transition-colors">
                Novo Edifício
              </h2>
              <p className="text-xl text-slate-600 font-semibold leading-relaxed">
                Cadastre um novo edifício completo com todos os detalhes
              </p>
            </div>
          </div>

          {/* Lista */}
          <EdificioList />
        </>
      )}

      {/* === FORMULÁRIO === */}
      {view === "form" && (
        <div className="space-y-8">
          {/* Header Voltar Glass */}
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/40 shadow-2xl">
            <div className="flex items-center gap-4 max-w-2xl mx-auto">
              <button
                onClick={() => setView("menu")}
                className="group p-4 bg-slate-100/50 hover:bg-slate-200/70 rounded-2xl border border-slate-200/50 hover:border-slate-300/70 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center"
              >
                <ArrowLeft className="w-6 h-6 text-slate-700 group-hover:translate-x-1 transition-transform mr-2" />
                <span className="font-bold text-lg text-slate-800">Voltar aos Edifícios</span>
              </button>
              <div className="flex-1 text-center">
                <h2 className="text-3xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
                  Novo Edifício
                </h2>
                <p className="text-lg text-slate-600 mt-1">Preencha os dados abaixo</p>
              </div>
            </div>
          </div>

          {/* Formulário */}
          <div className="bg-white/50 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-slate-200/40 shadow-2xl max-w-4xl mx-auto">
            <EdificioForm onSuccess={() => setView("menu")} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EdificioPage;

