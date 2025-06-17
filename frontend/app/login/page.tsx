'use client';

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Box, Paper, Typography, TextField,
  Button, Drawer, List, ListItem, Avatar, Alert
} from '@mui/material'
import { loginUser, LoginData } from '../../services/auth'

const benefits = [
  'Faster checkout',
  'Order tracking',
  'Exclusive deals',
  'Save favorites',
]
const logos = [
  '/logos/company1.png',
  '/logos/company2.png',
  '/logos/company3.png',
  '/logos/company4.png',
]

export default function LoginPage() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<LoginData>({ email: '', password: '' })
  const [error, setError] = useState<string|null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const { token } = await loginUser(form)
      localStorage.setItem('token', token)
      router.push('/')
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        bgcolor: 'background.default', p: 2, position: 'relative',
      }}
    >
      {error && (
        <Alert
          severity="error"
          onClose={() => setError(null)}
          sx={{ position: 'absolute', top: 16, width: '100%', maxWidth: 360 }}
        >
          {error}
        </Alert>
      )}

      <Button
        variant="contained"
        color="secondary"
        onClick={() => setOpen(true)}
        sx={{
          position: 'fixed', top: '50%', right: 16,
          transform: 'translateY(-50%)', borderRadius: 2,
        }}
      >
        Benefits
      </Button>

      <Paper
        elevation={8}
        sx={{ p: 4, maxWidth: 360, width: '100%', textAlign: 'center', borderRadius: 3 }}
      >
        <Typography variant="h4" color="primary" gutterBottom>
          Avocado
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Sign in to your account
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            required
            value={form.email}
            onChange={handleChange}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            required
            value={form.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 3 }}
          >
            Sign In
          </Button>
        </Box>

        <Link href="/register" passHref style={{ textDecoration: 'none' }}>
          <Button sx={{ mt: 2, textTransform: 'none' }}>
            Don’t have an account? Register
          </Button>
        </Link>
      </Paper>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 280, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Benefits of registering
          </Typography>
          <List>
            {benefits.map(b => (
              <ListItem key={b} sx={{ pl: 0 }}>• {b}</ListItem>
            ))}
          </List>
          <Typography variant="subtitle1" sx={{ mt: 3 }} gutterBottom>
            Trusted by
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {logos.map(src => (
              <Avatar
                key={src}
                variant="square"
                src={src}
                sx={{ width: 56, height: 56, bgcolor: '#fff', borderRadius: 1 }}
              />
            ))}
          </Box>
        </Box>
      </Drawer>
    </Box>
  )
}
