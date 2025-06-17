'use client';

import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReplayIcon from '@mui/icons-material/Replay';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

export default function WhyChoose() {
  const items = [
    { icon: <LocalShippingIcon fontSize="large" color="primary" />, title: 'Free Shipping',   subtitle: 'On orders over $50 anywhere.' },
    { icon: <ReplayIcon       fontSize="large" color="primary" />, title: 'Easy Returns',    subtitle: '30-day money-back guarantee.' },
    { icon: <SupportAgentIcon fontSize="large" color="primary" />, title: '24/7 Support',     subtitle: 'We’re here to help, anytime.' },
  ];

  return (
    <>
      <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 500 }}>
        Why Choose Avocado?
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {items.map((i) => (
          <Grid key={i.title} item xs={12} sm={6} md={4}>
            <Paper
              elevation={1}
              sx={{ p: 3, textAlign: 'center', height: '100%' }}
            >
              <Box sx={{ mb: 1 }}>{i.icon}</Box>
              <Typography variant="h6" gutterBottom>
                {i.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {i.subtitle}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
