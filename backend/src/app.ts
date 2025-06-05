import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route";
import shiftRoutes from "./routes/shift.route";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/shift", shiftRoutes);

export default app;
