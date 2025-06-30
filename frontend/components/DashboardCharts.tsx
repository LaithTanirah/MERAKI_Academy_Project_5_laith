"use client";

import { useEffect, useState } from "react";
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

const pieColors = ["#f57c00", "#2e7d32", "#d32f2f", "#1976d2"];

export default function DashboardCharts() {
  const [pieData, setPieData] = useState([]);
  const [lineData, setLineData] = useState([]);

  useEffect(() => {
    // PieChart data
    fetch("https://avocado-z31n.onrender.com/api/dashboard/orders-status")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPieData(data);
        else setPieData([]);
      })
      .catch(() => setPieData([]));

    // LineChart data
    fetch("https://avocado-z31n.onrender.com/api/dashboard/weekly-sales")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setLineData(data);
        else setLineData([]);
      })
      .catch(() => setLineData([]));
  }, []);

  return (
    <Box
      mt={6}
      display="grid"
      gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
      gap={3}
      width="100%"
      maxWidth="1000px"
    >
      <Card variant="outlined" sx={{ p: 3 }}>
        <Typography level="title-lg" mb={2}>
          🧾 Orders per Status
        </Typography>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={Array.isArray(pieData) ? pieData : []} dataKey="value" nameKey="name" outerRadius={80}>
              {Array.isArray(pieData) &&
                pieData.map((_, index) => (
                  <Cell key={index} fill={pieColors[index % pieColors.length]} />
                ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <Card variant="outlined" sx={{ p: 3 }}>
        <Typography level="title-lg" mb={2}>
          📈 Sales Over Week
        </Typography>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={Array.isArray(lineData) ? lineData : []}>
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
