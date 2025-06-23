"use client";

import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Snackbar,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CategoryIcon from "@mui/icons-material/Category";

import { useEffect, useState, FormEvent } from "react";
import axios from "axios";
import useAdminAuth from "@/hooks/useAdminAuth";

const API = process.env.NEXT_PUBLIC_API_URL + "/api";

interface Category {
  id: number;
  title: string;
}

export default function AdminCategoriesPage() {
  const isAdmin = useAdminAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get<Category[]>(`${API}/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(res.data);
      } catch (err) {
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const title = form.get("title") as string;

    try {
      if (editing) {
        await axios.put(
          `${API}/categories/${editing.id}`,
          { title },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccessMsg("Category updated successfully!");
      } else {
        await axios.post(
          `${API}/categories`,
          { title },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccessMsg("Category added successfully!");
      }
      const res = await axios.get<Category[]>(`${API}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
      setDialogOpen(false);
    } catch (err) {
      setError("Failed to save category");
    }
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      await axios.delete(`${API}/categories/${categoryToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories((prev) => prev.filter((cat) => cat.id !== categoryToDelete.id));
      setSuccessMsg("Category deleted successfully!");
    } catch (err) {
      setError("Failed to delete category");
    } finally {
      setConfirmDelete(false);
      setCategoryToDelete(null);
    }
  };

  if (isAdmin === null || loading) {
    return (
      <Box p={4} textAlign="center">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={4} sx={{ backgroundColor: "#f5fdf6", minHeight: "100vh" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" fontWeight="bold">
          <CategoryIcon sx={{ mr: 1 }} /> Categories Management
        </Typography>
        <Button
          variant="contained"
          sx={{ borderRadius: 2, backgroundColor: "#4caf50" }}
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          Add Category
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat.id} hover>
                <TableCell>{cat.id}</TableCell>
                <TableCell>{cat.title}</TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton
                      color="success"
                      onClick={() => {
                        setEditing(cat);
                        setDialogOpen(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      color="error"
                      onClick={() => {
                        setCategoryToDelete(cat);
                        setConfirmDelete(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <Box component="form" onSubmit={handleSubmit}>
          <DialogTitle>{editing ? "Edit" : "Add"} Category</DialogTitle>
          <DialogContent dividers>
            <TextField
              name="title"
              label="Title"
              fullWidth
              defaultValue={editing?.title || ""}
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editing ? "Save" : "Create"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{categoryToDelete?.title}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
          <Button onClick={confirmDeleteCategory} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!successMsg}
        autoHideDuration={3000}
        onClose={() => setSuccessMsg(null)}
      >
        <Alert severity="success" onClose={() => setSuccessMsg(null)}>
          {successMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
