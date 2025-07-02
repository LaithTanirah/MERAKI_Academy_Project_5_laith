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
  ShoppingCart as CartIcon,
} from "@mui/icons-material";
import { styled } from "@mui/system";
import { Theme } from "@mui/material/styles";
import { format } from "date-fns";
import DeliveryReview from "@/components/DeliveryReview";

// Axios base URL
axios.defaults.baseURL = "http://localhost:5000/api";

// Types
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
  status: string;
  date: string | Date;
  total: number;
}

// Styled
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
  "&:last-child": { marginBottom: 0 },
}));

// Status
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
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [openRow, setOpenRow] = useState<number | null>(null);

  // Load JWT
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);
  }, []);

  // Decode user
  useEffect(() => {
    if (!token) return;
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      setUserId(decoded.userId);
    } catch {
      setUserId(null);
    }
  }, [token]);

  // Fetch orders
  useEffect(() => {
    if (userId === null || !token) return;
    axios
      .get<{ result: Order[] }>(`/cartProduct/order/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const enriched = res.data.result.map((o) => {
          const status =
            o.status && statusConfig[o.status] ? o.status : "Processing";
          const date = o.date ? new Date(o.date) : new Date();
          const total =
            o.products?.reduce(
              (sum, p) => sum + (p.price || 0) * (p.quantity || 0),
              0
            ) || 0;
          return { ...o, status, date, total };
        });
        setOrders(enriched);
      })
      .catch((err) => console.error("Failed to fetch orders:", err));
  }, [userId, token]);

  const toggleRow = (id: number) =>
    setOpenRow((prev) => (prev === id ? null : id));

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
        <CartIcon fontSize="large" />
        <Typography variant="h4" fontWeight="bold">
          Your Orders
        </Typography>
      </Stack>

      {orders.length === 0 ? (
        <Typography>No orders found for this user.</Typography>
      ) : (
        orders.map((order, idx) => (
          <OrderCard key={order.cart_id} sx={{ animationDelay: `${idx * 100}ms` }}>
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
                <strong>Date:</strong> {format(order.date as Date, "MMM dd, yyyy")}
              </Typography>
              <Typography variant="body2">
                <strong>Total:</strong> ${order.total.toFixed(2)}
              </Typography>
              <Chip
                icon={statusConfig[order.status]?.icon || <HourglassEmpty fontSize="small" />}
                label={order.status}
                color={statusConfig[order.status]?.color || "warning"}
                variant="outlined"
                sx={{ height: 32, fontWeight: 500 }}
              />
              <IconButton size="small" onClick={() => toggleRow(order.cart_id)}>
                {openRow === order.cart_id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              </IconButton>
            </Stack>

            <Collapse in={openRow === order.cart_id} timeout="auto" unmountOnExit>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                Products in this Order
              </Typography>
              {order.products?.map((p, i) => (
                <ProductRow key={i}>
                  <Typography sx={{ flex: 2 }}>{p.product_title}</Typography>
                  <Typography sx={{ flex: 1, textAlign: "center" }}>
                    Qty: {p.quantity}
                  </Typography>
                  <Typography
                    sx={{ flex: 1, textAlign: "right", fontWeight: 600 }}
                  >
                    ${p.price.toFixed(2)}
                  </Typography>
                </ProductRow>
              ))}
            </Collapse>

            {order.status === "Delivered" && (
              <Box sx={{ mt: 2, px: 2 }}>
                <DeliveryReview orderId={order.cart_id} />
              </Box>
            )}
          </OrderCard>
        ))
      )}
    </Box>
  );
};

export default Orders;
