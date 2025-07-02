// components/CartButton.tsx
"use client";

import React, { useEffect, useState } from "react";
import { IconButton, Badge } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

interface TokenPayload {
  userId: number;
}

interface CartItem {
  productid: number;
  quantity: number;
}

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
