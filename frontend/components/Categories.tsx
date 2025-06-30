"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Avatar,
  Container,
  Typography,
  Box,
  Button,
  Grid,
} from "@mui/material";
import axios from "axios";
import { category } from "../types/cat";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

const shopAll = {
  title: "Shop All Products",
  img: "/logos/shopall.png",
  href: "/products",
};

export default function Categories() {
  const [cats, setcats] = useState<category[]>([]);

  useEffect(() => {
    axios.get("https://avocado-z31n.onrender.com/api/categories").then((result) => {
      setcats(result.data);
    });
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography
        variant="h4"
        fontWeight={700}
        textAlign="center"
        mb={1}
        color="text.primary"
        letterSpacing={1}
      >
        Categories You’ll Love
      </Typography>
      <Typography
        variant="subtitle1"
        textAlign="center"
        color="text.secondary"
        mb={4}
      >
        Discover our best-selling categories
      </Typography>

      <Grid container spacing={5} justifyContent="center">
        {cats.map((c) => (
          <Grid
            key={c.title}
            item
            xs={6}
            sm={4}
            md={2}
            sx={{ textAlign: "center" }}
          >
            <Link
              href={c.href ? c.href : `/category/${c.id}`}
              style={{ textDecoration: "none" }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                <Avatar
                  src={c.image}
                  alt={c.title}
                  sx={{
                    width: 120,
                    height: 120,
                    mb: 2,
                    border: "4px solid",
                    borderColor: "primary.main",
                    backgroundColor: "#fff",
                    boxShadow: 3,
                  }}
                />
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  color="text.primary"
                >
                  {c.title}
                </Typography>
              </Box>
            </Link>
          </Grid>
        ))}
      </Grid>

      <Box mt={8} textAlign="center">
        <Link href={shopAll.href} style={{ textDecoration: "none" }}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<ShoppingBagIcon />}
            sx={{
              borderRadius: 4,
              borderWidth: 2,
              borderColor: "primary.main",
              color: "primary.main",
              fontWeight: 700,
              px: 4,
              py: 1.5,
              fontSize: "1rem",
              backgroundColor: "background.paper",
              boxShadow: 2,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "primary.main",
                color: "#fff",
              },
            }}
          >
            {shopAll.title}
          </Button>
        </Link>
      </Box>
    </Container>
  );
}
