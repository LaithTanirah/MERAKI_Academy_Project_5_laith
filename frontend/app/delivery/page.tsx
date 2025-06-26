"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Chip,
  Drawer,
  List,
  ListItem,
  TextField,
  Select,
  MenuItem,
  Grid,
  Button,
  useTheme,
  Tooltip,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link
} from "@mui/material";
import {
  CheckCircleOutline as AcceptIcon,
  CancelOutlined as DeclineIcon,
  Launch as DetailsIcon,
  NewReleases as NewIcon,
  Assignment as MyIcon,
  HourglassEmpty as ProcessingIcon,
  LocalShipping as DeliveredIcon
} from "@mui/icons-material";
import { motion } from "framer-motion";

// Shape of the decoded JWT payload
interface TokenPayload {
  userId: number;
}

// Minimal order type from API
interface Order {
  cart_id: number;
  user_id: number;
  status: string;
}

// Structure of each line‐item in an order
interface ItemDetail {
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export default function DeliveryDashboard() {
  const theme = useTheme();

  // Ensure all axios calls go to our API root
  axios.defaults.baseURL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

  // --- Authentication & Suspension State ---
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [suspended, setSuspended] = useState(false);
  const [showSuspensionModal, setShowSuspensionModal] = useState(false);

  // --- Orders Data State ---
  const [unclaimed, setUnclaimed] = useState<Order[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [detailsMap, setDetailsMap] = useState<Record<number, ItemDetail[]>>({});

  // --- UI Control State ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success"
  });

  // 1) On mount, load JWT & decode userId
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) return;
    setToken(t);
    try {
      const { userId } = jwtDecode<TokenPayload>(t);
      setUserId(userId);
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }, []);

  // 2) Fetch current user’s profile to check suspension
  useEffect(() => {
    if (!token) return;
    axios
      .get("/auth/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setSuspended(res.data.is_suspended))
      .catch((err) => console.error("Profile fetch error:", err));
  }, [token]);

  // 3) When suspended flips true, show the modal
  useEffect(() => {
    if (suspended) setShowSuspensionModal(true);
  }, [suspended]);

  // 4) If account is active, load unclaimed & my orders
  useEffect(() => {
    if (!token || userId === null || suspended) return;
    const headers = { Authorization: `Bearer ${token}` };

    // Fetch all new, unclaimed orders
    axios
      .get<{ result: Order[] }>("/cart/unclaimed", { headers })
      .then((res) => setUnclaimed(res.data.result))
      .catch((err) => console.error("Unclaimed fetch error:", err));

    // Fetch orders claimed by this delivery person
    axios
      .get<{ result: Order[] }>(`/cart/delivery/${userId}`, { headers })
      .then((res) => setMyOrders(res.data.result))
      .catch((err) => console.error("My orders fetch error:", err));
  }, [token, userId, suspended]);

  // Helper: fetch line‐item details for a cart
  const fetchDetails = async (cartId: number) => {
    if (!token || detailsMap[cartId]) return;
    try {
      const { data } = await axios.get<{ result: any[] }>(`/cartProduct/cart/${cartId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const items: ItemDetail[] = data.result.map((i) => ({
        name: i.product_title,
        image: `/images/${i.images[0]}`,
        price: i.price,
        quantity: i.quantity
      }));
      setDetailsMap((prev) => ({ ...prev, [cartId]: items }));
    } catch {
      setDetailsMap((prev) => ({ ...prev, [cartId]: [] }));
    }
  };

  // Claim (accept) an order
  const handleAccept = async (cartId: number) => {
    if (!token || userId === null) return;
    if (!confirm("Accept this order?")) return;
    try {
      await axios.put(
        `/cart/claim/${cartId}`,
        { delivery_person_id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      reloadOrders();
      setSnackbar({ open: true, severity: "success", message: "Order accepted" });
    } catch {
      setSnackbar({ open: true, severity: "error", message: "Accept failed" });
    }
  };

  // Decline an order (locally remove)
  const handleDecline = (cartId: number) => {
    setUnclaimed((prev) => prev.filter((o) => o.cart_id !== cartId));
  };

  // Mark an order as delivered
  const handleDeliver = async (cartId: number) => {
    if (!token) return;
    try {
      await axios.put(`/cart/deliver/${cartId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      reloadOrders();
      setSnackbar({ open: true, severity: "success", message: "Order marked as delivered" });
    } catch {
      setSnackbar({ open: true, severity: "error", message: "Deliver failed" });
    }
  };

  // Refresh both lists
  const reloadOrders = () => {
    if (!token || userId === null) return;
    const headers = { Authorization: `Bearer ${token}` };
    axios
      .get<{ result: Order[] }>("/cart/unclaimed", { headers })
      .then((res) => setUnclaimed(res.data.result))
      .catch((err) => console.error("Refresh unclaimed failed:", err));
    axios
      .get<{ result: Order[] }>(`/cart/delivery/${userId}`, { headers })
      .then((res) => setMyOrders(res.data.result))
      .catch((err) => console.error("Refresh my orders failed:", err));
  };

  // Open/close the detail Drawer
  const openDetailsDrawer = (cartId: number) => {
    setSelectedOrderId(cartId);
    fetchDetails(cartId);
    setDrawerOpen(true);
  };
  const closeDetailsDrawer = () => {
    setDrawerOpen(false);
    setSelectedOrderId(null);
  };

  // Apply search + status filter
  const filteredUnclaimed = unclaimed.filter(
    (o) => (!filterStatus || o.status === filterStatus) && (!searchTerm || o.cart_id.toString().includes(searchTerm))
  );
  const filteredMy = myOrders.filter(
    (o) => (!filterStatus || o.status === filterStatus) && (!searchTerm || o.cart_id.toString().includes(searchTerm))
  );

  // Determine colors for status chips and outlines
  const chipColor = (s: string) => (s === "New" ? "info" : s === "Processing" ? "warning" : s === "Delivered" ? "success" : "default");
  const borderColor = (s: string) =>
    ({
      New: theme.palette.info.main,
      Processing: theme.palette.warning.main,
      Delivered: theme.palette.success.main
    }[s] || theme.palette.grey[400]);

  // KPI card definitions
  const stats = [
    { label: "New Orders", value: unclaimed.length, Icon: NewIcon, color: "info" as any },
    { label: "My Orders", value: myOrders.length, Icon: MyIcon, color: "primary" as any },
    { label: "Processing", value: myOrders.filter((o) => o.status === "Processing").length, Icon: ProcessingIcon, color: "warning" as any },
    { label: "Delivered", value: myOrders.filter((o) => o.status === "Delivered").length, Icon: DeliveredIcon, color: "success" as any }
  ];

  return (
    <>
      {/* Suspension Modal (blocks UI when suspended) */}
      <Dialog open={showSuspensionModal} disableEscapeKeyDown>
        <DialogTitle sx={{ textAlign: "center", color: "error.main" }}>Account Suspended</DialogTitle>
        <DialogContent sx={{ textAlign: "center", minWidth: 300 }}>
          <Typography>Your account has been suspended by the admin.</Typography>
          <Typography sx={{ mt: 1, fontWeight: "bold" }}>Contact us at:</Typography>
          <Box sx={{ mt: 1 }}>
            <Typography>
              📧{" "}
              <Link href="mailto:AvocadoAdmin@gmail.com" underline="hover">
                AvocadoAdmin@gmail.com
              </Link>
            </Typography>
            <Typography>📞 06 595 782</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button variant="contained" onClick={() => (window.location.href = "/login")}>
            Go to Login
          </Button>
        </DialogActions>
      </Dialog>

      {/* Main Dashboard: hidden if suspended */}
      {!suspended && (
        <Box p={4}>
          <Typography variant="h4" gutterBottom>
            Delivery Dashboard
          </Typography>

          {/* KPI Cards */}
          <Grid container spacing={2} mb={4}>
            {stats.map(({ label, value, Icon, color }, idx) => (
              <Grid key={idx} item xs={12} sm={6} md={3}>
                <motion.div whileHover={{ scale: 1.03 }}>
                  <Card sx={{ display: "flex", p: 2, alignItems: "center", borderRadius: 2 }}>
                    <Icon fontSize="large" color={color} sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="subtitle2">{label}</Typography>
                      <Typography variant="h5">{value}</Typography>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Search + Filter */}
          <Box display="flex" gap={2} mb={2}>
            <TextField
              size="small"
              label="Search Order #"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              size="small"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="New">New</MenuItem>
              <MenuItem value="Processing">Processing</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
            </Select>
          </Box>

          {/* Unclaimed Orders */}
          <Grid container spacing={2}>
            {filteredUnclaimed.map((o) => (
              <Grid key={o.cart_id} item xs={12} sm={6} md={4}>
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
                    <CardContent>
                      <Typography>Order #{o.cart_id}</Typography>
                      <Chip label={o.status} color={chipColor(o.status)} size="small" />
                    </CardContent>
                    <CardActions>
                      <Tooltip title="View Details">
                        <IconButton onClick={() => openDetailsDrawer(o.cart_id)}>
                          <DetailsIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Accept">
                        <IconButton color="success" onClick={() => handleAccept(o.cart_id)}>
                          <AcceptIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Decline">
                        <IconButton color="error" onClick={() => handleDecline(o.cart_id)}>
                          <DeclineIcon />
                        </IconButton>
                      </Tooltip>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Details Drawer */}
          <Drawer anchor="right" open={drawerOpen} onClose={closeDetailsDrawer}>
            <Box p={2} width={300}>
              <Typography>Order Details</Typography>
              <List>
                {selectedOrderId != null &&
                  (detailsMap[selectedOrderId] || []).map((i, idx) => (
                    <ListItem key={idx}>
                      <img src={i.image} alt={i.name} width={40} height={40} style={{ marginRight: 8 }} />
                      <Box>
                        <Typography>{i.name}</Typography>
                        <Typography variant="caption">
                          x{i.quantity} – ${i.price}
                        </Typography>
                      </Box>  
                    </ListItem>
                  ))}
              </List>
            </Box>
          </Drawer>

          {/* My Accepted Orders */}
          <Typography mt={4} mb={2}>
            My Accepted Orders
          </Typography>
          <Grid container spacing={2}>
            {filteredMy.map((o) => (
              <Grid key={o.cart_id} item xs={12} sm={6} md={4}>
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Card variant="outlined" sx={{ borderColor: borderColor(o.status), borderRadius: 2 }}>
                    <CardContent>
                      <Typography>Order #{o.cart_id}</Typography>
                      <Chip label={o.status} color={chipColor(o.status)} size="small" />
                    </CardContent>
                    <CardActions>
                      {o.status === "Processing" && (
                        <Button onClick={() => handleDeliver(o.cart_id)}>Mark as Delivered</Button>
                      )}
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Snackbar Notifications */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          >
            <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      )}
    </>
  );
}
