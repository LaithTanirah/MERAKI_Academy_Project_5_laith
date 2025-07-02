"use client";

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  alpha,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import PersonIcon from "@mui/icons-material/Person";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Link from "next/link";
import SearchBar from "./SeachBar";
import CartButton from "./CartButton";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useThemeMode } from "./ThemeContext";

function AvocadoIcon({ size = 34, style = {} }) {
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        mr: 1,
        filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.2))",
        ...style,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <ellipse cx="20" cy="20" rx="16" ry="20" fill="#388e3c" />
        <ellipse cx="20" cy="22" rx="13" ry="16" fill="#2e7d32" />
        <ellipse cx="20" cy="26" rx="8.5" ry="9.5" fill="#f9eac0" />
        <ellipse cx="20" cy="27" rx="5" ry="6" fill="#ad7c51" />
        <ellipse cx="20" cy="28" rx="2" ry="2.5" fill="#6d4c41" />
      </svg>
    </Box>
  );
}

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const router = useRouter();
  const { darkMode, toggleDarkMode } = useThemeMode();

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  const iconBg = alpha("#FFFFFF", 0.12);
  const iconHoverBg = alpha("#FFFFFF", 0.25);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: darkMode
            ? "linear-gradient(90deg, #181818 0%, #222 100%)"
            : "linear-gradient(90deg, #388e3c 0%, #2e7d32 100%)",
          boxShadow: darkMode
            ? "0 6px 24px rgba(0,0,0,0.7)"
            : "0 6px 24px rgba(34, 139, 34, 0.2)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(10px)",
          zIndex: 1000,
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            minHeight: 80,
            px: { xs: 1, md: 4 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <motion.div whileTap={{ scale: 0.9 }}>
              <IconButton
                color="inherit"
                onClick={toggleDrawer(true)}
                sx={{
                  bgcolor: iconBg,
                  borderRadius: 2,
                  transition: "0.3s",
                  "&:hover": { bgcolor: iconHoverBg },
                }}
              >
                <MenuIcon />
              </IconButton>
            </motion.div>

            <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
             {/*<img
                src="logos/logo6.png"
                alt="Logo"
                style={{ width: 60, marginTop: 7 }}
              />  */} 
              <Typography
                variant="h5"
                component={Link}
                href="/home"
                sx={{
                  textDecoration: "none",
                  color: "#fff",
                  fontWeight: 900,
                  fontFamily: "'Poppins', sans-serif",
                  letterSpacing: 1.8,
                  fontSize: { xs: 22, md: 26 },
                  ml: 0.5,
                }}
              >
                Avocado
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{ flex: 1, maxWidth: 500, mx: 2 }}
            component={motion.div}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <SearchBar />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <motion.div whileHover={{ rotate: 20 }} whileTap={{ scale: 0.8 }}>
              <IconButton
                onClick={toggleDarkMode}
                sx={{
                  bgcolor: iconBg,
                  borderRadius: 2,
                  mr: 1,
                  boxShadow: "0 1px 8px rgba(0,0,0,0.12)",
                  "&:hover": { bgcolor: iconHoverBg },
                  transition: "all 0.2s",
                }}
                aria-label="toggle theme"
              >
                {darkMode ? (
                  <Brightness7Icon sx={{ color: "#ffe066", fontSize: 28 }} />
                ) : (
                  <Brightness4Icon sx={{ color: "#333", fontSize: 28 }} />
                )}
              </IconButton>
            </motion.div>

            {[
              ["/FavoriteProducts", <FavoriteBorderIcon key="fav" />],
              ["/cart", <CartButton key="cart" />],
            ].map(([href, icon], idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconButton
                  onClick={() => router.push(href)}
                  color="inherit"
                  sx={{
                    bgcolor: iconBg,
                    borderRadius: 2,
                    "&:hover": { bgcolor: iconHoverBg },
                  }}
                >
                  {icon}
                </IconButton>
              </motion.div>
            ))}

            <motion.div whileHover={{ rotate: 15 }} whileTap={{ rotate: 0 }}>
              <IconButton
                color="inherit"
                onClick={handleLogout}
                sx={{
                  bgcolor: iconBg,
                  borderRadius: 2,
                  "&:hover": { bgcolor: iconHoverBg },
                }}
              >
                <LogoutIcon />
              </IconButton>
            </motion.div>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            background: darkMode
              ? "#181818"
              : "linear-gradient(135deg, #2e7d32 20%, #388e3c 100%)",
            color: "#fff",
            borderTopRightRadius: 28,
            borderBottomRightRadius: 14,
            boxShadow: darkMode
              ? "0 6px 28px rgba(0,0,0,0.7)"
              : "0 6px 28px rgba(34, 139, 34, 0.2)",
            border: "none",
          },
        }}
      >
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 160 }}
        >
          <Box
            sx={{
              width: 260,
              height: "100%",
              px: 1,
            }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 70,
                fontWeight: 900,
                fontSize: 22,
                fontFamily: "'Poppins', sans-serif",
                borderBottom: "1px solid rgba(255,255,255,0.15)",
                letterSpacing: 1.6,
                mb: 2,
              }}
            >
              Avocado Menu
            </Box>

            <List>
              {[
                { text: "Home", icon: <HomeIcon />, link: "/home" },
                { text: "Profile", icon: <PersonIcon />, link: "/profile" },
                {
                  text: "Favorites",
                  icon: <FavoriteBorderIcon />,
                  link: "/FavoriteProducts",
                },
                { text: "Orders", icon: <ShoppingBagIcon />, link: "/orders" },
                {
                  text: "About Us",
                  icon: <i className="fas fa-users" />,
                  link: "/aboutUs",
                },
                {
                  text: "Contact Us",
                  icon: <ContactMailIcon />,
                  link: "/contactUs",
                },
              ].map(({ text, icon, link }) => (
                <Link key={text} href={link} passHref legacyBehavior>
                  <ListItem
                    component="a"
                    sx={{
                      color: "#fff",
                      fontWeight: 600,
                      borderRadius: 1.5,
                      mx: 0.5,
                      px: 2.5,
                      py: 1.3,
                      mb: 1,
                      "&:hover": {
                        bgcolor: alpha("#FFFFFF", 0.15),
                        pl: 3,
                        transition: "0.3s",
                      },
                      "& .MuiListItemIcon-root": { color: "#fff" },
                    }}
                  >
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItem>
                </Link>
              ))}
            </List>
          </Box>
        </motion.div>
      </Drawer>
    </>
  );
}
