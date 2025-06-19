// app/page.tsx
'use client';

import React from 'react';
import { Box, Typography, Button, Container, Grid } from '@mui/material';
import Categories from '../components/Categories';
import ProductCard from '../components/ProductCard';
import WhyChoose from '../components/WhyChoose';

export default function HomePage() {
  const featured = [
    {
      id: '1',
      title: 'Organic Avocado Oil',
      price: 12.99,
      image: '/images/avocado-oil.jpg',
      category: 'Vitamins & Supplements',
    },
    {
      id: '2',
      title: 'Avocado Juice Box',
      price: 4.99,
      image: '/images/juice.jpg',
      category: 'Food & Beverages',
    },
    {
      id: '3',
      title: 'Avocado Hair Mask',
      price: 9.99,
      image: '/images/hair-mask.jpg',
      category: 'Beauty & Personal Care',
    },
  ];
  

  return (
    <main>
      {/* Hero */}
      <Box component="section" sx={{ bgcolor: 'secondary.main', color: '#fff', py: 8 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h2" gutterBottom>Welcome to Avocado</Typography>
          <Typography variant="subtitle1" sx={{ mb: 4 }}>
            Fresh, Healthy &amp; Organic Products Delivered to Your Doorstep
          </Typography>
          <Button variant="contained" size="large">Shop Now</Button>
        </Container>
      </Box>

      {/* Categories */}
      <Box component="section" sx={{ py: 6 }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 500 }}>
            Categories You’ll Love
          </Typography>
          <Categories />
        </Container>
      </Box>

      {/* Featured Products */}
      <Box component="section" sx={{ py: 6 }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 500 }}>
            Featured Products
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {featured.map((p) => (
              <Grid item key={p.id} xs={12} sm={6} md={4}>
                <ProductCard {...p} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Why Choose */}
      <Box component="section" sx={{ py: 6 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
         
          <WhyChoose />
        </Container>
      </Box>
    </main>
  );
}