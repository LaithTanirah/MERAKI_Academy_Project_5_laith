"use client";

import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Toolbar,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const drawerWidth = 240;

export default function DeliverySidebar() {
  const router = useRouter();
  const [userName, setUserName] = useState("");

  // Load delivery user info
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUserName(`${user.first_name || "Delivery"} ${user.last_name || "User"}`);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#4caf50",
          color: "#fff",
        },
      }}
    >
      <Toolbar>
        <Typography fontWeight="bold" fontSize="1.2rem">
          Avocado Delivery
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: "#66bb6a" }} />
      <List>
        <ListItem button onClick={() => router.push("/delivery")}>
          <ListItemIcon sx={{ color: "#fff" }}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

        <ListItem button onClick={() => router.push("/delivery")}>
          <ListItemIcon sx={{ color: "#fff" }}>
            <LocalShippingIcon />
          </ListItemIcon>
          <ListItemText primary="My Orders" />
        </ListItem>
      </List>

      <Divider sx={{ borderColor: "#66bb6a", my: 2 }} />

      <List>
        <ListItem button onClick={logout}>
          <ListItemIcon sx={{ color: "#fff" }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>

      <Box mt="auto" p={2}>
        <Typography variant="body2" color="#c8e6c9">
          Logged in as: {userName}
        </Typography>
      </Box>
    </Drawer>
  );
}
