"use client";

import React from "react";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Link from "next/link";

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export default function ProductCard({
  id,
  title,
  description,
  price,
  image,
  category,
}: ProductCardProps) {
  return (
    <Card
      sx={{
        maxWidth: "100%",
        borderRadius: 4,
        boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(3px)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
        },
      }}
    >
      <CardActionArea component={Link} href={`/products/${id}`}>
        <CardMedia
          component="img"
          height="200"
          image={image}
          alt={title}
          sx={{
            objectFit: "cover",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" fontWeight={600}>
            {title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              height: 40,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {description}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            fontStyle="italic"
            sx={{ mt: 1, display: "block" }}
          >
            Category: {category}
          </Typography>
          <Typography
            variant="h6"
            color="success.main"
            sx={{ mt: 1, fontWeight: 700 }}
          >
            ${price.toFixed(2)}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button
          component={Link}
          href={`/products/${id}`}
          size="medium"
          fullWidth
          variant="contained"
          sx={{
            textTransform: "capitalize",
            fontWeight: 600,
            backgroundColor: "#4CAF50",
            "&:hover": {
              backgroundColor: "#388E3C",
            },
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}
