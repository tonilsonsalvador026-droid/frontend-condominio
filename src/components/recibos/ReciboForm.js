// src/components/recibos/ReciboForm.js
import React, { useState, useEffect } from "react";
import api from "../../api";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency"; // ✅ Importação adicionada

const ReciboForm = ({ onSuccess }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    numero: "",
    pagamentoId: "",
  });

  const [pagamentos, setPagamentos] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Buscar lista de pagamentos e aplicar formatCurrency nos valores
  useEffect(() => {
    const fetchPagamentos = async () => {
      try {
        const res = await api.get("/pagamentos");
        const dataArray = Array.isArray(res.data.data)
          ? res.data.data
          : Array.isArray(res.data)
          ? res.data
          : [];

        // 🔹 Adiciona o campo valorFormatado usando a função utilitária
        const pagamentosComValor = dataArray.map((p) => ({
          ...p,
          valorFormatado: formatCurrency(p.valor),
        }));

        setPagamentos(pagamentosComValor);
      } catch (err) {
        console.error(err);
        toast.error("Erro ao carregar pagamentos.");
      }
    };

    fetchPagamentos();

    if (id) {
      // Edição do recibo
      api
        .get(`/recibos/${id}`)
        .then((res) => {
          const r = res.data;
          setFormData({
            numero: r.numero,
            pagamentoId: r.pagamentoId,
          });
        })
        .catch((err) => {
          console.error(err);
          toast.error("Erro ao carregar recibo.");
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        numero: formData.numero,
        pagamentoId: parseInt(formData.pagamentoId),
      };

      if (id) {
        await api.put(`/recibos/${id}`, payload);
        toast.success("✅ Recibo atualizado com sucesso!");
      } else {
        await api.post("/recibos", payload);
        toast.success("✅ Recibo criado com sucesso!");
      }

      if (onSuccess) onSuccess();
      navigate("/recibos");
    } catch (err) {
      console.error(err);
      toast.error("❌ Erro ao salvar recibo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      id="printArea"
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-md border mb-6"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {id ? "Editar Recibo" : "Novo Recibo"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Número */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Número
          </label>
          <input
            type="text"
            name="numero"
            value={formData.numero}
            onChange={handleChange}
            required
            className="border rounded-lg p-2 w-full text-gray-700 focus:ring focus:ring-blue-200"
            placeholder="Ex: 001"
          />
        </div>

        {/* Pagamento */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Pagamento
          </label>
          <select
            name="pagamentoId"
            value={formData.pagamentoId}
            onChange={handleChange}
            required
            className="border rounded-lg p-2 w-full text-gray-700 focus:ring focus:ring-blue-200"
          >
            <option value="">Selecione um pagamento</option>
            {pagamentos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.proprietario?.nome || "Sem proprietário"} —{" "}
                {p.valorFormatado} ({p.data ? new Date(p.data).toLocaleDateString() : "-"})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5">
        <button
          type="submit"
          disabled={loading}
          className={`px-5 py-2 rounded-lg transition text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
};

export default ReciboForm;