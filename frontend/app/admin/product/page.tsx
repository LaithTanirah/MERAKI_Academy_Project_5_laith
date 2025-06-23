"use client";

import { useEffect, useState, FormEvent } from "react";
import axios from "axios";
import useAdminAuth from "@/hooks/useAdminAuth";

import {
  Box,
  Button,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  Divider,
  Snackbar,
} from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import { Product } from "@/types/product";

const API = `${process.env.NEXT_PUBLIC_API_URL}/api`;

interface Category {
  id: number;
  title: string;
}

export default function AdminProductsPage() {
  const isAdmin = useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [showSuccess, setShowSuccess] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get<Product[]>(`${API}/products`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get<Category[]>(`${API}/categories`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    })();
  }, [isAdmin, token]);

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fm = new FormData(e.currentTarget);
    const body = {
      title: fm.get("title"),
      price: Number(fm.get("price")),
      categoryid: Number(fm.get("categoryid")),
      description: fm.get("description"),
      size: (fm.get("size") as string).split(","),
      images: (fm.get("images") as string).split(","),
    };

    try {
      if (editing) {
        await axios.put(`${API}/products/${editing.id}`, body, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API}/products`, body, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      const res = await axios.get<Product[]>(`${API}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
      setDialogOpen(false);
      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Failed to save product.");
    }
  };

  const getCategoryTitle = (id: number) => {
    return categories.find((c) => c.id === id)?.title || "Unknown";
  };

  const filteredProducts =
    filterCategory === "All"
      ? products
      : products.filter((p) => getCategoryTitle(p.categoryid) === filterCategory);

  return (
    <Box sx={{ backgroundColor: "#f5fdf6", minHeight: "100vh", py: 4, px: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          🛒 Products Management
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 180, zIndex: 1 }}>
            <InputLabel id="filter-category">Filter by Category</InputLabel>
            <Select
              labelId="filter-category"
              value={filterCategory}
              label="Filter by Category"
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.title}>
                  {c.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<AddCircleIcon />}
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
            sx={{
              borderRadius: "2xl",
              px: 3,
              py: 1,
              fontWeight: "bold",
              position: "relative",
              zIndex: 999,
              backgroundColor: "#4caf50",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#388e3c",
              },
            }}
          >
            Add Product
          </Button>
        </Box>
      </Stack>

      <Box display="flex" flexWrap="wrap" gap={3} justifyContent="center" alignItems="stretch">
        {filteredProducts.map((p) => (
          <Card
            key={p.id}
            sx={{
              width: 260,
              borderRadius: 3,
              boxShadow: 4,
              display: "flex",
              flexDirection: "column",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.03)",
                boxShadow: 6,
              },
            }}
          >
            <CardMedia
              component="img"
              height="180"
              image={`/images/${p.images?.[0] || "placeholder.jpg"}`}
              alt={p.title}
              sx={{ objectFit: "cover" }}
            />
            <CardContent>
              <Typography variant="h6">{p.title}</Typography>
              <Typography variant="body1" color="text.primary">
                {p.price} JD
              </Typography>
              <Chip
                label={getCategoryTitle(p.categoryid)}
                color="success"
                size="small"
                sx={{ mt: 1 }}
              />
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 1 }}>
              <Tooltip title="Edit Product">
                <IconButton
                  color="success"
                  onClick={() => {
                    setEditing(p);
                    setDialogOpen(true);
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Product">
                <IconButton
                  color="error"
                  onClick={() => {
                    setProductToDelete(p);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </CardActions>
          </Card>
        ))}
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <Box component="form" onSubmit={handleSubmit}>
          <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ShoppingCartIcon color="primary" />
            {editing ? "Edit Product" : "Add Product"}
          </DialogTitle>
          <DialogContent dividers>
            <TextField name="title" label="Title" fullWidth defaultValue={editing?.title || ""} margin="normal" required />
            <TextField name="price" label="Price" type="number" fullWidth defaultValue={editing?.price || ""} margin="normal" required />
            <FormControl fullWidth margin="normal">
              <InputLabel id="category-label">Category</InputLabel>
              <Select labelId="category-label" name="categoryid" label="Category" defaultValue={editing?.categoryid || ""} required>
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>{cat.title}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField name="description" label="Description" fullWidth defaultValue={editing?.description || ""} margin="normal" multiline />
            <TextField name="size" label="Size (comma-separated)" fullWidth defaultValue={editing?.size.join(",") || ""} margin="normal" />
            <TextField name="images" label="Images URLs (comma-separated)" fullWidth defaultValue={editing?.images.join(",") || ""} margin="normal" />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">{editing ? "Save" : "Create"}</Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{productToDelete?.title}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={async () => {
              if (productToDelete) {
                try {
                  await axios.delete(`${API}/products/${productToDelete.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  setProducts((prev) =>
                    prev.filter((x) => x.id !== productToDelete.id)
                  );
                  setShowSuccess(true);
                } catch (err) {
                  console.error(err);
                  setError("Failed to delete product.");
                } finally {
                  setDeleteDialogOpen(false);
                  setProductToDelete(null);
                }
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={showSuccess} autoHideDuration={3000} onClose={() => setShowSuccess(false)}>
        <Alert severity="success" sx={{ width: '100%' }}>
          Operation completed successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}