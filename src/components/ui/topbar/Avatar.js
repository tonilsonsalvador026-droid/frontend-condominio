import React from "react";

const Avatar = ({ nome, foto, size = 42 }) => {
  const getInitials = () => {
    if (!nome) return "?";

    const partes = nome.trim().split(" ");

    if (partes.length === 1) {
      return partes[0][0].toUpperCase();
    }

    return (
      partes[0][0] +
      partes[partes.length - 1][0]
    ).toUpperCase();
  };
