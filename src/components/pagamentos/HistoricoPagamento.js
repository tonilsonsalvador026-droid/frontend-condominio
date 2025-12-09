// src/components/pagamentos/HistoricoPagamento.js
import React, { useEffect, useState } from "react";
import api from "../../api";

function HistoricoPagamento({ pagamentoId }) {
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    if (pagamentoId) {
      api
        .get(`/pagamentos/${pagamentoId}/historico`)
        .then((res) => setHistorico(res.data))
        .catch((err) =>
          console.error("Erro ao carregar histórico de pagamento:", err)
        );
    }
  }, [pagamentoId]);

  if (!historico.length) {
    return <p>Nenhum documento encontrado para este pagamento.</p>;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Histórico de Documentos</h3>
      <ul className="space-y-2">
        {historico.map((doc) => (
          <li
            key={doc.id}
            className="flex justify-between items-center border p-3 rounded-lg"
          >
            <span>{doc.nome}</span>
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Visualizar
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HistoricoPagamento;