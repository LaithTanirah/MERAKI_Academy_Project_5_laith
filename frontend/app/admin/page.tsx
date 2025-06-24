"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  CssVarsProvider,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
  Avatar,
  IconButton,
} from "@mui/joy";
import Link from "next/link";
import useAdminAuth from "@/hooks/useAdminAuth";
import CategoryIcon from "@mui/icons-material/Category";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import UpdateIcon from "@mui/icons-material/Update";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AddTaskIcon from "@mui/icons-material/AddTask";
import DashboardCharts from "@/components/DashboardCharts";
import KpiCards from "@/components/KpiCards";
import PersonIcon from "@mui/icons-material/Person";
import { motion } from "framer-motion";

export default function AdminDashboardPage() {
  return (
    <CssVarsProvider>
      <Box
        minHeight="100vh"
        sx={{
          backgroundColor: "#f9f9f9",
          py: { xs: 6, sm: 8 },
          px: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box sx={{ position: "absolute", top: 16, right: 16 }}>
          <IconButton>
            <Avatar variant="outlined">
              <PersonIcon />
            </Avatar>
          </IconButton>
        </Box>

        <Typography
          level="h2"
          fontWeight="xl"
          mb={4}
          sx={{ color: "#2e7d32", textAlign: "center" }}
        >
          Admin Dashboard
        </Typography>

        <Box mb={4} width="100%" maxWidth="1000px">
          <KpiCards />
        </Box>

        <Box mb={4} width="100%" maxWidth="1000px">
          <DashboardCharts />
        </Box>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          style={{ width: "100%", maxWidth: "1000px" }}
        >
          <Card
            variant="outlined"
            sx={{
              p: 3,
              backgroundColor: "#ffffff",
              borderRadius: "xl",
              boxShadow: "md",
            }}
          >
            <Typography level="title-lg" mb={2} color="success.700">
              Recent Activity
            </Typography>
            <Divider />
            <Box mt={2} display="flex" flexDirection="column" gap={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <AddTaskIcon sx={{ color: "#2e7d32" }} />
                <Typography>✅ New order from Sarah - 2 hours ago</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={2}>
                <ErrorOutlineIcon sx={{ color: "#c62828" }} />
                <Typography>
                  ❌ Product out of stock: Vitamin D - 3 hours ago
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={2}>
                <UpdateIcon sx={{ color: "#0277bd" }} />
                <Typography>
                  🔄 Category updated: Supplements - 5 hours ago
                </Typography>
              </Box>
            </Box>
          </Card>
        </motion.div>

        <Box
          display="grid"
          gap={3}
          width="100%"
          maxWidth="1000px"
          gridTemplateColumns="repeat(auto-fit, minmax(280px, 1fr))"
          mt={6}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              variant="outlined"
              sx={{
                p: 3,
                background: "linear-gradient(to right, #e8f5e9, #f1f8e9)",
                boxShadow: "lg",
                borderRadius: "2xl",
                transition: "transform 0.3s",
                "&:hover": { transform: "scale(1.02)" },
              }}
            >
              <Box
                display="flex"
                justifyContent="center"
                mb={2}
                color="success.700"
              >
                <Inventory2Icon sx={{ fontSize: 40 }} />
              </Box>
              <CardContent>
                <Typography level="title-lg" textAlign="center" mb={1}>
                  Products
                </Typography>
                <Typography level="body-sm" textAlign="center" mb={2}>
                  Manage your products efficiently
                </Typography>
                <Button
                  component={Link}
                  href="/admin/product"
                  fullWidth
                  sx={{
                    backgroundColor: "#2e7d32",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#256d28",
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  ➕ Manage Products
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <Card
              variant="outlined"
              sx={{
                p: 3,
                background: "linear-gradient(to right, #e8f5e9, #f1f8e9)",
                boxShadow: "lg",
                borderRadius: "2xl",
                transition: "transform 0.3s",
                "&:hover": { transform: "scale(1.02)" },
              }}
            >
              <Box
                display="flex"
                justifyContent="center"
                mb={2}
                color="success.700"
              >
                <CategoryIcon sx={{ fontSize: 40 }} />
              </Box>
              <CardContent>
                <Typography level="title-lg" textAlign="center" mb={1}>
                  Categories
                </Typography>
                <Typography level="body-sm" textAlign="center" mb={2}>
                  Organize product categories
                </Typography>
                <Button
                  component={Link}
                  href="/admin/category"
                  fullWidth
                  sx={{
                    backgroundColor: "#2e7d32",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#256d28",
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  🗂️ Manage Categories
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card
              variant="outlined"
              sx={{
                p: 3,
                opacity: 0.6,
                boxShadow: "lg",
                borderRadius: "2xl",
                backgroundColor: "#f1f3f4",
                pointerEvents: "none",
              }}
            >
              <Box display="flex" justifyContent="center" mb={2}>
                <LocalShippingIcon sx={{ fontSize: 40 }} />
              </Box>
              <CardContent>
                <Typography level="title-lg" textAlign="center" mb={1}>
                  Delivery
                </Typography>
                <Typography level="body-sm" textAlign="center" mb={1}>
                  Configure delivery zones, fees, and methods here once
                  available.
                </Typography>
                <Button disabled fullWidth>
                  🚚 Coming Soon
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
