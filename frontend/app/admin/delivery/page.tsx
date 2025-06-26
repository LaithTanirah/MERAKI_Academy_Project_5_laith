"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Snackbar,
  Alert
} from "@mui/material";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  role_id: number;
  is_suspended: boolean;
}

export default function ManageDeliveryPage() {
  const [deliveryUsers, setDeliveryUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({ open: false, message: "", severity: "success" });

  const API = process.env.NEXT_PUBLIC_API_URL || "";
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  // Load all delivery users with suspension status
  useEffect(() => {
    axios
      .get<User[]>(`${API}/api/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        // Filter only role_id === 4 (delivery personnel)
        const delivery = res.data.filter(u => u.role_id === 4);
        setDeliveryUsers(delivery);
      })
      .catch(err => console.error("Failed to load users:", err))
      .finally(() => setLoading(false));
  }, [API, token]);

  if (loading) return <CircularProgress />;

  // Handle suspend/unsuspend via API
  const toggleSuspend = async (user: User) => {
    const action = user.is_suspended ? "unsuspend" : "suspend";
    try {
      await axios.put(
        `${API}/api/auth/users/${user.id}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update UI state
      setDeliveryUsers(prev =>
        prev.map(u =>
          u.id === user.id ? { ...u, is_suspended: !u.is_suspended } : u
        )
      );
      setSnackbar({
        open: true,
        severity: "success",
        message: user.is_suspended ? "User reinstated." : "User suspended."
      });
    } catch {
      setSnackbar({ open: true, severity: "error", message: "Something went wrong!" });
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" mb={2}>Manage Delivery</Typography>

      <Card>
        <CardContent>
          <Typography variant="h6">Delivery Personnel</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deliveryUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.first_name} {user.last_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone_number || "-"}</TableCell>
                  <TableCell>{user.is_suspended ? "Suspended" : "Active"}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color={user.is_suspended ? "success" : "error"}
                      onClick={() => toggleSuspend(user)}
                    >
                      {user.is_suspended ? "Reinstate" : "Suspend"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}