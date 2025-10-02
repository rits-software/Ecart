import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import { connectDB } from "./config/db";
import "reflect-metadata"; 
import vendorRoutes from "./routes/master/vendorRoutes";
import productRoutes from "./routes/master/productRoutes";
import purchaseRoutes from "./routes/entries/purchaseRoutes";
dotenv.config();
const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const allowedOrigins = [
  "http://localhost:3001",
  "http://127.0.0.1:3001",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow Postman or server-to-server
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // allows cookies / Authorization headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

connectDB()

// Routes
app.use("/api/auth", authRoutes);

//master routes
app.use("/api/vendors", vendorRoutes);
app.use("/api/products", productRoutes);
app.use("/api/purchase", purchaseRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
