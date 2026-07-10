import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./app/App";
import { logError } from "./shared/logger/LoggerService";
import "./styles.css";

const ROOT_ELEMENT = document.getElementById("root");

if (ROOT_ELEMENT === null) {
  const error = new Error("Application root element was not found.");
  logError("The application could not find its root element.", error);
  throw error;
}

createRoot(ROOT_ELEMENT).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
