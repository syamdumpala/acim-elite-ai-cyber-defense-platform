import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import "./index.css";

function Root() {
  return (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(<Root />);