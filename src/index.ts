import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import { connectDB } from "./config/db";
import "reflect-metadata"; 
import vendorRoutes from "./routes/master/vendorRoutes";
import productRoutes from "./routes/master/productRoutes";
import customerRoutes from "./routes/master/customerRoutes";
import purchaseRoutes from "./routes/entries/purchaseRoutes";
import salesRoutes from "./routes/entries/salesRoutes";

import cityRoutes from "./routes/common/cityRoutes";
import stateRoutes from "./routes/common/stateRoutes";
import countryRoutes from "./routes/common/countryRoutes";
import pincodeRoutes from "./routes/common/pincodeRoutes";
import categoryRoutes from "./routes/common/categoryRoutes";

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
app.use("/api/customers", customerRoutes);

// entries
app.use("/api/purchase", purchaseRoutes);
app.use("/api/sales", salesRoutes);

// common
app.use("/api/city", cityRoutes);
app.use("/api/state", stateRoutes);
app.use("/api/country", countryRoutes);
app.use("/api/pincode", pincodeRoutes);
app.use("/api/category", categoryRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
