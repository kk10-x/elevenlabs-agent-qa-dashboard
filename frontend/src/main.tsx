import React from "react";
import ReactDOM from "react-dom/client";

// Self-hosted fonts (bundled into the app's own assets — no external requests).
// Latin subset only — the dashboard is English-only, so this avoids shipping the
// cyrillic/greek/vietnamese subsets fontsource includes by default.
import "@fontsource/fira-sans/latin-400.css";
import "@fontsource/fira-sans/latin-500.css";
import "@fontsource/fira-sans/latin-600.css";
import "@fontsource/fira-sans/latin-700.css";
import "@fontsource/fira-code/latin-400.css";
import "@fontsource/fira-code/latin-500.css";
import "@fontsource/fira-code/latin-600.css";
import "@fontsource/fira-code/latin-700.css";

import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
