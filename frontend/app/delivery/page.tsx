"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Grid,
  Button,
  useTheme,
  Tooltip,
  List,
  ListItem,
  Link,
  Divider,
} from "@mui/material";
import {
  Close as CloseIcon,
  Person,
  Phone,
  ShoppingCart,
} from "@mui/icons-material";
import {
  Launch as DetailsIcon,
  HourglassEmpty,
  NewReleases as NewIcon,
  Assignment as AssignmentIcon,
  AssignmentTurnedIn as MyOrdersIcon,
  HourglassEmpty as ProcessingIcon,
  LocalShipping as DeliveredIcon,
  LocalShipping,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface TokenPayload {
  userId: number;
}

interface Order {
  cart_id: number;
  user_id: number;
  status: string;
  location_name?: string;
  latitude?: number;
  longitude?: number;
  first_name: string;
  last_name: string;
  phone_number: string;
}

interface ItemDetail {
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export default function DeliveryDashboard() {
  const theme = useTheme();
  axios.defaults.baseURL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [suspended, setSuspended] = useState(false);
  const [showSuspensionModal, setShowSuspensionModal] = useState(false);
  const [unclaimed, setUnclaimed] = useState<Order[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [detailsMap, setDetailsMap] = useState<Record<number, ItemDetail[]>>(
    {}
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  // Load token & user ID
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) return;
    setToken(t);
    try {
      const payload = jwtDecode<TokenPayload>(t);
      setUserId(payload.userId);
    } catch {}
  }, []);

  // Check if suspended
  useEffect(() => {
    if (!token) return;
    axios
      .get("/auth/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setSuspended(res.data.is_suspended))
      .catch(() => {});
  }, [token]);

  useEffect(() => {
    if (suspended) setShowSuspensionModal(true);
  }, [suspended]);

  // Load orders
  useEffect(() => {
    const load = () => {
      if (!token || userId === null || suspended) return;
      const headers = { Authorization: `Bearer ${token}` };
      axios
        .get<{ result: Order[] }>("/cart/unclaimed", { headers })
        .then((res) => setUnclaimed(res.data.result));
      axios
        .get<{ result: Order[] }>(`/cart/delivery/${userId}`, { headers })
        .then((res) => setMyOrders(res.data.result));
    };
    load();
  }, [token, userId, suspended]);

  // Fetch order items
  const fetchDetails = async (cartId: number) => {
    console.log(cartId);

    if (!token || detailsMap[cartId]) return;
    try {
      const { data } = await axios.get<{ result: any[] }>(
        `/cartProduct/cart/${cartId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const items = data.result.map((i) => ({
        name: i.product_title,
        image: `/images/${i.images[0]}`,
        price: i.price,
        quantity: i.quantity,
      }));
      setDetailsMap((prev) => ({ ...prev, [cartId]: items }));
    } catch {
      setDetailsMap((prev) => ({ ...prev, [cartId]: [] }));
    }
  };

  // Open & close modal
  const openDetailsModal = async (cartId: number) => {
    setSelectedOrderId(cartId);
    await fetchDetails(cartId);
    setDetailsModalOpen(true);
  };
  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedOrderId(null);
  };

  // Accept/Decline/Deliver
  const handleAccept = async (cartId: number) => {
    if (!token || userId === null) return;
    try {
      await axios.put(
        `/cart/claim/${cartId}`,
        { delivery_person_id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Order accepted");
      reloadAll();
    } catch {
      toast.error("Accept failed");
    }
  };
  const handleDecline = (cartId: number) =>
    setUnclaimed((p) => p.filter((o) => o.cart_id !== cartId));
  const handleDeliver = async (cartId: number) => {
    if (!token) return;
    try {
      await axios.put(
        `/cart/deliver/${cartId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Order marked as delivered");
      reloadAll();
    } catch {
      toast.error("Deliver failed");
    }
  };

  const reloadAll = () => {
    if (!token || userId === null || suspended) return;
    const headers = { Authorization: `Bearer ${token}` };
    axios
      .get<{ result: Order[] }>("/cart/unclaimed", { headers })
      .then((res) => setUnclaimed(res.data.result));
    axios
      .get<{ result: Order[] }>(`/cart/delivery/${userId}`, { headers })
      .then((res) => setMyOrders(res.data.result));
  };

  const filteredUnclaimed = unclaimed.filter(
    (o) =>
      (!filterStatus ||
        o.status.toUpperCase() === filterStatus.toUpperCase()) &&
      (!searchTerm || o.cart_id.toString().includes(searchTerm))
  );
  const filteredMy = myOrders.filter(
    (o) =>
      (!filterStatus ||
        o.status.toUpperCase() === filterStatus.toUpperCase()) &&
      (!searchTerm || o.cart_id.toString().includes(searchTerm))
  );

  const selectedOrder =
    selectedOrderId != null
      ? [...unclaimed, ...myOrders].find((o) => o.cart_id === selectedOrderId)
      : null;
console.log(unclaimed);

  const chipColor = (s: string) =>
    ((
      {
        NEW: "success",
        PROCESSING: "warning",
        DELIVERED: "success",
        ACTIVE: "primary",
      } as Record<string, "success" | "warning" | "primary" | "default">
    )[s.toUpperCase()] || "default");

  const borderColor = (s: string) =>
    ({
      NEW: theme.palette.success.main,
      PROCESSING: theme.palette.warning.main,
      DELIVERED: theme.palette.success.main,
      ACTIVE: theme.palette.primary.main,
    }[s.toUpperCase()] || theme.palette.grey[400]);

  const stats = [
    {
      label: "New Orders",
      value: filteredUnclaimed.filter((o) => o.status.toUpperCase() === "NEW")
        .length,
      Icon: NewIcon,
      color: "success" as any,
    },
    {
      label: "My Orders",
      value: myOrders.length,
      Icon: MyOrdersIcon,
      color: "primary" as any,
    },
    {
      label: "Processing",
      value: myOrders.filter((o) => o.status.toUpperCase() === "PROCESSING")
        .length,
      Icon: ProcessingIcon,
      color: "warning" as any,
    },
    {
      label: "Delivered",
      value: myOrders.filter((o) => o.status.toUpperCase() === "DELIVERED")
        .length,
      Icon: DeliveredIcon,
      color: "success" as any,
    },
    {
      label: "Active",
      value: filteredUnclaimed.filter(
        (o) => o.status.toUpperCase() === "ACTIVE"
      ).length,
      Icon: AssignmentIcon,
      color: "primary" as any,
    },
  ];

  return (
    <>
      <ToastContainer position="top-center" />

      {/* Suspension Dialog */}
      <Dialog open={showSuspensionModal} disableEscapeKeyDown>
        <DialogTitle sx={{ textAlign: "center", color: "error.main" }}>
          Account Suspended
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", minWidth: 300 }}>
          <Typography>Your account has been suspended by the admin.</Typography>
          <Typography sx={{ mt: 1, fontWeight: "bold" }}>
            Contact us at:
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Typography>
              📧{" "}
              <Link href="mailto:AvocadoAdmin@gmail.com">
                AvocadoAdmin@gmail.com
              </Link>
            </Typography>
            <Typography>📞 06 595 782</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => (window.location.href = "/login")}
          >
            Go to Login
          </Button>
        </DialogActions>
      </Dialog>

      {/* Order Details Dialog */}
      <Dialog
        open={detailsModalOpen}
        onClose={closeDetailsModal}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: 3 },
          component: motion.div,
          initial: { opacity: 0, y: -30 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 30 },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <ShoppingCart /> Order Details
          <Tooltip title="Close">
            <IconButton onClick={closeDetailsModal} size="small">
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </DialogTitle>

        <DialogContent dividers>
          {selectedOrder && (
            <>
              {/* Customer Info */}
              <Box display="flex" flexDirection="column" gap={1} mb={2}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Customer Info
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Person color="action" />
                  <Typography>
                    {selectedOrder.first_name} {selectedOrder.last_name}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Phone color="action" />
                  <Typography>{selectedOrder.phone_number}</Typography>
                </Box>
                {/* Location */}
                {selectedOrder.location_name && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <LocalShipping color="action" />
                    <Link
                      href={`https://maps.google.com/?q=${selectedOrder.latitude},${selectedOrder.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      underline="hover"
                    >
                      {selectedOrder.location_name}
                    </Link>
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 1 }} />

              {/* Items */}
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Items
              </Typography>
              <List sx={{ maxHeight: 300, overflowY: "auto" }}>
                {(detailsMap[selectedOrderId!] ?? []).map((i, idx) => (
                  <ListItem key={idx}>
                    <img
                      src={i.image}
                      alt={i.name}
                      width={48}
                      height={48}
                      style={{ borderRadius: 4, marginRight: 12 }}
                    />
                    <Box flex="1">
                      <Typography fontWeight="medium">{i.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {i.quantity} × ${i.price.toFixed(2)}
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>

              {/* Total Price */}
              <Box mt={2} display="flex" justifyContent="flex-end" pr={1}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Total: $
                  {(detailsMap[selectedOrderId!] ?? [])
                    .reduce((sum, item) => sum + item.price * item.quantity, 0)
                    .toFixed(2)}
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={closeDetailsModal}
            variant="contained"
            color="secondary"
            sx={{ borderRadius: 2 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Main Dashboard */}
      {!suspended && (
        <Box p={4}>
          <Typography variant="h4" gutterBottom>
            Delivery Dashboard
          </Typography>
          {/* Stats */}
          <Grid container spacing={2} mb={4}>
            {stats.map(({ label, value, Icon, color }, idx) => (
              <Grid key={idx} item xs={12} sm={6} md={3}>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Card
                    sx={{
                      display: "flex",
                      p: 2,
                      alignItems: "center",
                      borderRadius: 2,
                      background: "linear-gradient(135deg,#f5f5f5,#e8f5e9)",
                    }}
                  >
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

          {/* Filters */}
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
              <MenuItem value="NEW">New</MenuItem>
              <MenuItem value="PROCESSING">Processing</MenuItem>
              <MenuItem value="DELIVERED">Delivered</MenuItem>
              <MenuItem value="ACTIVE">Active</MenuItem>
            </Select>
            {filterStatus && (
              <Chip label={`Filter: ${filterStatus}`} color="secondary" />
            )}
          </Box>

          {/* No Orders Message */}
          {filteredUnclaimed.length === 0 && filteredMy.length === 0 && (
            <Box textAlign="center" mt={4}>
              <HourglassEmpty fontSize="large" color="disabled" />
              <Typography>
                {filterStatus
                  ? `No ${filterStatus.toLowerCase()} orders available`
                  : "No orders available"}
              </Typography>
            </Box>
          )}

          {/* Unclaimed Orders */}
          <Grid container spacing={2}>
            {filteredUnclaimed.map((o) => (
              <Grid key={o.cart_id} item xs={12} sm={6} md={4}>
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                    <CardContent>
                      <Typography>Order #{o.cart_id}</Typography>
                      <Chip
                        label={o.status}
                        color={chipColor(o.status as string)}
                        size="small"
                      />
                      {o.location_name && (
                        <Typography variant="caption">
                         
                        </Typography>
                      )}
                    </CardContent>
                    <CardActions>
                      <Tooltip title="View Details">
                        <IconButton onClick={() => openDetailsModal(o.cart_id)}>
                          <DetailsIcon />
                        </IconButton>
                      </Tooltip>
                      <Button
                        color="success"
                        size="small"
                        onClick={() => handleAccept(o.cart_id)}
                      >
                        Accept
                      </Button>
                      <Button
                        color="error"
                        size="small"
                        onClick={() => handleDecline(o.cart_id)}
                      >
                        Decline
                      </Button>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* My Orders */}
          <Grid container spacing={2} mt={4}>
            {filteredMy.map((o) => (
              <Grid key={o.cart_id} item xs={12} sm={6} md={4}>
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Card
                    variant="outlined"
                    sx={{
                      borderColor: borderColor(o.status as string),
                      borderRadius: 2,
                    }}
                  >
                    <CardContent>
                      <Typography>Order #{o.cart_id}</Typography>
                      <Chip
                        label={o.status}
                        color={chipColor(o.status as string)}
                        size="small"
                      />
                      {o.location_name && (
                        <Typography variant="caption">
                          
                        </Typography>
                      )}
                    </CardContent>
                    <CardActions>
                      <Tooltip title="View Details">
                        <IconButton
                          onClick={() => openDetailsModal(o.cart_id)}
                          size="small"
                        >
                          <DetailsIcon />
                        </IconButton>
                      </Tooltip>

                      {o.status.toUpperCase() === "PROCESSING" && (
                        <Button
                          variant="contained"
                          onClick={() => handleDeliver(o.cart_id)}
                        >
                          Mark as Delivered
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </>
  );
}
