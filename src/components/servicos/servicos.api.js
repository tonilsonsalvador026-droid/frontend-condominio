import api from "../../api";

// LISTAR
export const listarServicosExtras = async () => {
  const res = await api.get("/servicos-extras");
  return res.data;
};

// CRIAR
export const criarServicoExtra = async (dados) => {
  const res = await api.post("/servicos-extras", dados);
  return res.data;
};

// EDITAR
export const editarServicoExtra = async (id, dados) => {
  const res = await api.put(`/servicos-extras/${id}`, dados);
  return res.data;
};

// ELIMINAR
export const eliminarServicoExtra = async (id) => {
  const res = await api.delete(`/servicos-extras/${id}`);
  return res.data;
};
