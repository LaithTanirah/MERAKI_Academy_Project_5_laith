"use client";

import "./globals.css";
import { ThemeProvider, CssBaseline, createTheme, Box } from "@mui/material";
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

// MUI Theme setup
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
      } catch (err) {
        console.error("Failed to parse user from localStorage:", err);
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
          background: isHome
            ? "linear-gradient(to bottom, #b9fbc0, #a3c4bc)"
            : "#F5F5F5",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ThemeProvider theme={theme}>
          <CssBaseline />

          {/* Hide Navbar for delivery or homepage */}
          {!hideNavbar && <Navbar />}

          {/* Show DeliverySidebar if delivery */}
          {isDelivery ? (
            <Box sx={{ display: "flex" }}>
              <DeliverySidebar />
              <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
                {children}
              </Box>
            </Box>
          ) : (
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              {children}
            </div>
          )}

          <ChatWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}
