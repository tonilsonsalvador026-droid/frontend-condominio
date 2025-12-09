// src/components/recibos/ReciboDetalhe.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import api from "../../api";
import { Download } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency"; // ✅ Importação adicionada

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

  if (loading) return <p className="text-gray-500">Carregando detalhe...</p>;
  if (!recibo) return <p className="text-red-500">Recibo não encontrado.</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        Detalhe do Recibo #{recibo.numero}
      </h2>

      {/* Dados principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Número</p>
          <p className="font-medium">{recibo.numero}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Data</p>
          <p className="font-medium">
            {recibo.data ? dayjs(recibo.data).format("DD/MM/YYYY") : "-"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Valor</p>
          <p className="font-medium">
            {recibo.pagamento
              ? formatCurrency(recibo.pagamento.valor) // ✅ Uso do formatCurrency
              : "-"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Proprietário</p>
          <p className="font-medium">
            {recibo.pagamento?.proprietario?.nome || "-"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Fração</p>
          <p className="font-medium">
            {recibo.pagamento?.fracao?.numero || "-"}
          </p>
        </div>
      </div>

      {/* Botões */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => navigate("/recibos")}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Voltar à lista
        </button>
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Download size={18} /> Baixar PDF
        </button>
      </div>
    </div>
  );
};

export default ReciboDetalhe;