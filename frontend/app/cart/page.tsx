"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

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

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<
    "Cash" | "Visa" | null
  >(null);
  const [visaForm, setVisaForm] = useState({
    name: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("")
  

  const showModal = (title: string, message: string, onClose?: () => void) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalOpen(true);
    modalOnCloseRef.current = onClose || null;
  };

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);
  }, []);

  useEffect(() => {
    if (!token) return;
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      setUserId(decoded.userId);
    } catch {
      setUserId(null);
    }
  }, [token]);

  useEffect(() => {
    if (userId === null || !token) return;

    const fetchCart = async () => {
      setLoading(true);
      try {
        const res = await axios.get<{ cart?: { id: number }[] }>(
          `/cart/getAllCartByIsDeletedFalse/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const carts = res.data.cart ?? [];
        setCartId(carts[0]?.id ?? null);
      } catch {
        setError("Failed to fetch cart.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
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
      .catch(() => {
        setError("Failed to load cart items.");
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
    const prevItems = [...cartItems];
    const prevProducts = [...cartProductList];
    setCartItems((items) => items.filter((i) => i.productid !== productId));
    setCartProductList((plist) => plist.filter((p) => p.id !== productId));
    try {
      await axios.delete(`/cartProduct/${cartId}/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      showModal("Error", "Failed to remove item, reverting changes.");
      setCartItems(prevItems);
      setCartProductList(prevProducts);
    } finally {
      setDeletingProductId(null);
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    const prod = cartProductList.find((p) => p.id === item.productid);
    return prod ? sum + prod.price * item.quantity : sum;
  }, 0);

  const handleCheckoutClick = () => {
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSelection = (method: "Cash" | "Visa") => {
    setSelectedPayment(method);
  };

  const finalizeOrder = () => {
    if (!token || !userId) return;

    axios
      .put(
        `/cart/checkout/${cartId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        if (res.data.success) {
          axios
            .post(
              `/cart/createNewCart`,
              { user_id: userId },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            )
            .then((create) => {
              setCartId(create.data.result.id);
              showModal("Success", "Order placed successfully!");
              setIsPaymentModalOpen(false);
              router.push("/orders");
            })
            .catch(() => {
              showModal("Error", "Failed to create new cart.");
            });
        } else {
          showModal("Error", "Checkout failed.");
        }
      })
      .catch(() => {
        showModal("Error", "Checkout request failed.");
      });
  };

  const handleVisaPaymentSubmit = () => {
    const { name, cardNumber, expiry, cvv } = visaForm;
    if (!name || !cardNumber || !expiry || !cvv) {
      showModal("Error", "Please fill all Visa fields.");
      return;
    }
    showModal("Success", "Visa payment successful!");
    finalizeOrder();
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
      <Typography variant="h4" textAlign="center" fontWeight="bold" mb={4}>
        Shopping Cart
      </Typography>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      <Grid
        container
        spacing={4}
        justifyContent="center"
        alignItems="flex-start"
      >
        <Grid item xs={12} md={8}>
          <Stack spacing={2}>
            {cartProductList.map((prod) => {
              const item = cartItems.find((i) => i.productid === prod.id);
              if (!item) return null;
              return (
                <Card
                  key={prod.id}
                  sx={{ display: "flex", alignItems: "center", p: 1.5 }}
                >
                  <CardMedia
                    component="img"
                    image={`images/${prod.image[0]}`}
                    alt={prod.title}
                    sx={{ width: 130, height: 130, borderRadius: 2 }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{prod.title}</Typography>
                    <Typography variant="body2">Size: {prod.size}</Typography>
                    <Typography variant="subtitle1" color="primary">
                      ${prod.price.toFixed(2)}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ flexDirection: "column" }}>
                    <TextField
                      type="number"
                      size="small"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(prod.id, Number(e.target.value))
                      }
                      inputProps={{ min: 1, style: { width: 60 } }}
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
              );
            })}
          </Stack>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, backgroundColor: "#F5F5F5" }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Typography variant="body1">
              Total Items:{" "}
              <strong>{cartItems.reduce((a, i) => a + i.quantity, 0)}</strong>
            </Typography>
            <Typography variant="h5" fontWeight="bold" mt={2} mb={3}>
              Total: ${totalPrice.toFixed(2)}
            </Typography>
            <Button
              variant="contained"
              fullWidth
              onClick={handleCheckoutClick}
              disabled={cartProductList.length === 0}
            >
              Checkout
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Payment Dialog */}
      <Dialog
        open={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      >
        <DialogTitle>Select Payment Method</DialogTitle>
        <DialogContent>
          {selectedPayment === null && (
            <Stack spacing={2} mt={2}>
              <Button
                variant="outlined"
                onClick={() => handlePaymentSelection("Cash")}
              >
                Pay with Cash
              </Button>
              <Button
                variant="contained"
                onClick={() => handlePaymentSelection("Visa")}
              >
                Pay with Visa
              </Button>
            </Stack>
          )}

          {selectedPayment === "Cash" && (
            <Box mt={2}>
              <Typography>
                You selected <strong>Cash</strong>. Please pay on delivery.
              </Typography>
            </Box>
          )}

          {selectedPayment === "Visa" && (
            <Stack spacing={2} mt={2}>
              <TextField
                label="Cardholder Name"
                fullWidth
                value={visaForm.name}
                onChange={(e) =>
                  setVisaForm({ ...visaForm, name: e.target.value })
                }
              />
              <TextField
                label="Card Number"
                fullWidth
                value={visaForm.cardNumber}
                onChange={(e) =>
                  setVisaForm({ ...visaForm, cardNumber: e.target.value })
                }
              />
              <TextField
                label="Expiry Date (MM/YY)"
                fullWidth
                value={visaForm.expiry}
                onChange={(e) =>
                  setVisaForm({ ...visaForm, expiry: e.target.value })
                }
              />
              <TextField
                label="CVV"
                fullWidth
                value={visaForm.cvv}
                onChange={(e) =>
                  setVisaForm({ ...visaForm, cvv: e.target.value })
                }
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsPaymentModalOpen(false)}>Cancel</Button>
          {selectedPayment === "Cash" && (
            <Button variant="contained" onClick={finalizeOrder}>
              Confirm
            </Button>
          )}
          {selectedPayment === "Visa" && (
            <Button variant="contained" onClick={handleVisaPaymentSubmit}>
              Pay Now
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Modal Dialog */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        PaperProps={{
          sx: { borderRadius: 3, p: 3, minWidth: 300, textAlign: "center" },
        }}
      >
        {modalTitle.toLowerCase().includes("success") ? (
          <CheckCircleIcon sx={{ fontSize: 60, color: "green", mb: 2 }} />
        ) : (
          <ErrorIcon sx={{ fontSize: 60, color: "red", mb: 2 }} />
        )}
        <DialogTitle
          sx={{
            fontWeight: "bold",
            fontSize: "1.5rem",
            color: modalTitle.toLowerCase().includes("success")
              ? "green"
              : "red",
          }}
        >
          {modalTitle}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: "1rem", color: "#555" }}>
            {modalMessage}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={() => {
              setModalOpen(false);
              if (modalOnCloseRef.current) {
                modalOnCloseRef.current();
                modalOnCloseRef.current = null; // clear after running
              }
            }}
            variant="contained"
            sx={{
              mt: 2,
              px: 4,
              py: 1,
              backgroundColor: modalTitle.toLowerCase().includes("success")
                ? "green"
                : "red",
              color: "#fff",
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ShoppingCart;
