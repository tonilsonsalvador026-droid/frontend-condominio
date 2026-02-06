// src/components/edificios/EdificioList.js
import React, { useEffect, useState } from "react";
import api from "../../api";

const EdificioList = () => {
  const [edificios, setEdificios] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/edificios").then((res) => setEdificios(res.data));
  }, []);

  const filtered = edificios.filter((e) =>
    e.nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-md border p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Lista de Edifícios
          </h2>
          <p className="text-gray-500 text-sm">
            Visualize e pesquise os edifícios cadastrados
          </p>
        </div>

        <input
          type="text"
          placeholder="Pesquisar por nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full lg:w-80 focus:ring-2 focus:ring-blue-200 outline-none"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm md:text-base">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="p-3 text-left">Nome</th>
              <th className="p-3 text-left">Endereço</th>
              <th className="p-3 text-left">Andares</th>
              <th className="p-3 text-left">Apartamentos</th>
              <th className="p-3 text-left">Condomínio</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.id} className="border-t hover:bg-gray-50 transition">
                <td className="p-3 font-medium">{e.nome}</td>
                <td className="p-3">{e.endereco}</td>
                <td className="p-3">{e.numeroAndares}</td>
                <td className="p-3">{e.numeroApartamentos}</td>
                <td className="p-3">{e.condominio?.nome}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EdificioList;
