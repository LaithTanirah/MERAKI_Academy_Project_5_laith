"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Button,
  Tooltip,
  Box,
  CircularProgress,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { motion } from "framer-motion";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

const FavoriteProducts = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);
  }, []);

  useEffect(() => {
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      setUserId(decoded.userId);
    } catch {
      setUserId(null);
    }
  }, [token]);

  useEffect(() => {
    if (!userId) return;
    axios
      .get(`http://localhost:5000/api/favorite/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.success) {
          setFavorites(res.data.result);
        } else {
          console.error("Error fetching favorites:", res.data.message);
        }
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, [userId, favorites]);

  const handleRemove = async (productId) => {
    setFavorites((prev) => prev.filter((item) => item.productid !== productId));

    try {
      await axios.delete(
        `http://localhost:5000/api/favorite/delete/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error("Failed to delete from favorites:", err);
    }
  };

  const handleViewDetails = (product) => {
    router.push(`/productDetails/${product.productid}`);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #c8facc, #5f7f67)",
        py: 6,
      }}
    >
      <Container>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              fontSize: { xs: "2.2rem", md: "3rem" },
              color: "#14342B",
              fontFamily: "Public Sans, Inter, sans-serif",
              letterSpacing: "-0.5px",
              textTransform: "capitalize",
            }}
          >
            ❤️ Your Favorite Products
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mt: 1,
              maxWidth: "640px",
              margin: "0 auto",
              color: "text.secondary",
              fontSize: { xs: "0.95rem", sm: "1.05rem" },
            }}
          >
            Here's a collection of products you've saved to view later.
          </Typography>
        </Box>

        {loading ? (
          <Box textAlign="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Typography variant="h6" color="text.secondary" textAlign="center">
              🛒 You have no favorite products.
            </Typography>
          </motion.div>
        ) : (
          <Grid container spacing={4}>
            {favorites.map((product) => (
              <Grid item key={product.productid} xs={12} sm={6} md={4}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card
                    elevation={4}
                    sx={{
                      height: 440,
                      width: 362,
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{
                        height: 180,
                        objectFit: "cover",
                      }}
                      image={`/images/${
                        product.images?.[0] || "placeholder.jpg"
                      }`}
                      alt={product.title}
                    />
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        minHeight: 140,
                      }}
                    >
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {product.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          mb: 1,
                        }}
                      >
                        {product.description}
                      </Typography>
                      <Box sx={{ mt: "auto" }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          {Array.isArray(product.size)
                            ? product.size.join(" | ")
                            : product.size}
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            mt: 0.5,
                            fontWeight: 700,
                            color: "#2e7d32",
                          }}
                        >
                          ${product.price.toFixed(2)}
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions
                      sx={{ justifyContent: "space-between", px: 2, pb: 2 }}
                    >
                      <Tooltip title="Remove from Favorites">
                        <IconButton
                          color="error"
                          onClick={() => handleRemove(product.productid)}
                        >
                          <DeleteForeverIcon />
                        </IconButton>
                      </Tooltip>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleViewDetails(product)}
                        sx={{
                          textTransform: "capitalize",
                          borderColor: "#4CAF50",
                          color: "#4CAF50",
                          fontWeight: 600,
                          "&:hover": {
                            backgroundColor: "#4CAF50",
                            color: "#fff",
                            borderColor: "#4CAF50",
                          },
                        }}
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default FavoriteProducts;
