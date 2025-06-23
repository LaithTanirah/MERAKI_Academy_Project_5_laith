"use client";

import Link from "next/link";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
  Typography,
  Divider
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import LogoutIcon from "@mui/icons-material/Logout";

export default function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Drawer open={open} onClose={onClose} anchor="left">
      <Box
        sx={{
          width: 250,
          bgcolor: "#ffffff",
          height: "100%",
          color: "#2e7d32",
          display: "flex",
          flexDirection: "column",
        }}
        role="presentation"
        onClick={onClose}
      >
        <Box p={2} textAlign="center">
          <Typography variant="h6" sx={{ color: "#2e7d32", fontWeight: "bold" }}>
            🥑 Avocado Admin
          </Typography>
        </Box>
        <Divider />

        <List>
          <ListItem component={Link} href="/" button>
            <ListItemIcon sx={{ color: "#2e7d32" }}>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>

          <ListItem component={Link} href="/admin" button>
            <ListItemIcon sx={{ color: "#2e7d32" }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>

          <ListItem component={Link} href="/admin/product" button>
            <ListItemIcon sx={{ color: "#2e7d32" }}>
              <InventoryIcon />
            </ListItemIcon>
            <ListItemText primary="Products" />
          </ListItem>

          <ListItem component={Link} href="/admin/category" button>
            <ListItemIcon sx={{ color: "#2e7d32" }}>
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText primary="Categories" />
          </ListItem>

          <Divider sx={{ my: 1 }} />

          <ListItem
            button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
          >
            <ListItemIcon sx={{ color: "#c62828" }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}
