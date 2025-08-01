import express from "express";
import authRoutes from "./routes/auth.route.js";
import messeagesRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import {app, server} from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messeagesRoutes);

server.listen(PORT, () => {
  console.log("server is running on port: ", PORT);
  connectDB();
});
