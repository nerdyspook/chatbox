import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();
const PORT = process.env.PORT;

const app = express();

app.use(express.json()); // allows to extract JSON data out of request body
app.use(cookieParser()); // allows to read the cookies

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.listen(PORT, () => {
  console.log(`Server is running in port ${PORT}`);
  connectDB();
});
