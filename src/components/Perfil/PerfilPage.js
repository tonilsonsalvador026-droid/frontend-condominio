// src/components/Perfil/PerfilPage.js

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Save,
  User,
  Mail,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Hash,
  CalendarDays,
  ShieldCheck,
  Camera,
  RefreshCw,
  Phone,
  FileText,
  BadgeCheck,
} from "lucide-react";
import { toast } from "sonner";
import api from "../../api";

export default function PerfilPage() {
  const [activeTab, setActiveTab] = useState("principal");

  const [perfil, setPerfil] = useState({
    id: "",
    nome: "",
    email: "",
    avatar: "",
    telefone: "",
    nif: "",
    dataNascimento: "",
    dataDocumento: "",
    role: "",
    roleRel: null,
    criadoEm: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Referência para o input oculto de ficheiro
  const fileInputRef = useRef(null);

  // --------------------------------------------------
  // OBTER INICIAIS DO UTILIZADOR
  // --------------------------------------------------
  const iniciais = useMemo(() => {
    if (!perfil.nome) return "U";

    return perfil.nome
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((nome) => nome.charAt(0).toUpperCase())
      .join("");
  }, [perfil.nome]);

  // --------------------------------------------------
  // FORMATAR DATA
  // --------------------------------------------------
  const formatarData = (data) => {
    if (!data) return "—";

    try {
      return new Date(data).toLocaleDateString("pt-PT", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };

  // Converte data ISO para YYYY-MM-DD para preencher o <input type="date">
  const formatarParaInputDate = (data) => {
    if (!data) return "";
    try {
      return new Date(data).toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  // --------------------------------------------------
  // CARREGAR PERFIL
  // --------------------------------------------------
  const carregarPerfil = async () => {
    try {
      setLoading(true);

      const response = await api.get("/perfil");
      const data = response.data;

      setPerfil({
        id: data.id || "",
        nome: data.nome || "",
        email: data.email || "",
        avatar: data.avatar || "",
        telefone: data.telefone || "",
        nif: data.nif || "",
        dataNascimento: formatarParaInputDate(data.dataNascimento),
        dataDocumento: formatarParaInputDate(data.dataDocumento),
        role: data.role || "",
        roleRel: data.roleRel || null,
        criadoEm: data.criadoEm || "",
      });
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);

      toast.error(
        error.response?.data?.error ||
          "Não foi possível carregar o seu perfil."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // CARREGAR AO ABRIR A PÁGINA
  // --------------------------------------------------
  useEffect(() => {
    carregarPerfil();
  }, []);

  // --------------------------------------------------
  // ALTERAR CAMPOS
  // --------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setPerfil((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // UPLOAD DA FOTO DE PERFIL
  // --------------------------------------------------
 const handleAvatarChange = async (e) => {
  const file = e.target.files?.[0];

  if (!file) return;

  // Validar tipo de ficheiro
  if (!file.type.startsWith("image/")) {
    toast.error("Selecione apenas um ficheiro de imagem.");
    e.target.value = "";
    return;
  }

  // Validar tamanho máximo de 5 MB
  if (file.size > 5 * 1024 * 1024) {
    toast.error("A imagem não pode ultrapassar 5 MB.");
    e.target.value = "";
    return;
  }

  try {
    setUploadingAvatar(true);

    const formData = new FormData();
    formData.append("avatar", file);

    // Enviar imagem para o backend
    // O Axios irá definir automaticamente o Content-Type
    // correto com o boundary do multipart/form-data.
    const response = await api.post(
      "/perfil/avatar",
      formData
    );

    console.log("Resposta do upload:", response.data);

    // O backend devolve:
    // response.data.user.avatar
    const novoAvatar = response.data?.user?.avatar;

    if (!novoAvatar) {
      throw new Error(
        "O servidor não devolveu o endereço da fotografia."
      );
    }

    // Atualizar o perfil imediatamente no frontend
    setPerfil((prev) => ({
      ...prev,
      avatar: novoAvatar,
    }));

    toast.success(
      "Fotografia de perfil atualizada com sucesso!"
    );

  } catch (error) {
    console.error(
      "Erro ao enviar fotografia:",
      error
    );

    console.error(
      "Resposta do servidor:",
      error.response?.data
    );

    toast.error(
      error.response?.data?.error ||
      "Não foi possível atualizar a fotografia."
    );

  } finally {
    setUploadingAvatar(false);

    // Permitir selecionar novamente a mesma imagem
    e.target.value = "";
  }
};

  // --------------------------------------------------
  // GUARDAR ALTERAÇÕES
  // --------------------------------------------------
  const handleSave = async () => {
    if (!perfil.nome.trim()) {
      toast.error("O nome é obrigatório.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        nome: perfil.nome.trim(),
        email: perfil.email,
        telefone: perfil.telefone.trim(),
        nif: perfil.nif.trim(),
        dataNascimento: perfil.dataNascimento || null,
        dataDocumento: perfil.dataDocumento || null,
      };

      const response = await api.put("/perfil", payload);
      const data = response.data;

      setPerfil((prev) => ({
        ...prev,
        id: data.id || prev.id,
        nome: data.nome || prev.nome,
        email: data.email || prev.email,
        avatar: data.avatar || prev.avatar,
        telefone: data.telefone || prev.telefone,
        nif: data.nif || prev.nif,
        dataNascimento: formatarParaInputDate(data.dataNascimento),
        dataDocumento: formatarParaInputDate(data.dataDocumento),
      }));

      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);

      toast.error(
        error.response?.data?.error ||
          "Não foi possível atualizar o perfil."
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center">
            <Loader2 className="h-7 w-7 text-blue-600 animate-spin" />
          </div>

          <div className="text-center">
            <p className="text-sm font-semibold text-gray-800">
              A carregar o seu perfil...
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Aguarde um momento.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* CABEÇALHO */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                  <User className="h-6 w-6 text-white" />
                </div>

                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Meu Perfil
                  </h1>

                  <p className="text-sm text-gray-500 mt-1">
                    Gerencie as suas informações pessoais e dados da sua conta.
                  </p>
                </div>
              </div>
            </div>

            {/* STATUS */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <div className="h-9 w-9 rounded-xl bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Conta ativa
                </p>

                <p className="text-xs text-gray-500">
                  {perfil.roleRel?.nome || perfil.role || "Utilizador Autenticado"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CARTÃO PRINCIPAL */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">

          {/* BANNER */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 px-6 py-8 md:px-10 md:py-10">

            <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10" />
            <div className="absolute -right-10 -bottom-32 h-72 w-72 rounded-full bg-white/5" />

            <div className="relative flex flex-col md:flex-row md:items-center gap-6">

              {/* AVATAR + BOTÃO DE UPLOAD */}
              <div className="relative">
                <div className="h-24 w-24 md:h-28 md:w-28 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-2xl overflow-hidden relative">
                  {uploadingAvatar ? (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm z-10">
                      <Loader2 className="h-8 w-8 text-white animate-spin" />
                    </div>
                  ) : null}

                  {perfil.avatar ? (
                    <img
                      src={perfil.avatar}
                      alt={perfil.nome || "Avatar"}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="text-3xl md:text-4xl font-bold text-white">
                      {iniciais}
                    </span>
                  )}
                </div>

                {/* Input de Ficheiro Oculto */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleAvatarChange}
                />

                {/* Botão com Ícone da Câmara */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  title="Alterar fotografia de perfil"
                  className="absolute -right-2 -bottom-2 h-9 w-9 rounded-xl bg-white text-blue-600 flex items-center justify-center shadow-lg hover:bg-gray-100 transition disabled:opacity-50 cursor-pointer z-20"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              {/* INFORMAÇÕES */}
              <div className="text-white">
                <p className="text-sm text-blue-100 mb-1">
                  Perfil do utilizador
                </p>

                <h2 className="text-2xl md:text-3xl font-bold">
                  {perfil.nome || "Utilizador"}
                </h2>

                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <span className="flex items-center gap-2 text-sm text-blue-100">
                    <Mail className="h-4 w-4" />
                    {perfil.email || "Sem e-mail"}
                  </span>

                  <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-medium text-white">
                    {perfil.roleRel?.nome || perfil.role || "Utilizador"}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* TABS */}
          <div className="border-b border-gray-200 px-6 md:px-10">
            <nav className="flex gap-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab("principal")}
                className={`flex items-center gap-2 py-5 text-sm font-semibold border-b-2 whitespace-nowrap transition ${
                  activeTab === "principal"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                <User className="h-4 w-4" />
                Informações principais
              </button>

              <button
                onClick={() => setActiveTab("acessos")}
                className={`flex items-center gap-2 py-5 text-sm font-semibold border-b-2 whitespace-nowrap transition ${
                  activeTab === "acessos"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                Acessos e Permissões
              </button>

              <button
                onClick={() => setActiveTab("contactos")}
                className={`flex items-center gap-2 py-5 text-sm font-semibold border-b-2 whitespace-nowrap transition ${
                  activeTab === "contactos"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                <Phone className="h-4 w-4" />
                Contactos e Documentos
              </button>
            </nav>
          </div>

          {/* CONTEÚDO */}
          <div className="p-6 md:p-10">

            {/* TAB: PRINCIPAL */}
            {activeTab === "principal" && (
              <div>
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900">
                    Informações principais
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Atualize os dados básicos associados à sua conta.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* ID */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Código do utilizador
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={perfil.id || ""}
                        readOnly
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl bg-gray-50 text-gray-600 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* NOME */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nome completo
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="nome"
                        value={perfil.nome}
                        onChange={handleChange}
                        placeholder="Digite o seu nome"
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                      />
                    </div>
                  </div>

                  {/* EMAIL (READ ONLY) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      E-mail (Autenticação)
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={perfil.email}
                        readOnly
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl bg-gray-50 text-gray-600 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Por motivos de segurança, a alteração de e-mail requer validação direta.
                    </p>
                  </div>

                </div>

                {/* INFO DA CONTA */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center">
                        <CalendarDays className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">Membro desde</p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          {formatarData(perfil.criadoEm)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-green-50 border border-green-100">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-green-700">Estado da conta</p>
                        <p className="text-sm font-semibold text-green-800 mt-1">Conta ativa</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BOTOES */}
                <div className="flex flex-col sm:flex-row sm:justify-end gap-3 mt-10 pt-6 border-t border-gray-100">
                  <button
                    onClick={carregarPerfil}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-gray-200 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Repor dados
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 px-7 py-3 rounded-2xl bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        A guardar...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        Guardar alterações
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* TAB: ACESSOS E PERMISSÕES */}
            {activeTab === "acessos" && (
              <div>
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900">
                    Segurança, Cargo e Permissões
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Consulte o seu nível de acesso e detalhes do seu perfil de utilizador.
                  </p>
                </div>

                <div className="space-y-5">
                  {/* ROLE */}
                  <div className="p-6 rounded-2xl border border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="h-11 w-11 rounded-xl bg-white border border-gray-200 flex items-center justify-center">
                        <BadgeCheck className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">Cargo / Função</p>
                        <p className="text-sm font-bold text-gray-900 mt-1">
                          {perfil.roleRel?.nome || perfil.role || "Utilizador Padrão"}
                        </p>
                      </div>
                    </div>

                    {/* LISTA DE PERMISSÕES */}
                    {perfil.roleRel?.permissoes?.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs font-semibold text-gray-600 mb-2">Permissões associadas:</p>
                        <div className="flex flex-wrap gap-2">
                          {perfil.roleRel.permissoes.map((item) => (
                            <span
                              key={item.permissao.id}
                              className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-xs text-gray-700 font-medium"
                            >
                              {item.permissao.descricao || item.permissao.chave}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* PALAVRA-PASSE */}
                  <div className="p-6 rounded-2xl border border-blue-100 bg-blue-50">
                    <div className="flex items-start gap-4">
                      <div className="h-11 w-11 rounded-xl bg-white flex items-center justify-center">
                        <ShieldCheck className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-blue-900">Palavra-passe</p>
                        <p className="text-sm text-blue-700 mt-1">
                          A sua palavra-passe está encriptada na base de dados por razões de segurança.
                        </p>

                        <button
                          type="button"
                          className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
                          onClick={() =>
                            toast.info(
                              "A alteração de palavra-passe será disponibilizada na próxima etapa."
                            )
                          }
                        >
                          Alterar palavra-passe
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: CONTACTOS E DOCUMENTOS */}
            {activeTab === "contactos" && (
              <div>
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900">
                    Contactos e Identificação
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Preencha os seus dados de contacto e identificação pessoal.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* TELEFONE */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Telefone / Telemóvel
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="telefone"
                        value={perfil.telefone}
                        onChange={handleChange}
                        placeholder="+244 9XX XXX XXX"
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                      />
                    </div>
                  </div>

                  {/* NIF */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      NIF / Nº de Identificação
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="nif"
                        value={perfil.nif}
                        onChange={handleChange}
                        placeholder="NIF de contribuinte"
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                      />
                    </div>
                  </div>

                  {/* DATA NASCIMENTO */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Data de Nascimento
                    </label>
                    <div className="relative">
                      <CalendarDays className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                      <input
                        type="date"
                        name="dataNascimento"
                        value={perfil.dataNascimento}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                      />
                    </div>
                  </div>

                  {/* DATA DOCUMENTO */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Validade do Documento
                    </label>
                    <div className="relative">
                      <CalendarDays className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                      <input
                        type="date"
                        name="dataDocumento"
                        value={perfil.dataDocumento}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                      />
                    </div>
                  </div>

                </div>

                {/* BOTAO GUARDAR CONTACTOS */}
                <div className="flex justify-end gap-3 mt-10 pt-6 border-t border-gray-100">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 px-7 py-3 rounded-2xl bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-60 transition"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        A guardar...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        Guardar alterações
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
