// components/AdminSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Drawer,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Divider,
  styled,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CategoryIcon from '@mui/icons-material/Category';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PeopleIcon from '@mui/icons-material/People';
import ChatIcon from '@mui/icons-material/Chat';
import LogoutIcon from '@mui/icons-material/Logout';

const SIDEBAR_WIDTH = 260;

// تفريغ الأنماط للـ Drawer
const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: SIDEBAR_WIDTH,
    background: 'linear-gradient(180deg, #388e3c 0%, #2e7d32 100%)',
    color: '#fff',
    boxShadow: '4px 0 12px rgba(0,0,0,0.3)',
    padding: theme.spacing(2),
  },
}));

const StyledItem = styled(ListItemButton)(({ theme }) => ({
  margin: theme.spacing(0.5, 0),
  borderRadius: theme.shape.borderRadius * 1.5,
  transition: 'background .2s, transform .2s',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.1)',
    transform: 'translateX(4px)',
  },
  '&.active': {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderLeft: `4px solid #A5D6A7`,
  },
}));

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const menu = [
    { label: 'Home',      icon: <HomeIcon />,       href: '/home' },
    { label: 'Dashboard', icon: <DashboardIcon />,  href: '/admin' },
    { label: 'Products',  icon: <Inventory2Icon />, href: '/admin/product' },
    { label: 'Categories',icon: <CategoryIcon />,   href: '/admin/category' },
    { label: 'Delivery',  icon: <LocalShippingIcon />, href: '/admin/delivery' },
    { label: 'Users',     icon: <PeopleIcon />,      href: '/admin/users' },
    { label: 'Chat',      icon: <ChatIcon />,        href: '/admin/chat' },
  ];

  const handleLogout = () => {
    // مسح التوكن/كوكيز ثم إعادة توجيه
    router.replace('/');
  };

  return (
    <StyledDrawer
      anchor="left"
      open={open}
      onClose={onClose}
      variant="temporary"
      ModalProps={{ keepMounted: true }}
    >
      <Box textAlign="center" mb={2}>
        <Avatar
          sx={{
            width: 64,
            height: 64,
            mx: 'auto',
            mb: 1,
            bgcolor: '#AED581',
            color: '#2e7d32',
            fontSize: 24,
          }}
        >
          A
        </Avatar>
        <Typography
          variant="h5"
          sx={{
            color: '#E8F5E9',
            fontWeight: 'bold',
            letterSpacing: 1,
          }}
        >
          Avocado
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.3)', mb: 2 }} />

      <List sx={{ flexGrow: 1 }}>
        {menu.map(({ label, icon, href }) => (
          <StyledItem
            key={label}
            component={Link}
            href={href}
            className={pathname === href ? 'active' : ''}
          >
            <ListItemIcon sx={{ color: '#E8F5E9', minWidth: 40 }}>
              {icon}
            </ListItemIcon>
            <ListItemText
              primary={label}
              primaryTypographyProps={{ sx: { fontWeight: 500 } }}
            />
          </StyledItem>
        ))}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.3)', my: 1 }} />

      <StyledItem onClick={handleLogout}>
        <ListItemIcon sx={{ color: '#FFCDD2', minWidth: 40 }}>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText
          primary="Logout"
          primaryTypographyProps={{ sx: { fontWeight: 500 } }}
        />
      </StyledItem>
    </StyledDrawer>
  );
}
