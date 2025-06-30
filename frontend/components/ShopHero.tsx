"use client";

import { Box, Typography, Button, Container, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ShopHero() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(180deg, #121212 0%, #1e1e1e 100%)"
            : "linear-gradient(180deg, #2e7d32 0%, rgb(248, 252, 247) 100%)",
        py: { xs: 10, md: 14 },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "center",
          gap: { xs: 6, md: 14 },
          px: { xs: 2, sm: 6 },
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Box
            sx={{
              width: { xs: 260, sm: 320, md: 400 },
              height: { xs: 260, sm: 320, md: 400 },
              borderRadius: "50%",
              overflow: "hidden",
              border:
                theme.palette.mode === "dark"
                  ? "8px solid #66bb6a"
                  : "8px solid #66bb6a",
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 20px 50px rgba(0,0,0,0.9)"
                  : "0 20px 50px rgba(0,0,0,0.35)",
              mx: "auto",
              flexShrink: 0,
            }}
          >
            <video
              src="/shop-preview.mp4"
              autoPlay
              muted
              loop
              playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            >
              Your browser does not support the video tag.
            </video>
          </Box>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ maxWidth: 520 }}
        >
          <Typography
            variant="h2"
            fontWeight={900}
            color={theme.palette.mode === "dark" ? "#e0f2f1" : "#ffffff"}
            gutterBottom
            sx={{
              textAlign: { xs: "center", md: "left" },
              fontSize: { xs: "2rem", md: "2.75rem" },
              lineHeight: 1.2,
              textShadow:
                theme.palette.mode === "dark"
                  ? "1px 1px 6px rgba(0,0,0,0.8)"
                  : "1px 1px 6px rgba(0,0,0,0.4)",
            }}
          >
            Discover Fresh & Organic Avocado Products
          </Typography>

          <Typography
            variant="body1"
            color={theme.palette.mode === "dark" ? "#a5d6a7" : "#f1f8e9"}
            sx={{
              mb: 3,
              textAlign: { xs: "center", md: "left" },
              lineHeight: 1.8,
              textShadow:
                theme.palette.mode === "dark"
                  ? "0 0 4px rgba(255,255,255,0.2)"
                  : "0 0 4px rgba(0,0,0,0.3)",
              fontSize: { xs: "0.95rem", md: "1.1rem" },
            }}
          >
            Get healthy, sustainably sourced products delivered straight to your
            doorstep. Taste the difference today.
          </Typography>

          <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Link href="/products" passHref>
              <Button
                variant="contained"
                color="success"
                sx={{
                  mt: 2,
                  px: 4,
                  py: 1.5,
                  fontWeight: 700,
                  textTransform: "capitalize",
                  borderRadius: "30px",
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 4px 12px rgba(165, 214, 167, 0.7)"
                      : "0 4px 12px rgba(76,175,80,0.3)",
                }}
              >
                Shop Now
              </Button>
            </Link>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
