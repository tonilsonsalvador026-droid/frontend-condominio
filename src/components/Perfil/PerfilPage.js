// src/components/PerfilPage.js
import React, { useState } from "react";
import { CalendarIcon, Save } from "lucide-react";
import { toast } from "sonner";

export default function PerfilPage() {
  const [activeTab, setActiveTab] = useState("principal");

  const tabs = [
    { id: "principal", label: "Principal" },
    { id: "acessos", label: "Acessos" },
    { id: "contactos", label: "Contactos" },
  ];

  const handleSave = () => {
    toast.success("Perfil atualizado com sucesso!");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col">
      {/* Título */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Perfil do Utilizador
      </h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 px-1 text-sm font-medium ${
                activeTab === tab.id
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Conteúdo */}
      <div className="bg-white shadow rounded-xl p-6 flex-1 relative">
        {activeTab === "principal" && (
          <div>
            <h2 className="text-lg font-semibold mb-6">
              Informações Principais
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Código */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código
                </label>
                <input
                  type="text"
                  value="AD"
                  readOnly
                  className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700 font-bold"
                />
              </div>

              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  defaultValue="Admin"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Data de nascimento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Nascimento
                </label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <CalendarIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-500" />
                </div>
              </div>

              {/* Contribuinte */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contribuinte
                </label>
                <input
                  type="text"
                  placeholder="NIF / Contribuinte"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Data do documento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data do Documento
                </label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <CalendarIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "acessos" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Acessos</h2>
            <p className="text-gray-600">
              Aqui vamos colocar email, password, confirmações e permissões.
            </p>
          </div>
        )}

        {activeTab === "contactos" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Contactos</h2>
            <p className="text-gray-600">
              Aqui iremos adicionar os contactos pessoais, telefones, emails,
              observações, etc.
            </p>
          </div>
        )}

        {/* Botão Gravar - canto inferior direito */}
        <div className="flex justify-end mt-8">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            <Save className="h-5 w-5" />
            Gravar
          </button>
        </div>
      </div>
    </div>
  );
}