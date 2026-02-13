import React from "react";
import {
  FileText,
  FileSpreadsheet,
  FileDown,
  Printer
} from "lucide-react";

const ActionButtons = ({
  onCSV,
  onExcel,
  onPDF,
  onPrint
}) => {
  return (
    <div className="flex flex-wrap gap-3 mb-6">

      {onCSV && (
        <button
          onClick={onCSV}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
        >
          <FileText size={16} /> CSV
        </button>
      )}

      {onExcel && (
        <button
          onClick={onExcel}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition"
        >
          <FileSpreadsheet size={16} /> Excel
        </button>
      )}

      {onPDF && (
        <button
          onClick={onPDF}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition"
        >
          <FileDown size={16} /> PDF
        </button>
      )}

      {onPrint && (
        <button
          onClick={onPrint}
          className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition"
        >
          <Printer size={16} /> Imprimir
        </button>
      )}

    </div>
  );
};

export default ActionButtons;
