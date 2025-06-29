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
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [cartId, setCartId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);
  }, []);

  useEffect(() => {
    if (!token) return;
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      setUserId(decoded.userId);
    } catch {
      setUserId(null);
    }
  }, [token]);

  useEffect(() => {
    if (!userId || !token) return;
    axios
      .get(`/cart/getAllCartByIsDeletedFalse/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const carts = res.data.cart ?? [];
        setCartId(carts[0]?.id ?? null);
      })
      .catch(() => setError("Failed to fetch cart."));
  }, [userId, token]);

  useEffect(() => {
    if (!cartId || !token) return;
    axios
      .get(`/cartProduct/cart/${cartId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res.data.result);
        
        setCartItems(res.data.result);
        setError(null);
      })
      .catch(() => setError("Failed to load cart items."));
  }, [cartId, token]);

  console.log(cartItems);

  const itemCount = cartItems.length;
  console.log(itemCount);
  
  return (
    <IconButton color="inherit" component={Link} href="/cart">
      <Badge badgeContent={itemCount} color="secondary">
        <ShoppingCartIcon />
      </Badge>
    </IconButton>
  );
}
