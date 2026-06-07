import React, { useState, useEffect } from "react";

export default function TacticalConsole({ logs }) {
  const [open, setOpen] = useState(false);
  const [displayLogs, setDisplayLogs] = useState([]);

  /* Auto-scroll new logs */
  useEffect(() => {
    if (logs.length) {
      setDisplayLogs(logs.slice(-50));
    }
  }, [logs]);

  return (
    <div className={`tactical-console ${open ? "open" : ""}`}>
      
      {/* HEADER */}
      <div onClick={() => setOpen(!open)}>
        {open ? "▼ TACTICAL CONSOLE" : "▲ TACTICAL CONSOLE"}
      </div>

      {/* BODY */}
      {open && (
        <div style={{ maxHeight: "200px", overflowY: "auto" }}>
          {displayLogs.length === 0 && (
            <div className="console-line">
              SYSTEM INITIALIZED...
            </div>
          )}

          {displayLogs.map((log, index) => (
            <div
              key={index}
              className="console-line"
              style={{
                color:
                  log.type === "attack"
                    ? "#FF3B3B"
                    : log.type === "defense"
                    ? "#00FF99"
                    : "#00F5FF",
              }}
            >
              [{log.time}] {log.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}