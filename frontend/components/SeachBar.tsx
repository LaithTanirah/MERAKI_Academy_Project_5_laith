"use client";

import React, { useState } from "react";
import {
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ flexGrow: 1, maxWidth: 400 }}>
      <OutlinedInput
        fullWidth
        placeholder="What can we help you find today?"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        endAdornment={
          <InputAdornment position="end">
            <IconButton type="submit" edge="end">
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        }
        sx={{
          bgcolor: "common.white",
          borderRadius: 2,
          "& .MuiOutlinedInput-notchedOutline": { border: 0 },
        }}
      />
    </form>
  );
}
