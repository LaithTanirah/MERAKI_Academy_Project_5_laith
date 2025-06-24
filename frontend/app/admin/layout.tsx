"use client";

import { useState, useEffect } from "react";
import useAdminAuth from "@/hooks/useAdminAuth";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { CssBaseline, AppBar, Toolbar, IconButton, Typography, CircularProgress, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAdmin = useAdminAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isAdmin === false) {
      router.replace("/");
    }
  }, [isAdmin, router]);

  if (isAdmin === null) {
    return (
      <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <CssBaseline />
      <AppBar position="fixed" sx={{ bgcolor: "#388e3c" }}>
        <Toolbar>
          <IconButton color="inherit" onClick={() => setSidebarOpen(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 2 }}>
            Admin Panel
          </Typography>
        </Toolbar>
      </AppBar>

      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main style={{ marginTop: 64, padding: "16px" }}>{children}</main>
    </>
  );
}
