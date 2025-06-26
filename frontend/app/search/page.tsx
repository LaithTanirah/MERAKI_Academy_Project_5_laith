"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Container,
  Grid,
  Typography,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  Button,
} from "@mui/material";
import axios from "axios";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!query) return;

    setLoading(true);
    axios
      .get(`http://localhost:5000/api/products/search?query=${encodeURIComponent(query)}`)
      .then((res) => setResults(res.data || []))
      .catch((err) => console.error("Search error:", err))
      .finally(() => setLoading(false));
  }, [query]);

  const handleViewDetails = (productId: number) => {
    router.push(`/productDetails/${productId}`);
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
            🔍 Search Results
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
            Showing results for: <strong>"{query}"</strong>
          </Typography>
        </Box>

        {loading ? (
          <Box textAlign="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : results.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Typography variant="h6" color="text.secondary" textAlign="center">
              😔 No products matched your search.
            </Typography>
          </motion.div>
        ) : (
          <Grid container spacing={4}>
            {results.map((product: any) => (
              <Grid item key={product.id} xs={12} sm={6} md={4}>
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
                      height="180"
                      image={`/images/${product.images?.[0] || "placeholder.jpg"}`}
                      alt={product.title}
                    />
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
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
                      <Box mt="auto">
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
                          ${product.price?.toFixed(2)}
                        </Typography>
                      </Box>
                    </CardContent>
                    <Box sx={{ p: 2, pt: 0 }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => handleViewDetails(product.id)}
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
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
