"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Box,
  CardMedia,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Fade,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

import CategoryIcon from "@mui/icons-material/Category";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import Slider from "react-slick";

interface ProductDetailsProps {
  id: string;
  title: string;
  description: string;
  size: string[];
  price: number;
  category: string;
  images: string[];
}

interface TokenPayload {
  userId: string | number;
}

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetailsProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartId, setCartId] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        const parsedUserId = Number(decoded.userId);
        setUserId(!isNaN(parsedUserId) ? parsedUserId : null);
      } catch (err) {
        console.error("Invalid token:", err);
        setUserId(null);
      }
    }
  }, [token]);

  useEffect(() => {
    if (userId === null || !token) return;

    setLoading(true);
    axios
      .get<{ cart?: { id: number }[] }>(
        `http://localhost:5000/api/cart/getAllCartByIsDeletedFalse/${userId}`,
        { headers: { authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        const carts = res.data.cart ?? [];
        setCartId(carts.length > 0 ? carts[0].id : null);
        setError(null);
      })
      .catch((err) => {
        setError(
          axios.isAxiosError(err) ? err.message : "Error fetching cart."
        );
      })
      .finally(() => setLoading(false));
  }, [userId, token]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get<ProductDetailsProps>(`http://localhost:5000/api/products/${id}`)
      .then((response) => {
        setProduct(response.data);
        if (response.data.size.length > 0) {
          setSelectedSize(response.data.size[0]);
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to load product");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress size={48} />
      </Box>
    );

  if (error) return <Typography color="error">Error: {error}</Typography>;

  if (!product) return <Typography>No product found.</Typography>;

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    adaptiveHeight: true,
    fade: true,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  const handleAddToCart = async () => {
    try {
      const productId = product?.id;

      const response = await axios.post(
        "http://localhost:5000/api/cartProduct",
        {
          cartId,
          productId,
        }
      );

      if (response.data.success) {
        setModalTitle("Success");
        setModalMessage("Product added to cart successfully!");
      } else {
        setModalTitle("Error");
        setModalMessage("Something went wrong while adding to cart.");
      }
    } catch (error) {
      setModalTitle("Error");
      setModalMessage("Failed to add product to cart.");
    } finally {
      setModalOpen(true);
    }
  };

  const handleAddToFavorites = () => {
    setModalTitle("Success");
    setModalMessage(`"${product?.title}" has been added to favorites! ❤️`);
    setModalOpen(true);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #c8facc, #5f7f67)",
        py: 6,
        px: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <Fade in timeout={600}>
        <Card
          sx={{
            maxWidth: 900,
            width: "100%",
            p: 3,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            boxShadow: 6,
            borderRadius: 3,
            bgcolor: "background.paper",
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", md: 450 },
              mr: { md: 3 },
              mb: { xs: 3, md: 0 },
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: 3,
              bgcolor: "grey.100",
            }}
          >
            <Slider {...settings}>
              {product.images.length > 0 ? (
                product.images.map((img, idx) => (
                  <CardMedia
                    key={idx}
                    component="img"
                    image={`/images/${img}`}
                    alt={`${product.title} image ${idx + 1}`}
                    sx={{
                      width: "100%",
                      height: { xs: 350, md: 450 },
                      objectFit: "cover",
                    }}
                  />
                ))
              ) : (
                <CardMedia
                  component="img"
                  image="/images/avocado-juice.jpg"
                  alt="Default product image"
                  sx={{
                    width: "100%",
                    height: { xs: 350, md: 450 },
                    objectFit: "cover",
                  }}
                />
              )}
            </Slider>
          </Box>

          <CardContent
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              px: { xs: 0, md: 2 },
            }}
          >
            <Box>
              <Typography
                variant="h3"
                component="h1"
                fontWeight="bold"
                gutterBottom
                sx={{ letterSpacing: 1 }}
              >
                {product.title}
              </Typography>

              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                mb={1}
                color="text.secondary"
              >
                <CategoryIcon fontSize="small" />
                <Typography variant="subtitle1">{product.category}</Typography>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body1" color="text.primary" paragraph>
                {product.description}
              </Typography>

              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                color="primary.main"
                mb={2}
              >
                <PriceCheckIcon fontSize="medium" />
                <Typography variant="h4" fontWeight="bold">
                  {product.price.toFixed(2)} JOD
                </Typography>
              </Stack>

              <FormControl sx={{ maxWidth: 160 }}>
                <InputLabel id="size-select-label">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <FormatSizeIcon fontSize="small" />
                    <span>Size</span>
                  </Stack>
                </InputLabel>
                <Select
                  labelId="size-select-label"
                  id="size-select"
                  value={selectedSize}
                  label={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <FormatSizeIcon fontSize="small" />
                      <span>Size</span>
                    </Stack>
                  }
                  onChange={(e) => setSelectedSize(e.target.value)}
                >
                  {product.size.map((sizeOption) => (
                    <MenuItem key={sizeOption} value={sizeOption}>
                      {sizeOption}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              mt={4}
              justifyContent={{ xs: "center", md: "flex-start" }}
            >
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<AddShoppingCartIcon />}
                onClick={handleAddToCart}
                sx={{
                  borderRadius: 2,
                  fontWeight: "bold",
                  textTransform: "none",
                  boxShadow: 4,
                  "&:hover": {
                    bgcolor: "primary.dark",
                    boxShadow: 6,
                  },
                  px: 5,
                  py: 1.5,
                }}
              >
                Add to Cart
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                size="large"
                startIcon={<FavoriteBorderIcon />}
                sx={{
                  borderRadius: 2,
                  fontWeight: "bold",
                  textTransform: "none",
                  borderWidth: 2,
                  "&:hover": {
                    bgcolor: "secondary.light",
                    borderColor: "secondary.dark",
                  },
                  px: 5,
                  py: 1.5,
                }}
                onClick={handleAddToFavorites}
              >
                Add to Favorites
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Fade>
      <Dialog
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          if (modalTitle.toLowerCase().includes("success")) {
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
};

export default ProductDetailsPage;
