// components/SearchBar.tsx
'use client';

import React, { useState } from 'react';
import { OutlinedInput, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('search for', query);
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
          bgcolor: 'common.white',
          borderRadius: 2,
          '& .MuiOutlinedInput-notchedOutline': { border: 0 },
        }}
      />
    </form>
  );
}
