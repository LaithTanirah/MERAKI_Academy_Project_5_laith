"use client";

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

const kpis = [
  {
    icon: <ShoppingBagIcon />,
    label: "Total Products",
    value: 128,
    color: "success",
  },
  {
    icon: <InventoryIcon />,
    label: "Total Orders",
    value: 200,
    color: "primary",
  },
  {
    icon: <AccessTimeIcon />,
    label: "Orders Today",
    value: 23,
    color: "warning",
  },
  {
    icon: <HourglassTopIcon />,
    label: "Pending Orders",
    value: 7,
    color: "danger",
  },
  {
    icon: <GroupsIcon />,
    label: "Customers",
    value: 98,
    color: "neutral",
  },
];

export default function KpiCards() {
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
      {kpis.map((kpi, index) => (
        <Card
          key={index}
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
            color={kpi.color}
            sx={{ mb: 1, width: 48, height: 48 }}
          >
            {kpi.icon}
          </Avatar>
          <Typography level="body-sm" fontWeight="md">
            {kpi.label}
          </Typography>
          <Typography fontSize="xl" fontWeight="lg" color="success.800">
            {kpi.value}
          </Typography>
        </Card>
      ))}
    </Box>
  );
}
