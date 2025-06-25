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
  Tooltip
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

axios.defaults.baseURL = "http://localhost:5000/api";

interface TokenPayload { userId: number; }
interface Order { cart_id: number; user_id: number; status: string; }
interface ItemDetail { name: string; image: string; price: number; quantity: number; }

export default function DeliveryDashboard() {
  const theme = useTheme();
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [unclaimed, setUnclaimed] = useState<Order[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [detailsMap, setDetailsMap] = useState<Partial<Record<number, ItemDetail[]>>>({});

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) return;
    setToken(t);
    try {
      const { userId } = jwtDecode<TokenPayload>(t);
      setUserId(userId);
    } catch (e) {
      console.error("Invalid token:", e);
    }
  }, []);

  useEffect(() => {
    if (!token || userId === null) return;
    const headers = { Authorization: `Bearer ${token}` };
    axios.get<{ result: Order[] }>("/cart/unclaimed", { headers })
      .then(res => setUnclaimed(res.data.result))
      .catch(err => console.error("Fetch new orders error:", err));
    axios.get<{ result: Order[] }>(`/cart/delivery/${userId}`, { headers })
      .then(res => setMyOrders(res.data.result))
      .catch(err => console.error("Fetch my orders error:", err));
  }, [token, userId]);

  const fetchDetails = async (cartId: number) => {
    if (!token || detailsMap[cartId]) return;
    try {
      const { data } = await axios.get<{ result: any[] }>(`/cartProduct/cart/${cartId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const items: ItemDetail[] = data.result.map(item => ({
        name: item.product_title,
        image: `/images/${item.images[0]}`,
        price: item.price,
        quantity: item.quantity
      }));
      setDetailsMap(prev => ({ ...prev, [cartId]: items }));
    } catch (e) {
      console.error("Fetch order details error:", e);
      setDetailsMap(prev => ({ ...prev, [cartId]: [] }));
    }
  };

  const handleAccept = async (cartId: number) => {
    if (!token || userId === null) return;
    if (!confirm("Are you sure you want to accept this order?")) return;
    try {
      await axios.put(`/cart/claim/${cartId}`, { delivery_person_id: userId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnclaimed(prev => prev.filter(o => o.cart_id !== cartId));
      setMyOrders(prev => [...prev, { cart_id: cartId, user_id: userId, status: "Processing" }]);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to accept.");
    }
  };

  const handleDecline = (cartId: number) => setUnclaimed(prev => prev.filter(o => o.cart_id !== cartId));

  const handleDeliver = async (cartId: number) => {
    if (!token) return;
    try {
      const res = await axios.put(`/cart/deliver/${cartId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyOrders(prev => prev.map(o => o.cart_id === cartId ? { ...o, status: res.data.result.status } : o));
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const openDetails = (id: number) => { setSelectedOrderId(id); fetchDetails(id); setDrawerOpen(true); };
  const closeDrawer = () => { setDrawerOpen(false); setSelectedOrderId(null); };

  const filteredUnclaimed = unclaimed
    .filter(o => !filterStatus || o.status === filterStatus)
    .filter(o => !searchTerm || o.cart_id.toString().includes(searchTerm));

  const filteredMy = myOrders
    .filter(o => !filterStatus || o.status === filterStatus)
    .filter(o => !searchTerm || o.cart_id.toString().includes(searchTerm));

  const chipColor = (status: string): 'default' | 'info' | 'warning' | 'success' => {
    switch (status) {
      case 'New': return 'info';
      case 'Processing': return 'warning';
      case 'Delivered': return 'success';
      default: return 'default';
    }
  };

  const borderColor = (status: string) => {
    const map: Record<string, string> = {
      New: theme.palette.info.main,
      Processing: theme.palette.warning.main,
      Delivered: theme.palette.success.main
    };
    return map[status] || theme.palette.grey[400];
  };

  const stats = [
    { label: 'New Orders', value: unclaimed.length, Icon: NewIcon, color: 'info' },
    { label: 'My Orders', value: myOrders.length, Icon: MyIcon, color: 'primary' },
    { label: 'Processing', value: myOrders.filter(o => o.status === 'Processing').length, Icon: ProcessingIcon, color: 'warning' },
    { label: 'Delivered', value: myOrders.filter(o => o.status === 'Delivered').length, Icon: DeliveredIcon, color: 'success' }
  ];

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Delivery Dashboard</Typography>
      <Grid container spacing={2} mb={4}>
        {stats.map(({ label, value, Icon, color }, i) => (
          <Grid item key={i} xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.03 }}>
              <Card elevation={2} sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 2 }}>
                <Icon fontSize="large" color={color as any} sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">{label}</Typography>
                  <Typography variant="h5">{value}</Typography>
                </Box>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Box display="flex" alignItems="center" mb={2} gap={2}>
        <TextField
          label="Search Order #"
          size="small"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <Select size="small" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} displayEmpty>
          <MenuItem value="">All Statuses</MenuItem>
          <MenuItem value="New">New</MenuItem>
          <MenuItem value="Processing">Processing</MenuItem>
          <MenuItem value="Delivered">Delivered</MenuItem>
        </Select>
      </Box>

      <Grid container spacing={2}>
        {filteredUnclaimed.map(o => (
          <Grid item xs={12} sm={6} md={4} key={o.cart_id}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
                <CardContent>
                  <Typography variant="h6">Order #{o.cart_id}</Typography>
                  <Chip label={o.status} color={chipColor(o.status)} size="small" sx={{ mt: 1 }} />
                </CardContent>
                <CardActions>
                  <Tooltip title="View Details"><IconButton onClick={() => openDetails(o.cart_id)}><DetailsIcon /></IconButton></Tooltip>
                  <Tooltip title="Accept Order"><IconButton color="success" onClick={() => handleAccept(o.cart_id)}><AcceptIcon /></IconButton></Tooltip>
                  <Tooltip title="Decline Order"><IconButton color="error" onClick={() => handleDecline(o.cart_id)}><DeclineIcon /></IconButton></Tooltip>
                </CardActions>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Drawer anchor="right" open={drawerOpen} onClose={closeDrawer}>
        <Box p={2} width={360}>
          <Typography variant="h6">Order Details</Typography>
          <List>
            {selectedOrderId != null && detailsMap[selectedOrderId]?.map((i, idx) => (
              <ListItem key={idx}>
                <Box display="flex" alignItems="center">
                  <img src={i.image} alt={i.name} width={48} height={48} style={{ marginRight: 12, borderRadius: 4, objectFit: 'cover' }} />
                  <Box>
                    <Typography variant="body1">{i.name}</Typography>
                    <Typography variant="body2">x{i.quantity} — ${i.price}</Typography>
                  </Box>
                </Box>
              </ListItem>
            ))}
          </List>
          <Box mt={3} height={200} borderRadius={1} bgcolor={theme.palette.grey[100]} display="flex" alignItems="center" justifyContent="center">
            <Typography variant="caption">Map view placeholder</Typography>
          </Box>
        </Box>
      </Drawer>

      <Typography variant="h5" mt={4} mb={2}>My Accepted Orders</Typography>
      <Grid container spacing={2}>
        {filteredMy.map(o => (
          <Grid item xs={12} sm={6} md={4} key={o.cart_id}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card variant="outlined" sx={{ borderColor: borderColor(o.status), borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6">Order #{o.cart_id}</Typography>
                  <Chip label={o.status} color={chipColor(o.status)} size="small" sx={{ mt: 1 }} />
                </CardContent>
                <CardActions>
                  {o.status === "Processing" && (
                    <Button size="small" onClick={() => handleDeliver(o.cart_id)}>
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
  );
}
