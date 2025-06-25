"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import {
  Paper,
  Typography,
  Button,
  IconButton,
  Stack,
  TextField,
  CircularProgress,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion } from "framer-motion";

// Set the base URL for all axios requests to your backend
axios.defaults.baseURL = "http://localhost:5000/api";

interface TokenPayload {
  userId: number;
}

interface CartProduct {
  id: number;
  title: string;
  price: number;
  size: string;
  image: string[];
}

interface CartItem {
  productid: number;
  quantity: number;
}

const ShoppingCart: React.FC = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [cartId, setCartId] = useState<number | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartProductList, setCartProductList] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(
    null
  );

  // 1) Load token from localStorage
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);
  }, []);

  // 2) Decode token to get userId
  useEffect(() => {
    if (!token) return;
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      setUserId(decoded.userId);
    } catch {
      setUserId(null);
    }
  }, [token]);

  // 3) Fetch or create active cart for this user
  useEffect(() => {
    if (userId === null || !token) return;

    const fetchOrCreateCart = async () => {
      setLoading(true);
      try {
        // Try to get existing non-deleted cart
        const res = await axios.get<{ cart?: { id: number }[] }>(
          `/cart/getAllCartByIsDeletedFalse/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const carts = res.data.cart ?? [];
        if (carts.length > 0) {
          setCartId(carts[0].id);
        } else {
          // If none, create a new cart
          const create = await axios.post(
            `/cart/createNewCart`,
            { user_id: userId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          // Assume first returned row has the new cart ID
          setCartId(create.data.result[0].id);
        }
        setError(null);
      } catch (err: any) {
        setError("Failed to fetch or create cart.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrCreateCart();
  }, [userId, token]);

  // 4) Once we have cartId, load its products
  useEffect(() => {
    if (cartId === null || !token) return;

    setLoading(true);
    axios
      .get<{
        result: Array<{
          cartid: number;
          productid: number;
          product_title: string;
          price: number;
          images: string[];
          size: string;
          quantity: number;
        }>;
      }>(`/cartProduct/cart/${cartId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const items = res.data.result;
        setCartItems(
          items.map(({ productid, quantity }) => ({ productid, quantity }))
        );
        setCartProductList(
          items.map((item) => ({
            id: item.productid,
            title: item.product_title,
            price: item.price,
            size: item.size,
            image: item.images,
          }))
        );
        setError(null);
      })
      .catch((err) => {
        setError("Failed to load cart items.");
      })
      .finally(() => setLoading(false));
  }, [cartId, token]);

  // 5) Handle quantity adjustments locally
  const handleQuantityChange = (productId: number, qty: number) => {
    if (qty < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.productid === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  // 6) Remove a product from cart (with optimistic update)
  const handleRemove = async (productId: number) => {
    if (!cartId || !token) return;

    setDeletingProductId(productId);
    const prevItems = [...cartItems];
    const prevProducts = [...cartProductList];

    // Optimistically update UI
    setCartItems((items) =>
      items.filter((i) => i.productid !== productId)
    );
    setCartProductList((plist) =>
      plist.filter((p) => p.id !== productId)
    );

    try {
      await axios.delete(`/cartProduct/${cartId}/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // Revert on failure
      alert("Failed to remove item, reverting changes.");
      setCartItems(prevItems);
      setCartProductList(prevProducts);
    } finally {
      setDeletingProductId(null);
    }
  };

  // 7) Calculate total price
  const totalPrice = cartItems.reduce((sum, item) => {
    const prod = cartProductList.find((p) => p.id === item.productid);
    return prod ? sum + prod.price * item.quantity : sum;
  }, 0);

  // 8) Checkout: mark cart as ordered, then navigate to orders page
  const handleCheckout = async () => {
    if (!cartId || !token) return;
    try {
      const res = await axios.put(
        `/cart/checkout/${cartId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        alert("Order placed successfully!");
        router.push("/orders");
      } else {
        alert("Checkout failed.");
      }
    } catch {
      alert("Checkout request failed.");
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: "100vw",
        height: "100vh",
        p: 3,
        borderRadius: 0,
        background: "linear-gradient(to bottom, #C8FACC, #5F7F67)",
        overflowY: "auto",
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{ textAlign: "center", fontWeight: "bold", mb: 4 }}
      >
        Shopping Cart
      </Typography>

      {loading && <CircularProgress />}
      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}

      <Grid container spacing={4} justifyContent="center">
        {/* Cart items */}
        <Grid item xs={12} md={8}>
          {cartProductList.length === 0 && !loading && (
            <Typography>Your cart is empty.</Typography>
          )}
          <Stack spacing={2}>
            {cartProductList.map((prod) => {
              const item = cartItems.find((i) => i.productid === prod.id);
              if (!item) return null;
              return (
                <motion.div
                  key={prod.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card sx={{ display: "flex", alignItems: "center", p: 1.5 }}>
                    <CardMedia
                      component="img"
                      image={`images/${prod.image[0]}`}
                      alt={prod.title}
                      sx={{ width: 130, height: 130, borderRadius: 2, objectFit: "cover" }}
                    />
                    <CardContent sx={{ flexGrow: 1, pl: 2 }}>
                      <Typography variant="h6">{prod.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Size: {prod.size}
                      </Typography>
                      <Typography variant="subtitle1" color="primary">
                        ${prod.price.toFixed(2)}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ flexDirection: "column", gap: 1, pr: 1 }}>
                      <TextField
                        type="number"
                        size="small"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(prod.id, Number(e.target.value))
                        }
                        inputProps={{ min: 1, style: { width: 70 } }}
                      />
                      <IconButton
                        color="error"
                        onClick={() => handleRemove(prod.id)}
                        disabled={deletingProductId === prod.id}
                      >
                        {deletingProductId === prod.id ? (
                          <CircularProgress size={24} />
                        ) : (
                          <DeleteIcon />
                        )}
                      </IconButton>
                    </CardActions>
                  </Card>
                </motion.div>
              );
            })}
          </Stack>
        </Grid>

        {/* Order summary + Checkout */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Paper sx={{ p: 3, borderRadius: 3, backgroundColor: "#F5F5F5" }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Typography variant="body1" sx={{ mb: 1.5 }}>
                Total Items:{" "}
                <strong>{cartItems.reduce((a, i) => a + i.quantity, 0)}</strong>
              </Typography>
              <Typography variant="h5" color="primary" fontWeight={700} sx={{ mb: 3 }}>
                Total: ${totalPrice.toFixed(2)}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                size="large"
                disabled={cartProductList.length === 0}
                onClick={handleCheckout}
                sx={{ textTransform: "none", fontWeight: "bold", py: 1.5 }}
              >
                Checkout
              </Button>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ShoppingCart;
