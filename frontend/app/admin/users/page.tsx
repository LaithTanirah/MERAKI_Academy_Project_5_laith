// src/app/admin/users/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  CircularProgress,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from "@mui/material";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role_id: number;
}

interface Role {
  id: number;
  name: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({ open: false, message: "", severity: "success" });

  // Base API URL from environment
  const API = process.env.NEXT_PUBLIC_API_URL || "";
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get(`${API}/api/auth/users`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`${API}/api/roles`, { headers: { Authorization: `Bearer ${token}` } }),
    ])
      .then(([u, r]) => {
        setUsers(u.data);
        setRoles(r.data);
      })
      .catch(() => {
        setSnackbar({ open: true, message: "Failed to load data", severity: "error" });
      })
      .finally(() => setLoading(false));
  }, [API, token]);

  const handleRoleChange = (userId: number, roleId: number) => {
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, role_id: roleId } : u)));
  };

  const saveRole = (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    axios
      .put(
        `${API}/api/auth/users/${userId}/role`,
        { role_id: user.role_id },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => setSnackbar({ open: true, message: "Role updated", severity: "success" }))
      .catch(() => setSnackbar({ open: true, message: "Update failed", severity: "error" }));
  };

  const softDeleteUser = (userId: number) => {
    axios
      .delete(`${API}/api/auth/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        setUsers(prev => prev.filter(u => u.id !== userId));
        setSnackbar({ open: true, message: "User deleted", severity: "success" });
      })
      .catch(() => setSnackbar({ open: true, message: "Delete failed", severity: "error" }));
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }
 
  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Manage Users
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(u => (
            <TableRow key={u.id}>
              <TableCell>{u.id}</TableCell>
              <TableCell>{u.first_name} {u.last_name}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>
                <Select
                  value={u.role_id || ""}
                  onChange={e => handleRoleChange(u.id, Number(e.target.value))}
                  size="small"
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {roles.map(r => (
                    <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell>
                <Button variant="contained" size="small" onClick={() => saveRole(u.id)} sx={{ mr: 1 }}>
                  Save
                </Button>
                <Button color="error" size="small" onClick={() => softDeleteUser(u.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
