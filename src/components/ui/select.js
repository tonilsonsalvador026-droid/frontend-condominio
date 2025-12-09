import * as React from 'react';

export function Select({ children, onValueChange }) {
  return <div onChange={(e) => onValueChange(e.target.value)}>{children}</div>;
}

export function SelectTrigger({ children, className }) {
  return (
    <select className={`border rounded px-2 py-1 ${className}`}>
      {children}
    </select>
  );
}

export function SelectContent({ children }) {
  return <>{children}</>;
}

export function SelectItem({ value, children }) {
  return <option value={value}>{children}</option>;
}



