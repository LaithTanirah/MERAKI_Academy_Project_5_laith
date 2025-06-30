"use client";

import "./globals.css";
import {
  ThemeProvider as MuiThemeProvider,
  CssBaseline,
  createTheme,
  Box,
} from "@mui/material";
import { ThemeProvider, useThemeMode } from "../components/ThemeContext";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ChatWidget from "../components/ChatWidget";
import DeliverySidebar from "../components/DeliverySidebar";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "leaflet/dist/leaflet.css";

const theme = createTheme({
  palette: {
    primary: { main: "#689F38" },
    secondary: { main: "#AED581" },
    background: { default: "#F5F5F5" },
    text: { primary: "#333" },
  },
  typography: { fontFamily: '"Roboto", sans-serif' },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [roleId, setRoleId] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userString = localStorage.getItem("user");
      let user = null;

      try {
        user = userString ? JSON.parse(userString) : null;
      } catch {
        user = null;
      }

      setRoleId(user?.role_id ?? null);
    }
  }, [pathname]);

  const isHome = pathname === "/";
  const isDelivery = roleId === 4;
  const hideNavbar = isHome || isDelivery;

  return (
    <html lang="en" style={{ height: "100%" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      <body
        style={{
          minHeight: "100vh",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ThemeProvider>
          <ContentWrapper
            isHome={isHome}
            isDelivery={isDelivery}
            hideNavbar={hideNavbar}
            children={children}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}

function ContentWrapper({
  isHome,
  isDelivery,
  hideNavbar,
  children,
}: {
  isHome: boolean;
  isDelivery: boolean;
  hideNavbar: boolean;
  children: React.ReactNode;
}) {
  const { darkMode } = useThemeMode();

  return (
    <MuiThemeProvider theme={darkMode ? createDarkTheme() : createLightTheme()}>
      <CssBaseline />
      <Box
        component="div"
        sx={{
          background: isHome
            ? darkMode
              ? "#181818"
              : "linear-gradient(to bottom, #b9fbc0, #a3c4bc)"
            : darkMode
            ? "#121212"
            : "#F5F5F5",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {!hideNavbar && <Navbar />}

        {isDelivery ? (
          <Box sx={{ display: "flex", flexGrow: 1 }}>
            <DeliverySidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
              {children}
            </Box>
          </Box>
        ) : (
          <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
            {children}
          </Box>
        )}

        <ChatWidget />
      </Box>
    </MuiThemeProvider>
  );
}

function createLightTheme() {
  return createTheme({
    palette: {
      mode: "light",
      primary: { main: "#689F38" },
      secondary: { main: "#AED581" },
      background: { default: "#F5F5F5" },
      text: { primary: "#333" },
    },
    typography: { fontFamily: '"Roboto", sans-serif' },
  });
}

function createDarkTheme() {
  return createTheme({
    palette: {
      mode: "dark",
      primary: { main: "#81c784" },
      secondary: { main: "#a5d6a7" },
      background: { default: "#121212" },
      text: { primary: "#eee" },
    },
    typography: { fontFamily: '"Roboto", sans-serif' },
  });
}
