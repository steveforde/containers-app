import express from "express";
import cors from "cors";
import diaryRouter from "./routes/diaries";

const app = express();

// Middleware: Enable Cross-Origin Resource Sharing (CORS) to allow frontend access from other ports
app.use(cors());

// Middleware: Built-in Express JSON parser to automatically bind incoming payload streams onto req.body
app.use(express.json());

const PORT = 3000;

/**
 * Baseline Endpoint: GET /ping
 * Basic deployment test route used to quickly verify backend server availability and responsiveness
 */
app.get("/ping", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});

// Routing Layer: Bind the complete diary system endpoints behind the standard '/api/diaries' prefix path
app.use("/api/diaries", diaryRouter);

// Start Server: Bind the application to listen for network traffic requests on the designated port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
