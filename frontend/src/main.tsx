import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

/**
 * Single-Page Application Mount Point
 * Targets the core root container element inside your index.html and injects the React virtual DOM tree.
 */
createRoot(document.getElementById("root")!).render(
  /* The exclamation mark (!) is the non-null assertion operator. It explicitly tells 
     the TypeScript compiler that the "root" DOM element exists and is guaranteed not to be null. */
  <App />,
);
