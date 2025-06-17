// components/Navbar.tsx
'use client';

import React from 'react';
import { AppBar, Toolbar, Box, IconButton, Typography, alpha } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import SearchBar from './SeachBar';
import SignMenu from './SignMenu';
import CartButton from './CartButton';

export default function Navbar() {
  return (
    <AppBar position="sticky" color="primary" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton color="inherit"><MenuIcon /></IconButton>
          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{ textDecoration: 'none', color: 'inherit', fontWeight: 700 }}
          >
            Avocado
          </Typography>
        </Box>

        <SearchBar />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            component={Link}
            href="/products"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              '&:hover': { color: alpha('#fff', 0.7) }
            }}
          >
            Products
          </Typography>
          <Typography
            component={Link}
            href="/favorites"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              '&:hover': { color: alpha('#fff', 0.7) }
            }}
          >
            Favorites
          </Typography>
          <SignMenu />
          <CartButton />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
