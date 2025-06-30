"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
  IconButton,
  InputAdornment,
} from "@mui/material";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useSearchParams, useRouter } from "next/navigation";

export default function AuthSplitLayout() {
  const [showRegister, setShowRegister] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_number: "",
  });
  const [suspended, setSuspended] = useState(false);
  const [showSuspensionModal, setShowSuspensionModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [forgotError, setForgotError] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL || "https://avocado-z31n.onrender.com";

  // دالة تغلق كل النوافذ المفتوحة
  const closeAllModals = () => {
    setModalOpen(false);
    setShowSuspensionModal(false);
    setForgotPasswordModalOpen(false);
  };

  const showModal = (title: string, message: string) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalOpen(true);
  };

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      axios
        .get(`${API}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          localStorage.setItem("user", JSON.stringify(res.data));
          closeAllModals();
          showModal("Success", "Logged in with Google successfully!");
          router.push("/home");
        })
        .catch(() => {
          closeAllModals();
          showModal("Error", "Could not fetch user data");
        });
    }
  }, [searchParams, API, router]);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginForm.email || !loginForm.password) {
      closeAllModals();
      showModal("Error", "Please provide email and password.");
      return;
    }

    try {
      const { data } = await axios.post(`${API}/api/auth/login`, loginForm);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      const roleId = data.user?.role_id;
      if (roleId === 1) {
        router.push("/admin");
      } else if (roleId === 4) {
        router.push("/delivery");
      } else {
        closeAllModals();
        showModal("Success", "Login successful!");
      }
    } catch (err: any) {
      if (
        err.response?.status === 403 &&
        (err.response.data.message?.toLowerCase().includes("suspend") ||
          err.response.data.error?.toLowerCase().includes("suspend"))
      ) {
        closeAllModals();
        setSuspended(true);
        setShowSuspensionModal(true);
        return;
      }
      closeAllModals();
      showModal("Error", err.response?.data?.error || "Login failed");
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/auth/register`, registerForm);
      closeAllModals();
      showModal("Success", "Registration successful!");
      setShowRegister(false);
    } catch (err: any) {
      closeAllModals();
      showModal("Error", err.response?.data?.error || "Registration failed");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API}/api/auth/google`;
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const openForgotPasswordModal = () => {
    closeAllModals();
    setForgotPasswordModalOpen(true);
    setForgotEmail("");
    setForgotSuccess("");
    setForgotError("");
  };

  const closeForgotPasswordModal = () => {
    setForgotPasswordModalOpen(false);
  };

  const handleForgotEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForgotEmail(e.target.value);
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotSuccess("");
    setForgotError("");
    try {
      await axios.post(`${API}/api/auth/forgot-password`, {
        email: forgotEmail,
      });
      setForgotSuccess("Password reset link sent to your email.");
      setForgotLoading(false);
    } catch (error: any) {
      setForgotError(
        error.response?.data?.error || "Failed to send reset link."
      );
      setForgotLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage:
          "linear-gradient(rgba(110,255,134,0.5),rgba(55,68,51,0.5))",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 4,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          maxWidth: 835,
          minHeight: 600,
          width: "100%",
          borderRadius: 3,
          overflow: "hidden",
          display: "flex",
        }}
      >
        <Grid container>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              backgroundColor: "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              p: 6,
            }}
          >
            <AnimatePresence mode="wait">
              {showRegister ? (
                <motion.div
                  key="login-welcome"
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ duration: 0.5 }}
                >
                  <img
                    src="logos/logo1.png"
                    alt="Logo"
                    style={{ width: 250, marginBottom: 50, marginLeft: 50 }}
                  />
                  <Typography variant="h3" fontWeight="bold" gutterBottom>
                    Welcome Back!
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Already have an account?
                  </Typography>
                  <Button
                    onClick={() => setShowRegister(false)}
                    variant="contained"
                    sx={{
                      mt: 4,
                      backgroundColor: "#4caf50",
                      color: "#fff",
                      fontWeight: "bold",
                      px: 4,
                      py: 1,
                      borderRadius: 2,
                      boxShadow: "4px 4px 10px rgba(0,0,0,0.2)",
                      "&:hover": { backgroundColor: "#45a049" },
                    }}
                  >
                    LOGIN
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="login-form"
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ duration: 0.5 }}
                >
                  <Typography variant="h3" fontWeight="bold" gutterBottom>
                    Login
                  </Typography>
                  <Box
                    component="form"
                    onSubmit={handleLoginSubmit}
                    sx={{ width: "100%", maxWidth: 400 }}
                  >
                    <TextField
                      label="Email"
                      name="email"
                      fullWidth
                      margin="normal"
                      variant="filled"
                      value={loginForm.email}
                      onChange={handleLoginChange}
                      sx={{ bgcolor: "#eee", borderRadius: 1 }}
                    />
                    <TextField
                      label="Password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      fullWidth
                      margin="normal"
                      variant="filled"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      sx={{ bgcolor: "#eee", borderRadius: 1 }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={toggleShowPassword}
                              edge="end"
                              aria-label="toggle password visibility"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 0.5,
                        mb: 2,
                      }}
                    >
                     <Link
  component="button"
  type="button"
  variant="body2"
  onClick={openForgotPasswordModal}
  sx={{ cursor: "pointer", userSelect: "none" }}
>
  Forgot password?
</Link>

                    </Box>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      sx={{
                        mt: 1,
                        py: 1.5,
                        backgroundColor: "#4caf50",
                        "&:hover": { backgroundColor: "#45a049" },
                        boxShadow: "4px 4px 10px rgba(0,0,0,0.2)",
                      }}
                    >
                      LOGIN
                    </Button>
                    <Button
                      onClick={handleGoogleLogin}
                      fullWidth
                      variant="outlined"
                      sx={{
                        mt: 2,
                        py: 1.5,
                        color: "#4285F4",
                        borderColor: "#4285F4",
                        "&:hover": { backgroundColor: "#f5f5f5" },
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                      }}
                    >
                      <img
                        src="https://developers.google.com/identity/images/g-logo.png"
                        alt="Google"
                        style={{ width: 20, height: 20 }}
                      />
                      LOGIN WITH GOOGLE
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      disabled
                      sx={{
                        mt: 2,
                        py: 1.5,
                        color: "#000",
                        borderColor: "#000",
                        backgroundColor: "#f5f5f5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                        opacity: 0.6,
                      }}
                    >
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                        alt="Apple"
                        style={{ width: 20, height: 20 }}
                      />
                      SIGN IN WITH APPLE (SOON)
                    </Button>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              p: 6,
              backgroundColor: "#4caf50",
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <AnimatePresence mode="wait">
              {showRegister ? (
                <motion.div
                  key="register-form"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                >
                  <Typography variant="h3" fontWeight="bold">
                    Register
                  </Typography>
                  <Box
                    component="form"
                    onSubmit={handleRegisterSubmit}
                    sx={{ width: "100%", maxWidth: 289 }}
                  >
                    <TextField
                      label="First Name"
                      name="first_name"
                      fullWidth
                      margin="normal"
                      variant="filled"
                      value={registerForm.first_name}
                      onChange={handleRegisterChange}
                      sx={{ bgcolor: "#fff", borderRadius: 1 }}
                    />
                    <TextField
                      label="Last Name"
                      name="last_name"
                      fullWidth
                      margin="normal"
                      variant="filled"
                      value={registerForm.last_name}
                      onChange={handleRegisterChange}
                      sx={{ bgcolor: "#fff", borderRadius: 1 }}
                    />
                    <TextField
                      label="Email"
                      name="email"
                      fullWidth
                      margin="normal"
                      variant="filled"
                      value={registerForm.email}
                      onChange={handleRegisterChange}
                      sx={{ bgcolor: "#fff", borderRadius: 1 }}
                    />
                    <TextField
                      label="Password"
                      name="password"
                      type="password"
                      fullWidth
                      margin="normal"
                      variant="filled"
                      value={registerForm.password}
                      onChange={handleRegisterChange}
                      sx={{ bgcolor: "#fff", borderRadius: 1 }}
                    />
                    <TextField
                      label="Phone Number"
                      name="phone_number"
                      fullWidth
                      margin="normal"
                      variant="filled"
                      value={registerForm.phone_number}
                      onChange={handleRegisterChange}
                      sx={{ bgcolor: "#fff", borderRadius: 1 }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      sx={{
                        mt: 4,
                        py: 1.5,
                        backgroundColor: "#fff",
                        color: "#4caf50",
                      }}
                    >
                      SIGNUP
                    </Button>
                  </Box>
                </motion.div>
              ) : (
                <motion.div
                  key="register-welcome"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                >
                  <img
                    src="logos/logo3.png"
                    alt="Logo"
                    style={{ width: 200, marginBottom: 16 }}
                  />
                  <Typography variant="h3" fontWeight="bold">
                    New here?
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Don't have an account?
                  </Typography>
                  <Button
                    onClick={() => setShowRegister(true)}
                    variant="contained"
                    sx={{
                      mt: 4,
                      backgroundColor: "#fff",
                      color: "#4caf50",
                      fontWeight: "bold",
                      px: 4,
                      py: 1,
                    }}
                  >
                    SIGNUP
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </Grid>
        </Grid>
      </Paper>

      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        PaperProps={{
          sx: { borderRadius: 3, p: 3, minWidth: 300, textAlign: "center" },
        }}
      >
        {modalTitle.toLowerCase().includes("success") ? (
          <CheckCircleIcon sx={{ fontSize: 60, color: "green", mb: 2 }} />
        ) : (
          <ErrorIcon sx={{ fontSize: 60, color: "red", mb: 2 }} />
        )}
        <DialogTitle
          sx={{
            fontWeight: "bold",
            fontSize: "1.5rem",
            color: modalTitle.toLowerCase().includes("success")
              ? "green"
              : "red",
          }}
        >
          {modalTitle}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: "1rem", color: "#555" }}>
            {modalMessage}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={() => {
              setModalOpen(false);
              if (modalTitle.toLowerCase().includes("success")) {
                router.push("/home");
              }
            }}
            variant="contained"
            sx={{
              mt: 2,
              px: 4,
              py: 1,
              backgroundColor: modalTitle.toLowerCase().includes("success")
                ? "green"
                : "red",
              color: "#fff",
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

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
          <Button variant="contained" onClick={() => window.location.reload()}>
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={forgotPasswordModalOpen}
        onClose={closeForgotPasswordModal}
        PaperProps={{
          sx: { borderRadius: 3, p: 3, minWidth: 300, textAlign: "center" },
        }}
      >
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          {forgotSuccess ? (
            <Typography sx={{ color: "green", mb: 2 }}>
              {forgotSuccess}
            </Typography>
          ) : (
            <>
              <Typography sx={{ mb: 2 }}>
                Enter your email to receive a reset link.
              </Typography>
              <TextField
                label="Email"
                type="email"
                fullWidth
                variant="filled"
                value={forgotEmail}
                onChange={handleForgotEmailChange}
                sx={{ mb: 2 }}
              />
              {forgotError && (
                <Typography sx={{ color: "red", mb: 2 }}>
                  {forgotError}
                </Typography>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          {!forgotSuccess && (
            <Button
              onClick={handleForgotPasswordSubmit}
              disabled={forgotLoading}
              variant="contained"
              sx={{ py: 1, px: 4 }}
            >
              {forgotLoading ? "Sending..." : "Send"}
            </Button>
          )}
          <Button onClick={closeForgotPasswordModal} sx={{ py: 1, px: 4 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
