// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Autenticação (rotas públicas)
import LoginPage from "./components/auth/LoginPage";
import RecuperarPasswordPage from "./components/Recuperar/RecuperarPasswordPage";
import WelcomePage from "./components/Welcome/WelcomePage";
import WelcomeActionsPage from "./components/Welcome/WelcomeActionsPage";
import InviteUserPage from "./components/InviteUser/InviteUserPage";
import SetPasswordPage from "./components/SetPassword/SetPasswordPage";

import "./i18n";

// Proteção
import PrivateRoute from "./components/auth/PrivateRoute";

// Layout
import MainLayout from "./components/layout/MainLayout";

// Páginas
import Dashboard from "./components/Dashboard/Dashboard";
import PerfilPage from "./components/Perfil/PerfilPage";

// Pagamentos
import PagamentoPage from "./components/pagamentos/PagamentoPage";
import PagamentoFormPage from "./components/pagamentos/PagamentoFormPage";
import PagamentoDetalhe from "./components/pagamentos/PagamentoDetalhe";
import HistoricoPagamento from "./components/pagamentos/HistoricoPagamento";
import PagamentoEliminado from "./components/pagamentos/PagamentoEliminado";

// Outros módulos
import ContaCorrentePage from "./components/contacorrente/ContaCorrentePage";
import ReciboPage from "./components/recibos/ReciboPage";
import ReciboDetalhe from "./components/recibos/ReciboDetalhe";
import ReciboForm from "./components/recibos/ReciboForm";
import EnviarMensagem from "./components/mensagens/EnviarMensagem";
import EdificioDetalhes from "./components/edificios/EdificioDetalhes";
import EventosPage from "./components/eventos/EventosPage";
import ServicosExtrasPage from "./components/servicos/ServicosExtrasPage";
import ServicosAgendadosPage from "./components/servicos/ServicosAgendadosPage";
import FracoesPage from "./components/fracao/FracoesPage";
import FracaoEditPage from "./components/fracao/FracaoEditPage";
import EdificioPage from "./components/edificios/EdificioPage";
import ProprietarioPage from "./components/proprietarios/ProprietarioPage";
import InquilinoPage from "./components/inquilinos/InquilinoPage";
import CondominioPage from "./components/condominios/CondominioPage";
import UsersPage from "./components/users/UsersPage";
import RolePage from "./components/roles/RolePage";
import PermissaoPage from "./components/permissoes/PermissaoPage";
import AtribuirRolePage from "./components/roles/AtribuirRolePage";

function App() {
  return (
    <Router>
      <Routes>
        {/* 🔓 ROTAS PÚBLICAS */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/recuperar-senha" element={<RecuperarPasswordPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/welcome-actions" element={<WelcomeActionsPage />} />
        <Route path="/invite-user" element={<InviteUserPage />} />
        <Route path="/set-password" element={<SetPasswordPage />} />

        {/* 🔐 TODAS AS ROTAS PROTEGIDAS */}
        <Route
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/perfil" element={<PerfilPage />} />

          {/* Pagamentos */}
          <Route path="/pagamentos" element={<PagamentoPage />} />
          <Route path="/pagamentos/novo" element={<PagamentoFormPage />} />
          <Route path="/pagamentos/:id/editar" element={<PagamentoFormPage />} />
          <Route path="/pagamentos/:id/detalhe" element={<PagamentoDetalhe />} />
          <Route path="/pagamentos/:id/historico" element={<HistoricoPagamento />} />
          <Route path="/pagamentos/eliminados" element={<PagamentoEliminado />} />

          {/* Outros */}
          <Route path="/recibos" element={<ReciboPage />} />
          <Route path="/recibos/novo" element={<ReciboForm />} />
          <Route path="/recibos/:id/editar" element={<ReciboForm />} />
          <Route path="/recibos/:id/detalhe" element={<ReciboDetalhe />} />

          <Route path="/conta-corrente" element={<ContaCorrentePage />} />
          <Route path="/mensagens/enviar" element={<EnviarMensagem />} />
          <Route path="/edificios" element={<EdificioPage />} />
          <Route path="/edificios/:id" element={<EdificioDetalhes />} />
          <Route path="/fracoes" element={<FracoesPage />} />
          <Route path="/fracoes/editar/:id" element={<FracaoEditPage />} />

          <Route path="/eventos" element={<EventosPage />} />
          <Route path="/servicos-extras" element={<ServicosExtrasPage />} />
          <Route path="/servicos-agendados" element={<ServicosAgendadosPage />} />

          <Route path="/proprietarios" element={<ProprietarioPage />} />
          <Route path="/inquilinos" element={<InquilinoPage />} />
          <Route path="/condominios" element={<CondominioPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/roles" element={<RolePage />} />
          <Route path="/permissoes" element={<PermissaoPage />} />
          <Route path="/atribuir-role" element={<AtribuirRolePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
