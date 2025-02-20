import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();
const PORT = process.env.PORT;

const app = express();

app.use(express.json({ limit: "1mb" })); // allows to extract JSON data out of request body
app.use(cookieParser()); // allows to read the cookies
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.use((err, req, res, next) => {
  if (err.type === "entity.too.large") {
    return res.status(413).json({
      message: "Payload too large. Please reduce the file size and try again.",
    });
  }
  next(err);
});

app.listen(PORT, () => {
  console.log(`Server is running in port ${PORT}`);
  connectDB();
});
