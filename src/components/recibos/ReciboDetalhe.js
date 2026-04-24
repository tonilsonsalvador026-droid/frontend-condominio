// src/components/recibos/ReciboDetalhe.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import api from "../../api";
import { Download, FileText, Calendar, User, Home, DollarSign, ChevronLeft } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

const ReciboDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recibo, setRecibo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecibo = async () => {
      try {
        const res = await api.get(`/recibos/${id}`);
        setRecibo(res.data);
      } catch (error) {
        console.error("Erro ao carregar detalhe do recibo:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecibo();
  }, [id]);

  const handleDownloadPDF = async () => {
    try {
      const res = await api.get(`/recibos/${id}/pdf`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `recibo_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Erro ao baixar recibo PDF:", err);
      alert("Erro ao baixar PDF do recibo.");
    }
  };

  if (loading)
    return (
      <div className="text-center text-slate-500 mt-10">
        Carregando detalhe...
      </div>
    );

  if (!recibo)
    return (
      <div className="text-center text-red-500 mt-10">
        Recibo não encontrado.
      </div>
    );

  return (
    <div className="space-y-8 w-full">

      {/* HEADER PREMIUM */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/40 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl border border-blue-200/50">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>

            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
                Recibo #{recibo.numero}
              </h1>
              <p className="text-slate-600 font-semibold">
                Detalhes completos do recibo
              </p>
            </div>
          </div>

          {/* BOTÕES HEADER */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/recibos")}
              className="flex items-center gap-2 px-5 py-3 bg-slate-200/70 hover:bg-slate-300 rounded-2xl font-bold transition-all"
            >
              <ChevronLeft size={18} />
              Voltar
            </button>

            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg hover:-translate-y-1 transition-all"
            >
              <Download size={18} />
              PDF
            </button>
          </div>

        </div>
      </div>

      {/* CARDS DE INFORMAÇÃO */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* Número */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-slate-200/40">
          <p className="text-slate-500 text-sm mb-2 flex items-center gap-2">
            <FileText size={16} /> Número
          </p>
          <p className="text-xl font-bold text-slate-900">
            {recibo.numero}
          </p>
        </div>

        {/* Data */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-slate-200/40">
          <p className="text-slate-500 text-sm mb-2 flex items-center gap-2">
            <Calendar size={16} /> Data
          </p>
          <p className="text-xl font-bold text-slate-900">
            {recibo.data
              ? dayjs(recibo.data).format("DD/MM/YYYY")
              : "-"}
          </p>
        </div>

        {/* Valor */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-slate-200/40">
          <p className="text-slate-500 text-sm mb-2 flex items-center gap-2">
            <DollarSign size={16} /> Valor
          </p>
          <p className="text-2xl font-black text-emerald-600">
            {recibo.pagamento
              ? formatCurrency(recibo.pagamento.valor)
              : "-"}
          </p>
        </div>

        {/* Proprietário */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-slate-200/40">
          <p className="text-slate-500 text-sm mb-2 flex items-center gap-2">
            <User size={16} /> Proprietário
          </p>
          <p className="text-lg font-semibold text-slate-900">
            {recibo.pagamento?.proprietario?.nome || "-"}
          </p>
        </div>

        {/* Fração */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-slate-200/40">
          <p className="text-slate-500 text-sm mb-2 flex items-center gap-2">
            <Home size={16} /> Fração
          </p>
          <p className="text-lg font-semibold text-slate-900">
            {recibo.pagamento?.fracao?.numero || "-"}
          </p>
        </div>

      </div>
    </div>
  );
};

export default ReciboDetalhe;
