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
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import Link from "next/link";
import SearchBar from "./SeachBar";
import CartButton from "./CartButton";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

function AvocadoIcon({ size = 34, style = {} }) {
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        mr: 1,
        filter: "drop-shadow(0 2px 8px rgba(78, 170, 96, 0.15))",
        ...style,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <ellipse cx="20" cy="20" rx="16" ry="20" fill="#68c66b" />
        <ellipse cx="20" cy="22" rx="13" ry="16" fill="#4eaa60" />
        <ellipse cx="20" cy="26" rx="8.5" ry="9.5" fill="#f9eac0" />
        <ellipse cx="20" cy="27" rx="5" ry="6" fill="#ad7c51" />
        <ellipse cx="20" cy="28" rx="2" ry="2.5" fill="#84583b" />
      </svg>
    </Box>
  );
}

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const router = useRouter();

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  const iconBg = alpha("#FFFFFF", 0.15);
  const iconHoverBg = alpha("#FFFFFF", 0.25);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "linear-gradient(90deg, #68c66b 0%, #4eaa60 100%)",
          boxShadow: "0 8px 32px 0 rgba(78, 170, 96, 0.12)",
          borderBottom: "1px solid rgba(80, 200, 120, 0.1)",
          backdropFilter: "blur(8px)",
          zIndex: 1000,
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            minHeight: 76,
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
                  transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
                  boxShadow: "0 2px 6px 0 rgba(80, 200, 120, 0.1)",
                  backdropFilter: "blur(6px)",
                  "&:hover": { bgcolor: iconHoverBg },
                }}
              >
                <MenuIcon />
              </IconButton>
            </motion.div>
            <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
              <AvocadoIcon />
              <Typography
                variant="h5"
                component={Link}
                href="/home"
                sx={{
                  textDecoration: "none",
                  color: "#FFFFFF",
                  fontWeight: 900,
                  letterSpacing: 2,
                  fontFamily: "'Poppins', sans-serif",
                  textShadow: "0 2px 12px rgba(34, 139, 34, 0.16)",
                  mx: 0.7,
                  fontSize: { xs: 23, md: 28 },
                  lineHeight: 1.3,
                }}
              >
                Avocado
              </Typography>
            </Box>
          </Box>

          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.16 }}
            style={{ flex: 1, maxWidth: 500 }}
          >
            <SearchBar />
          </motion.div>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {[
              ["/FavoriteProducts", <FavoriteBorderIcon key="fav" />],
              ["/cart", <CartButton key="cart" />],
            ].map(([href, Icon], idx) => (
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
                    transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
                    boxShadow: "0 2px 6px 0 rgba(80, 200, 120, 0.1)",
                    "&:hover": { bgcolor: iconHoverBg },
                  }}
                >
                  {Icon}
                </IconButton>
              </motion.div>
            ))}

            <motion.div whileHover={{ rotate: 18 }} whileTap={{ rotate: 0 }}>
              <IconButton
                color="inherit"
                onClick={handleLogout}
                sx={{
                  bgcolor: iconBg,
                  borderRadius: 2,
                  transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
                  boxShadow: "0 2px 6px 0 rgba(80, 200, 120, 0.1)",
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
            background: "linear-gradient(135deg, #4eaa60 30%, #68c66b 100%)",
            color: "#FFFFFF",
            borderTopRightRadius: 32,
            borderBottomRightRadius: 16,
            boxShadow: "0 8px 36px 0 rgba(78, 170, 96, 0.17)",
            border: "none",
          },
        }}
      >
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 170 }}
        >
          <Box
            sx={{
              width: 270,
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
                height: 68,
                fontWeight: 900,
                fontSize: 22,
                fontFamily: "'Poppins', sans-serif",
                borderBottom: "1.5px solid rgba(255,255,255,0.22)",
                letterSpacing: 1.7,
                mb: 2,
              }}
            >
              Avocado Menu
            </Box>

            <List>
              {[
                { text: "Home", icon: <HomeIcon />, link: "/home" },
                { text: "Favorites", icon: <FavoriteBorderIcon />, link: "/FavoriteProducts" },
                { text: "Contact Us", icon: <ContactMailIcon />, link: "/contact" },
              ].map(({ text, icon, link }) => (
                <Link key={text} href={link} passHref legacyBehavior>
                  <ListItem
                    component="a"
                    sx={{
                      color: "#FFFFFF",
                      fontWeight: 600,
                      borderRadius: 1.5,
                      mb: 1,
                      mx: 0.5,
                      px: 2.5,
                      py: 1.3,
                      "&:hover": {
                        bgcolor: alpha("#FFFFFF", 0.15),
                        pl: 3,
                        transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
                        boxShadow: "0 1px 6px 0 rgba(255,255,255,0.1)",
                      },
                      "& .MuiListItemIcon-root": {
                        color: "#FFFFFF",
                      },
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
