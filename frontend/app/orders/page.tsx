import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';

// Dummy orders data (replace this with your actual data from API/store)
const orders = [
  {
    id: 'ORD12345',
    customer: 'John Doe',
    date: '2025-06-21',
    total: 149.99,
    status: 'Shipped',
  },
  {
    id: 'ORD12346',
    customer: 'Jane Smith',
    date: '2025-06-20',
    total: 89.49,
    status: 'Processing',
  },
  {
    id: 'ORD12347',
    customer: 'Bob Johnson',
    date: '2025-06-19',
    total: 199.99,
    status: 'Delivered',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Shipped':
      return 'primary';
    case 'Delivered':
      return 'success';
    case 'Processing':
      return 'warning';
    case 'Cancelled':
      return 'error';
    default:
      return 'default';
  }
};

const Orders: React.FC = () => {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="orders table">
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Total ($)</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                    variant="outlined"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Orders;
