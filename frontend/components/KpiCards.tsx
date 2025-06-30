"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Card,
  Typography,
  Avatar,
} from "@mui/joy";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import GroupsIcon from "@mui/icons-material/Groups";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InventoryIcon from "@mui/icons-material/Inventory";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";

export default function KpiCards() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [ordersToday, setOrdersToday] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [customers, setCustomers] = useState(0);

  useEffect(() => {
    fetch("https://avocado-z31n.onrender.com/api/dashboard/summary")
      .then((res) => res.json())
      .then((data) => {
        setTotalProducts(data.totalProducts);
        setTotalOrders(data.totalOrders);
        setOrdersToday(data.ordersToday);
        setPendingOrders(data.pendingOrders);
        setCustomers(data.customers);
      })
      .catch((err) => console.error("Dashboard data error:", err));
  }, []);

  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        xs: "1fr",
        sm: "repeat(2, 1fr)",
        md: "repeat(3, 1fr)",
        lg: "repeat(5, 1fr)",
      }}
      gap={2}
      width="100%"
      maxWidth="1200px"
      mb={4}
    >
      <KpiCard icon={<ShoppingBagIcon />} label="Total Products" value={totalProducts} color="success" />
      <KpiCard icon={<InventoryIcon />} label="Total Orders" value={totalOrders} color="primary" />
      <KpiCard icon={<AccessTimeIcon />} label="Orders Today" value={ordersToday} color="warning" />
      <KpiCard icon={<HourglassTopIcon />} label="Pending Orders" value={pendingOrders} color="danger" />
      <KpiCard icon={<GroupsIcon />} label="Customers" value={customers} color="neutral" />
    </Box>
  );
}

function KpiCard({ icon, label, value, color }: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: any;
}) {
  return (
    <Card
      variant="soft"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 3,
        transition: "all 0.3s ease",
        borderRadius: "lg",
        boxShadow: "sm",
        "&:hover": {
          transform: "scale(1.03)",
          boxShadow: "lg",
        },
      }}
    >
      <Avatar
        variant="outlined"
        color={color}
        sx={{ mb: 1, width: 48, height: 48 }}
      >
        {icon}
      </Avatar>
      <Typography level="body-sm" fontWeight="md">
        {label}
      </Typography>
      <Typography fontSize="xl" fontWeight="lg" color="success.800">
        {value}
      </Typography>
    </Card>
  );
}
