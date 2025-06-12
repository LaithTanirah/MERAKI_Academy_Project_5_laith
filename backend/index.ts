import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import "./src/models/connectDB";
import authRoutes from "./src/routes/auth";
import roleRoutes from "./src/routes/role";
import orderRoutes from "./src/routes/order";
import orderProductRoutes from "./src/routes/orderProduct";
import categoryRoutes from "./src/routes/category";
import cartRouter from "./src/routes/cart";
const app: Application = express();
const PORT = process.env.PORT || 5000;

// Import Routers
import productRoutes from "./src/routes/product";

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use("/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/orders", orderRoutes);
app.use("/order-products", orderProductRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRouter);
// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
