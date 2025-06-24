// components/AdminSidebar.tsx
"use client";

import Link from "next/link";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";

export default function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Drawer open={open} onClose={onClose} anchor="left">
      <Box
        sx={{
          width: 250,
          height: "100%",
          bgcolor: "#fff",
          display: "flex",
          flexDirection: "column",
        }}
        role="presentation"
        onClick={onClose}
      >
        <Box p={2} textAlign="center">
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#2e7d32" }}>
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

          {/* new Users link */}
          <ListItem component={Link} href="/admin/users" button>
            <ListItemIcon sx={{ color: "#2e7d32" }}>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Users" />
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
