import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./styles/index.css";
import { FooterSection } from "./app/components/footer-section";
import { AnimatedShapes } from "./app/components/animated-shapes";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <AnimatedShapes />
    <FooterSection />
  </StrictMode>
);