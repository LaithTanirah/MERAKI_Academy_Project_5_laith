"use client";

import { Box, Typography, Button, Container } from "@mui/material";
import { motion } from "framer-motion";

export default function ShopHero() {
  return (
    <Box
      sx={{
        background: "linear-gradient(to bottom right, #f5fdf5, #e8f5e9)",
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
        {/* Circular Video with shadow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Box
            sx={{
              width: { xs: 260, sm: 320, md: 400 },
              height: { xs: 260, sm: 320, md: 400 },
              borderRadius: "50%",
              overflow: "hidden",
              border: "6px solid #aed581",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
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

        {/* Text Section */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ maxWidth: 500 }}
        >
          <Typography
            variant="h3"
            fontWeight={800}
            color="primary"
            gutterBottom
            sx={{
              textAlign: { xs: "center", md: "left" },
              fontSize: { xs: "2rem", md: "2.5rem" },
            }}
          >
            Your Organic Journey Starts Here 🌱
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3, textAlign: { xs: "center", md: "left" }, lineHeight: 1.7 }}
          >
            Shop fresh organic products at amazing prices and get them delivered to your doorstep in no time.
            A convenient and reliable experience every day.
          </Typography>

          <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: "10px",
                boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
                transition: "all 0.3s",
                "&:hover": {
                  backgroundColor: "#558b2f",
                },
              }}
            >
              Shop Now
            </Button>
            <Button
              variant="text"
              sx={{
                mt: 2,
                ml: 2,
                color: "#4caf50",
                fontWeight: 500,
                textTransform: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              {/* Learn more about Avocado → */}
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
