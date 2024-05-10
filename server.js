import express from "express";
const app = express();
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import testRoutes from "./routes/testRoutes.js";
//config
dotenv.config();

connectDB();

//middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

//routes
app.use("/api/v1/user", testRoutes);
app.use("/api/v1/auth", authRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`App is running in ${process.env.DEV_MODE} mode on port ${PORT}`);
});