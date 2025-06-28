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
  Typography,
  Badge,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const drawerWidth = 260;

export default function DeliverySidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [userName, setUserName] = useState("");

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
      variant={isMobile ? "temporary" : "permanent"}
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backdropFilter: "blur(8px)",
          background: "rgba(38, 166, 91, 0.85)",
          color: "#fff",
          borderRight: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "2px 0 12px rgba(0,0,0,0.3)",
        },
      }}
    >
      <Toolbar sx={{ justifyContent: "center", py: 2 }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar
              src="/images/avocado-icon.png"
              sx={{ width: 38, height: 38, bgcolor: "#fff" }}
            />
            <Typography fontWeight="bold" fontSize="1.3rem">
              Avocado Delivery
            </Typography>
          </Box>
        </motion.div>
      </Toolbar>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.3)" }} />
      <List>
        <ListItem
          button
          onClick={() => router.push("/delivery")}
          selected={pathname === "/delivery"}
          sx={{
            "&:hover": {
              background: "rgba(255,255,255,0.1)",
            },
            background: pathname === "/delivery" ? "rgba(255,255,255,0.15)" : "",
          }}
        >
          <ListItemIcon sx={{ color: "#fff" }}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText
            primary="Dashboard"
            primaryTypographyProps={{ fontWeight: "500" }}
          />
        </ListItem>
        <ListItem
          button
          onClick={() => router.push("/delivery")}
          selected={pathname === "/delivery"}
          sx={{
            "&:hover": {
              background: "rgba(255,255,255,0.1)",
            },
            background: pathname === "/delivery" ? "rgba(255,255,255,0.15)" : "",
          }}
        >
          <ListItemIcon sx={{ color: "#fff" }}>
            <LocalShippingIcon />
          </ListItemIcon>
          <ListItemText
            primary="My Orders"
            primaryTypographyProps={{ fontWeight: "500" }}
          />
        </ListItem>
      </List>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.3)", my: 2 }} />
      <List>
        <ListItem
          button
          onClick={logout}
          sx={{
            "&:hover": {
              background: "rgba(255,255,255,0.1)",
            },
          }}
        >
          <ListItemIcon sx={{ color: "#fff" }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{ fontWeight: "500" }}
          />
        </ListItem>
      </List>
      <Box
        mt="auto"
        p={2}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Avatar
          sx={{
            width: 50,
            height: 50,
            bgcolor: "#81c784",
            mb: 1,
          }}
        >
          {userName?.charAt(0).toUpperCase()}
        </Avatar>
        <Badge
          color="success"
          badgeContent="online"
          sx={{
            "& .MuiBadge-badge": {
              background: "#4caf50",
              color: "#fff",
              fontSize: "0.65rem",
            },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#e8f5e9",
              fontWeight: 500,
            }}
          >
            {userName}
          </Typography>
        </Badge>
      </Box>
    </Drawer>
  );
}
