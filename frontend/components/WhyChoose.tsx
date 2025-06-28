'use client';

import React from 'react';
import { Box, Typography, Grid, Avatar, useTheme, Button } from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import StarOutlineIcon from '@mui/icons-material/StarOutline';

export default function WhyChoose() {
  const theme = useTheme();

  const stats = [
    { label: 'Success Stories', value: '215+', color: '#2e7d32' },
    { label: 'Delighted Clients', value: '98%', color: '#0277bd' },
    { label: 'Returning Customers', value: '80%', color: '#ef6c00' },
  ];

  const features = [
    { icon: <LocalShippingOutlinedIcon />, title: 'Free Shipping', desc: 'On orders over $50 anywhere.' },
    { icon: <ReplayOutlinedIcon />, title: 'Easy Returns', desc: '30-day money-back guarantee.' },
    { icon: <SupportAgentOutlinedIcon />, title: '24/7 Support', desc: 'We’re here to help, anytime.' },
    { icon: <CreditCardOutlinedIcon />, title: 'Secure Payments', desc: 'SSL encryption & fraud protection.' },
    { icon: <StarOutlineIcon />, title: 'Organic Quality', desc: 'Natural and organic products you can trust.' },
  ];

  return (
    <Box
      component="section"
      sx={{
        width: '100vw',
        py: { xs: 6, md: 10 },
        my: 6,
        overflowX: 'hidden',
        backgroundColor: '#e8f5e9',
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          display: 'flex',
          boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
          border: '1px solid rgba(0,0,0,0.05)',
          borderRadius: 4,
          overflow: 'hidden',
          color: '#263238',
        }}
      >
        {/* Left */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 3, md: 6 },
            backgroundImage: `url('/images/waves.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: '#fff',
          }}
        >
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
            About Avocado
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.6 }}>
            Avocado is your ultimate partner for healthy living. We deliver premium products with exceptional service that’s trusted by thousands of happy customers worldwide.
          </Typography>
          <Grid container spacing={3}>
            {stats.map((s, i) => (
              <Grid key={i} item xs={4}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>
                  {s.value}
                </Typography>
                <Typography variant="caption" sx={{ color: '#f0f0f0' }}>
                  {s.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Right */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 3, md: 6 },
            backgroundColor: '#ffffff',
            color: '#263238',
            borderLeft: `1px solid rgba(0,0,0,0.1)`,
          }}
        >
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
            Why Choose Us
          </Typography>
          <Grid container spacing={4}>
            {features.map((f, i) => (
              <Grid key={i} item xs={12} sm={6}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    '&:hover': {
                      transform: 'scale(1.03)',
                      transition: 'all 0.3s ease-in-out',
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.success.light,
                      color: '#fff',
                      boxShadow: 2,
                    }}
                  >
                    {f.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {f.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {f.desc}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#ef6c00',
                '&:hover': { backgroundColor: '#e65100' },
              }}
            >
              Learn More
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
