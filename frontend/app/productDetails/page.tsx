// components/ProductCard.tsx
'use client';

import React from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Link from 'next/link';

interface ProductCardProps {
  id: string;
  title: string;
  discreption: string;
  size : string[];
  price: number;
  image: string;
}

export default function ProductCard({
  id,
  title,
  discreption,
  size,
  price,
  image,
}: ProductCardProps) {
  return (
    <Card
      sx={{
        maxWidth: 345,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      <CardActionArea component={Link} href={`/productDetails/${id}`}>
        <CardMedia component="img" height="180" image={image} alt={title} />
        <CardContent>
          <Typography gutterBottom variant="h6">{title}</Typography>
           <Typography gutterBottom variant="h6">{discreption}</Typography>
            <Typography gutterBottom variant="h6">{size}</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            ${price.toFixed(2)}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button component={Link} href={`/productDetails/${id}`} size="small" color="primary">
          add  to cart
        </Button>
              <Button component={Link} href={`/productDetails/${id}`} size="small" color="primary">
          add to favorite
        </Button>
          
      </CardActions>
    </Card>
  );
}
