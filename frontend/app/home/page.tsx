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
import PromotionalBanner from "@/components/PromotionalBanner";

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

      <PromotionalBanner />

      <Box component="section" sx={{ py: 8, bgcolor: "#f4fff8" }}>
        <Container maxWidth="lg">
          <Categories />
        </Container>
      </Box>

      {/* Slider Section */}
      <Box sx={{ py: 4, px: 0, mt: 0, backgroundColor: "transparent" }}>
        <Container maxWidth="lg" sx={{ px: { xs: 1, md: 0 } }}>
          <Box
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              border: "2px solid #e0e0e0",
              boxShadow: "0 12px 32px rgba(0,0,0,0.1)",
              position: "relative",
              "& .slick-dots": {
                bottom: 15,
                "& li": {
                  margin: "0 5px",
                  "& button": {
                    "&:before": {
                      fontSize: "12px",
                      color: "#888",
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
                <NextLink
                  key={product.id}
                  href={`/category/${product.id}`}
                  passHref
                >
                  <Box
                    component="a"
                    sx={{
                      display: "block",
                      position: "relative",
                      height: { xs: 300, md: 500 },
                      backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.2)), url(/images/${product.images[0]})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      textDecoration: "none",
                      borderRadius: 4,
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
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        px: 2,
                        textAlign: "center",
                        color: "#fff",
                      }}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                      >
                        <Typography
                          variant="h3"
                          fontWeight={800}
                          gutterBottom
                          sx={{
                            textShadow: "2px 2px 8px rgba(0,0,0,0.8)",
                          }}
                        >
                          {product.title}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          gutterBottom
                          sx={{
                            textShadow: "1px 1px 6px rgba(0,0,0,0.7)",
                          }}
                        >
                          {product.category}
                        </Typography>
                        <Box
                          component="button"
                          sx={{
                            mt: 2,
                            backgroundColor: theme.palette.primary.main,
                            color: "#fff",
                            border: "none",
                            borderRadius: "30px",
                            px: 3,
                            py: 1,
                            fontWeight: "bold",
                            fontSize: "1rem",
                            cursor: "pointer",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              backgroundColor: theme.palette.primary.dark,
                              transform: "scale(1.05)",
                            },
                          }}
                        >
                          {product.price} JOD
                        </Box>
                      </motion.div>
                    </Box>
                  </Box>
                </NextLink>
              ))}
            </Slider>
          </Box>
        </Container>
      </Box>

      {/* Why Choose Section */}
      <Box
        component="section"
        sx={{
          m: 0,
          p: 0,
          overflow: "hidden",
          backgroundColor: "transparent",
        }}
      >
        <WhyChoose />
      </Box>

      <Footer />
    </main>
  );
}
