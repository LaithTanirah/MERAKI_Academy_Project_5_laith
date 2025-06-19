'use client';

import './globals.css';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import { usePathname } from 'next/navigation'; 
import Navbar from '../components/Navbar';

const theme = createTheme({
  palette: {
    primary:   { main: '#689F38' },
    secondary: { main: '#AED581' },
    background:{ default: '#F5F5F5' },
    text:      { primary: '#333' },
  },
  typography: { fontFamily: '"Roboto", sans-serif' },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNavbar = pathname === '/login';

  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {!hideNavbar && <Navbar />}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
