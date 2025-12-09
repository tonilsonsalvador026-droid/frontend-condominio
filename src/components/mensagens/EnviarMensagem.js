// ✅ src/components/mensagens/EnviarMensagem.js
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api";
import { ArrowLeft, Send, Loader2 } from "lucide-react";

const EnviarMensagem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const edificioId = new URLSearchParams(location.search).get("edificioId");

  const [edificio, setEdificio] = useState(null);
  const [assunto, setAssunto] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [erro, setErro] = useState("");

  // 🔹 Busca o edifício e os moradores
  useEffect(() => {
    const fetchEdificio = async () => {
      try {
        const res = await api.get(`/edificios/${edificioId}`);
        setEdificio(res.data);
      } catch (err) {
        console.error("Erro ao carregar edifício:", err);
        setErro("Falha ao carregar informações do edifício.");
      }
    };
    if (edificioId) fetchEdificio();
  }, [edificioId]);

  // 🔹 Envia a mensagem
  const handleEnviar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setMensagemSucesso("");
    setErro("");

    try {
      const res = await api.post("/mensagens", {
        edificioId,
        assunto,
        conteudo,
      });

      if (res.data && res.data.sucesso) {
        setMensagemSucesso(res.data.mensagem || "Mensagem enviada com sucesso!");
        setAssunto("");
        setConteudo("");
      } else {
        setErro(res.data?.error || "Erro desconhecido ao enviar mensagem.");
      }
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
      setErro(err.response?.data?.error || "Erro ao enviar mensagem. Verifique o servidor.");
    } finally {
      setEnviando(false);
    }
  };

  if (!edificioId) {
    return (
      <div className="p-6 text-red-600">
        <p>Edifício não especificado.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-800 transition"
      >
        <ArrowLeft size={18} /> Voltar
      </button>

      <div className="bg-white shadow-lg rounded-xl p-6 max-w-2xl mx-auto border border-gray-100">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">
          Enviar mensagem para o edifício
        </h2>
        <p className="mb-4 text-gray-600">
          <strong>{edificio?.nome}</strong>{" "}
          ({edificio?.fracoes?.length || 0} frações)
        </p>

        <form onSubmit={handleEnviar} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Assunto
            </label>
            <input
              type="text"
              value={assunto}
              onChange={(e) => setAssunto(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
              required
              placeholder="Ex: Aviso de manutenção, reunião, aviso urgente..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Mensagem
            </label>
            <textarea
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
              rows="6"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none resize-none"
              required
              placeholder="Escreva aqui a mensagem que será enviada para os moradores..."
            ></textarea>
          </div>

          {/* Mensagens de feedback */}
          {erro && (
            <p className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-2 text-sm">
              {erro}
            </p>
          )}
          {mensagemSucesso && (
            <p className="text-green-600 bg-green-50 border border-green-200 rounded-lg p-2 text-sm">
              {mensagemSucesso}
            </p>
          )}

          {/* Botões */}
          <div className="flex gap-2 justify-end mt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={enviando}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {enviando ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Enviando...
                </>
              ) : (
                <>
                  <Send size={16} /> Enviar Mensagem
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnviarMensagem;