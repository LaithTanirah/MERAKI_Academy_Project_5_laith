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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
} from "@mui/material";
import {
  CheckCircleOutline as AcceptIcon,
  CancelOutlined as DeclineIcon,
  Launch as DetailsIcon,
  NewReleases as NewIcon,
  Assignment as AssignmentIcon,
  AssignmentTurnedIn as MyOrdersIcon,
  HourglassEmpty as ProcessingIcon,
  LocalShipping as DeliveredIcon,
  HourglassEmpty,
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) return;
    setToken(t);
    try {
      setUserId(jwtDecode<TokenPayload>(t).userId);
    } catch {}
  }, []);

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
  useEffect(() => {
    reloadOrders();
  }, [token, userId, suspended]);

  const reloadOrders = () => {
    if (!token || userId === null || suspended) return;
    const headers = { Authorization: `Bearer ${token}` };
    axios
      .get<{ result: Order[] }>("/cart/unclaimed", { headers })
      .then((res) => setUnclaimed(res.data.result));
    axios
      .get<{ result: Order[] }>(`/cart/delivery/${userId}`, { headers })
      .then((res) => setMyOrders(res.data.result));
  };

  const fetchDetails = async (cartId: number) => {
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

  const handleAccept = async (cartId: number) => {
    if (!token || userId === null) return;
    try {
      await axios.put(
        `/cart/claim/${cartId}`,
        { delivery_person_id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      reloadOrders();
      toast.success("Order accepted");
    } catch {
      toast.error("Accept failed");
    }
  };
  const handleDecline = (cartId: number) =>
    setUnclaimed((prev) => prev.filter((o) => o.cart_id !== cartId));
  const handleDeliver = async (cartId: number) => {
    if (!token) return;
    try {
      await axios.put(
        `/cart/deliver/${cartId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      reloadOrders();
      toast.success("Order marked as delivered");
    } catch {
      toast.error("Deliver failed");
    }
  };

  const openDetailsDrawer = (cartId: number) => {
    setSelectedOrderId(cartId);
    fetchDetails(cartId);
    setDrawerOpen(true);
  };
  const closeDetailsDrawer = () => {
    setDrawerOpen(false);
    setSelectedOrderId(null);
  };

  const filteredUnclaimed = unclaimed.filter(
    (o) =>
      (!filterStatus ||
        o.status.trim().toUpperCase() === filterStatus.trim().toUpperCase()) &&
      (!searchTerm || o.cart_id.toString().includes(searchTerm))
  );
  const filteredMy = myOrders.filter(
    (o) =>
      (!filterStatus ||
        o.status.trim().toUpperCase() === filterStatus.trim().toUpperCase()) &&
      (!searchTerm || o.cart_id.toString().includes(searchTerm))
  );

  const chipColor = (s: string) =>
    s.trim().toUpperCase() === "NEW"
      ? "success"
      : s.trim().toUpperCase() === "PROCESSING"
      ? "warning"
      : s.trim().toUpperCase() === "DELIVERED"
      ? "success"
      : s.trim().toUpperCase() === "ACTIVE"
      ? "primary"
      : "default";

  const borderColor = (s: string) =>
    ({
      NEW: theme.palette.success.main,
      PROCESSING: theme.palette.warning.main,
      DELIVERED: theme.palette.success.main,
      ACTIVE: theme.palette.primary.main,
    }[s.trim().toUpperCase()] || theme.palette.grey[400]);

  const stats = [
    {
      label: "New Orders",
      value: unclaimed.filter((o) => o.status.trim().toUpperCase() === "NEW")
        .length,
      Icon: NewIcon,
      color: "success",
    },
    {
      label: "My Orders",
      value: myOrders.length,
      Icon: MyOrdersIcon,
      color: "primary",
    },
    {
      label: "Processing",
      value: myOrders.filter(
        (o) => o.status.trim().toUpperCase() === "PROCESSING"
      ).length,
      Icon: ProcessingIcon,
      color: "warning",
    },
    {
      label: "Delivered",
      value: myOrders.filter(
        (o) => o.status.trim().toUpperCase() === "DELIVERED"
      ).length,
      Icon: DeliveredIcon,
      color: "success",
    },
    {
      label: "Active",
      value: unclaimed.filter((o) => o.status.trim().toUpperCase() === "ACTIVE")
        .length,
      Icon: AssignmentIcon,
      color: "primary",
    },
  ];

  return (
    <>
      <ToastContainer position="top-center" />
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
              <Link href="mailto:AvocadoAdmin@gmail.com" underline="hover">
                AvocadoAdmin@gmail.com
              </Link>
            </Typography>
            <Typography>📞 06 595 782</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            variant="contained"
            onClick={() => (window.location.href = "/login")}
          >
            Go to Login
          </Button>
        </DialogActions>
      </Dialog>
      {!suspended && (
        <Box p={4}>
          <Typography variant="h4" gutterBottom>
            Delivery Dashboard
          </Typography>
          <Grid container spacing={2} mb={4}>
            {stats.map(({ label, value, Icon, color }, i) => (
              <Grid key={i} item xs={12} sm={6} md={3}>
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
          <Grid container spacing={2}>
            {filteredUnclaimed.map((o) => (
              <Grid key={o.cart_id} item xs={12} sm={6} md={4}>
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                    <CardContent>
                      <Typography>Order #{o.cart_id}</Typography>
                      <Chip
                        label={o.status}
                        color={chipColor(o.status)}
                        size="small"
                      />
                      {o.location_name && (
                        <Typography variant="caption">
                          📍{" "}
                          <a
                            href={`https://maps.google.com/?q=${o.latitude},${o.longitude}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {o.location_name}
                          </a>
                        </Typography>
                      )}
                    </CardContent>
                    <CardActions>
                      <Tooltip title="View Details">
                        <IconButton
                          onClick={() => openDetailsDrawer(o.cart_id)}
                        >
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
          <Drawer anchor="right" open={drawerOpen} onClose={closeDetailsDrawer}>
            <Box p={2} width={300}>
              <Typography>Order Details</Typography>
              <List>
                {selectedOrderId != null &&
                  (detailsMap[selectedOrderId] || []).map((i, idx) => (
                    <ListItem key={idx}>
                      <img
                        src={i.image}
                        alt={i.name}
                        width={40}
                        height={40}
                        style={{ marginRight: 8 }}
                      />
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
          <Grid container spacing={2} mt={4}>
            {filteredMy.map((o) => (
              <Grid key={o.cart_id} item xs={12} sm={6} md={4}>
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Card
                    variant="outlined"
                    sx={{ borderColor: borderColor(o.status), borderRadius: 2 }}
                  >
                    <CardContent>
                      <Typography>Order #{o.cart_id}</Typography>
                      <Chip
                        label={o.status}
                        color={chipColor(o.status)}
                        size="small"
                      />
                      {o.location_name && (
                        <Typography variant="caption">
                          📍{" "}
                          <a
                            href={`https://maps.google.com/?q=${o.latitude},${o.longitude}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {o.location_name}
                          </a>
                        </Typography>
                      )}
                    </CardContent>
                    <CardActions>
                      {o.status.trim().toUpperCase() === "PROCESSING" && (
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
