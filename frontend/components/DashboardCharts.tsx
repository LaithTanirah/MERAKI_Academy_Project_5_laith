"use client";

import { Box, Card, Typography } from "@mui/joy";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const pieData = [
  { name: "Pending", value: 7 },
  { name: "Delivered", value: 15 },
  { name: "Canceled", value: 3 },
];
const pieColors = ["#f57c00", "#2e7d32", "#d32f2f"];

const lineData = [
  { day: "Mon", sales: 120 },
  { day: "Tue", sales: 200 },
  { day: "Wed", sales: 150 },
  { day: "Thu", sales: 250 },
  { day: "Fri", sales: 300 },
  { day: "Sat", sales: 180 },
  { day: "Sun", sales: 220 },
];

export default function DashboardCharts() {
  return (
    <Box
      mt={6}
      display="grid"
      gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
      gap={3}
      width="100%"
      maxWidth="1000px"
    >
      {/* Pie Chart */}
      <Card variant="outlined" sx={{ p: 3 }}>
        <Typography level="title-lg" mb={2}>
          🧾 Orders per Status
        </Typography>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80}>
              {pieData.map((entry, index) => (
                <Cell key={index} fill={pieColors[index % pieColors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Line Chart */}
      <Card variant="outlined" sx={{ p: 3 }}>
        <Typography level="title-lg" mb={2}>
          📈 Sales Over Week
        </Typography>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={lineData}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="sales" stroke="#2e7d32" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </Box>
  );
}
