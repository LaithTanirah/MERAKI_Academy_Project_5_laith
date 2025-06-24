'use client';

import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TikTokIcon from '@mui/icons-material/MusicNote'; 
import TwitterIcon from '@mui/icons-material/Twitter';

const socialLinks = [
  { label: 'Instagram', icon: <InstagramIcon />, href: '#' },
  { label: 'Facebook', icon: <FacebookIcon />, href: '#' },
  { label: 'YouTube', icon: <YouTubeIcon />, href: '#' },
  { label: 'TikTok', icon: <TikTokIcon />, href: '#' },
  { label: 'X (Twitter)', icon: <TwitterIcon />, href: '#' },
];

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#0f2f25',
        color: '#fff',
        mt: 10,
        pt: 8,
        pb: 5,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Gradient Top Border */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: 8,
          background: 'linear-gradient(to right, #174434, #1b4332)',
        }}
      />

      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* Logo + Team */}
          <Grid item xs={12} md={3}>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <img
                src="/images/logo.jpg"
                alt="Avocado Logo"
                width={40}
                height={40}
                style={{
                  objectFit: 'contain',
                  borderRadius: '6px',
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                }}
              />
              <Typography variant="h5" fontWeight="bold">
                Avocado
              </Typography>
            </Box>

            <Typography variant="subtitle1" fontWeight="bold" mb={2} sx={{ color: '#e0ffe0' }}>
              Meet the Team
            </Typography>
            <Box display="flex" gap={2}>
              {[
                { name: 'Mohammad', img: '/images/mohammad.jpg' },
                { name: 'Laith', img: '/images/laith.jpg' },
                { name: 'Hassan', img: '/founders/hassan.jpg' },
              ].map(({ name, img }, idx) => (
                <Box
                  key={idx}
                  textAlign="center"
                  sx={{
                    p: 1,
                    bgcolor: '#133a2d',
                    borderRadius: 2,
                    transition: 'background-color 0.3s',
                    '&:hover': { bgcolor: '#174434' },
                  }}
                >
                  <Avatar
                    alt={name}
                    src={img}
                    sx={{ width: 56, height: 56, mx: 'auto', mb: 0.5, boxShadow: 2 }}
                  />
                  <Typography variant="caption" sx={{ color: '#ccc', fontWeight: 500 }}>
                    {name}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Footer Links */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              {[
                {
                  title: 'Shop',
                  links: ['Products', 'Cart', 'Categories', 'Gift Cards', 'Accessories'],
                },
                {
                  title: 'Resources',
                  links: ['Blog', 'Buyer’s Guide', 'Training Tips', 'Gear Reviews', 'FAQs'],
                },
                {
                  title: 'Company',
                  links: ['About Avocado', 'Careers', 'Partnership', 'Privacy Policy', 'Terms of Service'],
                },
                {
                  title: 'Connect',
                  links: [], // social links handled separately
                },
              ].map(({ title, links }, i) => (
                <Grid item xs={6} sm={3} key={i}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    gutterBottom
                    sx={{ color: '#e0ffe0', fontSize: '1rem' }}
                  >
                    {title}
                  </Typography>
                  {links.map((text, idx) => (
                    <Link
                      key={idx}
                      href="#"
                      underline="none"
                      display="block"
                      sx={{
                        mb: 0.5,
                        fontSize: '0.9rem',
                        color: '#ccc',
                        '&:hover': { color: '#a4f3b2' },
                      }}
                    >
                      {text}
                    </Link>
                  ))}
                  {title === 'Connect' && (
                    <Box display="flex" mt={1}>
                      {socialLinks.map((social, idx) => (
                        <Tooltip key={idx} title={social.label}>
                          <IconButton
                            href={social.href}
                            sx={{
                              color: '#ccc',
                              '&:hover': { color: '#a4f3b2', bgcolor: 'rgba(164,243,178,0.1)' },
                            }}
                          >
                            {social.icon}
                          </IconButton>
                        </Tooltip>
                      ))}
                    </Box>
                  )}
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* About Section */}
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" fontWeight="bold" mb={2} sx={{ color: '#e0ffe0' }}>
              About Avocado
            </Typography>
            <Typography variant="body2" sx={{ color: '#ccc', lineHeight: 1.8, fontSize: '0.95rem' }}>
              Avocado is a modern e-commerce platform built with care, passion, and clean design. We
              believe in quality, support, and giving our customers the best experience.
            </Typography>
          </Grid>
        </Grid>

        {/* Divider + Bottom Note */}
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.15)', my: 4 }} />
        <Box textAlign="center">
          <Typography variant="body2" color="rgba(255,255,255,0.6)">
            Made with 🥑 by the Avocado Team —{' '}
            <Link href="#" underline="hover" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Privacy Policy
            </Link>{' '}
            |{' '}
            <Link href="#" underline="hover" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Terms of Service
            </Link>{' '}
            © 2025
          </Typography>
        </Box>
      </Container>
    </Box>
);
}
