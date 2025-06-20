"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, Container, Typography, Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import axios from "axios";
import { category } from "../types/cat";

// Shop All product info
const shopAll = {
  title: "Shop All Products",
  img: "/logos/shopall.png",
  href: "/products",
};

export default function Categories() {
  const [cats, setcats] = useState<category[]>([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/categories").then((result) => {
      setcats(result.data);
    });
  }, []);

  return (
    <Container maxWidth="lg">
      {/* Main Categories */}
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
                  src={c.images}
                  alt={c.title}
                  sx={{
                    width: 120,
                    height: 120,
                    mb: 2,
                    border: "4px solid",
                    borderColor: "primary.main",
                    backgroundColor: "#fff",
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

      {/* Shop All Section */}
      <Box mt={10} textAlign="center">
        <Link href={shopAll.href} style={{ textDecoration: "none" }}>
          <Box
            sx={{
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              px: "37%",
              py: 3,
              borderRadius: 8,
              backgroundColor: "primary.light",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "primary.main",
                transform: "scale(1.05)",
              },
            }}
          >
            <Avatar
              src={shopAll.img}
              alt={shopAll.title}
              sx={{
                width: 100,
                height: 100,
                mb: 1,
                border: "3px solid white",
                backgroundColor: "#fff",
              }}
            />
            <Typography
              variant="h6"
              color="white"
              fontWeight={600}
              sx={{ mt: 1 }}
            >
              {shopAll.title}
            </Typography>
          </Box>
        </Link>
      </Box>
    </Container>
  );
}

