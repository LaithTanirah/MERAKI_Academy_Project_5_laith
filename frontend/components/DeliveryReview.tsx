// frontend/components/DeliveryReview.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Rating,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

interface Props {
  orderId: number;
}

interface Review {
  rating: number;
  comment?: string;
}

const DeliveryReview: React.FC<Props> = ({ orderId }) => {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const res = await axios.get<Review>(`/delivery-reviews/${orderId}`);
        if (res.status === 200 && res.data.rating != null && isMounted) {
          setRating(res.data.rating);
          setComment(res.data.comment || "");
          setSubmitted(true);
        }
      } catch (err: any) {
        if (err.response?.status !== 404) {
          console.error("Failed to fetch review:", err);
        }
      } finally {
        if (isMounted) setFetching(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  const handleSubmit = async () => {
    if (!rating) return;

    setLoading(true);
    try {
      await axios.post("/delivery-reviews", {
        order_id: orderId,
        rating,
        comment,
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting review:", err);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Box sx={{ mt: 2, textAlign: "center" }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (submitted) {
    return (
      <Paper
        sx={{
          p: 2,
          mt: 2,
          borderRadius: 2,
          backgroundColor: "#f5f5f5",
        }}
      >
        <Typography sx={{ mb: 1 }}>
          ✅ You rated this delivery:
        </Typography>
        <Rating value={rating} readOnly />
        {comment && (
          <Typography sx={{ mt: 1 }} color="text.secondary">
            "{comment}"
          </Typography>
        )}
      </Paper>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mt: 2,
        borderRadius: 2,
        backgroundColor: "#f5f5f5",
      }}
    >
      <Typography variant="subtitle1" gutterBottom>
        Rate your delivery
      </Typography>
      <Rating
        value={rating}
        onChange={(_, newValue) => setRating(newValue)}
        sx={{ mb: 1 }}
      />
      <Box>
        <textarea
          placeholder="Leave a comment (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          style={{
            width: "100%",
            borderRadius: 6,
            border: "1px solid #ccc",
            padding: 8,
            resize: "vertical",
          }}
        />
      </Box>
      <Button
        variant="contained"
        color="success"
        disabled={!rating || loading}
        onClick={handleSubmit}
        sx={{ mt: 1 }}
      >
        {loading ? "Submitting..." : "Submit"}
      </Button>
    </Paper>
  );
};

export default DeliveryReview;
