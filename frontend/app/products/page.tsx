"use client";

import Container from "@mui/joy/Container";
import Typography from "@mui/joy/Typography";
import Grid from "@mui/joy/Grid";
import Box from "@mui/joy/Box";
import { useEffect, useState } from "react";
import { fetchProducts } from "../../services/productService";
import { Product } from "../../types/product";
import ProductCard from "../../components/ProductCard";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((err) => setError(err.message));
  }, []);
  console.log(products);
  

  if (error)
    return (
      <Typography color="danger" textAlign="center" py={2}>
        Error: {error}
      </Typography>
    );

  if (!products.length)
    return (
      <Typography textAlign="center" py={2}>
        Loading…
      </Typography>
    );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #c8facc, #5f7f67)",
        py: 6,
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            level="h1"
            sx={{
              fontWeight: 900,
              fontSize: { xs: "2.2rem", md: "3rem" },
              color: "#14342B",
              fontFamily: "Public Sans, Inter, sans-serif",
              letterSpacing: "-0.5px",
              textTransform: "capitalize",
            }}
          >
          Discover Our Best-Selling Products
          </Typography>

          <Typography
            level="body-md"
            sx={{
              mt: 1,
              maxWidth: "640px",
              margin: "0 auto",
              color: "text.secondary",
              fontSize: { xs: "0.95rem", sm: "1.05rem" },
            }}
          >
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ justifyContent: "center" }}>
          {products.map((p) => (
            <Grid key={p.id} xs={12} sm={6} md={4} lg={3}>
              <ProductCard
                id={String(p.id)}
                title={p.title}
                description={p.description}
                price={p.price}
                image={`/images/${p.images?.[0] || "placeholder.jpg"}`}
                category={p.category}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}