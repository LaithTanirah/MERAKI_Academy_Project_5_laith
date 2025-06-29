"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  ThemeProvider,
  createTheme,
  Paper,
  Stack,
  IconButton,
} from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: "'Roboto', sans-serif",
  },
});

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your API/email logic here
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(to bottom, #C8FACC, #5F7F67)",
          py: 8,
          px: 2,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={6}
            sx={{
              p: 4,
              borderRadius: 4,
              background: "linear-gradient(135deg,rgb(245, 247, 241),rgb(203, 212, 203))",
              color: "#1e3c32",
            }}
          >
            <Typography variant="h4" align="center" gutterBottom>
              Contact Us
            </Typography>
            <Typography
              variant="body1"
              align="center"
              sx={{
                mb: 4,
                color: "#37474f",
                textAlign: "justify",
                fontSize: "1.05rem",
                lineHeight: 1.6,
              }}
            >
              We'd love to hear from you! Whether you have a question, feedback,
              or just want to say hello — drop us a message below and our team
              will get back to you shortly.
            </Typography>

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  name="name"
                  label="Your Name"
                  variant="outlined"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <TextField
                  fullWidth
                  name="email"
                  label="Your Email"
                  type="email"
                  variant="outlined"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <TextField
                  fullWidth
                  name="message"
                  label="Your Message"
                  variant="outlined"
                  multiline
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    backgroundColor: "#4caf50",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#388e3c" },
                  }}
                >
                  Send Message
                </Button>
              </Stack>
            </form>

            {/* Social Media Icons */}
            <Box sx={{ mt: 5 }}>
              <Typography variant="subtitle1" align="center" gutterBottom>
                Follow us
              </Typography>
              <Stack direction="row" justifyContent="center" spacing={2}>
                <IconButton
                  component="a"
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  sx={{ color: "#1877f2" }}
                >
                  <i className="fab fa-facebook-f"></i>
                </IconButton>
                <IconButton
                  component="a"
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X"
                  sx={{ color: "#000" }}
                >
                  <i className="fab fa-x-twitter"></i>
                </IconButton>
                <IconButton
                  component="a"
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  sx={{ color: "#e4405f" }}
                >
                  <i className="fab fa-instagram"></i>
                </IconButton>
                <IconButton
                  component="a"
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  sx={{ color: "#333" }}
                >
                  <i className="fab fa-github"></i>
                </IconButton>
                <IconButton
                  component="a"
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  sx={{ color: "#0077b5" }}
                >
                  <i className="fab fa-linkedin-in"></i>
                </IconButton>
              </Stack>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
