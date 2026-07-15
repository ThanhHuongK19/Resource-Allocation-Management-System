import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
// Start MSW in development to mock backend APIs
// Start MSW in development to mock backend APIs only when explicitly enabled
// Set VITE_USE_MOCKS=true in .env to enable mocks during dev. Default is disabled.
if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCKS === "true") {
  import("./mocks/browser").then(({ worker }) => {
    worker.start();
  });
}

createRoot(document.getElementById("root")!).render(<App />);
