import React from "react";

// Cartão principal
export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-xl shadow-md ${className}`}>
      {children}
    </div>
  );
}

// Conteúdo do cartão
export function CardContent({ children, className = "" }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

// Cabeçalho do cartão (usado para título ou ações no topo)
export function CardHeader({ children, className = "" }) {
  return <div className={`border-b p-4 ${className}`}>{children}</div>;
}

// Título estilizado do cartão
export function CardTitle({ children, className = "" }) {
  return (
    <h2 className={`text-xl font-semibold leading-tight tracking-tight ${className}`}>
      {children}
    </h2>
  );
}