// src/components/ui/table.js
import React from "react";

export function Table({ children, className = "" }) {
  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full bg-white ${className}`}>{children}</table>
    </div>
  );
}

export function TableHeader({ children }) {
  return <thead className="bg-gray-100">{children}</thead>;
}

// Alias: TableHead como alternativa para quem já usava
export const TableHead = TableHeader;

export function TableBody({ children }) {
  return <tbody>{children}</tbody>;
}

export function TableRow({ children, className = "" }) {
  return <tr className={`border-b ${className}`}>{children}</tr>;
}

export function TableCell({ children, className = "" }) {
  return <td className={`px-4 py-2 ${className}`}>{children}</td>;
}