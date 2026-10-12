import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

export const EmployeesPage: React.FC = () => {
  return (
    <Paper sx={{ p: 4, borderRadius: 2 }}>
      <Typography variant="h5" component="h1" gutterBottom fontWeight={600}>
        Employee Salary Directory
      </Typography>
      <Box sx={{ color: 'text.secondary', mt: 1 }}>
        Manage compensation, filter by department and country, and search across 10,000 employees.
      </Box>
    </Paper>
  );
};
