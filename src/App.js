// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 🔔 TOAST NOTIFICATIONS
import { Toaster } from "sonner";

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
import ServicosPage from "./components/servicos/ServicosPage";
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
import InquilinoForm from "./components/inquilinos/InquilinoForm";
import ServicosAgendadosPage from "./components/servicos/ServicosAgendadosPage";

import AcessoNegado from "./components/AcessoNegado";
import ProtectedRoute from "./components/permissoes/ProtectedRoute";

function App() {
  return (
    <Router>
      {/* 🔥 TOAST GLOBAL (OBRIGATÓRIO PARA FUNCIONAR OS ALERTS) */}
      <Toaster richColors position="top-right" />

      <Routes>
        {/* 🔓 ROTAS PÚBLICAS */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/acesso-negado" element={<AcessoNegado />} />
        <Route
          path="/recuperar-senha"
          element={<RecuperarPasswordPage />}
        />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route
          path="/welcome-actions"
          element={<WelcomeActionsPage />}
        />
        <Route
          path="/invite-user"
          element={<InviteUserPage />}
        />
        <Route
          path="/set-password"
          element={<SetPasswordPage />}
        />

        {/* 🔐 TODAS AS ROTAS PROTEGIDAS */}
        <Route
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/perfil"
            element={<PerfilPage />}
          />

          {/* PAGAMENTOS */}

          <Route
            path="/pagamentos"
            element={
              <ProtectedRoute permissao="visualizar_pagamentos">
                <PagamentoPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pagamentos/novo"
            element={
              <ProtectedRoute permissao="criar_pagamentos">
                <PagamentoFormPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pagamentos/:id/editar"
            element={
              <ProtectedRoute permissao="editar_pagamentos">
                <PagamentoFormPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pagamentos/:id/detalhe"
            element={
              <ProtectedRoute permissao="visualizar_pagamentos">
                <PagamentoDetalhe />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pagamentos/:id/historico"
            element={
              <ProtectedRoute permissao="visualizar_pagamentos">
                <HistoricoPagamento />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pagamentos/eliminados"
            element={
              <ProtectedRoute permissao="visualizar_pagamentos">
                <PagamentoEliminado />
              </ProtectedRoute>
            }
          />

          {/* RECIBOS */}

          <Route
            path="/recibos"
            element={
              <ProtectedRoute permissao="visualizar_recibos">
                <ReciboPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recibos/novo"
            element={
              <ProtectedRoute permissao="criar_recibos">
                <ReciboForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recibos/:id/editar"
            element={
              <ProtectedRoute permissao="editar_recibos">
                <ReciboForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recibos/:id/detalhe"
            element={
              <ProtectedRoute permissao="visualizar_recibos">
                <ReciboDetalhe />
              </ProtectedRoute>
            }
          />

          {/* CONTA CORRENTE */}

          <Route
            path="/conta-corrente"
            element={
              <ProtectedRoute permissao="visualizar_conta_corrente">
                <ContaCorrentePage />
              </ProtectedRoute>
            }
          />

          {/* MENSAGENS */}

          <Route
            path="/mensagens/enviar"
            element={
              <ProtectedRoute permissao="criar_mensagens">
                <EnviarMensagem />
              </ProtectedRoute>
            }
          />

          {/*EDIFÍCIOS*/}

          <Route
            path="/edificios"
            element={
              <ProtectedRoute permissao="visualizar_edificios">
                <EdificioPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edificios/:id"
            element={
              <ProtectedRoute permissao="visualizar_edificios">
                <EdificioDetalhes />
              </ProtectedRoute>
            }
          />

          {/*FRAÇÕES*/}

          <Route
            path="/fracoes"
            element={
              <ProtectedRoute permissao="visualizar_fracoes">
                <FracoesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/fracoes/editar/:id"
            element={
              <ProtectedRoute permissao="editar_fracoes">
                <FracaoEditPage />
              </ProtectedRoute>
            }
          />

          {/*EVENTOS*/}

          <Route
            path="/eventos"
            element={
              <ProtectedRoute permissao="visualizar_eventos">
                <EventosPage />
              </ProtectedRoute>
            }
          />

          {/*SERVIÇOS EXTRAS*/}

          <Route
            path="/servicos-extras"
            element={
              <ProtectedRoute permissao="visualizar_servicos_extras">
                <ServicosPage />
              </ProtectedRoute>
            }
          />

          {/*SERVIÇOS AGENDADOS*/}

          <Route
            path="/servicos-agendados"
            element={
              <ProtectedRoute permissao="visualizar_servicos_agendados">
                <ServicosAgendadosPage />
              </ProtectedRoute>
            }
          />

          {/*PROPRIETÁRIOS*/}

          <Route
            path="/proprietarios"
            element={
              <ProtectedRoute permissao="visualizar_proprietarios">
                <ProprietarioPage />
              </ProtectedRoute>
            }
          />

          {/*INQUILINOS*/}

          <Route
            path="/inquilinos"
            element={
              <ProtectedRoute permissao="visualizar_inquilinos">
                <InquilinoPage />
              </ProtectedRoute>
            }
          />

          {/*CONDOMÍNIOS*/}

          <Route
            path="/condominios"
            element={
              <ProtectedRoute permissao="visualizar_condominios">
                <CondominioPage />
              </ProtectedRoute>
            }
          />

          {/*UTILIZADORES*/}

          <Route
            path="/users"
            element={
              <ProtectedRoute permissao="visualizar_utilizadores">
                <UsersPage />
              </ProtectedRoute>
            }
          />

          {/*FUNÇÕES*/}

          <Route
            path="/roles"
            element={
              <ProtectedRoute permissao="visualizar_roles">
                <RolePage />
              </ProtectedRoute>
            }
          />

          {/*PERMISSÕES*/}

          <Route
            path="/permissoes"
            element={
              <ProtectedRoute permissao="visualizar_permissoes">
                <PermissaoPage />
              </ProtectedRoute>
            }
          />

          {/*ATRIBUIR PAPÉIS */}

          <Route
            path="/atribuir-role"
            element={
              <ProtectedRoute permissao="visualizar_atribuir_papeis">
                <AtribuirRolePage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
