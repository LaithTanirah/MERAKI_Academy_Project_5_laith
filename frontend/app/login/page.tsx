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
} from "@mui/material";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { useSearchParams } from "next/navigation";

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

  const searchParams = useSearchParams();


  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      showModal("Success", "Logged in with Google successfully!");

    }
  }, [searchParams]);

  const showModal = (title: string, message: string) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalOpen(true);
  };

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
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        loginForm
      );
      localStorage.setItem("token", data.token);
      showModal("Success", "Login successful!");
    } catch (err: any) {
      showModal("Error", err.response?.data?.message || "Login failed");
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", registerForm);
      showModal("Success", "Registration successful!");
      setShowRegister(false);
    } catch (err: any) {
      showModal("Error", err.response?.data?.message || "Registration failed");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage:
          "linear-gradient(rgba(110, 255, 134, 0.5), rgba(55, 68, 51, 0.5))",
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
              height: "100%",
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
                      backgroundColor: "#4caf5",
                      color: "#fff",
                      fontWeight: "bold",
                      px: 4,
                      py: 1,
                      fontSize: "1rem",
                      borderRadius: 2,
                      boxShadow: "4px 4px 10px rgba(0,0,0,0.2)",
                      "&:hover": {
                        backgroundColor: "#45a049",
                      },
                    }}
                  >
                    Login
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
                      type="password"
                      fullWidth
                      margin="normal"
                      variant="filled"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      sx={{ bgcolor: "#eee", borderRadius: 1 }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      sx={{
                        mt: 4,
                        py: 1.5,
                        fontWeight: "bold",
                        fontSize: "1rem",
                        backgroundColor: "#4caf50",
                        "&:hover": { backgroundColor: "#45a049" },
                        boxShadow: "4px 4px 10px rgba(0,0,0,0.2)",
                      }}
                    >
                      Login
                    </Button>

                    {/* Google Login Button */}
                    <Button
                      onClick={handleGoogleLogin}
                      fullWidth
                      variant="outlined"
                      sx={{
                        mt: 2,
                        py: 1.5,
                        fontWeight: "bold",
                        fontSize: "1rem",
                        color: "#4285F4",
                        borderColor: "#4285F4",
                        boxShadow: "2px 2px 8px rgba(0,0,0,0.1)",
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                          borderColor: "#4285F4",
                        },
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
                      Login with Google
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
                      sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                    />
                    <TextField
                      label="Last Name"
                      name="last_name"
                      fullWidth
                      margin="normal"
                      variant="filled"
                      value={registerForm.last_name}
                      onChange={handleRegisterChange}
                      sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                    />
                    <TextField
                      label="Email"
                      name="email"
                      fullWidth
                      margin="normal"
                      variant="filled"
                      value={registerForm.email}
                      onChange={handleRegisterChange}
                      sx={{ backgroundColor: "#fff", borderRadius: 1 }}
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
                      sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                    />
                    <TextField
                      label="Phone Number"
                      name="phone_number"
                      fullWidth
                      margin="normal"
                      variant="filled"
                      value={registerForm.phone_number}
                      onChange={handleRegisterChange}
                      sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      sx={{
                        mt: 4,
                        py: 1.5,
                        fontWeight: "bold",
                        fontSize: "1rem",
                        backgroundColor: "#ffffff",
                        color: "#4caf50",
                        "&:hover": { backgroundColor: "#e8f5e9" },
                        boxShadow: "4px 4px 10px rgba(0,0,0,0.2)",
                      }}
                    >
                      Register
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
                      backgroundColor: "#ffffff",
                      color: "#4caf50",
                      fontWeight: "bold",
                      px: 4,
                      py: 1,
                      fontSize: "1rem",
                      borderRadius: 2,
                      boxShadow: "4px 4px 10px rgba(0,0,0,0.2)",
                      "&:hover": {
                        backgroundColor: "#e8f5e9",
                      },
                    }}
                  >
                    Signup
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </Grid>
        </Grid>
      </Paper>

      <Dialog
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          if (modalTitle.toLowerCase().includes("success")) {
            // Optional redirect
            // window.location.href = "/dashboard";
          }
        }}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 3,
            minWidth: 300,
            textAlign: "center",
          },
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
                // Optional redirect
                // window.location.href = "/dashboard";
              }
            }}
            variant="contained"
            sx={{
              mt: 2,
              px: 4,
              py: 1,
              borderRadius: 2,
              backgroundColor: modalTitle.toLowerCase().includes("success")
                ? "green"
                : "red",
              color: "#fff",
              "&:hover": {
                backgroundColor: modalTitle.toLowerCase().includes("success")
                  ? "#2e7d32"
                  : "#c62828",
              },
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
