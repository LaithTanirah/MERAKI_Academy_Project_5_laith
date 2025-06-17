// components/SignMenu.tsx
'use client';

import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, Typography } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Link from 'next/link';

export default function SignMenu() {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const open = Boolean(anchor);

  return (
    <>
      <IconButton color="inherit" onClick={(e) => setAnchor(e.currentTarget)}>
        <AccountCircle />
        <Typography variant="body2" sx={{ ml: 0.5 }}>Sign In</Typography>
      </IconButton>
      <Menu
        anchorEl={anchor}
        open={open}
        onClose={() => setAnchor(null)}
        disableScrollLock
      >
        <MenuItem component={Link} href="/login" onClick={() => setAnchor(null)}>
          Login
        </MenuItem>
        <MenuItem component={Link} href="/register" onClick={() => setAnchor(null)}>
          Register
        </MenuItem>
      </Menu>
    </>
  );
}
