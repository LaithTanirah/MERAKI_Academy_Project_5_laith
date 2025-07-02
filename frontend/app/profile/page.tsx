"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Avatar,
  Snackbar,
  Divider,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import ProfileIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SecurityIcon from "@mui/icons-material/Security";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SecurityUpdateIcon from "@mui/icons-material/SecurityUpdate";
import HistoryIcon from "@mui/icons-material/History";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { motion } from "framer-motion";

interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role_id: number;
  is_suspended: boolean;
  updated_at?: string;
  avatar_url?: string;
}

const AVOCADO_GREEN = "#6B8E23";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
  });
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [passMsg, setPassMsg] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [tab, setTab] = useState(0);

  // State for opening/closing Notify Me modal
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  // State for opening/closing Add New Address modal
  const [addressModalOpen, setAddressModalOpen] = useState(false);

  // Image preview and file
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in.");
      setLoading(false);
      return;
    }
    axios
      .get("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProfile(res.data);
        setForm({
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          email: res.data.email,
          phone_number: res.data.phone_number || "",
        });
        setAvatarPreview(res.data.avatar_url || null);
      })
      .catch(() => {
        setError("Error loading profile.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    try {
      setError("");
      const token = localStorage.getItem("token");

      // Update profile info except avatar
      await axios.put("http://localhost:5000/api/auth/profile", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Upload avatar if new image selected
      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);

        await axios.post("http://localhost:5000/api/auth/upload-avatar", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      setSuccess("Profile updated successfully.");
      setSnackbarOpen(true);

      // Optionally reload profile here
    } catch {
      setError("Error updating profile.");
    }
  };

  const handleChangePassword = async () => {
    try {
      setPassMsg("");
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/auth/change-password",
        { oldPassword: oldPass, newPassword: newPass },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPassMsg("Password updated successfully.");
      setOldPass("");
      setNewPass("");
    } catch (err: any) {
      setPassMsg(err.response?.data?.error || "Error changing password.");
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  if (loading)
    return (
      <Box mt={4} display="flex" justifyContent="center">
        <CircularProgress sx={{ color: AVOCADO_GREEN }} />
      </Box>
    );

  if (error)
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {error}
      </Alert>
    );

  return (
    <Box
      sx={{
        background: "linear-gradient(180deg, #56933C 0%, #EBF3E7 100%)",
        minHeight: "100vh",
        py: 4,
        px: 2,
        fontFamily: "'Tajawal', sans-serif",
        color: "#333",
      }}
    >
      <Grid container spacing={3}>
        {/* Left side - profile summary and info */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
              mb: 3,
            }}
          >
            <Box display="flex" flexDirection="column" alignItems="center">
              <Box position="relative">
                <Avatar
                  src={
                    avatarPreview ||
                    "logos/logo4.png"
                  }
                  sx={{
                    width: 120,
                    height: 120,
                    border: `4px solid ${AVOCADO_GREEN}`,
                  }}
                />
                <Tooltip title="Edit Profile Picture">
                  <IconButton
                    size="small"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      bgcolor: "background.paper",
                      border: `1.5px solid ${AVOCADO_GREEN}`,
                      "&:hover": {
                        bgcolor: AVOCADO_GREEN,
                        color: "#fff",
                      },
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </Box>
              <Typography
                variant="h6"
                mt={2}
                fontWeight={600}
                sx={{ textShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
              >
                {form.first_name} {form.last_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {form.email}
              </Typography>
              <Typography variant="caption" color="text.secondary" mt={1}>
                Last updated: {profile?.updated_at || "N/A"}
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Phone: {form.phone_number || "-"}
              </Typography>
              <Typography variant="body1">
                Status:{" "}
                <Box
                  component="span"
                  sx={{
                    color: profile?.is_suspended ? "error.main" : AVOCADO_GREEN,
                    fontWeight: "bold",
                  }}
                >
                  {profile?.is_suspended ? "Suspended" : "Active"}
                </Box>
              </Typography>
            </Box>
          </Paper>

          {/* Account Notifications */}
          <Paper
            sx={{
              p: 2,
              borderRadius: 4,
              boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
              mb: 3,
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ mb: 2, color: AVOCADO_GREEN }}
            >
              Account Notifications
            </Typography>
            <Stack spacing={1}>
              <Box display="flex" alignItems="center" gap={1}>
                <VerifiedUserIcon sx={{ color: AVOCADO_GREEN }} />
                <Typography>Your account is verified</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <PendingIcon sx={{ color: "#FFA500" }} />
                <Typography>Address verification in progress</Typography>
                <AccessTimeIcon sx={{ color: "#FFA500", fontSize: 18 }} />
              </Box>
            </Stack>
          </Paper>

          {/* Last Login */}
          <Paper
            sx={{
              p: 2,
              borderRadius: 4,
              boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
              mb: 3,
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ mb: 2, color: AVOCADO_GREEN }}
            >
              Last Login
            </Typography>
            <Typography>28-06-2025 15:45</Typography>
          </Paper>

          {/* New Payment Methods */}
          <Paper
            sx={{
              p: 2,
              borderRadius: 4,
              boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ mb: 1, color: AVOCADO_GREEN }}
            >
              New Payment Methods Coming Soon
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Subscribe for free shipping service — coming soon
            </Typography>
            {/* Notify Me button triggers modal opening */}
            <Button
              variant="contained"
              size="small"
              sx={{
                bgcolor: AVOCADO_GREEN,
                "&:hover": { bgcolor: "#5e7d1f" },
                fontWeight: "bold",
              }}
              startIcon={<NotificationsActiveIcon />}
              onClick={() => setNotifyModalOpen(true)}
            >
              Notify Me
            </Button>
          </Paper>
        </Grid>

        {/* Right side with tabs and extra content */}
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 0,
              borderRadius: 4,
              boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
              overflow: "hidden",
              mb: 3,
            }}
          >
            <Tabs
              value={tab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              sx={{
                "& .MuiTabs-indicator": {
                  bgcolor: AVOCADO_GREEN,
                  height: 3,
                },
                "& .MuiTab-root": {
                  fontWeight: 600,
                  fontSize: "1.05rem",
                },
                "& .MuiTab-root.Mui-selected": {
                  color: AVOCADO_GREEN,
                },
              }}
            >
              <Tab icon={<ProfileIcon />} label="Profile" />
              <Tab icon={<LockIcon />} label="Password" />
              <Tab icon={<NotificationsIcon />} label="Notifications" />
              <Tab icon={<SecurityIcon />} label="Security" />
            </Tabs>
            <Divider />
            <Box p={3} sx={{ minHeight: 320 }}>
              <motion.div
                key={tab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {tab === 0 && (
                  <Box>
                    <Typography
                      variant="h5"
                      gutterBottom
                      fontWeight={700}
                      sx={{ textShadow: "0 1px 4px rgba(0,0,0,0.12)" }}
                    >
                      Edit Profile
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="first_name"
                          label="First Name"
                          fullWidth
                          value={form.first_name}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="last_name"
                          label="Last Name"
                          fullWidth
                          value={form.last_name}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          name="email"
                          label="Email"
                          fullWidth
                          value={form.email}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          name="phone_number"
                          label="Phone Number"
                          fullWidth
                          value={form.phone_number}
                          onChange={handleChange}
                        />
                      </Grid>
                    </Grid>
                    <Box mt={2}>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<SaveIcon />}
                        onClick={handleSubmit}
                        sx={{
                          bgcolor: AVOCADO_GREEN,
                          "&:hover": {
                            bgcolor: "#5e7d1f",
                          },
                        }}
                      >
                        Save Changes
                      </Button>
                    </Box>
                    {success && (
                      <Alert
                        icon={<CheckCircleIcon />}
                        severity="success"
                        sx={{ mt: 2, boxShadow: `0 0 8px ${AVOCADO_GREEN}` }}
                      >
                        {success}
                      </Alert>
                    )}
                  </Box>
                )}
                {tab === 1 && (
                  <Box>
                    <Typography
                      variant="h5"
                      gutterBottom
                      fontWeight={700}
                      sx={{ textShadow: "0 1px 4px rgba(0,0,0,0.12)" }}
                    >
                      Change Password
                      <Tooltip
                        title="Enter your current password and a new password to update."
                        placement="right"
                      >
                        <IconButton
                          size="small"
                          sx={{ ml: 1, color: AVOCADO_GREEN }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Typography>
                    <TextField
                      label="Old Password"
                      type="password"
                      fullWidth
                      sx={{ mb: 2 }}
                      value={oldPass}
                      onChange={(e) => setOldPass(e.target.value)}
                    />
                    <TextField
                      label="New Password"
                      type="password"
                      fullWidth
                      sx={{ mb: 2 }}
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                    />
                    <Button
                      variant="contained"
                      color="info"
                      endIcon={<EditIcon />}
                      onClick={handleChangePassword}
                      sx={{
                        bgcolor: "#4a90e2",
                        "&:hover": {
                          bgcolor: "#357ABD",
                        },
                      }}
                    >
                      Change Password
                    </Button>
                    {passMsg && (
                      <Alert severity="info" sx={{ mt: 2 }}>
                        {passMsg}
                      </Alert>
                    )}
                  </Box>
                )}
                {tab === 2 && (
                  <Box>
                    <Typography
                      variant="h5"
                      gutterBottom
                      fontWeight={700}
                      sx={{ textShadow: "0 1px 4px rgba(0,0,0,0.12)" }}
                    >
                      Notifications
                    </Typography>
                    <Typography color="text.secondary">
                      You have no new notifications.
                    </Typography>
                  </Box>
                )}
                {tab === 3 && (
                  <Box>
                    <Typography
                      variant="h5"
                      gutterBottom
                      fontWeight={700}
                      sx={{ textShadow: "0 1px 4px rgba(0,0,0,0.12)" }}
                    >
                      Security Settings
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                      Two-factor authentication is currently disabled.
                    </Typography>

                    {/* Additional security settings section */}
                    <Typography variant="h6" gutterBottom>
                      Change Password
                    </Typography>
                    <TextField
                      label="Old Password"
                      type="password"
                      fullWidth
                      sx={{ mb: 2 }}
                      value={oldPass}
                      onChange={(e) => setOldPass(e.target.value)}
                    />
                    <TextField
                      label="New Password"
                      type="password"
                      fullWidth
                      sx={{ mb: 2 }}
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                    />
                    <Button
                      variant="contained"
                      color="info"
                      endIcon={<EditIcon />}
                      onClick={handleChangePassword}
                      sx={{
                        bgcolor: "#4a90e2",
                        "&:hover": {
                          bgcolor: "#357ABD",
                        },
                      }}
                    >
                      Change Password
                    </Button>
                    {passMsg && (
                      <Alert severity="info" sx={{ mt: 2 }}>
                        {passMsg}
                      </Alert>
                    )}
                  </Box>
                )}
              </motion.div>
            </Box>
          </Paper>

          {/* Additional right-side section: Order History and Address Book */}
          <Paper
            sx={{
              mt: 3,
              p: 3,
              borderRadius: 4,
              boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
            }}
          >
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: AVOCADO_GREEN }}>
              Order History
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <HistoryIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Order #12345 - Delivered" secondary="01-06-2025" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <HistoryIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Order #12344 - Processing" secondary="25-05-2025" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <HistoryIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Order #12343 - Cancelled" secondary="15-05-2025" />
              </ListItem>
            </List>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: AVOCADO_GREEN }}>
              Address Book
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <HomeIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Home"
                  secondary="123 Green St, Avocado City, AC 12345"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <HomeIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Work"
                  secondary="456 Yellow Rd, Avocado City, AC 12345"
                />
              </ListItem>
            </List>
            {/* Add New Address button triggers modal opening */}
            <Button
              variant="outlined"
              color="success"
              sx={{ mt: 2 }}
              onClick={() => setAddressModalOpen(true)}
            >
              Add New Address
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Notify Me Modal */}
      <Dialog open={notifyModalOpen} onClose={() => setNotifyModalOpen(false)}>
        <DialogTitle>Notification Subscription</DialogTitle>
        <DialogContent>
          <Typography>
            You will be notified when new payment methods are available.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotifyModalOpen(false)} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add New Address Modal */}
      <Dialog open={addressModalOpen} onClose={() => setAddressModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add New Address</DialogTitle>
        <DialogContent>
          <Typography>Feature coming soon! You can add a form here.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddressModalOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              alert("Add address feature coming soon!");
              setAddressModalOpen(false);
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={success}
        ContentProps={{
          sx: {
            bgcolor: AVOCADO_GREEN,
            color: "#fff",
            fontWeight: "bold",
            fontFamily: "'Tajawal', sans-serif",
            boxShadow: `0 0 8px ${AVOCADO_GREEN}`,
          },
        }}
      />
    </Box>
  );
}
