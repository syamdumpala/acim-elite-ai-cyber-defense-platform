import React from "react";

export function Panel({ title, children }) {
  return (
    <div className="glass-panel">
      <h3 className="drag-handle">{title}</h3>
      <div style={{ marginTop: "15px" }}>
        {children}
      </div>
    </div>
  );
}

export function Metric({ label, value }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}