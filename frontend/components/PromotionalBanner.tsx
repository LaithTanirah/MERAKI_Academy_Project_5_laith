"use client";

import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const images = [
  "/images/offer1.jpg",
  "/images/offer2.jpg",
  "/images/offer3.jpg",
];

export default function PromoBanner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      sx={{
        backgroundColor:"-moz-initial",
        position: "relative",
        height: { xs: 300, md: 420 },
        my: 8,
        overflow: "hidden",
        borderRadius: 3,
        boxShadow: "0 16px 40px rgba(0,0,0,0.2)",
      }}
    >
      {/* نخلي كل الصور مكدسة فوق بعض */}
      {images.map((img, i) => (
        <motion.div
          key={i}
          animate={{ opacity: i === index ? 1 : 0 }}
          transition={{ duration: 1.2 }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${img})`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
            filter: "brightness(0.65)",
          }}
        />
      ))}

      {/* gradient overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.5) 10%, rgba(0,0,0,0.2) 90%)",
          zIndex: 1,
        }}
      />

      {/* النص */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          px: 2,
          color: "#fff",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 900,
            textTransform: "uppercase",
            textShadow: "0 6px 16px rgba(0,0,0,0.9)",
            fontSize: { xs: "1.8rem", md: "2.6rem" },
            letterSpacing: 1,
          }}
        >
          Avocado Organic Offers
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            mt: 2,
            maxWidth: 700,
            fontWeight: 400,
            textShadow: "0 3px 10px rgba(0,0,0,0.7)",
            fontSize: { xs: "0.95rem", md: "1.1rem" },
            lineHeight: 1.6,
          }}
        >
          Taste the best organic avocado products — fresh, healthy, and
          sustainably sourced. Don't miss out on our special seasonal deals!
        </Typography>
      </Box>
    </Box>
  );
}
