"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  Box,
  Typography,
  Paper,
  Chip,
  IconButton,
  Collapse,
  Divider,
  Stack,
} from "@mui/material";
import {
  LocalShipping,
  DoneAll,
  HourglassEmpty,
  Cancel,
  KeyboardArrowDown,
  KeyboardArrowUp,
  ShoppingCart,
} from "@mui/icons-material";
import { styled } from "@mui/system";
import { Theme } from "@mui/material/styles";
import { format } from "date-fns";

interface TokenPayload {
  userId: number;
}

interface Product {
  productId: number;
  product_title: string;
  price: number;
  images: string[];
  size: string[];
  quantity: number;
}

interface Order {
  cart_id: number;
  user_id: number;
  products: Product[];
  status?: string;
  date?: string | Date;
  total?: number;
}

interface OrderResponse {
  result: Order[];
}

const OrderCard = styled(Paper)(({ theme }: { theme: Theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
  animation: "fadeInUp 500ms ease-out",
  "@keyframes fadeInUp": {
    "0%": { opacity: 0, transform: "translateY(10px)" },
    "100%": { opacity: 1, transform: "translateY(0)" },
  },
}));

const ProductRow = styled(Box)(({ theme }: { theme: Theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  padding: theme.spacing(1.5, 2),
  marginBottom: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.grey[100],
  alignItems: "center",
  boxShadow: theme.shadows[1],
  "&:last-child": {
    marginBottom: 0,
  },
}));

const statusConfig: Record<
  string,
  { color: "primary" | "success" | "warning" | "error"; icon: JSX.Element }
> = {
  Shipped: { color: "primary", icon: <LocalShipping fontSize="small" /> },
  Delivered: { color: "success", icon: <DoneAll fontSize="small" /> },
  Processing: { color: "warning", icon: <HourglassEmpty fontSize="small" /> },
  Cancelled: { color: "error", icon: <Cancel fontSize="small" /> },
};

const Orders: React.FC = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [openRow, setOpenRow] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        const parsedUserId = Number(decoded.userId);
        setUserId(!isNaN(parsedUserId) ? parsedUserId : null);
      } catch (err) {
        console.error("Invalid token:", err);
        setUserId(null);
      }
    } else {
      setUserId(null);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchOrders = async () => {
      try {
        const response = await axios.get<OrderResponse>(
          `http://localhost:5000/api/cartProduct/order/${userId}`
        );

        const ordersWithExtras = response.data.result.map((order) => {
          const total = order.products.reduce(
            (acc, p) => acc + p.price * p.quantity,
            0
          );
          return {
            ...order,
            total,
            status: order.status || "Processing",
            date: order.date ? new Date(order.date) : new Date(),
          };
        });

        setOrders(ordersWithExtras);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, [userId]);

  const toggleRow = (cartId: number) => {
    setOpenRow((prev) => (prev === cartId ? null : cartId));
  };

  return (
    <Box
      p={3}
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #C8FACC, #5F7F67)",
      }}
    >
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={1}
        mb={3}
      >
        <ShoppingCart fontSize="large" />
        <Typography variant="h4" fontWeight="bold">
          Your Orders
        </Typography>
      </Stack>

      {orders.length === 0 && (
        <Typography>No orders found for this user.</Typography>
      )}

      {orders.map((order, idx) => (
        <OrderCard
          key={order.cart_id}
          sx={{ animationDelay: `${idx * 100}ms` }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={4}
          >
            <Typography variant="h6" sx={{ fontFamily: "monospace" }}>
              Order ID: {order.cart_id}
            </Typography>

            <Typography variant="body2">
              <strong>Customer:</strong> User {order.user_id}
            </Typography>

            <Typography variant="body2">
              <strong>Date:</strong>{" "}
              {order.date
                ? format(new Date(order.date), "MMM dd, yyyy")
                : "N/A"}
            </Typography>

            <Typography variant="body2">
              <strong>Total:</strong> ${order.total?.toFixed(2) ?? "0.00"}
            </Typography>

            <Chip
              icon={statusConfig[order.status || "Processing"]?.icon}
              label={order.status || "Processing"}
              color={statusConfig[order.status || "Processing"]?.color}
              variant="outlined"
              sx={{ height: 32, fontWeight: 500 }}
            />

            <IconButton size="small" onClick={() => toggleRow(order.cart_id)}>
              {openRow === order.cart_id ? (
                <KeyboardArrowUp />
              ) : (
                <KeyboardArrowDown />
              )}
            </IconButton>
          </Stack>

          <Collapse in={openRow === order.cart_id} timeout="auto" unmountOnExit>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>
              Products in this Order
            </Typography>

            <Box>
              {order.products.map((product, index) => (
                <ProductRow key={index}>
                  <Typography variant="body1" sx={{ flex: 2 }}>
                    {product.product_title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ flex: 1, textAlign: "center" }}
                  >
                    Qty: {product.quantity}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ flex: 1, textAlign: "right", fontWeight: 600 }}
                  >
                    ${product.price.toFixed(2)}
                  </Typography>
                </ProductRow>
              ))}
            </Box>
          </Collapse>
        </OrderCard>
      ))}
    </Box>
  );
};

export default Orders;
