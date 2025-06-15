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
import productRoutes from "./src/routes/product";
import cartProductRouter from "./src/routes/cartProduct";

import cartRouter from "./src/routes/cart";
import permissionRoutes from "./src/routes/permission";
import rolePermissionRoutes from "./src/routes/rolePermission";

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/orders", orderRoutes);
app.use("/order-products", orderProductRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRouter);
app.use("/api/cartProduct", cartProductRouter);
app.use("/api/permissions", permissionRoutes);
app.use("/api/rolePermissions", rolePermissionRoutes);
// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
