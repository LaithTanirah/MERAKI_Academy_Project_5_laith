"use client";

import React from "react";
import Link from "next/link";
import { Avatar, Container, Typography, Box } from "@mui/material";
import Grid from "@mui/material/Grid";

const cats = [
  {
    id: 1,
    title: "Vitamins & Supplements",
    img: "/logos/vitamins.png",
  },
  {
    id: 2,
    title: "Food & Beverages",
    img: "/logos/food.png",
  },
  {
    id: 3,
    title: "Beauty & Personal Care",
    img: "/logos/beauty.png",
  },
  {
    id: 4,
    title: "Active Lifestyle & Fitness",
    img: "/logos/fitness.png",
  },
  {
    id: 5,
    title: "Pet Supplies",
    img: "/logos/pet.png",
  },
  {
    title: "Shop All",
    img: "/logos/shopall.png",
    href: "/products",
  },
];

export default function Categories() {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={4} justifyContent="center">
        {cats.map((c) => (
          <Grid key={c.title} xs={6} sm={4} md={2} sx={{ textAlign: "center" }}>
            <Link
              href={c.href ? c.href : `/category/${c.id}`}
              style={{ textDecoration: "none" }}
            >
              <Box
                sx={{
                  display: "block",
                  cursor: "pointer",
                  "& img": {
                    transition: "transform 0.3s ease-in-out",
                  },
                  "&:hover img": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                <Avatar
                  src={c.img}
                  alt={c.title}
                  sx={{
                    width: 120,
                    height: 120,
                    mx: "auto",
                    mb: 1,
                    border: "4px solid",
                    borderColor: "primary.main",
                  }}
                />
                <Typography variant="body2" color="text.primary">
                  {c.title}
                </Typography>
              </Box>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
