"use client";

import "./globals.css";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import { CssVarsProvider } from '@mui/joy/styles';
import { usePathname } from "next/navigation";
import Navbar from "../components/Navbar";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

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
  const hideNavbar = pathname === "/login";

  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {!hideNavbar && <Navbar />}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}