"use client";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
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
interface TokenPayload {
  userId: string | number;
}
const ShoppingCart: React.FC = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cartId, setCartId] = useState<number | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartProductList, setCartProductList] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // New: track deleting product id
  const [deletingProductId, setDeletingProductId] = useState<number | null>(
    null
  );
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        const parsedUserId = Number(decoded.userId);
        setUserId(!isNaN(parsedUserId) ? parsedUserId : null);
      } catch (err) {
        console.error("Invalid token:", err);
        setUserId(null);
      }
    }
  }, [token]);
  useEffect(() => {
    if (userId === null || !token) return;
    setLoading(true);
    axios
      .get<{ cart?: { id: number }[] }>(
        `http://localhost:5000/api/cart/getAllCartByIsDeletedFalse/${userId}`,
        { headers: { authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        const carts = res.data.cart ?? [];
        setCartId(carts.length > 0 ? carts[0].id : null);
        setError(null);
      })
      .catch((err) => {
        setError(
          axios.isAxiosError(err) ? err.message : "Error fetching cart."
        );
      })
      .finally(() => setLoading(false));
  }, [userId, token]);
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
      }>(`http://localhost:5000/api/cartProduct/cart/${cartId}`, {
        headers: { authorization: `Bearer ${token}` },
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
        setError(axios.isAxiosError(err) ? err.message : "Error loading cart.");
      })
      .finally(() => setLoading(false));
  }, [cartId, token]);
  const handleQuantityChange = (productId: number, qty: number) => {
    if (qty < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.productid === productId ? { ...item, quantity: qty } : item
      )
    );
  };
  const handleRemove = async (productId: number) => {
    if (!cartId || !token) return;
    setDeletingProductId(productId);
    const previousCartItems = [...cartItems];
    const previousCartProductList = [...cartProductList];
    setCartItems((prev) => prev.filter((item) => item.productid !== productId));
    setCartProductList((prev) => prev.filter((p) => p.id !== productId));
    try {
      await axios.delete(
        `http://localhost:5000/api/cartProduct/${cartId}/${productId}`,
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error("Failed to delete item from cart:", error);
      alert("Failed to remove item. Reverting changes.");
      setCartItems(previousCartItems);
      setCartProductList(previousCartProductList);
    } finally {
      setDeletingProductId(null);
    }
  };
  const totalPrice = cartItems.reduce((sum, item) => {
    const product = cartProductList.find((p) => p.id === item.productid);
    return product ? sum + product.price * item.quantity : sum;
  }, 0);
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
        gutterBottom
        sx={{ textAlign: "center", fontWeight: "bold", mb: 4 }}
      >
         Shopping Cart
      </Typography>
      {loading && <CircularProgress />}
      {error && (
        <Typography variant="body2" color="error" mb={2}>
          {error}
        </Typography>
      )}
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={8}>
          {cartProductList.length === 0 && !loading && (
            <Typography>Your cart is empty.</Typography>
          )}
          <Stack spacing={2}>
            {cartProductList.map((product) => {
              const cartItem = cartItems.find(
                (item) => item.productid === product.id
              );
              if (!cartItem) return null;
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    sx={{
                      display: "flex",
                      width: "50vw",
                      height: "20vh",
                      alignItems: "center",
                      p: 1.5,
                      borderRadius: 3,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      transition: "box-shadow 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={`images/${product.image[0]}`}
                      alt={product.title}
                      sx={{
                        width: 130,
                        height: 130,
                        borderRadius: 2,
                        objectFit: "cover",
                        flexShrink: 0,
                      }}
                    />
                    <CardContent
                      sx={{ flexGrow: 1, pl: 2, "&:last-child": { pb: 0 } }}
                    >
                      <Typography variant="h6" fontWeight={600}>
                        {product.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Size: {product.size}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        color="primary"
                        fontWeight={700}
                      >
                        ${product.price.toFixed(2)}
                      </Typography>
                    </CardContent>
                    <CardActions
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        pr: 1,
                      }}
                    >
                      <TextField
                        type="number"
                        size="small"
                        value={cartItem.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            product.id,
                            Number(e.target.value)
                          )
                        }
                        inputProps={{ min: 1, style: { width: 70 } }}
                      />
                      <IconButton
                        aria-label="Remove item"
                        color="error"
                        onClick={() => handleRemove(product.id)}
                        disabled={deletingProductId === product.id}
                      >
                        {deletingProductId === product.id ? (
                          <CircularProgress size={24} color="inherit" />
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
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Paper
              elevation={3}
              sx={{
                width: "25vw",
                p: 3,
                borderRadius: 3,
                backgroundColor: "#F5F5F5",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                transition: "box-shadow 0.3s ease",
                "&:hover": {
                  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                },
              }}
            >
              <Typography variant="h6" gutterBottom>
                 Order Summary
              </Typography>
              <Typography variant="body1" sx={{ mb: 1.5 }}>
                Total Items:{" "}
                <strong>
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </strong>
              </Typography>
              <Typography
                variant="h5"
                color="primary"
                fontWeight={700}
                sx={{ mb: 3 }}
              >
                Total: ${totalPrice.toFixed(2)}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={cartProductList.length === 0}
                onClick={() => alert("Proceed to checkout")}
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  py: 1.5,
                }}
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





















