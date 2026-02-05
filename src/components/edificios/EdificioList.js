// src/components/edificios/EdificioList.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  FileText,
  FileSpreadsheet,
  FileDown,
  Printer,
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const EdificioList = () => {
  const [edificios, setEdificios] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchEdificios = async () => {
    try {
      const res = await api.get("/edificios");
      setEdificios(res.data);
    } catch (err) {
      toast.error("Erro ao carregar edifícios");
    }
  };

  useEffect(() => {
    fetchEdificios();
  }, []);

  const filtered = edificios.filter((e) =>
    e.nome.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja eliminar este edifício?")) return;
    try {
      await api.delete(`/edificios/${id}`);
      toast.success("Edifício eliminado com sucesso");
      fetchEdificios();
    } catch {
      toast.error("Erro ao eliminar edifício");
    }
  };

  // ===== EXPORTAÇÕES (mesmo padrão das outras listas)
  const exportExcel = () => {
    const data = filtered.map((e) => ({
      ID: e.id,
      Nome: e.nome,
      Endereço: e.endereco,
      Andares: e.numeroAndares,
      Apartamentos: e.numeroApartamentos,
      Condomínio: e.condominio?.nome || "-",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Edifícios");
    XLSX.writeFile(wb, "edificios.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["ID", "Nome", "Endereço", "Andares", "Apartamentos", "Condomínio"]],
      body: filtered.map((e) => [
        e.id,
        e.nome,
        e.endereco,
        e.numeroAndares,
        e.numeroApartamentos,
        e.condominio?.nome || "-",
      ]),
    });
    doc.save("edificios.pdf");
  };

  return (
    <div className="bg-white rounded-2xl shadow border p-6">
      {/* HEADER PADRÃO */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Gestão de Edifícios
        </h2>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate("/edificios/novo")}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus size={18} /> Novo Edifício
          </button>

          <button
            onClick={exportExcel}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <FileSpreadsheet size={18} /> Excel
          </button>

          <button
            onClick={exportPDF}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            <FileDown size={18} /> PDF
          </button>
        </div>
      </div>

      {/* PESQUISA */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Pesquisar edifício por nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg p-2 w-full md:w-80"
        />
      </div>

      {/* TABELA PROFISSIONAL */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3 text-left">Nome</th>
              <th className="p-3 text-left">Endereço</th>
              <th className="p-3 text-center">Andares</th>
              <th className="p-3 text-center">Apartamentos</th>
              <th className="p-3 text-left">Condomínio</th>
              <th className="p-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{e.nome}</td>
                <td className="p-3">{e.endereco}</td>
                <td className="p-3 text-center">{e.numeroAndares}</td>
                <td className="p-3 text-center">{e.numeroApartamentos}</td>
                <td className="p-3">{e.condominio?.nome || "-"}</td>
                <td className="p-3">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => navigate(`/edificios/${e.id}`)}
                      className="text-green-600 hover:text-green-800"
                      title="Detalhes"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      onClick={() => navigate(`/edificios/editar/${e.id}`)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Editar"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(e.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  Nenhum edifício encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EdificioList;
