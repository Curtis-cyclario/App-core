import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { WebSocketProvider } from "./contexts/WebSocketContext";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <WebSocketProvider>
      <App />
    </WebSocketProvider>
  </ThemeProvider>
);
