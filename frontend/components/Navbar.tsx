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
  Divider,
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

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backdropFilter: "blur(12px)",
          background: "linear-gradient(90deg, #4caf50 0%, #66bb6a 100%)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", minHeight: 72 }}>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <motion.div whileTap={{ scale: 0.9 }}>
              <IconButton
                color="inherit"
                onClick={toggleDrawer(true)}
                sx={{
                  bgcolor: alpha("#fff", 0.1),
                  backdropFilter: "blur(4px)",
                  borderRadius: 2,
                  transition: "all 0.3s",
                  "&:hover": {
                    bgcolor: alpha("#fff", 0.2),
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            </motion.div>

            <Typography
              variant="h5"
              component={Link}
              href="/"
              sx={{
                textDecoration: "none",
                color: "#fff",
                fontWeight: 900,
                letterSpacing: 1.8,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
               Avocado
            </Typography>
          </Box>


          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            style={{ flex: 1, maxWidth: 500 }}
          >
            <SearchBar />
          </motion.div>


          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {[
              ["/favorites", <FavoriteBorderIcon key="f" />],
              [null, <CartButton key="c" />],
            ].map(([href, Icon], idx) =>
              href ? (
                <Link key={idx} href={""} passHref legacyBehavior>
                  <IconButton
                    component="a"
                    color="inherit"
                    sx={{
                      bgcolor: alpha("#fff", 0.1),
                      borderRadius: 2,
                      transition: "all 0.3s",
                      "&:hover": { bgcolor: alpha("#fff", 0.2) },
                    }}
                  >
                    {Icon}
                  </IconButton>
                </Link>
              ) : (
                <motion.div key={idx} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}>
                  <IconButton
                    color="inherit"
                    sx={{
                      bgcolor: alpha("#fff", 0.1),
                      borderRadius: 2,
                      transition: "all 0.3s",
                      "&:hover": { bgcolor: alpha("#fff", 0.2) },
                    }}
                  >
                    {Icon}
                  </IconButton>
                </motion.div>
              )
            )}

            <motion.div whileHover={{ rotate: 20 }} whileTap={{ rotate: 0 }}>
              <IconButton
                color="inherit"
                onClick={handleLogout}
                sx={{
                  bgcolor: alpha("#fff", 0.1),
                  borderRadius: 2,
                  transition: "all 0.3s",
                  "&:hover": { bgcolor: alpha("#fff", 0.2) },
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
            background: "linear-gradient(to bottom, #4caf50, #81c784)",
            color: "#fff",
          },
        }}
      >
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 180 }}
        >
          <Box
            sx={{
              width: 260,
              height: "100%",
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
                height: 64,
                fontWeight: "bold",
                fontSize: 22,
                fontFamily: "'Poppins', sans-serif",
                borderBottom: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              Avocado Menu
            </Box>

            <List>
              {[
                { text: "Home", icon: <HomeIcon />, link: "/" },
                { text: "Favorites", icon: <FavoriteBorderIcon />, link: "/favorites" },
                { text: "Contact Us", icon: <ContactMailIcon />, link: "/contact" },
              ].map(({ text, icon, link }) => (
                <Link key={text} href={link} passHref legacyBehavior>
                  <ListItem
                    component="a"
                    sx={{
                      color: "#fff",
                      "&:hover": {
                        bgcolor: alpha("#ffffff", 0.15),
                        pl: 3,
                        transition: "all 0.3s",
                        color: "#fff",
                      },
                      "& .MuiListItemIcon-root": {
                        color: "#fff",
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
