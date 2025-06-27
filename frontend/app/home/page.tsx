"use client";

import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import {
  Box,
  Typography,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import Slider from "react-slick";
import Categories from "../../components/Categories";
import WhyChoose from "../../components/WhyChoose";
import Footer from "../../components/Footer";
import axios from "axios";
import { Product } from "../../types/product";
import ShopHero from "@/components/ShopHero";

interface TokenPayload {
  userId: string;
  role_id: number;
}

export default function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        if (decoded.role_id === 1) {
          router.replace("/admin/dashboard");
        }
      } catch (err) {
        console.error("Invalid token");
      }
    }
  }, []);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products").then((result) => {
      setProducts(result.data);
    });
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
  };

  return (
    <main style={{ backgroundColor: "#f1fef4", minHeight: "100vh" }}>
      <ShopHero />

 

      <Box component="section" sx={{ py: 8, bgcolor: "#f4fff8" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h5"
            fontWeight={600}
            sx={{ mb: 4, textAlign: "center" }}
          >
            Categories You’ll Love
          </Typography>
          <Categories />
        </Container>
      </Box>

      <Box
        component="section"
        sx={{
          py: 4,
          px: 0,
          mt: 0,
          backgroundColor:"-moz-initial",
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 1, md: 0,backgroundColor:"-moz-initial" } }}>
          <Box
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              border: "2px solid #ccc",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              position: "relative",
              "& .slick-dots": {
                bottom: 10,
                "& li": {
                  margin: "0 6px",
                  "& button": {
                    "&:before": {
                      fontSize: "10px",
                      color: "#bbb",
                      opacity: 1,
                    },
                  },
                  "&.slick-active button:before": {
                    color: theme.palette.primary.main,
                  },
                },
              },
            }}
          >
            <Slider {...sliderSettings}>
              {products.map((product: Product) => (
                <NextLink key={product.id} href={`/category/${product.id}`} passHref>
                  <Box
                    component="a"
                    sx={{
                      display: "block",
                      position: "relative",
                      height: { xs: 300, md: 450 },
                      backgroundImage: `url(/images/${product.images[0]})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      color: "#fff",
                      textDecoration: "none",
                      cursor: "pointer",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(0,0,0,0.4)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        px: 2,
                        textAlign: "center",
                      }}
                    >
                      <Typography
                        variant="h4"
                        fontWeight={700}
                        gutterBottom
                        sx={{ textShadow: "1px 1px 4px rgba(0,0,0,0.8)" }}
                      >
                        {product.title}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        sx={{ textShadow: "1px 1px 3px rgba(0,0,0,0.7)" }}
                      >
                        {product.category}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          backgroundColor: "primary.main",
                          px: 2,
                          py: 0.5,
                          borderRadius: 2,
                          fontWeight: "bold",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                        }}
                      >
                        {product.price} JOD
                      </Typography>
                    </Box>
                  </Box>
                </NextLink>
              ))}
            </Slider>
          </Box>
        </Container>
      </Box>

      <Box
        component="section"
        sx={{
          pt: 10,
          pb: 5,
          backgroundImage: "linear-gradient(rgba(240, 255, 240,0.9), #a5d6a7)",
          color: "text.primary",
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 6 }}>
            Why Choose Us
          </Typography>
          <WhyChoose />
        </Container>
      </Box>

      <Footer />
    </main>
  );
}
