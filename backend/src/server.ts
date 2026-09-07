import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// Route handlers
import registerRouter from "./routes/register";
import authRouter from "./routes/auth";
import adminRouter from "./routes/admin";
import pollsRouter from "./routes/polls";
import ideasRouter from "./routes/ideas";
import eventsRouter from "./routes/events";
import opportunitiesRouter from "./routes/opportunities";
import mediaRouter from "./routes/media";
import budgetHubRouter from "./routes/budgetHub";
import cronRouter from "./routes/cron";
import meRouter from "./routes/me";

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000").split(",");

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "nybf-connect-backend", timestamp: new Date().toISOString() });
});

app.get("/", (_req, res) => {
  res.json({
    name: "NYBF Connect Backend API",
    version: "1.0.0",
    description: "API engine for Kenya National Youth Budget Forum",
    docs: "/health",
  });
});

// API Routes
app.use("/api/register", registerRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/polls", pollsRouter);
app.use("/api/ideas", ideasRouter);
app.use("/api/events", eventsRouter);
app.use("/api/opportunities", opportunitiesRouter);
app.use("/api/media", mediaRouter);
app.use("/api/budget-hub", budgetHubRouter);
app.use("/api/cron", cronRouter);
app.use("/api/me", meRouter);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Endpoint not found on NYBF Connect Backend." });
});

export default app;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`🚀 NYBF Connect Backend running at http://localhost:${PORT}`);
    console.log(`📡 CORS allowed for: ${allowedOrigins.join(", ")}`);
  });
}
