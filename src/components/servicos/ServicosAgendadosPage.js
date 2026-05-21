import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Search } from "lucide-react";

import ServicosAgendadosForm from "./ServicosAgendadosForm";
import ServicosAgendadosList from "./ServicosAgendadosList";

const ServicosAgendadosPage = () => {
  const [formData, setFormData] = useState({
    data: "",
    observacoes: "",
    servicoExtraId: "",
  });

  const [agendamentos, setAgendamentos] = useState([]);
  const [servicosExtras, setServicosExtras] = useState([]);

  const [search, setSearch] = useState("");

  // Buscar serviços extras
  const fetchServicosExtras = async () => {
    try {
      const res = await axios.get("http://localhost:4000/servicos-extras");
      setServicosExtras(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar serviços extras");
    }
  };

  // Buscar agendamentos
  const fetchAgendamentos = async () => {
    try {
      const res = await axios.get("http://localhost:4000/servicos-agendados");
      setAgendamentos(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar agendamentos");
    }
  };

  useEffect(() => {
    fetchServicosExtras();
    fetchAgendamentos();
  }, []);

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.servicoExtraId) {
      toast.error("Selecione um serviço!");
      return;
    }

    try {
      await axios.post("http://localhost:4000/servicos-agendados", {
        ...formData,
        servicoExtraId: parseInt(formData.servicoExtraId, 10),
      });

      toast.success("Serviço agendado com sucesso!");

      setFormData({
        data: "",
        observacoes: "",
        servicoExtraId: "",
      });

      fetchAgendamentos();

    } catch (err) {
      console.error(err);
      toast.error("Erro ao agendar serviço");
    }
  };

  // Eliminar
  const handleDelete = async (id) => {
    if (!window.confirm("Deseja eliminar este agendamento?"))
      return;

    try {
      await axios.delete(`http://localhost:4000/servicos-agendados/${id}`);

      toast.success("Agendamento eliminado!");

      fetchAgendamentos();

    } catch (err) {
      console.error(err);
      toast.error("Erro ao eliminar");
    }
  };

  // Pesquisa
  const filtered = agendamentos.filter((ag) =>
    ag.servicoExtra?.nome
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/40 shadow-2xl">

        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
              Serviços Agendados
            </h1>

            <p className="text-slate-600 mt-2">
              Gestão completa de serviços agendados.
            </p>

            <p className="text-sm text-slate-500 mt-3 font-medium">
              {filtered.length} registos encontrados
            </p>
          </div>

          {/* PESQUISA */}
          <div className="relative w-full xl:w-80">

            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Pesquisar serviço..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/70 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 shadow-lg"
            />

          </div>

        </div>

      </div>

      {/* FORM */}
      <ServicosAgendadosForm
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        servicosExtras={servicosExtras}
      />

      {/* LIST */}
      <ServicosAgendadosList
        agendamentos={filtered}
        onDelete={handleDelete}
      />

    </div>
  );
};

export default ServicosAgendadosPage;
