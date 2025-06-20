"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  fetchProductsByCategoryId,
  fetchCategoryById,
} from "../../../services/productService";
import { Product } from "../../../types/product";
import ProductCard from "../../../components/ProductCard";
import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";
import Typography from "@mui/joy/Typography";
import Container from "@mui/joy/Container";

export default function CategoryProductsPage() {
  const { id } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryTitle, setCategoryTitle] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProductsByCategoryId(id as string)
        .then(setProducts)
        .catch((err) => setError(err.message));

      fetchCategoryById(id as string)
        .then((data) => setCategoryTitle(data.title))
        .catch((err) => console.error("Failed to load category title", err));
    }
  }, [id]);

  if (error) {
    return (
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Typography color="danger" fontSize="lg">
          Error loading category products: {error}
        </Typography>
      </Box>
    );
  }

  if (!products.length) {
    return (
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Typography fontSize="lg">
          No products found in this category.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #f1fbe5, #c3e8c1)",
        py: 6,
      }}
    >
      <Container maxWidth="xl">
        <Typography
          level="h1"
          textAlign="center"
          sx={{
            fontWeight: 900,
            fontSize: { xs: "2rem", md: "2.8rem" },
            color: "#1e402f",
            fontFamily: "Public Sans, Inter, sans-serif",
            letterSpacing: "-0.5px",
            mb: 5,
            textTransform: "capitalize",
          }}
        >
          Shop {categoryTitle}
        </Typography>

        <Grid container spacing={4} justifyContent="center">
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
