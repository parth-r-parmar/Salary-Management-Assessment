import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

export const InsightsPage: React.FC = () => {
  return (
    <Paper sx={{ p: 4, borderRadius: 2 }}>
      <Typography variant="h5" component="h1" gutterBottom fontWeight={600}>
        Organizational Compensation Insights
      </Typography>
      <Box sx={{ color: 'text.secondary', mt: 1 }}>
        Real-time statistical breakdown of organizational compensation across currencies, countries, and roles.
      </Box>
    </Paper>
  );
};
