'use client';

import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Avatar,
} from '@mui/material';

export default function Footer() {
  return (
    <Box sx={{ bgcolor: '#f5f5f5', color: '#222', mt: 8, pt: 4, pb: 0 }}>
      <Container maxWidth="lg">
        {/* Main Links Grid */}
        <Grid container spacing={4} justifyContent="center">
          {/* Shop */}
          <Grid item xs={12} sm={6} md={2.4}>
            <Typography fontWeight="bold" gutterBottom>Shop</Typography>
            <Link href="/products" underline="none" display="block" color="inherit" sx={{ mb: 0.7 }}>Products</Link>
            <Link href="/cart" underline="none" display="block" color="inherit" sx={{ mb: 0.7 }}>Cart</Link>
            <Link href="/category" underline="none" display="block" color="inherit" sx={{ mb: 0.7 }}>Categories</Link>
            <Link href="#" underline="none" display="block" color="inherit" sx={{ mb: 0.7 }}>Gift Cards</Link>
            <Link href="#" underline="none" display="block" color="inherit">Accessories</Link>
          </Grid>

          {/* Resources */}
          <Grid item xs={12} sm={6} md={2.4}>
            <Typography fontWeight="bold" gutterBottom>Resources</Typography>
            <Link href="#" underline="none" display="block" color="inherit" sx={{ mb: 0.7 }}>Blog</Link>
            <Link href="#" underline="none" display="block" color="inherit" sx={{ mb: 0.7 }}>Buyer’s Guide</Link>
            <Link href="#" underline="none" display="block" color="inherit" sx={{ mb: 0.7 }}>Training Tips</Link>
            <Link href="#" underline="none" display="block" color="inherit" sx={{ mb: 0.7 }}>Gear Reviews</Link>
            <Link href="#" underline="none" display="block" color="inherit">FAQs</Link>
          </Grid>

          {/* Company */}
          <Grid item xs={12} sm={6} md={2.4}>
            <Typography fontWeight="bold" gutterBottom>Company</Typography>
            <Link href="#" underline="none" display="block" color="inherit" sx={{ mb: 0.7 }}>About Avocado</Link>
            <Link href="#" underline="none" display="block" color="inherit" sx={{ mb: 0.7 }}>Careers</Link>
            <Link href="#" underline="none" display="block" color="inherit" sx={{ mb: 0.7 }}>Partnership</Link>
            <Link href="#" underline="none" display="block" color="inherit" sx={{ mb: 0.7 }}>Privacy Policy</Link>
            <Link href="#" underline="none" display="block" color="inherit">Terms of Service</Link>
          </Grid>

          {/* Help */}
          <Grid item xs={12} sm={6} md={2.4}>
            <Typography fontWeight="bold" gutterBottom>Help</Typography>
            <Link href="#" underline="none" display="block" color="inherit" sx={{ mb: 0.7 }}>Contact Us</Link>
            <Link href="#" underline="none" display="block" color="inherit" sx={{ mb: 0.7 }}>Shipping & Returns</Link>
            <Link href="#" underline="none" display="block" color="inherit" sx={{ mb: 0.7 }}>Warranty Info</Link>
            <Link href="#" underline="none" display="block" color="inherit" sx={{ mb: 0.7 }}>Size Guide</Link>
          </Grid>

          {/* Connect */}
          <Grid item xs={12} sm={6} md={2.4}>
            <Typography fontWeight="bold" gutterBottom>Connect</Typography>
            <Link href="#" underline="none" display="block" color="inherit" sx={{ mb: 0.7 }}>Instagram</Link>
            <Link href="#" underline="none" display="block" color="inherit" sx={{ mb: 0.7 }}>Facebook</Link>
            <Link href="#" underline="none" display="block" color="inherit" sx={{ mb: 0.7 }}>YouTube</Link>
            <Link href="#" underline="none" display="block" color="inherit" sx={{ mb: 0.7 }}>TikTok</Link>
            <Link href="#" underline="none" display="block" color="inherit">X (Twitter)</Link>
          </Grid>
        </Grid>

        {/* Founders Section */}
        <Box textAlign="center" mt={6} mb={2}>
          <Typography variant="subtitle1" color="text.primary" fontWeight={600} mb={2}>
            The website is fully developed and maintained by the Avocado team
          </Typography>
          <Box display="flex" justifyContent="center" gap={4}>
            {[
              { name: 'Mohammad', img: '/founders/mohammad.jpg' },
              { name: 'Laith', img: '/founders/laith.jpg' },
              { name: 'Hassan', img: '/founders/hassan.jpg' },
            ].map(({ name, img }, idx) => (
              <Box key={idx} textAlign="center">
                <Avatar
                  alt={name}
                  src={img}
                  sx={{ width: 62, height: 62, mx: 'auto', mb: 0.7 }}
                />
                <Typography variant="caption" color="#666" fontWeight="bold">{name}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Bottom Text */}
        <Box textAlign="center" mt={2} pb={2}>
          <Typography variant="body2" color="text.secondary">
            © 2025 Avocado. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
