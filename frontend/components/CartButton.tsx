// components/CartButton.tsx
'use client';

import React from 'react';
import { IconButton, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Link from 'next/link';

export default function CartButton() {
  const itemCount = 2; 
  return (
    <IconButton color="inherit" component={Link} href="/cart">
      <Badge badgeContent={itemCount} color="secondary">
        <ShoppingCartIcon />
      </Badge>
    </IconButton>
  );
}
