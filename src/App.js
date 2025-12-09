// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Autenticação
import LoginPage from "./components/auth/LoginPage";
import RecuperarPasswordPage from "./components/Recuperar/RecuperarPasswordPage";
import WelcomePage from "./components/Welcome/WelcomePage";
import WelcomeActionsPage from "./components/Welcome/WelcomeActionsPage";
import InviteUserPage from "./components/InviteUser/InviteUserPage";
import SetPasswordPage from "./components/SetPassword/SetPasswordPage";

import "./i18n";

import FracaoEditPage from "./components/fracao/FracaoEditPage";

import AtribuirRolePage from "./components/roles/AtribuirRolePage";

// Layout principal
import MainLayout from "./components/layout/MainLayout";

import RolePage from "./components/roles/RolePage";

import PermissaoPage from "./components/permissoes/PermissaoPage";

// Páginas
import Dashboard from "./components/Dashboard/Dashboard";
import PerfilPage from "./components/Perfil/PerfilPage";

// Pagamentos
import PagamentoPage from "./components/pagamentos/PagamentoPage";
import PagamentoFormPage from "./components/pagamentos/PagamentoFormPage";
import PagamentoDetalhe from "./components/pagamentos/PagamentoDetalhe";
import HistoricoPagamento from "./components/pagamentos/HistoricoPagamento";
import PagamentoEliminado from "./components/pagamentos/PagamentoEliminado"; // 👈 NOVO

// Outros módulos

//ContaCorrente
import ContaCorrentePage from "./components/contacorrente/ContaCorrentePage";

// Recibos
import ReciboPage from "./components/recibos/ReciboPage";
import ReciboDetalhe from "./components/recibos/ReciboDetalhe";
import ReciboForm from "./components/recibos/ReciboForm"; 

import EnviarMensagem from "./components/mensagens/EnviarMensagem";
import EdificioDetalhes from "./components/edificios/EdificioDetalhes";

import EventosPage from "./components/eventos/EventosPage";
import ServicosExtrasPage from "./components/servicos/ServicosExtrasPage";
import ServicosAgendadosPage from "./components/servicos/ServicosAgendadosPage";
import FracoesPage from "./components/fracao/FracoesPage";
import EdificioPage from "./components/edificios/EdificioPage";
import ProprietarioPage from "./components/proprietarios/ProprietarioPage";
import InquilinoPage from "./components/inquilinos/InquilinoPage";
import CondominioPage from "./components/condominios/CondominioPage";
import UsersPage from "./components/users/UsersPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas sem layout (login, convites, etc.) */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/recuperar-senha" element={<RecuperarPasswordPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/welcome-actions" element={<WelcomeActionsPage />} />
        <Route path="/invite-user" element={<InviteUserPage />} />
        <Route path="/set-password" element={<SetPasswordPage />} />
        <Route path="/recibos/novo" element={<ReciboForm />} />
        <Route path="/recibos/:id/editar" element={<ReciboForm />} />
        <Route path="/conta-corrente" element={<ContaCorrentePage />} />
        <Route path="/edificios/:id" element={<EdificioDetalhes />} />
        <Route path="/fracoes/editar/:id" element={<FracaoEditPage />} />
        <Route path="/mensagens/enviar" element={<EnviarMensagem />} />

        {/* Rotas com Sidebar (MainLayout) */}
        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />
        <Route
          path="/perfil"
          element={
            <MainLayout>
              <PerfilPage />
            </MainLayout>
          }
        />

        {/* 📌 Pagamentos */}
        <Route
          path="/pagamentos"
          element={
            <MainLayout>
              <PagamentoPage />
            </MainLayout>
          }
        />
        <Route
          path="/pagamentos/novo"
          element={
            <MainLayout>
              <PagamentoFormPage />
            </MainLayout>
          }
        />
        <Route
          path="/pagamentos/:id/editar"
          element={
            <MainLayout>
              <PagamentoFormPage />
            </MainLayout>
          }
        />
        <Route
          path="/pagamentos/:id/detalhe"
          element={
            <MainLayout>
              <PagamentoDetalhe />
            </MainLayout>
          }
        />
        <Route
          path="/pagamentos/:id/historico"
          element={
            <MainLayout>
              <HistoricoPagamento />
            </MainLayout>
          }
        />
        <Route
          path="/pagamentos/eliminados" // 👈 NOVA ROTA
          element={
            <MainLayout>
              <PagamentoEliminado />
            </MainLayout>
          }
        />

        {/* Outros módulos */}
        <Route
          path="/recibos"
          element={
            <MainLayout>
              <ReciboPage />
            </MainLayout>
          }
        />
        <Route
          path="/recibos/:id/detalhe" // 👈 NOVA ROTA
          element={
            <MainLayout>
              <ReciboDetalhe />
            </MainLayout>
          }
        />
        <Route
          path="/eventos"
          element={
            <MainLayout>
              <EventosPage />
            </MainLayout>
          }
        />
        <Route
          path="/servicos-extras"
          element={
            <MainLayout>
              <ServicosExtrasPage />
            </MainLayout>
          }
        />
        <Route
          path="/servicos-agendados"
          element={
            <MainLayout>
              <ServicosAgendadosPage />
            </MainLayout>
          }
        />
        <Route
          path="/fracoes"
          element={
            <MainLayout>
              <FracoesPage />
            </MainLayout>
          }
        />
        <Route
          path="/edificios"
          element={
            <MainLayout>
              <EdificioPage />
            </MainLayout>
          }
        />
        <Route
          path="/proprietarios"
          element={
            <MainLayout>
              <ProprietarioPage />
            </MainLayout>
          }
        />
        <Route
          path="/inquilinos"
          element={
            <MainLayout>
              <InquilinoPage />
            </MainLayout>
          }
        />
        <Route
          path="/condominios"
          element={
            <MainLayout>
              <CondominioPage />
            </MainLayout>
          }
        />
        <Route
          path="/users"
          element={
            <MainLayout>
              <UsersPage />
            </MainLayout>
          }
        />
<Route
  path="/roles"
  element={
    <MainLayout>
      <RolePage />
    </MainLayout>
  }
/>
<Route
  path="/permissoes"
  element={
    <MainLayout>
      <PermissaoPage />
    </MainLayout>
  }
/>
<Route
  path="/atribuir-role"
  element={
    <MainLayout>
      <AtribuirRolePage />
    </MainLayout>
  }
/>
      </Routes>
    </Router>
  );
}

export default App;