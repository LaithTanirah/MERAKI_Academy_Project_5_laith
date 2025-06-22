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
        maxWidth: 345,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
      }}
    >
      <CardActionArea component={Link} href={`/products/${id}`}>
        <CardMedia component="img" height="180" image={image} alt={title} />
        <CardContent>
          <Typography gutterBottom variant="h6">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}     
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {category}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            ${price.toFixed(2)}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button component={Link} href={`/products/${id}`} size="small" color="primary">
          View
        </Button>
      </CardActions>
    </Card>
  );
}
