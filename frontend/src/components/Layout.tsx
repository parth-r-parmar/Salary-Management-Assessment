import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { Link as RouterLink, Outlet } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import AnalyticsIcon from '@mui/icons-material/Analytics';

export const Layout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <AppBar position="static" elevation={1} sx={{ bgcolor: '#0f172a' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 0.5 }}>
            ACME Payroll Management
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              color="inherit"
              component={RouterLink}
              to="/"
              startIcon={<PeopleIcon />}
              sx={{ textTransform: 'none', fontWeight: 500 }}
            >
              Employees
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/insights"
              startIcon={<AnalyticsIcon />}
              sx={{ textTransform: 'none', fontWeight: 500 }}
            >
              Insights
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ mt: 3, mb: 4, flex: 1 }}>
        <Outlet />
      </Container>
    </Box>
  );
};
