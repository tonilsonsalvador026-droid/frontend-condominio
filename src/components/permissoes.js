// src/components/permissoes.js

export const getPermissoes = () => {
  try {
    return JSON.parse(localStorage.getItem("permissoes") || "[]");
  } catch (err) {
    console.error("Erro ao ler permissões:", err);
    return [];
  }
};

export const temPermissao = (permissao) => {
  const permissoes = getPermissoes();

  if (!Array.isArray(permissoes)) return false;

  return permissoes.includes(permissao);
};
